import { useState, useEffect } from 'react'
import {toLabelCase, toTitleCase, TitleCase, Icon, ClearFix, Content, Component, Accordion, Message} from './Utils'


function Input(props){
    var field = props.data;
    var readonly = "";
    var className = ""
    var id = field.name+Math.random();

    if(field.mask=='decimal'){
        className = 'decimal';
        if(field.value) field.value = Math.round(parseFloat(field.value)).toFixed(2).replace('.', ',');
    }

    useEffect(()=>{
        if(field.mask){
            var input = document.getElementById(id);
            if(field.mask=='decimal'){
                VMasker(input).maskMoney({precision: 2, separator: ',', delimiter: '.'}); // unit: 'R$', suffixUnit: 'reais', zeroCents: true
            } else {
                VMasker(input).maskPattern(field.mask);
            }
        }
    }, [])

    return (
        <>
            {props.icon && <Icon icon={props.icon}/>}
            <input className={"form-control "+className} type={field.type} name={field.name} id={id} defaultValue={field.value} data-label={toLabelCase(field.label)} readOnly={field.read_only}/>
        </>
    )
}

function BooleanSelect(props){
    var field = props.data;
    return (
        <select className="form-control" id={field.name} name={field.name} data-label={toLabelCase(field.label)} defaultValue={field.value}>
            <option></option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
            <option value="null">-</option>
        </select>
    )
}

function Select(props){
    var field = props.data;

    return (
        <select className="form-control" id={field.name} name={field.name} data-label={toLabelCase(field.label)} defaultValue={field.value}>
            {field.choices.map((choice) => (
              <option key={Math.random()} value={choice.id}>{choice.text}</option>
            ))}
        </select>
    )
}

function Autocomplete(props){
    var field = props.data;
    var value = null
    if(field.value) value = field.value.id;
    var key = '__'+Math.random();

    useEffect(() => {
        autocomplete(field.name+key, field.name, false, props.url);
    });

    return (
        <div className="autocomplete">
            <select className="form-control" id={field.name+key} name={field.name} style={{display:'none'}} defaultValue={value}>
                { field.value &&
                    <option value={field.value.id}>{ field.value.text }</option>
                }
            </select>
            <input className="form-control" autoComplete="off" id={field.name+key+'autocomplete'} type="text" name={field.name+'__autocomplete'} defaultValue={field.value ? field.value.text : ''} data-label={toLabelCase(field.label)}/>
        </div>
    )
}

function AutocompleteMultiple(props){
    var field = props.data;
    var options = [];
    var values = [];
    var key = '__'+Math.random();

    if(field.value){
        options = field.value.map((value) => (<option key={Math.random()} value={value.id}>{value.text}</option>));
        field.value.forEach(function(value){values.push(value.id)});
    }

    useEffect(() => {
        autocomplete(field.name+key, field.name, true, props.url);
    });

    return (
        <div className="autocomplete">
            <div id={field.name+key+"boxes"}></div>
            <select className="form-control" id={field.name+key} name={field.name} style={{display:'none'}} multiple defaultValue={values}>
                {options}
            </select>
            <input className="form-control" autoComplete="off" id={field.name+key+'autocomplete'} type="text" name={field.name+'autocomplete'} defaultValue={field.value.text} data-label={toLabelCase(field.label)}/>
        </div>
    )
}


function Field(props){

    function render(){
        var field = props.data;
        if(["text", "password", "email", "number", "date", "datetime-regional",  "file", "image", "range", "search", "tel", "time", "url", "week", "hidden"].indexOf(field.type)>=0){
            return <Input data={field}/>
        } else if(field.type == "boolean" || field.type == "bool"){
            return <BooleanSelect data={field}/>
        } else if(field.type == "select"){
            if(field.choices) return <Select data={field}/>
            else if(field.multiple) return <AutocompleteMultiple data={field} url={props.url}/>
            else return <Autocomplete data={field} url={props.url}/>
        } else {
            return <div>{field.value}</div>
        }
    }
    return render()
}

function Output(props){

}

