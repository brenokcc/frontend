import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './lib/Root.jsx'

const LOGIN_URL = '/api/v1/login/';
const APP_URL = '/api/v1/application/';


function load(data){
    var application = data;

    if(document.location.pathname=='' || document.location.pathname=='/'){
        document.location.href = application.index;
    }  else if(document.location.pathname==LOGIN_URL){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    var root = document.querySelector(':root');
    root.style.setProperty('--primary-color', application.theme.primary);
    root.style.setProperty('--secondary-color', application.theme.secondary);
    root.style.setProperty('--auxiliary-color', application.theme.auxiliary);
    root.style.setProperty('--highlight-color', application.theme.highlight);
    root.style.setProperty('--info-color', application.theme.info);
    root.style.setProperty('--success-color', application.theme.success);
    root.style.setProperty('--warning-color', application.theme.warning);
    root.style.setProperty('--danger-color', application.theme.danger);
    root.style.setProperty('--border-radius', application.theme.radius);

    document.getElementById('title').innerHTML = data.title;
    document.getElementById('icon').href = data.icon;
    localStorage.setItem('application', JSON.stringify(application));

    ReactDOM.createRoot(document.getElementById('root')).render(<Root/>)
    //<React.StrictMode><Root/></React.StrictMode>
}

request('GET', APP_URL, load);

