"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ResourceStatus } from "@/generated/prisma";
import { buildResourceTree, flattenTree } from "@/components/resource/tree";
import type { ResourceNode, ResourceWithRelations } from "@/components/resource/tree";

type FetchOptions = {
	statuses?: ResourceStatus[];
	universityId?: string;
	includeArchived?: boolean;
};

type FetchState = {
	resources: ResourceWithRelations[];
	loading: boolean;
	error: string | null;
	lastUpdated: number;
};

const initialState: FetchState = {
	resources: [],
	loading: false,
	error: null,
	lastUpdated: 0,
};

export function useResources(options?: FetchOptions) {
	const { includeArchived = false, universityId, statuses } = options ?? {};
	const statusKey = statuses?.join(",") ?? "";
	const [state, setState] = useState<FetchState>({
		...initialState,
		loading: true,
	});
	const lastController = useRef<AbortController | null>(null);

	const fetchResources = useCallback(
		async ({ skipLoading } = { skipLoading: false }) => {
			if (lastController.current) {
				lastController.current.abort();
			}

			const controller = new AbortController();
			lastController.current = controller;

			try {
				if (!skipLoading) {
					setState((prev) => ({ ...prev, loading: true, error: null }));
				}

				const params = new URLSearchParams();
				if (includeArchived) params.set("includeArchived", "true");
				if (universityId) params.set("universityId", universityId);
				if (statusKey) params.set("statuses", statusKey);

				const url = params.size ? `/api/resources?${params.toString()}` : "/api/resources";
				const response = await fetch(url, { signal: controller.signal });

				if (!response.ok) {
					const message = await safeExtractError(response);
					throw new Error(message);
				}

				const data = (await response.json()) as ResourceWithRelations[];
				setState({
					resources: data,
					loading: false,
					error: null,
					lastUpdated: Date.now(),
				});
			} catch (error) {
				if (isAbortError(error)) {
					return;
				}
				setState((prev) => ({
					...prev,
					loading: false,
					error: error instanceof Error ? error.message : "Failed to load resources",
				}));
			}
		},
		[includeArchived, statusKey, universityId]
	);

	useEffect(() => {
		fetchResources();
		return () => {
			lastController.current?.abort();
		};
	}, [fetchResources]);

	const tree = useMemo<ResourceNode[]>(() => buildResourceTree(state.resources), [state.resources]);
	const flat = useMemo(() => flattenTree(tree), [tree]);
	const nodesById = useMemo(() => {
		const map = new Map<string, ResourceNode>();
		for (const node of flat) {
			map.set(node.id, node);
		}
		return map;
	}, [flat]);

	const refresh = useCallback(() => fetchResources(), [fetchResources]);

	return {
		resources: state.resources,
		tree,
		nodesById,
		loading: state.loading,
		error: state.error,
		lastUpdated: state.lastUpdated,
		refresh,
	};
}

function isAbortError(error: unknown): error is DOMException {
	return error instanceof DOMException && error.name === "AbortError";
}

async function safeExtractError(response: Response) {
	try {
		const body = (await response.json()) as { error?: string };
		return body.error || response.statusText || "Request failed";
	} catch (error) {
		return response.statusText || "Request failed";
	}
}
