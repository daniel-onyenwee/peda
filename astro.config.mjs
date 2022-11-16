import { defineConfig } from "astro/config"

// https://astro.build/config
import svelte from "@astrojs/svelte"
import { netlifyFunctions } from "@astrojs/netlify"

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [svelte()],
  adapter: netlifyFunctions()
})