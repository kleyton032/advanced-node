import { LoadFacebooUserApi } from '@/domain/data/interfaces/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/data/interfaces/repos';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended'


describe('FacebookAuthenticationService', () => {

    let loadFacebookUserApi: MockProxy<LoadFacebooUserApi>
    let loadUseraccountRepo: MockProxy<LoadUserAccountRepository>
    let  createFacebookccountRepo:  MockProxy<CreateFacebookAccountRepository>
    let sut: FacebookAuthenticationService
    const token = 'any_token'

    beforeEach(() => {
        loadFacebookUserApi = mock()
        loadFacebookUserApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id'
        })
        loadUseraccountRepo = mock()
        createFacebookccountRepo = mock()
        sut = new FacebookAuthenticationService(
            loadFacebookUserApi,
            loadUseraccountRepo,
            createFacebookccountRepo
        )
    })

    it('should call loadFacebookUserApi with correct params', async () => {

        await sut.perfom({ token: 'any_token' })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when loadFacebookUserApi returns undefined', async () => {

        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

        const authResult = await sut.perfom({ token })

        expect(authResult).toEqual(new AutheticationError())

    })

    it('should call LoadUserAccountRepo when loadFacebookUserApi return data', async () => {

        await sut.perfom({ token })

        expect(loadUseraccountRepo.load).toHaveBeenLastCalledWith({ email: 'any_fb_email' })
        expect(loadUseraccountRepo.load).toHaveBeenCalledTimes(1)

    })


    it('should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {

        loadUseraccountRepo.load.mockRejectedValueOnce(undefined)
        await sut.perfom({ token })

        expect(createFacebookccountRepo.createFromFacebook).toHaveBeenLastCalledWith({ 
            email: 'any_fb_email',
            name: 'any_fb_name',
            facebookId: 'any_fb_id' 
        })
        expect(createFacebookccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)

    })
})



