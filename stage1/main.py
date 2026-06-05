import heapq
import json
import os
from datetime import datetime
from typing import List, Dict, Any

import requests
from PIL import Image, ImageDraw, ImageFont

API_URL = "http://4.224.186.213/evaluation-service/notifications"
BEARER_TOKEN = os.getenv("BEARER_TOKEN", "")
OUTPUT_IMAGE_PATH = "screenshots/output.png"
TOP_N = 10

PRIORITY_MAP = {
    "Placement": 3,
    "Result": 2,
    "Event": 1,
}

SAMPLE_NOTIFICATIONS = [
    {
        "id": 1,
        "type": "Placement",
        "message": "Interview scheduled for campus drive.",
        "timestamp": "2026-06-05T10:30:00Z",
    },
    {
        "id": 2,
        "type": "Result",
        "message": "Semester results declared online.",
        "timestamp": "2026-06-05T09:00:00Z",
    },
    {
        "id": 3,
        "type": "Event",
        "message": "Workshop reminder: resume building.",
        "timestamp": "2026-06-04T18:00:00Z",
    },
    {
        "id": 4,
        "type": "Placement",
        "message": "Placement drive registration closes today.",
        "timestamp": "2026-06-05T11:15:00Z",
    },
    {
        "id": 5,
        "type": "Event",
        "message": "Cultural fest passes available.",
        "timestamp": "2026-06-05T08:45:00Z",
    },
]


def parse_timestamp(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def normalize_notification(notification: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": notification.get("id") or notification.get("ID"),
        "type": notification.get("type") or notification.get("Type") or "Event",
        "message": notification.get("message") or notification.get("Message") or "",
        "timestamp": notification.get("timestamp") or notification.get("Timestamp") or "",
    }


def add_priority(notification: Dict[str, Any]) -> Dict[str, Any]:
    notification["priority"] = PRIORITY_MAP.get(notification.get("type", "Event"), 0)
    notification["parsed_timestamp"] = parse_timestamp(notification["timestamp"])
    return notification


def fetch_notifications() -> List[Dict[str, Any]]:
    if not BEARER_TOKEN:
        print("WARNING: No BEARER_TOKEN configured. Using fallback sample notifications.")
        return SAMPLE_NOTIFICATIONS

    headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
    try:
        response = requests.get(API_URL, headers=headers, timeout=15)
        response.raise_for_status()
        payload = response.json()
        if isinstance(payload, dict) and "notifications" in payload:
            notifications = payload["notifications"]
        else:
            notifications = payload

        if not isinstance(notifications, list):
            raise ValueError("API returned unexpected payload")
        return notifications
    except requests.HTTPError as http_err:
        print(f"WARNING: API request failed with status {http_err.response.status_code}. Using fallback sample notifications.")
    except Exception as err:
        print(f"WARNING: Could not fetch notifications: {err}. Using fallback sample notifications.")
    return SAMPLE_NOTIFICATIONS


def get_top_notifications(notifications: List[Dict[str, Any]], top_n: int = TOP_N) -> List[Dict[str, Any]]:
    processed = [add_priority(normalize_notification(n.copy())) for n in notifications]
    return heapq.nlargest(
        top_n,
        processed,
        key=lambda n: (n["priority"], n["parsed_timestamp"]),
    )


def format_notifications(notifications: List[Dict[str, Any]]) -> List[str]:
    lines = ["Type | Message | Timestamp"]
    for notification in notifications[:TOP_N]:
        lines.append(
            f"{notification['type']} | {notification['message']} | {notification['timestamp']}"
        )
    return lines


def render_output_image(lines: List[str], path: str) -> None:
    font = ImageFont.load_default()
    padding = 12
    sample_bbox = ImageDraw.Draw(Image.new("RGB", (1, 1))).textbbox((0, 0), lines[0], font=font)
    line_height = sample_bbox[3] - sample_bbox[1] + 6
    width = max(ImageDraw.Draw(Image.new("RGB", (1, 1))).textbbox((0, 0), line, font=font)[2] for line in lines) + padding * 2
    height = line_height * len(lines) + padding * 2

    image = Image.new("RGB", (width, height), color="white")
    draw = ImageDraw.Draw(image)

    y = padding
    for line in lines:
        draw.text((padding, y), line, fill="black", font=font)
        y += line_height

    image.save(path)
    print(f"Screenshot saved to {path}")


def main() -> None:
    notifications = fetch_notifications()
    top_notifications = get_top_notifications(notifications)
    lines = format_notifications(top_notifications)
    print("\n".join(lines))
    render_output_image(lines, OUTPUT_IMAGE_PATH)


if __name__ == "__main__":
    main()