function Form(props){
    const [data, setdata] = useState();

    var form = props.data;
    var fields = [
        {type: 'text', name:'username', value:'admin'},
        {type: 'password', name:'password', value:null},
        {type: 'boolean', name:'casado', value:null},
        {type: 'select', name:'uf', value:null, choices:[{id: null, text: ''}, {id: 1, text: 'RN'}, {id: 2, text: 'PB'}]},
        {type: 'select', name:'tipo', value:{id: 1, text: ''}},
        {type: 'select', name:'pesquisadores_institucionais', multiple:true, value:[{id: 1, text: 'João'}]},
    ]

    useEffect(()=>{
        formControl(form.controls);
        formWatch(form.watch);
    }, [])

    function process(data, response){
        if(data.type && data.type!='form'){
            setdata(data);
            return
        }
        if (response.status>=400){
             showErrors(data);
             return;
        } else if (data.token){
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.user.username);
        }
        if(data.redirect){
            if(data.message) setCookie('message', data.message);
            document.location.href = data.redirect;
        } else {
            if(data.message){
                showMessage(data.message);
            } else if(data.task){
                showTask(data.task, callback);
            } else {
                showMessage('Ação realizada com sucesso');
            }
            closeDialogs();
        }
    }

    function showErrors(data){
        var message = null;
        for(var k in data){
            if(k=='non_field_errors' || k=='detail' || k==0){
                message = data[k];
            } else {
                var error = $('.field-error.'+ k);
                error.find('span').html(data[k][0]);
                error.show();
            }
        }
        if(message) showMessage(message, 'error');
        else showMessage('Corrija os erros indicados no formulário.', 'error');
    }

    function submit(){
        hideMessage();
        var id = 'form';
        var form = document.getElementById(id);
        var data = new FormData(form);
        var button = form.querySelector(".btn.submit");
        var label = button.value;
        button.value = 'Aguarde...';
        $(form).find('.field-error').hide();
        form.querySelectorAll("input[type=file]").forEach(function( widget ) {
            if(widget.blob){
                data.delete(widget.name);
                data.append(widget.name, widget.blob, new Date().getTime()+'.'+'png');
            }
        });
        form.querySelectorAll(".decimal").forEach(function( widget ) {
            data.set(widget.name, data.get(widget.name).replace(',', '.'));
        });
        function callback(data, response){
            button.value = label;
            process(data, response);
        }
        if(form.dataset.method.toUpperCase()!='GET') request(form.dataset.method.toUpperCase(), form.action, callback, data);
        else request('GET', form.action+'?'+new URLSearchParams(new FormData(form)).toString(), callback);
    }

    function toField(field){
        return (
            <div className={"form-group "+field.name+" w"+field.width} key={Math.random()}>
                <label>
                    <TitleCase text={field.label}/>
                    {field.required && <i>*</i>}
                </label>
                <br/>
                <Field data={field} url={props.data.action}/>
                <div className={"field-error "+field.name}>
                    <Icon icon='xmark-circle'/>
                    <span></span>
                </div>
                <div className="help_text" dangerouslySetInnerHTML={{__html: field.help_text}}></div>
              </div>
        )
    }

    function toFields(fields){
        if(Array.isArray(fields)){
            return fields.map((field) => (
                  toField(field)
            ))
        } else {
            return Object.keys(fields).map((k) => (
              <div className={"form-fieldset " + toTitleCase(k)} key={Math.random()}>
                {k && <h2>{<TitleCase text={k}/>}</h2>}
                {toFields(fields[k])}
              </div>
            ))
        }
    }

    function render(){
        //<div>{JSON.stringify(props.data)}</div>
        return (
            <div className={props.data.name+'-form'}>
                {props.data.display && <Component data={props.data.display}/>}
                <h1 data-label={toLabelCase(props.data.name)}>
                    {props.data.icon && <Icon icon={props.data.icon}/>}
                    <TitleCase text={props.data.name}/>
                </h1>
                {props.data.help_text && <Message text={props.data.help_text}/>}
                {props.data.prepend && props.data.prepend.map((item) => (
                      <Component key={Math.random()} data={item}/>
                ))}
                <form data-method={props.data.method} id="form" className="form" action={props.data.action}>
                    {toFields(form.fields)}
                    <ClearFix/>
                    <div className="right">
                        <input className="btn submit primary" type="button" onClick={submit} value="Enviar" data-label={toLabelCase("Enviar")}/>
                    </div>
                    <ClearFix/>
                    {props.data.subactions &&
                        <div className="subactions">
                            {props.data.subactions.map((subaction) => (
                                  <a key={Math.random()} className="subaction" href={subaction.url}>{subaction.label}</a>
                            ))}
                        </div>
                    }
                </form>
                {props.data.append && props.data.append.map((item) => (
                      <Component key={Math.random()} data={item}/>
                ))}
                {data && <Content data={data}/>}
            </div>
        )
    }

    return render()
}


function Filter(props){

    function field(filter){
        if(filter.type == "hidden"){
            return <Field data={filter} url={props.url}/>
        } else {
            return (
              <div className="filterField" key={Math.random()}>
                <label><TitleCase text={filter.label || filter.name}/></label>
                <br/>
                <Field data={filter} url={props.url}/>
              </div>
            )
        }
    }

    function render(){
        if(props.data.length>0){
            return(
              <Accordion title="Filtros">
                <div className="filter">
                    {props.data.map((filter) => (field(filter)))}
                    <div>
                        <button className="btn primary" type="button" onClick={()=>props.onfilter()} data-label={toLabelCase("filter")}>
                            <Icon icon="filter"/>
                            <TitleCase text="Filter"/>
                        </button>
                    </div>
                </div>
              </Accordion>
            )
        }
    }

    return render()
}


export {Form, Field, Filter};
export default Form;
