

import { useState, useEffect } from 'react'
import Action from './Action'
import {toLabelCase, toTitleCase, ClearFix, Loading, Content, Icon} from './Utils'
import modal from './Modal'
import Menu from './Menu'



function Root(props){
    const [data, setdata] = useState(null);
    const [key, setkey] = useState(0);

    useEffect(()=>{
        window.addEventListener('keydown', (event) => {
          if(event.code=='Escape') closeDialogs();
        }, false);
    }, [])

    function load(url){
        request('GET', url || document.location.href, function(data){
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
                    {!localStorage.getItem('user') && window.innerWidth<=600 && <OAuth/>}
                    { window.innerWidth<=600 && <Search/>}
                    <ClearFix/>
                    <Main data={data} reloader={load} />
                    <ClearFix/>
                    <Footer/>
                    <Notification/>
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

function Main(props){
    var mobile = window.innerWidth < 600;
    var showMenu = !mobile && getCookie('hide-menu') != "true";
    function render(){
        const application = JSON.parse(localStorage.getItem('application'));
        return (
            <div className="main">
                {application.menu.length > 0 &&
                <div className={"menu "+(mobile ? "compact" : "")} style={{ display: showMenu? "inline-block" : "none" }}>
                    <Menu data={application.menu}/>
                </div>
                }
                <div className={"container " + (application.menu.length > 0 && showMenu ? "compact" : "")}>
                    <Breadcrumbs/>
                    <Content data={props.data} reloader={props.reloader}/>
                </div>
            </div>
        )
    }
    return render();
}

function Layer(props){
    return (
        <div className="layer" onClick={function(){closeDialogs();}}></div>
    )
}

function Header(props){
    const [active, setactive] = useState(false);
    const application = JSON.parse(localStorage.getItem('application'));

    function onClickDropdownLink(){
        setactive(false);
    }

    function dropdown(){
        if(active){
            return (
                <div className="dropdown">
                    <Action label="Alterar Senha" href="/api/v1/user/change_password/" reloader={props.reloader} modal={true} link={true} onClick={onClickDropdownLink}>Alterar Senha</Action>
                    <a href="/api/v1/logout/" data-label={toLabelCase("Sair")}>Sair</a>
                </div>
            )
        }
    }

    function toggleMenu(){
        var mobile = window.innerWidth < 600;
        $('.main .menu').toggle();
        if(mobile){
            $('.main .menu').toggleClass('visible');
        } else {
            $('.main .container').toggleClass('compact');
        }
        if($('.main .menu').css('display')=="none") setCookie('hide-menu', true);
        else setCookie('hide-menu', false);
    }

    return (
        <div className="header">
            <div className="left">
                <div className="brand">
                    <a href={application.index}><img src={application.logo}/></a>
                    <div className="application">
                        <div className="title">
                            {application.menu.length > 0 && <Icon icon="align-justify" onClick={toggleMenu}/>}
                            {application.title}
                        </div>
                        <div className="subtitle">
                            {application.subtitle}
                        </div>
                    </div>
                </div>
            </div>

            <div className="right">
                { localStorage.getItem('user') &&
                <>
                    <div className="controls">
                        {false &&
                        <div className="links">
                            <Action href="/api/v1/icons/" modal={true} reloader={props.reloader} link={true}>Ícones</Action>
                        </div>
                        }
                        <div>
                            <div className="user" onClick={function(){hideMessage();setactive(!active)}} data-label={toLabelCase(localStorage.getItem('user'))}>
                                <div className="letter">
                                    {localStorage.getItem('user').toUpperCase()[0]}
                                </div>
                                { window.innerWidth>600 &&
                                    <div className="username">
                                        Olá <strong>{localStorage.getItem('user')}</strong> <Icon icon="chevron-down"/>
                                    </div>
                                }
                            </div>
                            {dropdown()}
                            { window.innerWidth>600 && <Search/>}
                        </div>
                    </div>

                </>
                }
                {!localStorage.getItem('user') && window.innerWidth>600 && <OAuth/>}
            </div>
        </div>
    )
}

function OAuth(props){
    const application = JSON.parse(localStorage.getItem('application'));
    function render(){
        return (
            <div className="controls oauth">
                {document.location.pathname!="/api/v1/login/" &&
                    <Action icon="sign-in" href="/api/v1/login/" button={true}>Login</Action>
                }
                {application.oauth.length>0 && application.oauth.map((provider) => (
                    <Action key={Math.random()} icon="user" href={provider.url} button={true}>{provider.label}</Action>
                ))}
            </div>
        )
    }
    return render();
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
    function render(){
        if(localStorage.getItem('user')){
            return (
                <div className="searcher">
                    <div style={{ width: "100%" }}>
                        <Icon icon="search"/>
                        <input type="text" className={"form-control "+(window.innerWidth > 600 ? "small" : "big")} placeholder="O que você procura?" onChange={onChange} data-label={toLabelCase("Buscar...")}/>
                        {dropdown()}
                    </div>
                </div>
            )
        }
    }
    return render();
}

function Notification(props){

    useEffect(()=>{
        var message = getCookie('message');
        if(message){
            showMessage(message);
            setCookie('message', null);
        }
    }, [])

    return (
        <div className="notification"></div>
    )
}

function Breadcrumbs(props){
    if(localStorage.getItem('user')){
        return (
            <div className="breadcrumbs">
                <Action label="Área Administrativa" href="/api/v1/dashboard/" link={true} icon="home">
                    <Icon icon  ="home"/>
                </Action>
                Área Administrativa
            </div>
        )
    }
}

function Footer(props){
    const application = JSON.parse(localStorage.getItem('application'));

    function render(){
       if(application.footer){
            return (
                    <div className="footer">
                        {application.footer.logo &&
                            <div className="footerContent">
                                <img src={application.footer.logo}/>
                            </div>
                        }
                        <div className="footerVersion">
                            <div>Versão {application.footer.version}</div>
                            <div>Todos os direitos reservados</div>
                        </div>
                    </div>
            )
       }
    }
    return render();
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