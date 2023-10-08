import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './lib/Root.jsx'

const LOGIN_URL = '/api/v1/login/';
const HOME_URL = '/api/v1/user/';
const APP_URL = '/api/v1/application/';


if(document.location.pathname=='' || document.location.pathname=='/'){
    document.location.href = HOME_URL;
}  else if(document.location.pathname==LOGIN_URL){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
} else if(!localStorage.getItem("token")){
    document.location.href = LOGIN_URL;
}
function load(data){
    var application = data.result;

    var root = document.querySelector(':root');
    root.style.setProperty('--primary-color', application.theme.primary);
    root.style.setProperty('--secondary-color', application.theme.secondary);
    root.style.setProperty('--auxiliary-color', application.theme.auxiliary);
    root.style.setProperty('--highlight-color', application.theme.highlight);
    root.style.setProperty('--info-color', application.theme.info);
    root.style.setProperty('--success-color', application.theme.success);
    root.style.setProperty('--warning-color', application.theme.warning);
    root.style.setProperty('--danger-color', application.theme.danger);
    console.log(application.theme);

    document.getElementById('title').innerHTML = data.result.title;
    document.getElementById('icon').href = data.result.icon;
    localStorage.setItem('application', JSON.stringify(application));

    ReactDOM.createRoot(document.getElementById('root')).render(<Root/>)
    //<React.StrictMode><Root/></React.StrictMode>
}

request('GET', APP_URL, load);

