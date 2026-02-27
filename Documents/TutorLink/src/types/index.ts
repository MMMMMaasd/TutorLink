export enum Role {
  TUTOR = 'TUTOR',
  TUTEE = 'TUTEE',
  BOTH = 'BOTH',
}

export enum MeetingFormat {
  IN_PERSON = 'IN_PERSON',
  VIRTUAL = 'VIRTUAL',
  BOTH = 'BOTH',
}

export enum RequestStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  selfReportedCourses: string[];
  areasOfExpertise: string[];
  hourlyRate?: number;
  availability?: unknown;
  subjectsNeedingHelp: string[];
  preferredFormat: MeetingFormat;
  verifiedBadges?: VerifiedCourseBadge[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VerifiedCourseBadge {
  id: string;
  profileId: string;
  courseCode: string;
  courseName: string;
  verifiedAt: string;
}

export interface TutoringRequest {
  id: string;
  tuteeId: string;
  courseSubject: string;
  topicDescription: string;
  availabilitySlots: unknown;
  meetingFormat: MeetingFormat;
  budgetMin: number;
  budgetMax: number;
  status: RequestStatus;
  applications?: TutorApplication[];
  tutee?: { profile?: { displayName: string } };
  createdAt?: string;
  updatedAt?: string;
}

export interface TutorApplication {
  id: string;
  requestId: string;
  tutorProfileId: string;
  matchScore?: number;
  status: ApplicationStatus;
  tutorProfile?: Profile & { user?: Pick<User, 'id' | 'email'> };
  createdAt?: string;
}

export interface MessageThread {
  id: string;
  requestId?: string;
  messages?: Message[];
  createdAt?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  sender?: { profile?: { displayName: string } };
}

export interface Session {
  id: string;
  requestId: string;
  tutorId: string;
  tuteeId: string;
  scheduledAt: string;
  location?: string;
  format: MeetingFormat;
  status: SessionStatus;
  request?: { courseSubject: string };
  tutor?: { profile?: { displayName: string } };
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  isFlagged: boolean;
  reviewer?: { profile?: { displayName: string } };
  createdAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt?: string;
}
