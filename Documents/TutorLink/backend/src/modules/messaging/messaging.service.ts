import { prisma } from "../../config/db";

export async function createThread(
  requestId: string,
  _tutorUserId: string,
  _tuteeUserId: string
) {
  return prisma.messageThread.create({
    data: { requestId },
  });
}

export async function sendMessage(
  threadId: string,
  senderId: string,
  receiverId: string,
  content: string
) {
  return prisma.message.create({
    data: { threadId, senderId, receiverId, content },
  });
}

export async function getThreadMessages(threadId: string) {
  return prisma.message.findMany({
    where: { threadId },
    include: {
      sender: {
        include: { profile: { select: { displayName: true } } },
      },
    },
    orderBy: { sentAt: "asc" },
  });
}

export async function getUserThreads(userId: string) {
  const threads = await prisma.messageThread.findMany({
    where: {
      messages: {
        some: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      },
    },
    include: {
      messages: {
        orderBy: { sentAt: "desc" },
        take: 1,
        include: {
          sender: {
            include: { profile: { select: { displayName: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return threads;
}
