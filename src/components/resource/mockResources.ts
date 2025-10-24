export type ResourceUI = {
  id: string;
  name: string;
  slug?: string;
  nodeType: "FOLDER" | "FILE";
  folderKind?: string | null;
  mediaType?: string | null;
  parentId?: string | null;
  depth?: number;
  canonicalPath?: string;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  previewUrl?: string | null;
  downloadUrl?: string | null;
  uploadedBy?: { id: string; name?: string } | null;
  createdAt?: string | null;
};

// A small set of realistic-looking dummy resources with nested folders/files
export const mockResources: ResourceUI[] = [
  {
    id: "uni_aau",
    name: "Addis Ababa University",
    nodeType: "FOLDER",
    folderKind: "UNIVERSITY",
    parentId: null,
    depth: 0,
    canonicalPath: "/addis-ababa-university",
    createdAt: "2025-09-01T08:00:00Z",
  },
  {
    id: "dept_aau_ee",
    name: "Electrical Engineering",
    nodeType: "FOLDER",
    folderKind: "DEPARTMENT",
    parentId: "uni_aau",
    depth: 1,
    canonicalPath: "/addis-ababa-university/electrical-engineering",
  },
  {
    id: "course_circuit_theory",
    name: "Circuit Theory",
    nodeType: "FOLDER",
    folderKind: "COURSE",
    parentId: "dept_aau_ee",
    depth: 2,
    canonicalPath: "/addis-ababa-university/electrical-engineering/circuit-theory",
  },
  {
    id: "file_circuit_lab_manual",
    name: "Circuit Theory Lab Manual",
    nodeType: "FILE",
    parentId: "course_circuit_theory",
    depth: 3,
    fileName: "circuit-theory-lab-manual.pdf",
    fileSize: 256000,
    mimeType: "application/pdf",
    mediaType: "DOCUMENT",
    previewUrl: "https://cdn.example.com/previews/circuit-theory-lab.png",
    downloadUrl: "https://cdn.example.com/files/circuit-theory-lab-manual.pdf",
    uploadedBy: { id: "user_1", name: "Dr. Lemma" },
  },
  {
    id: "file_circuit_demo_video",
    name: "Experiment Demo",
    nodeType: "FILE",
    parentId: "course_circuit_theory",
    depth: 3,
    fileName: "experiment-demo.mp4",
    fileSize: 54000000,
    mimeType: "video/mp4",
    mediaType: "VIDEO",
    previewUrl: "https://cdn.example.com/previews/experiment-demo.jpg",
  },
  {
    id: "file_circuit_diagram",
    name: "Circuit Diagram",
    nodeType: "FILE",
    parentId: "course_circuit_theory",
    depth: 3,
    fileName: "circuit-diagram.png",
    fileSize: 460000,
    mimeType: "image/png",
    mediaType: "IMAGE",
    previewUrl: "https://cdn.example.com/previews/circuit-diagram.png",
  },
  {
    id: "course_power_systems",
    name: "Power Systems",
    nodeType: "FOLDER",
    folderKind: "COURSE",
    parentId: "dept_aau_ee",
    depth: 2,
    canonicalPath: "/addis-ababa-university/electrical-engineering/power-systems",
  },
  {
    id: "file_power_notes",
    name: "Power Systems Notes",
    nodeType: "FILE",
    parentId: "course_power_systems",
    depth: 3,
    fileName: "power-systems-notes.docx",
    fileSize: 98000,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    mediaType: "DOCUMENT",
  },
  {
    id: "dept_aau_cs",
    name: "Computer Science",
    nodeType: "FOLDER",
    folderKind: "DEPARTMENT",
    parentId: "uni_aau",
    depth: 1,
    canonicalPath: "/addis-ababa-university/computer-science",
  },
  {
    id: "course_algorithms",
    name: "Algorithms",
    nodeType: "FOLDER",
    folderKind: "COURSE",
    parentId: "dept_aau_cs",
    depth: 2,
    canonicalPath: "/addis-ababa-university/computer-science/algorithms",
  },
  {
    id: "file_algo1",
    name: "Intro to Algorithms - Lecture 1",
    nodeType: "FILE",
    parentId: "course_algorithms",
    depth: 3,
    fileName: "lecture1.pdf",
    fileSize: 124000,
    mimeType: "application/pdf",
    mediaType: "DOCUMENT",
    previewUrl: "https://cdn.example.com/previews/lecture1.png",
    downloadUrl: "https://cdn.example.com/files/lecture1.pdf",
    uploadedBy: { id: "user_2", name: "Prof. Bekele" },
  },
  {
    id: "file_ds_notes",
    name: "Data Structures - Notes",
    nodeType: "FILE",
    parentId: "course_algorithms",
    depth: 3,
    fileName: "ds_notes.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 98000,
    mediaType: "DOCUMENT",
  },
  {
    id: "file_policy",
    name: "Academic Policy",
    nodeType: "FILE",
    parentId: "uni_aau",
    depth: 1,
    fileName: "policy.pdf",
    mimeType: "application/pdf",
    mediaType: "DOCUMENT",
  },
  {
    id: "uni_astu",
    name: "Adama Science & Tech University",
    nodeType: "FOLDER",
    folderKind: "UNIVERSITY",
    parentId: null,
    depth: 0,
    canonicalPath: "/adama-science-and-technology-university",
    createdAt: "2025-09-10T09:15:00Z",
  },
  {
    id: "dept_astu_electronics",
    name: "Electronics",
    nodeType: "FOLDER",
    folderKind: "DEPARTMENT",
    parentId: "uni_astu",
    depth: 1,
    canonicalPath: "/adama-science-and-technology-university/electronics",
  },
  {
    id: "course_microcontrollers",
    name: "Microcontrollers",
    nodeType: "FOLDER",
    folderKind: "COURSE",
    parentId: "dept_astu_electronics",
    depth: 2,
    canonicalPath: "/adama-science-and-technology-university/electronics/microcontrollers",
  },
  {
    id: "file_microcontroller_datasheet",
    name: "Microcontroller Datasheet",
    nodeType: "FILE",
    parentId: "course_microcontrollers",
    depth: 3,
    fileName: "mcu-datasheet.pdf",
    mimeType: "application/pdf",
    mediaType: "DOCUMENT",
    fileSize: 208000,
  },
  {
    id: "file_microcontroller_lab",
    name: "Lab Setup Image",
    nodeType: "FILE",
    parentId: "course_microcontrollers",
    depth: 3,
    fileName: "lab-setup.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    fileSize: 720000,
    previewUrl: "https://cdn.example.com/previews/lab-setup.jpg",
  },
  {
    id: "r_media_library",
    name: "Media Library",
    nodeType: "FOLDER",
    parentId: "uni_astu",
    depth: 1,
  },
  {
    id: "file_open_day_poster",
    name: "Open Day Poster",
    nodeType: "FILE",
    parentId: "r_media_library",
    depth: 2,
    fileName: "open-day-poster.png",
    mimeType: "image/png",
    mediaType: "IMAGE",
    previewUrl: "https://cdn.example.com/previews/open-day-poster.png",
  },
  {
    id: "file_unknown",
    name: "Untitled Resource",
    nodeType: "FILE",
    parentId: "r_media_library",
    depth: 2,
  },
];

// Helper to build a tree: map id -> node with children
export type ResourceNode = ResourceUI & { children?: ResourceNode[] };

export function buildResourceTree(items: ResourceUI[]): ResourceNode[] {
  const map = new Map<string, ResourceNode>();
  const roots: ResourceNode[] = [];

  for (const it of items) {
    map.set(it.id, { ...it, children: [] });
  }

  for (const it of items) {
    const node = map.get(it.id)!;
    if (it.parentId) {
      const parent = map.get(it.parentId);
      if (parent) parent.children!.push(node);
      else roots.push(node); // orphan -> treat as root
    } else {
      roots.push(node);
    }
  }

  // Sort children: folders first, then files, by name
  function sortRecursive(nodes: ResourceNode[]) {
    nodes.sort((a, b) => {
      if (a.nodeType === b.nodeType) return (a.name || "").localeCompare(b.name || "");
      return a.nodeType === "FOLDER" ? -1 : 1;
    });
    for (const n of nodes) if (n.children && n.children.length) sortRecursive(n.children);
  }

  sortRecursive(roots);
  return roots;
}
