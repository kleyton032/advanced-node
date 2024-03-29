import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebooUserApi } from "../interfaces/apis";
import { TokenGenerator } from '@/data/interfaces/crypto';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/interfaces/repos';
import { AccessToken, FacebookAccount } from "@/domain/models";



export class FacebookAuthenticationService implements FacebookAuthetication{

    constructor(
        private readonly facebookApi: LoadFacebooUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
        private readonly crypto: TokenGenerator

    ) { }

    async perfom(params: FacebookAuthetication.Params): Promise<FacebookAuthetication.Result> {
        const fbData = await this.facebookApi.loadUser(params);
        if (fbData != undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            const fbAccount = new FacebookAccount(fbData, accountData)
            const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
            const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
            return new AccessToken(token)
        }
        return new AutheticationError()
    }

}



