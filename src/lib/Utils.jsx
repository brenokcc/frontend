import { useState, useEffect } from 'react'
import Form from './Form'
import QuerySet from './QuerySet'
import Viewer from './Viewer'
import Dashboard from './Dashboard'
import Statistics from './Statistics'

var i18n = null

function toLabelCase(text){
    if(text) text = toTitleCase(text.replace('-', '')).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('_', '').toLowerCase();
    return text;
}

function toTitleCase(text){
    if(text){
        text = text.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase()).replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
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
                             <input type="checkbox"/>
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

    function subset(k){
        alert(k);
    }

    function table(){
        if(props.data.rows.length>0){
            //return <div>{JSON.stringify(props.data.rows[0])}</div>
            return (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                            {props.data.rows[0].map((col)  => (
                              <th key={Math.random()}>
                                <TitleCase text={col.name}/>
                              </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.rows.map((row, i)  => (
                                <tr>
                                    {row.map((col, j)  => (
                                      <td key={Math.random()}>
                                        {j==0 && <input type="checkbox"/>}
                                        {j>0 && <span>{col.value}</span>}
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

    return (
        <div>
            <h1>Inconsistências</h1>
            <Flags data={props.data.flags}/>
            <Subsets data={props.data.subsets} active={props.data.subset} onChange={subset}/>
            <div>{false && JSON.stringify(props.data)}</div>
            {table()}
        </div>
    )
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