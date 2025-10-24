"use client";

import { useMemo, useState } from "react";
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
import {
  FileArchive,
  FileText,
  Folder,
  Image as ImageIcon,
  Upload,
  Video as VideoIcon,
} from "lucide-react";
import { buildResourceTree, mockResources, ResourceNode } from "./mockResources";

const DEFAULT_EXPANDED_IDS = mockResources
  .filter((resource) => resource.nodeType === "FOLDER" && (resource.depth ?? 0) <= 1)
  .map((resource) => resource.id);

const DEFAULT_SELECTED_ID = mockResources.find(
  (resource) => resource.nodeType === "FOLDER" && resource.parentId === null
)?.id;

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
          <TreeLabel>{node.name}</TreeLabel>
        </TreeNodeTrigger>
        {hasChildren ? (
          <TreeNodeContent hasChildren>
            {renderTree(node.children!, level + 1)}
          </TreeNodeContent>
        ) : null}
      </TreeNode>
    );
  });
}

export default function ResourcePage() {
  const tree = useMemo(() => buildResourceTree(mockResources), []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, ResourceNode>();

    const walk = (nodes: ResourceNode[]) => {
      nodes.forEach((node) => {
        map.set(node.id, node);
        if (node.children?.length) {
          walk(node.children);
        }
      });
    };

    walk(tree);
    return map;
  }, [tree]);

  const [selectedIds, setSelectedIds] = useState<string[]>(
    DEFAULT_SELECTED_ID ? [DEFAULT_SELECTED_ID] : []
  );

  const selectedNodeId = selectedIds[selectedIds.length - 1] ?? DEFAULT_SELECTED_ID;
  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) : undefined;
  const activeNode = selectedNode ?? (DEFAULT_SELECTED_ID ? nodeMap.get(DEFAULT_SELECTED_ID) : undefined);

  const previewItems = activeNode
    ? activeNode.nodeType === "FOLDER"
      ? activeNode.children ?? []
      : [activeNode]
    : [];

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
            <TreeProvider
              className="w-full"
              defaultExpandedIds={DEFAULT_EXPANDED_IDS}
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
          </div>
          {activeNode?.nodeType === "FOLDER" ? (
            <Button size="sm" variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Upload Resource
            </Button>
          ) : null}
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 overflow-hidden px-0 py-0">
          <ScrollArea className="h-[calc(80vh-140px)]">
            {previewItems.length ? (
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center justify-center rounded-lg border border-border/60 p-4 text-center transition hover:border-primary/60 hover:bg-muted/40"
                  >
                    {getPreviewIcon(item)}
                    <span className="mt-3 line-clamp-2 text-sm font-medium">
                      {item.name}
                    </span>
                    {item.nodeType === "FILE" ? (
                      <span className="mt-2 text-xs text-muted-foreground">
                        {item.fileName ?? "Unnamed file"}
                        {" • "}
                        {formatFileSize(item.fileSize)}
                      </span>
                    ) : (
                      <span className="mt-2 text-xs text-muted-foreground">
                        {(item.children?.length ?? 0).toString()} items
                      </span>
                    )}
                  </div>
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
