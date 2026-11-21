import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
}

export const getToken = async () => {
    const session = await getSession();

    if (!session || !session.session?.token) {
        redirect("/unauthorized");
    }

    return session.session.token;
};

export const authFetch = async (api: string, init: RequestInit = {}) => {
    const token = await getToken();
    const requestHeaders = new Headers(init.headers);
    requestHeaders.set("Authorization", `Bearer ${token}`);

    return fetch(api, {
        ...init,
        headers: requestHeaders,
        cache: "no-store",
    });
};



export const protectedMutation = async (api: string, method: string, data?: unknown) => {
    const token = await getToken();
    const res = await fetch(api, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : null
    })
    return res
}




export const requireRole = async (role: string) => {
    const session = await getSession();
    if (!session || session?.user.role !== role) {
        redirect('/unauthorized')
    }

}