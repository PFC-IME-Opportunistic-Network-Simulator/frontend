import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import SelectMenu from '../components/selectMenu'


import { Button } from 'primereact/button'
import SimulationTable from '../components/simulation/SimulationTable'

class Simulation extends React.Component{

    state = {
        numberOfNodes: null,
        totalSimulationTime: null,
        timeUnitty: 's',
        pairs: [],
        showPairs: false
    }

    handleChange = event => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
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
                        rate: 0,
                        variabilityRate: false,
                        variabilityDegree: null
                    })
            }
        }
        this.setState({pairs})
        this.setState({showPairs: true})
    }

    render() {

        const timeUnityList = [
            {label:'s', value: 's'},
	        {label:'ms', value: 'ms'}
        ]

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
                            />
                        </FormGroup> 
                    </div>
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
                                        // value={this.state.parametrized}
                                        onChange={this.handleChange}
                                        />
                        </FormGroup>

                    </div>
                    </div>
                    <Button 
                        label="Define Node Parameters"
                        icon="pi pi-pencil"
                        onClick={this.defineParameters}
                        style={ {maxHeight: '35px'} }
                        disabled={this.state.numberOfNodes === null || this.state.totalSimulationTime === null}
                    />
                </div>
            <br />
            {
                this.state.showPairs ? (
                    <SimulationTable list = {this.state.pairs}/>
                ) : (<div />)
            }
            </Card>
            <div className="d-flex "/>
            </div>        
        )
    }
}

export default withRouter(Simulation)