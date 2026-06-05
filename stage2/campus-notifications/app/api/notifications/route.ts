import { NextResponse } from "next/server";

const API_ENDPOINT = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWExMjQ0QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjM4Nzg3LCJpYXQiOjE3ODA2Mzc4ODcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzOWU4MGQwOS0wMjkwLTQ1YWItYTIzNS01Mzg5NjNkYTI2N2EiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJqYXZ2YWppIHNhcml0aGEgcHJpeWEiLCJzdWIiOiJkOGMyMjRhNC04ZGUxLTRlMDYtOGJhNS0yMTFjNDdjNjQ4MmMifSwiZW1haWwiOiIyM2JxMWExMjQ0QHZ2aXQubmV0IiwibmFtZSI6ImphdnZhamkgc2FyaXRoYSBwcml5YSIsInJvbGxObyI6IjIzYnExYTEyNDQiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiJkOGMyMjRhNC04ZGUxLTRlMDYtOGJhNS0yMTFjNDdjNjQ4MmMiLCJjbGllbnRTZWNyZXQiOiJyWXZWbkVUZ0NzWm5uU0JtIn0.xjz4X4fhqwqReSs8ussbZ3hm8s0ea9I6yu3hCwW8aUQ";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const backendUrl = new URL(API_ENDPOINT);
  backendUrl.search = url.search;

  const response = await fetch(backendUrl.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
