import React from 'react'
import { Menubar } from 'primereact/menubar'
import UserMenu from './navbar/userMenu';

class Topbar extends React.Component {

    render () {
        const items = [
            {label: 'Home', icon: 'pi pi-fw pi-home', command: () => {window.location="#/Home"}},
            // {label: 'Usuários', icon: 'pi pi-user', command: () => {window.location="#/signUp"}}, 
            {label: "Modules", icon: 'pi pi-list',
                items: [
                    {label: "Simulation", icon: 'pi pi-desktop', command: ()=> {window.location="#/simulation"}},
                ]
            }
        ]
        // const start = <UserMenu render = {this.context.isAuth} endSession = {this.context.endSession} />;
        // const end = <UserMenu isAuth = {this.context.isAuth} endSession = {this.context.endSession} />;
        return (
            <div>
                <div className="card">
                    <Menubar model={items}/>
                </div>
            </div>
        )
    }
}

export default Topbar