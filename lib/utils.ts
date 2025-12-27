// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function apiRequest<TResponse, TBody = undefined>(
//   endpoint: string,
//   options?: {
//     method?: "GET" | "POST" | "PUT" | "DELETE";
//     body?: TBody;
//   }
// ): Promise<TResponse> {
//   const res = await fetch(`${API_URL}${endpoint}`, {
//     method: options?.method ?? "GET",
//     credentials: 'include',
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: options?.body ? JSON.stringify(options.body) : undefined,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data?.message || "Request failed");
//   }

//   return data as TResponse;
// }
