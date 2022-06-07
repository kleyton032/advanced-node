import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebookUserbyTokenApi } from "../contracts/apis";


export class FacebookAuthenticationService {

    constructor(private readonly loadFacebookuserByTokenApi: LoadFacebookUserbyTokenApi) { }

    async perfom(paramns: FacebookAuthetication.Params): Promise<AutheticationError> {
        await this.loadFacebookuserByTokenApi.loadUserByToken(paramns);
        return new AutheticationError()
    }
}