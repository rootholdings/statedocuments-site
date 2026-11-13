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
  /* Sortable comparison tables */
  var tb=d.querySelectorAll('table[data-sortable]');
  for(var t=0;t<tb.length;t++){(function(tbl){
    var heads=tbl.querySelectorAll('thead th'), body=tbl.tBodies[0];
    for(var h=0;h<heads.length;h++){(function(th,col){
      var b=th.querySelector('button'); if(!b) return;
      th.setAttribute('aria-sort','none');
      b.addEventListener('click',function(){
        var asc=th.getAttribute('aria-sort')!=='ascending', num=th.getAttribute('data-type')==='num';
        for(var z=0;z<heads.length;z++) heads[z].setAttribute('aria-sort','none');
        th.setAttribute('aria-sort',asc?'ascending':'descending');
        var rows=Array.prototype.slice.call(body.rows);
        rows.sort(function(a,c){
          var x=a.cells[col].getAttribute('data-sort')||'', y=c.cells[col].getAttribute('data-sort')||'';
          if(x===''&&y==='') return 0; if(x==='') return 1; if(y==='') return -1;
          var r=num?(parseFloat(x)-parseFloat(y)):x.localeCompare(y);
          return asc?r:-r;
        });
        for(var q=0;q<rows.length;q++) body.appendChild(rows[q]);
      });
    })(heads[h],h);}
  })(tb[t]);}
  /* Comparison table filters (text + confirmed/unknown) */
  var cc=d.querySelectorAll('[data-cmpctl]');
  for(var u=0;u<cc.length;u++){(function(w){
    var tbl=d.getElementById(w.getAttribute('data-cmpctl')); if(!tbl) return;
    w.hidden=false;
    var inp=w.querySelector('input'), sel=w.querySelector('select'), out=w.querySelector('[data-count]');
    var rows=tbl.tBodies[0].rows;
    function apply(){
      var q=inp.value.trim().toLowerCase(), m=sel.value, shown=0;
      for(var k=0;k<rows.length;k++){
        var r=rows[k], kn=r.getAttribute('data-known')==='1';
        var ok=(!q||(r.getAttribute('data-name')||'').toLowerCase().indexOf(q)!==-1)&&(m==='all'||(m==='known'?kn:!kn));
        r.hidden=!ok; if(ok) shown++;
      }
      out.textContent='Showing '+shown+' of '+rows.length+'.';
    }
    inp.addEventListener('input',apply); sel.addEventListener('change',apply); apply();
  })(cc[u]);}
  /* "Which document do I need?" helper: static data embedded in the page, no network, no storage */
  var hp=d.querySelector('[data-helper]'), hd=d.getElementById('helper-data');
  if(hp&&hd){
    var D=JSON.parse(hd.textContent); hp.hidden=false;
    var g=d.getElementById('h-goal'), s=d.getElementById('h-state'), k=d.getElementById('h-country'), crow=hp.querySelector('[data-hcountry]'), out=d.getElementById('h-out');
    var CHK='Check the official page.';
    function el(tag,cls,txt){var e=d.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e;}
    function a(href,txt,ext){var e=el('a',ext?'ext':null,txt); e.href=href; if(ext) e.rel='noopener'; return e;}
    function facts(list){var dl=el('dl','hfacts'); for(var i=0;i<list.length;i++){dl.appendChild(el('dt',null,list[i][0])); dl.appendChild(el('dd',list[i][1]?null:'unk',list[i][1]||CHK));} return dl;}
    function links(list){var ul=el('ul','hlinks'); for(var i=0;i<list.length;i++){var li=el('li'); li.appendChild(a(list[i][0],list[i][1],list[i][2])); ul.appendChild(li);} return ul;}
    function render(){
      var gv=g.value, sv=s.value; crow.hidden=gv!=='abroad';
      while(out.firstChild) out.removeChild(out.firstChild);
      if(!gv||!sv){ out.appendChild(el('p','small','Choose a goal and a state to see your starting point.')); return; }
      var S=D.states[sv], box=el('div','hres'), h=el('h2'), L=[], F=[];
      if(gv==='abroad'){
        var C=null; for(var i=0;i<D.countries.length;i++) if(D.countries[i].s===k.value) C=D.countries[i];
        var CT=C?(C.the.charAt(0).toUpperCase()+C.the.slice(1)):'';
        h.textContent=(C&&!C.h)?'Authentication for '+C.the+': start with the '+S.apo.office:'Apostille: start with the '+S.apo.office;
        box.appendChild(h);
        if(C){ box.appendChild(el('p',null, C.h ? (CT+' is a party to the Hague Apostille Convention (in force since '+C.eif+', per the HCCH status table). A '+S.n+' document generally needs an apostille from the office below.') : (CT+' was not listed as a party to the Hague Apostille Convention on the HCCH status table when we checked. Ask the office below for an authentication; further certification by the U.S. Department of State, the embassy, or both may follow.'))); }
        else box.appendChild(el('p',null,'If the country is in the Hague Apostille Convention, you need an apostille; otherwise an authentication. The office below handles both for '+S.n+' documents.'));
        F=[['Office',S.apo.office],['Fee',S.apo.fee],['Processing time',S.apo.time],['How to submit',S.apo.how]];
        L=[[S.apo.page,'Our '+S.n+' apostille guide'],[S.apo.off,'Official apostille page',1]];
        if(C) L.push([C.page,'Our page for '+C.the]);
        L.push(['../apostille/hague-vs-non-hague/index.html','Hague vs. non-Hague countries']);
        box.appendChild(facts(F)); box.appendChild(links(L));
        var fp=el('p','small','Federal documents, such as FBI background checks, go to the U.S. Department of State instead: '); fp.appendChild(a(D.fed,'travel.state.gov',1)); box.appendChild(fp);
      } else if(gv==='llc'||gv==='ar'||gv==='gs'){
        var lab={llc:['Form an LLC in '+S.n,'LLC formation fee',S.bz.llc,'../compare/llc-formation-fees/index.html'],ar:['Annual report in '+S.n,'Report requirement and fee',S.bz.ar,'../compare/annual-report-fees/index.html'],gs:['Certificate of good standing in '+S.n,'Good standing fee',S.bz.gs,'../compare/good-standing-fees/index.html']}[gv];
        h.textContent=lab[0]; box.appendChild(h);
        box.appendChild(el('p',null,'File directly with the '+S.bz.office+'. The fee goes to the state.'));
        F=[['Office',S.bz.office],[lab[1],lab[2]],['Processing time',S.bz.time]];
        box.appendChild(facts(F));
        box.appendChild(links([[S.bz.page,'Our '+S.n+' business filing guide'],[S.bz.off,'Official business filing site',1],[lab[3],'Compare all states']]));
      } else if(gv==='vital'){
        h.textContent='Vital records in '+S.n; box.appendChild(h);
        box.appendChild(el('p',null,'Order certified copies from the vital records office of the state where the birth, death or marriage happened. Some states also let county offices issue copies. Fees vary; we do not list them.'));
        box.appendChild(facts([['Fee',null],['Processing time',null]]));
        box.appendChild(links([[S.vr,'Official '+S.n+' vital records page',1],['../vital-records/index.html','How certified copies work'],[S.sp,'All '+S.n+' offices']]));
      } else {
        h.textContent='Court records in '+S.n; box.appendChild(h);
        box.appendChild(el('p',null,'Court records come from the clerk of the court that handled the case. The state judicial branch site explains which courts exist and how to search or request copies.'));
        box.appendChild(links([[S.ct,'Official '+S.n+' judicial branch site',1],['../court-records/index.html','How court records work'],[S.sp,'All '+S.n+' offices']]));
      }
      box.appendChild(el('p','small','Facts checked '+D.asof+'. "Check the official page" means we could not confirm it. The official page is always the authority.'));
      out.appendChild(box);
    }
    g.addEventListener('change',render); s.addEventListener('change',render); k.addEventListener('change',render); render();
  }
})();
