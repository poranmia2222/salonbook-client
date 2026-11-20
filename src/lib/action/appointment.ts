import { methods } from "better-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function bookAppointment(data: Record<string, unknown>) {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const res = await fetch(`${BASE_URL}/appointment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || `Appointment request failed (${res.status})`
    );
  }

  return result;
}


export const deleteAppointment = async (appointmentId: string) => {
  const res = await fetch(`${BASE_URL}/appointment/${appointmentId}`, {
    method: "DELETE"
  })
  return res.json()
}

export const updateAppointment = async (appointmentId: string, status:string) =>{
  const res = await fetch(`${BASE_URL}/appointment/${appointmentId}`,{
    method: "PATCH",
    headers:{
      "Content-Type":'application/json'
    },
    body:JSON.stringify({status})
  })
  return res.json()
}