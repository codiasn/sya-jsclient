import { IApplication, IClient, IProfile, IScore, IUser } from "./interfaces";
export interface XyaConfig {
    sessionId?: string;
    accessToken?: string;
    rsa: {
        public: string;
        private: string;
    };
    /** default 5 */
    lang?: string;
    locales?: {
        [x: string]: IXyaLocale;
    };
    onError?: (error: {
        [key: string]: any;
        message: {
            label: string;
            translate: {
                [lang: string]: string;
            };
        };
    }) => void;
}
export interface XyaApplicationComponentOptions {
    id: string;
    target: HTMLElement;
    metadata?: {
        [key: string]: any;
    };
    onSend?: (score: IScore) => void;
}
export interface IXyaLocale {
    [key: string]: string | number | boolean | (string | number | boolean | IXyaLocale)[] | IXyaLocale;
}
export declare class Xya {
    config: XyaConfig;
    apiPublicKey: string;
    profiles: IProfile[];
    lang: string;
    locales: {
        [x: string]: IXyaLocale;
    };
    _locales: {
        [x: string]: any;
    };
    private _sessionId;
    set sessionId(id: string | undefined);
    get sessionId(): string | undefined;
    constructor(config: XyaConfig);
    static generateRsaKeys(): {
        public: string;
        private: string;
    };
    rsa: {
        encrypter: (data: string, side: "client" | "api") => string | string[];
        decrypter: (data: string) => string;
    };
    session: {
        init: () => Promise<void>;
        login: (data: {
            email: string;
            password: string;
        }) => Promise<void>;
        logout: () => Promise<void>;
        register: (data: {
            password: string;
            email: string;
            firstName: string;
            lastName: string;
        }) => Promise<{}>;
        confirmIdentity: (token: string) => Promise<{}>;
        requestResetPassword: (data: {
            email: string;
        }) => Promise<{}>;
        resetPassword: (data: {
            token: string;
            password: string;
        }) => Promise<{}>;
    };
    user: {
        me: {
            get: () => Promise<IUser>;
            update: (data: Partial<IUser> & {
                password?: string;
            }) => Promise<IUser>;
        };
        update: (data: Partial<IUser> & {
            id: string;
        }) => Promise<IUser>;
        list: (params?: {}) => Promise<IUser>;
    };
    client: {
        _: IClient;
        get: () => Promise<IClient>;
        update: (data: Partial<IClient>) => Promise<IClient>;
    };
    application: {
        create: (data: Partial<IApplication>) => Promise<IUser>;
        list: (params?: {}) => Promise<IUser>;
        get: (id: string) => Promise<IUser>;
        remove: (id: string) => Promise<IUser>;
        components: {
            build: (options: XyaApplicationComponentOptions) => Promise<void>;
        };
    };
    score: {
        list: (params?: {
            application?: string;
        }) => Promise<IScore>;
        /** get application to scored it */
        getApplication: (id: string) => Promise<IApplication>;
        /** scored */
        add: (applicationId: string, data: Partial<IScore>) => Promise<IScore>;
    };
    request<T = any>(params: any): Promise<T>;
}
