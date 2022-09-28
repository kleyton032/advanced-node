import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebooUserApi } from "../interfaces/apis";


export class FacebookAuthenticationService {

    constructor(private readonly loadFacebookApi: LoadFacebooUserApi) { }

    async perfom(params: FacebookAuthetication.Params): Promise<AutheticationError> {
        await this.loadFacebookApi.loadUser(params);
        return new AutheticationError()
    }
}