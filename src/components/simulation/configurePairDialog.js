import React from 'react'

import { Dialog } from 'primereact/dialog'
import { RadioButton } from 'primereact/radiobutton';

import SelectMenu from '../selectMenu'
import DialogFooter from '../dialogFooter'
import ConfirmationDialog from '../confirmationDialog'

const variableRateTrueObj = {name: 'Yes', key: true}
const variableRateFalseObj = {name: 'No', key: false}
const inputErrorClass = "is-invalid"

class ConfigurePairDialog extends React.Component {


    state = {
        rate: null,
        inputRateErrorClass: '',
        errorRateMessage: '',
        variableRate: variableRateFalseObj,
        variabilityDegree: null,
        inputVariabilityDegreeErrorClass: '',
        errorVariabilityDegreeMessage: '',
        didUpdated: false,
        visibleConfirmDialog: false,
    }

    // constructor(){
    //     super();
        
    // }

    componentDidUpdate(){
        if(this.props.visible && !this.state.didUpdated){
            this.setState({rate: null})
            this.setState({variableRate: variableRateFalseObj})
            this.setState({variabilityDegree: null})
            this.setState({didUpdated: true})
            this.resetView()
        }
    }

    resetView = () => {
        this.setState({inputRateErrorClass: ''})
        this.setState({errorRateMessage: ''})
        this.setState({inputVariabilityDegreeErrorClass: ''})
        this.setState({errorVariabilityDegreeMessage: ''})
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    handleVariableRateChange = (e) => {
        var value = e.value
        this.setState({variableRate: value})
        if(!value.key){
            this.setState({ variabilityDegree: value })
        }
    }

    hideDialog = () => {
        this.setState({didUpdated: false})
        this.props.hideDialog()
    } 
    
    checkData = () => {
        var check = true
        if(!this.state.rate){
            this.setState({inputRateErrorClass: inputErrorClass})
            this.setState({errorRateMessage:"Rate is required"})
            check = false
        }
        if(this.state.variableRate.key){
            if(!this.state.variabilityDegree){
                this.setState({inputVariabilityDegreeErrorClass: inputErrorClass})
                this.setState({errorVariabilityDegreeMessage:"Variability Degree is required when rate is variable"})
                check = false
            }
        }
        return check
    }

    callSave = () => {
        this.resetView()
        if(this.checkData()){
            // this.setState({visibleConfirmDialog: true})
            this.props.save({
                rate: this.state.rate,
                variableRate: this.state.variableRate ? this.state.variableRate.key : false,
                variabilityDegree: this.state.variabilityDegree
            })
            this.setState({didUpdated: false})
        }
    }

    hideConfirmDialog = () => {
        this.setState({visibleConfirmDialog: false})
    }

    render () {

        const varialbeRateOptions = [variableRateTrueObj, variableRateFalseObj]

        const productDialogFooter = (
            <DialogFooter save = {this.callSave} hideDialog = {this.hideDialog} disabled={this.props.disabled} />
        )

        return (
            <>
            <Dialog visible={this.props.visible} style={{ width: '450px' }}
                    header={this.props.header}
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={this.hideDialog}>
                <div className="p-field">
                    <label htmlFor="rate">Rate</label>
                    <input type="number"
                            className={"form-control " + this.state.inputRateErrorClass}
                            value = {this.state.rate}
                            name="rate"
                            onChange={this.handleChange}
                            id="inputRate"
                            placeholder="Type the rate in seconds"
                            />
                    <div className="invalid-feedback">{this.state.errorRateMessage}</div>
                </div>
                <br/>
                    <label htmlFor="rate">Variable Rate</label>
                {
                    varialbeRateOptions.map((option) => {
                        return (
                            <div key={option.key} className="p-field-radiobutton">
                                <RadioButton inputId={option.key} name="varialbeRateOption" value={option}
                                    onChange={this.handleVariableRateChange}
                                    checked={this.state.variableRate.key === option.key} />
                                <label htmlFor={option.key}>{option.name}</label>
                            </div>
                        )
                    })
                }
                <br/>
                <div className="p-field">
                    <label htmlFor="ncm">Variability Degree</label>
                    <input type="number"
                            className={"form-control " + this.state.inputVariabilityDegreeErrorClass}
                            value = {this.state.variabilityDegree}
                            name="variabilityDegree"
                            onChange={this.handleChange}
                            id="inputVariabilityDegree"
                            placeholder="Type the Variability Degree"
                            disabled={!this.state.variableRate.key}  
                            />
                    <div className="invalid-feedback">{this.state.errorVariabilityDegreeMessage}</div>
                </div>
                <br />

            </Dialog>
            
            <ConfirmationDialog
                header="Editar produto"
                confimationMessage="Confirmar modificação no produto?"
                visible={this.state.visibleConfirmDialog && this.props.visible}
                confirm={this.save}
                hide={this.hideConfirmDialog}
                 />

            </>

        )
    }
}

export default ConfigurePairDialog