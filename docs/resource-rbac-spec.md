# Resource Management RBAC & Workflow Spec

## 1. Roles & Personas

| Role | Who | Key Capabilities |
| --- | --- | --- |
| `GLOBAL_ADMIN` | Platform operators | Manage universities, assign university admins, override approvals, configure global settings |
| `UNIVERSITY_ADMIN` | Trusted staff members for a specific university | Manage folder taxonomy (departments/courses/labs) for their university, approve/reject resources, invite contributors |
| `CONTRIBUTOR` (students/researchers) | Authenticated users scoped to one or more universities | Upload resources into pending queue, edit their own pending submissions |
| `VIEWER` (optional) | Any authenticated user | View published resources |

Additional notes:
- A user can hold different roles per university (`UNIVERSITY_ADMIN`) plus an optional global role (`GLOBAL_ADMIN`).
- Contributors upload per university context; default role for general users.

## 2. Domain Objects

- **University**: top-level container. Fields: id, name, slug, admins (many-to-many with `User`).
- **Folder**: hierarchical nodes tied to a university. Fields: id, name, parentId, universityId, nodeType (`DEPARTMENT`, `COURSE`, `LAB`, `CUSTOM`).
- **Resource**: uploaded file/metadata tied to a folder. Fields: id, title, tags, file metadata, `status`, `submittedById`, `approvedById`, `approvedAt`.
- **Resource Review** (optional future): separate history of approvals/rejections with comments.

## 3. Resource Status Lifecycle

```mermaid
graph LR
  Draft[Draft (local-only)] --> Pending
  Pending -->|Approve| Approved
  Pending -->|Reject| Rejected
  Rejected -->|Resubmit| Pending
  Approved -->|Archive| Archived
```

- `PENDING`: Uploaded by contributor, awaiting review. Visible only to submitter + reviewers.
- `APPROVED`: Published; visible to all viewers.
- `REJECTED`: Reviewer rejected; stays hidden. Submitter can resubmit with changes.
- `ARCHIVED`: Soft-deleted by admins; hidden from normal listing but retained.

## 4. Permission Matrix

| Action | GLOBAL_ADMIN | UNIVERSITY_ADMIN (matching university) | CONTRIBUTOR | VIEWER |
| --- | --- | --- | --- | --- |
| Create university | ✅ | ❌ | ❌ | ❌ |
| Assign/remove university admins | ✅ | ❌ | ❌ | ❌ |
| Create/update/delete folders | ✅ | ✅ | ❌ | ❌ |
| Upload resource (creates PENDING) | ✅ | ✅ | ✅ (within allowed university/folder) | ❌ |
| Edit metadata while PENDING | ✅ | ✅ | ✅ (own resource only) | ❌ |
| Approve resource | ✅ | ✅ | ❌ | ❌ |
| Reject resource | ✅ | ✅ | ❌ | ❌ |
| Archive/restore resource | ✅ | ✅ | ❌ | ❌ |
| View PENDING resources | ✅ | ✅ | ✅ (own submissions) | ❌ |
| View APPROVED resources | ✅ | ✅ | ✅ | ✅ |

## 5. Workflow Happy Path

1. Contributor selects university/folder context and uploads resource → record created with `status=PENDING`, `submittedById` set.
2. Notification sent to relevant university admins.
3. University admin reviews: update metadata (optional), then `approve` or `reject`.
   - Approve: system sets `status=APPROVED`, `approvedById`, `approvedAt`. Resource becomes visible to viewers.
   - Reject: system sets `status=REJECTED`, stores reviewer comment. Submitter may update and resubmit → sets back to `PENDING`.
4. Global admins can override or archive resources at any point.

## 6. Required Backend Changes (High-level)

- Extend `User` to support role assignments:
  - Enum `Role` remains but introduce join table `UniversityAdmin` or `UserUniversityRole` for per-university roles.
  - Optionally `User.role` keeps coarse role (student/admin) while join table handles university-specific rights.
- Update `Resource` model: add `status` enum, `approvedById`, `approvedAt`, `reviewNote`, `submittedById` (if not already).
- Introduce `ResourceAudit` table to capture approval events (optional but recommended).
- Protect API routes using new role checks; ensure uploads set `status=PENDING`.
- Add service layer methods: `approveResource`, `rejectResource`, `archiveResource`, etc., each enforcing permissions.

## 7. Frontend UX Implications

- Upload dialog: include tags/title + choose folder; show status `Pending approval` post-upload.
- University admin dashboard: `Pending` tab with filters, bulk approve/reject, comment capture.
- Resource detail: show status badge, reviewer info, action buttons based on role.
- Optional: toast/notification when submission approved or rejected.

