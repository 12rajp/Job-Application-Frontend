import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiRequest<TResponse, TBody = undefined>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: TBody
    token?: string
  }
): Promise<TResponse> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.token && {
        Authorization: `Bearer ${options.token}`,
      }),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  })

  const data: unknown = await res.json()

  if (!res.ok) {
    if (typeof data === "object" && data !== null && "message" in data) {
      throw new Error(String((data as { message: string }).message))
    }
    throw new Error("Request failed")
  }

  return data as TResponse
}
