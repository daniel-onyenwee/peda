<script lang="ts">
    import { Alert } from "@svelteuidev/core"
    import { InfoCircled } from "radix-icons-svelte"
    import { createEventDispatcher } from "svelte"

    const dispatcher = createEventDispatcher()

    export let show:boolean = true
    export let title:string = "Title"
    export let content:string = "Content"
    export let closable:boolean = false
    export let placement:"center"|"left"|"right" = "center"
    export let type:"success"|"warning"|"error" = "success"
    export let top:number = 0

    $: color = type == "error" ? "red" : type == "success" ? "green" : "yellow"
</script>
<section style="top: {top}px; display: { show ? "flex" : "none" }; justify-content: { placement == "center" ? "center" : placement == "left" ? "flex-start" : "flex-end" }" >
    <Alert variant="filled" on:close={() => dispatcher("close")} icon={InfoCircled} title={title} color={color} radius="sm" withCloseButton={closable}>
        {content}
    </Alert>
</section>
<style lang="less">
    section {
        width: calc(100% - 30px);
        position: absolute;
        left: 0;
        padding-inline: 15px;
        padding-block: 10px;
        height: fit-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        z-index: 2;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
</style>