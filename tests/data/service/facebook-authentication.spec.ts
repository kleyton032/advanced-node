import { LoadFacebooUserApi } from '@/domain/data/interfaces/apis';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';

import {mock, MockProxy} from 'jest-mock-extended'


describe('FacebookAuthenticationService', () => {

    let loadFacebookUserApi: MockProxy< LoadFacebooUserApi>
    let sut: FacebookAuthenticationService

    beforeEach(()=> {
        loadFacebookUserApi = mock()
        sut = new FacebookAuthenticationService(loadFacebookUserApi)
    })

    it('should call loadFacebookUserApi with correct params', async () => {

        await sut.perfom({ token: 'any_token' })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when loadFacebookUserApi returns undefined', async () => {
        
        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    
        const authResult = await sut.perfom({ token: 'any_token' })

        expect(authResult).toEqual(new AutheticationError())

    })


})


