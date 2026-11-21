"use server";

import { protectedMutation } from "../core/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const deleteAppointment = async (appointmentId: string) => {
  const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const api = `${baseUrl}/appointment/${encodeURIComponent(appointmentId)}`;
  const res = await protectedMutation(api, "DELETE");
  if (!res.ok) {
    const result = await res.json().catch(() => null);
    throw new Error(
      result?.message || `Unable to delete the appointment (${res.status}).`
    );
  }

  return res.json()
}


export const updateAppointment = async (appointmentId: string, status:string) =>{
  const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const api = `${baseUrl}/appointment/${encodeURIComponent(appointmentId)}`;
  const res = await protectedMutation(api, "PATCH", { status });
  if (!res.ok) {
    const result = await res.json().catch(() => null);
    throw new Error(
      result?.message || `Unable to update the appointment (${res.status}).`
    );
  }

  return res.json()
}


export const verifyCheckoutPayment = async (sessionId: string) => {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const res = await fetch(`${BASE_URL}/payments/checkout-verify`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
    cache: "no-store",
  });

  const result = await res.json();

  console.log("Payment API response:", result);
  console.log("Payment API status:", res.status);

  if (!res.ok) {
    throw new Error(
      result.message || `Payment verification failed (${res.status})`
    );
  }

  return result;
};