<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import { Circle } from "svelte-loading-spinners"
    import { Checkbox } from '@svelteuidev/core'
    import DefaultTextInput from "./default-text-input.svelte"
    
    export let theme:App.Theme = "light"
    export let width:number = 100
    export let unit:"px"|"mm"|"pt"|"cm"|"pc"|"in"|"%" = "%"
    export let errorType:App.SignupErrorMessage = "none"
    export let loading:boolean = false
    export let signInLink:string
    export let termsAndConditionsLink:string

    const dispatcher = createEventDispatcher()

    let email:string = String()
    let username:string = String()
    let password:string = String()
    let isAgreed = true

    const signUp = () => {
        let fieldFilled = false
        let passwordChecked = false
        let usernameChecked = false
        let emailChecked = false

        if (!email && !username && !password) {
            errorType = "Username and email and password not filled"
        } else if (!email && !username) {
            errorType = "Username and email not filled"
        } else if (!email && !password) {
            errorType = "Email and password not filled"
        } else if (!username && !password) {
            errorType = "Username and password not filled"
        } else if (!username) {
            errorType = "Username not filled"
        } else if (!password) {
            errorType = "Password not filled"
        } else if (!email) {
            errorType = "Email not filled"
        } else {
            fieldFilled = true
            if (password) {
                let checker = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/
                if (!checker.test(password)) {
                    errorType = "Incorrect password format"
                } else {
                    passwordChecked = true
                }
            }
            if (username) {
                let checker = /^[a-zA-Z0-9_]{6,}$/
                if (!checker.test(username)) {
                    errorType = "Incorrect username format"
                } else {
                    usernameChecked = true
                }
            }
            if (email) {
                let checker = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
                if (!checker.test(email)) {
                    errorType = "Incorrect email format"
                } else {
                    emailChecked = true
                }
            }
        }
        
        if (fieldFilled && passwordChecked && usernameChecked && emailChecked ) {
            dispatcher("signUp", { email, username, password })
            errorType = "none"
        }
    }
</script>
<section style="width: {`${width}${unit}`}" data-theme={theme}>
    <p data-text="header">Sign up</p>
    <DefaultTextInput 
        theme={theme}
        placeholder="Email"
        type="text"
        message={ (errorType == "Username and email already exist" || errorType == "Email already exist") ? "Email already exist" : errorType == "Incorrect email format" ? "Invalid email format" : "Email not filled" }
        error={ errorType == "Incorrect email format" || errorType == "Email already exist" || errorType == "Email and password not filled" || errorType == "Email not filled" || errorType == "Username and email already exist" || errorType == "Username and email and password not filled" || errorType == "Username and email not filled" }
        on:input={(e) => {
            email = e.detail.value
        }}
    />
    <DefaultTextInput 
        theme={theme}
        placeholder="Username"
        type="text"
        message={ (errorType == "Username and email already exist" || errorType == "Username already exist") ? "Username already exist" : errorType == "Incorrect username format" ? "Username must be at least six characters with letters, numbers and underscore" : "Username not filled" }
        error={ errorType == "Incorrect username format" || errorType == "Username already exist" || errorType == "Username and password not filled" || errorType == "Username not filled" || errorType == "Username and email already exist" || errorType == "Username and email and password not filled" || errorType == "Username and email not filled" }
        on:input={(e) => {
            username = e.detail.value
        }}
    />
    <DefaultTextInput 
        theme={theme}
        placeholder="Password"
        type="password"
        message={ errorType == "Incorrect password format" ? "Password must be at least six characters with one number and special characters" : "Password not filled" }
        error={ errorType == "Incorrect password format" || errorType == "Username and password not filled" || errorType == "Password not filled" || errorType == "Username and email and password not filled" || errorType == "Email and password not filled" }
        on:input={(e) => {
            password = e.detail.value
        }}
    />
    <div data-container="terms-and-conditions">
        <Checkbox size={"xs"} bind:checked={isAgreed} />
        <span data-text="terms-and-conditions">Agree to </span>
        <a sveltekit:prefetch data-text="terms-and-conditions" href={termsAndConditionsLink}>
            Terms and conditions
        </a>
    </div>
    <div data-container="submit">
        <button on:click={() => signUp()} disabled={loading || !isAgreed}>
            {#if !loading}
                Continue
            {:else}
                <Circle color="white" unit="px" size={25} />
            {/if}
        </button>
    </div>
    <div data-container="sign-in">
        <a sveltekit:prefetch data-text="sign-in" href={signInLink}>
            or, Login
        </a>
    </div>
</section>
<style lang="less">
    section {
        background: #FFFFFF;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 5px;
        height: 510px;
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
        div[data-container="terms-and-conditions"] {
            justify-content: flex-start;
            align-items: center;
            margin: 0 0 0 0;
            padding: 0 0 0 0;
            padding-left: 25px;
            margin-top: 5px;
            a[data-text="terms-and-conditions"] {
                margin-left: 5px;
                margin-top: -1.8px;
            }
            span[data-text="terms-and-conditions"] {
                margin-left: 5px;
                font-size: 15.78px;
                color: rgb(25, 25, 25);
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
        div[data-container="sign-in"] {
            justify-content: center;
            margin-top: 15px; 
            a[data-text="sign-in"] {
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
            div[data-container="terms-and-conditions"] span {
                color: #FFFFFF;
            }
        }
    }
</style>