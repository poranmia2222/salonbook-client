"use server";

import { authFetch, getSession } from "@/lib/core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function bookAppointment(data: Record<string, unknown>) {
  const session = await getSession();
  const role = session
    ? (session.user as typeof session.user & { role?: string }).role
    : undefined;

  if (!session?.user.id || role !== "customer") {
    throw new Error("Sign in with a customer account to request an appointment.");
  }

  const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const appointment = {
    ...data,
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
  };
  const response = await authFetch(`${baseUrl}/appointment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Appointment request failed (${response.status})`
    );
  }

  return result;
}
