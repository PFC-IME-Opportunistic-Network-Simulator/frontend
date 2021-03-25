import React from 'react'
import { Menubar } from 'primereact/menubar'
import UserMenu from './navbar/userMenu';
import { AuthContext } from '../main/authProvider';

class Topbar extends React.Component {

    render () {
        const items = [
            {label: 'Home', icon: 'pi pi-fw pi-home', command: () => {window.location="#/Home"}},
            // {label: 'Usuários', icon: 'pi pi-user', command: () => {window.location="#/signUp"}}, 
            {label: "Módulos", icon: 'pi pi-list',
                items: [
                    {label: "Simulação", icon: 'pi pi-desktop', command: ()=> {window.location="#/home"}},
                ]
            }
        ]
        // const start = <UserMenu render = {this.context.isAuth} endSession = {this.context.endSession} />;
        const end = <UserMenu isAuth = {this.context.isAuth} endSession = {this.context.endSession} />;
        return (
            <div>
                <div className="card">
                    <Menubar model={items} end={end} />
                </div>
            </div>
        )
    }
}

Topbar.contextType = AuthContext

export default Topbar