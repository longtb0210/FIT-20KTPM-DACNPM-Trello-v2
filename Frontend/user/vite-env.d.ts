interface ImportMetaEnv {
  VITE_URL_API: string
  VITE_MODE: string
  VITE_KEYCLOAK_REALM: string
  VITE_KEYCLOAK_CLIENT_ID: string
  VITE_KEYCLOAK_AUTH_SERVER_URL: string
  VITE_HOST_URL:string
}

interface ImportMeta {
  env: ImportMetaEnv
}
