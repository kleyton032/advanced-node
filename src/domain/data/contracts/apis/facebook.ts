export interface LoadFacebookUserbyTokenApi {
    loadUserByToken: (params: LoadFacebookUserbyTokenApi.Params) => Promise<LoadFacebookUserbyTokenApi.Result>
}


export namespace LoadFacebookUserbyTokenApi {
    export type Params = {
        token: string
    }

    export type Result = undefined
}

