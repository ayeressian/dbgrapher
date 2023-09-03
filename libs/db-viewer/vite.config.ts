import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import * as path from "path";

import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
    dts(),
  ],
  build: {
    //https://github.com/qmhc/vite-plugin-dts/issues/99
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      name: "DbViewer",
      fileName: (format) => `db-viewer.${format}.js`,
    },
  },
  server: {
    port: 9998,
  },
});
