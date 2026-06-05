# Stage 1 - Notification System Design

## Problem understanding

The task is to build a priority inbox system for a campus notifications application. The application must fetch notifications from a protected API, assign priority based on notification type, sort them by priority and recency, and display the top N (default 10) unread notifications.

## Priority rules

- Placement → priority 3 (highest)
- Result → priority 2
- Event → priority 1 (lowest)

## Sorting logic

1. Sort by type priority descending.
2. For notifications with the same type priority, sort by timestamp descending (newest first).

This ensures that the most critical and newest notifications appear first.

## Efficient top-N maintenance

To maintain the top N efficiently as new notifications arrive, the implementation can use a fixed-size heap strategy (`heapq.nlargest` in Python) or partial sorting in JavaScript (e.g., maintain a sorted array of size N). For this project we used JavaScript and computed the top N by sorting the fetched list since the dataset size is manageable for the evaluation.

## Implementation details

- Language: JavaScript (Node.js) for Stage 1; Stage 2 will use Next.js + TypeScript + Material UI for the frontend.
- API access: requests include the provided bearer token in the `Authorization` header.
- Normalization: convert API fields to an internal format with `ID`, `Type`, `Message`, and `Timestamp`.
- Priority calculation: map `Type` → weight and attach a numeric timestamp for sorting.

## Steps followed

1. Created the `stage1` project folder and `screenshots` subfolder.
2. Added `logger.js` for sending logs to the evaluation service.
3. Implemented `priority_inbox.js` to fetch notifications, compute priority scores, sort and return the top N notifications.
4. Saved the script output to `stage1/screenshots/output.txt`.

## Output format

Each top notification is printed as:

```
Type | Message | Timestamp
```

If the API cannot be fetched due to authorization or connectivity issues, the script logs the error and may fall back to a sample notification list for demonstration.

## Notes

- Token expiration: the evaluation token may expire; regenerate if requests return `401 Unauthorized`.
- Stage 2: scaffold a Next.js + TypeScript app at `stage2/campus-notifications`, implement pages for All Notifications and Priority Notifications, filtering and pagination using `limit`, `page`, and `notification_type` query parameters.

