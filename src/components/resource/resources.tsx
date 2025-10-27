"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@/components/kibo-ui/tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useResources } from "@/hooks/use-resources";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  FileArchive,
  FileText,
  Folder,
  FolderPlus,
  Image as ImageIcon,
  RefreshCw,
  Upload,
  Video as VideoIcon,
} from "lucide-react";
import type { ResourceNode } from "./tree";
import type { ResourceStatus } from "@/generated/prisma";
import { Role, UniversityRole } from "@/generated/prisma";
import { ResourceForm } from "./resources-form";
import { ResourceFolderForm } from "./resource-folder-form";

type SessionMembership = {
  universityId?: string | null;
  role?: string | null;
};

type SessionUser = {
  role?: string | null;
  universityMemberships?: SessionMembership[] | null;
};

function getTreeFileIcon(resource: ResourceNode) {
  const hint = (resource.mediaType || resource.mimeType || "").toLowerCase();

  if ((resource.mediaType === "IMAGE" && !hint.includes("pdf")) || hint.includes("image")) {
    return <ImageIcon className="h-4 w-4 text-emerald-500" />;
  }

  if (resource.mediaType === "VIDEO" || hint.includes("video")) {
    return <VideoIcon className="h-4 w-4 text-rose-500" />;
  }

  if (resource.mediaType === "DOCUMENT" || hint.includes("pdf") || hint.includes("doc")) {
    return <FileText className="h-4 w-4 text-sky-500" />;
  }

  return <FileArchive className="h-4 w-4 text-muted-foreground" />;
}

function getPreviewIcon(resource: ResourceNode) {
  const hint = (resource.mediaType || resource.mimeType || "").toLowerCase();

  if (resource.nodeType === "FOLDER") {
    return <Folder className="h-10 w-10 text-amber-500" />;
  }

  if ((resource.mediaType === "IMAGE" && !hint.includes("pdf")) || hint.includes("image")) {
    return <ImageIcon className="h-10 w-10 text-emerald-500" />;
  }

  if (resource.mediaType === "VIDEO" || hint.includes("video")) {
    return <VideoIcon className="h-10 w-10 text-rose-500" />;
  }

  if (resource.mediaType === "DOCUMENT" || hint.includes("pdf") || hint.includes("doc")) {
    return <FileText className="h-10 w-10 text-sky-500" />;
  }

  return <FileArchive className="h-10 w-10 text-muted-foreground" />;
}

function formatFileSize(bytes?: number | null) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function renderTree(nodes: ResourceNode[], level = 0) {
  return nodes.map((node, index) => {
    const hasChildren = !!(node.children && node.children.length);
    const isLast = index === nodes.length - 1;

    return (
      <TreeNode key={node.id} nodeId={node.id} level={level} isLast={isLast}>
        <TreeNodeTrigger>
          <TreeExpander hasChildren={hasChildren} />
          <TreeIcon
            hasChildren={hasChildren}
            icon={!hasChildren ? getTreeFileIcon(node) : undefined}
          />
          <TreeLabel>
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">{node.name}</span>
              <InlineStatus status={node.status} />
            </span>
          </TreeLabel>
        </TreeNodeTrigger>
        {hasChildren ? (
          <TreeNodeContent hasChildren>
            {renderTree(node.children, level + 1)}
          </TreeNodeContent>
        ) : null}
      </TreeNode>
    );
  });
}

