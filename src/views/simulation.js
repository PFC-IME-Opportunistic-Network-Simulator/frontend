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
const invalidFeedback = "invalid-feedback"
const integerInput = ["numberOfRounds", "sourceNodeId", 'destinationNodeId']

class Simulation extends React.Component{

    state = {
        numberOfRounds: null,
        inputNumberOfRoundsErrorClass: '',
        errorNumberOfRoundsMessage: '',

        messageGenarationType: '',
        inputMessageGenerationTypeErrorClass: '',
        
        protocolType: null,
        inputProtocolTypeErrorClass: '',
        errorProtocolTypeMessage: '',

        sprayAndWaitLParameter: null,
        inputSprayAndWaitLParameterErrorClass: '',
        errorSprayAndWaitLParameterMessage: '',
        
        epidemicPParameter: null,
        inputEpidemicPParameterErrorClass: '',
        errorEpidemicPParameterMessage: '',

        epidemicQParameter: null,
        inputEpidemicQParameterErrorClass: '',
        errorEpidemicQParameterMessage: '',

        numberOfNodes: null,
        inputNumberOfNodesErrorClass: '',
        errorNumberOfNodesMessage: '',
        visiblePairs: visiblePairsFalseOption,

        totalSimulationTime: null,
        inputSimulationTimeErrorClass: '',
        errorSimulationTimeMessage: '',
        
        messageGenerationInstant: null,
        inputMessageGenerationInstantErrorClass: '',
        errorMessageGenerationInstantMessage: '',
        
        sourceNodeId: null,
        inputSourceNodeIdErrorClass: '',
        errorSourceNodeIdMessage: '',

        destinationNodeId: null,
        inputDestinationNodeIdErrorClass: '',
        errorDestinationNodeIdMessage: '',

        pairs: [],
        filteredPairs: [],
        showPairs: false,
        displayCancelConfimation: false,
        minNode1Index: null,
        maxNode1Index: null,
        minNode2Index: null,
        maxNode2Index: null,
        meetingTrace: null,
        messagesResponse: null,
        displayMeetingTrace: false,
        
        alreadyChecked: false
    }

    constructor(){
        super()
        this.simulationService = new SimulationService()
    }

    handleChange = async event => {
        var value = event.target.value
        const name = event.target.name
        if(value < 0)
            value = -value
        try{
            if(integerInput.includes(name))
                value = value.toString().replace(/\D/,'')
        } catch(error){
            value = null
        }
        await this.setState({ [name]: value })

        if(this.state.alreadyChecked){
            this.resetView()
            this.checkData()
        }
    }

