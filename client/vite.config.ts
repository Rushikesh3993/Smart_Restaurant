// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:8000", // Your backend server
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""), // Optional: adjust if your backend routes don't include "/api"
//       },
//     },
//   },
// });


import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Your backend server
        changeOrigin: true,
        // 🛑 REMOVE rewrite
      },
    },
  },
});
