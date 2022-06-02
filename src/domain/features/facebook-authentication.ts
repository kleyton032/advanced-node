import { AccessToken } from "@/domain/models";
import { AutheticationError } from "@/domain/errors";

export interface FacebookAuthetication {
    perfom: (paramns: FacebookAuthetication.Params) => Promise<FacebookAuthetication.Result>
}


namespace FacebookAuthetication {
    export type Params = {
        token: string
    }
    export type Result = AccessToken | AutheticationError
}


