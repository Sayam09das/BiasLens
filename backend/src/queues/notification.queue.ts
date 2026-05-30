import { processNotificationJob } from "../jobs/notification.job.js";
import { createQueue } from "./queue-config.js";

export const notificationQueue = createQueue("notification.queue", processNotificationJob);
