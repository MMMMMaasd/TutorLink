import { MeetingFormat } from "@prisma/client";
import { prisma } from "../../config/db";

const WEIGHT_EXPERTISE = 0.4;
const WEIGHT_AVAILABILITY = 0.25;
const WEIGHT_FORMAT = 0.15;
const WEIGHT_BUDGET = 0.2;
const RATING_BONUS_MAX = 5;

interface AvailabilitySlot {
  day: string;
  start: string;
  end: string;
}

function isSlotArray(val: unknown): val is AvailabilitySlot[] {
  return (
    Array.isArray(val) &&
    val.every(
      (v) =>
        typeof v === "object" &&
        v !== null &&
        "day" in v &&
        "start" in v &&
        "end" in v
    )
  );
}

interface RequestInput {
  courseSubject: string;
  availabilitySlots: unknown;
  meetingFormat: MeetingFormat;
  budgetMin: number;
  budgetMax: number;
}

interface TutorProfileInput {
  areasOfExpertise: string[];
  selfReportedCourses: string[];
  availability: unknown;
  preferredFormat: MeetingFormat;
  hourlyRate: number | null;
}

export function computeMatchScore(
  request: RequestInput,
  tutorProfile: TutorProfileInput,
  tutorAverageRating: number | null
): number {

  const subject = request.courseSubject.toLowerCase();
  const pool = [
    ...tutorProfile.areasOfExpertise,
    ...tutorProfile.selfReportedCourses,
  ].map((s) => s.toLowerCase());

  let expertiseScore = 0;
  if (pool.includes(subject)) {
    expertiseScore = 100;
  } else if (pool.some((s) => subject.includes(s) || s.includes(subject))) {
    expertiseScore = 60;
  }

  let availabilityScore = 0;
  const reqSlots = request.availabilitySlots;
  const tutorSlots = tutorProfile.availability;

  if (isSlotArray(reqSlots) && isSlotArray(tutorSlots)) {
    const overlap = reqSlots.filter((rs) =>
      tutorSlots.some(
        (ts) => ts.day === rs.day && ts.start < rs.end && ts.end > rs.start
      )
    ).length;
    availabilityScore =
      reqSlots.length > 0
        ? Math.min((overlap / reqSlots.length) * 100, 100)
        : 0;
  }

  let formatScore = 0;
  if (
    tutorProfile.preferredFormat === request.meetingFormat ||
    tutorProfile.preferredFormat === "BOTH" ||
    request.meetingFormat === "BOTH"
  ) {
    formatScore = 100;
  }

  let budgetScore = 0;
  const rate = tutorProfile.hourlyRate;
  if (rate !== null && rate !== undefined) {
    if (rate >= request.budgetMin && rate <= request.budgetMax) {
      budgetScore = 100;
    } else {
      const range = request.budgetMax - request.budgetMin || 1;
      const distance =
        rate < request.budgetMin
          ? request.budgetMin - rate
          : rate - request.budgetMax;
      budgetScore = Math.max(0, 100 - (distance / range) * 100);
    }
  }

  const raw =
    expertiseScore * WEIGHT_EXPERTISE +
    availabilityScore * WEIGHT_AVAILABILITY +
    formatScore * WEIGHT_FORMAT +
    budgetScore * WEIGHT_BUDGET;

  const ratingBonus =
    tutorAverageRating !== null
      ? (tutorAverageRating / 5) * RATING_BONUS_MAX
      : 0;

  return Math.min(Math.round((raw + ratingBonus) * 100) / 100, 100);
}

export async function rankApplicants(requestId: string) {
  const request = await prisma.tutoringRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Tutoring request not found.");
  }

  const applications = await prisma.tutorApplication.findMany({
    where: { requestId, status: "PENDING" },
    include: { tutorProfile: true },
  });

  const scored = await Promise.all(
    applications.map(async (app) => {
      const ratingAgg = await prisma.review.aggregate({
        where: { revieweeId: app.tutorProfile.userId },
        _avg: { rating: true },
      });

      const score = computeMatchScore(
        request,
        app.tutorProfile,
        ratingAgg._avg.rating
      );

      await prisma.tutorApplication.update({
        where: { id: app.id },
        data: { matchScore: score },
      });

      return { ...app, matchScore: score };
    })
  );

  scored.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  return scored;
}

export async function notifyMatchingTutors(requestId: string) {
  const request = await prisma.tutoringRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Tutoring request not found.");
  }

  const matchingProfiles = await prisma.profile.findMany({
    where: {
      areasOfExpertise: { has: request.courseSubject },
      user: { role: { in: ["TUTOR", "BOTH"] } },
    },
    select: { userId: true },
  });

  if (matchingProfiles.length === 0) return 0;

  const notifications = matchingProfiles.map((p) => ({
    userId: p.userId,
    type: "NEW_MATCHING_REQUEST",
    content: `A new tutoring request for "${request.courseSubject}" has been posted: ${request.topicDescription}`,
  }));

  const result = await prisma.notification.createMany({ data: notifications });

  return result.count;
}
