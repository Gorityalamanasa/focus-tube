import { defineConfig } from "vite"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: "output_content_script",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/assets/content_script.js"), // ✅ YOUR FILE
      output: {
        entryFileNames: "assets/content_script.js"
      }
    }
  }
})