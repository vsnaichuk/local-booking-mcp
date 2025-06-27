import { jwtDecode } from "jwt-decode";
import { ApiError } from "./errors.js";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | undefined>
): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });
  return url.toString();
}

export function parseUserId(token: string): string {
  const decodedJwt = jwtDecode<{ people_user_id: string }>(token);
  return decodedJwt.people_user_id;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export async function makeRequest(
  url: string,
  options: RequestOptions = {}
): Promise<unknown> {
  const token = process.env.PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new ApiError("Missing personal access token", 401);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError("API error", response.status, response);
  }

  return parseResponseBody(response);
}
