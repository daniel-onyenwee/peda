<script lang="ts">
    import { createEventDispatcher } from "svelte"
    
    export let theme:App.Theme = "system"
    export let width:number = 100
    export let message:string
    export let unit:"px"|"mm"|"pt"|"cm"|"pc"|"in"|"%" = "%"
    export let error:boolean = false
    export let placeholder:string = String()
    export let type:"text"|"password"|"search"|"email" = "text"

    const dispatcher = createEventDispatcher()

    let value:string

    const sendValue = () => {
        dispatcher("input", { value })
    }
</script>
<div style="width: calc({`${width}${unit}`} - 40px)" data-theme={theme}>        
    {#if type == "email"}
        <input data-has-error={error} bind:value={value} on:input={ () => sendValue() } {placeholder} type="email">
    {:else if type == "password"}
        <input data-has-error={error} bind:value={value} on:input={ () => sendValue() } {placeholder} type="password">
    {:else if type == "search"}
        <input data-has-error={error} bind:value={value} on:input={ () => sendValue() } {placeholder} type="search">
    {:else}
        <input data-has-error={error} bind:value={value} on:input={ () => sendValue() } {placeholder} type="text">
    {/if}
    <p>{ error ? message : String() }</p>
</div>
<style lang="less">
    div {
        width: 100%;
        padding: 10px;
        padding-left: 25px;
        padding-right: 25px;
        p {  
            width: 100%;
            margin: 0 0 0 0;
            padding: 0 0 0 0;
            margin-top: 8px;
            font-size: 15.75px;
            color: #f50000;
            font-family: Arial, Helvetica, sans-serif;
        }

        &[data-theme="dark"] {
            input {
                border-color: #616161;
                color: #7D7D7D;
            }
        }
        &[data-theme="system"] {
            @media screen and (prefers-color-scheme: dark) {
                input {
                    border-color: #616161;
                    color: #7D7D7D;
                }
            }
        } 
        input {
            width: calc(100% - 35px);
            font-style: normal;
            font-weight: 300;
            font-size: 17px;
            line-height: 21px;
            color: #7D7D7D;
            margin: 0 0 0 0;
            background-color: transparent;
            outline: none;
            height: 35px;
            padding: 5px;
            padding-left: 10px;
            padding-right: 10px;
            border-width: 1px;
            border-style: solid;
            border-radius: 4px;
            border-color: #E0E0E0;   
             
            &:focus,
            &[data-has-error]:focus {
                outline: none;
                border-color: #2196f3;
                box-shadow: 0 0 1.5px 0.45px #2195f3;
            }
            &[data-has-error="true"] {
                box-shadow: 0 0 1.5px 0.45px red;
                border-color: rgb(230, 0, 0);
            }
        } 
        
    }
</style>