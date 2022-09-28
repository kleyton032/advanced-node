import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebookApi } from "../interfaces/apis";


export class FacebookAuthenticationService {

    constructor(private readonly LoadFacebookApi: LoadFacebookApi) { }

    async perfom(paramns: FacebookAuthetication.Params): Promise<AutheticationError> {
        await this.LoadFacebookApi.loadUserByToken(paramns);
        return new AutheticationError()
    }
}