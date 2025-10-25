import type { User, UniversityMembership } from "@/generated/prisma";
import { Role, UniversityRole } from "@/generated/prisma";

export type UserWithMemberships = User & {
	universityMemberships: UniversityMembership[];
};

export function isGlobalAdmin(user: Pick<User, "role"> | { role: Role }): boolean {
	return user.role === Role.ADMIN;
}

export function getMembershipForUniversity(
	user: UserWithMemberships,
	universityId: string | null | undefined,
): UniversityMembership | undefined {
	if (!universityId) return undefined;
	return user.universityMemberships.find((membership) => membership.universityId === universityId);
}

export function canManageUniversityResources(
	user: UserWithMemberships,
	universityId: string | null | undefined,
): boolean {
	if (isGlobalAdmin(user)) return true;
	const membership = getMembershipForUniversity(user, universityId);
	return membership?.role === UniversityRole.ADMIN;
}

export function canUploadToUniversity(
	user: UserWithMemberships,
	universityId: string | null | undefined,
): boolean {
	if (isGlobalAdmin(user)) return true;
	const membership = getMembershipForUniversity(user, universityId);
	return (
		membership?.role === UniversityRole.ADMIN ||
		membership?.role === UniversityRole.CONTRIBUTOR
	);
}

export function canViewPendingForUniversity(
	user: UserWithMemberships,
	universityId: string | null | undefined,
): boolean {
	return canManageUniversityResources(user, universityId);
}
