(function(){
  var b=document.querySelector('.burger'),m=document.getElementById('menu');
  function close(){m.classList.remove('open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Abrir menú');document.body.style.overflow='';}
  b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú');document.body.style.overflow=o?'hidden':'';});
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  document.getElementById('y').textContent=new Date().getFullYear();

  var f=document.getElementById('form'),err=document.getElementById('form-err');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=f.nombre,msg=f.mensaje,ok=true;
    [n,msg].forEach(function(el){var bad=!el.value.trim();el.classList.toggle('invalid',bad);el.setAttribute('aria-invalid',bad);if(bad)ok=false;});
    if(!ok){err.textContent='Escribe tu nombre y lo que necesitas cotizar.';(n.value.trim()?msg:n).focus();return;}
    err.textContent='';
    var t='Hola Promelab, quiero una cotización.\n\nNombre: '+n.value.trim()+
      (f.empresa.value.trim()?'\nEmpresa: '+f.empresa.value.trim():'')+
      '\nLínea: '+f.linea.value+'\n\nNecesito:\n'+msg.value.trim();
    window.open('https://wa.me/524499289602?text='+encodeURIComponent(t),'_blank','noopener');
  });

  if('IntersectionObserver' in window){
    var els=document.querySelectorAll('.line,.prod__card,.why li,.brandgrid li,.karal,.form,.catcard,.catfeat');
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){el.classList.add('rv');io.observe(el);});
  }
})();
