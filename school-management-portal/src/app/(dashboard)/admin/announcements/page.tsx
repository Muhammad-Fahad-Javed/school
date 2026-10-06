// src/app/(dashboard)/admin/announcements/page.tsx
import { requireRole } from '@/lib/auth';
import { Card } from '@/components/ui/Card';

export default async function AnnouncementsPage() {
  await requireRole('ADMIN');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      <Card className="p-6">
        <p className="text-gray-600">
          Manage Announcements here. This section connects to the corresponding API routes and
          Prisma models to list, create, edit, and remove records.
        </p>
      </Card>
    </div>
  );
}
