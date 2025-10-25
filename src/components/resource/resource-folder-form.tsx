"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ResourceNode } from "./tree";
import { ResourceFolderKind } from "@/generated/prisma";

type FolderFormProps = {
	parentNode: ResourceNode | null | undefined;
	canManage?: boolean;
	onSubmit?: (created: any) => void;
	onCancel?: () => void;
	className?: string;
};

const folderSchema = z.object({
	name: z.string().min(2, "Name is required"),
	description: z.string().default("").catch(""),
	folderKind: z.nativeEnum(ResourceFolderKind, {
		message: "Select a folder type",
	}),
});

type FolderFormInput = z.input<typeof folderSchema>;
type FolderFormValues = z.output<typeof folderSchema>;

const FOLDER_KIND_OPTIONS: Array<{
	value: ResourceFolderKind;
	label: string;
	description: string;
}> = [
	{
		value: ResourceFolderKind.UNIVERSITY,
		label: "University",
		description: "Top-level container for an institution.",
	},
	{
		value: ResourceFolderKind.DEPARTMENT,
		label: "Department",
		description: "Faculty or school within the university.",
	},
	{
		value: ResourceFolderKind.COURSE,
		label: "Course",
		description: "Specific class, module, or program.",
	},
	{
		value: ResourceFolderKind.CUSTOM,
		label: "Custom",
		description: "Any other grouping you need.",
	},
];

function getDefaultKind(parent: ResourceNode | null | undefined): ResourceFolderKind {
	if (!parent || !parent.folderKind) {
		return ResourceFolderKind.UNIVERSITY;
	}

	switch (parent.folderKind) {
		case ResourceFolderKind.UNIVERSITY:
			return ResourceFolderKind.DEPARTMENT;
		case ResourceFolderKind.DEPARTMENT:
			return ResourceFolderKind.COURSE;
		default:
			return ResourceFolderKind.CUSTOM;
	}
}

export function ResourceFolderForm({ parentNode, canManage = false, onSubmit, onCancel, className }: FolderFormProps) {
	const defaultKind = React.useMemo(() => getDefaultKind(parentNode), [parentNode]);
	const form = useForm<FolderFormInput, any, FolderFormValues>({
		resolver: zodResolver(folderSchema),
		defaultValues: {
			name: "",
			description: "",
			folderKind: defaultKind,
		},
	});

	React.useEffect(() => {
		form.reset({
			name: "",
			description: "",
			folderKind: getDefaultKind(parentNode),
		});
	}, [parentNode, form]);

	const [submitting, setSubmitting] = React.useState(false);

	const submitToApi = async (values: FolderFormValues) => {
		if (!parentNode || parentNode.nodeType !== "FOLDER") {
			toast.error("Select a folder in the tree first");
			return;
		}
		if (!canManage) {
			toast.error("Only university admins can create folders");
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				name: values.name.trim(),
				description: values.description?.trim() || undefined,
				nodeType: "FOLDER",
				folderKind: values.folderKind,
				parentId: parentNode.id,
				universityId: parentNode.universityId ?? undefined,
			};

			const response = await fetch("/api/resources", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await response.json().catch(() => ({}));
			if (!response.ok) {
				throw new Error((data as any)?.error || "Failed to create folder");
			}

			toast.success("Folder created");
			onSubmit?.(data);
			form.reset({
				name: "",
				description: "",
				folderKind: getDefaultKind(parentNode),
			});
		} catch (error: any) {
			toast.error(error?.message || "Unable to create folder");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submitToApi)}
				className={cn(
					"space-y-5 max-w-md mx-auto bg-muted/40 p-6 rounded-lg max-h-[70vh] overflow-y-auto",
					className,
				)}
			>
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Create Folder</h3>
					{onCancel ? (
						<Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
							Cancel
						</Button>
					) : null}
				</div>

				{parentNode ? (
					<div className="rounded-md border border-dashed border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
						New folder will live inside <span className="font-medium text-foreground">{parentNode.name}</span>
						{parentNode.canonicalPath ? (
							<span className="ml-2 text-[11px] text-muted-foreground/80">{parentNode.canonicalPath}</span>
						) : null}
					</div>
				) : (
					<div className="rounded-md border border-amber-400/60 bg-amber-50 px-3 py-2 text-xs text-amber-600">
						Select a folder first to enable creation.
					</div>
				)}

				{parentNode && !canManage ? (
					<p className="text-xs text-amber-600">
						You need university admin access to create folders in this section.
					</p>
				) : null}

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Folder name</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g. Electrical Engineering"
									{...field}
									disabled={submitting || !parentNode || !canManage}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="folderKind"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Folder type</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value}
								disabled={submitting || !parentNode || !canManage}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{FOLDER_KIND_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<span className="flex flex-col text-left">
												<span className="text-sm font-medium">{option.label}</span>
												<span className="text-xs text-muted-foreground">{option.description}</span>
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>Select the structure this folder represents.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (optional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Give reviewers context about this folder's contents"
									rows={4}
									{...field}
									disabled={submitting || !parentNode || !canManage}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={submitting || !parentNode || !canManage}
				>
					{submitting ? "Creating..." : "Create Folder"}
				</Button>
			</form>
		</Form>
	);
}
