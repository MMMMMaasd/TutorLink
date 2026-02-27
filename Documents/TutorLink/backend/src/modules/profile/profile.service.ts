import { MeetingFormat, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

interface CreateProfileData {
  displayName: string;
  bio?: string;
  selfReportedCourses?: string[];
  areasOfExpertise?: string[];
  hourlyRate?: number;
  availability?: Prisma.InputJsonValue;
  subjectsNeedingHelp?: string[];
  preferredFormat?: MeetingFormat;
}

export async function createProfile(userId: string, data: CreateProfileData) {
  return prisma.profile.create({
    data: {
      userId,
      displayName: data.displayName,
      bio: data.bio,
      selfReportedCourses: data.selfReportedCourses ?? [],
      areasOfExpertise: data.areasOfExpertise ?? [],
      hourlyRate: data.hourlyRate,
      availability: data.availability ?? undefined,
      subjectsNeedingHelp: data.subjectsNeedingHelp ?? [],
      preferredFormat: data.preferredFormat,
    },
  });
}

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      verifiedBadges: true,
      user: { select: { email: true, role: true } },
    },
  });

  if (!profile) return null;

  const ratingAgg = await prisma.review.aggregate({
    where: { revieweeId: userId },
    _avg: { rating: true },
  });

  return {
    ...profile,
    averageRating: ratingAgg._avg.rating,
  };
}

export async function updateProfile(
  userId: string,
  data: Prisma.ProfileUpdateInput
) {
  return prisma.profile.update({
    where: { userId },
    data,
  });
}

export async function uploadTranscript(
  profileId: string,
  courseCode: string,
  courseName: string,
  fileKey: string
) {
  return prisma.verifiedCourseBadge.create({
    data: { profileId, courseCode, courseName, transcriptFileKey: fileKey },
  });
}
