import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8081, // Use port 8081 since 8080 is taken by backend
      hmr: {
        port: 8081, // Use the same port for HMR
      },
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Explicitly define environment variables for Vite
      'import.meta.env.VITE_GCP_STORAGE_BASE_URL': JSON.stringify(env.VITE_GCP_STORAGE_BASE_URL || 'https://storage.googleapis.com/my-portfolio-69'),
    },
    build: {
      rollupOptions: {
        external: (id) => ['path', 'querystring', 'stream', 'url', 'fs', 'crypto'].includes(id) || id.includes('server/'),
      },
    },
  };
});
