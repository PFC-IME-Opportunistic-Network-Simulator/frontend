import React from 'react'
import { Menubar } from 'primereact/menubar'
import SimulationService from '../app/service/simulationService'

class Topbar extends React.Component {

    constructor(){
        super()
        this.simulationService = new SimulationService();
    }

    download = () => {
        this.simulationService.download()
        .then(response => {
            console.log(response)
        }).catch(error => {
            console.log(error)
        })
    }

    render () {
        const items = [
            {label: 'Home', icon: 'pi pi-fw pi-home', command: () => {window.location="#/Home"}},
            // {label: 'Usuários', icon: 'pi pi-user', command: () => {window.location="#/signUp"}}, 
            {label: "Modules", icon: 'pi pi-list',
                items: [
                    {label: "Simulation", icon: 'pi pi-desktop', command: ()=> {window.location="#/simulation"}, url:'#/simulation'},
                    {label: "Download", icon: 'pi pi-desktop', command: ()=> {this.download()}},
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