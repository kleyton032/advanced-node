import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebooUserApi } from "../interfaces/apis";
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/data/interfaces/repos';



export class FacebookAuthenticationService {

    constructor(
        private readonly facebookApi: LoadFacebooUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
        
    ) { }

    async perfom(params: FacebookAuthetication.Params): Promise<AutheticationError> {
        const fbData = await this.facebookApi.loadUser(params);
        if (fbData != undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            await this.userAccountRepo.saveWithFacebook({
                id:  accountData?.id,
                name: accountData?.name ?? fbData.name,
                email: fbData.email,
                facebookId: fbData.facebookId
            })
            
        }
        return new AutheticationError()
    }
}