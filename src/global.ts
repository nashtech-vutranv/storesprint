export type Config = {
  REACT_APP_UPS_BASE_URL: string
  REACT_APP_URL_KEYCLOAK: string
  REACT_APP_REALM: string
  REACT_APP_CLIENT_ID: string
}

export class Configs {
  private _config: {
    REACT_APP_UPS_BASE_URL: string
    REACT_APP_URL_KEYCLOAK: string
    REACT_APP_REALM: string
    REACT_APP_CLIENT_ID: string
    REACT_APP_MMS_BASE_URL: string
  }

  constructor() {
    this._config = {
      REACT_APP_UPS_BASE_URL: '',
      REACT_APP_URL_KEYCLOAK: '',
      REACT_APP_REALM: '',
      REACT_APP_CLIENT_ID: '',
      REACT_APP_MMS_BASE_URL: ''
    }
  }

  public get config() {
    return this._config
  }

  public set config(data: Config) {
    this._config = {
      ...this._config,
      ...data,
    }
  }
}

const globalConfig = new Configs()

export const GlobalConfig = () => {
  return globalConfig
}
