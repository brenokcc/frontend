import { useState, useEffect } from 'react'
import {Icon} from './Utils'

function Item(props){
    var style = {paddingLeft: ((props.level ? 25 : 25) + props.level * 10) + "px"};

    function toogle(){
        event.stopPropagation();
        event.preventDefault();
        var item = $(event.target.parentNode);
        $(event.target).find('.arrow').toggleClass('fa-chevron-down');
        $(event.target).find('.arrow').toggleClass('fa-chevron-up');
        if(item.hasClass('visible')){
            item.removeClass('visible');
        } else {
            item.addClass('visible');
        }
    }

    function render(){
        if(props.data.url){
            return (
                <li className={"level"+props.level}>
                    <a href={props.data.url} style={style}>
                        {props.data.icon && <Icon icon={props.data.icon}/>}
                        {props.data.label}
                    </a>
                </li>
            )
        } else {
            return (
                <li className={"level"+props.level}>
                    <a href="#" onClick={toogle} style={style}>
                        {props.data.icon && <Icon icon={props.data.icon}/>}
                        {props.data.label}
                        <Icon icon="chevron-down" className="arrow"/>
                    </a>
                    <ul>
                        {props.data.children.map((item) => (
                            <Item key={Math.random()} data={item} level={props.level + 1}/>
                        ))}
                    </ul>
                </li>
            )
        }
    }
    return render();
}

function Menu(props){
    var data = [
        {icon: "users", label: "Item 1", children: [
            {label: "Item 1.1", url: '/api/v1/meiopagamento/'},
            {label: "Item 1.2", children: [
                {label: "Item 1.2.1", url: '/api/v1/meiopagamento/'},
                {label: "Item 1.2.2", children: [
                    {label: "Item 1.2.2.1", url: '/api/v1/meiopagamento/'},
                    {label: "Item 1.2.2.2", url: '/api/v1/meiopagamento/'},
                ]},
            ]},
        ]}
    ]

    function render(){
        return (
            <div className="sidemenu">
                <ul>
                    {props.data.map((item) => (<Item key={Math.random()} data={item} level={0}/>))}
                </ul>
            </div>
        )
    }
    return render();
}

export default Menu;