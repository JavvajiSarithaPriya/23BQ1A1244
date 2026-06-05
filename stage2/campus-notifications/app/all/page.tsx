"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchNotifications, Notification, NotificationType, notificationTypes, formatTimestamp } from "@/lib/notifications";
import { useViewedNotifications } from "@/lib/useViewedNotifications";
import NotificationCard from "@/components/NotificationCard";
import PageShell from "@/components/PageShell";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState("1");
  const [typeFilter, setTypeFilter] = useState<"" | NotificationType>("");
  const [refresh, setRefresh] = useState(0);
  const { viewedIds, isViewed, markViewed, markAllViewed, toggleViewed } = useViewedNotifications();

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setError("");

    fetchNotifications({
      limit: Number(limit) || undefined,
      page: Number(page) || undefined,
      notification_type: typeFilter || undefined,
      signal: abortController.signal,
    })
      .then((data) => {
        setNotifications(
          data.map((item) => ({
            ...item,
            Timestamp: formatTimestamp(item.Timestamp),
          }))
        );
      })
      .catch((err) => {
        if (!abortController.signal.aborted) {
          setError(err?.message || "Unable to load notifications.");
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    return () => abortController.abort();
  }, [limit, page, typeFilter, refresh]);

  const markAll = () => {
    markAllViewed(notifications.map((notification) => notification.ID));
  };

  const totalNew = useMemo(
    () => notifications.filter((notification) => !isViewed(notification.ID)).length,
    [notifications, viewedIds]
  );

  return (
    <PageShell
      title="All Notifications"
      subtitle="Browse all notifications and filter by type, page, and list size. New notifications are highlighted for quick review."
    >
      <Stack spacing={3}>
        <Stack sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: "flex-end" }} spacing={2}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="filter-label">Notification Type</InputLabel>
            <Select
              labelId="filter-label"
              value={typeFilter}
              label="Notification Type"
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <MenuItem value="">All types</MenuItem>
              {notificationTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Limit"
            type="number"
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
            sx={{ width: 140 }}
          />
          <TextField
            label="Page"
            type="number"
            value={page}
            onChange={(event) => setPage(event.target.value)}
            sx={{ width: 140 }}
          />
          <Button variant="contained" onClick={() => setRefresh((current) => current + 1)}>
            Refresh
          </Button>
          <Button variant="outlined" onClick={markAll} disabled={!notifications.length}>
            Mark all viewed
          </Button>
        </Stack>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Typography variant="body1">Showing {notifications.length} notifications</Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {totalNew} new
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <Stack>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.ID}
                notification={notification}
                viewed={isViewed(notification.ID)}
                onToggleViewed={toggleViewed}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </PageShell>
  );
}
