import React from 'react'

import { Button } from 'primereact/button'

export default function DialogFooter (props) {
    return (
        <React.Fragment>
            {
                !props.disabled ? (
                    <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={props.save} />
                ) :
                (
                    <div/>
                )
            }
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.hideDialog} />
        </React.Fragment>
    )
}