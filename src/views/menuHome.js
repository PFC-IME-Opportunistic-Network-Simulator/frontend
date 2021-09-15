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
                            label="Go to simulation"
                            icon="pi pi-desktop"
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