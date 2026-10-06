// src/app/page.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser, getDashboardRoute } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const dashboardRoute = await getDashboardRoute(user.role);
  redirect(dashboardRoute);
}
