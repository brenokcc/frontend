import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './lib/Root.jsx'

function load(data){
    localStorage.setItem('application', JSON.stringify(data.result));
    ReactDOM.createRoot(document.getElementById('root')).render(<Root/>)
    //<React.StrictMode><Root/></React.StrictMode>
}

request('GET', '/api/v1/application/', load);

