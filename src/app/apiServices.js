import ApiBaseURL from './apiBaseURL'
import AuthService from './service/authService'

class ApiService extends ApiBaseURL {

    constructor(api_url){
        super();
        this.api_url = api_url
    }

    post(url, object){
        // const token = AuthService.token() ? AuthService.token() : ''
        return this.httpClient.post(this.api_url + url, object, {
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Accept' : 'application/json',
            //     'Content-Type': 'application/json'
            // }
        }
            )
    }

    put(url, object){
        // const token = AuthService.token() ? AuthService.token() : ''
        return this.httpClient.put(this.api_url + url, object, {
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Accept' : 'application/json',
            //     'Content-Type': 'application/json'
            // }
        })
    }

    delete(url){
        // const token = AuthService.token() ? AuthService.token() : ''
        return this.httpClient.delete(this.api_url + url, {
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Accept' : 'application/json',
            //     'Content-Type': 'application/json'
            // }
        })
    }

    get(url, headers = {}){
        // const token = AuthService.token() ? AuthService.token() : ''
        return this.httpClient.get(this.api_url + url, {
            headers
        }
            )
    }
}

export default ApiService