## 8. Audit & Notifications

- Log entry on each approval/rejection/archival for traceability.
- Notifications (email or in-app) triggered for submitter and reviewers:
  - `PENDING` created → notify university admins.
  - `APPROVED`/`REJECTED` → notify submitter.

## 9. Open Questions / Assumptions

1. Can contributors upload to multiple universities? (Assume yes if assigned; need mapping table.)
2. Do we need soft-delete for folders/resources? (Assume yes; use `archivedAt` field.)
3. Should approvals be single-step or allow multi-reviewer? (Current scope: single reviewer.)
4. Storage of actual files? (Assume existing S3 flow; no change.)

## 10. Next Steps

- Finalize schema changes (Task 12).
- Implement server-side guards and workflows (Task 13).
- Update frontend UI state and components (Task 14).
- Add seeds/tests/docs (Task 15).

## 11. Prisma Schema Change Plan (Task 12)

### 11.1 New Enums
- `ResourceStatus { PENDING, APPROVED, REJECTED, ARCHIVED }`
- `UniversityRole { ADMIN, CONTRIBUTOR, VIEWER }` (per-university role assignments)

### 11.2 New Models
- `University`
  - `id String @id @default(cuid())`
  - `name String`
  - `slug String @unique`
  - `logoUrl String?`
  - `metadata Json?`
  - `createdAt DateTime @default(now())`
  - `updatedAt DateTime @updatedAt`

- `UniversityMembership`
  - `id String @id @default(cuid())`
  - `userId String`
  - `universityId String`
  - `role UniversityRole`
  - `createdAt DateTime @default(now())`
  - `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
  - `university University @relation(fields: [universityId], references: [id], onDelete: Cascade)`
  - `@@unique([userId, universityId])`

- `ResourceAudit` (optional but recommended)
  - `id String @id @default(cuid())`
  - `resourceId String`
  - `action ResourceAuditAction` (enum: `SUBMITTED`, `APPROVED`, `REJECTED`, `ARCHIVED`, `RESTORED`)
  - `actorId String`
  - `notes String?`
  - `createdAt DateTime @default(now())`
  - relations to `Resource` and `User`

### 11.3 Resource Model Updates
- Add relational foreign keys:
  - `universityId String?`
  - `university University? @relation(fields: [universityId], references: [id], onDelete: Cascade)`
  - remove legacy string codes (`universityCode`, `departmentCode`, `courseCode`) if not required after migration.
- Add status + reviewer metadata:
  - `status ResourceStatus @default(PENDING)`
  - `submittedById String?` (rename from `uploadedById` or keep both if needed)
  - `approvedById String?`
  - `approvedAt DateTime?`
  - `reviewNote String?`
  - `archivedAt DateTime?`
- Ensure folders/files share same status semantics (folders typically `APPROVED`).
- Update indexes: add `@@index([status])`, `@@index([universityId])`.

### 11.4 Folder Hierarchy Adjustments
- Enforce that root folders reference a `universityId`.
- Optionally add `ownerUniversityId` to ensure even files know their university without traversing ancestors.
- Consider `folderKind` to include `LAB` after stakeholder confirmation.

### 11.5 User Model Updates
- Deprecate coarse `role Role @default(STUDENT)` usage for resource permissions; keep for legacy features but rely on `UniversityMembership` for RBAC.
- Add relation fields:
  - `universityMemberships UniversityMembership[]`
  - rename existing `resources` relation to align with `submittedResources` if clarity needed.

### 11.6 Migration Steps
1. **Create new enums** (`ResourceStatus`, `UniversityRole`, `ResourceAuditAction`).
2. **Create new tables** (`University`, `UniversityMembership`, optional `ResourceAudit`).
3. **Alter Resource**: add new columns, default values, indexes.
4. **Backfill data**:
   - Create seed universities for existing records (if data already present).
   - Map current resource roots to universities and set `universityId`.
   - Set status to `APPROVED` for existing published resources; `PENDING` otherwise.
   - Copy `uploadedById` into new `submittedById`.
5. **Drop legacy columns** (e.g., `universityCode`) after verifying no code depends on them.
6. **Update Prisma client generation** (`pnpm prisma generate`).

### 11.7 Seed & Test Considerations
- Seed fixture data:
  - Global admin user + membership.
  - At least two universities with admins, contributors, sample resources in each status.
- Add factory helpers for tests (e.g., `createPendingResource(universityId, submitterId)`).
- Ensure migrations run cleanly on existing DB; provide manual script for backfill if required.
