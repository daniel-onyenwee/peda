import apiResponse from "@utils/apiResponse"
import type { APIRoute } from "astro"

export const post: APIRoute = async ({ cookies, request }) => {
    let body:{ [name:string]: any } = null
    try {
        body = await request.json()
    } catch (error) {
        return apiResponse(
            401, 
            {
            ok: false,
            error: {
                message: "Missing api argument",
                code: 102
            },
            data: null
        })
    } finally {
        if (!body) {
            return apiResponse(
                401, 
                {
                ok: false,
                error: {
                    message: "Missing api argument",
                    code: 102
                },
                data: null
            })
        }
        for (const key in body) {
            cookies.set(key, body[key])
        }
        return apiResponse(200, {
            ok: true,
            error: null,
            data: body
        })
    }
}

export const del: APIRoute = async ({ cookies, request }) => {
    let body:{ sessionKeys: string[] } = null
    try {
        body = await request.json()
    } catch (error) {
        return apiResponse(
            401, 
            {
            ok: false,
            error: {
                message: "Missing api argument",
                code: 102
            },
            data: null
        })
    } finally {
        if (!body) {
            return apiResponse(
                401, 
                {
                ok: false,
                error: {
                    message: "Missing api argument",
                    code: 102
                },
                data: null
            })
        }
        if (Array.isArray(body.sessionKeys)) {
            body.sessionKeys.forEach(key => cookies.delete(key))
        }
        return apiResponse(200, {
            ok: true,
            error: null,
            data: null
        })
    }
}