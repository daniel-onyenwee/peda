<script lang="ts">
    import DefaultTextInput from "../component/default-text-input.svelte"
    import { createEventDispatcher } from "svelte"
    import { Circle } from "svelte-loading-spinners"

    export let theme:App.Theme = "light"
    export let width:number = 100
    export let unit:"px"|"mm"|"pt"|"cm"|"pc"|"in"|"%" = "%"
    export let errorType:App.SigninErrorMessage = "none"
    export let loading:boolean = false
    export let forgetPasswordLink:string
    export let createAccountLink:string

    const dispatcher = createEventDispatcher()
    
    let password:string = String()
    let usernameOrEmail:string = String()

    const signIn = () => {
        let fieldFilled = false

        if (!usernameOrEmail && !password) {
            errorType = "Username or email and password not filled"
        } else if (!password) {
            errorType = "Password not filled"
        } else if (!usernameOrEmail) {
            errorType = "Username or email not filled"
        } else {
            fieldFilled = true
        }

        if (fieldFilled) {
            errorType = "none"
            dispatcher("signIn", { usernameOrEmail, password })
        }

    }
</script>
<section style="width: {`${width}${unit}`}" data-theme={theme}>
    <p data-text="header">Sign in</p>
    <DefaultTextInput 
        theme={theme}
        placeholder="Email or username"
        type="text"
        message={ (errorType == "Username or email and password not filled" || errorType == "Username or email not filled") ? "Username or email not filled" : "Username or email not found" }
        error={ errorType == "both" || errorType == "Username or email not found" || errorType == "Username or email not filled" || errorType == "Username or email and password not filled" }
        on:input={(e) => {
            usernameOrEmail = e.detail.value
        }}
    />
    <DefaultTextInput
        theme={theme}
        placeholder="Password"
        type="password"
        message={ (errorType == "Username or email and password not filled" || errorType == "Password not filled") ? "Password not filled" : "Incorrect password" }
        error={ errorType == "both" || errorType == "Incorrect password" || errorType == "Password not filled" || errorType == "Username or email and password not filled" }
        on:input={(e) => {
            password = e.detail.value
        }}
    />
    <div data-container="forget-password">
        <a sveltekit:prefetch data-text="forget-password" href={forgetPasswordLink}>
            Forget password
        </a>
    </div>
    <div data-container="submit">
        <button  on:click={signIn} disabled={loading}>
            {#if !loading}
                Continue
            {:else}
                <Circle color="white" unit="px" size={25} />
            {/if}
        </button>
    </div>
    <div data-container="create-account">
        <a sveltekit:prefetch data-text="create-account" href={createAccountLink}>
            Create Account
        </a>
    </div>
</section>
<style lang="less">
    section {
        background: #FFFFFF;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 5px;
        height: 425px;
        border-style: solid;
        border-width: 0;
        padding: 0 0 0 0;
        padding-top: 15px;
        padding-bottom: 15px;
        font-family: Arial, Helvetica, sans-serif;
        p[data-text="header"] {
            margin: 0 0 0 0;
            padding: 0 0 0 0;
            padding-left: 25px;
            padding-right: 25px;
            margin-top: 35px;
            margin-bottom: 13px;
            font-style: normal;
            font-weight: 700;
            font-size: 35px;
            color: rgb(25, 25, 25);
        }
        div[data-container] {
            display: flex;
            flex-direction: row;
        }
        a {
            margin: 0 0 0 0;
            padding: 0 0 0 0;
            text-decoration-line: underline;
            margin-top: 5px;
            font-style: normal;
            font-weight: 400;
            font-size: 15px;
            line-height: 16px;
            color: rgb(25, 25, 25);
            cursor: pointer;
            &:hover {
                text-decoration: none;
            }
        }
        div[data-container="forget-password"] {
            justify-content: flex-end;
            a[data-text="forget-password"] {
                padding-right: 25px;
            }
        }
        div[data-container="submit"] {
            padding-left: 25px;
            padding-right: 25px;
            margin-top: 25px; 
            button {
                margin: 0 0 0 0;
                padding: 0 0 0 0;    
                width: 100%;
                color: white;
                background-color: #2196F3;
                border-style: none;
                border-radius: 4px;
                height: 48px;
                font-style: normal;
                font-weight: 700;
                font-size: 17px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                &:hover,
                &:disabled {
                    background-color: lighten(#2196F3, 5.5);
                }
                &:focus {
                    outline: none;
                }
            }
        }
        div[data-container="create-account"] {
            justify-content: center;
            margin-top: 15px; 
            a[data-text="create-account"] {
                font-size: 15.5px;
            }
        }
        &[data-theme="dark"] {
            box-shadow: none;
            background: #272727;
            border-style: solid;
            border-width: 1px;
            border-color: #616161;
            a,
            p[data-text="header"] {
                color: #FFFFFF;
            }
        }
    }
</style>