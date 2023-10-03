import modal from './Modal'
import {toLabelCase, Icon} from './Utils'


function Action(props){
    var className = props.link ? "" : "action btn";
    function render(){
        if(props.modal){
            return (
                <a className={className} href={props.href} data-url={props.href} onClick={function(e){e.preventDefault();modal(e.target.closest("a").href, props.reloader);}} data-label={toLabelCase(props.label)}>
                    {props.icon && <Icon icon={props.icon}/>}
                    {props.children}
                </a>
            )
        } else {
            return (
                <a className={className} href={props.href} data-label={toLabelCase(props.label)}>{props.children}</a>
            )
        }
    }

    return render();
}

export default Action;