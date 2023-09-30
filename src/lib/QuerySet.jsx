import { useState, useEffect } from 'react'
import Action from './Action'
import {Field} from './Form'
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

function SearchField(props){
    return (
        <div>
            <label>Palavra-chave</label>
            <br/>
            <input type="text" name="q" className="form-control"/>
        </div>
    )
}
function FilterButton(props){
    return (
        <div>
            <input className="btn" type="button" value="filter" onClick={props.onfilter}/>
        </div>
    )
}

function FilterForm(props){
    return (
        <form className="filterForm">
            <SearchField/>
            {props.data.filters.map((filter) => (
              <div className="filterField" key={Math.random()}>
                <label>{filter.name}</label>
                <br/>
                <Field data={filter}/>
            </div>
            ))}
            <FilterButton onfilter={props.onfilter}/>
        </form>
    )
}

function FilterField(props){
     return (
        <div className="filterField">Filter Field</div>
    )
}

function Pagination(props){
    return (
        <div className="pagination right">
            {props.data.previous && <button onClick={function(){props.reloader(props.data.previous)}}>Anterior</button>}
            {props.data.next && <button onClick={function(){props.reloader(props.data.next)}}>Próximo</button>}
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
                              <th key={Math.random()}>{k}</th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.results.map((item) => (
                          <tr key={Math.random()}>
                            {Object.keys(props.data.results[0]).map((k) => (
                              <td key={Math.random()}>{JSON.stringify(item[k])}</td>
                            ))}
                            <td><InstanceActions data={props.data} id={item.id} reloader={props.reloader}/></td>
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
    const [data, setdata] = useState(props.data);
    const [search, setsearch] = useState(props.data);

    useEffect(()=>{

    }, [])

    function reload(url){
        request('GET', url || props.data.url, function(data){
            setdata(data);
        });
    }

    function filter(){
        var params = $(event.target).closest('form').serialize();
        reload(props.data.url+'?'+params);
    }

    //<div>{JSON.stringify(data)}</div>
    return (
        <div className="queryset">
            <h1>{props.data.model} ({data.count})</h1>
            <GlobalActions data={data} reloader={reload}/>
            <ClearFix/>
            <FilterForm data={data} onfilter={filter}/>
            <Pagination data={data} reloader={reload}/>
            <DataTable data={data} reloader={reload}/>
            <BatchActions data={data}/>
            <Pagination data={data} reloader={reload}/>
        </div>
    )
}

export default QuerySet
