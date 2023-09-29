import { createRoot } from 'react-dom/client'

import { useState, useEffect } from 'react'
import Form from './Form'
import QuerySet from './QuerySet'

function open(url, reloader){
    window.reloader = reloader;
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
                if(window.reloader) window.reloader();
            }
          }
        }, false);
    }, [])

    function load(){
        request('GET', document.location.pathname, function(data){
            setdata(data);
            //setkey(key+1);
        });
    }

    function content(){
        if(data){
            return (
                <div key={key}>
                    <Header reloader={load} data={data} open={open}/>
                    <ClearFix/>
                    <button onClick={function(){ open('/api/v1/health/check/') }}>Open Dialog!</button>
                    <Breadcrumbs/>
                    <Content data={data}/>
                    <Icon icon="arrow-right"/>
                    <Footer/>
                    <Message/>
                    <Layer/>
                    <Counter/>
                </div>
            )
        } else {
            return <Loading/>
        }
    }
    if(data==null) load();
    return content();
}

function Action(props){
    function render(){
        if(props.modal){
            return (
                <a className="action" href={props.href} onClick={function(e){e.preventDefault();open(props.href, props.reloader);}}>
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
        switch(props.data.type) {
            case 'form':
              return (<Form data={props.data}/>);
            case 'queryset':
              return (<QuerySet data={props.data}/>);
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
                    <Action href="/api/v1/user/" reloader={props.reloader}>Início</Action>
                    <Action href="/api/v1/icons/" modal={true} reloader={props.reloader}>Ícones</Action>
                    <Action href="/api/v1/instituicoes/" modal={true} reloader={props.reloader}>Instituições</Action>
                    <Action href="/api/v1/instituicoes/add/" modal={true} reloader={props.reloader}>Adicionar Instituição</Action>
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

function Counter(props) {
  const [data, setdata] = useState(0);

  function x(){
    setdata(function(data){return data+=1});
  }
  return (
    <>
      <button onClick={x}>data is {data} - {new Date().toString()}</button>
    </>
  )
}

export default Root