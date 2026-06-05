const { Log } = require('../logger');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWExMjQ0QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjM4Nzg3LCJpYXQiOjE3ODA2Mzc4ODcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzOWU4MGQwOS0wMjkwLTQ1YWItYTIzNS01Mzg5NjNkYTI2N2EiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJqYXZ2YWppIHNhcml0aGEgcHJpeWEiLCJzdWIiOiJkOGMyMjRhNC04ZGUxLTRlMDYtOGJhNS0yMTFjNDdjNjQ4MmMifSwiZW1haWwiOiIyM2JxMWExMjQ0QHZ2aXQubmV0IiwibmFtZSI6ImphdnZhamkgc2FyaXRoYSBwcml5YSIsInJvbGxObyI6IjIzYnExYTEyNDQiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiJkOGMyMjRhNC04ZGUxLTRlMDYtOGJhNS0yMTFjNDdjNjQ4MmMiLCJjbGllbnRTZWNyZXQiOiJyWXZWbkVUZ0NzWm5uU0JtIn0.xjz4X4fhqwqReSs8ussbZ3hm8s0ea9I6yu3hCwW8aUQ";

// Priority weights
const WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

// Fetch all notifications
async function fetchNotifications() {
    await Log("frontend", "info", "api", "Fetching notifications from API");
    
    const response = await fetch(
        "http://4.224.186.213/evaluation-service/notifications",
        {
            headers: {
                "Authorization": `Bearer ${TOKEN}`
            }
        }
    );
    
    const data = await response.json();
    await Log("frontend", "info", "api", `Fetched ${data.notifications.length} notifications`);
    return data.notifications;
}

// Calculate priority score
function getPriorityScore(notification) {
    const weight = WEIGHTS[notification.Type] || 0;
    const timestamp = new Date(notification.Timestamp).getTime();
    return { ...notification, weight, timestamp };
}

// Get top N priority notifications
async function getTopNNotifications(n = 10) {
    await Log("frontend", "info", "service", `Getting top ${n} priority notifications`);
    
    const notifications = await fetchNotifications();
    
    // Add scores
    const scored = notifications.map(getPriorityScore);
    
    // Sort by weight first, then by recency
    const sorted = scored.sort((a, b) => {
        if (b.weight !== a.weight) {
            return b.weight - a.weight;
        }
        return b.timestamp - a.timestamp;
    });
    
    // Get top N
    const topN = sorted.slice(0, n);
    
    await Log("frontend", "info", "service", `Returning top ${n} notifications`);
    return topN;
}

// Main function
async function main() {
    console.log("=== PRIORITY INBOX - TOP 10 NOTIFICATIONS ===\n");
    
    const topNotifications = await getTopNNotifications(10);
    
    topNotifications.forEach((notification, index) => {
        console.log(`${index + 1}. [${notification.Type}] ${notification.Message}`);
        console.log(`   Time: ${notification.Timestamp}`);
        console.log(`   Priority Weight: ${notification.weight}`);
        console.log(`   ID: ${notification.ID}`);
        console.log("");
    });
}

main();