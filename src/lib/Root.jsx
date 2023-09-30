

import { useState, useEffect } from 'react'
import Action from './Action'
import {ClearFix, Loading, Content} from './Utils'
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

    function content(){
        if(data){
            return (
                <div key={key}>
                    <Header reloader={load} data={data} open={open}/>
                    <ClearFix/>
                    <button onClick={function(){ modal('/api/v1/health/check/') }}>Open Dialog!</button>
                    <Breadcrumbs/>
                    <Content data={data} reloader={load}/>
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

function Icon(props){
    return (
        <i className={"fa-solid fa-"+props.icon}></i>
    )
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