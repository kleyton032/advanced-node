import { LoadFacebookUserApi } from '@/domain/data/interfaces/apis';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';


class LoadFacebookUserbyTokenApiSpy implements LoadFacebookUserApi {

    token?: string
    callCounts= 0
    result: undefined

    async loadUserByToken(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
        this.token = params.token
        this.callCounts++
        return this.result 
    }
}

describe('FacebookAuthenticationService', () => {
    it('should call loadFacebookUserApi with correct params', async () => {
        const loadFacebookuserByTokenApi = new LoadFacebookUserbyTokenApiSpy()
        const sut = new FacebookAuthenticationService(loadFacebookuserByTokenApi)

        await sut.perfom({ token: 'any_token' })

        expect(loadFacebookuserByTokenApi.token).toBe('any_token')
        expect(loadFacebookuserByTokenApi.callCounts).toBe(1)
    })

    it('should return AuthenticationError when loadFacebookUserApi returns undefined', async () => {
        const loadFacebookuserByTokenApi = new LoadFacebookUserbyTokenApiSpy()
        loadFacebookuserByTokenApi.result = undefined
        const sut = new FacebookAuthenticationService(loadFacebookuserByTokenApi)

       const authResult =  await sut.perfom({ token: 'any_token' })

        expect(authResult).toEqual(new AutheticationError())

    })


})


