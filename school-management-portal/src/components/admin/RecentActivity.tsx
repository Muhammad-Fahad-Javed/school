// src/components/admin/RecentActivity.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { formatDateTime } from '@/lib/utils';

interface Activity {
  id: string;
  action: string;
  entityType: string;
  createdAt: Date | string;
  user?: { name: string } | null;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="text-sm font-medium">
                {activity.user?.name || 'System'} — {activity.action.toLowerCase()} {activity.entityType}
              </p>
            </div>
            <p className="text-xs text-gray-500">{formatDateTime(activity.createdAt)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
