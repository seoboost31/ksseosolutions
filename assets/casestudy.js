(function(){
  var root=document.querySelector('[data-cs]'); if(!root) return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track=root.querySelector('.cs-track'),slides=[].slice.call(root.querySelectorAll('.cs-slide')),tabs=[].slice.call(root.querySelectorAll('.cs-tab')),dotsBox=root.querySelector('.cs-dots'),bar=root.querySelector('.cs-progress span');
  var n=slides.length,idx=0,timer=null,flip=null,paused=false,visible=false,DUR=9000;
  var dots=slides.map(function(_,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Go to case study '+(i+1));b.addEventListener('click',function(){go(i,true)});dotsBox.appendChild(b);return b});
  function fmt(v,sep){return sep?String(v).replace(/\B(?=(\d{3})+(?!\d))/g,','):String(v)}
  function counters(s){
    [].forEach.call(s.querySelectorAll('[data-count]'),function(el){
      var to=+el.getAttribute('data-count'),from=+(el.getAttribute('data-from')||0),sep=el.hasAttribute('data-sep'),suf=el.getAttribute('data-suffix')||'';
      if(reduce){el.textContent=fmt(to,sep)+suf;return}
      var t0=null;el.textContent=fmt(from,sep)+suf;
      function step(t){if(t0===null)t0=t;var p=Math.min((t-t0)/1300,1),e=1-Math.pow(1-p,3);el.textContent=fmt(Math.round(from+(to-from)*e),sep)+suf;if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);
    });
  }
  function setBA(box,dev,st){
    box.setAttribute('data-dev',dev);box.setAttribute('data-st',st);
    [].forEach.call(box.querySelectorAll('.ba-stage img'),function(im){im.classList.toggle('show',im.getAttribute('data-k')===dev+'-'+st)});
    [].forEach.call(box.querySelectorAll('[data-dev]'),function(b){if(b.tagName==='BUTTON')b.classList.toggle('on',b.getAttribute('data-dev')===dev)});
    [].forEach.call(box.querySelectorAll('[data-st]'),function(b){if(b.tagName==='BUTTON')b.classList.toggle('on',b.getAttribute('data-st')===st)});
    var bd=box.querySelector('.ba-badge');if(bd){bd.textContent=st==='before'?'Before':'After';bd.classList.toggle('after',st==='after')}
  }
  [].forEach.call(root.querySelectorAll('[data-ba]'),function(box){
    setBA(box,'mobile','before');
    box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      var dev=box.getAttribute('data-dev'),st=box.getAttribute('data-st');
      if(b.hasAttribute('data-dev'))dev=b.getAttribute('data-dev');if(b.hasAttribute('data-st'))st=b.getAttribute('data-st');
      box.setAttribute('data-touched','1');setBA(box,dev,st)});
  });
  [].forEach.call(root.querySelectorAll('[data-gal]'),function(g){
    var im=[].slice.call(g.querySelectorAll('.ba-stage img')),bt=[].slice.call(g.querySelectorAll('.ba-tabs button'));
    bt.forEach(function(b,i){b.addEventListener('click',function(){im.forEach(function(x,k){x.classList.toggle('show',k===i)});bt.forEach(function(x,k){x.classList.toggle('on',k===i)})})});
  });
  function activate(i){
    slides.forEach(function(s,k){var on=k===i;s.classList.toggle('active',on);if(on)s.removeAttribute('inert');else s.setAttribute('inert','')});
    tabs.forEach(function(t,k){t.classList.toggle('on',k===i);t.setAttribute('aria-selected',k===i)});
    dots.forEach(function(d,k){d.classList.toggle('on',k===i)});
    var s=slides[i];counters(s);
    clearTimeout(flip);
    var box=s.querySelector('[data-ba]');
    if(box){setBA(box,'mobile','before');box.removeAttribute('data-touched');flip=setTimeout(function(){if(!box.getAttribute('data-touched')&&slides[idx]===s)setBA(box,'mobile','after')},reduce?0:2200)}
  }
  function progress(){
    if(!bar)return;bar.style.transition='none';bar.style.width='0';
    if(reduce||!visible||paused)return;
    void bar.offsetWidth;bar.style.transition='width '+DUR+'ms linear';bar.style.width='100%';
  }
  function schedule(){clearTimeout(timer);progress();if(reduce||!visible||paused)return;timer=setTimeout(function(){go(idx+1)},DUR)}
  function go(i,user){
    idx=(i+n)%n;track.style.transform='translateX(-'+idx*100+'%)';activate(idx);schedule();
  }
  tabs.forEach(function(t,k){t.addEventListener('click',function(){go(k,true)})});
  [].forEach.call(root.querySelectorAll('.cs-arrow'),function(b){b.addEventListener('click',function(){go(idx+(+b.getAttribute('data-dir')),true)})});
  root.addEventListener('mouseenter',function(){paused=true;schedule()});
  root.addEventListener('mouseleave',function(){paused=false;schedule()});
  root.addEventListener('focusin',function(){paused=true;schedule()});
  root.addEventListener('focusout',function(){paused=false;schedule()});
  root.addEventListener('keydown',function(e){if(e.key==='ArrowRight')go(idx+1,true);if(e.key==='ArrowLeft')go(idx-1,true)});
  var x0=null;
  root.querySelector('.cs-viewport').addEventListener('touchstart',function(e){x0=e.touches[0].clientX;paused=true},{passive:true});
  root.querySelector('.cs-viewport').addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-x0;paused=false;if(Math.abs(dx)>50)go(idx+(dx<0?1:-1),true);else schedule()});
  document.addEventListener('visibilitychange',function(){paused=document.hidden;schedule()});
  if('IntersectionObserver' in window){new IntersectionObserver(function(en){visible=en[0].isIntersecting;schedule()},{threshold:.35}).observe(root)}else{visible=true}
  go(0);
})();
