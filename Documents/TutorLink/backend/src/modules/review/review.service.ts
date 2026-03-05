import { prisma } from "../../config/db";

export async function createReview(
  sessionId: string,
  reviewerId: string,
  revieweeId: string,
  rating: number,
  comment?: string
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error("Session not found.");
  }

  if (session.status !== "COMPLETED") {
    throw new Error(
      "Reviews can only be submitted after a session is completed."
    );
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const participants = [session.tutorId, session.tuteeId];
  if (!participants.includes(reviewerId)) {
    throw new Error("Only session participants can leave a review.");
  }

  if (!participants.includes(revieweeId)) {
    throw new Error("The reviewee must be a participant of the session.");
  }

  if (reviewerId === revieweeId) {
    throw new Error("You cannot review yourself.");
  }

  return prisma.review.create({
    data: { sessionId, reviewerId, revieweeId, rating, comment },
  });
}

export async function getReviewsForUser(userId: string) {
  return prisma.review.findMany({
    where: { revieweeId: userId },
    include: {
      reviewer: {
        include: { profile: { select: { displayName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAverageRating(userId: string) {
  const agg = await prisma.review.aggregate({
    where: { revieweeId: userId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    averageRating: agg._avg.rating,
    totalReviews: agg._count.rating,
  };
}

export async function flagReview(reviewId: string, _userId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: { isFlagged: true },
  });
}
