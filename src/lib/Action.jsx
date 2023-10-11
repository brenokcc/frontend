import modal from './Modal';
import {toLabelCase, Icon} from './Utils';


function Action(props){

    function onClick(e){
        if(props.modal){
            e.preventDefault();
            modal(e.target.closest("a").href, props.reloader);
            if(props.onClick) props.onClick();
        }
    }

    function render(){
        var compact = props.icon && !props.button;
        var className = props.link || compact ? "" : "action btn";
        return (
            <a className={className} href={props.href} data-label={toLabelCase(props.label)} data-url={props.href} onClick={onClick}>
                {props.icon && <Icon icon={props.icon} clickable={true && !props.button}/>}
                {!compact && props.children}
            </a>
        )
    }

    return render();
}

export default Action;