export default function ResourcePage() {
  const { tree, nodesById, loading, error, refresh } = useResources();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user as SessionUser | undefined;

  const defaultExpandedIds = useMemo(() => buildDefaultExpandedIds(tree), [tree]);
  const providerKey = useMemo(() => tree.map((node) => node.id).join("|"), [tree]);

  useEffect(() => {
    if (!tree.length) {
      if (selectedIds.length) {
        setSelectedIds([]);
      }
      return;
    }

    const activeId = selectedIds[selectedIds.length - 1];
    if (activeId && nodesById.has(activeId)) {
      return;
    }

    const fallback = findDefaultSelection(tree);
    if (!fallback) {
      if (selectedIds.length) {
        setSelectedIds([]);
      }
      return;
    }

    if (activeId !== fallback.id || selectedIds.length !== 1) {
      setSelectedIds([fallback.id]);
    }
  }, [nodesById, selectedIds, tree]);

  const activeNodeId = selectedIds[selectedIds.length - 1];
  const activeNode = activeNodeId ? nodesById.get(activeNodeId) : undefined;
  const activeFolder = activeNode?.nodeType === "FOLDER" ? activeNode : undefined;

  const previewItems = useMemo(() => {
    if (!activeNode) return [];
    if (activeNode.nodeType === "FOLDER") {
      return activeNode.children ?? [];
    }
    return [activeNode];
  }, [activeNode]);

  const handleResourceActivate = useCallback(
    (resource: ResourceNode) => {
      setSelectedIds([resource.id]);
      if (resource.nodeType === "FOLDER") {
        return;
      }

      const downloadUrl = typeof resource.downloadUrl === "string" ? resource.downloadUrl.trim() : "";
      const externalUrl = typeof resource.externalUrl === "string" ? resource.externalUrl.trim() : "";
      const targetUrl = downloadUrl || externalUrl;

      if (!targetUrl) {
        toast.error("No link available for this file yet.");
        return;
      }

      const opened = window.open(targetUrl, "_blank", "noopener,noreferrer");
      
    },
    [setSelectedIds],
  );

  const canCreateFolder = useMemo(() => {
    if (!activeFolder || !sessionUser) {
      return false;
    }
    const globalRole = sessionUser.role;
    if (typeof globalRole === "string" && globalRole.toUpperCase() === Role.ADMIN) {
      return true;
    }
    const memberships = sessionUser.universityMemberships ?? [];
    return memberships.some((membership) => {
      if (!membership) return false;
      const matchesUniversity = (membership.universityId ?? null) === (activeFolder.universityId ?? null);
      if (!matchesUniversity) return false;
      const membershipRole = membership.role;
      return typeof membershipRole === "string" && membershipRole.toUpperCase() === UniversityRole.ADMIN;
    });
  }, [activeFolder, sessionUser]);

  useEffect(() => {
    if (!canCreateFolder && folderOpen) {
      setFolderOpen(false);
    }
  }, [canCreateFolder, folderOpen]);

  return (
    <div className="grid gap-4 p-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="h-[80vh] overflow-hidden">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Universities</CardTitle>
          <CardDescription className="text-sm">
            Browse faculties, courses, and shared files by institution.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden px-0 py-0">
          <ScrollArea className="h-[calc(80vh-120px)]">
            {error ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={() => refresh()} size="sm">
                  Try again
                </Button>
              </div>
            ) : loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index.toString()} className="h-8 w-full" />
                ))}
              </div>
            ) : tree.length ? (
              <TreeProvider
                key={providerKey}
                className="w-full"
                defaultExpandedIds={defaultExpandedIds}
                selectedIds={selectedIds}
                onSelectionChange={(ids) => {
                  const next = ids.length ? [ids[ids.length - 1]] : [];
                  setSelectedIds(next);
                }}
              >
                <TreeView className="px-2 py-3">
                  {renderTree(tree)}
                </TreeView>
              </TreeProvider>
            ) : (
              <EmptyState
                title="No resources yet"
                description="Use the upload action to create the first university folder."
              />
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-col gap-2 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg">
              {activeNode?.name ?? "Resources"}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {activeNode?.canonicalPath ?? "Select a folder from the tree to view resources."}
            </CardDescription>
            {activeNode ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={activeNode.status} />
                {activeNode.submittedBy ? (
                  <span>
                    Submitted by {activeNode.submittedBy.name ?? "Unknown"}
                  </span>
                ) : null}
                {activeNode.approvedBy && activeNode.status === "APPROVED" ? (
                  <span>
                    Approved by {activeNode.approvedBy.name ?? "Unknown"}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => refresh()}
              aria-label="Refresh resources"
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading ? "animate-spin" : "")} />
            </Button>
            {activeFolder ? (
              <>
                {canCreateFolder ? (
                  <Dialog open={folderOpen} onOpenChange={setFolderOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <FolderPlus className="h-4 w-4" /> New Folder
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Create folder</DialogTitle>
                        <DialogDescription>
                          Folders help keep {activeFolder.name} organised.
                        </DialogDescription>
                      </DialogHeader>
                      <ResourceFolderForm
                        parentNode={activeFolder}
                        canManage={canCreateFolder}
                        onSubmit={(created) => {
                          setFolderOpen(false);
                          refresh().then(() => {
                            if (created?.id) {
                              setSelectedIds([created.id]);
                            } else {
                              setSelectedIds([activeFolder.id]);
                            }
                          });
                        }}
                        onCancel={() => setFolderOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                ) : null}
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" /> Upload Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload resource</DialogTitle>
                      <DialogDescription>
                        Files will be added under {activeFolder.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <ResourceForm
                      parentNode={activeFolder}
                      onSubmit={(created) => {
                        setUploadOpen(false);
                        refresh().then(() => {
                          if (created?.id) {
                            setSelectedIds([created.id]);
                          } else {
                            setSelectedIds([activeFolder.id]);
                          }
                        });
                      }}
                      onCancel={() => setUploadOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </>
            ) : null}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 overflow-hidden px-0 py-0">
          <ScrollArea className="h-[calc(80vh-140px)]">
            {error ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={() => refresh()} size="sm">
                  Try again
                </Button>
              </div>
            ) : loading ? (
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index.toString()} className="h-36 w-full" />
                ))}
              </div>
            ) : previewItems.length ? (
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {previewItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleResourceActivate(item)}
                    className={cn(
                      "flex h-full flex-col items-center justify-center rounded-lg border border-border/60 p-4 text-center transition",
                      "hover:border-primary/60 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      "cursor-pointer",
                    )}
                    aria-label={item.nodeType === "FOLDER" ? `Open folder ${item.name}` : `Open file ${item.name}`}
                  >
                    {getPreviewIcon(item)}
                    <span className="mt-3 line-clamp-2 text-sm font-medium">
                      {item.name}
                    </span>
                    <StatusBadge status={item.status} className="mt-2" />
                    {item.nodeType === "FILE" ? (
                      <span className="mt-2 text-xs text-muted-foreground">
                        {item.fileName ?? "Unnamed file"}
                        {" • "}
                        {formatFileSize(item.fileSize)}
                      </span>
                    ) : (
                      <span className="mt-2 text-xs text-muted-foreground">
                        {item.children.length.toString()} items
                      </span>
                    )}
                    {item.reviewNote && item.status !== "APPROVED" ? (
                      <p className="mt-2 line-clamp-3 text-xs text-amber-600">
                        {item.reviewNote}
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
                <Folder className="h-10 w-10 text-muted-foreground/70" />
                <p>No resources found in this section yet.</p>
                {activeNode?.nodeType === "FOLDER" ? (
                  <p className="max-w-xs text-xs">
                    Use the upload action to seed this folder with documents, media, or links.
                  </p>
                ) : null}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

const STATUS_META: Record<ResourceStatus, { label: string; className: string }> = {
	APPROVED: {
		label: "Approved",
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
	},
	PENDING: {
		label: "Pending",
		className: "border-amber-500/30 bg-amber-400/10 text-amber-600",
	},
	REJECTED: {
		label: "Needs updates",
		className: "border-rose-500/30 bg-rose-500/10 text-rose-600",
	},
	ARCHIVED: {
		label: "Archived",
		className: "border-slate-400/40 bg-slate-400/10 text-slate-500",
	},
};

function StatusBadge({ status, className }: { status: ResourceStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant="outline" className={cn(meta?.className, className)}>
      {meta?.label ?? status}
    </Badge>
  );
}

function InlineStatus({ status }: { status: ResourceStatus }) {
	if (status === "APPROVED") {
		return null;
	}
	const meta = STATUS_META[status];
	return (
		<span
			className={cn(
				"rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
				meta?.className,
			)}
		>
			{meta?.label ?? status}
		</span>
	);
}

function findDefaultSelection(tree: ResourceNode[]) {
	for (const node of tree) {
		if (node.nodeType === "FOLDER") {
			return node;
		}
	}
	return tree[0];
}

function buildDefaultExpandedIds(tree: ResourceNode[]) {
	const ids: string[] = [];

	const walk = (nodes: ResourceNode[], depth: number) => {
		for (const node of nodes) {
			if (node.nodeType === "FOLDER" && depth < 2) {
				ids.push(node.id);
				if (node.children.length) {
					walk(node.children, depth + 1);
				}
			}
		}
	};

	walk(tree, 0);
	return ids;
}

function EmptyState({ title, description }: { title: string; description: string }) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
			<Folder className="h-10 w-10 text-muted-foreground/70" />
			<p className="font-medium text-foreground/80">{title}</p>
			<p className="max-w-xs text-xs">{description}</p>
		</div>
	);
}
