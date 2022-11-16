import type { APIRoute } from "astro"
import apiResponse from "@utils/apiResponse"
import supabaseClient from "@utils/supabaseClient"

const authenticationToken = import.meta.env.API_KEY

export const get: APIRoute = async ({ request, params }) => {
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

    let id = params.id

    const GetUserFunc = await supabaseClient
        .rpc("get_user", { user_id: id })
        .limit(1)
        .single()

    if (GetUserFunc.error) {
        return apiResponse(500, {
            ok: false,
            data: null,
            error: {
                code: 103,
                message: "Backend unexpected error"
            }
        })
    }

    let funcData:App.PostgresFunctionData = GetUserFunc.data

    return apiResponse(funcData.error ? 400 : 200, funcData)
}

export const post: APIRoute = async ({ request, params }) => {
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

    let id = params.id as string

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
            username,
            email,
            password,
            metadata
        } = body as { username:string, email:string, password:string, metadata:any }

        let updatedUserDetail:{
            [name:string]: any
        } = {}

        const VerifyUserUpdateDetail = await supabaseClient
            .rpc("verify_user_update_detail", { user_id: id, new_username: username, new_email: email })
            .limit(1)
            .single()

        if (VerifyUserUpdateDetail.error) {
            return apiResponse(500, {
                ok: false,
                data: null,
                error: {
                    code: 103,
                    message: "Backend unexpected error"
                }
            })
        }

        let funcData:App.PostgresFunctionData = VerifyUserUpdateDetail.data

        if (funcData.error) {
            return apiResponse(400, funcData)
        }

        if (email != funcData.data.email) {
            updatedUserDetail.email = email
            updatedUserDetail.user_metadata = {
                email_confirmed: "false"
            }
            funcData.data.email = email
        }
    
        if (username != funcData.data.username) {
            if (!("user_metadata" in updatedUserDetail)) {
                updatedUserDetail.user_metadata = {}
            }
            updatedUserDetail.user_metadata.username = username
            funcData.data.username = username
        }
    
        if (password != funcData.data.password) {
            if (!("user_metadata" in updatedUserDetail)) {
                updatedUserDetail.user_metadata = {}
            }
            updatedUserDetail.user_metadata.password = password
            updatedUserDetail.password = password
            funcData.data.password = password
        }
    
        if (metadata) {
            if (!("user_metadata" in updatedUserDetail)) {
                updatedUserDetail.user_metadata = {}
            }
            updatedUserDetail.user_metadata.metadata = metadata
            funcData.data.metadata = metadata
        }

        const { error } = await supabaseClient.auth.admin.updateUserById(id, updatedUserDetail)

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

        return apiResponse(200, funcData)
    }
}

export const del: APIRoute = async ({ request, params }) => {
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

    let id = params.id as string

    const GetUserFunc = await supabaseClient
        .rpc("get_user", { user_id: id })
        .limit(1)
        .single()
    
    if (GetUserFunc.error) {
        return apiResponse(500, {
            ok: false,
            data: null,
            error: {
                code: 103,
                message: "Backend unexpected error"
            }
        })
    }

    let funcData:App.PostgresFunctionData = GetUserFunc.data

    if (funcData.error) {
        return apiResponse(400, funcData)
    }
    
    const { error } = await supabaseClient.auth.admin.deleteUser(id)

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
    
    return apiResponse(200, funcData)
}