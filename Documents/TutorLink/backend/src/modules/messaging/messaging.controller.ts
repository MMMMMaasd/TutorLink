import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as messagingService from "./messaging.service";

export async function createThreadController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { requestId, tutorUserId, tuteeUserId } = req.body;
    const thread = await messagingService.createThread(
      requestId,
      tutorUserId,
      tuteeUserId
    );
    res.status(201).json({ thread });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not create thread. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function sendMessageController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const threadId = req.params.threadId as string;
    const { receiverId, content } = req.body;
    const msg = await messagingService.sendMessage(
      threadId,
      req.userId!,
      receiverId,
      content
    );
    res.status(201).json({ message: msg });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not send message. Please try again.";
    res.status(400).json({ error: message });
  }
}

export async function getThreadMessagesController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const threadId = req.params.threadId as string;
    const messages = await messagingService.getThreadMessages(threadId);
    res.status(200).json({ messages });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch messages. Please try again.";
    res.status(500).json({ error: message });
  }
}

export async function getUserThreadsController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const threads = await messagingService.getUserThreads(req.userId!);
    res.status(200).json({ threads });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not fetch threads. Please try again.";
    res.status(500).json({ error: message });
  }
}
