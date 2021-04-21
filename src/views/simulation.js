import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import SelectMenu from '../components/selectMenu'


import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { RadioButton } from 'primereact/radiobutton'

import SimulationTable from '../components/simulation/simulationTable'
import SimulationService from '../app/service/simulationService'

import { errorPopUp, warningPopUp } from "../components/toastr"

const visiblePairsTrueOption = {name: 'All', key: true}
const visiblePairsFalseOption = {name: 'Just not configured yet', key: false}
const inputErrorClass = "is-invalid"

class Simulation extends React.Component{

    state = {
        numberOfNodes: null,
        visiblePairs: visiblePairsFalseOption,
        totalSimulationTime: null,
        inputSimulationTimeErrorClass: '',
        errorSimulationTimeMessage: '',
        timeUnitty: 's',
        pairs: [],
        filteredPairs: [],
        showPairs: false,
        displayCancelConfimation: false,
        minNode1Index: null,
        maxNode1Index: null,
        minNode2Index: null,
        maxNode2Index: null,
        meetingTrace: null,
        displayMeetingTrace: false,   
    }

    constructor(){
        super()
        this.simulationService = new SimulationService()
    }

    handleChange = event => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    handleSelectChange = async event => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value === '' ? null : value })
        this.filterPairs()
    }

    handleVisiblePaisOptionChange = async event => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value })
        this.filterPairs()
    }

    defineParameters = async () => {
        var pairs = []
        var id=0
        if(this.state.numberOfNodes <= 1){
            warningPopUp('Number of nodes must be greater than 1')
            return
        }
        for(var i = 1; i <= this.state.numberOfNodes; i++){
            for(var j = i+1; j <=  this.state.numberOfNodes; j++){
                    pairs.push({
                        id: id++,
                        node1: i,
                        node2: j,
                        rate: null,
                        variableRate: null,
                        variabilityDegree: null,
                        configured: false
                    })
            }
        }
        await this.setState({pairs})
        this.filterPairs()
        this.setState({showPairs: true})
    }

    configurePairs = async (parametrs, configuredPairs) => {
        var pairs = this.state.pairs
        configuredPairs.forEach(configuredPair => {
            var pairToUpdate = pairs.find(pair => pair.id === configuredPair.id)
            const index = pairs.indexOf(pairToUpdate)
            pairToUpdate.rate = parametrs.rate
            pairToUpdate.variableRate = parametrs.variableRate
            pairToUpdate.variabilityDegree = parametrs.variabilityDegree
            pairToUpdate.configured = true
            pairs[index] = pairToUpdate
            
        })
        await this.setState({pairs})
        this.filterPairs()

    }

    undoPairsConfiguration = (desconfiguredPairs) => {
        var pairs = this.state.pairs
        desconfiguredPairs.forEach(desconfiguredPair => {
            var pairToUpdate = pairs.find(pair => pair.id === desconfiguredPair.id)
            const index = pairs.indexOf(pairToUpdate)
            pairToUpdate.rate = null
            pairToUpdate.variableRate = null
            pairToUpdate.variabilityDegree = null
            pairToUpdate.configured = false
            pairs[index] = pairToUpdate
            
        })
        this.setState({pairs})
    }

    checkData = () => {
        var check = true

        if(!this.state.totalSimulationTime) {
            this.setState({inputSimulationTimeErrorClass: inputErrorClass})
            this.setState({errorSimulationTimeMessage: 'Simulation time is required'})
            check = false
        }

        for(var i = 0; i < this.state.pairs.length; i++){
            if(!this.state.pairs[i].configured){
                errorPopUp('There are not configured pairs yet')
                check = false
                break
            }
        }

        return check
    }

    resetView = () => {
        this.setState({inputSimulationTimeErrorClass: ''})
        this.setState({errorSimulationTimeMessage: ''})
    }

    callSimulation = () => {
        this.resetView()
        if(this.checkData()){
            this.simulationService.generateMeetingTrace({
                pairsList: this.state.pairs,
                totalSimulationTime: this.state.totalSimulationTime
            }).then(response => {
                this.setState({displayMeetingTrace: true})
                const meetingTrace= this.simulationService.parseMeetingTrace(response.data)
                this.setState({meetingTrace})
            })
            .catch(error => errorPopUp(error.response))
        }
    }

    cancelDefineParameters = () => {
        // this.setState({numberOfNodes: ''})
        // this.setState({totalSimulationTime: ''})
        // this.setState({pairs: []})
        // this.setState({showPairs: false})
        // this.setState({displayMeetingTrace: false})
        // this.setState({displayCancelConfimation: false})
        window.location.reload()
    }

    filterPairs = () => {
        var filteredPairs = []
        // console.log('indexes: ', this.state.minNode1Index, this.state.maxNode1Index, this.state.minNode2Index, this.state.maxNode2Index)
        this.state.pairs.forEach(pair => {
            var minNode1 = this.state.minNode1Index === null ? true : pair.node1 >= this.state.minNode1Index
            var maxNode1 = this.state.maxNode1Index === null ? true : pair.node1 <= this.state.maxNode1Index
            var minNode2 = this.state.minNode2Index === null ? true : pair.node2 >= this.state.minNode2Index
            var maxNode2 = this.state.maxNode2Index === null ? true : pair.node2 <= this.state.maxNode2Index
            var showPair = this.state.visiblePairs.key ? true : !pair.configured
            // console.log('\n')
            // console.log('minNode1: ', minNode1)
            // console.log('maxNode1: ', maxNode1)
            // console.log('minNode2: ', minNode2)
            // console.log('maxNode2: ', maxNode2)
            // console.log('\n')
            if(minNode1 && maxNode1 && minNode2 && maxNode2 && showPair){
                filteredPairs.push(pair)
            }
        })
        this.setState({filteredPairs})
    }

    render() {

        const visiblePairsOption = [visiblePairsTrueOption, visiblePairsFalseOption]

        const timeUnityList = [
            {label:'s', value: 's'},
	        {label:'ms', value: 'ms'}
        ]

        const minNodeIndexes = SimulationService.minNodeIndexes(this.state.numberOfNodes)
        // const maxNode1Indexes = SimulationService.maxNodeIndexes(this.state.numberOfNodes, parseInt(this.state.minNode1Index))
        // const maxNode2Indexes = SimulationService.maxNodeIndexes(this.state.numberOfNodes, parseInt(this.state.minNode2Index))
        const maxNode1Indexes = SimulationService.minNodeIndexes(this.state.numberOfNodes)
        const maxNode2Indexes = SimulationService.minNodeIndexes(this.state.numberOfNodes)

        const renderCancelConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Confirm" icon="pi pi-check"
                            onClick={this.cancelDefineParameters} autoFocus />
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({displayCancelConfimation: false})}
                            className="p-button-text" />
                </div>
            );
        
        }

        return(
            <div className="bs-docs-section" >
            <Card title = "Simulation">
                <div className = "col-md-12">
                    <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Number of nodes " htmlFor = "InputNodes">
                            <input type="number"
                                    className={"form-control " + this.state.inputEmailErrorClass}
                                    value = {this.state.numberOfNodes}
                                    name="numberOfNodes"
                                    onChange={this.handleChange}
                                    id="InputNodes"
                                    placeholder="Type the number of nodes"
                                    disabled={this.state.showPairs} 
                            />
                        </FormGroup> 
                    </div>
                    </div>
                    
                    {/* <Button 
                        label="Define Nodes Parameters"
                        icon="pi pi-pencil"
                        onClick={this.defineParameters}
                        style={ {maxHeight: '35px'} }
                        disabled={this.state.numberOfNodes === null}
                    /> */}
                    {   this.state.showPairs ?
                    (
                    <>
                    <Button className="p-button-danger" 
                        label="Cancel"
                        icon="pi pi-times"
                        onClick={() => this.setState({displayCancelConfimation: true})}
                        style={ {maxHeight: '35px'} }
                        disabled={this.state.numberOfNodes === null}
                    />
                    <br/>
                    <br/>
                    <div className="row">
                    <div className = "col-md-4">
                    <h5> Node 1 Interval </h5>
                    </div>
                    <div className = "col-md-4">
                    <h5> Node 2 Interval </h5>
                    </div>
                    <div className = "col-md-4">
                    <h5> Visible Pairs </h5>
                    </div>
                    </div>
                    <div className="row">
                    <div className = "col-md-4">
                    <div className="row">
                    <div className = "col-md-3">
                        <FormGroup label = "min_index " htmlFor = "minNode1Index">
                            <SelectMenu className={"form-control " }
                                        name="minNode1Index"
                                        list= {minNodeIndexes} 
                                        onChange={this.handleSelectChange}
                            />
                        </FormGroup>
                    </div>
                    <div className = "col-md-3">
                    <FormGroup label = "max_index " htmlFor = "maxNode1Index">
                            <SelectMenu className={"form-control " }
                                        name="maxNode1Index"
                                        list= {maxNode1Indexes} 
                                        onChange={this.handleSelectChange}
                            />
                        </FormGroup>
                    </div>
                    </div>
                    </div>
                    <div className = "col-md-4">
                    <div className="row">
                    <div className = "col-md-3">
                        <FormGroup label = "min_index " htmlFor = "minNode2Index">
                            <SelectMenu className={"form-control " }
                                        name="minNode2Index"
                                        list= {minNodeIndexes} 
                                        onChange={this.handleSelectChange}
                            />
                        </FormGroup>
                    </div>
                    <div className = "col-md-3">
                    <FormGroup label = "max_index " htmlFor = "maxNode2Index">
                            <SelectMenu className={"form-control " }
                                        name="maxNode2Index"
                                        list= {maxNode2Indexes} 
                                        onChange={this.handleSelectChange}
                            />
                        </FormGroup>
                    </div>
                    </div>
                    </div>
                    <div className = "col-md-4">
                        {
                            visiblePairsOption.map((option) => {
                                return (
                                    <div key={option.key} className="p-field-radiobutton">
                                        <RadioButton inputId={option.key} name="visiblePairs" value={option}
                                            onChange={this.handleVisiblePaisOptionChange}
                                            checked={this.state.visiblePairs.key === option.key}
                                             />
                                        <label htmlFor={option.key}>{option.name}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                    </div>
                    </>
                    )
                    : ( <Button 
                        label="Define Nodes Parameters"
                        icon="pi pi-pencil"
                        onClick={this.defineParameters}
                        style={ {maxHeight: '35px'} }
                        disabled={this.state.numberOfNodes === null}
                        /> )
                    }
                    <br />
                    {
                        this.state.showPairs ? (
                            <SimulationTable list = {this.state.filteredPairs}
                                configurePairs = {this.configurePairs}
                                undoPairsConfiguration = {this.undoPairsConfiguration}
                            />
                        ) : (<div />)
                    }
                    <br />
                    <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Total simulation time " htmlFor = "InputTime">
                            <input type="number"
                                    className={"form-control " + this.state.inputSimulationTimeErrorClass}
                                    value = {this.state.totalSimulationTime}
                                    name="totalSimulationTime"
                                    onChange={this.handleChange}
                                    id="InputTime"
                                    placeholder="Type the total simulation time" 
                            />
                            <div className="invalid-feedback">{this.state.errorSimulationTimeMessage}</div>
                        </FormGroup>
                    </div>
                    <div className = "col-md-1">
                        <FormGroup label = "Unity " htmlFor = "InputUnity">
                            <SelectMenu className={"form-control " }
                                        name="timeUnitty"
                                        list= {timeUnityList}
                                        onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    </div>
                    {
                        this.state.showPairs ?
                        (
                            <Button 
                                label="Start Simulation"
                                icon="pi pi-desktop"
                                onClick={this.callSimulation}
                                style={ {maxHeight: '35px'} }
                                // disabled={this.state.numberOfNodes === null}
                            /> 

                        ) : (
                            <div />
                        )
                    }
                    {
                        this.state.displayMeetingTrace ? (
                            <div>
                                <br />
                                <FormGroup label = "Meeting Trace " htmlFor = "outputMeetingTrace">
                                    <textarea   className={"form-control " }
                                                id="outputMeetingTrace"
                                                name="meetingTrace"
                                                value={this.state.meetingTrace}
                                                style={{marginTop: '0px', marginBottom: '0px', minHeight: '180px'}} />
                                </FormGroup>
                            </div>
                        ) :
                        (
                            <div />
                        )

                    }
                </div>
            </Card>
            <Dialog header="Delete Configuration"
                        visible={this.state.displayCancelConfimation}
                        modal = {true} //congela restante da tela
                        style={{ width: '350px' }}
                        footer={renderCancelConfirmationFooter()}
                        onHide={() => this.setState({displayConfirmation: false})}>
                    <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                        <div style={{marginBottom: '10px'}}> Confirm delete configuration? </div>
                    </div>
            </Dialog>
            <div className="d-flex "/>
            </div>        
        )
    }
}

export default withRouter(Simulation)