import { LoadFacebooUserApi } from '@/domain/data/interfaces/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/domain/data/interfaces/repos';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended'


describe('FacebookAuthenticationService', () => {

    let facebookApi: MockProxy<LoadFacebooUserApi>
    let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
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


    it('should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {

        userAccountRepo.load.mockRejectedValueOnce(undefined)
        await sut.perfom({ token })

        expect(userAccountRepo.createFromFacebook).toHaveBeenLastCalledWith({ 
            email: 'any_fb_email',
            name: 'any_fb_name',
            facebookId: 'any_fb_id' 
        })
        expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)

    })

    it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo return data', async () => {

        userAccountRepo.load.mockRejectedValueOnce({
            id: 'any_id',
            name: 'any_name'
        })
        await sut.perfom({ token })

        expect(userAccountRepo.updateWithFacebook).toHaveBeenLastCalledWith({ 
            id: 'any_id',
            name: 'any_name',
            facebookId: 'any_fb_id' 
        })
        expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)

    })
})



