import { Appointment, Service } from "../types/service";

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
    const baseUrl = BASE_URL?.trim().replace(/\/+$/, "");
    if (!baseUrl) {
        throw new Error("The services API URL is not configured.");
    }

    const response = await fetch(`${baseUrl}/services`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
        cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || `Unable to add the service (${response.status}).`
        );
    }

    return result as Service;
}

export async function getMyAppointments(query = ""): Promise<Appointment[]> {
    const path = query ? `appointments?${query}` : "appointments";
    const appointments = await requestServiceJson<Appointment[]>(path);

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
    const appointments = await requestServiceJson<Appointment[]>("appointments");

    if (!Array.isArray(appointments)) {
        throw new Error("The appointments server returned an invalid response.");
    }

    return appointments;
}