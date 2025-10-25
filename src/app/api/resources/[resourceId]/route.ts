import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma";
import {
	ResourceAuditAction,
	ResourceNodeType,
	ResourceStatus,
} from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { canManageUniversityResources } from "@/lib/rbac";
import {
	RESOURCE_INCLUDE,
	REVIEWABLE_STATUSES,
	getAuthUser,
	normalizeStringArray,
} from "../shared";

type RouteParams = { params: { resourceId: string } };

const REVIEWABLE_SET = new Set<ResourceStatus>(REVIEWABLE_STATUSES);

function isReviewable(status: ResourceStatus): boolean {
	return REVIEWABLE_SET.has(status);
}

function ensureMetadataPayload(body: any, allowReviewNote: boolean) {
	const updates: Prisma.ResourceUpdateInput = {};
	let hasChanges = false;

	if (typeof body?.description === "string") {
		updates.description = body.description;
		hasChanges = true;
	}

	if (Array.isArray(body?.tags)) {
		updates.tags = normalizeStringArray(body.tags);
		hasChanges = true;
	}

	if (Array.isArray(body?.categories)) {
		updates.categories = normalizeStringArray(body.categories);
		hasChanges = true;
	}

	if (Object.prototype.hasOwnProperty.call(body, "externalUrl")) {
		if (body.externalUrl === null) {
			updates.externalUrl = null;
			hasChanges = true;
		} else if (typeof body.externalUrl === "string") {
			updates.externalUrl = body.externalUrl;
			hasChanges = true;
		}
	}

	if (Object.prototype.hasOwnProperty.call(body, "previewUrl")) {
		if (body.previewUrl === null) {
			updates.previewUrl = null;
			hasChanges = true;
		} else if (typeof body.previewUrl === "string") {
			updates.previewUrl = body.previewUrl;
			hasChanges = true;
		}
	}

	if (allowReviewNote && Object.prototype.hasOwnProperty.call(body, "reviewNote")) {
		if (body.reviewNote === null) {
			updates.reviewNote = null;
			hasChanges = true;
		} else if (typeof body.reviewNote === "string") {
			updates.reviewNote = body.reviewNote;
			hasChanges = true;
		}
	}

	return { updates, hasChanges };
}

function ensureFileMetadataPayload(body: any) {
	const updates: Prisma.ResourceUpdateInput = {};
	let hasChanges = false;

	if (Object.prototype.hasOwnProperty.call(body, "fileName")) {
		if (body.fileName === null) {
			updates.fileName = null;
			hasChanges = true;
		} else if (typeof body.fileName === "string") {
			updates.fileName = body.fileName;
			hasChanges = true;
		}
	}

	if (Object.prototype.hasOwnProperty.call(body, "fileSize")) {
		if (body.fileSize === null) {
			updates.fileSize = null;
			hasChanges = true;
		} else if (Number.isFinite(body.fileSize)) {
			updates.fileSize = Number(body.fileSize);
			hasChanges = true;
		}
	}

	if (Object.prototype.hasOwnProperty.call(body, "mimeType")) {
		if (body.mimeType === null) {
			updates.mimeType = null;
			hasChanges = true;
		} else if (typeof body.mimeType === "string") {
			updates.mimeType = body.mimeType;
			hasChanges = true;
		}
	}

	if (Object.prototype.hasOwnProperty.call(body, "downloadUrl")) {
		if (body.downloadUrl === null) {
			updates.downloadUrl = null;
			hasChanges = true;
		} else if (typeof body.downloadUrl === "string") {
			updates.downloadUrl = body.downloadUrl;
			hasChanges = true;
		}
	}

	if (Object.prototype.hasOwnProperty.call(body, "storageKey")) {
		if (body.storageKey === null) {
			updates.storageKey = null;
			hasChanges = true;
		} else if (typeof body.storageKey === "string") {
			updates.storageKey = body.storageKey;
			hasChanges = true;
		}
	}

	return { updates, hasChanges };
}

