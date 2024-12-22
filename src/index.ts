import { IApplication, IClient, IProfile, IScore, IUser } from "./interfaces";
import cApplicationScore from "./components/application/score";
import cApplicationStep from "./components/application/steps";
import cApplicationSubmitting from "./components/application/submitting";
import forge from "node-forge";

// @ts-ignore
import style from "./components/style.css";

export interface XyaConfig {
  sessionId?: string;
  accessToken?: string;
  rsa: { public: string; private: string };

  /** default 5 */
  lang?: string;
  locales?: { [x: string]: IXyaLocale };

  onError?: (error: {
    [key: string]: any;
    message: { label: string; translate: { [lang: string]: string } };
  }) => void;
}

export interface XyaApplicationComponentOptions {
  id: string;
  target: HTMLElement;
  metadata?: { [key: string]: any };
  onSend?: (score: IScore) => void;
}

export interface IXyaLocale {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean | IXyaLocale)[]
    | IXyaLocale;
}
export class Xya {
  config: XyaConfig;
  apiPublicKey = "";
  profiles!: IProfile[];

  lang = "en";
  locales: { [x: string]: IXyaLocale } = {
    en: {
      next: "Next",
      goback: "Go Back",
      submit: "Submit",
      restart: "Restart",
      application: {
        message: {
          error: "An error occurred while sending. Please try again!",
          success:
            "Your feedback has been successfully submitted. Thank you for your input!",
        },
      },
    },
    fr: {
      next: "Suivant",
      goback: "Retour",
      submit: "Envoyer",
      restart: "Recommencer",
      application: {
        message: {
          error:
            "Un erreur s'est produit lors de l'envoie. Veuillez recommencer !",
          success:
            "Votre évaluation a été envoyée avec succès. Merci pour votre retour !",
        },
      },
    },
    es: {
      next: "Siguiente",
      goback: "Volver",
      submit: "Enviar",
      restart: "Reiniciar",
      application: {
        message: {
          error:
            "Se produjo un error durante el envío. ¡Por favor, inténtelo de nuevo!",
          success:
            "¡Su evaluación se ha enviado con éxito! Gracias por sus comentarios.",
        },
      },
    },
  };
  _locales: { [x: string]: any } = {};

  private _sessionId: string | undefined;

