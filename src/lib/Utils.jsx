import { useState, useEffect } from 'react'
import modal from './Modal';
import {Form, Filter} from './Form'
import QuerySet from './QuerySet'
import Viewer from './Viewer'
import Dashboard from './Dashboard'
import Statistics from './Statistics'
import Action from './Action'

var i18n = null

function toLabelCase(text){
    if(text!=null) text = toTitleCase(text.toString().replace('-', '')).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('_', '').toLowerCase();
    return text;
}

function toTitleCase(text){
    if(text!=null){
        text = text.toString().replace (/^[-_]*(.)/, (_, c) => c.toUpperCase()).replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
        if(true || i18n==null){
            const application = JSON.parse(localStorage.getItem('application'));
            i18n = application.i18n || {};
        }
        text = i18n[text] || text;
    }
    return text
}

function TitleCase(props){
    if(props.text){
        return <span>{toTitleCase(props.text)}</span>
    }
    return <span></span>
}

function Format(obj){
    if(obj===null) return '-';
    if(obj==="") return '-';
    if(obj===true) return 'Sim';
    if(obj===false) return 'Não';
    if(obj instanceof String) return obj;
    if(typeof obj === "string") return obj;
    if(typeof obj == "object" && Array.isArray(obj)){

    }
    if(typeof obj == "object" && !Array.isArray(obj) && obj.str){
        return obj.str;
    }
    return JSON.stringify(obj);
}

function Value(props){
    if(props.obj == null){
        return '-';
    }
    if(props.obj.type=="queryset"){
        return (
            <ul>
                {props.obj.results.map((item) => (
                  <li key={Math.random()}>{Format(item)}</li>
                ))}
            </ul>
        )
    }
    if(typeof props.obj == "object" && Array.isArray(props.obj)){
        return (
            <ul>
                {props.obj.map((item) => (
                  <li key={Math.random()}>{Format(item)}</li>
                ))}
            </ul>
        )
    }
    if(typeof props.obj == "object" && !Array.isArray(props.obj)){
        return (
            <div className="valueset">
                {Object.keys(props.obj).map((k)  => (
                  <dl key={Math.random()}>
                        <dt><TitleCase text={k}/></dt>
                        <dd>{Format(props.obj[k])}</dd>
                  </dl>
                ))}
            </div>
        )
    }
    return Format(props.obj)
}

function ClearFix(){
    return (
        <div className="clear"></div>
    )
}

function Empty(){
    return (
        <div className="info">
            <div className="icon">
                <Icon icon="info-circle"/>
            </div>
            <div className="detail">
                 <div className="text">
                    Nenhum registro encontrado.
                 </div>
            </div>
        </div>
    )
}

function Loading(props){
    return (
        <div className="loading">
            <i className="fa-solid fa-sync fa-spin fa-3x"></i>
        </div>
    )
}

function Fieldset(props){
    return (
        <div className="fieldset">
            <h2 data-label={toLabelCase(props.data.title)}><TitleCase text={props.data.title}/></h2>
            <div className="fields">
                {Object.keys(props.data.fields).map((k) => (
                    <div key={Math.random()} className="field">
                        <label><TitleCase text={k}/></label>
                        <div><Value obj={props.data.fields[k]}/></div>
                    </div>
                 ))}
            </div>
        </div>
    )
}

function Subsets(props){
    var subsets = [];
    var style = "subset";
    var active = props.count ? 'all' : null;
    function render(){
        if(props.data){
            Object.keys(props.data).map((k) => {
                if(props.active==k || active==null) active = k;
            })
            if(props.count!=null){
                if(active=='all') style = "subset active"
                subsets.push({k:'all', v:props.data.count, style:style});
            }
            {Object.keys(props.data).map((k) => {
                style = "subset";
                if(k==active) style = "subset active"
                subsets.push({k:k, v:props.data[k], style:style});
            })}
            return (
                <div className="subsets">
                    <input type="hidden" name="subset" defaultValue={active}/>
                    {subsets.map((subset) => (
                      <div className={subset.style} key={Math.random()} onClick={function(){props.onChange(subset.k)}}>
                        <TitleCase text={subset.k}/> <span className="counter">{subset.v}</span>
                      </div>
                    ))}
                </div>
            )
        }
    }
    return render()
}

function Flags(props){
    function render(){
        if(props.data){
            return (
                <div className="flags">
                    {Object.keys(props.data).map((k) => (
                        <div key={Math.random()} className="flag">
                             <input type="checkbox" name={k} onChange={props.onChange} checked={props.data[k]}/>
                             <label>{toTitleCase(k)}</label>
                        </div>
                    ))}
                </div>
            )
        }
    }
    return render();
}

