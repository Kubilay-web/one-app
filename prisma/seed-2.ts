import { PrismaClient, ProjectStatus, TaskStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

const USER_ID = "r5zzt4xb3j4lgesi";

async function main() {
  /* ---------------- ACCOUNT PROJECT ---------------- */
  for (let i = 1; i <= 20; i++) {
    await prisma.accountProject.create({
      data: {
        userId: USER_ID,
        type: "oauth",
        provider: "google",
        providerAccountId: `google-${i}`,
      },
    });
  }

  /* ---------------- FOLDER + FILE ---------------- */
  for (let i = 1; i <= 20; i++) {
    const folder = await prisma.folder.create({
      data: {
        name: `Folder ${i}`,
        userId: USER_ID,
      },
    });

    await prisma.file.create({
      data: {
        name: `File ${i}`,
        type: "image/png",
        url: "https://picsum.photos/200",
        size: 2048,
        folderId: folder.id,
      },
    });
  }

  /* ---------------- PORTFOLIO PROFILE ---------------- */
  await prisma.portfolioProfile.create({
    data: {
      userId: USER_ID,
      name: "Main User",
      location: "Istanbul",
      projectCount: 20,
      email: "mainuser@test.com",
      bookingLink: "https://cal.com/test",
      description: "Main portfolio profile",
    },
  });

  /* ---------------- PROJECT ---------------- */
  const projects = [];
  for (let i = 1; i <= 20; i++) {
    const project = await prisma.project.create({
      data: {
        name: `Project ${i}`,
        slug: `project-${i}`,
        description: "Seeded project",
        clientId: USER_ID,
        userId: USER_ID,
        status: ProjectStatus.ONGOING,
      },
    });
    projects.push(project);
  }

  /* ---------------- MODULE + TASK ---------------- */
  for (let i = 0; i < 20; i++) {
    const module = await prisma.module.create({
      data: {
        name: `Module ${i + 1}`,
        projectId: projects[i].id,
        userId: USER_ID,
        userName: "Main User",
      },
    });

    await prisma.task.create({
      data: {
        title: `Task ${i + 1}`,
        status: TaskStatus.TODO,
        moduleId: module.id,
      },
    });
  }

  /* ---------------- PROJECT COMMENT ---------------- */
  for (let i = 0; i < 20; i++) {
    await prisma.projectComment.create({
      data: {
        content: "Seed comment",
        projectId: projects[i].id,
        userId: USER_ID,
        userName: "Main User",
        userRole: Role.USER,
      },
    });
  }

  /* ---------------- MEMBER ---------------- */
  for (let i = 1; i <= 20; i++) {
    await prisma.member.create({
      data: {
        name: `Member ${i}`,
        email: `member${i}@mail.com`,
        role: "Developer",
        projectId: projects[i - 1].id,
      },
    });
  }

  /* ---------------- INVOICE ---------------- */
  for (let i = 1; i <= 20; i++) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${i}`,
        amount: 1000,
        status: "PAID",
        dueDate: new Date(),
        projectId: projects[i - 1].id,
        userId: USER_ID,
      },
    });
  }

  /* ---------------- PAYMENT ---------------- */
  for (let i = 1; i <= 20; i++) {
    await prisma.payment.create({
      data: {
        title: `Payment ${i}`,
        amount: 1000,
        tax: 18,
        invoiceNumber: `PAY-${i}`,
        method: "CARD",
        userId: USER_ID,
        projectId: projects[i - 1].id,
        clientId: USER_ID,
      },
    });
  }

  /* ---------------- PORTFOLIO ITEM ---------------- */
  for (let i = 1; i <= 20; i++) {
    await prisma.portfolioItem.create({
      data: {
        title: `Portfolio Item ${i}`,
        description: "Seeded portfolio item",
        imageUrl: "https://picsum.photos/300",
        projectUrl: "https://example.com",
        userId: USER_ID,
      },
    });
  }

  /* ---------------- SUBSCRIBER ---------------- */
  for (let i = 1; i <= 20; i++) {
    await prisma.subscriber.create({
      data: {
        email: `subscriber${i}@mail.com`,
        userId: USER_ID,
      },
    });
  }

  /* ---------------- CATEGORY PROJECT ---------------- */
  await prisma.categoryProject.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({
      title: `Category ${i + 1}`,
      slug: `category-${i + 1}`,
      imageUrl: "https://picsum.photos/400",
      description: "Seed category",
    })),
  });

  console.log("✅ ALL DATA SEEDED FOR USER:", USER_ID);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
