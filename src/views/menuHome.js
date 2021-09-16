import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../components/card'


import { Button } from 'primereact/button'

class MenuHome extends React.Component{

    render() {
        return(
            <div className="bs-docs-section" >
                <Card title="Create simulation">
                    Define your network scenario to perform your simulation.
                    <br />
                    <a href="#/simulation"> 
                    <Button 
                            label="Simulation"
                            icon="pi pi-desktop"
                            style={ {maxHeight: '35px', marginTop: '5px'} }
                        />
                    </a>

                </Card>

                <Card title="Help">
                    Access the usage instructions learn to about run simluaton.
                    <br />
                    <a href="https://github.com/PFC-IME-Opportunistic-Network-Simulator/backend/blob/master/README-usage.md"> 
                    <Button 
                            label="Help"
                            icon="pi pi-info-circle"
                            style={ {maxHeight: '35px', marginTop: '5px'} }
                        />
                    </a>

                </Card>

                <div className="d-flex" />

            </div>

        )
    }

}

export default withRouter(MenuHome)