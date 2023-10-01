

import { useState, useEffect } from 'react'
import Action from './Action'
import {ClearFix, Loading, Content, Icon} from './Utils'
import modal from './Modal'


function Root(props){
    const [data, setdata] = useState(null);
    const [key, setkey] = useState(0);

    localStorage.setItem("token", "MTExMTExMTExMTE6MTIz");

    useEffect(()=>{
        window.addEventListener('keydown', (event) => {
          if(event.code=='Escape') closeDialogs();
        }, false);
    }, [])

    function load(){
        request('GET', document.location.pathname, function(data){
            setdata(data);
            //setkey(key+1);
        });
    }

    //<button onClick={function(){ modal('/api/v1/health/check/') }}>Open Dialog!</button>

    function content(){
        if(data){
            return (
                <div key={key}>
                    <Header reloader={load} data={data} open={open}/>
                    <ClearFix/>
                    <Breadcrumbs/>
                    <Content data={data} reloader={load}/>
                    <Footer/>
                    <Message/>
                    <Layer/>
                </div>
            )
        } else {
            return <Loading/>
        }
    }
    if(data==null) load();
    return content();
}

function Layer(props){
    return (
        <div className="layer"></div>
    )
}

function Header(props){
    return (
        <div className="header">
            <div className="left">
                <div className="brand">
                    <img src="/images/logo.svg"/>
                    <div className="application">
                        <div className="title">
                            <Icon icon="align-justify"/>
                            Plataforma Nilo Peçanha</div>
                        <div className="subtitle">Ministério da Educação</div>
                    </div>
                </div>
            </div>
            <div className="right">
                <div>
                    <div className="links">
                        <Action href="/api/v1/user/" reloader={props.reloader} link={true}>Início</Action>
                        <Action href="/api/v1/icons/" modal={true} reloader={props.reloader} link={true}>Ícones</Action>
                    </div>
                    <div className="user">
                        <div className="letter">
                            A
                        </div>
                        <div className="username">
                            Olá <strong>Admin</strong> <Icon icon="chevron-down"/>
                        </div>
                    </div>
                </div>
                <div>
                    <input type="text" className="form-control"/>
                </div>
            </div>
        </div>
    )
}

function Message(props){

    useEffect(()=>{
        var message = getCookie('message');
        if(message){
            showMessage(message);
            setCookie('message', null);
        }
    }, [])

    return (
        <div className="message">Message</div>
    )
}

function Breadcrumbs(props){
    return (
        <div className="breadcrumbs">
            <Icon icon  ="home"/>
            <Action href="/api/v1/user/" link={true}>Início</Action>
            Instituições
        </div>
    )
}

function Footer(props){
    return (
        <div className="footer">
            <div className="footerContent">
                <img src="/images/govbr.png"/>
            </div>
            <div className="footerVersion">
                Versão 1.0.0
            </div>
        </div>
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