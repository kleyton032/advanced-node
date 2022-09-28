import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebookUserApi } from "../interfaces/apis";


export class FacebookAuthenticationService {

    constructor(private readonly LoadFacebookUserApi: LoadFacebookUserApi) { }

    async perfom(paramns: FacebookAuthetication.Params): Promise<AutheticationError> {
        await this.LoadFacebookUserApi.loadUserByToken(paramns);
        return new AutheticationError()
    }
}