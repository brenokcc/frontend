import { useState } from 'react'
import {Icon, TitleCase, Loading} from './Utils'
import Action from './Action'

function Boxes(props){
    return (
        <div className="boxes">
            <h2><TitleCase text={props.title}/></h2>
            <div>
                {props.data.map((item) => (
                      <a key={Math.random()} href={item.url} className="item">
                        <div className="icon">
                            <Icon icon={item.icon}/>
                        </div>
                        <div className="text">
                            {item.label}
                        </div>
                      </a>
                ))}
            </div>
        </div>
    )
}

function Indicators(props){
    return (
        <div className="indicators">
            <h2><TitleCase text={props.title}/></h2>
            <div>
                {Object.keys(props.data).map((k) => (
                    <div key={Math.random()} className="item">
                        <div className="value">
                            {props.data[k]}
                        </div>
                        <div className="text">
                            <TitleCase text={k}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Warning(props){
    return (
        <div className="warning">
            <div className="icon">
                <Icon icon="warning"/>
            </div>
            <div className="detail">
                 <div className="text">
                    <strong>Atenção</strong>
                    A conclusão de sua capacitação ainda não foi registrada na plataforma! Algumas funcionalidades tais como correção e monitoramento de correção de inconsistências só estarão disponíveis após a realização da capacitação
                 </div>
                 <div className="actions">
                    <Action href="#">Realizar Capacitação</Action>
                    <Action href="#">Confirmar Capacitação</Action>
                 </div>
            </div>
        </div>
    )
}
//<div>{JSON.stringify(props.data)}</div>
function Dashboard(props){
    return (
        <>
        <Warning/>
        <Boxes title="acesso_rapido" data={props.data.result.acesso_rapido}/>
        <Async title="percentual_carga_dados" data={props.data.result.percentual_carga_dados}/>
        <Indicators title="percentual_resolucao_inconsistencia" data={props.data.result.percentual_resolucao_inconsistencia}/>
        </>
    )
}

function Async(props){
    const [data, setdata] = useState(props.data.async ? null : props.data);

    function load(){
        request('GET', props.data.async, function(data){
            setdata(data.result.percentual_carga_dados);
        });
    }

    function render(){
        if(data){
            return <Indicators title={props.title} data={data}/>
        } else {
            load();
            return <Loading/>
        }
    }

    return render();
}

export default Dashboard;
