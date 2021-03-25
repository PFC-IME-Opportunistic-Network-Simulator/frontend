import React from 'react'
import AuthService from '../app/service/authService'
import HandleErrorService from '../app/service/handleErrorService'
import JwtService from '../app/service/jwtService'

export const AuthContext = React.createContext()
export const AuthConsumer = AuthContext.Consumer
const AuthProvider = AuthContext.Provider


class AuthenticationProvider extends React.Component {

    constructor(){
        super();
        this.jwtService = new JwtService();
    }

    state = {
        userLoggedIn: AuthService.userLoggedIn(),
        isAuth: AuthService.isUserLoggedIn()
    }
    
    beginSession = (data) => {
        const user = data.user
        const token = data.token
        AuthService.login(user, token)
        this.setState({isAuth: true, userLoggedIn: user})
    }

    endSession = () => {
        AuthService.logOut()
        this.setState({isAuth: false, userLoggedIn: null})
    }

    checkSessionExpirationTime = () => {
        if(AuthService.token() && Date.now() > AuthService.getCheckDate() + 24*3600*1000){
            this.jwtService.checkSession()
            .then(response => {
            }).catch(error => {
                console.log('catch session', error)
                HandleErrorService.handleError(null, error)
                this.endSession()
            })
        }
    }

    render() {

        const context = {
            userLoggedIn: this.state.userLoggedIn,
            isAuth: this.state.isAuth,
            beginSession: this.beginSession,
            endSession: this.endSession,
            checkSessionExpirationTime: this.checkSessionExpirationTime
        }

        return (
            <AuthProvider value={context}>
                {this.props.children}
            </AuthProvider>
        )
    }
}

export default AuthenticationProvider