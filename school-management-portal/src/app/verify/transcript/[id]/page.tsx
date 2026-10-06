// src/app/verify/transcript/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

export default async function VerifyTranscriptPage({ params }: { params: { id: string } }) {
  const transcript = await prisma.transcript.findFirst({
    where: { verificationId: params.id },
    include: { student: true, academicSession: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        {transcript ? (
          <>
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <h1 className="text-xl font-bold mt-4">Transcript Verified</h1>
            <div className="mt-6 text-left space-y-2 text-sm">
              <p><span className="text-gray-500">Student:</span> {transcript.student.fullName}</p>
              <p><span className="text-gray-500">Transcript No:</span> {transcript.transcriptNumber}</p>
              <p><span className="text-gray-500">Session:</span> {transcript.academicSession.name}</p>
              <p><span className="text-gray-500">Issued:</span> {formatDate(transcript.issueDate)}</p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-500" size={48} />
            <h1 className="text-xl font-bold mt-4">Transcript Not Found</h1>
            <p className="text-gray-600 mt-2">
              This verification code doesn't match any transcript in our records.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
