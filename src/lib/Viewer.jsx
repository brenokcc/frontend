import { useState, useEffect } from 'react'
import Action from './Action'
import {toLabelCase, toTitleCase, TitleCase, Value, ClearFix, Component} from './Utils'
import QuerySet from './QuerySet'


function Field(props){
    return (
        <div className="field">
            <label><TitleCase text={props.k}/></label>
            <div><Value obj={props.v}/></div>
        </div>
    )
}

function ValueSet(props){
    const [value, setvalue] = useState(props.value);

    function reload(){
        console.log('Reloading '+props.title+'...');
        setvalue({ ...props.data.result[props.title] });
        console.log(value);
    }

    if(props.reloadable && !props.reloadable[props.title]){
        props.reloadable[props.title] = reload;
    }

    function render(){
        console.log('Rendering '+props.title+': '+JSON.stringify(value));
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


function Viewer(props){
    var reloadable = {};

    function Fieldset(k, v){
        if(v){
            if(v.type=="queryset"){
                return <QuerySet data={v} relation={k} reloadable={reloadable} reloader={reload}/>;
            } else{
                return <ValueSet value={v} title={k} reloadable={reloadable} data={props.data}/>;
            }
        }
    }

    function FieldOrFieldset(k, v){
        if(k=="id") return
        if(typeof v == "object" && !Array.isArray(v)){
            return Fieldset(k, v)
        } else {
            return <Field k={k} v={v}/>
        }
    }

    function reload(){
        request('GET', document.location.href, function(data){
            console.log(props.data.result);
            console.log(data.result);
            props.data.result = data.result
            var keys = Object.keys(reloadable);
            for(var i=0; i<keys.length; i++) reloadable[keys[i]]();
        });
    }

    //<div>{JSON.stringify(props.data.result)}</div>
    return (
        <div className="viewer">
            <div>
                <div className="left">
                    <h1 onClick={reload} data-label={toLabelCase(props.data.str)}>{props.data.str}</h1>
                </div>
                <div className="right">
                    {props.data.actions.map((action) =>
                      <Action label={toTitleCase(action.name)} icon={action.icon} href={action.url} key={Math.random()} modal={action.modal} reloader={props.reloader}>
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