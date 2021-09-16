import React from 'react'
import { Menubar } from 'primereact/menubar'

class Topbar extends React.Component {

    render () {
        const items = [
            {label: 'Home', icon: 'pi pi-fw pi-home', command: () => {window.location="#/Home"}},
            // {label: 'Usuários', icon: 'pi pi-user', command: () => {window.location="#/signUp"}}, 
            {label: "Modules", icon: 'pi pi-list',
                items: [
                    {label: "Simulation", icon: 'pi pi-desktop', command: ()=> {window.location="#/simulation"}, url:'#/simulation'},
                    {label: "Help", icon: 'pi pi-info-circle', url:"https://github.com/PFC-IME-Opportunistic-Network-Simulator/backend/blob/master/README-usage.md"}
                ]
            }
        ]
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