import type { Prisma } from "@/generated/prisma";
import { ResourceStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { UserWithMemberships } from "@/lib/rbac";

export const RESOURCE_INCLUDE = {
	submittedBy: { select: { id: true, name: true } },
	approvedBy: { select: { id: true, name: true } },
} as const;

export const ALL_STATUSES = Object.values(ResourceStatus) as ResourceStatus[];
export const REVIEWABLE_STATUSES: ResourceStatus[] = [
	ResourceStatus.PENDING,
	ResourceStatus.REJECTED,
];

export async function getAuthUser(headers: Headers): Promise<UserWithMemberships | null> {
	const session = await auth.api.getSession({ headers });
	const userId = session?.session?.userId;
	if (!userId) return null;
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { universityMemberships: true },
	});
	return user ?? null;
}

export function normalizeStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.map((item) => `${item}`.trim())
		.filter((item) => item.length > 0)
		.slice(0, 50);
}

export function slugify(input: string): string {
	return (
		input
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/-{2,}/g, "-")
			.replace(/^-+|-+$/g, "") || "resource"
	);
}

export async function generateUniqueSlug(base: string, parentId: string | null) {
	let attempt = 0;
	let current = base;
	while (attempt < 50) {
		const existing = await prisma.resource.findFirst({
			where: { parentId: parentId ?? null, slug: current },
			select: { id: true },
		});
		if (!existing) return current;
		attempt += 1;
		current = `${base}-${attempt}`;
	}
	return `${base}-${Date.now()}`;
}

export function parseStatusesParam(param: string | null | undefined): ResourceStatus[] | null {
	if (!param) return null;
	const raw = param
		.split(",")
		.map((part) => part.trim().toUpperCase())
		.filter(Boolean);
	if (!raw.length) return null;
	const statuses: ResourceStatus[] = [];
	for (const value of raw) {
		const match = ALL_STATUSES.find((status) => status === value);
		if (match) statuses.push(match);
	}
	return statuses.length ? statuses : null;
}
