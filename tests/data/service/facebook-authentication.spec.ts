import { LoadFacebooUserApi } from '@/domain/data/interfaces/apis';
import { FacebookAuthenticationService } from '@/domain/data/services/facebook-authentication';
import { AutheticationError } from '@/domain/errors';

import {mock} from 'jest-mock-extended'


describe('FacebookAuthenticationService', () => {
    it('should call loadFacebookUserApi with correct params', async () => {
        const loadFacebookUserApi = mock<LoadFacebooUserApi>()
        const sut = new FacebookAuthenticationService(loadFacebookUserApi)
        await sut.perfom({ token: 'any_token' })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when loadFacebookUserApi returns undefined', async () => {
        const loadFacebookUserApi = mock<LoadFacebooUserApi>()
        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
        const sut = new FacebookAuthenticationService(loadFacebookUserApi)

        const authResult = await sut.perfom({ token: 'any_token' })

        expect(authResult).toEqual(new AutheticationError())

    })


})


