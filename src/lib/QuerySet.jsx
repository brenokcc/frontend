import { useState, useEffect } from 'react'
import Action from './Action'
import {Field} from './Form'
import {toLabelCase, toTitleCase, TitleCase, Value, ClearFix, Message, Loading, Icon, Accordion, Subsets} from './Utils'


function GlobalActions(props){
    return (
        <div className="globalActions right">
            {props.data.actions.map((action) => action.target == "queryset" && (
              <Action label={toTitleCase(action.name)} icon={action.icon} href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader} button={true}>
                <TitleCase text={action.name}/>
              </Action>
            ))}
        </div>
    )
}

function InstanceActions(props){

    function get_action(action){
        if(action.ids.indexOf(props.id)>=0){
            return (
                <Action label={toTitleCase(action.name)} icon={action.icon} href={action.url.replace('{id}', props.id)} key={Math.random()} modal={action.modal} reloader={props.reloader} style={action.style}>
                <TitleCase text={action.name}/>
              </Action>
            )
        }
    }

    return (
        <div className="instanceActions right">
            {props.data.actions.map((action) => action.target == "instance" && get_action(action))}
        </div>
    )
}

function SearchField(props){
    const key = Math.random();

    function clear(){
        document.getElementById(key).value = "";
    }

    function render(){
        return (
            <div>
                <label>Palavra-chave</label>
                <br/>
                <input id={key} type="text" name="q" className="form-control" data-label={toLabelCase("Palavras-chave")}/>
                <i className="fa-solid fa-x clearer" onClick={clear}/>
            </div>
        )
    }

    return render();
}

function FilterForm(props){

    function field(filter){
        if(filter.type == "hidden"){
            return <Field key={Math.random()} data={filter} url={props.url} filter={true}/>
        } else {
            return (
              <div key={Math.random()}>
                <label><TitleCase text={filter.label}/></label>
                <br/>
                <Field data={filter} url={props.url} filter={true}/>
              </div>
            )
        }
    }

    function render(){
        if(props.data.search.length>0 || props.data.filters.length>0){
            return(
              <Accordion title="Filtros">
                <form className={"filter "+(window.innerWidth > 600 ? "small" : "big")}>
                    <input type="hidden" name="page_size" value={props.data.page_size}/>
                    {props.data.search.length>0 && <SearchField state={props.state}/>}
                    {props.data.filters.map((filter) => (
                       field(filter)
                    ))}
                    <div className="filter">
                        <button className="btn primary" type="button" onClick={()=>props.onfilter()} data-label={toLabelCase("filter")}>
                            <Icon icon="filter"/>
                            <TitleCase text="Filter"/>
                        </button>
                    </div>
                </form>
              </Accordion>
            )
        }
    }

    return render()
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

    function setPageSize(){
        var size = $(event.target).val();
        var queryset = $(event.target).closest('.queryset');
        queryset.find("input[name=page_size]").val(size);
        props.reloader();
    }

    var page_size = props.data.page_size;
    var page_sizes = props.data.page_sizes;
    var start = ((page-1) * page_size) + 1;
    var end = start + page_size - 1;
    if(props.data.count > 0){
        return (
            <div className="pagination">
                <div className="left">
                    Exibir <select onChange={setPageSize} value={page_size}>
                    {page_sizes.map(function(n){
                      return <option key={Math.random()} value={n}>{n}</option>
                    })}
                    </select> | {start}-{end} de {props.data.count} itens
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
            <div className="responsive data">
                <table className="table">
                    {window.innerWidth > 600 &&
                    <thead>
                        <tr>
                            { props.selectable &&
                            <th className="selection">
                                <input type="checkbox" className="selector all" value={0} onClick={props.onSelect}/>
                            </th>
                            }
                            {Object.keys(props.data.results[0]).map(function(k){
                              if(k!='id') return <th key={Math.random()}><TitleCase text={k}/></th>
                            })}
                            <th></th>
                        </tr>
                    </thead>
                    }
                    <tbody>
                        {props.data.results.map((item) => (
                          <tr key={Math.random()}>
                            {props.selectable &&
                            <td>
                                <input type="checkbox" className="selector all" value={item.id} onClick={props.onSelect}/>
                            </td>
                            }
                            {window.innerWidth > 600 && Object.keys(props.data.results[0]).map(function(k){
                              if(k!='id') return <td key={Math.random()}><Value obj={item[k]}/></td>
                            })}
                            {window.innerWidth <= 600 &&
                                <td>
                                    {Object.keys(props.data.results[0]).map(function(k){
                                      if(k!='id') return <div key={Math.random()}>
                                        <strong><TitleCase text={k}/>:</strong>&nbsp;&nbsp;&nbsp;
                                        <Value obj={item[k]}/>
                                      </div>
                                    })}
                                </td>
                            }
                            <td style={{textAlign: "right"}}><InstanceActions data={props.data} id={item.id} reloader={props.reloader}/></td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )
        } else {
            return <Message text="Nenhum registro encontrado."/>
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

              <Action label={toTitleCase(action.name)} icon={action.icon} href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader} button={true}>
                <TitleCase text={action.name}/>
              </Action>
            ))}
            <div className="counter right"></div>
        </div>
    )
}

