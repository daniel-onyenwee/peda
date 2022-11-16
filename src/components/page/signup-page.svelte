<script lang="ts">
    import { SignupTab } from "@components/tab"
    import { AlertBox } from "@components/ui"
    import { Temporal } from "@js-temporal/polyfill"
    import { onMount } from "svelte"

    interface SignUpEventDetail {
        username: string,
        email: string,
        password: string
    }

    export let apiKey:string
    export let browserTheme:App.Theme = "system"
    export let theme:App.Theme = "system"
    
    let loading:boolean = false
    let errorType:App.SignupErrorMessage = "none"
    let signInLink:string = "/signin"
    let termsAndConditionsLink:string = "#" || "/ts-and-cs"

    let showAlertBox:boolean = false
    let alertBoxTitle:string = String()
    let alertBoxContent:string = String()

    const signUp = async (e:CustomEvent<SignUpEventDetail>) => {
        loading = true
        if (!window.navigator.onLine) {
            alertBoxTitle = "Connection Problem"
            alertBoxContent = "No internet connection detected"
            showAlertBox = true
            loading = false
            return
        }
        
        let createdAt = Temporal.Now.zonedDateTimeISO().toString()

        const { username, email, password } = e.detail

        let response = await fetch("/api/auth/signup", { 
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
                created_at: createdAt
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
            errorType = error.code == 201 ? "Email already exist" : error.code == 203 ? "Username already exist" : "none"
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
        <SignupTab 
            theme={theme} 
            width={100} 
            unit="%" 
            signInLink={signInLink}
            termsAndConditionsLink={termsAndConditionsLink}
            bind:errorType={errorType}
            loading={loading}
            on:signUp={signUp}/>
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
            height: fit-content; 
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