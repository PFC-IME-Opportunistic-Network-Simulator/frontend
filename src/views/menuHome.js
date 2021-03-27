import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../components/card'


import { Button } from 'primereact/button'

class MenuHome extends React.Component{

    render() {
        return(
            <div className="bs-docs-section" >
                <Card title="Criar simulação">
                    Defina seus parâmetros de simulação da rede como a quantidade de nós e as taxas de encontro
                    para realizar sua simulação
                    <br />
                    <a href="#/home"> 
                    <Button 
                            label="Ir para a simulação"
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