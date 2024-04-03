import { z } from 'zod'

export class KcAdminService {
  private static _token: string | null = null
  private static _refreshToken: string | null = null

  private static KeycloakDataSchema = z.object({
    KEYCLOAK_AUTH_SERVER_URL: z.string(),
    KEYCLOAK_REALM: z.string(),
    KEYCLOAK_ADMIN_USER_NAME: z.string(),
    KEYCLOAK_ADMIN_PASSWORD: z.string(),
    KEYCLOAK_CLIENT_SECRET: z.string(),
  })

  private kcEnv: z.infer<typeof KcAdminService.KeycloakDataSchema> | null = null

  constructor() {
    const env = KcAdminService.KeycloakDataSchema.safeParse(process.env)
    if (env.success == false) {
      throw new Error(`Missing keycloak admin data: ${JSON.stringify(env.error)}`)
    }
    this.kcEnv = env.data
    const link = `${env.data.KEYCLOAK_AUTH_SERVER_URL}/realms/${env.data.KEYCLOAK_REALM}/protocol/openid-connect/token/`
    const body = {
      client_id: env.data.KEYCLOAK_REALM,
      username: env.data.KEYCLOAK_ADMIN_USER_NAME,
      password: env.data.KEYCLOAK_ADMIN_PASSWORD,
      grant_type: 'password',
      client_secret: env.data.KEYCLOAK_CLIENT_SECRET,
    }
    const formBody = []
    for (const property in body) {
      const encodedKey = encodeURIComponent(property)
      const encodedValue = encodeURIComponent(body[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    fetch(encodeURI(link), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody.join('&'),
    }).then(async (res) => {
      const json = await res.json()
      // console.log('Admin login', link, json)
      if (res.status === 200) {
        KcAdminService._token = json['access_token']
        KcAdminService._refreshToken = json['refresh_token']
      }
    })
  }

  async getUserDataByEmail(email: string) {
    const link = `${this.kcEnv.KEYCLOAK_AUTH_SERVER_URL}/admin/realms/${this.kcEnv.KEYCLOAK_REALM}/users/?email=${email}&exact=true`
    // console.log(this.kcEnv, KcAdminService._token, KcAdminService._refreshToken)
    const res = await fetch(encodeURI(link), { method: 'GET', headers: { authorization: `Bearer ${KcAdminService._token}` } })
    return await res.json()
  }
}
