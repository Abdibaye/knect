import {
	PrismaClient,
	ResourceAuditAction,
	ResourceFolderKind,
	ResourceMediaType,
	ResourceNodeType,
	ResourceStatus,
	Role,
	UniversityRole,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

async function resetDatabase() {
	await prisma.resourceAudit.deleteMany();
	await prisma.resource.deleteMany();
	await prisma.universityMembership.deleteMany();
	await prisma.university.deleteMany();
	await prisma.notification.deleteMany();
	await prisma.comment.deleteMany();
	await prisma.like.deleteMany();
	await prisma.post.deleteMany();
	await prisma.opportunity.deleteMany();
	await prisma.session.deleteMany();
	await prisma.account.deleteMany();
	await prisma.user.deleteMany();
}

async function main() {
	console.log("🔄 Resetting database...");
	await resetDatabase();

	console.log("🌱 Seeding base users...");
	const now = new Date();

	const globalAdmin = await prisma.user.create({
		data: {
			id: "user-global-admin",
			name: "Global Admin",
			email: "global.admin@knect.local",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
			bio: "Platform operator",
			location: "HQ",
			username: "globaladmin",
			department: null,
			publications: [],
			researchFocus: null,
			skills: [],
			university: null,
			yearOfStudy: null,
			role: Role.ADMIN,
		},
	});

	const aauAdmin = await prisma.user.create({
		data: {
			id: "user-aau-admin",
			name: "AAU Admin",
			email: "admin@aau.edu",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
			bio: "University administrator",
			location: "Addis Ababa",
			username: "aauadmin",
			department: "Administration",
			publications: [],
			researchFocus: null,
			skills: ["Governance"],
			university: "Addis Ababa University",
			yearOfStudy: null,
			role: Role.ADMIN,
		},
	});

	const astuAdmin = await prisma.user.create({
		data: {
			id: "user-astu-admin",
			name: "ASTU Admin",
			email: "admin@astu.edu",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
			bio: "Faculty coordinator",
			location: "Adama",
			username: "astuadmin",
			department: "Administration",
			publications: [],
			researchFocus: null,
			skills: ["Operations"],
			university: "Adama Science and Technology University",
			yearOfStudy: null,
			role: Role.ADMIN,
		},
	});

	const contributor = await prisma.user.create({
		data: {
			id: "user-aau-student",
			name: "Sara Bekele",
			email: "sara.bekele@students.aau.edu",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
			bio: "Electrical engineering student",
			location: "Addis Ababa",
			username: "sarab",
			department: "Electrical Engineering",
			publications: [],
			researchFocus: "Power systems",
			skills: ["Matlab", "Circuit Design"],
			university: "Addis Ababa University",
			yearOfStudy: "3",
			role: Role.STUDENT,
		},
	});

	console.log("🏛️ Creating universities...");

	const aau = await prisma.university.create({
		data: {
			id: "uni-aau",
			name: "Addis Ababa University",
			slug: "addis-ababa-university",
			logoUrl: "https://cdn.example.com/logos/aau.svg",
			metadata: {
				city: "Addis Ababa",
				founded: 1950,
			},
		},
	});

	const astu = await prisma.university.create({
		data: {
			id: "uni-astu",
			name: "Adama Science & Technology University",
			slug: "adama-science-and-technology-university",
			logoUrl: "https://cdn.example.com/logos/astu.svg",
			metadata: {
				city: "Adama",
				founded: 1993,
			},
		},
	});

	console.log("👥 Setting up memberships...");

	await prisma.universityMembership.createMany({
		data: [
			{
				id: "mem-aau-admin",
				userId: aauAdmin.id,
				universityId: aau.id,
				role: UniversityRole.ADMIN,
				createdAt: now,
			},
			{
				id: "mem-astu-admin",
				userId: astuAdmin.id,
				universityId: astu.id,
				role: UniversityRole.ADMIN,
				createdAt: now,
			},
			{
				id: "mem-aau-contributor",
				userId: contributor.id,
				universityId: aau.id,
				role: UniversityRole.CONTRIBUTOR,
				createdAt: now,
			},
			{
				id: "mem-aau-global-admin",
				userId: globalAdmin.id,
				universityId: aau.id,
				role: UniversityRole.ADMIN,
				createdAt: now,
			},
			{
				id: "mem-astu-global-admin",
				userId: globalAdmin.id,
				universityId: astu.id,
				role: UniversityRole.ADMIN,
				createdAt: now,
			},
		],
	});

	console.log("📁 Building resource hierarchy...");

	const rootAau = await prisma.resource.create({
		data: {
			id: "res-aau-root",
			name: "AAU Repository",
			slug: "aau",
			nodeType: ResourceNodeType.FOLDER,
			folderKind: ResourceFolderKind.UNIVERSITY,
			canonicalPath: "/universities/addis-ababa-university",
			depth: 0,
			sortOrder: 0,
			description: "Top-level repository for Addis Ababa University",
			status: ResourceStatus.APPROVED,
			submittedById: aauAdmin.id,
			approvedById: aauAdmin.id,
			approvedAt: now,
			uploadedById: aauAdmin.id,
			universityId: aau.id,
			publishedAt: now,
		},
	});

	const deptEE = await prisma.resource.create({
		data: {
			id: "res-aau-ee",
			name: "Electrical Engineering",
			slug: "electrical-engineering",
			nodeType: ResourceNodeType.FOLDER,
			folderKind: ResourceFolderKind.DEPARTMENT,
			canonicalPath: `${rootAau.canonicalPath}/electrical-engineering`,
			depth: 1,
			sortOrder: 0,
			parentId: rootAau.id,
			description: "Departmental resources for EE",
			status: ResourceStatus.APPROVED,
			submittedById: aauAdmin.id,
			approvedById: aauAdmin.id,
			approvedAt: now,
			uploadedById: aauAdmin.id,
			universityId: aau.id,
			publishedAt: now,
		},
	});

	const courseCircuit = await prisma.resource.create({
		data: {
			id: "res-aau-ee-circuit",
			name: "Circuit Theory",
			slug: "circuit-theory",
			nodeType: ResourceNodeType.FOLDER,
			folderKind: ResourceFolderKind.COURSE,
			canonicalPath: `${deptEE.canonicalPath}/circuit-theory`,
			depth: 2,
			sortOrder: 0,
			parentId: deptEE.id,
			description: "Course materials for Circuit Theory",
			status: ResourceStatus.APPROVED,
			submittedById: aauAdmin.id,
			approvedById: aauAdmin.id,
			approvedAt: now,
			uploadedById: aauAdmin.id,
			universityId: aau.id,
			publishedAt: now,
		},
	});

	const pendingLabManual = await prisma.resource.create({
		data: {
			id: "res-pending-lab-manual",
			name: "Circuit Lab Manual",
			slug: "circuit-lab-manual",
			nodeType: ResourceNodeType.FILE,
			canonicalPath: `${courseCircuit.canonicalPath}/circuit-lab-manual`,
			depth: 3,
			sortOrder: 0,
			parentId: courseCircuit.id,
			description: "Laboratory manual awaiting approval",
			tags: ["lab", "manual"],
			fileName: "circuit-lab-manual.pdf",
			fileSize: 256_000,
			mimeType: "application/pdf",
			mediaType: ResourceMediaType.DOCUMENT,
			storageKey: "aau/circuit-theory/circuit-lab-manual.pdf",
			downloadUrl: "https://cdn.example.com/aau/circuit-theory/circuit-lab-manual.pdf",
			previewUrl: "https://cdn.example.com/aau/circuit-theory/circuit-lab-manual.png",
			status: ResourceStatus.PENDING,
			submittedById: contributor.id,
			uploadedById: contributor.id,
			universityId: aau.id,
			createdAt: now,
		},
	});

	const approvedLecture = await prisma.resource.create({
		data: {
			id: "res-approved-lecture",
			name: "Lecture 01 - Fundamentals",
			slug: "lecture-01-fundamentals",
			nodeType: ResourceNodeType.FILE,
			canonicalPath: `${courseCircuit.canonicalPath}/lecture-01-fundamentals`,
			depth: 3,
			sortOrder: 1,
			parentId: courseCircuit.id,
			description: "Approved lecture slides",
			tags: ["slides"],
			fileName: "lecture-01.pdf",
			fileSize: 180_000,
			mimeType: "application/pdf",
			mediaType: ResourceMediaType.DOCUMENT,
			storageKey: "aau/circuit-theory/lecture-01.pdf",
			downloadUrl: "https://cdn.example.com/aau/circuit-theory/lecture-01.pdf",
			previewUrl: "https://cdn.example.com/aau/circuit-theory/lecture-01.png",
			status: ResourceStatus.APPROVED,
			submittedById: contributor.id,
			uploadedById: contributor.id,
			approvedById: aauAdmin.id,
			approvedAt: now,
			universityId: aau.id,
			publishedAt: now,
		},
	});

	const rejectedGuide = await prisma.resource.create({
		data: {
			id: "res-rejected-guide",
			name: "Study Guide - Draft",
			slug: "study-guide-draft",
			nodeType: ResourceNodeType.FILE,
			canonicalPath: `${courseCircuit.canonicalPath}/study-guide-draft`,
			depth: 3,
			sortOrder: 2,
			parentId: courseCircuit.id,
			description: "Draft guide requires revisions",
			tags: ["draft"],
			fileName: "study-guide-draft.docx",
			fileSize: 92_000,
			mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			mediaType: ResourceMediaType.DOCUMENT,
			storageKey: "aau/circuit-theory/study-guide-draft.docx",
			downloadUrl: "https://cdn.example.com/aau/circuit-theory/study-guide-draft.docx",
			status: ResourceStatus.REJECTED,
			reviewNote: "Please clarify the circuit diagrams in section 3.",
			submittedById: contributor.id,
			uploadedById: contributor.id,
			universityId: aau.id,
		},
	});

	const archivedSyllabus = await prisma.resource.create({
		data: {
			id: "res-archived-syllabus",
			name: "Circuit Theory - 2023 Syllabus",
			slug: "circuit-theory-2023-syllabus",
			nodeType: ResourceNodeType.FILE,
			canonicalPath: `${courseCircuit.canonicalPath}/circuit-theory-2023-syllabus`,
			depth: 3,
			sortOrder: 3,
			parentId: courseCircuit.id,
			description: "Archived syllabus from 2023",
			tags: ["archived"],
			fileName: "circuit-theory-2023-syllabus.pdf",
			fileSize: 140_000,
			mimeType: "application/pdf",
			mediaType: ResourceMediaType.DOCUMENT,
			storageKey: "aau/circuit-theory/circuit-theory-2023-syllabus.pdf",
			downloadUrl: "https://cdn.example.com/aau/circuit-theory/circuit-theory-2023-syllabus.pdf",
			status: ResourceStatus.ARCHIVED,
			submittedById: contributor.id,
			uploadedById: contributor.id,
			approvedById: aauAdmin.id,
			approvedAt: now,
			archivedAt: now,
			isArchived: true,
			universityId: aau.id,
		},
	});

	const rootAstu = await prisma.resource.create({
		data: {
			id: "res-astu-root",
			name: "ASTU Repository",
			slug: "astu",
			nodeType: ResourceNodeType.FOLDER,
			folderKind: ResourceFolderKind.UNIVERSITY,
			canonicalPath: "/universities/adama-science-and-technology-university",
			depth: 0,
			sortOrder: 0,
			description: "Repository for ASTU",
			status: ResourceStatus.APPROVED,
			submittedById: astuAdmin.id,
			approvedById: astuAdmin.id,
			approvedAt: now,
			uploadedById: astuAdmin.id,
			universityId: astu.id,
			publishedAt: now,
		},
	});

	const deptElectronics = await prisma.resource.create({
		data: {
			id: "res-astu-electronics",
			name: "Electronics Department",
			slug: "electronics",
			nodeType: ResourceNodeType.FOLDER,
			folderKind: ResourceFolderKind.DEPARTMENT,
			canonicalPath: `${rootAstu.canonicalPath}/electronics`,
			depth: 1,
			sortOrder: 0,
			parentId: rootAstu.id,
			status: ResourceStatus.APPROVED,
			submittedById: astuAdmin.id,
			approvedById: astuAdmin.id,
			approvedAt: now,
			uploadedById: astuAdmin.id,
			universityId: astu.id,
			publishedAt: now,
		},
	});

	await prisma.resource.create({
		data: {
			id: "res-astu-microcontrollers",
			name: "Microcontrollers Lab Setup",
			slug: "microcontrollers-lab-setup",
			nodeType: ResourceNodeType.FILE,
			canonicalPath: `${deptElectronics.canonicalPath}/microcontrollers-lab-setup`,
			depth: 2,
			sortOrder: 0,
			parentId: deptElectronics.id,
			description: "Images showing the lab setup for microcontroller experiments",
			mediaType: ResourceMediaType.IMAGE,
			fileName: "microcontrollers-lab-setup.jpg",
			fileSize: 820_000,
			mimeType: "image/jpeg",
			storageKey: "astu/electronics/microcontrollers-lab-setup.jpg",
			downloadUrl: "https://cdn.example.com/astu/electronics/microcontrollers-lab-setup.jpg",
			previewUrl: "https://cdn.example.com/astu/electronics/microcontrollers-lab-setup-thumb.jpg",
			status: ResourceStatus.APPROVED,
			submittedById: astuAdmin.id,
			uploadedById: astuAdmin.id,
			approvedById: astuAdmin.id,
			approvedAt: now,
			universityId: astu.id,
			publishedAt: now,
		},
	});

	console.log("📝 Recording audit trail...");

	await prisma.resourceAudit.createMany({
		data: [
			{
				id: "audit-pending-submitted",
				resourceId: pendingLabManual.id,
				actorId: contributor.id,
				action: ResourceAuditAction.SUBMITTED,
				notes: "Initial upload for review",
				createdAt: now,
			},
			{
				id: "audit-approved-submitted",
				resourceId: approvedLecture.id,
				actorId: contributor.id,
				action: ResourceAuditAction.SUBMITTED,
				notes: "Uploaded lecture slides",
				createdAt: now,
			},
			{
				id: "audit-approved-approved",
				resourceId: approvedLecture.id,
				actorId: aauAdmin.id,
				action: ResourceAuditAction.APPROVED,
				notes: "Looks good for publication",
				createdAt: now,
			},
			{
				id: "audit-rejected-submitted",
				resourceId: rejectedGuide.id,
				actorId: contributor.id,
				action: ResourceAuditAction.SUBMITTED,
				notes: "First draft for study guide",
				createdAt: now,
			},
			{
				id: "audit-rejected-rejected",
				resourceId: rejectedGuide.id,
				actorId: aauAdmin.id,
				action: ResourceAuditAction.REJECTED,
				notes: "Needs clearer diagrams",
				createdAt: now,
			},
			{
				id: "audit-archived-submitted",
				resourceId: archivedSyllabus.id,
				actorId: contributor.id,
				action: ResourceAuditAction.SUBMITTED,
				notes: "Legacy syllabus upload",
				createdAt: now,
			},
			{
				id: "audit-archived-approved",
				resourceId: archivedSyllabus.id,
				actorId: aauAdmin.id,
				action: ResourceAuditAction.APPROVED,
				notes: "Approved for 2023 term",
				createdAt: now,
			},
			{
				id: "audit-archived-archived",
				resourceId: archivedSyllabus.id,
				actorId: aauAdmin.id,
				action: ResourceAuditAction.ARCHIVED,
				notes: "Superseded by 2024 syllabus",
				createdAt: now,
			},
		],
	});

	console.log("✅ Seed complete.");
}

main()
	.catch((error) => {
		console.error("❌ Seed failed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
