import { useState, useEffect } from 'react'
import Action from './Action'
import {Field} from './Form'
import {TitleCase, Value, ClearFix, Empty, Loading, Icon, Accordion} from './Utils'


function GlobalActions(props){
    return (
        <div className="globalActions right">
            {props.data.actions.map((action) => action.target == "queryset" && (
              <Action icon={action.icon} href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader}>
                <TitleCase text={action.name}/>
              </Action>
            ))}
        </div>
    )
}

function InstanceActions(props){
    return (
        <div className="instanceActions right">
            {props.data.actions.map((action) => action.target == "instance" && (
              <Action icon={action.icon} href={action.url.replace('{id}', props.id)} key={Math.random()} modal={action.modal} reloader={props.reloader}>
                <TitleCase text={action.name}/>
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
            <button className="btn" type="button" onClick={props.onfilter}>
                <Icon icon="filter"/>
                filter
            </button>
        </div>
    )
}

function FilterForm(props){
    return (
        <Accordion title="Filtros">
            <form className="filterForm">
                <SearchField state={props.state}/>
                {props.data.filters.map((filter) => (
                  <div className="filterField" key={Math.random()}>
                    <label><TitleCase text={filter.name}/></label>
                    <br/>
                    <Field data={filter} url={props.url}/>
                </div>
                ))}
                <FilterButton onfilter={props.onfilter}/>
            </form>
        </Accordion>
    )
}

function Pagination(props){
    const [page, setpage] = useState(1);

    function updatePage(url){
        var tokens = url.split('?');
        if(tokens.length>1){
            var usp = new URLSearchParams(tokens[1]);
            setpage(usp.get('page') || 1);
        } else {
            setpage(1);
        }
    }
    var start = ((page-1) * 10) + 1;
    var end = start + 10 - 1;
    if(props.data.count > 10){
        return (
            <div className="pagination">
                <div className="left">
                    Exibir <select><option>10</option></select> | {start}-{end} de {props.total} itens
                </div>
                <div className="right">
                    Página {page}
                    {props.data.previous && <Icon icon="chevron-left" onClick={function(){props.reloader(props.data.previous);updatePage(props.data.previous);}}/>}
                    {props.data.next && <Icon icon="chevron-right" onClick={function(){props.reloader(props.data.next);updatePage(props.data.next);}}/>}
                </div>
            </div>
        )
    }
}

function DataTable(props){

    function render(){
        if(props.data.count){
            return (
            <div className="responsive">
                <table>
                    <thead>
                        <tr>
                            <th className="selection">
                                <input type="checkbox" className="selector all" value={0} onClick={props.onSelect}/>
                            </th>
                            {Object.keys(props.data.results[0]).map((k) => (
                              <th key={Math.random()}><TitleCase text={k}/></th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.results.map((item) => (
                          <tr key={Math.random()}>
                            <td>
                                <input type="checkbox" className="selector all" value={item.id} onClick={props.onSelect}/>
                            </td>
                            {Object.keys(props.data.results[0]).map((k) => (
                              <td key={Math.random()}><Value obj={item[k]}/></td>
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
        <div className="batchActions">
            {props.data.actions.map((action) => action.target == "instances" && (

              <Action icon={action.icon} href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader}>
                <TitleCase text={action.name}/>
              </Action>
            ))}
            <div className="counter right"></div>
        </div>
    )
}

function Subsets(props){
    var subsets = [];
    var style = "subset";
    var active = 'all';
    function render(){
        if(props.data.subsets){
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
                        <TitleCase text={subset.k}/> ({subset.v})
                      </div>
                    ))}
                </div>
            )
        }
    }
}

function QuerySet(props){
    const [data, setdata] = useState(props.data);
    const [search, setsearch] = useState(props.data);
    var state = {}
    var title = props.relation || data.model;
    var key = props.relation;

    useEffect(()=>{
        configure();
    }, [])

    function onSelect(){
        if(event.target.value==0){
            $('.queryset.'+key).find('.selector').prop('checked', event.target.checked);
        }
        configure();
    }

    function configure(){
        var batchActions = $('.queryset.'+key).find('.batchActions');
        batchActions.find('a').each(function(i, a){
            var ids = [];
            var url = a.dataset.url;
            var checkboxes = a.parentNode.parentNode.getElementsByClassName('selector');
            for(var i=0; i<checkboxes.length; i++){
                if(checkboxes[i].checked && checkboxes[i].value!=0) ids.push(checkboxes[i].value);
            }
            if(ids.length>0){
                a.href = a.dataset.url + ids.join(',') +  '/';
                a.style.cursor='pointer';
                batchActions.show();
                if(ids.length===1) batchActions.find('.counter').html('1 registro selecionado');
                else batchActions.find('.counter').html(ids.length+' registros selecionados');
            } else {
                a.href = '#';
                a.style.cursor='not-allowed';
                batchActions.hide();
                batchActions.find('.counter').html('');
            }
        });
    }

    function getContextURL(url){
        var page = 1;
        var url = url || props.data.url;
        if(props.relation){
            if(url.indexOf('?')==-1) url+="?only="+props.relation;
            else url+="&only="+props.relation;
        }
        var tokens = url.split('?');
        return url;
    }

    function reload(url){
        request('GET', getContextURL(url), function(data){
            if(props.relation) setdata(data['result'][props.relation])
            else setdata(data);
        });
    }

    function filter(){
        state = {}
        var params = $(event.target).closest('form').serialize();
        var usp = new URLSearchParams(params);
        if(props.datasubset) usp.set('subset', props.data.subset)
        for(const [key, value] of usp.entries()) {
            state[key] = value;
        }
        reload(props.data.url+'?'+usp);
    }

    function subset(name){
        props.data.subset = name;
        filter();
    }
    //<div>{JSON.stringify(data)}</div>
    return (
        <div className={"queryset "+key}>
            <div>
                <div className="left">
                    <h1><TitleCase text={title}/> ({data.count})</h1>
                </div>
                <div className="right">
                    <GlobalActions data={data} reloader={reload}/>
                </div>
            </div>
            <ClearFix/>
            <Subsets data={props.data} state={state} onChange={subset}/>
            <FilterForm data={data} onfilter={filter} url={getContextURL()}/>
            <Pagination data={data} reloader={reload} total={props.data.count}/>
            <ClearFix/>
            <BatchActions data={data}/>
            <ClearFix/>
            <DataTable data={data} reloader={reload} onSelect={onSelect}/>
            <BatchActions data={data}/>
            <ClearFix/>
            <Pagination data={data} reloader={reload} total={props.data.count}/>
            <ClearFix/>
        </div>
    )
}

export default QuerySet
