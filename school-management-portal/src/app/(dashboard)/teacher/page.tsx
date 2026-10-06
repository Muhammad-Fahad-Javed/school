// src/app/(dashboard)/teacher/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/Card';

export default async function TeacherDashboard() {
  const user = await requireAuth();

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      classTeacherOf: {
        include: {
          students: true,
        },
      },
      subjects: true,
    },
  });

  if (!teacher) {
    return <div>Teacher profile not found</div>;
  }

  const totalStudents = teacher.classTeacherOf?.students.length || 0;
  const totalClasses = teacher.classTeacherOf ? 1 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">My Classes</p>
          <p className="text-2xl font-bold">{totalClasses}</p>
          {teacher.classTeacherOf && (
            <p className="text-xs text-gray-500">{teacher.classTeacherOf.name}</p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Subjects</p>
          <p className="text-2xl font-bold">{teacher.subjects.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Today's Classes</p>
          <p className="text-2xl font-bold">4</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              📋 Mark Attendance
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              📝 Enter Marks
            </button>
            <button className="w-full text-left px-4 py-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              📄 Add Feedback
            </button>
            <button className="w-full text-left px-4 py-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              📎 Create Assignment
            </button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="border-b pb-2">
              <p className="text-sm">Attendance marked for Grade 3-A</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="border-b pb-2">
              <p className="text-sm">Exam results published for Mathematics</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
            <div>
              <p className="text-sm">New assignment created: Homework #5</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
