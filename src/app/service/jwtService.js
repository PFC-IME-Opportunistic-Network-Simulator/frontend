import ApiService from "../apiServices";

class JwtService extends ApiService{
    
    constructor() {
        super('/api/jwt')
    }

    auth(credentials){
        return this.post('/authenticate', credentials)
    }

    checkSession() {
        return this.get('/checkSession')
    }
}

export default JwtService