import type { APIRoute } from "astro"

export const get: APIRoute = async ({ cookies, redirect }) => {
    cookies.delete("user")
    return redirect("/")
}