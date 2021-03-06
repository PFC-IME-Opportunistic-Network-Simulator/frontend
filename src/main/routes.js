import React from 'react'
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'

import MenuHome from '../views/menuHome'
import Simulation from '../views/simulation'


function RedirectRoute( {component: Component, isAuth, checkSession, ...props} ) {

    return(
        <Route {...props} render={(componentProps) => {
            if(props.path === '/'){
                    return (
                        <Redirect to={ {pathname: '/home', state: {from: componentProps.location} } } />
                    )
            }
            else{
                return (
                    <Component {...componentProps} />
                ) 
            }
        } } />
    )
    
}

function Routes(props){
    return (
        <HashRouter>
            <Switch>
                <Route path = "/home" component = {MenuHome} />
                <Route path = "/simulation" component = {Simulation} />
                <RedirectRoute path = "/" />
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <Routes />
)