import { LoadFacebookApi } from '@/domain/data/interfaces/apis';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';


class LoadFacebookUserbyTokenApiSpy implements LoadFacebookApi {

    token?: string
    result: undefined

    async loadUserByToken(params: LoadFacebookApi.Params): Promise<LoadFacebookApi.Result> {
        this.token = params.token
        return this.result 
    }
}

describe('FacebookAuthenticationService', () => {
    it('should call loadFacebookUserApi with correct params', async () => {
        const loadFacebookuserByTokenApi = new LoadFacebookUserbyTokenApiSpy()
        const sut = new FacebookAuthenticationService(loadFacebookuserByTokenApi)

        await sut.perfom({ token: 'any_token' })

        expect(loadFacebookuserByTokenApi.token).toBe('any_token')
    })

    it('should return AuthenticationError when loadFacebookUserApi returns undefined', async () => {
        const loadFacebookuserByTokenApi = new LoadFacebookUserbyTokenApiSpy()
        loadFacebookuserByTokenApi.result = undefined
        const sut = new FacebookAuthenticationService(loadFacebookuserByTokenApi)

       const authResult =  await sut.perfom({ token: 'any_token' })

        expect(authResult).toEqual(new AutheticationError())

    })


})


