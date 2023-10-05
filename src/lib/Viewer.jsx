import { useState, useEffect } from 'react'
import {toLabelCase, TitleCase, Value} from './Utils'
import QuerySet from './QuerySet'


function Viewer(props){
    const [data, setdata] = useState(props.data);
    var reloadable = {};

    function Field(k, v){
        return (
            <div className="field">
                <label><TitleCase text={k}/></label>
                <div><Value obj={v}/></div>
            </div>
        )
    }

    function Fieldset(k, v){
        if(v){
            if(v.type=="queryset"){
                return <QuerySet data={v} relation={k} reloadable={reloadable} reloader={reload}/>;
            } else {
                return (
                    <div className="fieldset">
                        <h2 data-label={toLabelCase(k)}><TitleCase text={k}/></h2>
                        <div className="fields">
                            {Object.keys(v).map((k2) => (
                                <div key={Math.random()}>
                                    {Field(k2, v[k2])}
                                </div>
                             ))}
                        </div>
                    </div>
                )
            }
        }
    }

    function FieldOrFieldset(k, v){
        if(k=="id") return
        if(typeof v == "object" && !Array.isArray(v)){
            return Fieldset(k, v)
        } else {
            return Field(k, v);
        }
    }

    function reload(){
        var keys = Object.keys(reloadable);
        for(var i=0; i<keys.length; i++) reloadable[keys[i]]();
        //request('GET', document.location.href, function(data){
        //    setdata(data);
        //});
    }

    //<div>{JSON.stringify(data.result)}</div>
    return (
        <div className="viewer">
            <h1 onClick={reload} data-label={toLabelCase(data.str)}>{data.str}</h1>
            {Object.keys(data.result).map((k) => (
                <div key={Math.random()}>
                    {FieldOrFieldset(k, data.result[k])}
                </div>
             ))}
        </div>
    )
}

export default Viewer;