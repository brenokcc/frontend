import { useState, useEffect } from 'react'
import {modal, imodal} from './Modal';
import {Form, Filter} from './Form'
import QuerySet from './QuerySet'
import Viewer from './Viewer'
import Statistics from './Statistics'
import Action from './Action'

var i18n = null

function toLabelCase(text){
    if(text!=null) text = toTitleCase(text.toString().replace('-', '')).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('_', '').toLowerCase();
    return text;
}

function toTitleCase(text){
    if(text!=null){
        text = text.toString().replace (/^[-_]*(.)/, (_, c) => c.toUpperCase()).replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
        if(true || i18n==null){
            const application = JSON.parse(localStorage.getItem('application'));
            i18n = application.i18n || {};
        }
        text = i18n[text] || text;
    }
    return text
}

function TitleCase(props){
    if(props.text){
        return <span>{toTitleCase(props.text)}</span>
    }
    return <span></span>
}

function Format(obj){
    if(obj===null) return '-';
    if(obj==="") return '-';
    if(obj===true) return 'Sim';
    if(obj===false) return 'Não';
    if(typeof obj === "number"){
        var tokens = obj.toString().split('.')
        if(tokens.length==1){
            return obj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else {
            tokens[0] = tokens[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            tokens[1] = tokens[1].substring(0, 2);
            if(tokens[1].length==1) tokens[1] = tokens[1] + "0";
            return tokens[0]+","+tokens[1];
        }
    }
    if(typeof obj === "string"){
        if(obj.length==19 && obj[13]==':' && obj[16]==':'){
            var tokens = obj.split('T');
            var data = tokens[0].split('-');
            var hora = tokens[1];
            var date = new Date(data[0], data[1]-1, data[2]).toLocaleDateString();
            if(hora=='00:00:00') return date;
            else return date + ' ' + hora.substr(0, 5);
        }
        return obj
    }
    if(typeof obj == "object" && Array.isArray(obj)){
        return obj.join(", ")
    }
    if(typeof obj == "object" && JSON.stringify(Object.keys(obj))==JSON.stringify(['id', 'text'])){
        return obj.text;
    }
    return JSON.stringify(obj);
}

function Value(props){
    if(props.obj == null){
        return '-';
    }
    if(props.obj.type){
        if(props.obj.type=="queryset"){
            return (
                <ul>
                    {props.obj.results.map((item) => (
                      <li key={Math.random()}>{Format(item)}</li>
                    ))}
                </ul>
            )
        } else {
            return <Component data={props.obj}/>
        }
    }
    if(typeof props.obj == "object" && Array.isArray(props.obj)){
        return (
            <ul>
                {props.obj.map((item) => (
                  <li key={Math.random()}>{Format(item)}</li>
                ))}
            </ul>
        )
    }
    if(typeof props.obj == "object" && !Array.isArray(props.obj)){
        if(JSON.stringify(Object.keys(props.obj))==JSON.stringify(['id', 'text'])) return props.obj.text;
        return (
            <div className="valueset">
                {Object.keys(props.obj).map((k)  => (
                  <dl key={Math.random()}>
                        <dt><TitleCase text={k}/></dt>
                        <dd>{Format(props.obj[k])}</dd>
                  </dl>
                ))}
            </div>
        )
    }
    if(typeof props.obj === "string" && props.obj.length == 7 && props.obj[0] == "#"){
        return <div className="color" style={{ backgroundColor: props.obj }}></div>
    }
    return Format(props.obj)
}

function ClearFix(){
    return (
        <div className="clear"></div>
    )
}

function Message(props){
    return (
        <div className="message">
            <Icon icon="info-circle"/>
             <div className="text">
                {props.text}
             </div>
        </div>
    )
}

function Loading(props){
    return (
        <div className="loading">
            <i className="fa-solid fa-circle-notch fa-spin fa-3x"></i>
        </div>
    )
}

function Fieldset(props){
    return (
        <div className="fieldset">
            <h2 data-label={toLabelCase(props.data.title)}><TitleCase text={props.data.title}/></h2>
            <div className="fields">
                {Object.keys(props.data.fields).map((k) => (
                    <div key={Math.random()} className="field">
                        <label><TitleCase text={k}/></label>
                        <div><Value obj={props.data.fields[k]}/></div>
                    </div>
                 ))}
            </div>
        </div>
    )
}

function Subsets(props){
    var subsets = [];
    var style = "subset";
    var active = props.count ? 'all' : null;
    function render(){
        if(props.data){
            props.data.map((subset) => {
                if(props.active==subset.name || active==null) active = subset.name;
            })
            if(props.count!=null){
                if(active=='all') style = "subset active"
                subsets.push({k:'all', v:props.data.count, style:style, label: "Tudo"});
            }
            {props.data.map((subset) => {
                style = "subset";
                if(subset.name==active) style = "subset active"
                subsets.push({k:subset.name, v:subset.count, style:style, label: subset.label});
            })}
            return (
                <div className="subsets">
                    <input type="hidden" name="subset" defaultValue={active}/>
                    {subsets.map((subset) => (
                      <div className={subset.style} key={Math.random()} onClick={function(){props.onChange(subset.k)}} data-label={toLabelCase(subset.label)}>
                        <TitleCase text={subset.label}/> <span className="counter">{subset.v}</span>
                      </div>
                    ))}
                </div>
            )
        }
    }
    return render()
}

function Flags(props){
    function render(){
        if(props.data){
            return (
                <div className="flags">
                    {props.data.map((flag) => (
                        <div key={Math.random()} className="flag">
                             <input type="checkbox" name={flag.name} onChange={props.onChange} checked={flag.checked}/>
                             <label>{flag.label}</label>
                        </div>
                    ))}
                </div>
            )
        }
    }
    return render();
}

function Actions(props){

    function trigger(name){
        var link = event.target;
        var form = $(link).closest('form');
        form.find('input[name=action]').val(name);
        var params = form.serialize();
        form.find('input[name=action]').val('');
        var span = document.createElement("span");
        var icon = document.createElement("i");
        link.innerHTML = '';
        span.innerHTML = "Aguarde...";
        icon.classList.add("fa-solid");
        icon.classList.add("fa-circle-notch");
        icon.classList.add("fa-spin");
        link.appendChild(icon);
        link.appendChild(span);
        request('GET', document.location.pathname+'?'+params, function(result){
            if(result.task){
                function showTask(key, callback){
                    request('GET', '/api/v1/task_progress/?raw=&key='+key, function(data, response){
                        if(data.error!=null){
                            showMessage(data.error, 'danger')
                        } else if(data.progress!=null) {
                            span.innerHTML = "Aguarde... "+data.progress+"%";
                            if(data.progress == 100){
                                showMessage(result.message);
                                callback();
                            } else {
                                setTimeout(function(){showTask(key, callback)}, 3000)
                            }
                        } else {
                            callback()
                        }
                    });
                }
                showTask(result.task, props.reload);
            } else {
                showMessage(result.message);
                props.reload();
            }
        });

    }

    function render(){
        return (
            <div className="batchActions">
                {!props.auxiliar && <input type="hidden" name="action"/>}
                {props.data.map((action) =>  (
                  <button key={Math.random()} type="button" className="btn primary" onClick={function(){trigger(action.name)}} data-label={toLabelCase(action.label)}>
                    <Icon icon={action.icon}/>
                    {action.label}
                  </button>
                ))}
            </div>
        )
    }
    return render()
}

function Table(props){
    const [data, setdata] = useState(props.data);
    const key = "table";

    function subset(k){
        var input = $(event.target).closest('form').find('input[name=page]');
        input.val(1);
        $('#table form input[name=subset]').val(k);
        reload();
    }

    function select(){
        $('#table form input[name=id]').prop('checked', event.target.checked);
    }

    function reload(){
        var params = $('#table form').serialize();
        request('GET', document.location.pathname+'?'+params, function(data){
            setdata(data);
        });
    }

    useEffect(()=>{}, [])

    function render(){
        return (
            <div id="table" className="table-wrapper">
                <h1>Inconsistências</h1>
                <form onKeyDown={function(){if(event.key == 'Enter') event.preventDefault();}}>
                    <Subsets data={data.subsets} active={data.subset} onChange={subset}/>
                    <Filter data={data.filters} onfilter={reload}/>
                    <Flags data={data.flags} onChange={reload}/>
                    <ClearFix/>
                    <Pagination data={data.pagination} onChange={reload}/>
                    <ClearFix/>
                    <Actions data={data.actions} reload={reload}/>
                    <ClearFix/>
                    {table()}
                    <ClearFix/>
                    <Actions data={data.actions} reload={reload} auxiliar={true}/>
                    <ClearFix/>
                    <Pagination data={data.pagination} onChange={reload} auxiliar={true}/>
                    <ClearFix/>
                </form>
            </div>
        )
    }

    function table(){
        if(data.rows.length>0){
            //return <div>{JSON.stringify(data.rows[0])}</div>
            return (
                <div className="responsive">
                    <table className="table">
                        <thead>
                            <tr>
                            {data.rows[0].map((col, i)  => (
                              <th key={Math.random()} style={{padding: i==0 ? 15 : 10 }}>
                                {i==0 && <input type="checkbox" name="id" value="0" onChange={select}/>}
                                {i!=0 && <TitleCase text={col.name}/>}
                              </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.rows.map((row, i)  => (
                                <Row key={Math.random()} data={row} reloader={reload}/>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return <Message text="Nenhum registro encontrado"/>
        }
    }

    return render()
}

function Row(props){
    const [data, setdata] = useState(props.data);

    function reload(pk){
        var params = $('#table form').serialize();
        request('GET', document.location.pathname+'?'+params+'&pk='+pk, function(data){
            setdata(data['rows'][0]);
        });
    }

    function open(pk, url){
        if(url && event.target.tagName != "I"){
            event.preventDefault();
            modal(url, function(){reload(pk)});
        }
    }

    function render(){
        const pk = data[0].value;
        return (
            <tr>
                {data.map((col, j)  => (
                  <td key={Math.random()} onClick={function(){open(pk, col.url);}} className={(col.url ? "clickable " : "")+(col.style || "")+ " "+(j!=0 && j!=data.length-1  && data[0].deleted ? "inactive" : "active")}>
                    {j==0 && col.checkable && <input type="checkbox" name="id" value={pk}/>}
                    {j!=0 && <div>{col.value!=null && <Value obj={col.value}/>}&nbsp;</div>}
                    {col.actions!=null &&
                        <center>
                            {col.actions.map((action) => (
                                <Action key={Math.random()} href={action.url} label={action.name} icon={action.icon} modal={true} reloader={function(){reload(pk);}}>{action.name}</Action>
                            ))}
                        </center>
                    }
                  </td>
                ))}
            </tr>
        )
    }

    return render()
}

function Pagination(props){
    var total = props.data.total;
    var page = props.data.page;
    var size = props.data.size;
    var sizes = props.data.sizes;
    var start = ((page-1) * size) + 1;
    var end = start + size - 1;

    function paginate(n, size){
        var input = $(event.target).closest('form').find('input[name=page]');
        input.val(parseInt(input.val())+n);
        $(event.target).closest('form').find('input[name=size]').val(size);
        if(props.onChange) props.onChange();
    }

    if(1 || total > 10){
        return (
            <div className="pagination">
                {!props.auxiliar && <input type="hidden" name="page" defaultValue={page}/>}
                {!props.auxiliar && <input type="hidden" name="size" defaultValue={size}/>}
                <div className="left">
                    Exibir
                    <select onChange={function(){paginate(0, $(event.target).val())}} value={size}>
                        {sizes.map((n) => (
                            <option value={n} key={Math.random()}>{n}</option>
                        ))}
                    </select>
                    | {start}-{end} de {total} itens
                </div>
                <div className="right">
                    {start > 1 && <Icon icon="chevron-left" onClick={function(){paginate(-1, size)}}/>}
                    Página {page}
                    {end < total && <Icon icon="chevron-right" onClick={function(){paginate(+1, size)}}/>}
                </div>
            </div>
        )
    }
}

function File(props){
    return <a target="_blank" href={API_URL+props.data.url}>{props.data.name}</a>
}


function Component(props){
    function render(){
        switch(props.data.type) {
            case 'form':
                return <Form data={props.data}/>
            case 'queryset':
                return <QuerySet data={props.data} reloader={props.reloader}/>
            case 'fieldset':
                return <Fieldset data={props.data}/>
             case 'instance':
                return <Viewer data={props.data} reloader={props.reloader}/>
             case 'statistics':
                return <Statistics data={props.data}/>
             case 'info':
                return <Info data={props.data}/>
             case 'indicators':
                return <Indicators data={props.data}/>
             case 'file':
                return <File data={props.data}/>
             case 'boxes':
                return <Boxes data={props.data}/>
             case 'warning':
                return <Warning data={props.data}/>
             case 'async':
                return <Async data={props.data}/>
             case 'icons':
                return <Icons data={props.data}/>
             case 'table':
                return <Table data={props.data}/>
             case 'progress':
                return <Progress data={props.data}/>
             case 'status':
                return <Status data={props.data}/>
             case 'badge':
                return <Badge data={props.data}/>
             case 'qrcode':
                return <QrCode data={props.data}/>
             case 'link':
                return <Link data={props.data}/>
             case 'image':
                return <Image data={props.data}/>
             case 'banner':
                return <Banner data={props.data}/>
             case 'map':
                return <Map data={props.data}/>
             case 'steps':
                return <Steps data={props.data}/>
             case 'html':
                return <Html data={props.data}/>
            default:
              return <Unknown data={props.data}/>
        }
    }
    return render()
}

function Banner(props){
    return <img src={props.data.src} style={{ width: "100%" }}/>
}

function Image(props){
    return (
        <div style={{ width: "100%", textAlign: "center"}}>
            <img src={props.data.src} style={{ width: props.data.width }}/>
        </div>
    )
}

function Map(props){
    return (
        <iframe width={props.data.width||"100%"} height={props.data.height||"400px"} id="gmap_canvas"
            src={"https://maps.google.com/maps?q="+props.data.latitude+","+props.data.longitude+"&t=&z=13&ie=UTF8&iwloc=&output=embed"}
            frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
        </iframe>
    )
}

function Steps(props){

    function icon(step){
        if(props.data.icon){
            return step.done ? <Icon icon={props.data.icon}/> : <span>&nbsp;</span>;
        } else {
            return <span>{step.number}</span>;
        }
    }
    return (
        <div className="steps-wrapper">
            <ul className="steps">
                {props.data.steps.map((step) => (
                      <li key={Math.random()} className="step">
                        <div className={"icon "+(step.done ? "active" : "inactive")}>
                            {icon(step)}
                        </div>
                        <div className="text">{step.name}</div>
                      </li>
                ))}
            </ul>
        </div>
    )
}

function Html(props){
    return <div dangerouslySetInnerHTML={{__html: props.data.content}}></div>
}


function Content(props){

    useEffect(()=>{
        $('.dialog').css('position', 'absolute').css('top', (document.documentElement.scrollTop || document.body.scrollTop) + 50);
    }, [])

    return (
        <div className="content">
            <Component data={props.data}/>
        </div>
    )
}

function Boxes(props){
    function render(){
        return props.data.items.length ? (
            <div className="boxes">
                <h2>{props.data.title}</h2>
                <div>
                    {props.data.items.map((item) => (
                          <a key={Math.random()} href={item.url} className="item" data-label={toLabelCase(item.label)}>
                            <div className={"icon "+(item.style || "primary")}>
                                <Icon icon={item.icon}/>
                            </div>
                            <div className={"text "+(item.style || "primary")}>
                                {item.label}
                            </div>
                          </a>
                    ))}
                </div>
            </div>
        ) : null;
    }
    return render();
}

function Link(props){
    function content(){
        if(props.data.icon) return props.data.url ? <Icon icon={props.data.icon}/> : "-";
        else return props.data.url ? props.data.url : "-";
    }

    function onClick(){
        imodal(props.data.url);
        event.preventDefault();
    }

    function render(){
        return (
            <a href={props.data.url} target={props.data.target} onClick={onClick}>
                {content()}
            </a>
        )
    }
    return render();
}

function QrCode(props){
    const key = Math.random();

    useEffect(()=>{
        var qrcode = new QRCode(document.getElementById(key), {
            text: props.data.text,
            width: 128,
            height: 128,
            colorDark : "#333333",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }, [])

    function render(){
        return <div id={key}></div>
    }
    return render();
}


function Indicators(props){
    if(props.data){
        return (
            <div className="indicators">
                <h2><TitleCase text={props.data.title}/></h2>
                <div>
                    {props.data.items.map((item) => (
                        <div key={Math.random()} className="item">
                            <div className="value">
                                {Format(item.value)}
                            </div>
                            <div className="text">
                                <TitleCase text={item.name}/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="actions">
                    {props.data.actions.map((action)  => (
                        <Action key={Math.random()} href={action.url} label={action.label} modal={action.modal}>{action.label}</Action>
                    ))}
                 </div>
            </div>
        )
    }
}

function Async(props){
    const [data, setdata] = useState();

    function load(){
        request('GET', props.data.url, function(data){
            setdata(data);
        });
    }

    function render(){
        if(data==null){
            load();
            return <Loading/>
        } else {
            return <Component data={data}/>
        }
    }
    return render();
}

function Warning(props){
    function render(){
        return (
            <div className="alert warning">
                <div className="icon">
                    <Icon icon="warning"/>
                </div>
                <div className="detail">
                     <div className="text">
                        <p><strong>{props.data.title}:</strong> {props.data.message}</p>
                     </div>
                     <div className="actions">
                        {props.data.actions.map((action)  => (
                            <Action key={Math.random()} href={action.url} label={action.label} modal={action.modal} icon={action.icon} button={true}>{action.label}</Action>
                        ))}
                     </div>
                </div>
            </div>
        )
    }
    return render();
}

function Info(props){
    function render(){
        return (
            <div className="info">
                <div className="icon">
                    <Icon icon="info"/>
                </div>
                <div className="detail">
                     <div className="text">
                        <p><strong>{props.data.title}:</strong> {props.data.message}</p>
                     </div>
                     <div className="actions">
                        {props.data.actions.map((action)  => (
                            <Action href={action.url} label={action.label} modal={action.modal}>{action.label}</Action>
                        ))}
                     </div>
                </div>
            </div>
        )
    }
    return render();
}

function Unknown(props){
    if(typeof props.data == "object" && Array.isArray(props.data)){
        return (
            <>
                {props.data.map((data)  => (
                  <Component key={Math.random()} data={data}/>
                ))}
            </>
        )
    } else if(typeof props.data == "object" && !Array.isArray(props.data)){
        return (
            <>
                {Object.keys(props.data).map((k)  => (
                    <Component key={Math.random()} data={props.data[k]}/>
                ))}
            </>
        )
    } else {
        return <div>{JSON.stringify(props.data)}</div>
    }
}

function Icons(props){

    function click(icon){
        copyToClipboard(icon);
    }

    return (
        <div className="icons">
            {props.data.icons.map((icon) => (
                <div className="icon-box" key={Math.random()} onClick={()=>click(icon)}>
                    <i className={"fa-solid fa-fw fa-"+icon}></i>
                    <div className="icon-text">{icon}</div>
                </div>
            ))}
        </div>
    )
}

function Icon(props){
    var className = "fa-solid fa-"+props.icon;
    if(props.className) className += ' '+props.className
    if(props.onClick || props.clickable) className += " clickable";
    return (
        <i className={className} onClick={props.onClick}></i>
    )
}

function Accordion(props){

    const [expanded, expand] = useState(props.expanded || true);

    function icon(){
        return expanded ? "chevron-up" : "chevron-down";
    }

    function click(){
        expand(!expanded);
    }

    return (
        <div className="accordion">
            <div className="accordionTitle" onClick={click}>
                <div className="left">
                    {props.title}
                </div>
                <div className="right">
                    <Icon icon={icon()}/>
                </div>
            </div>
            <ClearFix/>
            {expanded && <div className="accordionBody">
                {props.children}
            </div>}
        </div>
    )
}


function Progress(props){
    function render(){
        return (
            <span className="progress ">
                <span style={{ width: props.data.value+'%' }} className={"value "+(props.data.style || "primary")}>
                    <span className="percentage">
                        { props.data.value }%
                    </span>
                </span>
            </span>
        )
    }
    return render();
}


function Status(props){
    function render(){
        return (
            <div className="status">
                <div className={"color "+props.data.style}></div>
                <div className="text">{props.data.label}</div>
            </div>
        )
    }
    return render();
}

function Badge(props){
    const style = props.data.color[0] == "#" ? {backgroundColor: props.data.color} : {}
    const className = props.data.color[0] != "#" ? props.data.color : ""
    function render(){
        return (
            <div className={"badge "+className} style={style}>{props.data.label}</div>
        )
    }
    return render();
}


export {toLabelCase, toTitleCase, TitleCase, Value, ClearFix, Message, Loading, Content, Icon, Accordion, Component, Subsets};
export default Loading;