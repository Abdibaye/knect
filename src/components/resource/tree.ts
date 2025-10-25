import type { Prisma } from "@/generated/prisma";

export type ResourceWithRelations = Prisma.ResourceGetPayload<{
	include: {
		submittedBy: {
			select: { id: true; name: true };
		};
		approvedBy: {
			select: { id: true; name: true };
		};
	};
}>;

export type ResourceNode = ResourceWithRelations & { children: ResourceNode[] };

function ensureChildren(resource: ResourceWithRelations): ResourceNode {
	return {
		...resource,
		children: [],
	};
}

export function buildResourceTree(resources: ResourceWithRelations[]): ResourceNode[] {
	const map = new Map<string, ResourceNode>();
	const roots: ResourceNode[] = [];

	for (const resource of resources) {
		map.set(resource.id, ensureChildren(resource));
	}

	for (const resource of resources) {
		const node = map.get(resource.id)!;
		const parentId = resource.parentId;
		if (parentId) {
			const parent = map.get(parentId);
			if (parent) {
				parent.children.push(node);
			} else {
				roots.push(node);
			}
		} else {
			roots.push(node);
		}
	}

	sortTree(roots);

	return roots;
}

function sortTree(nodes: ResourceNode[]) {
	nodes.sort((a, b) => {
		if (a.nodeType === b.nodeType) {
			return (a.name ?? "").localeCompare(b.name ?? "");
		}
		return a.nodeType === "FOLDER" ? -1 : 1;
	});

	for (const node of nodes) {
		if (node.children.length) {
			sortTree(node.children);
		}
	}
}

export function flattenTree(nodes: ResourceNode[]): ResourceNode[] {
	const result: ResourceNode[] = [];

	const walk = (items: ResourceNode[]) => {
		for (const item of items) {
			result.push(item);
			if (item.children.length) {
				walk(item.children);
			}
		}
	};

	walk(nodes);
	return result;
}
