// src/app/(dashboard)/admin/settings/page.tsx
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default async function SettingsPage() {
  await requireRole('ADMIN');

  const settings = await prisma.schoolSettings.findFirst();
  const grades = await prisma.grade.findMany({
    orderBy: { minPercentage: 'desc' },
  });
  const academicSessions = await prisma.academicSession.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">School Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">School Information</h3>
          <form className="space-y-4">
            <Input
              label="School Name"
              defaultValue={settings?.schoolName || ''}
            />
            <Input
              label="Address"
              defaultValue={settings?.address || ''}
            />
            <Input
              label="Phone"
              defaultValue={settings?.phone || ''}
            />
            <Input
              label="Email"
              type="email"
              defaultValue={settings?.email || ''}
            />
            <Input
              label="Website"
              defaultValue={settings?.website || ''}
            />
            <Input
              label="Principal Name"
              defaultValue={settings?.principalName || ''}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Grading System</h3>
          <div className="space-y-3">
            {grades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="font-medium">{grade.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {grade.minPercentage}% - {grade.maxPercentage}%
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            ))}
            <Button className="w-full mt-4">Add New Grade</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Academic Sessions</h3>
          <div className="space-y-3">
            {academicSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="font-medium">{session.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
                  </span>
                  {session.isActive && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  {!session.isActive && (
                    <Button size="sm">Activate</Button>
                  )}
                </div>
              </div>
            ))}
            <Button className="w-full mt-4">Create New Session</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
              </div>
              <Button variant="destructive">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup Database</p>
                <p className="text-sm text-gray-500">Create a backup of all data</p>
              </div>
              <Button>Create Backup</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export All Data</p>
                <p className="text-sm text-gray-500">Export all data as CSV</p>
              </div>
              <Button variant="outline">Export</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
