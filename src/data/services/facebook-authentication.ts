import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebooUserApi } from "../interfaces/apis";
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/interfaces/repos';
import { FacebookAccount } from "@/domain/models";



export class FacebookAuthenticationService {

    constructor(
        private readonly facebookApi: LoadFacebooUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,

    ) { }

    async perfom(params: FacebookAuthetication.Params): Promise<AutheticationError> {
        const fbData = await this.facebookApi.loadUser(params);
        if (fbData != undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            const fbAccount = new FacebookAccount(fbData, accountData)
            await this.userAccountRepo.saveWithFacebook(fbAccount)

        }
        return new AutheticationError()
    }

}



