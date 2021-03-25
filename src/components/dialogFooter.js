import React from 'react'

import { Button } from 'primereact/button'

export default function DialogFooter (props) {
    return (
        <React.Fragment>
            {
                !props.disabled ? (
                    <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={props.save} />
                ) :
                (
                    <div/>
                )
            }
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={props.hideDialog} />
        </React.Fragment>
    )
}