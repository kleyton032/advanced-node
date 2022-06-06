import { FacebookAuthetication } from '@/domain/features'

class FacebookAuthenticationService {

    constructor(private readonly loadFacebookuserByTokenApi: LoadFacebookUserbyTokenApi) { }

    async perfom(paramns: FacebookAuthetication.Params): Promise<void> {
        await this.loadFacebookuserByTokenApi.loadUserByToken(paramns);
    }
}

namespace LoadFacebookUserbyTokenApi {
    export type Params = {
        token: string
    }
}

interface LoadFacebookUserbyTokenApi {
    loadUserByToken: (params: LoadFacebookUserbyTokenApi.Params) => Promise<void>
}

class LoadFacebookUserbyTokenApiSpy implements LoadFacebookUserbyTokenApi {

    token?: string

    async loadUserByToken(params: LoadFacebookUserbyTokenApi.Params): Promise<void> {
        this.token = params.token
    }
}

describe('FacebookAuthenticationService', () => {
    it('should call loadFacebookUserApi woth correct params', async () => {
        const loadFacebookuserByTokenApi = new LoadFacebookUserbyTokenApiSpy();
        const sut = new FacebookAuthenticationService(loadFacebookuserByTokenApi);

        await sut.perfom({ token: 'any_token' });

        expect(loadFacebookuserByTokenApi.token).toBe('any_token');
    })
})