    handleSelectChange = async event => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value === '' ? null : value })

        if(this.state.alreadyChecked){
            this.resetView()
            this.checkData()
        }
    }

    handleSelectProtocolTypeChange = event => {
        this.resetProtocolParameters()
        this.handleSelectChange(event)
    }

    resetProtocolParameters = () => {
        this.setState({sprayAndWaitLParameter: null})
        this.setState({epidemicPParameter: null})
        this.setState({epidemicQParameter: null})
    }

    handleSelectNodeChange = async event => {
        // const value = event.target.value
        // const name = event.target.name
        // await this.setState({ [name]: value === '' ? null : value })
        await this.handleSelectChange(event)
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
        for(var i = 0; i < this.state.numberOfNodes; i++){
            for(var j = i+1; j <  this.state.numberOfNodes; j++){
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

    configurePairs = async (parameters, configuredPairs) => {
        var pairs = this.state.pairs
        configuredPairs.forEach(configuredPair => {
            var pairToUpdate = pairs.find(pair => pair.id === configuredPair.id)
            const index = pairs.indexOf(pairToUpdate)
            pairToUpdate.rate = parameters.rate
            pairToUpdate.variableRate = parameters.variableRate
            pairToUpdate.variabilityDegree = parameters.variabilityDegree
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
        
        if(!this.state.numberOfRounds){
            this.setState({inputNumberOfRoundsErrorClass: inputErrorClass})
            check = false
        }

        if(!this.state.protocolType){
            this.setState({inputProtocolTypeErrorClass: inputErrorClass})
            check = false
        } else if(this.state.protocolType === 'SPRAY_AND_WAIT' || this.state.protocolType === 'BINARY_SPRAY_AND_WAIT'){
            if(!this.state.sprayAndWaitLParameter){
                this.setState({inputSprayAndWaitLParameterErrorClass: inputErrorClass})
                check = false
            }
        }
        else if(this.state.protocolType === 'EPIDEMIC_P_Q'){
            if(!this.state.epidemicPParameter){
                this.setState({inputEpidemicPParameterErrorClass: inputErrorClass})
                this.setState({errorEpidemicPParameterMessage: 'Set the P-Parameter'})
                check = false
            } else if(this.state.epidemicPParameter > 1){
                this.setState({inputEpidemicPParameterErrorClass: inputErrorClass})
                this.setState({errorEpidemicPParameterMessage: 'P must be a value in interval [0, 1]'})
                check = false
            }
            if(!this.state.epidemicQParameter){
                this.setState({inputEpidemicQParameterErrorClass: inputErrorClass})
                this.setState({errorEpidemicQParameterMessage: 'Set the Q-Parameter'})
                check = false
            } else if(this.state.epidemicQParameter > 1){
                this.setState({inputEpidemicQParameterErrorClass: inputErrorClass})
                this.setState({errorEpidemicQParameterMessage: 'Q must be a value in interval [0, 1]'})
                check = false
            }
        }
        
       
        if(this.state.pairs.length === 0){
            this.setState({inputNumberOfNodesErrorClass: inputErrorClass})
            this.setState({errorNumberOfNodesMessage: 'There are not configured pairs'})
            check = false
        } else{
            for(var i = 0; i < this.state.pairs.length; i++){
                console.log('pair: ', this.state.pairs[i])
                if(!this.state.pairs[i].configured){
                    console.log('not configured')
                    this.setState({inputNumberOfNodesErrorClass: inputErrorClass})
                    this.setState({errorNumberOfNodesMessage: 'There are not configured pairs'})
                    check = false
                    break
                }
            }
        }

        if(!this.state.numberOfNodes){
            this.setState({inputNumberOfNodesErrorClass: inputErrorClass})
            this.setState({errorNumberOfNodesMessage: 'Set the number of nodes'})
            check = false
        } 

        if(!this.state.totalSimulationTime) {
            this.setState({inputSimulationTimeErrorClass: inputErrorClass})
            check = false
        }

        if(!this.state.messageGenarationType) {
            this.setState({inputMessageGenerationTypeErrorClass: inputErrorClass})
            check = false
        } else if(this.state.messageGenarationType === 'FIXED_NODES') {
            if(!this.state.sourceNodeId){
                this.setState({inputSourceNodeIdErrorClass: inputErrorClass})
                this.setState({errorSourceNodeIdMessage: 'Set the source node id'})
                check = false
            } 
            else if(parseInt(this.state.sourceNodeId) >= parseInt(this.state.numberOfNodes)){
                this.setState({inputSourceNodeIdErrorClass: inputErrorClass})
                this.setState({errorSourceNodeIdMessage: 'Node id must be in interval [' + 0 +', ' + (parseInt(this.state.numberOfNodes)-1) + ']'})
                check = false
            }
            
            if(!this.state.destinationNodeId){
                this.setState({inputDestinationNodeIdErrorClass: inputErrorClass})
                this.setState({errorDestinationNodeIdMessage: 'Set the destination node id'})
                check = false
            } else if(parseInt(this.state.destinationNodeId) >= parseInt(this.state.numberOfNodes)){
                this.setState({inputDestinationNodeIdErrorClass: inputErrorClass})
                this.setState({errorDestinationNodeIdMessage: 'Node id must be in interval [' + 0 +', ' + (parseInt(this.state.numberOfNodes)-1) + ']'})
                check = false
            }
        }
    

        if(!this.state.messageGenerationInstant) {
            this.setState({inputMessageGenerationInstantErrorClass: inputErrorClass})
            check = false
        }

        this.setState({alreadyChecked: true})

        return check
    }

    resetView = () => {
        this.setState({inputNumberOfRoundsErrorClass: ''})
        
        this.setState({inputProtocolTypeErrorClass: ''})
        this.setState({errorProtocolTypeMessage: ''})
        this.setState({inputSprayAndWaitLParameterErrorClass: ''})
        this.setState({errorSprayAndWaitLParameterMessage: ''})
        this.setState({inputEpidemicPParameterErrorClass: ''})
        this.setState({errorEpidemicPParameterMessage: ''})
        this.setState({inputEpidemicQParameterErrorClass: ''})
        this.setState({errorEpidemicQParameterMessage: ''})

        this.setState({inputNumberOfNodesErrorClass: ''})
        this.setState({inputSimulationTimeErrorClass: ''})
        this.setState({errorSimulationTimeMessage: ''})

        this.setState({inputMessageGenerationTypeErrorClass: ''})
        this.setState({inputMessageGenerationInstantErrorClass: ''})
        this.setState({inputSourceNodeIdErrorClass: ''})
        this.setState({inputDestinationNodeIdErrorClass: ''})

    }

    callSimulation = () => {
        this.resetView()
        if(this.checkData()){
            this.simulationService.generateMeetingTrace({
                pairsList: this.state.pairs,
                numberOfNodes: this.state.numberOfNodes,
                totalSimulationTime: this.state.totalSimulationTime
            }).then(response => {
                this.setState({displayMeetingTrace: true})
                const meetingTrace= this.simulationService.parseMeetingTrace(response.data.meetingTrace)
                this.setState({meetingTrace})
                const messagesResponse = this.simulationService.parseMessages(response.data.messages)
                this.setState({messagesResponse})
            })
            .catch(error => {
               console.log(error)
               errorPopUp(error.response)
            }
            )
        }
    }

    cancelDefineParameters = () => {
        this.setState({numberOfNodes: ''})
        // this.setState({totalSimulationTime: ''})
        this.setState({pairs: []})
        this.setState({showPairs: false})
        this.setState({displayMeetingTrace: false})
        this.setState({displayCancelConfimation: false})
        // window.location.reload()
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

        const minNodeIndexes = SimulationService.minNodeIndexes(this.state.numberOfNodes)
        // const maxNode1Indexes = SimulationService.maxNodeIndexes(this.state.numberOfNodes, parseInt(this.state.minNode1Index))
        // const maxNode2Indexes = SimulationService.maxNodeIndexes(this.state.numberOfNodes, parseInt(this.state.minNode2Index))
        const maxNode1Indexes = SimulationService.minNodeIndexes(this.state.numberOfNodes)
        const maxNode2Indexes = SimulationService.minNodeIndexes(this.state.numberOfNodes)

        const messageGenarationTypes = [{label: '', value: ''},
                                        {label: 'FIXED_NODES', value: 'FIXED_NODES'},
                                        {label: 'RANDOM_NODES', value: 'RANDOM_NODES'}, 
                                        {label: 'ALL_PAIRS', value: 'ALL_PAIRS'}]

        const protocolTypes = [ {label: '', value: ''},
                                {label: 'EPIDEMIC', value: 'EPIDEMIC'},
                                {label: 'SINGLE_COPY_EPIDEMIC', value: 'SINGLE_COPY_EPIDEMIC'}, 
                                {label: 'EPIDEMIC_P_Q', value: 'EPIDEMIC_P_Q'}, 
                                {label: 'SPRAY_AND_WAIT', value: 'SPRAY_AND_WAIT'}, 
                                {label: 'BINARY_SPRAY_AND_WAIT', value: 'BINARY_SPRAY_AND_WAIT'}, 
                                {label: 'DIRECT_DELIVERY', value: 'DIRECT_DELIVERY'}] 

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

        const renderSprayAndWait = () => {
            if(this.state.protocolType === 'SPRAY_AND_WAIT' || this.state.protocolType === 'BINARY_SPRAY_AND_WAIT')
                return (
                    <div className = "col-md-4">
                            <FormGroup label = "L-Parameter" htmlFor = "sprayAndWaitLParameter">
                                <input type="number"
                                        className={"form-control " + this.state.inputSprayAndWaitLParameterErrorClass}
                                        value = {this.state.sprayAndWaitLParameter}
                                        name="sprayAndWaitLParameter"
                                        onChange={this.handleChange}
                                        id="sprayAndWaitLParameter"
                                        placeholder="Type Spray_And_Wait L-Parameter"
                                />
                                <div className={invalidFeedback}>Set the Spray_And_Wait L-Parameter</div>
                            </FormGroup> 
                        </div>
                )
        }

        const renderEpidemicPQ = () => {
            if(this.state.protocolType === 'EPIDEMIC_P_Q' )
                return (   
                        <>
                            <div className = "col-md-4">
                        <FormGroup label = "P-Parameter (0-1)" htmlFor = "epidemicPParameter">
                            <input type="number"
                                    className={"form-control " + this.state.inputEpidemicPParameterErrorClass}
                                    value = {this.state.epidemicPParameter}
                                    name="epidemicPParameter"
                                    onChange={this.handleChange}
                                    id="epidemicPParameter"
                                    placeholder="Type Epidemic P-Parameter"
                            />
                            <div className={invalidFeedback}>{this.state.errorEpidemicPParameterMessage}</div>
                        </FormGroup> 
                    </div>
                    <div className = "col-md-4">
                        <FormGroup label = "Q-Parameter (0-1)" htmlFor = "epidemicQParameter">
                            <input type="number"
                                    className={"form-control " + this.state.inputEpidemicQParameterErrorClass}
                                    value = {this.state.epidemicQParameter}
                                    name="epidemicQParameter"
                                    onChange={this.handleChange}
                                    id="epidemicQParameter"
                                    placeholder="Type Epidemic Q-Parameter"
                            />
                            <div className={invalidFeedback}>{this.state.errorEpidemicQParameterMessage}</div>
                        </FormGroup> 
                    </div>
                    </>
                )
        }

        const renderFixedNodesMessageGeneration = () => {
            if(this.state.messageGenarationType === 'FIXED_NODES')
                return (
                    <>
                    <div className = "col-md-3">
                        <FormGroup label = "Source Node ID " htmlFor = "InputSourceNode">
                            <input type="number"
                                    className={"form-control " + this.state.inputSourceNodeIdErrorClass}
                                    value = {this.state.sourceNodeId}
                                    name="sourceNodeId"
                                    onChange={this.handleChange}
                                    id="InputSourceNode"
                                    placeholder="Type the source node id"
                            />
                            <div className={invalidFeedback}>{this.state.errorSourceNodeIdMessage}</div>
                        </FormGroup> 
                    </div>

                    <div className = "col-md-3">
                    <FormGroup label = "Destination Node ID " htmlFor = "InputDestinationNode">
                        <input type="number"
                                className={"form-control " + this.state.inputDestinationNodeIdErrorClass}
                                value = {this.state.destinationNodeId}
                                name="destinationNodeId"
                                onChange={this.handleChange}
                                id="InputDestinationNode"
                                placeholder="Type the destination node id"
                        />
                        <div className={invalidFeedback}>{this.state.errorDestinationNodeIdMessage}</div>
                    </FormGroup> 
                    </div>
                    </>
                )
        }

        return(
            <div className="bs-docs-section" >
                
            <Card title = "Simulation">
                <div className = "col-md-12">
                <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Number of rounds " htmlFor = "InputRounds">
                            <input type="number"
                                    className={"form-control " + this.state.inputNumberOfRoundsErrorClass}
                                    value = {this.state.numberOfRounds}
                                    name="numberOfRounds"
                                    onChange={this.handleChange}
                                    id="InputRounds"
                                    placeholder="Type the number of rounds"
                            />
                            <div className={invalidFeedback}>Set the number of rounds</div>
                        </FormGroup> 
                    </div>
                </div>    
                
                <br />
                
                <h4>Protocol</h4>
                <div className="row">
                    <div className = "col-md-4">
                    <FormGroup label = "Type" htmlFor = "protocolType">
                        <SelectMenu className={"form-control " + this.state.inputProtocolTypeErrorClass}
                                    name="protocolType"
                                    list= {protocolTypes} 
                                    onChange={this.handleSelectProtocolTypeChange}
                        />
                    </FormGroup>
                    </div>
                    
                    {renderSprayAndWait()}
                   
                    {renderEpidemicPQ()}
                    
                </div>

                <br />

                <h4 >Meeting Trace</h4>                
                <div className="row">
                <div className = "col-md-5">
                    <FormGroup label = "Number of nodes " htmlFor = "InputNodes">
                        <input type="number"
                                className={"form-control " + this.state.inputNumberOfNodesErrorClass}
                                value = {this.state.numberOfNodes}
                                name="numberOfNodes"
                                onChange={this.handleChange}
                                id="InputNodes"
                                placeholder="Type the number of nodes"
                                disabled={this.state.showPairs} 
                        />
                        <div className={invalidFeedback}>{this.state.errorNumberOfNodesMessage}</div>
                    </FormGroup> 
                </div>
                </div>
                    
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
                                        onChange={this.handleSelectNodeChange}
                            />
                        </FormGroup>
                    </div>
                    <div className = "col-md-3">
                    <FormGroup label = "max_index " htmlFor = "maxNode1Index">
                            <SelectMenu className={"form-control " }
                                        name="maxNode1Index"
                                        list= {maxNode1Indexes} 
                                        onChange={this.handleSelectNodeChange}
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
                                        onChange={this.handleSelectNodeChange}
                            />
                        </FormGroup>
                    </div>
                    <div className = "col-md-3">
                    <FormGroup label = "max_index " htmlFor = "maxNode2Index">
                            <SelectMenu className={"form-control " }
                                        name="maxNode2Index"
                                        list= {maxNode2Indexes} 
                                        onChange={this.handleSelectNodeChange}
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
                        <FormGroup label = "Total simulation time (s) " htmlFor = "InputTime">
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
                    </div>

                    <br />

                <h4>Message Generation</h4>
                <div className="row">
                    <div className = "col-md-3">
                    <FormGroup label = "Type" htmlFor = "messageGenarationType">
                        <SelectMenu className={"form-control " + this.state.inputMessageGenerationTypeErrorClass}
                                    name="messageGenarationType"
                                    list= {messageGenarationTypes} 
                                    onChange={this.handleSelectChange}
                        />
                    </FormGroup>
                    </div>

                    {renderFixedNodesMessageGeneration()}

                    <div className = "col-md-3">
                        <FormGroup label = "Generation instant (s)" htmlFor = "messageGenerationInstant">
                            <input type="number"
                                    className={"form-control " + this.state.inputMessageGenerationInstantErrorClass}
                                    value = {this.state.messageGenerationInstant}
                                    name="messageGenerationInstant"
                                    onChange={this.handleChange}
                                    id="messageGenerationInstant"
                                    placeholder="Type the generation instant"
                            />
                            <div className={invalidFeedback}>Set the generation instant</div>
                        </FormGroup> 
                    </div>
                </div>

                    <br />
                    <Button 
                        label="Start Simulation"
                        icon="pi pi-desktop"
                        onClick={this.callSimulation}
                        style={ {maxHeight: '35px'} }
                        // disabled={this.state.numberOfNodes === null}
                    />
                    {
                        this.state.displayMeetingTrace ? (
                            <div>
                                <br />
                                <div className="row">
                                <div className = "col-md-6">
                                    <FormGroup label = "Meeting Trace " htmlFor = "outputMeetingTrace">
                                        <textarea   className={"form-control " }
                                                    id="outputMeetingTrace"
                                                    name="meetingTrace"
                                                    value={this.state.meetingTrace}
                                                    style={{marginTop: '0px', marginBottom: '0px', minHeight: '180px'}} />
                                    </FormGroup>
                                </div>
                                <div className = "col-md-6">
                                    <FormGroup label = "Messages Response " htmlFor = "outputMessagesResponse">
                                        <textarea   className={"form-control " }
                                                    id="outputMessagesResponse"
                                                    name="messagesResponse"
                                                    value={this.state.messagesResponse}
                                                    style={{marginTop: '0px', marginBottom: '0px', minHeight: '180px'}} />
                                    </FormGroup>
                                </div>
                                </div>
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
                        <div style={{marginBottom: '10px'}}> Cancel meeting trace configuration? </div>
                    </div>
            </Dialog>
            <div className="d-flex "/>
            </div>        
        )
    }
}

export default withRouter(Simulation)