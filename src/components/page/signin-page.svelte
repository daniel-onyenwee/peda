<script lang="ts">
    import { SigninTab } from "@components/tab"
    import { AlertBox } from "@components/ui"
    import { onMount } from "svelte"

    interface SignInEventDetail {
        usernameOrEmail: string
        password: string
    }

    export let apiKey:string
    export let browserTheme:App.Theme = "system"
    export let theme:App.Theme = "system"
    
    let loading:boolean = false
    let errorType:App.SigninErrorMessage = "none"
    let forgetPasswordLink:string = "#"
    let createAccountLink:string = "/signup"

    let showAlertBox:boolean = false
    let alertBoxTitle:string = String()
    let alertBoxContent:string = String()


    const signIn = async (e:CustomEvent<SignInEventDetail>) => {
        loading = true

        if (!window.navigator.onLine) {
            alertBoxTitle = "Connection Problem"
            alertBoxContent = "No internet connection detected"
            showAlertBox = true
            loading = false
            return
        }

        const { usernameOrEmail, password } = e.detail

        let response = await fetch("/api/auth/signin", { 
            method: "POST",
            body: JSON.stringify({
                username_or_email: usernameOrEmail,
                password,
            }),
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        })

        if (response.status == 500 || response.status == 401) {
            alertBoxTitle = "Server Error"
            alertBoxContent = "Sorry, Error detected at our end"
            showAlertBox = true
            loading = false
            return
        }

        let { data, error }:App.ApiResponseData = await response.json()

        if (error) {
            errorType = error.code == 205 ? "Username or email not found" : error.code == 207 ? "Incorrect password" : "none"
            loading = false
            return
        }

        if (data) {
            await fetch("/session", { 
                method: "POST",
                body: JSON.stringify({"user id": data.id, theme: "system"}),
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                }
            })
            errorType = "none"
            document.location.href = "/"
            loading = false
            return
        }
    }

    onMount(() => {
        const colorSchemeMediaMatcher = window.matchMedia("(prefers-color-scheme: dark)")
        theme = colorSchemeMediaMatcher.matches && browserTheme == "system" ? "dark" : "light"
        colorSchemeMediaMatcher.addEventListener("change", e => {
            if (browserTheme == "system") {
                if (e.matches)
                    theme = "dark"
                else
                    theme = "light"
            }
        })
    })
</script>
<main data-theme={theme}>
    <AlertBox 
        title={alertBoxTitle}
        content={alertBoxContent}
        show={showAlertBox}
        type="error"
        on:close={() => showAlertBox = false} 
        placement="right"
        closable />
    <section>
        <SigninTab 
            theme={theme} 
            width={100} 
            unit="%" 
            forgetPasswordLink={forgetPasswordLink}
            createAccountLink={createAccountLink}
            bind:errorType={errorType}
            on:signIn={signIn}
            loading={loading}/>
    </section>
</main>
<style lang="less">
    main {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #F5F4F4;
        section {
            height: 425px; 
            width: 392px;  
            @media screen and (min-width: 280px) {
                width: 95%;
            }
            @media screen and (min-width: 320px) {
                width: 93%;
            }
            @media screen and (min-width: 600px) {
                width: 392px;
            }
            @media screen and (min-width: 1024px) {
                width: 420px;
            }
        }
        &[data-theme="dark"] {
            background-color: #2F2F2F;
        }
        &[data-theme="system"] {
            @media screen and (prefers-color-scheme: dark) {
                background-color: #2F2F2F;
            }
        }
        
    }
</style>