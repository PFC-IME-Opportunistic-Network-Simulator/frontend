import ApiService from "../apiServices";


class UserService extends ApiService {

    constructor() {
        super('/api/users')
    }

    signUp(userData){
        return this.post('/signUp', userData)
    }
    
    getAllUsers() {
        return this.get('/getUsers')
    }

    changePassword(userData){
        return this.put('/changePassword', userData)
    }

    getUserFromEmailAndHash(email, hash){
        let params = `?`
        params = `${params}&email=${email}`
        params = `${params}&hash=${hash}`
        return this.get(`/getUserFromHash${params}`)
    }

    redefinePassword(email, hash, userData){
        let params = `?`
        params = `${params}&email=${email}`
        params = `${params}&hash=${hash}`
        return this.put(`/redefinePassword${params}`, userData)
    }

}

export default UserService