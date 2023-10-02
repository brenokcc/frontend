import { useState, useEffect } from 'react'
import {TitleCase, Value} from './Utils'
import QuerySet from './QuerySet'


function Viewer(props){

    function Field(k, v){
        return (
            <div>
                <label><TitleCase text={k}/></label>
                <div><Value obj={v}/></div>
            </div>
        )
    }

    function Fieldset(k, v){
        if(v.type=="queryset") return <QuerySet data={v} relation={k}/>;
        return (
            <div className="fieldset">
                <h2>{TitleCase(k)}</h2>
                {Object.keys(v).map((k2) => (
                    <div key={Math.random()}>
                        {Field(k2, v[k2])}
                    </div>
                 ))}
            </div>
        )
    }

    function FieldOrFieldset(k, v){
        if(k=="id") return
        if(typeof v == "object" && !Array.isArray(v)){
            return Fieldset(k, v)
        } else {
            return Field(k, v);
        }
    }
    //<div>{JSON.stringify(props.data.result)}</div>
    return (
        <div className="viewer">
            <h1>{props.data.str}</h1>
            {Object.keys(props.data.result).map((k) => (
                <div key={Math.random()}>
                    {FieldOrFieldset(k, props.data.result[k])}
                </div>
             ))}
        </div>
    )
}

export default Viewer;