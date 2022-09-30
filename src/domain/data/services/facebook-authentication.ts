import { AutheticationError } from "@/domain/errors";
import { FacebookAuthetication } from "@/domain/features";
import { LoadFacebooUserApi } from "../interfaces/apis";
import { LoadUserAccountRepository } from '@/domain/data/interfaces/repos';



export class FacebookAuthenticationService {

    constructor(
        private readonly loadFacebookApi: LoadFacebooUserApi,
        private readonly loadUserAccountRepository: LoadUserAccountRepository
    ) { }

    async perfom(params: FacebookAuthetication.Params): Promise<AutheticationError> {
        const fbData = await this.loadFacebookApi.loadUser(params);
        if (fbData != undefined) {
            await this.loadUserAccountRepository.load({ email: fbData.email })
        }
        return new AutheticationError()
    }
}