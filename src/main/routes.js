import React from 'react'
import Login from '../views/login'
import SingUp from '../views/signUp'
// import Home from '../views/home'
import ChangePassword from '../views/changePassword'
import RecoverPassword from '../views/recoverPassword/recoverPassword'

import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'
import { AuthConsumer } from './authProvider'
import MenuHome from '../views/menuHome'


function AuthRoute( {component: Component, isAuth, checkSession, ...props} ) {

    return(
        <Route {...props} render={(componentProps) => {
            // checkSession()
            if(props.path === '/'){
                if(isAuth){
                    return (
                        <Redirect to={ {pathname: '/home', state: {from: componentProps.location} } } />
                    )
                }
                else {
                    return (
                        <Redirect to={ {pathname: '/login', state: {from: componentProps.location} } } />
                    )
                }
            }
            else if(isAuth) {
                return (
                    <Component {...componentProps} />
                ) 
            } else{
                return(
                    <Redirect to={ {pathname: '/login', state: {from: componentProps.location} } } />
                )
            }
        } } />
    )
    
}

function Routes(props){
    return (
        <HashRouter>
            <Switch>
                <Route path = "/login" component = {Login} />
                <Route path = "/signUp" component = {SingUp} />
                <Route path = "/recoverPassword/:email?/:hash?" component = {RecoverPassword} />
                {/* <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/home/:name?/:email?" component = {Home} /> */}
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/home/:name?/:email?" component = {MenuHome} />
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/changePassword" component = {ChangePassword} />
                <AuthRoute isAuth={props.isAuth} checkSession={props.checkSession} path = "/" />
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        { (context) => ( <Routes isAuth={context.isAuth} checkSession={context.checkSessionExpirationTime}/> ) }
    </AuthConsumer>
)