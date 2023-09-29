import { createRoot } from 'react-dom/client'

import { useState, useEffect } from 'react'
import Form from './Form'
import QuerySet from './QuerySet'

function open(url){
    createRoot(document.body.appendChild(document.createElement( 'div' ))).render(<Dialog url={url} />);
}

function Root(props){
    const [data, setdata] = useState(null);
    const [key, setkey] = useState(0);

    localStorage.setItem("token", "MTExMTExMTExMTE6MTIz");

    useEffect(()=>{
        window.addEventListener('keydown', (event) => {
          if(event.code=='Escape'){
            var dialogs = document.getElementsByTagName('dialog');
            for(var i=0; i<dialogs.length; i++){
                var dialog = dialogs[i];
                dialog.close();
                dialog.classList.remove('opened');
                dialog.remove();
                $('.layer').hide();
            }
          }
        }, false);
    }, [])

    function reload(){
        request('GET', document.location.pathname, function(data){
            setdata(data);
            setkey(key+1);
        });
    }

    function content(){
        if(data){
            return (
                <div key={key}>
                    <Header reload={reload} data={data} open={open}/>
                    <ClearFix/>
                    <button onClick={function(){ open('/api/v1/health/check/') }}>Open Dialog!</button>
                    <Breadcrumbs/>
                    <Content data={data}/>
                    <Icon icon="arrow-right"/>
                    <Footer/>
                    <Message/>
                    <Layer/>
                </div>
            )
        } else {
            return <Loading/>
        }
    }
    if(data==null) reload();
    return content();
}

function Action(props){

    function render(){
        if(props.modal){
            return (
                <a className="action" href={props.href} onClick={function(e){e.preventDefault();open(props.href);}}>
                    {props.children}
                </a>
            )
        } else {
            return (
                <a className="action" href={props.href}>{props.children}</a>
            )
        }
    }

    return render();
}

function Icon(props){
    return (
        <i className={"fa-solid fa-"+props.icon}></i>
    )
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

function Loading(props){
    return (
        <div className="loading">
            <i className="fa-solid fa-sync fa-spin fa-3x"></i>
        </div>
    )
}

function Layer(props){
    return (
        <div className="layer"></div>
    )
}

function Dialog(props){
    const [data, setdata] = useState(null);
    const [key, setkey] = useState(0);


    useEffect(()=>{
        open(props.url);
        var layer = document.querySelector('.layer');
        if(layer) layer.style.display = 'block';
    }, [])

    function open(url){
        request('GET', url, function(data){
            setdata(data);
            setkey(key+1);
        });
    }

    function content(){
        if(data){
            return <Content data={data}/>

        } else {
            return (<Loading/>)
        }
    }

    return (
        <dialog className="dialog" key={key}>
            <h2>Dialog Title</h2>
            {content()}
        </dialog>
    )
}

function Content(props){

    function child(){
        if(props.data.type == "form") return (<Form data={props.data}/>);
        if(props.data.type == "queryset") return (<QuerySet data={props.data}/>);
        if(props.data.type == "icons") return (<Icons data={props.data}/>);
        return <Unknown data={props.data}/>
    }
    return (
        <div className="content">{child()}</div>
    )
}

function Unknown(props){
    return <div>{JSON.stringify(props.data)}</div>
}

function ClearFix(){
    return (
        <div className="clear"></div>
    )
}

function Header(props){
    return (
        <div className="header">
            <div className="left">
                <div className="brand">Header</div>
                <div className="shortcuts">
                    <Action href="/api/v1/user/" reload={props.reload}>Início</Action>
                    <Action href="/api/v1/icons/" modal={true}>Ícones</Action>
                    <Action href="/api/v1/instituicoes/" modal={true}>Instituições</Action>
                    <Action href="/api/v1/instituicoes/add/" modal={true}>Adicionar Instituição</Action>
                </div>
            </div>
            <div className="right">
                <div className="user">admin</div>
            </div>
        </div>
    )
}

function Message(props){
    return (
        <div className="message">Message</div>
    )
}

function Breadcrumbs(props){
    return (
        <div className="breadcrumbs">Breadcrumbs</div>
    )
}

function Footer(props){
    return (
        <div className="footer">Footer</div>
    )
}

export default Root