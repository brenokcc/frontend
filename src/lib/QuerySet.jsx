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
            <SearchField state={props.state}/>
            {props.data.filters.map((filter) => (
              <div className="filterField" key={Math.random()}>
                <label>{filter.name}</label>
                <br/>
                <Field data={filter} url={props.data.url}/>
            </div>
            ))}
            <FilterButton onfilter={props.onfilter}/>
        </form>
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

function Subsets(props){
    var subsets = [];
    var style = "subset";
    var active = 'all';
    Object.keys(props.data.subsets).map((k) => {
        if(props.data.subset==k) active = k;
    })
    if(active=='all') style = "subset active"
    subsets.push({k:'all', v:props.data.count, style:style});
    {Object.keys(props.data.subsets).map((k) => {
        style = "subset";
        if(k==active) style = "subset active"
        subsets.push({k:k, v:props.data.subsets[k], style:style});
    })}
    return (
        <div className="subsets">
            {subsets.map((subset) => (
              <div className={subset.style} key={Math.random()} onClick={function(){props.onChange(subset.k)}}>
                {subset.k} ({subset.v})
              </div>
            ))}
        </div>
    )
}

function QuerySet(props){
    const [data, setdata] = useState(props.data);
    const [search, setsearch] = useState(props.data);
    var state = {}

    useEffect(()=>{

    }, [])

    function reload(url){
        request('GET', url || props.data.url, function(data){
            setdata(data);
        });
    }

    function filter(subset){
        state = {}
        var params = $(event.target).closest('form').serialize();
        var usp = new URLSearchParams(params);
        if(subset) usp.set('subset', subset)
        for(const [key, value] of usp.entries()) {
            console.log(key+' : '+value);
            state[key] = value;
        }
        reload(props.data.url+'?'+usp);
    }

    function subset(name){
        props.data.subset = name;
        filter(name);
    }

    //<div>{JSON.stringify(data)}</div>
    return (
        <div className="queryset">
            <h1>{data.model} ({data.count})</h1>
            <GlobalActions data={data} reloader={reload}/>
            <ClearFix/>
            <Subsets data={props.data} state={state} onChange={subset}/>
            <FilterForm data={data} onfilter={filter}/>
            <Pagination data={data} reloader={reload}/>
            <ClearFix/>
            <DataTable data={data} reloader={reload}/>
            <BatchActions data={data}/>
            <Pagination data={data} reloader={reload}/>
            <ClearFix/>
        </div>
    )
}

export default QuerySet
