import React from 'react'

import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

class SimulationTable extends React.Component{

    state = {
        selectedPairs: null
    }

    handleSelectionChange = (e) => {
        this.setState({selectedPairs: e.value})
    }

    pairToString = (pair) => {
        return '(' + pair.node1 + ', ' + pair.node2 + ')'
    }

    variabilityRate = (pair) => {
        return pair.variabilityRate === null ? null : (pair.variabilityRate === true ? 'Yes' : 'No')
    }

    render(){
        return(
            <div className="card">
                <Toolbar className="p-mb-4" ></Toolbar>
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        >

                        <Column selectionMode="multiple" headerStyle={{ width: '4px' }}></Column>
                        <Column header="Pair" style ={ {width: '10px'} } body={this.pairToString} ></Column>
                        <Column field="rate" header="Rate" sortable style ={ {width: '10px'} }></Column>
                        <Column field="variabilityRate" header="Variability Rate" body={this.variabilityRate} sortable style ={ {width: '10px'} }></Column>
                        <Column field="variabilityDegree" header="Variability Degree" sortable style ={ {width: '10px'} }></Column>
                    </DataTable>
                </div>
        )
    }
}

export default SimulationTable