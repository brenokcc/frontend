import Form from './Form'
import QuerySet from './QuerySet'

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

export {ClearFix, Empty, Loading, Content};
export default Loading;