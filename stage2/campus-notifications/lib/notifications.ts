export type NotificationType = "Event" | "Result" | "Placement";

export type NotificationRecord = {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
};

export type Notification = NotificationRecord & {
  weight: number;
  viewed?: boolean;
};

export const notificationTypes: NotificationType[] = ["Event", "Result", "Placement"];

export const notificationWeights: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const API_ENDPOINT = "/api/notifications";

function normalizeRecord(record: any): NotificationRecord {
  return {
    ID: record.ID || record.id || record.idValue || "",
    Type: (record.Type || record.type || record.notification_type || "Event") as NotificationType,
    Message: record.Message || record.message || record.text || "",
    Timestamp: record.Timestamp || record.timestamp || record.createdAt || "",
  };
}

export async function fetchNotifications(params: {
  limit?: number;
  page?: number;
  notification_type?: NotificationType | "";
  signal?: AbortSignal;
}): Promise<Notification[]> {
  const url = new URL(API_ENDPOINT);
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.notification_type) url.searchParams.set("notification_type", params.notification_type);

  const response = await fetch(url.toString(), {
    signal: params.signal,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const notifications: NotificationRecord[] = Array.isArray(data.notifications)
    ? data.notifications.map(normalizeRecord)
    : Array.isArray(data)
    ? data.map(normalizeRecord)
    : [];

  return notifications.map((record) => ({
    ...record,
    weight: notificationWeights[record.Type] ?? 0,
  }));
}

export function sortByPriority(notifications: Notification[]) {
  return [...notifications].sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    const aTime = new Date(a.Timestamp).getTime();
    const bTime = new Date(b.Timestamp).getTime();
    return bTime - aTime;
  });
}

export function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
