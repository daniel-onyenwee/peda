import apiResponse from "@utils/apiResponse"
import supabaseClient from "@utils/supabaseClient"
import type { APIRoute } from "astro"

const authenticationToken = import.meta.env.API_KEY

export const post: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get("authorization")
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return apiResponse(
            401, 
            {
            ok: false,
            error: {
                message: "No authentication token",
                code: 100
            },
            data: null
        })
    }
    
    if (token != authenticationToken) {
        return apiResponse(
            401, 
            {
            ok: false,
            error: {
                message: "Invalid authentication token",
                code: 101
            },
            data: null
        })
    }

    let body = null

    try {
        body = await request.json()
    } catch (error) {
        return apiResponse(
            401, 
            {
            ok: false,
            error: {
                message: "Missing api argument",
                hint: "Api arguments 'username', 'email' and 'password' required",
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
                    hint: "Api arguments 'username', 'email' and 'password' required",
                    code: 102
                },
                data: null
            })
        }

        let { 
            username_or_email,
            password
        } = body as { username_or_email:string, password:string }

        if (!username_or_email) {
            return apiResponse(401, {
                ok: false,
                data: null,
                error: {
                    code: 102,
                    message: "Missing api argument",
                    hint: "Api argument 'username_or_email' required"
                }
            })
        }

        if (!password) {
            return apiResponse(401, {
                ok: false,
                data: null,
                error: {
                    code: 102,
                    message: "Missing api argument",
                    hint: "Api argument 'password' required"
                }
            })
        }

        let signinUserFunc = await supabaseClient
            .rpc("signin_user", { username_or_email, user_password: password })
            .limit(1)
            .single()

        if (signinUserFunc.error) {
            return apiResponse(500, {
                ok: false,
                data: null,
                error: {
                    code: 103,
                    message: "Backend unexpected error"
                }
            })
        }

        let funcData:App.PostgresFunctionData = signinUserFunc.data

        if (funcData.error) {
            return apiResponse(400, {
                ok: false,
                data: null,
                error: funcData.error
            })
        }

        return apiResponse(200, {
            ok: true,
            data: funcData.data,
            error: null
        })
    }
}