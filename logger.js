const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWExMjQ0QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjM4Nzg3LCJpYXQiOjE3ODA2Mzc4ODcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzOWU4MGQwOS0wMjkwLTQ1YWItYTIzNS01Mzg5NjNkYTI2N2EiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJqYXZ2YWppIHNhcml0aGEgcHJpeWEiLCJzdWIiOiJkOGMyMjRhNC04ZGUxLTRlMDYtOGJhNS0yMTFjNDdjNjQ4MmMifSwiZW1haWwiOiIyM2JxMWExMjQ0QHZ2aXQubmV0IiwibmFtZSI6ImphdnZhamkgc2FyaXRoYSBwcml5YSIsInJvbGxObyI6IjIzYnExYTEyNDQiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiJkOGMyMjRhNC04ZGUxLTRlMDYtOGJhNS0yMTFjNDdjNjQ4MmMiLCJjbGllbnRTZWNyZXQiOiJyWXZWbkVUZ0NzWm5uU0JtIn0.xjz4X4fhqwqReSs8ussbZ3hm8s0ea9I6yu3hCwW8aUQ";

async function Log(stack, level, packageName, message) {
    try {
        const response = await fetch(
            "http://4.224.186.213/evaluation-service/logs",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TOKEN}`
                },
                body: JSON.stringify({
                    stack: stack,
                    level: level,
                    package: packageName,
                    message: message
                })
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Logging failed:", error);
    }
}

module.exports = { Log };