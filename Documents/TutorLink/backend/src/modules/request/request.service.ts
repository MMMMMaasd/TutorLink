import { MeetingFormat, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

interface CreateRequestData {
  courseSubject: string;
  topicDescription: string;
  availabilitySlots: Prisma.InputJsonValue;
  meetingFormat: MeetingFormat;
  budgetMin: number;
  budgetMax: number;
}

export async function createRequest(tuteeId: string, data: CreateRequestData) {
  return prisma.tutoringRequest.create({
    data: {
      tuteeId,
      courseSubject: data.courseSubject,
      topicDescription: data.topicDescription,
      availabilitySlots: data.availabilitySlots,
      meetingFormat: data.meetingFormat,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
    },
  });
}

export async function getAllOpenRequests() {
  return prisma.tutoringRequest.findMany({
    where: { status: "OPEN" },
    include: {
      tutee: {
        include: { profile: { select: { displayName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRequestById(requestId: string) {
  return prisma.tutoringRequest.findUnique({
    where: { id: requestId },
    include: {
      tutee: {
        include: { profile: { select: { displayName: true } } },
      },
      applications: {
        include: {
          tutorProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  reviewsReceived: { select: { rating: true } },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function applyToRequest(
  requestId: string,
  tutorProfileId: string
) {
  try {
    return await prisma.tutorApplication.create({
      data: { requestId, tutorProfileId },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("You have already applied to this request.");
    }
    throw error;
  }
}

export async function acceptApplication(
  applicationId: string,
  tuteeId: string
) {
  const application = await prisma.tutorApplication.findUnique({
    where: { id: applicationId },
    include: { request: true, tutorProfile: true },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  if (application.request.tuteeId !== tuteeId) {
    throw new Error("Only the request owner can accept applications.");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.tutorApplication.update({
      where: { id: applicationId },
      data: { status: "ACCEPTED" },
    });

    await tx.tutoringRequest.update({
      where: { id: application.requestId },
      data: { status: "IN_PROGRESS" },
    });

    await tx.tutorApplication.updateMany({
      where: {
        requestId: application.requestId,
        id: { not: applicationId },
        status: "PENDING",
      },
      data: { status: "REJECTED" },
    });

    await tx.notification.create({
      data: {
        userId: application.tutorProfile.userId,
        type: "APPLICATION_ACCEPTED",
        content: `Your application for "${application.request.courseSubject}" has been accepted!`,
      },
    });

    return updated;
  });
}

export async function closeRequest(requestId: string, tuteeId: string) {
  const request = await prisma.tutoringRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Tutoring request not found.");
  }

  if (request.tuteeId !== tuteeId) {
    throw new Error("Only the request owner can close this request.");
  }

  return prisma.tutoringRequest.update({
    where: { id: requestId },
    data: { status: "CLOSED" },
  });
}
