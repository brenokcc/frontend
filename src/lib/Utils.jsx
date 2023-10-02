import { useState, useEffect } from 'react'
import Form from './Form'
import QuerySet from './QuerySet'
import Viewer from './Viewer'
import Dashboard from './Dashboard'

function toTitleCase(text){
    if(text) return text.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase()).replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
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
    return JSON.stringify(obj);
}

function Value(props){
    if(props.obj == null){
        return '-'
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
                    <strong>Informação</strong>
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

function Content(props){

    useEffect(()=>{
        $('.dialog').css('position', 'absolute').css('top', (document.documentElement.scrollTop || document.body.scrollTop) + 50);
    }, [])


    function child(){
        switch(props.data.type) {
            case 'form':
              return (<Form data={props.data}/>);
            case 'queryset':
              return (<QuerySet data={props.data} reloader={props.reloader}/>);
             case 'instance':
              return (<Viewer data={props.data} reloader={props.reloader}/>);
             case 'dashboard':
              return (<Dashboard data={props.data}/>);
             case 'icons':
              return (<Icons data={props.data}/>);
            default:
              return (<Unknown data={props.data}/>);
        }
    }
    return (
        <div className="content">{child()}</div>
    )
}

function Unknown(props){
    return <div>{JSON.stringify(props.data)}</div>
}

function Icons(props){

    function click(icon){
        console.log(icon);
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

export {toTitleCase, TitleCase, Value, ClearFix, Empty, Loading, Content, Icon, Accordion};
export default Loading;