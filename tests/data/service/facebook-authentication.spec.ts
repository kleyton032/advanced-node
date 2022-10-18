import { LoadFacebooUserApi } from '@/data/interfaces/apis';
import { TokenGenerator } from '@/data/interfaces/crypto';
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/interfaces/repos';
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken, FacebookAccount } from '@/domain/models';


jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {

    let facebookApi: MockProxy<LoadFacebooUserApi>
    let crypto: MockProxy<TokenGenerator>
    let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
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
        userAccountRepo.load.mockResolvedValue(undefined)
        userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
        crypto = mock()
        crypto.generateToken.mockResolvedValue('any_generated_token')
        sut = new FacebookAuthenticationService(
            facebookApi,
            userAccountRepo,
            crypto
        )
    })

    it('should call loadFacebookUserApi with correct params', async () => {

        await sut.perfom({ token })

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


    // it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {

    //     await sut.perfom({ token })

    //     expect(userAccountRepo.saveWithFacebook).toHaveBeenLastCalledWith({
    //         email: 'any_fb_email',
    //         name: 'any_fb_name',
    //         facebookId: 'any_fb_id'
    //     })
    //     expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)

    // })


    it('should call TokenGenerator with correct params ', async () => {

        await sut.perfom({ token })

        expect(crypto.generateToken).toHaveBeenLastCalledWith({
            key: 'any_account_id',
            expirationInMs: AccessToken.expirationInMs
        })
        expect(crypto.generateToken).toHaveBeenCalledTimes(1)

    })


    it('should return TokenGenerator on success ', async () => {

       const authResult =  await sut.perfom({ token })
    
       expect(authResult).toEqual(new AccessToken('any_generated_token'))

    })

    it('should rethrow if LoadFacebooUserApi throws', async () => {
        facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

        const promise = sut.perfom({ token })
     
        await expect(promise).rejects.toThrow(new Error('fb_error'))
 
     })

     it('should rethrow if LoadUserAccountRepository throws', async () => {
        userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

        const promise = sut.perfom({ token })
     
        await expect(promise).rejects.toThrow(new Error('load_error'))
 
     })

     it('should rethrow if SaveFacebookAccountRepository throws', async () => {
        userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

        const promise = sut.perfom({ token })
     
        await expect(promise).rejects.toThrow(new Error('save_error'))
 
     })

     it('should rethrow if TokenGenerator throws', async () => {
        crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

        const promise = sut.perfom({ token })
     
        await expect(promise).rejects.toThrow(new Error('token_error'))
 
     })

     
 

})



