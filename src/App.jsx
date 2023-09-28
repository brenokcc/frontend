import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Form from './lib/form'
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

function App(props) {
  const [data, setdata] = useState(0);

  function x(){
    setdata((data) => data + 1);
  }

  return (
    <>
      <Welcome name="Breno Silva"/>
      <img src={viteLogo} className="logo" alt="Vite logo" />
      <img src={reactLogo} className="logo react" alt="React logo" />
      <button onClick={x}>data is {data}</button>
    </>
  )
}

export default Root
