import {useEffect} from 'react';

function Input(props){
    var field = props.data;
    var value = "";
    var readonly = "";
    if(field.value) value = field.value;
    return (
        <input className="form-control" type={field.type} name={field.name} id={field.name} defaultValue={field.value} data-label={field.name} readOnly={field.read_only} />
    )
}

function BooleanSelect(props){
    var field = props.data;
    return (
        <select className="form-control" id={field.name} name={field.name} data-label={field.name} value={field.value}>
            <option value="null"></option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
        </select>
    )
}

function Select(props){
    var field = props.data;

    return (
        <select className="form-control" id={field.name} name={field.name} data-label={field.name} value={field.value}>
            {field.choices.map((choice) => (
              <option value={choice.id}>{choice.text}</option>
            ))}
        </select>
    )
}

function Autocomplete(props){
    var field = props.data;

    useEffect(() => {
        autocomplete(field.name+"__xxx", field.name, false, '/api/v1/instituicoes/add/');
    });

    return (
        <div className="autocomplete">
            <select className="form-control" id={field.name+'__xxx'} name={field.name} style={{display:'none'}}>
                { field.value &&
                    <option selected value={field.value.id}>{ field.value.text }</option>
                }
            </select>
            <input className="form-control" autoComplete="off" id={field.name+'__xxxautocomplete'} type="text" name={field.name+'__xxxautocomplete'} defaultValue={field.value ? field.value.text : ''} data-label={field.name}/>
        </div>
    )
}

function AutocompleteMultiple(props){
    var field = props.data;
    var options = [];
    if(field.value){
        options = field.value.map((value) => (<option selected value={value.id}>{value.text}</option>));
    }

    useEffect(() => {
        autocomplete(field.name+"__xxx", field.name, true, '/api/v1/instituicoes/add/');
    });


    return (
        <div className="autocomplete">
            <div id={field.name+"__xxxboxes"}></div>
            <select className="form-control" id={field.name+'__xxx'} name={field.name} style={{display:'none'}} multiple>
                {options}
            </select>
            <input className="form-control" autoComplete="off" id={field.name+'__xxxautocomplete'} type="text" name={field.name+'__xxxautocomplete'} defaultValue={field.value.text} data-label={field.name}/>
        </div>
    )
}


function Field(props){
    var field = props.data;
    if(["text", "password"].indexOf(field.type)>=0){
        return <Input data={field}/>
    } else if(field.type == "boolean"){
        return <BooleanSelect data={field}/>
    } else if(field.type == "select"){
        if(field.choices) return <Select data={field}/>
        else if(field.multiple) return <AutocompleteMultiple data={field}/>
        else return <Autocomplete data={field}/>
    }
}

function Form(props){
    var form = props.data;
    var fields = [
        {type: 'text', name:'username', value:'admin'},
        {type: 'password', name:'password', value:null},
        {type: 'boolean', name:'casado', value:null},
        {type: 'select', name:'uf', value:null, choices:[{id: null, text: ''}, {id: 1, text: 'RN'}, {id: 2, text: 'PB'}]},
        {type: 'select', name:'tipo', value:{id: 1, text: ''}},
        {type: 'select', name:'pesquisadores_institucionais', multiple:true, value:[{id: 1, text: 'João'}]},
    ]

    function process(data, response){
        console.log(response.headers);
        window['x'] = response.headers;
        if (response.status>=400){
             showErrors(data);
        } else if (data.token){
            localStorage.setItem('token', data.token);
        }
        if(data.redirect){
            function callback(){
                if(document.querySelectorAll("dialog.opened").length>0){
                    var dialog = document.querySelector("dialog.opened");
                    dialog.close();
                    dialog.classList.remove('opened');
                    dialog.remove();
                    displayLayer('none');
                    if(window['formcallback']){
                        window['formcallback']();
                    } else {
                        if(data.redirect==document.location.pathname){
                            if(reloadable) {
                                if(data.message) showMessage(data.message);
                                filter(document.getElementById(reloadable));
                            } else {
                                if(data.message) setCookie('message', data.message);
                                document.location.reload();
                            }
                        } else {
                            if(data.message) setCookie('message', data.message);
                            document.location.href = data.redirect;
                        }
                    }
                } else {
                    if(data.message) setCookie('message', data.message);
                    document.location.href = data.redirect;
                }
            }
            if(data.task) showTask(data.task, callback);
            else callback()
        } else if (Object.keys(data).length) {
            alert(data);
        }
    }

    function submit(){
        hideMessage();
        var id = 'form';
        var form = document.getElementById(id);
        var data = new FormData(form);
        var button = form.querySelector(".btn.submit");
        var label = button.value;
        button.value = 'Aguarde...';
        form.querySelectorAll("input[type=file]").forEach(function( widget ) {
            if(widget.blob){
                data.delete(widget.name);
                data.append(widget.name, widget.blob, new Date().getTime()+'.'+'png');
            }
        });
        function callback(data, response){
            button.value = label;
            process(data, response);
        }
        if(form.method=='post') request('POST', form.action, callback, data);
        else request('GET', form.action+'?'+new URLSearchParams(new FormData(form)).toString(), callback);
    }

    return (
        <div>
            <h2>Form Title</h2>
            <div>{JSON.stringify(props.data)}</div>
            <form method="post" id="form" className="form">

                {form.fields.map((field) => (
                  <div className="form-group" key={Math.random()}>
                    <label>{field.name}</label>
                    <br/>
                    <Field data={field}/>
                    <div className={"field-error "+field.name}></div>
                    <div className="help_text">{field.help_text}</div>
                  </div>
                ))}

                <div className="right">
                    <input className="btn submit" type="button" onClick={submit} value="Enviar"/>
                </div>
            </form>
        </div>
    )
}
export default Form