import {Icon, TitleCase} from './Utils'

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

function Dashboard(props){
    return (
        <>
        <div>{JSON.stringify(props.data)}</div>
        <Boxes title="acesso_rapido" data={props.data.result.acesso_rapido}/>
        <Indicators title="percentual_resolucao_inconsistencia" data={props.data.result.percentual_resolucao_inconsistencia}/>
        </>
    )
}

export default Dashboard;
