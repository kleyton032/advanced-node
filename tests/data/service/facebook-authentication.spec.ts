import { LoadFacebooUserApi } from '@/domain/data/interfaces/apis';
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/data/interfaces/repos';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended'


describe('FacebookAuthenticationService', () => {

    let facebookApi: MockProxy<LoadFacebooUserApi>
    let userAccountRepo: MockProxy<LoadUserAccountRepository &  SaveFacebookAccountRepository>
    let sut: FacebookAuthenticationService
    const token = 'any_token'

    beforeEach(() => {
        facebookApi = mock()
        facebookApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id'
        })
        userAccountRepo = mock()
        userAccountRepo.load.mockRejectedValue(undefined)
        sut = new FacebookAuthenticationService(
            facebookApi,
            userAccountRepo,
        )
    })

    it('should call loadFacebookUserApi with correct params', async () => {

        await sut.perfom({ token: 'any_token' })

        expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when loadFacebookUserApi returns undefined', async () => {

        facebookApi.loadUser.mockResolvedValueOnce(undefined)

        const authResult = await sut.perfom({ token })

        expect(authResult).toEqual(new AutheticationError())

    })

    it('should call LoadUserAccountRepo when loadFacebookUserApi return data', async () => {

        await sut.perfom({ token })

        expect(userAccountRepo.load).toHaveBeenLastCalledWith({ email: 'any_fb_email' })
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1)

    })


    it('should create account with facebook data', async () => {

        await sut.perfom({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenLastCalledWith({ 
            email: 'any_fb_email',
            name: 'any_fb_name',
            facebookId: 'any_fb_id' 
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)

    })

    it('should not update account name', async () => {

        userAccountRepo.load.mockRejectedValueOnce({
            id: 'any_id',
            name: 'any_name'
        })
        await sut.perfom({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenLastCalledWith({ 
            id: 'any_id',
            name: 'any_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id' 
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)

    })

    it('should update account name', async () => {

        userAccountRepo.load.mockRejectedValueOnce({
            id: 'any_id'
        })
        await sut.perfom({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenLastCalledWith({ 
            id: 'any_id',
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id' 
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)

    })
})



