// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  UserPlus,
  BookOpen,
  GraduationCap,
  Calendar,
  ClipboardList,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Clock,
  Award,
  DollarSign,
  Bell,
  File,
  FolderOpen,
} from 'lucide-react';

interface SidebarProps {
  user: {
    role: string;
    name: string;
  };
}

const menuItems = {
  ADMIN: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: UserCog, label: 'Teachers', href: '/admin/teachers' },
    { icon: UserPlus, label: 'Parents', href: '/admin/parents' },
    { icon: BookOpen, label: 'Classes', href: '/admin/classes' },
    { icon: GraduationCap, label: 'Subjects', href: '/admin/subjects' },
    { icon: Calendar, label: 'Attendance', href: '/admin/attendance' },
    { icon: ClipboardList, label: 'Examinations', href: '/admin/examinations' },
    { icon: FileText, label: 'Results', href: '/admin/results' },
    { icon: Award, label: 'Grade Reports', href: '/admin/grade-reports' },
    { icon: FolderOpen, label: 'Transcripts', href: '/admin/transcripts' },
    { icon: MessageSquare, label: 'Feedback', href: '/admin/feedback' },
    { icon: DollarSign, label: 'Fees', href: '/admin/fees' },
    { icon: CreditCard, label: 'Vouchers', href: '/admin/vouchers' },
    { icon: Clock, label: 'Timetable', href: '/admin/timetable' },
    { icon: File, label: 'Assignments', href: '/admin/assignments' },
    { icon: Bell, label: 'Announcements', href: '/admin/announcements' },
    { icon: FolderOpen, label: 'Documents', href: '/admin/documents' },
    { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ],
  TEACHER: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/teacher' },
    { icon: Users, label: 'My Classes', href: '/teacher/classes' },
    { icon: Users, label: 'Students', href: '/teacher/students' },
    { icon: Calendar, label: 'Attendance', href: '/teacher/attendance' },
    { icon: ClipboardList, label: 'Examinations', href: '/teacher/examinations' },
    { icon: FileText, label: 'Marks', href: '/teacher/marks' },
    { icon: MessageSquare, label: 'Feedback', href: '/teacher/feedback' },
    { icon: File, label: 'Assignments', href: '/teacher/assignments' },
    { icon: Clock, label: 'Timetable', href: '/teacher/timetable' },
    { icon: Bell, label: 'Announcements', href: '/teacher/announcements' },
  ],
  STUDENT: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student' },
    { icon: UserCog, label: 'My Profile', href: '/student/profile' },
    { icon: Calendar, label: 'Attendance', href: '/student/attendance' },
    { icon: FileText, label: 'Results', href: '/student/results' },
    { icon: Award, label: 'Grade Reports', href: '/student/grade-reports' },
    { icon: FolderOpen, label: 'Transcript', href: '/student/transcript' },
    { icon: MessageSquare, label: 'Feedback', href: '/student/feedback' },
    { icon: DollarSign, label: 'Fees', href: '/student/fees' },
    { icon: CreditCard, label: 'Vouchers', href: '/student/vouchers' },
    { icon: Clock, label: 'Timetable', href: '/student/timetable' },
    { icon: Bell, label: 'Announcements', href: '/student/announcements' },
    { icon: FolderOpen, label: 'Documents', href: '/student/documents' },
  ],
  PARENT: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/parent' },
    { icon: Users, label: 'Children', href: '/parent/children' },
    { icon: Calendar, label: 'Attendance', href: '/parent/attendance' },
    { icon: FileText, label: 'Results', href: '/parent/results' },
    { icon: Award, label: 'Grade Reports', href: '/parent/grade-reports' },
    { icon: MessageSquare, label: 'Feedback', href: '/parent/feedback' },
    { icon: DollarSign, label: 'Fees', href: '/parent/fees' },
    { icon: CreditCard, label: 'Vouchers', href: '/parent/vouchers' },
    { icon: Clock, label: 'Timetable', href: '/parent/timetable' },
    { icon: Bell, label: 'Announcements', href: '/parent/announcements' },
  ],
};

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = menuItems[user.role as keyof typeof menuItems] || [];

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900">School Portal</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/api/auth/logout"
          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
}
