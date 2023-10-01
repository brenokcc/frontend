var API_URL = "http://localhost:8000";
var reloadable = null;

document.addEventListener("DOMContentLoaded", function(e) {

});

function request(method, url, callback, data){
    var headers = new Headers({'Authorization': 'Basic '+localStorage.getItem('token')});
    url = url.replace(document.location.origin, '');
    if(url.indexOf(API_URL) == -1) url = API_URL + url;
    var params = {method: method, headers: headers};
    if(data) params['body'] = data;
    var httpResponse = null;
    console.log(method, url);
    fetch(url, params).then(
        function (response){
            httpResponse = response;
            return response.json()
        }
    ).then(
        data => {callback(data, httpResponse);}
    );
}

function closeDialogs(){
    var dialogs = document.getElementsByTagName('dialog');
    for(var i=0; i<dialogs.length; i++){
        var dialog = dialogs[i];
        dialog.close();
        dialog.classList.remove('opened');
        dialog.remove();
        $('.layer').hide();
        if(window.reloader) window.reloader();
    }
}

function initialize(element){
    if(!element) element = document;
    var message = getCookie('message');
    if(message){
        showMessage(message);
        setCookie('message', null);
    }
    $(element).find("a.modal").each( function(i, link) {
        link.addEventListener("click", function(){
            event.preventDefault();
            openDialog(link.href);
        });
    });
    $(element).find("input[type=file]").each(function(i, input) {
        input.addEventListener('change', function (e) {
            if (e.target.files) {
                let file = e.target.files[0];
                if(['png', 'jpeg', 'jpg', 'gif'].indexOf(file.name.toLowerCase().split('.').slice(-1)[0])<0) return;
                var reader = new FileReader();
                reader.onload = function (e) {
                    const MAX_WIDTH = 400;
                    var img = document.createElement("img");
                    img.id = input.id+'img';
                    img.style.width = 200;
                    img.style.display = 'block';
                    img.style.marginLeft = 300;
                    img.onload = function (event) {
                        const ratio = MAX_WIDTH/img.width;
                        var canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        canvas.height = canvas.width * (img.height / img.width);
                        const oc = document.createElement('canvas');
                        const octx = oc.getContext('2d');
                        oc.width = img.width * ratio;
                        oc.height = img.height * ratio;
                        octx.drawImage(img, 0, 0, oc.width, oc.height);
                        ctx.drawImage(oc, 0, 0, oc.width * ratio, oc.height * ratio, 0, 0, canvas.width, canvas.height);
                        oc.toBlob(function(blob){
                            input.blob = blob;
                        });
                        input.parentNode.appendChild(img);

                    }
                    img.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    });
    $(element).find(".async").each(function(i, div) {
        fetch(div.dataset.url).then(
            function(response){
                response.text().then(
                    function(html){
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, 'text/html');
                        var div2 = doc.getElementById(div.id)
                        div.innerHTML = div2.innerHTML;
                    }
                )
            }
        );
    });
}

function copyToClipboard(value){
    navigator.clipboard.writeText(value);
    showMessage('"'+value+'" copiado para a área de transferência!');
}

function setInnerHTML(elm, html) {
  elm.innerHTML = html;

  Array.from(elm.querySelectorAll("script"))
    .forEach( oldScriptEl => {
      const newScriptEl = document.createElement("script");

      Array.from(oldScriptEl.attributes).forEach( attr => {
        newScriptEl.setAttribute(attr.name, attr.value)
      });

      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);

      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}
function displayLayer(display){
    document.querySelector('.layer').style.display = display;
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  if(cvalue==null) exdays = 0;
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function hideMessage(){
    var feedback = document.querySelector(".feedback");
    if(feedback) feedback.style.display='none';
}
function showMessage(text, style){
    hideMessage();
    var feedback = document.querySelector(".message");
    feedback.innerHTML = text;
    feedback.style.display='block';
    if(style=='error'){
        feedback.style.backgroundColor='#e52207';
    } else if(style=='info'){
        feedback.style.backgroundColor='#61affe';
    } else {
        feedback.style.backgroundColor='#1351b4';
    }
    setTimeout(function(){feedback.style.display='none';}, 5000);
}

function showTask(key, callback){
    fetch('/api/v1/task_progress/?key='+key).then(
        function(response){
            response.text().then(
                function(text){
                    var btn = document.querySelector(".btn.submit")
                    btn.innerHTML = "Aguarde... ("+text+"%)";
                    if(text == "100"){
                        callback();
                    } else if(text != ""){
                        setTimeout(function(){showTask(key, callback)}, 3000)
                    }
                }
            )
        }
    );
}
function addParam(url, name, value, reload){
    var tokens = url.split('?');
    var url = tokens[0];
    if(tokens.length==2) var usp = new URLSearchParams(tokens[1]);
    else var usp = new URLSearchParams();
    usp.set(name, value);
    var href = url+'?'+usp.toString();
    if(reload) document.location.href = href;
    return href
}
function filter(a){
    var qs = a.closest(".qs");
    var filters = qs.querySelectorAll('.filter-select');
    var inputs = qs.querySelectorAll('.filter-input');
    var booleans = qs.querySelectorAll('.filter-bool');
    var search = qs.querySelector('.filter-search');
    var subset = qs.querySelector('.filter-subset');
    var tokens = qs.dataset.url.split('?');
    var url = tokens[0];
    if(tokens.length==2) var usp = new URLSearchParams(tokens[1]);
    else var usp = new URLSearchParams();
    if(search && search.value) usp.set("q", search.value);
    if(subset && subset.value) usp.set("subset", subset.value)
    for(var i=0; i<filters.length; i++){
        if(filters[i].selectedIndex>=0){
            var value = filters[i].options[filters[i].selectedIndex].value;
            if(value) usp.set(filters[i].id.split('__')[0], value);
            else usp.delete(filters[i].id.split('__')[0]);
        } else {
            usp.delete(filters[i].id);
        }
    }
    for(var i=0; i<inputs.length; i++){
        var value = inputs[i].value;
        if(value) usp.set(inputs[i].id, value);
        else usp.delete(inputs[i].id);
    }
    for(var i=0; i<booleans.length; i++){
        if(booleans[i].selectedIndex>=0){
            var value = booleans[i].options[booleans[i].selectedIndex].value;
            if(value) usp.set(booleans[i].id, value);
            else usp.delete(booleans[i].id);
        } else {
            usp.delete(booleans[i].id);
        }
    }
    var url = url+'?'+usp.toString();
    fetch(url, {headers: {'x-requested-with': 'XMLHttpRequest'} }).then(
        function(response){
            response.text().then(
                function(html){
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    a.closest(".qs").querySelector('.data').innerHTML = doc.querySelector('.data').innerHTML;
                    initialize(a.closest(".qs").querySelector('.data'));
                }
            );
        }
    );
}
function paginate(a){
    fetch(a.href, {headers: {'x-requested-with': 'XMLHttpRequest'} }).then(
        function(response){
            response.text().then(
                function(html){
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    var container = a.closest(".qs").querySelector('.data');
                    container.innerHTML = doc.querySelector('.data').innerHTML;
                    initialize(container);
                }
            );
        }
    );
    event.preventDefault();
    return false;
}
function checkall(selector){
    var checkboxes = selector.parentNode.parentNode.parentNode.getElementsByClassName('selector');
    for(var i=0; i<checkboxes.length; i++){
        if(checkboxes[i]!=selector) checkboxes[i].checked = selector.checked;
    }
}
function batch(a){
    var ids = [];
    var url = a.dataset.url;
    var checkboxes = a.parentNode.parentNode.getElementsByClassName('selector');
    for(var i=0; i<checkboxes.length; i++) if(checkboxes[i].checked && checkboxes[i]!=0) ids.push(checkboxes[i].value);
    if(ids.length>0){
        a.href = a.dataset.url + ids.join(',') +  '/';
        a.style.cursor='pointer';
    } else {
        a.href = 'javascript:';
        a.style.cursor='not-allowed';
    }
}