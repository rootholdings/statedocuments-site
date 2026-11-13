/* StateDocuments.com: tiny progressive enhancements. No network calls, no cookies, no storage. */
(function(){
  var d=document;
  var b=d.querySelector('.navtoggle'), n=d.getElementById('mainnav');
  if(b&&n){
    b.hidden=false;
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      b.setAttribute('aria-expanded',open?'false':'true');
      n.classList.toggle('open',!open);
    });
  }
  var pk=d.querySelectorAll('[data-picker]');
  for(var i=0;i<pk.length;i++){(function(p){
    p.hidden=false;
    var s=p.querySelector('select'), g=p.querySelector('button');
    function go(){ if(s.value){ window.location.href=s.value; } else { s.focus(); } }
    g.addEventListener('click',go);
    s.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); go(); } });
  })(pk[i]);}
  var fw=d.querySelectorAll('[data-filterwrap]');
  for(var j=0;j<fw.length;j++){(function(w){
    w.hidden=false;
    var inp=w.querySelector('input'), id=inp.getAttribute('data-filter');
    var box=d.getElementById(id), msg=w.querySelector('[data-nomatch]');
    if(!box) return;
    var items=box.querySelectorAll(box.tagName==='TABLE'?'tbody tr':'li');
    inp.addEventListener('input',function(){
      var q=inp.value.trim().toLowerCase(), shown=0;
      for(var k=0;k<items.length;k++){
        var t=(items[k].getAttribute('data-name')||items[k].textContent).toLowerCase();
        var ok=!q||t.indexOf(q)!==-1;
        items[k].hidden=!ok; if(ok) shown++;
      }
      if(msg) msg.hidden=shown>0;
    });
  })(fw[j]);}
})();
