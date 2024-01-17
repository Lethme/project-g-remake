/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ERUDA: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}