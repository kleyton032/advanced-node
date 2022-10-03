import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebooUserApi } from "../interfaces/apis";
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/domain/data/interfaces/repos';



export class FacebookAuthenticationService {

    constructor(
        private readonly facebookApi: LoadFacebooUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository,
        
    ) { }

    async perfom(params: FacebookAuthetication.Params): Promise<AutheticationError> {
        const fbData = await this.facebookApi.loadUser(params);
        if (fbData != undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            if(accountData?.name != undefined){
                await this.userAccountRepo.updateWithFacebook({ 
                    id: accountData.id,
                    name: accountData.name,
                    facebookId: fbData.facebookId
                })
            }
            await this.userAccountRepo.createFromFacebook(fbData)
        }
        return new AutheticationError()
    }
}