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

export async function getMyAppointments(query = ""): Promise<Appointment[]> {
    const res = await fetch(`${BASE_URL}/appointments?${query}`)
    return res.json()
}


export async function getAppointment(): Promise<Appointment[]> {
    const appointments = await requestServiceJson<Appointment[]>("appointments");

    if (!Array.isArray(appointments)) {
        throw new Error("The appointments server returned an invalid response.");
    }

    return appointments;
}