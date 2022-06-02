export class AutheticationError extends Error {
    constructor() {
        super('Authetication failed')
        this.name = 'AutheticationError'
    }
}