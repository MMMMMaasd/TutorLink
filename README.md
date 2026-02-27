# TutorLink

A peer-to-peer tutoring marketplace built for university students. Students can post tutoring requests as **Tutees** or apply to help others as **Tutors**. The platform handles the full workflow — from posting a request, getting matched with a tutor, messaging, scheduling sessions, all the way to leaving reviews.

## Team B8

| Name | NetID | Role |
|------|-------|------|
| Alan Zhang | yz10074 | Front-End / UX |
| Michael Bian | zb2253 | Back-End / Integration |
| Erfu Hai | eh3323 | Data / Infrastructure |
| David Rokicki | dr3492 | Backend Design / APIs |

> CS 4523 B — Senior Design Project, Spring 2026  
> NYU Tandon School of Engineering

## Tech Stack

**Frontend**
- React Native 0.84 + TypeScript
- React Navigation (native-stack + bottom-tabs)
- Axios for API calls
- AsyncStorage for local token persistence

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- JWT + bcrypt for authentication
- RESTful API design

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL running locally
- Xcode (for iOS simulator)
- CocoaPods

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file under `backend/`:
```
DATABASE_URL="postgresql://<your_user>@localhost:5432/tutorlink?schema=public"
JWT_SECRET="your-secret-here"
PORT=3000
```

Run database migrations and start the dev server:
```bash
npx prisma migrate dev
npm run dev
```

The API will be available at `http://localhost:3000/api`.

### Frontend Setup

```bash
# from project root
npm install
cd ios && pod install && cd ..
```

Start Metro bundler and run on iOS simulator:
```bash
npx react-native start --reset-cache
npx react-native run-ios
```

## Project Structure

```
TutorLink/
├── backend/
│   ├── prisma/              # Database schema & migrations
│   └── src/
│       ├── config/           # Prisma client singleton
│       ├── middleware/        # JWT auth middleware
│       ├── modules/
│       │   ├── auth/         # Registration, login, password reset
│       │   ├── profile/      # User profiles, transcript badges
│       │   ├── request/      # Tutoring requests & applications
│       │   ├── matching/     # Tutor ranking algorithm
│       │   ├── messaging/    # Message threads
│       │   ├── scheduling/   # Session management & reminders
│       │   └── review/       # Ratings & flagging
│       └── server.ts
└── src/                      # React Native frontend
    ├── api/                  # Axios client with interceptors
    ├── context/              # Auth state (Context + useReducer)
    ├── navigation/           # Stack & tab navigators
    ├── screens/              # All app screens
    ├── types/                # Shared TypeScript interfaces
    └── utils/                # Storage helpers
```

## Features

- **Email-gated registration** — only `.edu` emails allowed
- **Dual roles** — users can be a Tutor, Tutee, or Both
- **Tutoring requests** — post what you need help with, including subject, availability, format preference (in-person / virtual), and budget range
- **Smart matching** — weighted scoring algorithm that factors in expertise overlap, schedule compatibility, format preference, budget fit, and tutor ratings
- **In-app messaging** — private threads opened after a tutor application is accepted
- **Session scheduling** — book sessions with calendar view, automatic reminders 24h before
- **Review system** — mutual ratings after completed sessions, with flagging for moderation
- **Verified course badges** — tutors can upload transcript evidence for specific courses (files are never exposed to other users)

## API Endpoints

| Prefix | Module |
|--------|--------|
| `/api/auth` | Registration, login, password reset |
| `/api/profiles` | Profile CRUD, transcript upload |
| `/api/requests` | Request lifecycle, applications |
| `/api/matching` | Tutor ranking, notifications |
| `/api/messaging` | Threads, messages |
| `/api/scheduling` | Sessions, reminders |
| `/api/reviews` | Ratings, flagging |

## License

This project is part of a university course and is not intended for commercial use.
