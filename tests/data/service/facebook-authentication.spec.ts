import { LoadFacebooUserApi } from '@/domain/data/interfaces/apis';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';

import {mock, MockProxy} from 'jest-mock-extended'


type SutTypes = {
    sut: FacebookAuthenticationService
    loadFacebookUserApi: MockProxy< LoadFacebooUserApi>
}

const makeSut = (): SutTypes => {
    const loadFacebookUserApi = mock<LoadFacebooUserApi>()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    return {
        sut,
        loadFacebookUserApi
    }
}



describe('FacebookAuthenticationService', () => {
    it('should call loadFacebookUserApi with correct params', async () => {
        
        const {sut, loadFacebookUserApi} = makeSut()

        await sut.perfom({ token: 'any_token' })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when loadFacebookUserApi returns undefined', async () => {
        const {sut, loadFacebookUserApi} = makeSut()
        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    
        const authResult = await sut.perfom({ token: 'any_token' })
        
        expect(authResult).toEqual(new AutheticationError())

    })


})


