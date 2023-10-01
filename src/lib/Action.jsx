import modal from './Modal'

function Action(props){
    var className = props.link ? "action" : "action btn";
    console.log(className);
    function render(){
        if(props.modal){
            return (
                <a className={className} href={props.href} onClick={function(e){e.preventDefault();modal(props.href, props.reloader);}}>
                    {props.children}
                </a>
            )
        } else {
            return (
                <a className={className} href={props.href}>{props.children}</a>
            )
        }
    }

    return render();
}

export default Action;