import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import SelectMenu from '../components/selectMenu'


import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import SimulationTable from '../components/simulation/simulationTable'
import SimulationService from '../app/service/simulationService'

class Simulation extends React.Component{

    state = {
        numberOfNodes: null,
        totalSimulationTime: null,
        timeUnitty: 's',
        pairs: [],
        showPairs: false,
        displayCancelConfimation: false,
        minNode1Index: null,
        maxNode1Index: null,
        minNode2Index: null,
        maxNode2Index: null,
        
    }

    handleChange = event => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    handleSelectChange = event => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value === '' ? null : value })
    }

    defineParameters = async () => {
        var pairs = []
        var id=0
        for(var i = 1; i <= this.state.numberOfNodes; i++){
            for(var j = i+1; j <=  this.state.numberOfNodes; j++){
                    pairs.push({
                        id: id++,
                        node1: i,
                        node2: j,
                        rate: null,
                        variableRate: null,
                        variabilityDegree: null
                    })
            }
        }
        this.setState({pairs})
        this.setState({showPairs: true})
    }

    configurePairs = (parametrs, selectedPairs) => {
        var pairArray = this.state.pairs
        selectedPairs.forEach(modifiedPair => {
            const p = pairArray.find(pair => pair.id === modifiedPair.id)
            console.log('id: ', p.id)
        })

    }

    cancelDefineParameters = () => {
        this.setState({pairs: []})
        this.setState({showPairs: false})
        this.setState({displayCancelConfimation: false})
    }

    filterPairs = () => {
        var filteredPairs = []
        // console.log('indexes: ', this.state.minNode1Index, this.state.maxNode1Index, this.state.minNode2Index, this.state.maxNode2Index)
        this.state.pairs.forEach(pair => {
            var minNode1 = this.state.minNode1Index === null ? true : pair.node1 >= this.state.minNode1Index
            var maxNode1 = this.state.maxNode1Index === null ? true : pair.node1 <= this.state.maxNode1Index
            var minNode2 = this.state.minNode2Index === null ? true : pair.node2 >= this.state.minNode2Index
            var maxNode2 = this.state.maxNode2Index === null ? true : pair.node2 <= this.state.maxNode2Index
            // console.log('\n')
            // console.log('minNode1: ', minNode1)
            // console.log('maxNode1: ', maxNode1)
            // console.log('minNode2: ', minNode2)
            // console.log('maxNode2: ', maxNode2)
            // console.log('\n')
            if(minNode1 && maxNode1 && minNode2 && maxNode2){
                filteredPairs.push(pair)
            }
        })
        return filteredPairs
    }

    render() {

        const timeUnityList = [
            {label:'s', value: 's'},
	        {label:'ms', value: 'ms'}
        ]

        const minNodeIndexes = SimulationService.minNode1Indexes(this.state.numberOfNodes)
        const maxNode1Indexes = SimulationService.maxNode1Indexes(this.state.numberOfNodes, this.state.minNode1Index)
        const maxNode2Indexes = SimulationService.maxNode1Indexes(this.state.numberOfNodes, this.state.minNode2Index)

        const renderCancelConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Confirmar" icon="pi pi-check"
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
                    <div className = "col-md-5">
                    <h5> Node 1 Interval </h5>
                    </div>
                    <div className = "col-md-5">
                    <h5> Node 2 Interval </h5>
                    </div>
                    </div>
                    <div className="row">
                    <div className = "col-md-5">
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
                    <div className = "col-md-5">
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
                            <SimulationTable list = {this.filterPairs()}
                                configurePairs = {this.configurePairs}
                            />
                        ) : (<div />)
                    }
                    <br />
                    <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Total simulation time " htmlFor = "InputTime">
                            <input type="number"
                                    className={"form-control " + this.state.inputEmailErrorClass}
                                    value = {this.state.totalSimulationTime}
                                    name="totalSimulationTime"
                                    onChange={this.handleChange}
                                    id="InputTime"
                                    placeholder="Type the total simulation time" 
                            />
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
                </div>
            </Card>
            <Dialog header="Deletar Configuração"
                        visible={this.state.displayCancelConfimation}
                        modal = {true} //congela restante da tela
                        style={{ width: '350px' }}
                        footer={renderCancelConfirmationFooter()}
                        onHide={() => this.setState({displayConfirmation: false})}>
                    <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                        <div style={{marginBottom: '10px'}}> Deseja cancelar configuração? </div>
                    </div>
            </Dialog>
            <div className="d-flex "/>
            </div>        
        )
    }
}

export default withRouter(Simulation)