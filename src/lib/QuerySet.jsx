import {useEffect} from 'react';
import Action from './Action'
import {ClearFix, Empty, Loading} from './Utils'


function GlobalActions(props){
    return (
        <div className="globalActions right">
            {props.data.actions.map((action) => action.target == "queryset" && (
              <Action href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader}>
                {action.name}
              </Action>
            ))}
        </div>
    )
}

function InstanceActions(props){
    return (
        <div className="globalActions right">
            {props.data.actions.map((action) => action.target == "instance" && (
              <Action href={action.url.replace('{id}', props.id)} key={Math.random()} modal={action.modal} reloader={props.reloader}>
                {action.name}
              </Action>
            ))}
        </div>
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
        <div className="pagination">
            {props.data.next && <button onClick={function(){alert(props.data.next)}}>Próximo</button>}
        </div>
    )
}

function DataTable(props){

    function render(){
        if(props.data.count){
            return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {Object.keys(props.data.results[0]).map((k) => (
                              <th>{k}</th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.results.map((item) => (
                          <tr>
                            {Object.keys(props.data.results[0]).map((k) => (
                              <td>{JSON.stringify(item[k])}</td>
                            ))}
                            <td><InstanceActions data={props.data} id={item.id}/></td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )
        } else {
            return <Empty/>
        }
    }

    return (
        <div>
            {render()}
        </div>
    )
}


function BatchActions(props){
    return (
        <div className="batchActions left">
            {props.data.actions.map((action) => action.target == "instances" && (
              <Action href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader}>
                {action.name}
              </Action>
            ))}
        </div>
    )
}

function QuerySet(props){
    return (
        <div>
            <div>{JSON.stringify(props.data)}</div>
            <h1>{props.data.model} ({props.data.count})</h1>
            <GlobalActions data={props.data} reloader={props.reloader}/>
            <ClearFix/>
            <FilterForm/>
            <Pagination data={props.data}/>
            <DataTable data={props.data}/>
            <BatchActions data={props.data}/>
            <Pagination data={props.data}/>
        </div>
    )
}

export default QuerySet