  set sessionId(id: string | undefined) {
    this._sessionId = id;
    this.config.sessionId = id;

    // enregistrer la session dans les cookies
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem("xya_session_id", id);
      else localStorage.removeItem("xya_session_id");
    }
  }
  get sessionId() {
    // récupérer la session dans les cookies
    if (typeof window !== "undefined") {
      this._sessionId = localStorage.getItem("xya_session_id") || "";
    }

    return this._sessionId;
  }

  constructor(config: XyaConfig) {
    this.config = config;

    if (this.config.sessionId) this.sessionId = this.config.sessionId;

    if (this.config.lang) this.lang = this.config.lang;
    if (this.config.locales) {
      this.locales = { ...this.locales, ...this.config.locales };
    }

    if (typeof window !== "undefined") {
      const _style = document.createElement("style");
      _style.innerHTML = style;
      document.body.appendChild(_style);

      if (!config.lang) this.lang = navigator.language.split("-")[0];
    }

    // @ts-ignore
    if (!Object.keys(this.locales).includes(this.lang)) this.lang = "en";

    for (const key in this.locales) {
      if (Object.prototype.hasOwnProperty.call(this.locales, key)) {
        this._locales[key] = flattenObject(this.locales[key], "", {});
      }
    }
  }

  static generateRsaKeys() {
    const rsaKeyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKey = forge.pki.publicKeyToPem(rsaKeyPair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(rsaKeyPair.privateKey);
    const keys = { public: publicKey, private: privateKey };

    return keys;
  }

  rsa = {
    encrypter: (data: string, side: "client" | "api") => {
      let key: string | undefined;
      if (side === "api") key = this.apiPublicKey;
      else key = this.config.rsa.public;

      if (!key) throw "crypto.needKey";

      const max_length = 86;

      if (typeof data === "string" && data.length > max_length) {
        const datas: string[] = [];

        for (let i = 0; i < data.length; i += max_length) {
          const dt = data.slice(i, i + max_length);
          const enc = this.rsa.encrypter(dt, side);
          datas.push(enc as string);
        }

        return datas;
      }

      const publicKeyObj = forge.pki.publicKeyFromPem(key);
      const encrypted = publicKeyObj.encrypt(data);
      return forge.util.encode64(encrypted);
    },

    decrypter: (data: string) => {
      const key = this.config.rsa.private;
      if (!key) throw "crypto.needKey";

      if (Array.isArray(data)) {
        let datas = "";
        for (const dt of data) datas += this.rsa.decrypter(dt);
        return datas;
      }

      const privateKeyObj = forge.pki.privateKeyFromPem(key);
      const decrypted = privateKeyObj.decrypt(forge.util.decode64(data));

      return decrypted;
    },
  };

  session = {
    init: async () => {
      const { publicKey } = await this.request({
        url: "/get-public-key",
      });
      this.apiPublicKey = publicKey;

      const data = await this.request({
        url: "/session/init",
        method: "POST",
        data: {
          publicKey: this.config.rsa.public,
          accessToken: this.config.accessToken
            ? {
                _RSA_ENCODED_: this.rsa.encrypter(
                  this.config.accessToken,
                  "api"
                ),
              }
            : undefined,
        },
      });

      this.sessionId = data.sessionId;

      this.client._ = data.client;
      this.profiles = data.profiles;
    },
    login: async (data: { email: string; password: string }) => {
      data.password = {
        _RSA_ENCODED_: this.rsa.encrypter(data.password, "api"),
      } as any;

      const response = await this.request({
        url: "/session/login",
        method: "POST",
        data,
      });

      this.client._ = response.client;
      this.profiles = response.profiles;
    },
    logout: async () => {
      await this.request({
        url: "/session/logout",
        method: "POST",
      });

      this.sessionId = undefined;
    },
    register: async (data: {
      password: string;
      email: string;
      firstName: string;
      lastName: string;
    }) => {
      data.password = {
        _RSA_ENCODED_: this.rsa.encrypter(data.password, "api"),
      } as any;

      return await this.request<{}>({
        url: "/session/register",
        method: "POST",
        data,
      });
    },
    confirmIdentity: async (token: string) => {
      return await this.request<{}>({
        url: `/session/confirm-identity?token${token}`,
        method: "POST",
      });
    },
    requestResetPassword: async (data: { email: string }) => {
      return await this.request<{}>({
        url: "/session/request-reset-password",
        method: "POST",
        data,
      });
    },
    resetPassword: async (data: { token: string; password: string }) => {
      data.password = {
        _RSA_ENCODED_: this.rsa.encrypter(data.password, "api"),
      } as any;
      return await this.request<{}>({
        url: "/session/reset-password",
        method: "POST",
        data,
      });
    },
  };

  user = {
    me: {
      get: async () => {
        return await this.request<IUser>({ url: "_/user/me" });
      },

      update: async (data: Partial<IUser> & { password?: string }) => {
        return await this.request<IUser>({
          url: "_/user/me",
          method: "post",
          data,
        });
      },
    },

    update: async (data: Partial<IUser> & { id: string }) => {
      return await this.request<IUser>({
        url: "_/user/update",
        method: "post",
        data,
      });
    },

    list: async (params?: {}) => {
      return await this.request<IUser>({
        url: "_/user",
        method: "post",
        data: params,
      });
    },
  };

  client = {
    _: undefined as any as IClient,

    get: async () => {
      const response = await this.request<IClient>({ url: "_/" });

      this.client._ = response;

      return response;
    },

    update: async (data: Partial<IClient>) => {
      const response = await this.request<IClient>({
        url: "_/",
        method: "post",
        data,
      });

      this.client._ = response;

      return response;
    },
  };

  application = {
    create: async (data: Partial<IApplication>) => {
      return await this.request<IUser>({
        url: "_/application",
        method: "post",
        data,
      });
    },

    list: async (params?: {}) => {
      return await this.request<IUser>({
        url: "_/application/list",
        method: "post",
        data: params,
      });
    },

    get: async (id: string) => {
      return await this.request<IUser>({ url: `_/application/${id}` });
    },
    remove: async (id: string) => {
      return await this.request<IUser>({
        url: `_/application/${id}`,
        method: "delete",
      });
    },

    components: {
      build: async (options: XyaApplicationComponentOptions) => {
        if (typeof window !== "undefined") {
          const application = await this.score.getApplication(options.id);
          if (!application) return;

          const score: Partial<IScore> = { metadata: options.metadata };

          const wrapper = document.createElement("div");
          wrapper.classList.add("c-xya");
          wrapper.style.display = "flex";
          wrapper.style.flexDirection = "column";
          wrapper.style.gap = "16px";
          wrapper.style.position = "relative";

          if (application.logo) {
            const logo = document.createElement("img");
            logo.src = application.logo.content;
            logo.style.width = "76px";
            logo.style.objectPosition = "top center";
            logo.style.objectFit = "contain";

            wrapper.appendChild(logo);
          }

          // ajouter un titre
          const title = document.createElement("div");

          title.innerHTML = application.name;
          title.style.fontWeight = "bold";
          title.style.fontSize = "26px";

          wrapper.appendChild(title);
          // title

          const main = document.createElement("div");
          main.classList.add("c-xya-main");
          wrapper.appendChild(main);

          const start = () => {
            cApplicationScore.build(
              main,
              { application, score, xya: this },
              (v) => {
                score.score = v;

                cApplicationStep.build(
                  main,
                  { xya: this, application, score, restart: start },
                  (v) => {
                    score.steps = v;
                    cApplicationSubmitting.build(
                      main,
                      {
                        options,
                        application,
                        score,
                        xya: this,
                        restart: start,
                      },
                      (score) => {
                        if (options.onSend) options.onSend(score);
                      }
                    );
                  }
                );
              }
            );
          };

          options.target.appendChild(wrapper);

          start();
        }
      },
    },
  };

  score = {
    list: async (params?: { application?: string }) => {
      return await this.request<IScore>({
        url: "_/score",
        method: "post",
        data: params,
      });
    },

    /** get application to scored it */
    getApplication: async (id: string) => {
      return await this.request<IApplication>({ url: `application/${id}` });
    },

    /** scored */
    add: async (applicationId: string, data: Partial<IScore>) => {
      return await this.request<IScore>({
        url: `score/${applicationId}`,
        method: "post",
        data,
      });
    },
  };

  request<T = any>(params: any): Promise<T> {
    return new Promise((resolve, reject) => {
      params.method ||= "get";
      params.url ||= "";
      params.url = params.url.replace(/^\//, "");

      params.headers ||= {};
      params.body ||= params.data || {};

      if (this.sessionId) {
        params.headers.authorization = `Bearer ${this.sessionId}`;
      }

      const onError = (data: { message: string }) => {
        if (data.message.startsWith("{") && data.message.endsWith("}")) {
          try {
            const parsed = JSON.parse(data.message);

            data.message = parsed;

            if (this.config.onError) this.config.onError(data as any);

            return data;
          } catch (error) {
            return error;
          }
        }

        return data;
      };
      fetch(`${"http://localhost:8870/api"}/${params.url}`, {
        method: params.method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...params.headers,
        },
        body:
          params.method.toLowerCase() !== "get"
            ? JSON.stringify(params.body || {})
            : undefined,
      })
        .then((response) => {
          response
            .json()
            .then((data) =>
              response.ok ? resolve(data as T) : reject(onError(data))
            )
            .catch((error) => reject(error));
        })
        .catch((error) => {
          reject(error);
        });

      // const data = await response.json();
    });
  }
}

function flattenObject(
  obj: IXyaLocale,
  parentKey = "",
  result: Record<string, any> = {}
): Record<string, any> {
  for (const key in obj) {
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      flattenObject(value as IXyaLocale, newKey, result);
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

if (typeof window !== "undefined") {
  window.Xya = Xya;
}
