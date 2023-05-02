/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_PROTOCOL: string;
    readonly VITE_API_HOST: string;
    readonly VITE_API_PORT: number;
    readonly VITE_API_LOGIN_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }