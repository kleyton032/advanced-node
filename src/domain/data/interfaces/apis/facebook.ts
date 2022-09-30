export interface LoadFacebooUserApi {
    loadUser: (params: LoadFacebooUserApi.Params) => Promise<LoadFacebooUserApi.Result>
}

export namespace LoadFacebooUserApi {
    export type Params = {
        token: string
    }

    export type Result = undefined | {
        facebookId: string,
        email: string,
        name: string
    }
}

