import React from 'react'
import { Menubar } from 'primereact/menubar'
import UserMenu from './navbar/userMenu';
import { AuthContext } from '../main/authProvider';

class Topbar extends React.Component {

    render () {
        const items = [
            {label: 'Home', icon: 'pi pi-fw pi-home', command: () => {window.location="#/Home"}},
            // {label: 'Usuários', icon: 'pi pi-user', command: () => {window.location="#/signUp"}},
            this.context.isAuth ? 
            {label: "Módulos", icon: 'pi pi-list',
                items: [
                    {label: "Importação", icon: 'pi pi-upload', command: ()=> {window.location="#/register"}},
                    {label: "Lançamento de Invetário", icon: 'pi pi-pencil', command: () => {window.location="#/inventoryLaunch"}},
                    {label: "Produtos Cadastrados", icon: 'pi pi-search', command: () => {window.location="#/searchProducts"}},
                    {label: "Movimentações", icon: 'pi pi-sort-alt', command: () => {window.location="#/transactions"}, href:"#/transactions"},
                    {label: "Parametrização", icon: 'pi pi-link', command: () => {window.location="#/parameterize"}},
                ]
            } : {}
        ]
        // const start = <UserMenu render = {this.context.isAuth} endSession = {this.context.endSession} />;
        const end = <UserMenu render = {this.context.isAuth} endSession = {this.context.endSession} />;
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