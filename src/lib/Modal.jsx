import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import {Loading, Content} from './Utils'


function modal(url, reloader){
    window.reloader = reloader;
    createRoot(document.body.appendChild(document.createElement( 'div' ))).render(<Dialog url={url} />);
}

function Dialog(props){
    const [data, setdata] = useState(null);
    const [key, setkey] = useState(0);


    useEffect(()=>{
        open(props.url);
        var layer = document.querySelector('.layer');
        if(layer) layer.style.display = 'block';
    }, [])

    function open(url){
        request('GET', url, function(data){
            setdata(data);
            setkey(key+1);
        });
    }

    function content(){
        if(data){
            return <Content data={data}/>

        } else {
            return (<Loading/>)
        }
    }

    return (
        <dialog className="dialog" key={key}>
            {content()}
        </dialog>
    )
}

export default modal;

