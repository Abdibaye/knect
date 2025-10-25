import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma";
import {
  ResourceAuditAction,
  ResourceFolderKind,
  ResourceMediaType,
  ResourceNodeType,
  ResourceStatus,
} from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { canManageUniversityResources, canUploadToUniversity, isGlobalAdmin } from "@/lib/rbac";
import {
  ALL_STATUSES,
  generateUniqueSlug,
  getAuthUser,
  normalizeStringArray,
  parseStatusesParam,
  RESOURCE_INCLUDE,
  REVIEWABLE_STATUSES,
  slugify,
} from "./shared";

// POST /api/resources
export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req.headers);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      nodeType: rawNodeType,
      folderKind,
      parentId,
      universityId: explicitUniversityId,
      mediaType,
      fileName,
      fileSize,
      mimeType,
      storageKey,
      downloadUrl,
      externalUrl,
      previewUrl,
      tags,
      categories,
      reviewNote,
      status: requestedStatus,
    } = body ?? {};

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const nodeType = (rawNodeType ?? ResourceNodeType.FILE) as ResourceNodeType;
    const validNodeTypes = Object.values(ResourceNodeType) as ResourceNodeType[];
    if (!validNodeTypes.includes(nodeType)) {
      return NextResponse.json({ error: "Invalid nodeType" }, { status: 400 });
    }

    if (nodeType === ResourceNodeType.FILE && !parentId) {
      return NextResponse.json(
        { error: "Files must specify a parent folder" },
        { status: 400 },
      );
    }

    if (nodeType === ResourceNodeType.FOLDER) {
      const validFolderKinds = Object.values(ResourceFolderKind) as ResourceFolderKind[];
      if (!folderKind || !validFolderKinds.includes(folderKind)) {
        return NextResponse.json({ error: "Invalid folderKind" }, { status: 400 });
      }
    }

    const parent = parentId
      ? await prisma.resource.findUnique({
        select: {
          id: true,
          nodeType: true,
          canonicalPath: true,
          depth: true,
          universityId: true,
          isArchived: true,
        },
        where: { id: parentId },
      })
      : null;

    if (parentId && !parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    if (parent && parent.nodeType !== ResourceNodeType.FOLDER) {
      return NextResponse.json({ error: "Parent must be a folder" }, { status: 400 });
    }

    const targetUniversityId = parent?.universityId ?? (typeof explicitUniversityId === "string" ? explicitUniversityId : null);
    if (!targetUniversityId) {
      return NextResponse.json({ error: "universityId is required" }, { status: 400 });
    }

    const canUpload = canUploadToUniversity(user, targetUniversityId);
    if (!canUpload) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (nodeType === ResourceNodeType.FOLDER && !canManageUniversityResources(user, targetUniversityId)) {
      return NextResponse.json({ error: "Insufficient permissions for folder creation" }, { status: 403 });
    }

    const requestedStatusValue = requestedStatus as ResourceStatus | undefined;
    if (requestedStatusValue && !ALL_STATUSES.includes(requestedStatusValue)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const isModerator = canManageUniversityResources(user, targetUniversityId);
    let status: ResourceStatus = ResourceStatus.PENDING;
    if (requestedStatusValue) {
      if (!isModerator && requestedStatusValue !== ResourceStatus.PENDING) {
        return NextResponse.json(
          { error: "Only reviewers can set a custom status" },
          { status: 403 },
        );
      }
      status = requestedStatusValue;
    } else if (nodeType === ResourceNodeType.FOLDER && isModerator) {
      status = ResourceStatus.APPROVED;
    }

    const now = new Date();
    const baseSlug = slugify(name);
    const slug = await generateUniqueSlug(baseSlug, parent?.id ?? null);

    let canonicalPath: string;
    let depth = 0;
    if (parent) {
      canonicalPath = `${parent.canonicalPath}/${slug}`;
      depth = parent.depth + 1;
    } else {
      const university = await prisma.university.findUnique({
        select: { slug: true },
        where: { id: targetUniversityId },
      });
      if (!university) {
        return NextResponse.json({ error: "University not found" }, { status: 404 });
      }
      canonicalPath = nodeType === ResourceNodeType.FOLDER ? `/universities/${university.slug}` : `/universities/${university.slug}/${slug}`;
    }

    const siblingWhere: Prisma.ResourceWhereInput = parent
      ? { parentId: parent.id }
      : { parentId: null, universityId: targetUniversityId };
    const sortOrder = await prisma.resource.count({ where: siblingWhere });

    const normalizedTags = normalizeStringArray(tags);
    const normalizedCategories = normalizeStringArray(categories);
    const isFile = nodeType === ResourceNodeType.FILE;

    if (isFile) {
      if (mediaType) {
        const validMediaTypes = Object.values(ResourceMediaType) as ResourceMediaType[];
        if (!validMediaTypes.includes(mediaType)) {
          return NextResponse.json({ error: "Invalid mediaType" }, { status: 400 });
        }
      }
      if (!downloadUrl && !externalUrl && !storageKey) {
        return NextResponse.json(
          { error: "File uploads must include downloadUrl, storageKey, or externalUrl" },
          { status: 400 },
        );
      }
    }

    const auditNotes: string | null = typeof reviewNote === "string" ? reviewNote : null;
    const approvedMetadata = status === ResourceStatus.APPROVED
      ? { approvedById: user.id, approvedAt: now, publishedAt: now }
      : {};

    const created = await prisma.$transaction(async (tx) => {
      const resource = await tx.resource.create({
        data: {
          name: name.trim(),
          slug,
          nodeType,
          folderKind: nodeType === ResourceNodeType.FOLDER ? folderKind : null,
          mediaType: isFile ? mediaType ?? null : null,
          parentId: parent?.id ?? null,
          depth,
          sortOrder,
          canonicalPath,
          description: typeof description === "string" ? description : null,
          tags: normalizedTags,
          categories: normalizedCategories,
          fileName: isFile && typeof fileName === "string" ? fileName : null,
          fileSize: isFile && Number.isFinite(fileSize) ? Number(fileSize) : null,
          mimeType: isFile && typeof mimeType === "string" ? mimeType : null,
          storageKey: isFile && typeof storageKey === "string" ? storageKey : null,
          downloadUrl: isFile && typeof downloadUrl === "string" ? downloadUrl : null,
          externalUrl: typeof externalUrl === "string" ? externalUrl : null,
          previewUrl: typeof previewUrl === "string" ? previewUrl : null,
          status,
          reviewNote: auditNotes,
          submittedById: user.id,
          uploadedById: user.id,
          universityId: targetUniversityId,
          isArchived: status === ResourceStatus.ARCHIVED,
          archivedAt: status === ResourceStatus.ARCHIVED ? now : null,
          ...approvedMetadata,
        },
        include: RESOURCE_INCLUDE,
      });

      const audits: Array<{
        resourceId: string;
        actorId: string;
        action: ResourceAuditAction;
        notes: string | null;
      }> = [
        {
          resourceId: resource.id,
          actorId: user.id,
          action: ResourceAuditAction.SUBMITTED,
          notes: auditNotes,
        },
      ];
      if (status === ResourceStatus.APPROVED) {
        audits.push({
          resourceId: resource.id,
          actorId: user.id,
          action: ResourceAuditAction.APPROVED,
          notes: auditNotes,
        });
      } else if (status === ResourceStatus.REJECTED) {
        audits.push({
          resourceId: resource.id,
          actorId: user.id,
          action: ResourceAuditAction.REJECTED,
          notes: auditNotes,
        });
      } else if (status === ResourceStatus.ARCHIVED) {
        audits.push({
          resourceId: resource.id,
          actorId: user.id,
          action: ResourceAuditAction.ARCHIVED,
          notes: auditNotes,
        });
      }

      await tx.resourceAudit.createMany({ data: audits });
      return resource;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Resource POST failed", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}

// GET /api/resources
export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req.headers);
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const parentIdParam = searchParams.get("parentId");
    const universityId = searchParams.get("universityId");
    const includeArchived = searchParams.get("includeArchived") === "true";
    const statusesParam = parseStatusesParam(searchParams.get("statuses"));

    const where: Prisma.ResourceWhereInput = {};
    if (parentIdParam !== null) {
      where.parentId = parentIdParam === "null" ? null : parentIdParam;
    }
    if (universityId) {
      where.universityId = universityId;
    }
    if (!includeArchived) {
      where.isArchived = false;
    }

    const requestedStatuses = statusesParam ?? undefined;
    if (!user) {
      if (requestedStatuses && requestedStatuses.some((status) => status !== ResourceStatus.APPROVED)) {
        return NextResponse.json({ error: "Unauthorized status filter" }, { status: 403 });
      }
      where.status = ResourceStatus.APPROVED;
    } else {
      const isModerator = universityId
        ? canManageUniversityResources(user, universityId)
        : isGlobalAdmin(user);
      if (isModerator) {
        if (requestedStatuses && requestedStatuses.length) {
          where.status = requestedStatuses.length === 1 ? requestedStatuses[0] : { in: requestedStatuses };
        }
      } else {
        const allowed = new Set<ResourceStatus>([ResourceStatus.APPROVED, ...REVIEWABLE_STATUSES]);
        if (requestedStatuses) {
          for (const status of requestedStatuses) {
            if (!allowed.has(status)) {
              return NextResponse.json({ error: "Unauthorized status filter" }, { status: 403 });
            }
          }
        }

        const ownStatusFilter = requestedStatuses
          ?.filter((status) => status !== ResourceStatus.APPROVED)
          .filter((status) => REVIEWABLE_STATUSES.includes(status));
        const includeApproved = !requestedStatuses || requestedStatuses.includes(ResourceStatus.APPROVED);

        const orClauses: Prisma.ResourceWhereInput[] = [];
        if (includeApproved) {
          orClauses.push({ status: ResourceStatus.APPROVED });
        }
        const ownStatuses = ownStatusFilter?.length ? ownStatusFilter : REVIEWABLE_STATUSES;
        orClauses.push({
          submittedById: user.id,
          status: { in: ownStatuses },
        });
        where.OR = orClauses;
      }
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: [{ depth: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: RESOURCE_INCLUDE,
    });

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("Resource GET failed", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}