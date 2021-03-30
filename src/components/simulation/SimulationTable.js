import React from 'react'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

class SimulationTable extends React.Component{

    state = {
        selectedNodes: null
    }

    handleSelectionChange = (e) => {
        this.setState({selectedProducts: e.value})
    }

    pairToString = (pair) => {
        return '(' + pair.node1 + ', ' + pair.node2 + ')'
    }

    variabilityRate = (pair) => {
        return pair.variabilityRate ? 'Yes' : 'No'
    }

    render(){
        return(
            <DataTable value={this.props.list}
                            className="p-datatable-sm"
                            rowHover
                            selection={this.state.selectedNodes}
                            onSelectionChange={this.handleSelectionChange}
                            scrollable
                            scrollHeight="500px"
                            loading={this.props.loading}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    >

                    <Column selectionMode="multiple" headerStyle={{ width: '4px' }}></Column>
                    <Column header="Pair" style ={ {width: '10px'} } body={this.pairToString} ></Column>
                    <Column field="rate" header="Rate" sortable style ={ {width: '10px'} }></Column>
                    <Column field="variabilityRate" header="Variability Rate" body={this.variabilityRate} sortable style ={ {width: '10px'} }></Column>
                    <Column field="variabilityDegree" header="Variability Degree" sortable style ={ {width: '10px'} }></Column>
                </DataTable>
        )
    }
}

export default SimulationTable