"use client";

import { Notification } from "@/lib/notifications";
import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from "@mui/material";

type NotificationCardProps = {
  notification: Notification;
  viewed: boolean;
  onToggleViewed: (id: string) => void;
};

export default function NotificationCard({ notification, viewed, onToggleViewed }: NotificationCardProps) {
  const badgeLabel = viewed ? "Viewed" : "New";
  const badgeColor = viewed ? "success" : "error";
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
      <CardContent>
        <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "flex-start" }} spacing={2}>
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Stack sx={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }} spacing={1}>
              <Chip label={notification.Type} color={notification.Type === "Placement" ? "error" : notification.Type === "Result" ? "primary" : "info"} />
              <Chip label={badgeLabel} color={badgeColor} size="small" />
            </Stack>
            <Typography variant="h6" component="div" sx={{ wordBreak: "break-word" }}>
              {notification.Message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notification.Timestamp}
            </Typography>
          </Stack>
          <Stack spacing={1} sx={{ alignItems: "flex-end" }}>
            <Typography variant="caption" color="text.secondary">
              Priority {notification.weight}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
              {notification.ID}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onToggleViewed(notification.ID)}>
          {viewed ? "Mark as new" : "Mark as viewed"}
        </Button>
      </CardActions>
    </Card>
  );
}
