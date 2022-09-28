export interface LoadFacebookApi {
    loadUserByToken: (params: LoadFacebookApi.Params) => Promise<LoadFacebookApi.Result>
}


export namespace LoadFacebookApi {
    export type Params = {
        token: string
    }

    export type Result = undefined
}

