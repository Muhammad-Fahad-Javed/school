// src/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
