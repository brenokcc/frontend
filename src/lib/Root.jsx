

import { useState, useEffect } from 'react'
import Action from './Action'
import {toLabelCase, toTitleCase, ClearFix, Loading, Content, Icon} from './Utils'
import modal from './Modal'

const LOGIN_URL = '/api/v1/login/';
const HOME_URL = '/api/v1/user/'

function Root(props){
    const [data, setdata] = useState(null);
    const [key, setkey] = useState(0);

    if(document.location.pathname=='' || document.location.pathname=='/'){
        document.location.href = HOME_URL;
    }
    if(document.location.pathname==LOGIN_URL){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    } else if(localStorage.getItem("token")==null){
        document.location.href = LOGIN_URL;
    }

    useEffect(()=>{
        window.addEventListener('keydown', (event) => {
          if(event.code=='Escape') closeDialogs();
        }, false);
    }, [])

    function load(){
        request('GET', document.location.href, function(data){
            /*
               OAuth Authentication Flow:
                1) The user access the authorization HOME_URL available as subaction of login action
                2) After authorization, the code if sent to login URL: /api/v1/login/?code=xxxxxxx
                3) The backend creates the token and sends it to the frontend
                4) The token is received by the frontend and stored in the local storage as bellow
            */
            if (data.token){
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', data.user.username);
                if(data.message) setCookie('message', data.message);
                document.location.href = data.redirect;
            } else {
                setdata(data);
            }
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
            //return <Loading/>
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
    const [active, setactive] = useState(false);
    const application = JSON.parse(localStorage.getItem('application'));

    function dropdown(){
        if(active){
            return (
                <div className="dropdown">
                    <Action label="Alterar Senha" href="/api/v1/user/change_password/" reloader={props.reloader} modal={true} link={true}>Alterar Senha</Action>
                    <a href="/api/v1/login/" data-label={toLabelCase("Sair")}>Sair</a>
                </div>
            )
        }
    }

    return (
        <div className="header">
            <div className="left">
                <div className="brand">
                    <img src={application.logo}/>
                    <div className="application">
                        <div className="title">
                            <Icon icon="align-justify"/>
                            {application.title}
                        </div>
                        <div className="subtitle">
                            {application.subtitle}
                        </div>
                    </div>
                </div>
            </div>
            { localStorage.getItem('user') &&
            <div className="right">
                <div className="controls">
                    <div className="links">
                        <Action href="/api/v1/icons/" modal={true} reloader={props.reloader} link={true}>Ícones</Action>
                    </div>
                    <div>
                        <div className="user" onClick={function(){hideMessage();setactive(!active)}} data-label={toLabelCase(localStorage.getItem('user'))}>
                            <div className="letter">
                                {localStorage.getItem('user').toUpperCase()[0]}
                            </div>
                            <div className="username">
                                Olá <strong>{localStorage.getItem('user')}</strong> <Icon icon="chevron-down"/>
                            </div>
                        </div>
                        {dropdown()}
                    </div>
                </div>
                <Search/>
            </div>
            }
        </div>
    )
}

function Search(props){
    const [items, setitems] = useState([]);

    function onChange(){
        var term = event.target.value;
        request('GET', '/api/v1/user/resources/?choices_search='+term, function(data){
            setitems(data);
        });
    }

    function dropdown(){
        if(items.length>0){
            return (
                <div className="searcher-items">
                    {items.map((item) => (
                        <a key={Math.random()} href={item.url}>
                            <div data-label={toLabelCase(item.name)}>
                                {item.name}
                            </div>
                        </a>
                    ))}
                 </div>
            )
        }
    }
    return (
        <div className="searcher">
            <div>
                <Icon icon="search"/>
                <input type="text" className="form-control" placeholder="O que você procura?" onChange={onChange} data-label={toLabelCase("Buscar...")}/>
                {dropdown()}
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
    if(localStorage.getItem('user')){
        return (
            <div className="breadcrumbs">
                <Action label="Início" href="/api/v1/user/" link={true} icon="home">
                    <Icon icon  ="home"/>
                </Action>
                Início
            </div>
        )
    }
}

function Footer(props){
    const application = JSON.parse(localStorage.getItem('application'));
    return (
        <div className="footer">
            <div className="footerContent">
                <img src={application.image}/>
            </div>
            <div className="footerVersion">
                {application.version}
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