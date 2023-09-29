import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Form from './lib/Form'
import './App.css'

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function Dispatcher(props){
    if(props.data.type == "form") return Form(props);
    else return Unknown(props)
}

function Unknown(props){
    return <div>{JSON.stringify(props.data)}</div>
}

function Root(props){
    const itens = [{name: "item1", id: 1}, {name: "item2", id: 2}, {name: "item3", id: 3}];
    return (
        <>
          <Welcome name="Breno Silva"/>
          <HealthCheck/>
          <div className="feedback"></div>
          <Dispatcher data={props.data}/>

          {props.data.status == "UP" &&
            <div>O serviço está funcionando</div>
          }

          {((x) => {
            if (x==1) {
              return (
                <div>1</div>
              )
            } else if (x==2) {
              return (
                <div>2</div>
              )
            } else {
              return (
                <div>3</div>
              )
            }
          })(3)}

          <div>
            {itens.map((item) => (
              <p key={Math.random()}>{item.id}: {item.name}</p>
            ))}
          </div>

        </>
    )
}

function HealthCheck(props){
    const [data, setdata] = useState();
    const [key, setkey] = useState(0);

    function reload(){
        request('GET', '/api/v1/health/check/', function(data){
            setdata(JSON.stringify(data));
            setkey(key+1);
        });
    }

    return (
        <div key={key}>
            {!data && "Carregando..."}
            {data && <div>{data}</div>}

            <button onClick={reload}>Carregar</button>
            <Stateless reload={reload}/>
            <Statefull reload={reload} data={{time: 'NONE'}}/>
        </div>
    )

}

function Stateless(props){
    return (
        <h2 onClick={props.reload}>:)</h2>
    )
}

function Statefull(props){
    const [data, setdata] = useState(props.data);
    function reload(){
        request('GET', '/api/v1/health/check/', function(data){
            setdata(data);
        });
    }
    return (
        <h2 onClick={reload}>:D {data.time}</h2>
    )
}


function App(props) {
  const [data, setdata] = useState(0);

  function x(){
    setdata(function(data){return data+=1});
  }
  return (
    <>
      <img src={viteLogo} className="logo" alt="Vite logo" />
      <img src={reactLogo} className="logo react" alt="React logo" />
      <button onClick={x}>data is {data}</button>
    </>
  )
}

export default Root
