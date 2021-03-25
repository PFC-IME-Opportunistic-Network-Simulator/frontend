import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react'

export default function ConfirmationDialog(props){
    
    const renderConfirmationFooter = () => {
        return (
            <div>
                <Button label="Confirmar" icon="pi pi-check"
                        onClick={props.confirm} autoFocus />
                <Button label="Cancelar" icon="pi pi-times" onClick={props.hide}
                        className="p-button-text" />
            </div>
        );
    }

    return (
        <Dialog header={props.header}
                visible={props.visible}
                modal = {true} //congela restante da tela
                style={{ width: '350px' }}
                footer={renderConfirmationFooter()}
                onHide={props.hide}>
            <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                <div style={{marginBottom: '10px'}}> {props.confimationMessage} </div>
            </div>
        </Dialog>
    )
}