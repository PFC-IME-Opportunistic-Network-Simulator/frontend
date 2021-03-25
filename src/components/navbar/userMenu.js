import React from 'react'

import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

class UserMenu extends React.Component {

    constructor() {
        super();
        this.menu = React.createRef()
        this.toast = React.createRef()
    }
    items = [
        {
            label: 'Opções',
            items: [
                {
                    label: 'Alterar Senha',
                    icon: 'pi pi-refresh',
                    command: () => {
                        window.location="#/changePassword"
                    }
                },
                {
                    label: 'Sair',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        this.props.endSession()
                        window.location="#/Login"
                    }
                }
            ]
        }
        
    ]

    render() {
        if(this.props.render){
            return (
                <div>
                    <Toast ref={this.toast}></Toast>

                    <Menu model={this.items} popup ref={this.menu} id="popup_menu" />
                    <Button className="p-button-raised p-button-secondary p-button-text"
                            icon="pi pi-bars"
                            style={ {width: '50px'} }
                            onClick={(event) => this.menu.current.toggle(event)} 
                            aria-controls="popup_menu" 
                            aria-haspopup ></Button>
                </div>
            )
        }
        return false
    }

}

export default UserMenu