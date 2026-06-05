# Stage 1: Notification System Design

## Problem understanding

The task is to build a priority inbox system for a campus notifications application. The application must fetch notifications from a protected API, assign priority based on notification type, sort them by priority and recency, and display the top 10 unread notifications.

## Priority rules

- Placement → priority 3 (highest)
- Result → priority 2
- Event → priority 1 (lowest)

## Sorting logic

1. Sort by type priority descending.
2. For notifications with the same type priority, sort by timestamp descending.

This ensures that the most critical and newest notifications appear first.

## Efficient top-10 maintenance

To maintain the top 10 efficiently as new notifications arrive, the implementation uses a fixed-size max-heap strategy (`heapq.nlargest`). This avoids sorting the entire notification stream when only the top N items are needed.

## Steps followed

1. Created the `stage1` project folder and `screenshots` subfolder.
2. Built `main.py` to fetch notifications from the protected API.
3. Used `BEARER_TOKEN` from environment variables so protected API access can be configured securely.
4. Implemented payload handling for API responses that contain a `notifications` field.
5. Normalized API response fields (`ID`, `Type`, `Message`, `Timestamp`) to the internal format used by the priority inbox.
6. Implemented fallback sample notifications in case the API is unavailable or returns `401 Unauthorized`.
6. Added sorting logic that converts timestamps to `datetime` and prioritizes notifications by type then recency.
7. Used `heapq.nlargest` to compute the top 10 notifications efficiently.
8. Printed the top 10 notifications in the required `Type | Message | Timestamp` format.
9. Generated `screenshots/output.png` from the program output.

## Output explanation

The program prints the top 10 notifications, each line formatted as:

```
Type | Message | Timestamp
```

If the API cannot be fetched due to authorization or connectivity issues, the program uses a sample notification list and still generates the same output format.
