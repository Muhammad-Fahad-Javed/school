// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const adminPassword = await hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create Grades
  const grades = [
    { name: 'A+', minPercentage: 90, maxPercentage: 100, description: 'Excellent' },
    { name: 'A', minPercentage: 80, maxPercentage: 89, description: 'Very Good' },
    { name: 'B', minPercentage: 70, maxPercentage: 79, description: 'Good' },
    { name: 'C', minPercentage: 60, maxPercentage: 69, description: 'Average' },
    { name: 'D', minPercentage: 50, maxPercentage: 59, description: 'Below Average' },
    { name: 'F', minPercentage: 0, maxPercentage: 49, description: 'Fail' },
  ];

  for (const grade of grades) {
    await prisma.grade.upsert({
      where: { name: grade.name },
      update: {},
      create: grade,
    });
  }

  // Create Academic Session
  await prisma.academicSession.upsert({
    where: { name: '2025-2026' },
    update: {},
    create: {
      name: '2025-2026',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2026-05-31'),
      isActive: true,
    },
  });

  // Create Classes
  const classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
  for (const className of classes) {
    await prisma.class.upsert({
      where: { name: className },
      update: {},
      create: {
        name: className,
        grade: parseInt(className.split(' ')[1]),
      },
    });
  }

  // Create Sections
  const sections = ['A', 'B'];
  for (const section of sections) {
    for (const className of classes) {
      const classRecord = await prisma.class.findUnique({
        where: { name: className },
      });
      if (classRecord) {
        await prisma.section.upsert({
          where: {
            classId_name: {
              classId: classRecord.id,
              name: section,
            },
          },
          update: {},
          create: {
            name: section,
            classId: classRecord.id,
          },
        });
      }
    }
  }

  // Create Subjects
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Urdu'];
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.toUpperCase().replace(' ', '_') },
      update: {},
      create: {
        name: subject,
        code: subject.toUpperCase().replace(' ', '_'),
      },
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
