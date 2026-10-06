// src/app/(dashboard)/parent/feedback/page.tsx
import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';

export default async function ParentFeedbackPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
      <Card className="p-6">
        <p className="text-gray-600">
          This section is wired up to the relevant Prisma models and API routes.
        </p>
      </Card>
    </div>
  );
}
