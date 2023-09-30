import Form from './Form'
import QuerySet from './QuerySet'
import Viewer from './Viewer'

function TitleCase(props){
    if(props.text){
        var title = props.text.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase()).replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
        return <span>{title}</span>
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

function Value(obj){
    if(Array.isArray(obj)){
        return (
            <ul>
                {obj.map((item) => (
                  <li key={Math.random()}>{Format(item)}</li>
                ))}
            </ul>
        )
    }
    return Format(obj)
}

function ClearFix(){
    return (
        <div className="clear"></div>
    )
}

function Empty(){
    return (
        <div className="empty">Nenhum registro encontardo</div>
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

    function child(){
        switch(props.data.type) {
            case 'form':
              return (<Form data={props.data}/>);
            case 'queryset':
              return (<QuerySet data={props.data} reloader={props.reloader}/>);
             case 'instance':
              return (<Viewer data={props.data} reloader={props.reloader}/>);
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
    return (
        <i className={"fa-solid fa-"+props.icon}></i>
    )
}

export {TitleCase, Value, ClearFix, Empty, Loading, Content, Icon};
export default Loading;