function Aggreations(props){
    function render(){
        return (
            <div className="aggregations">
                {Object.keys(props.data).map(function(k){
                  return (
                    <div className="aggregation" key={Math.random()}>
                        <span className="name"><TitleCase text={k}/>: </span>
                        <span className="value"><Value obj={props.data[k]}/></span>
                    </div>
                  )
                })}
            </div>
        )
    }
    return render()
}

function QuerySet(props){
    const [data, setdata] = useState(props.data);
    const [search, setsearch] = useState(props.data);
    var state = {}
    var title = props.relation || data.title;
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

    function hasBatchActions(){
        for(var i=0; i<props.data.actions.length; i++){
            if(props.data.actions[i].target=="instances") return true;
        }
        return false
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
        if(props.relation){
            if(url.indexOf('?')==-1) url+="?only="+props.relation;
            else url+="&only="+props.relation;
        }
        if(props.data.subset){
            if(url.indexOf('?')==-1) url+="?subset="+props.data.subset;
            else url+="&subset="+props.data.subset;
        }
        var tokens = url.split('?');
        return url;
    }

    function reload(url){
        state = {}
        var params = $('.queryset.'+key).find('form').serialize();
        var usp = new URLSearchParams(params);
        if(props.datasubset) usp.set('subset', props.data.subset)
        for(const [key, value] of usp.entries()) {
            state[key] = value;
        }
        if(url==null){
            var sep = props.data.url.indexOf('?') < 0 ? '?' : '&';
            url = props.data.url+sep+usp;
        }
        request('GET', getContextURL(url), function(data){
            if(props.relation) setdata(data['result'][props.relation])
            else setdata(data);
        });
    }

    function subset(name){
        props.data.subset = name;
        reload();
    }

    function calendarFilter(day, month, year){
        var queryset = $(event.target).closest('.queryset');
        queryset.find("input[name="+props.data.calendar.field+"__day]").val(day||"");
        queryset.find("input[name="+props.data.calendar.field+"__month]").val(month||"");
        queryset.find("input[name="+props.data.calendar.field+"__year]").val(year||"");
        reload();
    }

    function calendar(){
        if(data.calendar){
            var days = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
            var months = ['JANEIRO', 'FEVEVEIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO']
            var rows = [[], [], [], [], [], []];
            var month = data.calendar.month-1;
            var start = new Date(data.calendar.year, data.calendar.month-1, 1)
            while(start.getDay()>1) start.setDate(start.getDate() - 1);
            var i = 0;
            while(start.getMonth()<=month || rows[i].length<7){
                if(rows[i].length==7) i+=1;
                if(i==5) break;
                rows[i].push({
                date: start.getDate(), total: data.calendar.total[start.toLocaleDateString('pt-BR')]
                })
                start.setDate(start.getDate() + 1);
            }
            return (
                <div className="calendar">
                    <h3 align="center">{months[data.calendar.month-1]} {data.calendar.year}</h3>
                    {data.calendar.day &&
                        <div align="center" className="day">
                            {new Date(data.calendar.year, data.calendar.month-1, data.calendar.day).toLocaleDateString('pt-BR')}
                            <Icon icon="x" onClick={()=>calendarFilter(null, data.calendar.month, data.calendar.year)}/>
                        </div>
                    }
                    <div>
                        <div className="left">
                            <Icon icon='arrow-left' onClick={()=>calendarFilter(null, data.calendar.previous.month, data.calendar.previous.year)}/>
                        </div>
                        <div className="right">
                            <Icon icon='arrow-right' onClick={()=>calendarFilter(null, data.calendar.next.month, data.calendar.next.year)}/>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                {days.map((day) => (
                                  <th key={Math.random()}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                            <tr key={Math.random()}>
                                {row.map((item) => (
                                  <td key={Math.random()}>
                                    <div className="day right">{item.date}</div>
                                    {item.total &&
                                        <div className="total" onClick={()=>calendarFilter(item.date, data.calendar.month, data.calendar.year)}>
                                            <div className="number">{item.total}</div>
                                        </div>
                                    }
                                    {!item.total && <div className="total">&nbsp;</div>}
                                  </td>
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    if(props.reloadable && !props.reloadable[key]){
        props.reloadable[key] = reload;
    }

    //<div>{JSON.stringify(data)}</div>
    return (
        <div className={"queryset "+key}>
            <div>
                <div className="left">
                    <h1 data-label={toLabelCase(title)}>
                        <TitleCase text={title}/>
                        {data.count > 0 && <span className="counter">{data.count}</span>}
                    </h1>
                </div>
                <div className="right">
                    <GlobalActions data={data} reloader={props.reloader || reload}/>
                </div>
            </div>
            <ClearFix/>
            <Subsets data={data.subsets} count={data.count} active={data.subset} onChange={subset}/>
            <FilterForm data={data} onfilter={reload} url={getContextURL(data.url)}/>
            {calendar()}
            <Pagination data={data} reloader={reload}/>
            <ClearFix/>
            <BatchActions data={data} reloader={props.reloader || reload}/>
            <ClearFix/>
            {data.aggregations && <Aggreations data={data.aggregations}/>}
            <ClearFix/>
            <DataTable data={data} reloader={props.reloader || reload} onSelect={onSelect} selectable={hasBatchActions()}/>
            <BatchActions data={data} reloader={props.reloader || reload}/>
            <ClearFix/>
            <Pagination data={data} reloader={reload}/>
            <ClearFix/>
        </div>
    )
}

export default QuerySet