function GerenciarInconsistencias(props){
    const [data, setdata] = useState(props.data);
    const key = "table";

    function subset(k){
        $('#table form input[name=subset]').val(k);
        reload();
    }

    function select(){
        $('#table form input[name=id]').prop('checked', event.target.checked);
    }

    function reload(){
        var params = $('#table form').serialize();
        request('GET', document.location.pathname+'?'+params, function(data){
            setdata(data.result);
        });
    }

    useEffect(()=>{}, [])

    function open(url){
        if(url){
            event.preventDefault();
            modal(url, function(){
                reload();
            });
        }
    }

    function render(){
        return (
            <div id="table">
                <h1>Inconsistências</h1>
                <form>
                    <Subsets data={data.subsets} active={data.subset} onChange={subset}/>
                    <Filter data={data.filters} onfilter={reload}/>
                    <Flags data={data.flags} onChange={reload}/>
                    <ClearFix/>
                    <Pagination/>
                    <ClearFix/>
                    {table()}
                    <ClearFix/>
                    <Pagination/>
                    <ClearFix/>
                </form>
            </div>
        )
    }

    function table(){
        if(data.rows.length>0){
            //return <div>{JSON.stringify(data.rows[0])}</div>
            return (
                <div className="responsive">
                    <table className="table">
                        <thead>
                            <tr>
                            {data.rows[0].map((col, i)  => (
                              <th key={Math.random()}>
                                {i==0 && <input type="checkbox" name="id" value="0" onChange={select}/>}
                                {i!=0 && <TitleCase text={col.name}/>}
                              </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row, i)  => (
                                <tr key={Math.random()}>
                                    {row.map((col, j)  => (
                                      <td key={Math.random()} onClick={function(){open(col.url);}} className={(col.url ? "clickable " : "")+col.style}>
                                        {j==0 && <input type="checkbox" name="id" value={row[0].value}/>}
                                        {j!=0 && <span>{col.value!=null && Format(col.value)}</span>}
                                      </td>
                                    ))}
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

    return render()
}

function Pagination(props){
    var count = 100;
    var page = 5
    var start = ((page-1) * 10) + 1;
    var end = start + 10 - 1;
    if(count > 10){
        return (
            <div className="pagination">
                <div className="left">
                    Exibir <select><option>10</option></select> | {start}-{end} de {count} itens
                </div>
                <div className="right">
                    Página {page}
                    {1 && <Icon icon="chevron-left" onClick={function(){alert(1)}}/>}
                    {1 && <Icon icon="chevron-right" onClick={function(){alert(2)}}/>}
                </div>
            </div>
        )
    }
}


function Component(props){
    function render(){
        switch(props.data.type) {
            case 'form':
              return (<Form data={props.data}/>);
            case 'queryset':
              return (<QuerySet data={props.data} reloader={props.reloader}/>);
            case 'fieldset':
                return (<Fieldset data={props.data}/>)
             case 'instance':
              return (<Viewer data={props.data} reloader={props.reloader}/>);
             case 'statistics':
              return (<Statistics data={props.data}/>)
             case 'dashboard':
              return (<Dashboard data={props.data}/>);
             case 'info':
              return (<Info data={props.data}/>);
             case 'icons':
              return (<Icons data={props.data}/>);
             case 'gerenciar_inconsistencias':
             return <GerenciarInconsistencias data={props.data.result}/>
            default:
              return (<Unknown data={props.data}/>);
        }
    }
    return render()
}

function Content(props){

    useEffect(()=>{
        $('.dialog').css('position', 'absolute').css('top', (document.documentElement.scrollTop || document.body.scrollTop) + 50);
    }, [])

    return (
        <div className="content">
            <Component data={props.data}/>
        </div>
    )
}

function Unknown(props){
    return <div>{JSON.stringify(props.data)}</div>
}

function Info(props){
    return (
        <div className="info">
            <div className="icon">
                <Icon icon="info"/>
            </div>
            <div className="detail">
                 <div className="text">
                    <strong>Informação</strong>:
                    <p>{props.data.text}</p>
                 </div>
            </div>
        </div>
    )
}

function Icons(props){

    function click(icon){
        copyToClipboard(icon);
    }

    return (
        <div className="icons">
            {props.data.result.icons.map((icon) => (
                <div className="icon-box" key={Math.random()} onClick={()=>click(icon)}>
                    <i className={"fa-solid fa-fw fa-"+icon}></i>
                    <div className="icon-text">{icon}</div>
                </div>
            ))}
        </div>
    )
}

function Icon(props){
    var className = "fa-solid fa-"+props.icon;
    if(props.onClick) className += " clickable";
    return (
        <i className={className} onClick={props.onClick}></i>
    )
}

function Accordion(props){

    const [expanded, expand] = useState(props.expanded || true);

    function icon(){
        return expanded ? "chevron-up" : "chevron-down";
    }

    function click(){
        expand(!expanded);
    }

    return (
        <div className="accordion">
            <div className="accordionTitle" onClick={click}>
                <div className="left">
                    {props.title}
                </div>
                <div className="right">
                    <Icon icon={icon()}/>
                </div>
            </div>
            <ClearFix/>
            {expanded && <div className="accordionBody">
                {props.children}
            </div>}
        </div>
    )
}

export {toLabelCase, toTitleCase, TitleCase, Value, ClearFix, Empty, Loading, Content, Icon, Accordion, Component, Subsets};
export default Loading;