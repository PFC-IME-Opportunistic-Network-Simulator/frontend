import React from 'react'

import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import ConfigurePairDialog from './configurePairDialog'

class SimulationTable extends React.Component{

    state = {
        selectedPairs: [],
        displayConfigurePairsDialog: false
    }

    handleSelectionChange = (e) => {
        this.setState({selectedPairs: e.value})
    }

    pairToString = (pair) => {
        return '(' + pair.node1 + ', ' + pair.node2 + ')'
    }

    variableRate = (pair) => {
        return pair.variableRate === null ? null : (pair.variableRate === true ? 'Yes' : 'No')
    }

    hideDialog = () => {
        this.setState({displayConfigurePairsDialog: false})
    }

    configurePairs = (parameters) => {
        this.setState({displayConfigurePairsDialog: false})
        this.props.configurePairs(parameters, this.state.selectedPairs)
        this.setState({selectedPairs: []})
    }

    desconfigurePairs = () => {
        this.props.undoPairsConfiguration(this.state.selectedPairs)
        this.setState({selectedPairs: []})
    }

    render(){

        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                        <Button label="Configure" icon="pi pi-cog" className="p-button-success"
                                style ={{marginLeft: '10px'}}
                                onClick={() => this.setState({displayConfigurePairsDialog: true})}
                                disabled={this.state.selectedPairs.length === 0}
                                />
                </React.Fragment>
            )
        }

        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                        <Button label="Undo" icon="pi pi-undo" className="p-button-danger"
                                style ={{marginLeft: '10px'}}
                                onClick={this.desconfigurePairs}
                                disabled={this.state.selectedPairs.length === 0}
                                />
                </React.Fragment>
            )
        }

        return(
            <>
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                <DataTable value={this.props.list}
                                className="p-datatable-sm"
                                rowHover
                                selection={this.state.selectedPairs}
                                onSelectionChange={this.handleSelectionChange}
                                scrollable
                                scrollHeight="500px"
                                loading={this.props.loading}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} nodes"
                        >

                        <Column selectionMode="multiple" headerStyle={{ width: '4px' }}></Column>
                        <Column header="Pair" style ={ {width: '10px'} } body={this.pairToString} ></Column>
                        <Column field="rate" header="Rate" sortable style ={ {width: '10px'} }></Column>
                        <Column field="variableRate" header="Variable Rate" body={this.variableRate} sortable style ={ {width: '10px'} }></Column>
                        <Column field="variabilityDegree" header="Variability Degree" sortable style ={ {width: '10px'} }></Column>
                    </DataTable>
                </div>
                <ConfigurePairDialog
                            // save={this.updateProduct}
                            hideDialog={this.hideDialog}
                            visible={this.state.displayConfigurePairsDialog}
                            header="Configure Selected Pairs"
                            save={this.configurePairs}
                             />
                </>
        )
    }
}

export default SimulationTable