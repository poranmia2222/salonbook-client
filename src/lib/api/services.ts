'use server'
import { authFetch, getSession, protectedMutation } from "../core/server";
import { Appointment, Service, User } from "../types/service";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SERVICE_REQUEST_TIMEOUT_MS = 15_000;

async function requestServiceJson<T>(
    path: string,
    allowNotFound = false
): Promise<T | undefined> {
    const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
    if (!baseUrl) {
        throw new Error("The services API URL is not configured.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        SERVICE_REQUEST_TIMEOUT_MS
    );

    try {
        const res = await fetch(`${baseUrl}/${path}`, {
            signal: controller.signal,
            cache: "no-store",
        });

        if (allowNotFound && res.status === 404) {
            return undefined;
        }

        if (!res.ok) {
            throw new Error(`The services request failed (${res.status}).`);
        }

        return (await res.json()) as T;
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error("The services server took too long to respond. Please try again.");
        }

        if (error instanceof TypeError) {
            throw new Error("Unable to connect to the services server. Check your connection and try again.");
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const getServices = async (query = ""): Promise<Service[]> => {
    const path = query ? `services?${query}` : "services";
    const services = await requestServiceJson<Service[]>(path);

    if (!Array.isArray(services)) {
        throw new Error("The services server returned an invalid response.");
    }

    return services;
}

export const getServiceById = async (id: string): Promise<Service | undefined> => {
    return requestServiceJson<Service>(`services/${encodeURIComponent(id)}`, true);
}

export async function createService(service: Omit<Service, "_id">): Promise<Service> {
    const session = await getSession();
    const role = session
        ? (session.user as typeof session.user & { role?: string }).role
        : undefined;

    if (!session?.user.id || role !== "admin") {
        throw new Error("Only administrators can add services.");
    }

    const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
    if (!baseUrl) {
        throw new Error("The services API URL is not configured.");
    }

    const response = await authFetch(`${baseUrl}/services`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
    });

    const result: unknown = await response.json().catch(() => undefined);

    if (!response.ok) {
        const message =
            typeof result === "object" &&
                result !== null &&
                "message" in result &&
                typeof result.message === "string"
                ? result.message
                : `Unable to add the service (${response.status}).`;
        throw new Error(
            message
        );
    }

    if (typeof result !== "object" || result === null) {
        throw new Error("The services server returned an invalid response.");
    }

    return result as Service;
}

export async function updateService(
    serviceId: string,
    service: Partial<Service>
): Promise<Service> {
    const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
    if (!baseUrl) {
        throw new Error("The services API URL is not configured.");
    }
    const api = `${baseUrl}/services/${encodeURIComponent(serviceId)}`;
    const response = await protectedMutation(api, "PATCH", service)

    const result = await response.json();
    if (!response.ok) {
        throw new Error(
            result.message || `Unable to update the service (${response.status}).`
        );
    }

    return result as Service;
}

export async function deleteService(serviceId: string): Promise<void> {
    const session = await getSession();
    const role = session
        ? (session.user as typeof session.user & { role?: string }).role
        : undefined;

    if (!session?.user.id || role !== "admin") {
        throw new Error("Only administrators can delete services.");
    }

    const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
    if (!baseUrl) {
        throw new Error("The services API URL is not configured.");
    }

    const api = `${baseUrl}/services/${encodeURIComponent(serviceId)}`;
    const response = await protectedMutation(api, "DELETE");

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(
            result?.message || `Unable to delete the service (${response.status}).`
        );
    }
}

export async function getMyAppointments(query = ""): Promise<Appointment[]> {
    const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
    if (!baseUrl) {
        throw new Error("The services API URL is not configured.");
    }

    const path = query ? `appointments?${query}` : "appointments";
    const response = await authFetch(`${baseUrl}/${path}`);

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(
            result?.message || `The appointments request failed (${response.status}).`
        );
    }

    let appointments: unknown;
    try {
        appointments = await response.json();
    } catch {
        throw new Error("The appointments server returned an invalid response.");
    }

    if (!Array.isArray(appointments)) {
        throw new Error("The appointments server returned an invalid response.");
    }

    return appointments;
}

export async function getMyAppointmentForUser(
    userId: string,
    appointmentId: string
): Promise<Appointment | undefined> {
    const query = new URLSearchParams({ applicantId: userId }).toString();
    const appointments = await getMyAppointments(query);

    return appointments.find(
        (appointment) =>
            appointment._id === appointmentId && appointment.userId === userId
    );
}

export async function getAppointment(): Promise<Appointment[]> {
    return getMyAppointments();
}

export async function getUsers(): Promise<User[]> {
    const api = `${BASE_URL}/users`
    const res = await authFetch(api)

    if (!res.ok) {
        throw new Error("Failed to fetch users")
    }

    const users = await res.json()
    if (!Array.isArray(users)) {
        throw new Error("The users server returned an invalid response.")
    }
    return users as User[]
}