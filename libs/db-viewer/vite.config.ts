import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import * as path from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: false,
      },
      exclude: "./**/*.wc.svelte",
    }),
    svelte({
      compilerOptions: {
        customElement: true,
      },
      include: "./**/*.wc.svelte",
    }),
    dts(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      name: "DbViewer",
      fileName: (format) => `db-viewer.${format}.js`,
    },
    minify: false,
    
  },
});
