import type { APIRoute } from "astro"
import apiResponse from "@utils/apiResponse"
import { Temporal } from "@js-temporal/polyfill"
import supabaseClient from "@utils/supabaseClient"

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

        let { username: user_username,
            email: user_email,
            password,
            created_at 
        } = body as { username:string, email:string, password:string, created_at?:string }

        if (!user_email) {
            return apiResponse(401, {
                ok: false,
                data: null,
                error: {
                    code: 102,
                    message: "Missing api argument",
                    hint: "Api argument 'email' required"
                }
            })
        }

        if (!user_username) {
            return apiResponse(401, {
                ok: false,
                data: null,
                error: {
                    code: 102,
                    message: "Missing api argument",
                    hint: "Api argument 'username' required"
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

        if (!created_at) {
            created_at = Temporal.Now.zonedDateTimeISO().toString()
        }

        let checkUserDetailFunc = await supabaseClient
            .rpc("check_user_detail", { action: "signup", user_email, user_username })
            .limit(1)
            .single()

        if (checkUserDetailFunc.error) {
            return apiResponse(500, {
                ok: false,
                data: null,
                error: {
                    code: 103,
                    message: "Backend unexpected error"
                }
            })
        }

        let funcData:App.PostgresFunctionData = checkUserDetailFunc.data

        if (funcData.error) {
            return apiResponse(400, {
                ok: false,
                data: null,
                error: funcData.error
            })
        }

        const { data, error } = await supabaseClient.auth.admin.createUser({
            user_metadata: {
                password,
                created_at,
                username: user_username,
                email_confirmed: "false",
                metadata: {}
            },
            password,
            email: user_email,
            email_confirm: true
        })

        if (error) {
            return apiResponse(500, {
                ok: false,
                data: null,
                error: {
                    code: 103,
                    message: "Backend unexpected error"
                }
            })
        }

        const user:App.CookieUserData = {
            id: data.user?.id as string
        }

        return apiResponse(200, {
            ok: true,
            data: user,
            error: null
        })
    }
}