const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getServices = async ()=>{
    const res = await fetch(`${BASE_URL}/services`)
    return res.json()
}