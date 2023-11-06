import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './lib/Root.jsx'

const LOGIN_URL = '/api/v1/login/';
const LOGOUT_URL = '/api/v1/logout/';
const APP_URL = '/api/v1/application/';


function initApp(data){
    var application = data;
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
    localStorage.setItem('application', JSON.stringify(application));
    ReactDOM.createRoot(document.getElementById('root')).render(<Root/>)
    //<React.StrictMode><Root/></React.StrictMode>

}

var pathname = document.location.pathname;
var application = localStorage.getItem('application');
if(application && localStorage.getItem('version')==VERSION){
    var data = JSON.parse(application);
    if(pathname==LOGOUT_URL){
        localStorage.removeItem("application");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.location.href = data.index;
    } else {
        if(pathname=='' || pathname=='/'){
            document.location.href = data.index;
        } else if(pathname==LOGIN_URL){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        initApp(data);
    }
} else {
    request('GET', APP_URL, function load(data){
        localStorage.setItem('version', VERSION);
        initApp(data);
    });
}

