import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebooUserApi } from "../interfaces/apis";
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/data/interfaces/repos';



export class FacebookAuthenticationService {

    constructor(
        private readonly facebookApi: LoadFacebooUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository,
        
    ) { }

    async perfom(params: FacebookAuthetication.Params): Promise<AutheticationError> {
        const fbData = await this.facebookApi.loadUser(params);
        if (fbData != undefined) {
            await this.userAccountRepo.load({ email: fbData.email })
            await this.userAccountRepo.createFromFacebook(fbData)
        }
        return new AutheticationError()
    }
}