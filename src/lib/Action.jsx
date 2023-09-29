import modal from './Modal'

function Action(props){
    function render(){
        if(props.modal){
            return (
                <a className="action" href={props.href} onClick={function(e){e.preventDefault();modal(props.href, props.reloader);}}>
                    {props.children}
                </a>
            )
        } else {
            return (
                <a className="action" href={props.href}>{props.children}</a>
            )
        }
    }

    return render();
}

export default Action;