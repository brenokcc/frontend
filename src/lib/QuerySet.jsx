import {useEffect} from 'react';

function GlobalActions(props){
    return (
        <div className="globalActions">Global Actions</div>
    )
}

function FilterForm(props){
    var fields = [1, 2, 3];
    return (
        <div className="filterForm">
            {fields.map((choice) => (
              <FilterField key={Math.random()}/>
            ))}
        </div>
    )
}

function FilterField(props){
     return (
        <div className="filterField">Filter Field</div>
    )
}

function Pagination(props){
    return (
        <div className="pagination">Pagination</div>
    )
}

function DataTable(props){
    var rows = [1, 2, 3];
    return (
        <div>
            <DataTableHeader/>
            {rows.map((choice) => (
              <DataTableRow key={Math.random()}/>
            ))}
        </div>
    )
}

function DataTableHeader(props){
    return (
        <div className="dataTableHeader">Data Table Header</div>
    )
}

function DataTableRow(props){
    return (
        <div className="dataTableHeader">Data Table Row</div>
    )
}

function BatchActions(props){
    return (
        <div className="batchActions">Batch Actions</div>
    )
}

function QuerySet(props){
    return (
        <div>
            <div>{JSON.stringify(props.data)}</div>
            <h1>{props.data.model}</h1>
            <GlobalActions/>
            <FilterForm/>
            <Pagination/>
            <DataTable/>
            <BatchActions/>
            <Pagination/>
        </div>
    )
}

export default QuerySet
