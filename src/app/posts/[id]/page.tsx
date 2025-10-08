import React from 'react'
import PostCard from '@/components/post/PostCard'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = params.id
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: {
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'asc' },
      },
      likes: { select: { userId: true } },
    },
  })

  if (!post) return notFound()

  const postForClient = {
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl ?? '',
    tags: post.tags ?? [],
    visibility: post.visibility ?? undefined,
    author: post.author ? { name: post.author.name, image: post.author.image ?? undefined } : undefined,
    authorId: post.authorId,
    likeCount: post.likes?.length ?? 0,
    likes: post.likes ?? [],
    commentCount: post.comments?.length ?? 0,
    createdAt: post.createdAt?.toISOString(),
    university: post.university ?? undefined,
    department: post.department ?? undefined,
    role: post.role ?? undefined,
    resourceType: post.resourceType ?? undefined,
    attachments: Array.isArray(post.attachments)
      ? post.attachments.map((a: any) => ({ name: a.name, url: a.url, type: a.type }))
      : undefined,
    views: post.views ?? undefined,
    downloads: post.downloads ?? undefined,
    collaborators: undefined,
    doi: post.doi ?? undefined,
    citation: post.citation ?? undefined,
    authorVerified: undefined,
    summary: post.summary ?? undefined,
  }

  const initialComments = (post.comments ?? []).map((c: any) => ({
    id: c.id,
    author: { id: c.author?.id, name: c.author?.name, image: c.author?.image ?? undefined },
    content: c.content,
    createdAt: c.createdAt?.toISOString(),
    replies: [],
  }))

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Render PostCard client component */}
      <PostCard post={postForClient} initialComments={initialComments} />
    </div>
  )
}