export async function GET(req: Request, { params }: RouteParams) {
	try {
		const resource = await prisma.resource.findUnique({
			where: { id: params.resourceId },
			include: RESOURCE_INCLUDE,
		});
		if (!resource) {
			return NextResponse.json({ error: "Resource not found" }, { status: 404 });
		}

		const user = await getAuthUser(req.headers);
		const isApprovedAndVisible = resource.status === ResourceStatus.APPROVED && !resource.isArchived;

		if (isApprovedAndVisible) {
			return NextResponse.json(resource, { status: 200 });
		}

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const isModerator = canManageUniversityResources(user, resource.universityId);
		const isOwner = resource.submittedById === user.id;

		if (resource.isArchived || resource.status === ResourceStatus.ARCHIVED) {
			if (!isModerator) {
				return NextResponse.json({ error: "Archived resource requires reviewer access" }, { status: 403 });
			}
		} else if (isReviewable(resource.status)) {
			if (!isModerator && !isOwner) {
				return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
			}
		} else if (resource.status !== ResourceStatus.APPROVED) {
			if (!isModerator) {
				return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
			}
		}

		return NextResponse.json(resource, { status: 200 });
	} catch (error) {
		console.error("Resource detail GET failed", error);
		return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
	}
}

export async function PATCH(req: Request, { params }: RouteParams) {
	try {
		const user = await getAuthUser(req.headers);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const resource = await prisma.resource.findUnique({
			where: { id: params.resourceId },
			include: RESOURCE_INCLUDE,
		});
		if (!resource) {
			return NextResponse.json({ error: "Resource not found" }, { status: 404 });
		}

		const body = await req.json();
		const action = typeof body?.action === "string" ? body.action.toLowerCase() : null;
		const note = typeof body?.reviewNote === "string" ? body.reviewNote.trim() : null;

		const isModerator = canManageUniversityResources(user, resource.universityId);
		const isOwner = resource.submittedById === user.id;

		if (action) {
			const now = new Date();
			switch (action) {
				case "approve": {
					if (!isModerator) {
						return NextResponse.json({ error: "Forbidden" }, { status: 403 });
					}
					if (resource.status === ResourceStatus.APPROVED && !resource.isArchived) {
						return NextResponse.json(resource, { status: 200 });
					}
					const updated = await prisma.$transaction(async (tx) => {
						const result = await tx.resource.update({
							where: { id: resource.id },
							data: {
								status: ResourceStatus.APPROVED,
								approvedById: user.id,
								approvedAt: now,
								reviewNote: note ?? resource.reviewNote,
								publishedAt: now,
								isArchived: false,
								archivedAt: null,
							},
							include: RESOURCE_INCLUDE,
						});
						await tx.resourceAudit.create({
							data: {
								resourceId: result.id,
								actorId: user.id,
								action: ResourceAuditAction.APPROVED,
								notes: note,
							},
						});
						return result;
					});
					return NextResponse.json(updated, { status: 200 });
				}
				case "reject": {
					if (!isModerator) {
						return NextResponse.json({ error: "Forbidden" }, { status: 403 });
					}
					if (resource.status !== ResourceStatus.PENDING) {
						return NextResponse.json({ error: "Only pending resources can be rejected" }, { status: 400 });
					}
					if (!note) {
						return NextResponse.json({ error: "reviewNote is required" }, { status: 400 });
					}
					const updated = await prisma.$transaction(async (tx) => {
						const result = await tx.resource.update({
							where: { id: resource.id },
							data: {
								status: ResourceStatus.REJECTED,
								reviewNote: note,
								approvedById: null,
								approvedAt: null,
								publishedAt: null,
								isArchived: false,
								archivedAt: null,
							},
							include: RESOURCE_INCLUDE,
						});
						await tx.resourceAudit.create({
							data: {
								resourceId: result.id,
								actorId: user.id,
								action: ResourceAuditAction.REJECTED,
								notes: note,
							},
						});
						return result;
					});
					return NextResponse.json(updated, { status: 200 });
				}
				case "archive": {
					if (!isModerator) {
						return NextResponse.json({ error: "Forbidden" }, { status: 403 });
					}
					if (resource.isArchived || resource.status === ResourceStatus.ARCHIVED) {
						return NextResponse.json(resource, { status: 200 });
					}
					const updated = await prisma.$transaction(async (tx) => {
						const result = await tx.resource.update({
							where: { id: resource.id },
							data: {
								status: ResourceStatus.ARCHIVED,
								reviewNote: note ?? resource.reviewNote,
								archivedAt: now,
								isArchived: true,
							},
							include: RESOURCE_INCLUDE,
						});
						await tx.resourceAudit.create({
							data: {
								resourceId: result.id,
								actorId: user.id,
								action: ResourceAuditAction.ARCHIVED,
								notes: note,
							},
						});
						return result;
					});
					return NextResponse.json(updated, { status: 200 });
				}
				case "restore": {
					if (!isModerator) {
						return NextResponse.json({ error: "Forbidden" }, { status: 403 });
					}
					if (!resource.isArchived && resource.status !== ResourceStatus.ARCHIVED) {
						return NextResponse.json({ error: "Resource is not archived" }, { status: 400 });
					}
					const updated = await prisma.$transaction(async (tx) => {
						const result = await tx.resource.update({
							where: { id: resource.id },
							data: {
								status: ResourceStatus.APPROVED,
								approvedById: user.id,
								approvedAt: now,
								publishedAt: resource.publishedAt ?? now,
								isArchived: false,
								archivedAt: null,
							},
							include: RESOURCE_INCLUDE,
						});
						await tx.resourceAudit.create({
							data: {
								resourceId: result.id,
								actorId: user.id,
								action: ResourceAuditAction.RESTORED,
								notes: note,
							},
						});
						return result;
					});
					return NextResponse.json(updated, { status: 200 });
				}
				case "resubmit": {
					if (!isOwner) {
						return NextResponse.json({ error: "Only the submitter can resubmit" }, { status: 403 });
					}
					if (resource.status !== ResourceStatus.REJECTED) {
						return NextResponse.json({ error: "Only rejected resources can be resubmitted" }, { status: 400 });
					}
					const updated = await prisma.$transaction(async (tx) => {
						const result = await tx.resource.update({
							where: { id: resource.id },
							data: {
								status: ResourceStatus.PENDING,
								reviewNote: note ?? null,
								approvedById: null,
								approvedAt: null,
								publishedAt: null,
								isArchived: false,
								archivedAt: null,
							},
							include: RESOURCE_INCLUDE,
						});
						await tx.resourceAudit.create({
							data: {
								resourceId: result.id,
								actorId: user.id,
								action: ResourceAuditAction.SUBMITTED,
								notes: note,
							},
						});
						return result;
					});
					return NextResponse.json(updated, { status: 200 });
				}
				default:
					return NextResponse.json({ error: "Unknown action" }, { status: 400 });
			}
		}

		if (resource.isArchived) {
			return NextResponse.json({ error: "Archived resources cannot be edited" }, { status: 403 });
		}

		if (!isModerator) {
			if (!isOwner) {
				return NextResponse.json({ error: "Forbidden" }, { status: 403 });
			}
			if (!isReviewable(resource.status)) {
				return NextResponse.json({ error: "Resource cannot be edited in its current status" }, { status: 403 });
			}
		}

		const { updates: metaUpdates, hasChanges: metaChanged } = ensureMetadataPayload(body, isModerator);
		const updatePayload: Prisma.ResourceUpdateInput = { ...metaUpdates };
		let changed = metaChanged;

		if (resource.nodeType === ResourceNodeType.FILE) {
			const { updates: fileUpdates, hasChanges } = ensureFileMetadataPayload(body);
			Object.assign(updatePayload, fileUpdates);
			changed = changed || hasChanges;
		}

		if (!changed) {
			return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
		}

		const updated = await prisma.resource.update({
			where: { id: resource.id },
			data: updatePayload,
			include: RESOURCE_INCLUDE,
		});

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("Resource update failed", error);
		return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
	}
}
