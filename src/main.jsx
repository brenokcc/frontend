import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './App.jsx'
import './index.css'

localStorage.setItem("token", "MTExMTExMTExMTE6MTIz");

request('GET', document.location.pathname, function(data){
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <Root data={data}/>
      </React.StrictMode>,
    )
});

