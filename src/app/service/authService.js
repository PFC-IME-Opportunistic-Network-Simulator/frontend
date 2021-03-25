import LocalStorageService from './localStorageService'
import SessionStorageService from './sessionStorageService'

export const userLoggedIn = 'userLoggedIn'
export const userToken = 'token'
export const lastCheckDate = 'lastCheckDate'
const Service = LocalStorageService
// const Service = SessionStorageService

export default class AuthService {

    static isUserLoggedIn(){
        const user = Service.getItem(userLoggedIn)
        return user && user.id
    }

    static userLoggedIn(){
        return Service.getItem(userLoggedIn)
    }

    static token(){
        return Service.getItem(userToken)
    }

    static login(user, token) {
        Service.addItem(userLoggedIn, user)
        Service.addItem(userToken, token)
        Service.addItem(lastCheckDate, Date.now())
    }

    static logOut(){
        Service.removeItem(userLoggedIn)
        Service.removeItem(userToken)
        Service.removeItem(lastCheckDate)
    }

    static getCheckDate(){
        return Service.getItem(lastCheckDate)
    }

}