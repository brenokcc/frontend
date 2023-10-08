import { useState } from 'react'
import {toLabelCase, Icon, TitleCase, Loading, Component} from './Utils'
import Action from './Action'

function Boxes(props){
    return (
        <div className="boxes">
            <h2><TitleCase text={props.title}/></h2>
            <div>
                {props.data.map((item) => (
                      <a key={Math.random()} href={item.url} className="item" data-label={toLabelCase(item.label)}>
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
    if(props.data){
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
                    <Action href="#" label="Realizar Capacitação">Realizar Capacitação</Action>
                    <Action href="/api/v1/user/confirmar_capacitacao/" label="Confirmar Capacitação" modal={true}>Confirmar Capacitação</Action>
                 </div>
            </div>
        </div>
    )
}
//<div>{JSON.stringify(props.data)}</div>
function Dashboard(props){
    return (
        <div className="dashboard">
            {props.data.result.capacitacao &&
                <Warning/>
            }
            {props.data.result.acesso_rapido &&
                <Boxes title="acesso_rapido" data={props.data.result.acesso_rapido}/>
            }
            {props.data.result.percentual_carga_dados &&
                <Async title="percentual_carga_dados" data={props.data.result.percentual_carga_dados}/>
            }
            {props.data.result.percentual_resolucao_inconsistencia &&
                <Indicators title="percentual_resolucao_inconsistencia" data={props.data.result.percentual_resolucao_inconsistencia}/>
            }
            {Object.keys(props.data.result).map((k) => (
                props.data.result[k].type && <Component key={Math.random()} data={props.data.result[k]} />
            ))}
        </div>
    )
}

function Async(props){
    const [data, setdata] = useState(props.data && props.data.async ? null : props.data);

    function load(){
        request('GET', props.data.async, function(data){
            setdata(data.result.percentual_carga_dados);
        });
    }

    function render(){
        if(props.data){
            if(data){
                return <Indicators title={props.title} data={data}/>
            } else {
                load();
                return <Loading/>
            }
        }
    }

    return render();
}

export default Dashboard;
