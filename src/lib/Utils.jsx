import { useState, useEffect } from 'react'
import modal from './Modal';
import {Form, Filter} from './Form'
import QuerySet from './QuerySet'
import Viewer from './Viewer'
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
        return obj.join(", ")
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
        <div className="empty">
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
                      <div className={subset.style} key={Math.random()} onClick={function(){props.onChange(subset.k)}} data-label={toLabelCase(subset.k)}>
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

function Actions(props){

    function trigger(name){
        $(event.target).closest('form').find('input[name=action]').val(name);
        if(props.onClick) props.onClick();
        $(event.target).closest('form').find('input[name=action]').val('');
    }

    function render(){
        return (
            <div className="globalActions right">
                <input type="hidden" name="action"/>
                {props.data.map((action) =>  (
                  <button type="button" className="btn primary" onClick={function(){trigger(action.name)}} data-label={toLabelCase(action.label)}>
                    {action.label}
                  </button>
                ))}
            </div>
        )
    }
    return render()
}

function Table(props){
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
            setdata(data);
        });
    }

    useEffect(()=>{}, [])

    function open(url){
        if(url){
            event.preventDefault();
            modal(url, function(){reload()});
        }
    }

    function render(){
        return (
            <div id="table">
                <h1>Inconsistências</h1>
                <form>
                    <Actions data={data.actions} onClick={reload}/>
                    <Subsets data={data.subsets} active={data.subset} onChange={subset}/>
                    <Filter data={data.filters} onfilter={reload}/>
                    <Flags data={data.flags} onChange={reload}/>
                    <ClearFix/>
                    <Pagination data={data.pagination} onChange={reload}/>
                    <ClearFix/>
                    {table()}
                    <ClearFix/>
                    <Pagination data={data.pagination} onChange={reload} auxiliar={true}/>
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
    var total = props.data.total;
    var page = props.data.page;
    var size = props.data.size;
    var sizes = props.data.sizes;
    var start = ((page-1) * size) + 1;
    var end = start + size - 1;

    function paginate(n, size){
        var input = $(event.target).closest('form').find('input[name=page]');
        input.val(parseInt(input.val())+n);
        $(event.target).closest('form').find('input[name=size]').val(size);
        if(props.onChange) props.onChange();
    }

    if(1 || total > 10){
        return (
            <div className="pagination">
                {!props.auxiliar && <input type="hidden" name="page" defaultValue={page}/>}
                {!props.auxiliar && <input type="hidden" name="size" defaultValue={size}/>}
                <div className="left">
                    Exibir
                    <select onChange={function(){paginate(0, $(event.target).val())}} value={size}>
                        {sizes.map((n) => (
                            <option value={n} key={Math.random()}>{n}</option>
                        ))}
                    </select>
                    | {start}-{end} de {total} itens
                </div>
                <div className="right">
                    {start > 1 && <Icon icon="chevron-left" onClick={function(){paginate(-1, size)}}/>}
                    Página {page}
                    {end < total && <Icon icon="chevron-right" onClick={function(){paginate(+1, size)}}/>}
                </div>
            </div>
        )
    }
}


function Component(props){
    function render(){
        switch(props.data.type) {
            case 'form':
                return <Form data={props.data}/>
            case 'queryset':
                return <QuerySet data={props.data} reloader={props.reloader}/>
            case 'fieldset':
                return <Fieldset data={props.data}/>
             case 'instance':
                return <Viewer data={props.data} reloader={props.reloader}/>
             case 'statistics':
                return <Statistics data={props.data}/>
             case 'info':
                return <Info data={props.data}/>
             case 'indicators':
                return <Indicators data={props.data}/>
             case 'boxes':
                return <Boxes data={props.data}/>
             case 'warning':
                return <Warning data={props.data}/>
             case 'async':
                return <Async data={props.data}/>
             case 'icons':
                return <Icons data={props.data}/>
             case 'table':
                return <Table data={props.data}/>
             case 'html':
                return <Html data={props.data}/>
            default:
              return <Unknown data={props.data}/>
        }
    }
    return render()
}

function Html(props){
    return <div dangerouslySetInnerHTML={{__html: props.data.content}}></div>
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

function Boxes(props){
    return (
        <div className="boxes">
            <h2><TitleCase text={props.data.title}/></h2>
            <div>
                {props.data.items.map((item) => (
                      <a key={Math.random()} href={item.url} className="item" data-label={toLabelCase(item.label)}>
                        <div className="icon">
                            <Icon icon={item.icon}/>
                        </div>
                        <div className="text">
                            {item.label}
                        </div>
                      </a>
                ))}
            </div>
        </div>
    )
}


function Indicators(props){
    if(props.data){
        return (
            <div className="indicators">
                <h2><TitleCase text={props.data.title}/></h2>
                <div>
                    {props.data.items.map((item) => (
                        <div key={Math.random()} className="item">
                            <div className="value">
                                {item.value}
                            </div>
                            <div className="text">
                                <TitleCase text={item.name}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

function Async(props){
    const [data, setdata] = useState();

    function load(){
        request('GET', props.data.url, function(data){
            setdata(data);
        });
    }

    function render(){
        if(data==null){
            load();
            return <Loading/>
        } else {
            return <Component data={data}/>
        }
    }
    return render();
}

function Warning(props){
    function render(){
        return (
            <div className="warning">
                <div className="icon">
                    <Icon icon="warning"/>
                </div>
                <div className="detail">
                     <div className="text">
                        <p><strong>{props.data.title}:</strong> {props.data.message}</p>
                     </div>
                     <div className="actions">
                        {props.data.actions.map((action)  => (
                            <Action key={Math.random()} href={action.url} label={action.label} modal={action.modal}>{action.label}</Action>
                        ))}
                     </div>
                </div>
            </div>
        )
    }
    return render();
}

function Info(props){
    function render(){
        return (
            <div className="info">
                <div className="icon">
                    <Icon icon="info"/>
                </div>
                <div className="detail">
                     <div className="text">
                        <p><strong>{props.data.title}:</strong> {props.data.message}</p>
                     </div>
                     <div className="actions">
                        {props.data.actions.map((action)  => (
                            <Action href={action.url} label={action.label} modal={action.modal}>{action.label}</Action>
                        ))}
                     </div>
                </div>
            </div>
        )
    }
    return render();
}

function Unknown(props){
    if(Array.isArray(props.data.result)){
        return (
            <div>
                {props.data.result.map((data)  => (
                  <Component key={Math.random()} data={data}/>
                ))}
            </div>
        )
    } else {
        return <div>{JSON.stringify(props.data)}</div>
    }
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
    if(props.onClick || props.clickable) className += " clickable";
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