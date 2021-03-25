import React from 'react';
import { AuthConsumer } from '../../main/authProvider';
import NavItem from './navItem'
import UserMenu from './userMenu';
function Navbar(props) {
    
    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <a className="navbar-brand" href="#/home">Finances</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav mr-auto">
        <NavItem render = {props.isAuth} href="#/home" label = "Home"/>
        <NavItem render = {props.isAuth} href="#/signUp" label = "Usuários"/>
        <NavItem render = {props.isAuth} href="#/searchEntry" label = "Lançamentos"/>
        <NavItem render = {props.isAuth} onClick = {props.endSession} href="#/login" label = "Sair"/>
        {/* <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#"
            role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
            <div className="dropdown-menu">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Separated link</a>
            </div>
        </li>               */}
        </ul>
        <form className="form-inline my-2 my-lg-0">
        {/* <input className="form-control mr-sm-2" type="text" placeholder="Search" />
        <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button> */}
        <UserMenu render = {props.isAuth} />
        </form>
    </div>
    </nav>       
    )
}

export default () => (
    <AuthConsumer>
        { (context) => (
            <Navbar isAuth={context.isAuth} endSession={context.endSession} />
        )
        }
    </AuthConsumer>
)