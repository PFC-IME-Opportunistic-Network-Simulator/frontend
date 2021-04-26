import axios from 'axios'

class ApiBaseURL {
    
    constructor(){
        this.httpClient = axios.create({
            baseURL: 'http://localhost:8080',
            // baseURL: 'https://c8af518d4286.ngrok.io',
        
        })
    }
}

export default ApiBaseURL