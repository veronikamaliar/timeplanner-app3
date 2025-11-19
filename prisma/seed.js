const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedpassword',
        role: 'ADMIN',
        birthDate: '1990-01-01T00:00:00.000Z',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'User',
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'USER',
        birthDate: '2000-05-15T00:00:00.000Z',
    },
  });
  

  // Categories
 const category1 = await prisma.category.create({
    data: { name: "Work" },
  });

  const category2 = await prisma.category.create({
    data: { name: "Personal" },
  });

  // Tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Complete project",
      description: "",
      priority: "HIGH",
      userId: user1.id,
      categoryId: category1.id,
      dueDate: new Date("2025-10-30T00:00:00.000Z"),
      completed: false,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Buy groceries",
      description: "",
      priority: "LOW",
      userId: user2.id,
      categoryId: category2.id,
      completed: false,
    },
  });

  // Timelogs
 await prisma.timelog.create({
    data: {
      userId: user1.id,
      taskId: task1.id,
      startTime: new Date("2025-10-19T09:00:00"),
      endTime: new Date("2025-10-19T11:00:00"),
      duration: 2,
    },
  });

  await prisma.timelog.create({
    data: {
      userId: user2.id,
      taskId: task2.id,
      startTime: new Date("2025-10-19T15:00:00"),
      endTime: new Date("2025-10-19T16:30:00"),
      duration: 1.5,
    },
  });

  // Files
  await prisma.file.createMany({
    data: {
        filename: 'example1.pdf',
        originalName: 'example1.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: 'uploads/example1.pdf',
        uploadedBy: 1,
      },
    });
  await prisma.file.createMany({
    data: {
        filename: 'example2.png',
        originalName: 'example2.png',
        mimetype: 'image/png',
        size: 2048,
        path: 'uploads/example2.png',
        uploadedBy: 2,
    }
});

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
