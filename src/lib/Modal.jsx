import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'
import {Loading, Content} from './Utils'


function modal(url, reloader){
    hideMessage();
    window.reloader = reloader;
    var dialogs = document.getElementsByTagName('dialog');
    for(var i=0; i<dialogs.length; i++) dialogs[i].style.display = "none";
    createRoot(document.body.appendChild(document.createElement( 'div' ))).render(<Dialog url={url} />);
}

function imodal(url){
    hideMessage();
    createRoot(document.body.appendChild(document.createElement( 'div' ))).render(<IDialog url={url} />);
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
        <dialog className={"dialog "+(window.innerWidth > 600 ? "small" : "big")} key={key}>
            {content()}
        </dialog>
    )
}

function IDialog(props){
    var key = Math.random();

    useEffect(()=>{
        var layer = document.querySelector('.layer');
        if(layer) layer.style.display = 'block';
        var dialog = document.getElementById(key);
        $(dialog).css('top', document.documentElement.scrollTop + 100);
    }, [])

    return (
        <dialog className={"dialog "+(window.innerWidth > 600 ? "small" : "big")} id={key}>
            <iframe src={props.url} width="100%" height={500}></iframe>
        </dialog>
    )
}

export {modal, imodal};
export default modal;

