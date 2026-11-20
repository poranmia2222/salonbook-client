import { Service } from "../types/service";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getServices = async (query = ""): Promise<Service[]> => {
    const res = await fetch(`${BASE_URL}/services?${query}`)
    return res.json()
}
export const getServiceById = async (id: string): Promise<Service | undefined> => {
    const services = await fetch(`${BASE_URL}/services/${id}`)
    return services.json()
}