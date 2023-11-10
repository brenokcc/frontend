import { useState, useEffect } from 'react'
import Action from './Action'
import {toLabelCase, toTitleCase, TitleCase, Value, ClearFix, Component} from './Utils'
import QuerySet from './QuerySet'


function Field(props){
    function render(){
        if(props.k != "id"){
            return props.k ? (
                <div className={"field w"+props.w}>
                    <label><TitleCase text={props.k}/></label>
                    <div><Value obj={props.v}/></div>
                </div>
            ) : <Value obj={props.v}/>
        }
    }
    return render()
}

function ValueSet(props){
    const [value, setvalue] = useState(props.value);

    function reload(){
        setvalue({ ...props.data.result[props.title] });
    }

    if(props.reloadable && !props.reloadable[props.title]){
        props.reloadable[props.title] = reload;
    }

    function render(){
        if(value.type){
            return (
                <div className="fieldset">
                    <h2 data-label={toLabelCase(props.title)}>
                        <TitleCase text={props.title}/>
                    </h2>
                    <Component data={value}/>
                </div>
            )
        } else {
            return (
                <div className="fieldset">
                    <h2 data-label={toLabelCase(props.title)}>
                        <TitleCase text={props.title}/>
                    </h2>
                    <div className="fields">
                        {Object.keys(value).map((k2) => (
                            <div key={Math.random()}>
                                <Field k={k2} v={value[k2]}/>
                            </div>
                         ))}
                    </div>
                </div>
            )
        }
    }

    return render();

}

function FieldSet(props){
    const [value, setvalue] = useState(props.value);

    function reload(){
        console.log(props.data.result[props.title]);
        setvalue({ ...props.data.result[props.title] });
    }

    if(props.reloadable && !props.reloadable[props.title]){
        props.reloadable[props.title] = reload;
    }

    function render(){
        if(value.type != "fieldset"){
            return (
                <div className="fieldset">
                    <h2 data-label={toLabelCase(props.title)}>
                        <TitleCase text={props.title}/>
                    </h2>
                    <Component data={value}/>
                </div>
            )
        } else {
            if(value.fields.length==2 && value.fields[0]['key'] == 'id' && value.fields[1]['key'] == 'text'){
                value.fields[1]['key'] = 'Descrição'
            }
            return (
                <div className="fieldset">
                    <div className="title">
                        <div className="left">
                            <h2 data-label={toLabelCase(props.title)}>
                                <TitleCase text={props.title}/>
                            </h2>
                        </div>
                        <div className="right">
                            {value.actions.map((action) =>
                              <Action label={toTitleCase(action.name)} icon={action.icon} href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader} button={true}>
                                <TitleCase text={action.name}/>
                              </Action>
                            )}
                        </div>
                    </div>
                    <ClearFix/>
                    <div className="fields">
                        {value.fields.map((field) => (
                            <Field key={Math.random()} k={field.key} v={field.value} w={field.width}/>
                         ))}
                    </div>
                </div>
            )
        }
    }

    return render();

}


function Viewer(props){
    const [key, setkey] = useState(0);
    var reloadable = {};


    function FieldOrFieldset(k, v){
        if(k=="id") return
        if(v && v.type == "queryset"){
            return <QuerySet data={v} relation={k} reloadable={reloadable} reloader={reload}/>;
        }
        if(v && (v.type == "fieldset" || v.type == "statistics")){
            return <FieldSet value={v} title={k} reloadable={reloadable} reloader={reload} data={props.data}/>;
        } else {
            return <Field v={v}/>
        }
    }

    function reload(){
        request('GET', props.data.url, function(data){
            props.data.result = data.result
            var keys = Object.keys(reloadable);
            for(var i=0; i<keys.length; i++) reloadable[keys[i]]();
        });
    }

    if(props.data.autoreload){
        setTimeout(function(){
            request('GET', props.data.url, function(data){
                props.data.result = {...data.result};
                setkey(key+1);
            });
        }, props.data.autoreload*1000);
    }

    //<div>{JSON.stringify(props.data.result)}</div>
    return (
        <div className={"viewer "+(window.innerWidth > 600 ? "desktop" : "mobile")}>
            <div>
                <div className="left">
                    <h1 onClick={reload} data-label={toLabelCase(props.data.str)}>{props.data.str}</h1>
                </div>
                <div className="right">
                    {props.data.actions.map((action) =>
                      <Action label={toTitleCase(action.name)} icon={action.icon} href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader} button={true}>
                        <TitleCase text={action.name}/>
                      </Action>
                    )}
                </div>
            </div>
            <ClearFix/>
            {Object.keys(props.data.result).map((k) => (
                <div key={Math.random()}>
                    {FieldOrFieldset(k, props.data.result[k])}
                </div>
             ))}
        </div>
    )
}

export default Viewer;