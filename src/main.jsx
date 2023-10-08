import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './lib/Root.jsx'

const LOGIN_URL = '/api/v1/login/';
const HOME_URL = '/api/v1/user/'

if(document.location.pathname=='' || document.location.pathname=='/'){
    document.location.href = HOME_URL;
}  else if(document.location.pathname==LOGIN_URL){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
} else if(!localStorage.getItem("token")){
    document.location.href = LOGIN_URL;
}
function load(data){
    document.getElementById('title').innerHTML = data.result.title;
    document.getElementById('icon').href = data.result.icon;
    localStorage.setItem('application', JSON.stringify(data.result));
    ReactDOM.createRoot(document.getElementById('root')).render(<Root/>)
    //<React.StrictMode><Root/></React.StrictMode>
}

request('GET', '/api/v1/application/', load);

