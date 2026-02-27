import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import requestRoutes from './modules/request/request.routes';
import matchingRoutes from './modules/matching/matching.routes';
import messagingRoutes from './modules/messaging/messaging.routes';
import schedulingRoutes from './modules/scheduling/scheduling.routes';
import reviewRoutes from './modules/review/review.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TutorLink API server running on port ${PORT}`);
});
