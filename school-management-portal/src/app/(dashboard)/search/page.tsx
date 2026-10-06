// src/app/(dashboard)/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Search, User, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({
    students: [],
    teachers: [],
    classes: [],
    vouchers: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      search(query);
    }
  }, [query]);

  const search = async (q: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Search</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search for students, teachers, classes..."
          className="pl-10"
          defaultValue={query}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length > 1) {
              search(value);
            }
          }}
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      )}

      {!loading && query.length > 1 && (
        <div className="space-y-4">
          {results.students.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Students ({results.students.length})</h3>
              <div className="space-y-2">
                {results.students.map((student: any) => (
                  <Link key={student.id} href={`/admin/students/${student.id}`}>
                    <Card className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-gray-400" />
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-sm text-gray-500">{student.studentId} • {student.class?.name}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.teachers.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Teachers ({results.teachers.length})</h3>
              <div className="space-y-2">
                {results.teachers.map((teacher: any) => (
                  <Card key={teacher.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{teacher.fullName}</p>
                        <p className="text-sm text-gray-500">{teacher.teacherId} • {teacher.specialization}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {results.vouchers.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Vouchers ({results.vouchers.length})</h3>
              <div className="space-y-2">
                {results.vouchers.map((voucher: any) => (
                  <Card key={voucher.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{voucher.voucherNumber}</p>
                        <p className="text-sm text-gray-500">
                          {voucher.student.fullName} • ${voucher.totalPayable.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {results.students.length === 0 &&
           results.teachers.length === 0 &&
           results.classes.length === 0 &&
           results.vouchers.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">No results found for "{query}"</p>
              <p className="text-sm text-gray-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
