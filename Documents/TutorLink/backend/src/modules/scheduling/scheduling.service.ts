import { MeetingFormat } from "@prisma/client";
import { prisma } from "../../config/db";

export async function createSession(
  requestId: string,
  tutorId: string,
  tuteeId: string,
  scheduledAt: Date,
  location: string | null,
  format: MeetingFormat
) {
  return prisma.session.create({
    data: { requestId, tutorId, tuteeId, scheduledAt, location, format },
  });
}

export async function getUserSessions(userId: string) {
  return prisma.session.findMany({
    where: {
      OR: [{ tutorId: userId }, { tuteeId: userId }],
    },
    include: {
      request: { select: { courseSubject: true } },
      tutor: {
        include: { profile: { select: { displayName: true } } },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });
}

export async function completeSession(sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.tutorId !== userId && session.tuteeId !== userId) {
    throw new Error("Only session participants can complete a session.");
  }

  return prisma.session.update({
    where: { id: sessionId },
    data: { status: "COMPLETED" },
  });
}

export async function cancelSession(sessionId: string, userId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.tutorId !== userId && session.tuteeId !== userId) {
    throw new Error("Only session participants can cancel a session.");
  }

  return prisma.session.update({
    where: { id: sessionId },
    data: { status: "CANCELLED" },
  });
}

export async function sendSessionReminders() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingSessions = await prisma.session.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { gte: now, lte: in24h },
    },
    include: {
      request: { select: { courseSubject: true } },
    },
  });

  if (upcomingSessions.length === 0) return 0;

  const notifications = upcomingSessions.flatMap((s) => [
    {
      userId: s.tutorId,
      type: "SESSION_REMINDER",
      content: `Reminder: Your "${s.request.courseSubject}" tutoring session is scheduled for ${s.scheduledAt.toISOString()}.`,
    },
    {
      userId: s.tuteeId,
      type: "SESSION_REMINDER",
      content: `Reminder: Your "${s.request.courseSubject}" tutoring session is scheduled for ${s.scheduledAt.toISOString()}.`,
    },
  ]);

  const result = await prisma.notification.createMany({ data: notifications });

  return result.count;
}
