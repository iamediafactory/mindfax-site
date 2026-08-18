/* SYNEX · INSTRUMENTO DO HEROI
   Desenha a forma do mecanismo — varredura de liquidez, deslocamento,
   e a geometria de risco — com TODO rotulo numerico redigido.
   Nao ha dado de mercado aqui e nao ha parametro do canon.
   O que se ve e que a maquina existe e roda. O metodo continua fechado. */
(function(){
  var c=document.getElementById('engine'); if(!c) return;
  var x=c.getContext('2d'), W,H,DPR,t=0, seed=Math.floor(Math.random()*1e6);
  function rnd(){ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; }

  function size(){
    DPR=Math.min(window.devicePixelRatio||1,2);
    W=c.clientWidth; H=c.clientHeight;
    c.width=W*DPR; c.height=H*DPR; x.setTransform(DPR,0,0,DPR,0,0);
  }
  size(); addEventListener('resize',size);

  // caminho: acumulacao -> varredura sob o nivel -> deslocamento -> expansao
  var N=340, pts=[];
  function build(){
    pts=[]; var v=0;
    for(var i=0;i<N;i++){
      var p=i/N, base;
      if(p<.30)      base = Math.sin(p*17)*7 + Math.sin(p*41)*3;         // acumulacao
      else if(p<.42) base = -42*Math.sin((p-.30)/.12*Math.PI);            // varredura sob o nivel
      else if(p<.66) base = 52*((p-.42)/.24)+2;                           // deslocamento
      else           base = 54 + 30*((p-.66)/.34) + Math.sin(p*47)*4.5;   // expansao
      v += (base-v)*.18;
      pts.push({x:p, y:v + (rnd()-.5)*3.2});
    }
  }
  build();

  function draw(){
    x.clearRect(0,0,W,H);
    var L=52, R=W-52, T=H*.11, B=H*.82;
    var sx=function(p){return L+p*(R-L);};
    var lo=-58, hi=98, sy=function(v){return B-((v-lo)/(hi-lo))*(B-T);};

    // malha do instrumento
    x.strokeStyle='rgba(237,231,220,.045)'; x.lineWidth=1;
    for(var g=0;g<=8;g++){ var gy=T+(B-T)*g/8; x.beginPath(); x.moveTo(L,gy); x.lineTo(R,gy); x.stroke(); }
    for(var g2=0;g2<=10;g2++){ var gx=L+(R-L)*g2/10; x.beginPath(); x.moveTo(gx,T); x.lineTo(gx,B); x.stroke(); }

    // o nivel — sem valor
    var lvY=sy(0);
    x.strokeStyle='rgba(237,231,220,.20)'; x.setLineDash([3,5]);
    x.beginPath(); x.moveTo(L,lvY); x.lineTo(R,lvY); x.stroke(); x.setLineDash([]);

    // faixa de risco e faixa de alvo — proporcao real do canon, sem rotular
    var eY=sy(52), slY=sy(52-30), tpY=sy(52+45);
    x.fillStyle='rgba(217,97,76,.055)'; x.fillRect(sx(.42),eY,R-sx(.42),slY-eY);
    x.fillStyle='rgba(92,225,230,.045)'; x.fillRect(sx(.42),tpY,R-sx(.42),eY-tpY);
    x.strokeStyle='rgba(217,97,76,.30)'; x.beginPath(); x.moveTo(sx(.42),slY); x.lineTo(R,slY); x.stroke();
    x.strokeStyle='rgba(92,225,230,.30)'; x.beginPath(); x.moveTo(sx(.42),tpY); x.lineTo(R,tpY); x.stroke();

    // progresso do traco
    var prog=Math.min(1,(t%700)/430);
    var n=Math.floor(prog*N);

    x.strokeStyle='rgba(237,231,220,.62)'; x.lineWidth=1.25; x.beginPath();
    for(var i=0;i<n;i++){ var P=pts[i]; if(i===0)x.moveTo(sx(P.x),sy(P.y)); else x.lineTo(sx(P.x),sy(P.y)); }
    x.stroke();

    // cursor vivo
    if(n>1&&n<N){
      var C=pts[n-1], cx=sx(C.x), cy=sy(C.y);
      x.strokeStyle='rgba(92,225,230,.22)'; x.beginPath(); x.moveTo(cx,T); x.lineTo(cx,B); x.stroke();
      x.fillStyle='#5CE1E6'; x.fillRect(cx-2.5,cy-2.5,5,5);
    }

    // marcas do mecanismo — rotulo redigido, igual ao especimen do livro
    var marks=[{p:.36,l:'\u2588\u2588\u2588\u2588\u2588\u2588'},
               {p:.42,l:'\u2588\u2588\u2588\u2588'},
               {p:.66,l:'\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588'}];
    x.font='10px "IBM Plex Mono",monospace'; x.textBaseline='middle';
    marks.forEach(function(m){
      if(prog<m.p) return;
      var mx=sx(m.p), my=sy(pts[Math.floor(m.p*N)].y);
      x.strokeStyle='rgba(237,231,220,.28)'; x.beginPath();
      x.moveTo(mx,my); x.lineTo(mx,my-26); x.stroke();
      x.fillStyle='rgba(41,41,50,.95)'; x.fillText(m.l,mx+5,my-30);
    });

    // eixo rotulado em mono, sem unidade
    x.font='9.5px "IBM Plex Mono",monospace'; x.fillStyle='rgba(92,88,82,.85)';
    x.fillText('SEQ \u2588\u2588\u2588\u2588',L,B+20);
    x.fillText('\u2588\u2588\u2588\u2588 / \u2588\u2588\u2588\u2588',R-72,B+20);

    t+=1; if(anim) requestAnimationFrame(draw);
  }
  var anim=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!anim){ t=470; }
  draw();
})();
