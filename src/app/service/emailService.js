import ApiService from "../apiServices";

class EmailService extends ApiService {

    constructor() {
        super('/api/email')
    }

    recoverPassword(userData){
        return this.post('/recoverPassword', userData)
    }

}

export default EmailService