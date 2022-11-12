// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
        type Theme = "light"|"dark"|"system"

        type SigninErrorMessage = "none"|
        "Username or email and password not filled"|
        "Username or email not filled"|
        "Password not filled"|
        "Username or email not found"|
        "Incorrect password"|
        "both"

        type SignupErrorMessage = "none"|
        "Email already exist"|
        "Username already exist"|
        "Username and email already exist"|
        "Username and email and password not filled"|
        "Username and email not filled"|
        "Username and password not filled"|
        "Email and password not filled"|
        "Username not filled"|
        "Email not filled"|
        "Password not filled"|
        "Incorrect password format"|
        "Incorrect email format"|
        "Incorrect username format"

        interface Locals {
                user: {
                        username: string
                        password: string
                        id: string
                        confirm_email: boolean
                        email: string
                } | null
        }
}
