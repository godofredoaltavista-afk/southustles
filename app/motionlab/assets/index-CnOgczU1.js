(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Kx="modulepreload",Zx=function(i,e){return new URL(i,e).href},yp={},Jx=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let l=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");s=l(t.map(h=>{if(h=Zx(h,n),h in yp)return;yp[h]=!0;const d=h.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(n)for(let p=a.length-1;p>=0;p--){const m=a[p];if(m.href===h&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${u}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":Kx,d||(f.as="script"),f.crossOrigin="",f.href=h,c&&f.setAttribute("nonce",c),document.head.appendChild(f),d)return new Promise((p,m)=>{f.addEventListener("load",p),f.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})},zi=["nose","l_eye","r_eye","l_ear","r_ear","l_shoulder","r_shoulder","l_elbow","r_elbow","l_wrist","r_wrist","l_hip","r_hip","l_knee","r_knee","l_ankle","r_ankle","l_heel","r_heel","l_toe","r_toe"],Li=zi.length,Be=Object.fromEntries(zi.map((i,e)=>[i,e])),Qx=[["l_ear","l_eye","L"],["l_eye","nose","L"],["nose","r_eye","R"],["r_eye","r_ear","R"],["l_shoulder","r_shoulder","C"],["l_shoulder","l_elbow","L"],["l_elbow","l_wrist","L"],["r_shoulder","r_elbow","R"],["r_elbow","r_wrist","R"],["l_shoulder","l_hip","L"],["r_shoulder","r_hip","R"],["l_hip","r_hip","C"],["l_hip","l_knee","L"],["l_knee","l_ankle","L"],["r_hip","r_knee","R"],["r_knee","r_ankle","R"],["l_ankle","l_heel","L"],["l_heel","l_toe","L"],["l_ankle","l_toe","L"],["r_ankle","r_heel","R"],["r_heel","r_toe","R"],["r_ankle","r_toe","R"]],Sp={nose:0,l_eye:2,r_eye:5,l_ear:7,r_ear:8,l_shoulder:11,r_shoulder:12,l_elbow:13,r_elbow:14,l_wrist:15,r_wrist:16,l_hip:23,r_hip:24,l_knee:25,r_knee:26,l_ankle:27,r_ankle:28,l_heel:29,r_heel:30,l_toe:31,r_toe:32},hg=i=>i<0?0:i>1?1:i;function ev(i,e,t){const n=i?.landmarks?.[0];if(!n)return null;const s=i.worldLandmarks?.[0]??null,r=zi.map(o=>{const c=n[Sp[o]];return[c.x,c.y,c.z??0,hg(c.visibility??1)]}),a=s?zi.map(o=>{const c=s[Sp[o]];return[c.x,c.y,c.z]}):null;return{t:e,aspect:t,pts:r,world:a}}function tv(i,e,t){return i?.k?.length?{t:e,aspect:t,pts:i.k.map(([n,s,r])=>[n,s,0,hg(r)]),world:null}:null}const Cr=(i,e=4)=>Math.round(i*10**e)/10**e;function nv(i){const e=[];for(const n of i.pts)e.push(Cr(n[0]),Cr(n[1]),Cr(n[2]),Cr(n[3],2));const t={t:Math.round(i.t),k:e};if(i.world){const n=[];for(const s of i.world)n.push(Cr(s[0],3),Cr(s[1],3),Cr(s[2],3));t.w=n}return t}function ug(i,e){const t=[];for(let s=0;s<Li;s++)t.push([i.k[s*4],i.k[s*4+1],i.k[s*4+2],i.k[s*4+3]]);let n=null;if(i.w){n=[];for(let s=0;s<Li;s++)n.push([i.w[s*3],i.w[s*3+1],i.w[s*3+2]])}return{t:i.t,aspect:e,pts:t,world:n}}const wp=new URL("lib/mediapipe/",document.baseURI).href,iv=new URL("models/",document.baseURI).href;class sv{constructor({model:e="full"}={}){this.name="mediapipe",this.label="MediaPipe (navegador)",this.has3D=!0,this.model=e,this.delegate=null,this.lastTs=-1}async init(e=()=>{}){e("Cargando runtime WASM…",.15);const{FilesetResolver:t,PoseLandmarker:n}=await Jx(async()=>{const{FilesetResolver:o,PoseLandmarker:c}=await import(`${wp}vision_bundle.mjs`);return{FilesetResolver:o,PoseLandmarker:c}},[],import.meta.url),s=await t.forVisionTasks(`${wp}wasm`),r=`${iv}pose_landmarker_${this.model}.task`,a=o=>n.createFromOptions(s,{baseOptions:{modelAssetPath:r,delegate:o},runningMode:"VIDEO",numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5});e(`Cargando modelo ${this.model} (GPU)…`,.45);try{this.lm=await a("GPU"),this.delegate="GPU"}catch(o){console.warn("GPU no disponible, uso CPU",o),e(`Cargando modelo ${this.model} (CPU)…`,.6),this.lm=await a("CPU"),this.delegate="CPU"}return e("Listo",1),this}async detect(e,t){if(!this.lm)return null;const n=e.videoWidth??e.width,s=e.videoHeight??e.height;if(!n||!s)return null;let r=Math.round(t);r<=this.lastTs&&(r=this.lastTs+1),this.lastTs=r;const a=this.lm.detectForVideo(e,r);return ev(a,t,n/s)}resetClock(){this.lastTs=-1}close(){this.lm?.close(),this.lm=null}}class rv{constructor({mode:e="lightweight",maxWidth:t=640,quality:n=.8}={}){this.name="rtmlib",this.label="RTMPose (servidor local)",this.has3D=!1,this.mode=e,this.maxWidth=t,this.quality=n,this.canvas=document.createElement("canvas"),this.pending=null,this.info=null}async init(e=()=>{}){if(e("Conectando con el servidor local…",.1),!(await fetch("/api/health").then(s=>s.json()).catch(()=>null))?.rtmlib)throw new Error("El servidor local no está corriendo o no tiene rtmlib. Arrancalo con start.ps1 (o python engine/server.py).");const n=location.protocol==="https:"?"wss":"ws";return this.ws=new WebSocket(`${n}://${location.host}/ws/pose?mode=${this.mode}`),this.ws.binaryType="arraybuffer",await new Promise((s,r)=>{this.ws.onopen=s,this.ws.onerror=()=>r(new Error("No se pudo abrir el WebSocket /ws/pose"))}),this.ws.onmessage=s=>{const r=JSON.parse(s.data);if(r.type==="ready"){this.info=r,this._ready?.(r);return}if(r.type==="status"){e(r.text,r.progress??.5);return}if(r.type==="error"){this._ready?.(null,new Error(r.text));return}const a=this.pending;this.pending=null,a?.resolve(r)},this.ws.onclose=()=>{this.pending?.resolve(null),this.pending=null},e("Cargando modelos RTMPose (la primera vez se descargan)…",.3),await new Promise((s,r)=>{this._ready=(a,o)=>o?r(o):s(a),this.ws.send(JSON.stringify({type:"init",mode:this.mode}))}),e(`Listo (${this.info?.device??"?"})`,1),this}async detect(e,t){if(!this.ws||this.ws.readyState!==1||this.pending)return null;const n=e.videoWidth??e.width,s=e.videoHeight??e.height;if(!n||!s)return null;const r=Math.min(1,this.maxWidth/n);this.canvas.width=Math.round(n*r),this.canvas.height=Math.round(s*r),this.canvas.getContext("2d").drawImage(e,0,0,this.canvas.width,this.canvas.height);const a=await new Promise(l=>this.canvas.toBlob(l,"image/jpeg",this.quality));if(!a)return null;const o=await a.arrayBuffer(),c=await new Promise(l=>{this.pending={resolve:l},this.ws.send(o)});return c?(this.lastMs=c.ms,tv(c,t,n/s)):null}resetClock(){}close(){try{this.ws?.close()}catch{}this.ws=null}}const oi={sh:.075,hw:.05,thigh:.19,shin:.19,ua:.13,fa:.12,neck:.11},Ch=1.8,Rl=Math.PI/180;function av(i){let e=i>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const Qi=(i,e)=>[i[0]+e[0],i[1]+e[1],i[2]+e[2]],Ep=(i,e,t)=>i.map((n,s)=>n+(e[s]-n)*t),er=i=>i*i*(3-2*i);function cr(i,e,t){const n=[Math.sin(e*Rl)*i,Math.cos(e*Rl),0],s=[n[0],n[1]*Math.cos(t*Rl),-n[1]*Math.sin(t*Rl)],r=n.map(a=>a*oi.ua);return{elbow:r,wrist:Qi(r,s.map(a=>a*oi.fa))}}function Tp(i,e,t,n=1){let s=e[0]-i[0],r=e[1]-i[1],a=Math.hypot(s,r);const o=oi.ua+oi.fa-1e-4;a>o&&(s*=o/a,r*=o/a,a=o);const c=(oi.ua**2-oi.fa**2+a**2)/(2*a),l=Math.sqrt(Math.max(0,oi.ua**2-c**2)),h=s/a,d=r/a;let u=-d,f=h;return u*t<0&&(u=-u,f=-f),{elbow:[h*c+u*l*n,d*c+f*l*n,0],wrist:[s,r,0]}}function ov(i){const e=i.legLift??{L:0,R:0},t=(u,f,p=0)=>{const m=u*(oi.hw+.006),_=[m,oi.thigh*(1-.5*f),-.04*f],g=[m+u*.004,_[1]+oi.shin*(1-.75*f)+p,-.02*f];return{knee:_,ankle:g,heel:Qi(g,[0,.02,.02]),toe:Qi(g,[u*.018,.038,-.03])}},n=t(1,e.L,i.ankleDrop?.L??0),s=t(-1,e.R,i.ankleDrop?.R??0),r=-.24,a=[oi.sh,r,0],o=[-.075,r,0],c=[0,r-oi.neck,-.03],l=i.armL??cr(1,8,0),h=i.armR??cr(-1,8,0);return{nose:c,l_eye:Qi(c,[.02,-.015,.01]),r_eye:Qi(c,[-.02,-.015,.01]),l_ear:Qi(c,[.045,.005,.03]),r_ear:Qi(c,[-.045,.005,.03]),l_shoulder:a,r_shoulder:o,l_elbow:Qi(a,l.elbow),r_elbow:Qi(o,h.elbow),l_wrist:Qi(a,l.wrist),r_wrist:Qi(o,h.wrist),l_hip:[oi.hw,0,0],r_hip:[-.05,0,0],l_knee:n.knee,r_knee:s.knee,l_ankle:n.ankle,r_ankle:s.ankle,l_heel:n.heel,r_heel:s.heel,l_toe:n.toe,r_toe:s.toe}}function lv(i,e,{aspect:t,cx:n=.5,hipY:s=.52,dx:r=0,dy:a=0,noise:o=0,rand:c=Math.random}){const l=new Array(Li),h=new Array(Li);for(const d of Object.keys(i)){const[u,f,p]=i[d],m=()=>o?(c()-.5)*2*o:0;l[Be[d]]=[n+(u+r)/t+m(),s+f+a+m(),p/t,.99],h[Be[d]]=[u*Ch,(f+a)*Ch,p*Ch]}return{t:e,aspect:t,pts:l,world:h}}const Cl={L:{elbow:[.03,.1,-.07],wrist:[-.045,-.06,-.12]},R:{elbow:[-.03,.1,-.07],wrist:[.045,-.06,-.12]}},cv={elbow:[.02,0,-.13],wrist:[0,-.02,-.26]},hv={elbow:[-.02,0,-.13],wrist:[0,-.02,-.26]},Ap={elbow:[.12,.01,-.05],wrist:[.07,-.01,-.16]},Rp={elbow:[.02,.01,-.13],wrist:[-.1,-.01,-.13]},Ro=(i,e,t)=>({elbow:Ep(i.elbow,e.elbow,t),wrist:Ep(i.wrist,e.wrist,t)}),Cp=(i,e,t)=>i<e||i>e+t?0:Math.sin((i-e)/t*Math.PI);function uv(i,e,t={}){const n=t.aspect??1.7777777777777777,s=t.rand??Math.random,r=e/1e3,a={};let o=0,c=0;if(i==="curl"){const h=(t.tempoUp??1e3)/1e3,d=(t.tempoDown??2e3)/1e3,u=.5,f=h+d+u,p=r%f,_=8+(p<h?er(p/h):p<h+u?1:1-er((p-h-u)/d))*142;a.armL=cr(1,8,_),a.armR=cr(-1,8,_)}else if(i==="pullup"){const d=r%3.2/3.2;o=-.11*(d<.4?er(d/.4):d<.5?1:d<.9?1-er((d-.5)/.4):0);const f=-.24-.27,p=-.24+o;a.armL=Tp([oi.sh,p],[oi.sh+.03,f],1,1),a.armR=Tp([-.075,p],[-.075-.03,f],-1,1),a.armL.wrist=[.03,f-p,0],a.armR.wrist=[-.03,f-p,0]}else if(i==="jumprope"){const h=(t.rate??200)/60,d=r*h%1;o=-.022*Math.sin(Math.PI*d)**2,a.armL=cr(1,22,70+12*Math.sin(2*Math.PI*r*h)),a.armR=cr(-1,22,70+12*Math.sin(2*Math.PI*r*h+Math.PI)),a.legLift={L:.06*Math.max(0,-o/.022),R:.06*Math.max(0,-o/.022)}}else if(i==="boxing"){const d=r%4,u=Cp(d,.8,.28),f=Cp(d,1.9,.28);a.armL=Ro(Cl.L,cv,u),a.armR=Ro(Cl.R,hv,f),d>=2.6&&d<2.95?a.armL=Ro(Cl.L,Ap,er((d-2.6)/.35)):d>=2.95&&d<3.15?a.armL=Ro(Ap,Rp,(d-2.95)/.2):d>=3.15&&d<3.55&&(a.armL=Ro(Rp,Cl.L,er((d-3.15)/.4))),a.ankleDrop={L:.014,R:-.006},c=.012*Math.sin(r/4*2*Math.PI*2),o=.006*Math.abs(Math.sin(r*2*Math.PI*1.5))}else if(i==="crane"){const d=r%12,u=d<1?er(d):d<9?1:d<10?1-er(d-9):0;a.legLift={L:u,R:0},a.armL=cr(1,30,30),a.armR=cr(-1,30,30)}const l=ov(a);return lv(l,e,{aspect:n,dx:c,dy:o,noise:t.noise??0,rand:s})}class dv{constructor(e="curl",t={}){this.name="sim",this.mode=e,this.opts={noise:.0012,...t},this.t0=null,this.rand=av(7)}async init(){return this}setMode(e){this.mode=e,this.t0=null}detect(e,t){return this.t0===null&&(this.t0=t),uv(this.mode,t-this.t0,{...this.opts,rand:this.rand})}}const Ui={L:"#2f7bff",R:"#ff3b30",C:"#22d36b",H:"#ffd60a",com:"#ffd60a",trail:{l_wrist:"#2f7bff",r_wrist:"#ff3b30",l_ankle:"#6aa8ff",r_ankle:"#e040fb",com:"#ffd60a",nose:"#ffd60a"},alert:"#ff9f0a",accent:"#e06040"},fv=new Set(["nose","l_eye","r_eye","l_ear","r_ear"]),Du=[["l_ear","l_eye","H"],["l_eye","nose","H"],["nose","r_eye","H"],["r_eye","r_ear","H"],["_neck","nose","C"],["l_shoulder","r_shoulder","C"],["_neck","_pelvis","C"],["l_hip","r_hip","C"],["l_shoulder","l_hip","C"],["r_shoulder","r_hip","C"],["l_shoulder","l_elbow","L"],["l_elbow","l_wrist","L"],["r_shoulder","r_elbow","R"],["r_elbow","r_wrist","R"],["l_hip","l_knee","L"],["l_knee","l_ankle","L"],["l_ankle","l_heel","L"],["l_heel","l_toe","L"],["l_ankle","l_toe","L"],["r_hip","r_knee","R"],["r_knee","r_ankle","R"],["r_ankle","r_heel","R"],["r_heel","r_toe","R"],["r_ankle","r_toe","R"]],pv=i=>fv.has(i)?"H":i.startsWith("l_")?"L":i.startsWith("r_")?"R":"C",Co=(i,e)=>{const t=parseInt(i.slice(1),16);return`rgba(${t>>16&255},${t>>8&255},${t&255},${e})`},mv={mirror:!0,showVideo:!0,dimVideo:.35,ghosts:!0,ghostEvery:4,ghostCount:7,trails:!0,trailEvery:2,trailLen:40,trailJoints:["l_wrist","r_wrist","l_ankle","r_ankle","com"],showCom:!0,showAngles:!0,minVis:.35,zoom:1,panX:0,panY:0,ink:!1,videoFilter:"",showSkeleton:!0,angleArcs:!1,bbox:!1,chrome:!1,recT:null,fx:null,heat:null};class Ll{constructor(e,t={}){this.canvas=e,this.ctx=e.getContext("2d"),this.opts={...mv,...t},this.reset()}set(e){this.opts={...this.opts,...e}}reset(){this.ghosts=[],this.trails={},this.n=0}fit(){const e=this.canvas.getBoundingClientRect(),t=Math.min(2,window.devicePixelRatio||1),n=Math.max(1,Math.round(e.width*t)),s=Math.max(1,Math.round(e.height*t));(this.canvas.width!==n||this.canvas.height!==s)&&(this.canvas.width=n,this.canvas.height=s),this.dpr=t}rectFor(e){const t=this.canvas.width,n=this.canvas.height;let s=t,r=t/e;return r>n&&(r=n,s=n*e),{x:(t-s)/2,y:(n-r)/2,w:s,h:r}}push(e,t){if(!e)return;this.n++;const n=this.opts;if(this.n%n.ghostEvery===0)for(this.ghosts.push(e);this.ghosts.length>n.ghostCount;)this.ghosts.shift();if(this.n%n.trailEvery===0)for(const s of n.trailJoints){let r=null;if(s==="com")t&&Number.isFinite(t.comX)&&(r=[t.comX,t.comY/1,1]);else{const o=e.pts[Be[s]];o[3]>=n.minVis&&(r=[o[0],o[1],o[3]])}const a=this.trails[s]||=[];for(a.push(r);a.length>n.trailLen;)a.shift()}}draw({video:e=null,frame:t=null,sig:n=null,alerts:s=[],aspect:r=null,ghostFrame:a=null,ghostLabel:o=""}={}){this.fit();const c=this.ctx,l=this.opts,h=this.canvas.width,d=this.canvas.height,u=r??t?.aspect??(e?.videoWidth?e.videoWidth/e.videoHeight:16/9);let f=this.rectFor(u);if(l.zoom!==1||l.panX||l.panY){const _=l.zoom,g=this.dpr||1;f={x:h/2+(f.x-h/2)*_+l.panX*g,y:d/2+(f.y-d/2)*_+l.panY*g,w:f.w*_,h:f.h*_}}this.R=f,c.save(),c.fillStyle=l.ink?"#e8e8e0":"#050505",c.fillRect(0,0,h,d),e&&l.showVideo&&e.readyState>=2?(c.save(),l.ink?(c.filter="grayscale(1) contrast(1.2) brightness(1.15)",c.globalAlpha=.42):l.videoFilter&&(c.filter=l.videoFilter),l.mirror?(c.translate(f.x+f.w,f.y),c.scale(-1,1),c.drawImage(e,0,0,f.w,f.h)):c.drawImage(e,f.x,f.y,f.w,f.h),c.restore(),l.dimVideo&&!l.ink&&(c.fillStyle=`rgba(0,0,0,${l.dimVideo})`,c.fillRect(f.x,f.y,f.w,f.h))):this.grid(f),l.heat&&this.heatOverlay(l.heat,f);const p=Math.max(1,f.h/540),m=l.ink?"#0a0a0a":null;a&&this.skeleton(a,f,{alpha:.55,width:3*p,mono:l.ink?"#6d6d66":"#bfbfbf",label:o}),l.ghosts&&t&&this.ghosts.forEach((_,g)=>{const x=(g+1)/(this.ghosts.length+1)*(l.ink?.5:.28);this.skeleton(_,f,{alpha:x,width:(l.ink?1.4:2)*p,dots:!1,mono:m})}),l.trails&&t&&this.drawTrails(f,p),t&&(l.bbox&&this.bboxDraw(t,f,p),l.showSkeleton&&this.skeleton(t,f,{alpha:1,width:5*p,alerts:s,ink:l.ink}),l.showCom&&n&&Number.isFinite(n.comX)&&this.com(n,f,p),l.showAngles&&n&&(l.angleArcs?this.arcs(t,n,f,p):this.angles(t,n,f,p))),l.fx?.length&&this.fxDraw(l.fx,f,p),l.chrome&&this.chromeDraw(p),c.restore()}arcs(e,t,n,s){const r=this.ctx,a=this.opts.ink,o=(c,l,h,d,u)=>{const f=this.point(e,c,n),p=this.point(e,l,n),m=this.point(e,h,n);if(!f||!p||!m||!Number.isFinite(d))return;const _=Math.atan2(f[1]-p[1],f[0]-p[0]);let x=Math.atan2(m[1]-p[1],m[0]-p[0])-_;for(;x>Math.PI;)x-=2*Math.PI;for(;x<-Math.PI;)x+=2*Math.PI;const T=26*s;r.save(),r.fillStyle=Co(u,a?.14:.2),r.beginPath(),r.moveTo(p[0],p[1]),r.arc(p[0],p[1],T,_,_+x,x<0),r.closePath(),r.fill(),r.strokeStyle=u,r.lineWidth=2*s,a||(r.shadowColor=u,r.shadowBlur=8*s),r.beginPath(),r.arc(p[0],p[1],T,_,_+x,x<0),r.stroke(),r.restore();const b=_+x/2,S=p[0]+Math.cos(b)*(T+20*s),M=p[1]+Math.sin(b)*(T+20*s),A=`${Math.round(d)}°`;r.font=`${Math.round(13*s)}px "Share Tech Mono", ui-monospace, monospace`,r.textAlign="center",r.textBaseline="middle";const v=r.measureText(A).width+10*s;r.fillStyle=a?"rgba(232,232,224,0.85)":"rgba(0,0,0,0.7)",r.fillRect(S-v/2,M-10*s,v,20*s),r.fillStyle=a?"#0a0a0a":"#e8e8e0",r.fillText(A,S,M+.5)};o("l_shoulder","l_elbow","l_wrist",t.elbowL,Ui.L),o("r_shoulder","r_elbow","r_wrist",t.elbowR,Ui.R),o("l_hip","l_knee","l_ankle",t.kneeL,Ui.L),o("r_hip","r_knee","r_ankle",t.kneeR,Ui.R)}bboxDraw(e,t,n){const s=this.ctx;let r=1e9,a=1e9,o=-1e9,c=-1e9,l=0,h=0;for(let g=0;g<Li;g++){const x=this.point(e,zi[g],t);x&&(r=Math.min(r,x[0]),a=Math.min(a,x[1]),o=Math.max(o,x[0]),c=Math.max(c,x[1]),l+=e.pts[g][3],h++)}if(h<5)return;const d=o-r,u=c-a;r-=d*.12,o+=d*.12,a-=u*.14,c+=u*.06;const f=this.opts.ink?"#b44528":Ui.accent,p=Math.min(26*n,(o-r)/3);s.save(),s.strokeStyle=f,s.lineWidth=2.5*n,this.opts.ink||(s.shadowColor=f,s.shadowBlur=10*n),s.beginPath(),s.moveTo(r,a+p),s.lineTo(r,a),s.lineTo(r+p,a),s.moveTo(o-p,a),s.lineTo(o,a),s.lineTo(o,a+p),s.moveTo(o,c-p),s.lineTo(o,c),s.lineTo(o-p,c),s.moveTo(r+p,c),s.lineTo(r,c),s.lineTo(r,c-p),s.stroke(),s.shadowBlur=0;const m=`persona ${(l/h).toFixed(2)}`;s.font=`${Math.round(13*n)}px "Share Tech Mono", ui-monospace, monospace`,s.textBaseline="middle";const _=s.measureText(m).width+12*n;s.fillStyle=f,s.fillRect(r,a-22*n,_,20*n),s.fillStyle="#0a0a0a",s.fillText(m,r+6*n,a-12*n),s.restore()}fxDraw(e,t,n){const s=this.ctx,r=performance.now();for(const a of e){const o=(r-a.t0)/700;if(o<0||o>1)continue;const[c,l]=this.map([a.x,a.y],t),h=1-(1-o)**3;s.save(),s.globalCompositeOperation=this.opts.ink?"source-over":"lighter",s.strokeStyle=Co(a.color,.9*(1-o)),s.lineWidth=(4*(1-o)+1)*n,s.beginPath(),s.arc(c,l,(10+70*h)*n,0,Math.PI*2),s.stroke();for(let d=0;d<14;d++){const u=d/14*Math.PI*2+(a.seed??0),f=(14+90*h*(.6+.4*(d*37%10)/10))*n;s.strokeStyle=d%3?a.color:"#ffffff",s.lineWidth=2*(1-o)*n,s.beginPath(),s.moveTo(c+Math.cos(u)*f,l+Math.sin(u)*f),s.lineTo(c+Math.cos(u)*(f+18*(1-o)*n),l+Math.sin(u)*(f+18*(1-o)*n)),s.stroke()}if(s.restore(),a.label){const d=o<.12?o/.12:o>.8?(1-o)/.2:1;s.save(),s.globalAlpha=d,s.textAlign="center",s.textBaseline="alphabetic";const u=l-(40+24*h)*n;s.font=`${Math.round(34*n)}px "Bebas Neue", "Arial Narrow", sans-serif`,s.lineWidth=5*n,s.strokeStyle=this.opts.ink?"#e8e8e0":"rgba(0,0,0,0.85)",s.strokeText(a.label,c,u),s.fillStyle=this.opts.ink?"#0a0a0a":"#ffffff",s.fillText(a.label,c,u),a.sub&&(s.font=`${Math.round(13*n)}px "Share Tech Mono", monospace`,s.fillStyle=a.color,s.fillText(a.sub,c,u+18*n)),s.restore()}}}chromeDraw(e){const t=this.ctx,n=this.canvas.width,s=this.canvas.height,r=16*e,a=22*e;if(t.save(),t.strokeStyle=this.opts.ink?"rgba(10,10,10,0.5)":"rgba(232,232,224,0.45)",t.lineWidth=1.5*e,t.beginPath(),t.moveTo(r,r+a),t.lineTo(r,r),t.lineTo(r+a,r),t.moveTo(n-r-a,r),t.lineTo(n-r,r),t.lineTo(n-r,r+a),t.moveTo(n-r,s-r-a),t.lineTo(n-r,s-r),t.lineTo(n-r-a,s-r),t.moveTo(r+a,s-r),t.lineTo(r,s-r),t.lineTo(r,s-r-a),t.stroke(),this.opts.recT!=null){const o=this.opts.recT,c=Math.floor(o*30)%30,l=Math.floor(o)%60,h=Math.floor(o/60),d=`REC ${String(h).padStart(2,"0")}:${String(l).padStart(2,"0")}:${String(c).padStart(2,"0")}`;t.font=`${Math.round(13*e)}px "Share Tech Mono", monospace`,t.textAlign="right",t.textBaseline="middle",t.fillStyle=Math.floor(o*2)%2?"rgba(255,59,48,0.35)":Ui.R,t.beginPath(),t.arc(n-r-t.measureText(d).width-14*e,r+16*e,4.5*e,0,Math.PI*2),t.fill(),t.fillStyle=this.opts.ink?"#0a0a0a":"#e8e8e0",t.fillText(d,n-r-4*e,r+16*e)}t.restore()}heatOverlay(e,t){const n=this.ctx,{gx:s,gy:r,g:a}=e,o=t.w/s,c=t.h/r;n.save(),n.globalCompositeOperation=this.opts.ink?"multiply":"lighter";for(let l=0;l<r;l++)for(let h=0;h<s;h++){const d=a[l*s+h];if(d<.03)continue;const u=Math.min(1,.2+Math.sqrt(d));n.fillStyle=this.opts.ink?d>.4?`rgba(180,69,40,${u*.7})`:`rgba(31,79,209,${u*.55})`:d>.6?`rgba(255,232,196,${u})`:d>.25?`rgba(224,96,64,${u})`:`rgba(47,123,255,${u*.8})`;const f=this.opts.mirror?s-1-h:h;n.fillRect(t.x+f*o+1,t.y+l*c+1,o-2,c-2)}n.restore()}map(e,t){const n=this.opts.mirror?1-e[0]:e[0];return[t.x+n*t.w,t.y+e[1]*t.h]}point(e,t,n){const s=this.opts,r=o=>e.pts[Be[o]];if(t==="_neck"||t==="_pelvis"){const[o,c]=t==="_neck"?["l_shoulder","r_shoulder"]:["l_hip","r_hip"],l=r(o),h=r(c);return l[3]<s.minVis||h[3]<s.minVis?null:this.map([(l[0]+h[0])/2,(l[1]+h[1])/2],n)}const a=r(t);return a[3]>=s.minVis?this.map(a,n):null}skeleton(e,t,{alpha:n=1,width:s=4,dots:r=!0,mono:a=null,alerts:o=[],label:c="",ink:l=!1}={}){const h=this.ctx;h.save(),h.globalAlpha=n,h.lineCap="round",h.lineJoin="round";const d=new Set(o.flatMap(u=>u.joints??[]));if(l&&!a)for(const u of[0,1])for(const[f,p,m]of Du){const _=this.point(e,f,t),g=this.point(e,p,t);if(!_||!g)continue;const x=(m==="H"?.4:.55)*s;h.strokeStyle=u?"#0a0a0a":"rgba(255,255,255,0.9)",h.lineWidth=u?x:x+3.5*(s/5),h.beginPath(),h.moveTo(_[0],_[1]),h.lineTo(g[0],g[1]),h.stroke()}for(const[u,f,p]of l&&!a?[]:Du){const m=this.point(e,u,t),_=this.point(e,f,t);if(!m||!_)continue;const g=a??Ui[p];h.strokeStyle=g,h.lineWidth=p==="H"?s*.6:s,n===1&&!a&&(h.shadowColor=Co(g,.6),h.shadowBlur=s*2.2),h.beginPath(),h.moveTo(m[0],m[1]),h.lineTo(_[0],_[1]),h.stroke()}if(h.shadowBlur=0,r)for(let u=0;u<Li;u++){const f=zi[u],p=this.point(e,f,t);if(!p)continue;const m=pv(f),_=(m==="H"?.55:.8)*s;h.beginPath(),h.arc(p[0],p[1],_,0,Math.PI*2),m==="H"&&!a?(h.fillStyle="#ffffff",h.fill(),h.lineWidth=Math.max(1,s*.3),h.strokeStyle="#000000",h.stroke()):(h.fillStyle=a??Ui[m],h.fill(),h.lineWidth=Math.max(1,s*.35),h.strokeStyle="rgba(0,0,0,0.65)",h.stroke()),d.has(f)&&(h.beginPath(),h.arc(p[0],p[1],_*2.4,0,Math.PI*2),h.strokeStyle=Ui.alert,h.lineWidth=Math.max(2,s*.5),h.stroke())}if(c){const u=this.point(e,"nose",t);u&&(h.font=`${Math.round(s*3.2)}px ui-monospace, monospace`,h.fillStyle=a??"#fff",h.fillText(c,u[0]+s*3,u[1]-s*3))}h.restore()}drawTrails(e,t){const n=this.ctx,s=this.opts;for(const r of s.trailJoints){const a=this.trails[r];if(!a||a.length<2)continue;const o=Ui.trail[r]??"#ffffff",c=a.length;for(let l=1;l<c;l++){const h=a[l-1],d=a[l];if(!h||!d)continue;const u=l/(c-1),f=this.map(h,e),p=this.map(d,e);n.strokeStyle=Co(o,.08+.72*u**1.4),n.lineWidth=(.6+1.8*u)*t,n.beginPath(),n.moveTo(f[0],f[1]),n.lineTo(p[0],p[1]),n.stroke(),l%3===0&&(n.fillStyle=Co(o,.15+.75*u),n.beginPath(),n.arc(p[0],p[1],(1.2+2.2*u)*t,0,Math.PI*2),n.fill())}}}com(e,t,n){const s=this.ctx,[r,a]=this.map([e.comX,e.comY],t),o=9*n,c=s.createRadialGradient(r-o*.3,a-o*.3,o*.1,r,a,o);if(c.addColorStop(0,"#fff7c2"),c.addColorStop(.5,Ui.com),c.addColorStop(1,"rgba(255,214,10,0.15)"),s.fillStyle=c,s.beginPath(),s.arc(r,a,o,0,Math.PI*2),s.fill(),e._g?.am){const l=t.y+e._g.am.y*t.h;s.setLineDash([4*n,5*n]),s.strokeStyle="rgba(255,214,10,0.45)",s.lineWidth=1.2*n,s.beginPath(),s.moveTo(r,a+o),s.lineTo(r,l),s.stroke(),s.setLineDash([])}}angles(e,t,n,s){const r=this.ctx;r.font=`${Math.round(11*s)}px ui-monospace, "Share Tech Mono", monospace`,r.textBaseline="middle";const a=(o,c)=>{if(!Number.isFinite(c))return;const l=this.point(e,o,n);if(!l)return;const h=`${Math.round(c)}°`,d=r.measureText(h).width+8*s,u=l[0]+10*s,f=l[1]-10*s;r.fillStyle="rgba(0,0,0,0.6)",r.fillRect(u,f-8*s,d,16*s),r.fillStyle="#e8e8e0",r.fillText(h,u+4*s,f)};a("l_elbow",t.elbowL),a("r_elbow",t.elbowR),a("l_knee",t.kneeL),a("r_knee",t.kneeR)}grid(e){const t=this.ctx;t.fillStyle=this.opts.ink?"#efeee8":"#0d0d0d",t.fillRect(e.x,e.y,e.w,e.h),t.strokeStyle=this.opts.ink?"rgba(10,10,10,0.07)":"rgba(255,255,255,0.06)",t.lineWidth=1;const n=e.h/12;t.beginPath();for(let s=e.x;s<=e.x+e.w+.5;s+=n)t.moveTo(s,e.y),t.lineTo(s,e.y+e.h);for(let s=e.y;s<=e.y+e.h+.5;s+=n)t.moveTo(e.x,s),t.lineTo(e.x+e.w,s);t.stroke()}}class gv{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.trail={l_ankle:[],r_ankle:[]}}reset(){this.trail={l_ankle:[],r_ankle:[]}}draw(e){const t=this.canvas,n=this.ctx,s=t.getBoundingClientRect(),r=Math.min(2,window.devicePixelRatio||1);t.width=Math.max(1,Math.round(s.width*r)),t.height=Math.max(1,Math.round(s.height*r));const a=t.width,o=t.height;n.fillStyle="#0d0d0d",n.fillRect(0,0,a,o),n.strokeStyle="rgba(255,255,255,0.06)",n.lineWidth=1,n.beginPath();const c=o/10;for(let p=0;p<=a;p+=c)n.moveTo(p,0),n.lineTo(p,o);for(let p=0;p<=o;p+=c)n.moveTo(0,p),n.lineTo(a,p);if(n.stroke(),n.fillStyle="#888880",n.font=`${Math.round(10*r)}px ui-monospace, monospace`,n.fillText("FRENTE",8*r,14*r),n.fillText("PERFIL",a/2+8*r,14*r),!e?.world){n.fillText("sin 3D con este motor",8*r,o-10*r);return}const l=e.world,h=o/2.1,d=[{cx:a/4,proj:p=>[-p[0],p[1]]},{cx:3*a/4,proj:p=>[p[2],p[1]]}],u=o*.47,f=(p,m)=>{const[_,g]=p.proj(m);return[p.cx+_*h,u+g*h]};for(const p of["l_ankle","r_ankle"])this.trail[p].push(l[Be[p]]),this.trail[p].length>60&&this.trail[p].shift();for(const p of d){for(const m of["l_ankle","r_ankle"]){const _=this.trail[m];n.strokeStyle=m==="l_ankle"?"rgba(34,211,238,0.7)":"rgba(224,64,251,0.7)",n.lineWidth=1.5*r,n.beginPath(),_.forEach((g,x)=>{const[T,b]=f(p,g);x?n.lineTo(T,b):n.moveTo(T,b)}),n.stroke()}n.lineCap="round";for(const[m,_,g]of Du){const x=A=>A==="_neck"?l[Be.l_shoulder].map((v,E)=>(v+l[Be.r_shoulder][E])/2):A==="_pelvis"?l[Be.l_hip].map((v,E)=>(v+l[Be.r_hip][E])/2):l[Be[A]],[T,b]=f(p,x(m)),[S,M]=f(p,x(_));n.strokeStyle=Ui[g],n.lineWidth=(g==="H"?1.5:3)*r,n.beginPath(),n.moveTo(T,b),n.lineTo(S,M),n.stroke()}}}}const _v=!0,Pn="u-",xv="uplot",vv=Pn+"hz",bv=Pn+"vt",Mv=Pn+"title",yv=Pn+"wrap",Sv=Pn+"under",wv=Pn+"over",Ev=Pn+"axis",Hr=Pn+"off",Tv=Pn+"select",Av=Pn+"cursor-x",Rv=Pn+"cursor-y",Cv=Pn+"cursor-pt",Lv=Pn+"legend",Pv=Pn+"live",Dv=Pn+"inline",kv=Pn+"series",Nv=Pn+"marker",Lp=Pn+"label",Iv=Pn+"value",Wo="width",$o="height",Lo="top",Pp="bottom",xa="left",Lh="right",jd="#000",Dp=jd+"0",Ph="mousemove",kp="mousedown",Dh="mouseup",Np="mouseenter",Ip="mouseleave",Up="dblclick",Uv="resize",Fv="scroll",Fp="change",Pc="dppxchange",Kd="--",ho=typeof window<"u",ku=ho?document:null,Xa=ho?window:null,Ov=ho?navigator:null;let Ut,Pl;function Nu(){let i=devicePixelRatio;Ut!=i&&(Ut=i,Pl&&Uu(Fp,Pl,Nu),Pl=matchMedia(`(min-resolution: ${Ut-.001}dppx) and (max-resolution: ${Ut+.001}dppx)`),qr(Fp,Pl,Nu),Xa.dispatchEvent(new CustomEvent(Pc)))}function Ei(i,e){if(e!=null){let t=i.classList;!t.contains(e)&&t.add(e)}}function Iu(i,e){let t=i.classList;t.contains(e)&&t.remove(e)}function en(i,e,t){i.style[e]=t+"px"}function es(i,e,t,n){let s=ku.createElement(i);return e!=null&&Ei(s,e),t?.insertBefore(s,n),s}function Fi(i,e){return es("div",i,e)}const Op=new WeakMap;function _s(i,e,t,n,s){let r="translate("+e+"px,"+t+"px)",a=Op.get(i);r!=a&&(i.style.transform=r,Op.set(i,r),e<0||t<0||e>n||t>s?Ei(i,Hr):Iu(i,Hr))}const Bp=new WeakMap;function zp(i,e,t){let n=e+t,s=Bp.get(i);n!=s&&(Bp.set(i,n),i.style.background=e,i.style.borderColor=t)}const Hp=new WeakMap;function Vp(i,e,t,n){let s=e+""+t,r=Hp.get(i);s!=r&&(Hp.set(i,s),i.style.height=t+"px",i.style.width=e+"px",i.style.marginLeft=n?-e/2+"px":0,i.style.marginTop=n?-t/2+"px":0)}const Zd={passive:!0},Bv={...Zd,capture:!0};function qr(i,e,t,n){e.addEventListener(i,t,n?Bv:Zd)}function Uu(i,e,t,n){e.removeEventListener(i,t,Zd)}ho&&Nu();function ts(i,e,t,n){let s;t=t||0,n=n||e.length-1;let r=n<=2147483647;for(;n-t>1;)s=r?t+n>>1:Ri((t+n)/2),e[s]<i?t=s:n=s;return i-e[t]<=e[n]-i?t:n}function dg(i){return(t,n,s)=>{let r=-1,a=-1;for(let o=n;o<=s;o++)if(i(t[o])){r=o;break}for(let o=s;o>=n;o--)if(i(t[o])){a=o;break}return[r,a]}}const fg=i=>i!=null,pg=i=>i!=null&&i>0,Qc=dg(fg),zv=dg(pg);function Hv(i,e,t,n=0,s=!1){let r=s?zv:Qc,a=s?pg:fg;[e,t]=r(i,e,t);let o=i[e],c=i[e];if(e>-1)if(n==1)o=i[e],c=i[t];else if(n==-1)o=i[t],c=i[e];else for(let l=e;l<=t;l++){let h=i[l];a(h)&&(h<o?o=h:h>c&&(c=h))}return[o??Xt,c??-Xt]}function eh(i,e,t,n){let s=$p(i),r=$p(e);i==e&&(s==-1?(i*=t,e/=t):(i/=t,e*=t));let a=t==10?Hs:mg,o=s==1?Ri:Bi,c=r==1?Bi:Ri,l=o(a(An(i))),h=c(a(An(e))),d=Qa(t,l),u=Qa(t,h);return t==10&&(l<0&&(d=qt(d,-l)),h<0&&(u=qt(u,-h))),n||t==2?(i=d*s,e=u*r):(i=vg(i,d),e=th(e,u)),[i,e]}function Jd(i,e,t,n){let s=eh(i,e,t,n);return i==0&&(s[0]=0),e==0&&(s[1]=0),s}const Qd=.1,Gp={mode:3,pad:Qd},Zo={pad:0,soft:null,mode:0},Vv={min:Zo,max:Zo};function Dc(i,e,t,n){return nh(t)?Wp(i,e,t):(Zo.pad=t,Zo.soft=n?0:null,Zo.mode=n?3:0,Wp(i,e,Vv))}function kt(i,e){return i??e}function Gv(i,e,t){for(e=kt(e,0),t=kt(t,i.length-1);e<=t;){if(i[e]!=null)return!0;e++}return!1}function Wp(i,e,t){let n=t.min,s=t.max,r=kt(n.pad,0),a=kt(s.pad,0),o=kt(n.hard,-Xt),c=kt(s.hard,Xt),l=kt(n.soft,Xt),h=kt(s.soft,-Xt),d=kt(n.mode,0),u=kt(s.mode,0),f=e-i,p=Hs(f),m=ci(An(i),An(e)),_=Hs(m),g=An(_-p);(f<1e-24||g>10)&&(f=0,(i==0||e==0)&&(f=1e-24,d==2&&l!=Xt&&(r=0),u==2&&h!=-Xt&&(a=0)));let x=f||m||1e3,T=Hs(x),b=Qa(10,Ri(T)),S=x*(f==0?i==0?.1:1:r),M=qt(vg(i-S,b/10),24),A=i>=l&&(d==1||d==3&&M<=l||d==2&&M>=l)?l:Xt,v=ci(o,M<A&&i>=A?A:ss(A,M)),E=x*(f==0?e==0?.1:1:a),P=qt(th(e+E,b/10),24),D=e<=h&&(u==1||u==3&&P>=h||u==2&&P<=h)?h:-Xt,L=ss(c,P>D&&e<=D?D:ci(D,P));return v==L&&v==0&&(L=100),[v,L]}const Wv=new Intl.NumberFormat(ho?Ov.language:"en-US"),ef=i=>Wv.format(i),Di=Math,bc=Di.PI,An=Di.abs,Ri=Di.floor,En=Di.round,Bi=Di.ceil,ss=Di.min,ci=Di.max,Qa=Di.pow,$p=Di.sign,Hs=Di.log10,mg=Di.log2,$v=(i,e=1)=>Di.sinh(i)*e,kh=(i,e=1)=>Di.asinh(i/e),Xt=1/0;function Xp(i){return(Hs((i^i>>31)-(i>>31))|0)+1}function Fu(i,e,t){return ss(ci(i,e),t)}function gg(i){return typeof i=="function"}function wt(i){return gg(i)?i:()=>i}const Xv=()=>{},_g=i=>i,xg=(i,e)=>e,qv=i=>null,qp=i=>!0,Yp=(i,e)=>i==e,Yv=/\.\d*?(?=9{6,}|0{6,})/gm,Kr=i=>{if(Mg(i)||xr.has(i))return i;const e=`${i}`,t=e.match(Yv);if(t==null)return i;let n=t[0].length-1;if(e.indexOf("e-")!=-1){let[s,r]=e.split("e");return+`${Kr(s)}e${r}`}return qt(i,n)};function Br(i,e){return Kr(qt(Kr(i/e))*e)}function th(i,e){return Kr(Bi(Kr(i/e))*e)}function vg(i,e){return Kr(Ri(Kr(i/e))*e)}function qt(i,e=0){if(Mg(i))return i;let t=10**e,n=i*t*(1+Number.EPSILON);return En(n)/t}const xr=new Map;function bg(i){return((""+i).split(".")[1]||"").length}function tl(i,e,t,n){let s=[],r=n.map(bg);for(let a=e;a<t;a++){let o=An(a),c=qt(Qa(i,a),o);for(let l=0;l<n.length;l++){let h=i==10?+`${n[l]}e${a}`:n[l]*c,d=(a>=0?0:o)+(a>=r[l]?0:r[l]),u=i==10?h:qt(h,d);s.push(u),xr.set(u,d)}}return s}const Jo={},tf=[],eo=[null,null],hr=Array.isArray,Mg=Number.isInteger,jv=i=>i===void 0;function jp(i){return typeof i=="string"}function nh(i){let e=!1;if(i!=null){let t=i.constructor;e=t==null||t==Object}return e}function Kv(i){return i!=null&&typeof i=="object"}const Zv=Object.getPrototypeOf(Uint8Array),yg="__proto__";function to(i,e=nh){let t;if(hr(i)){let n=i.find(s=>s!=null);if(hr(n)||e(n)){t=Array(i.length);for(let s=0;s<i.length;s++)t[s]=to(i[s],e)}else t=i.slice()}else if(i instanceof Zv)t=i.slice();else if(e(i)){t={};for(let n in i)n!=yg&&(t[n]=to(i[n],e))}else t=i;return t}function bn(i){let e=arguments;for(let t=1;t<e.length;t++){let n=e[t];for(let s in n)s!=yg&&(nh(i[s])?bn(i[s],to(n[s])):i[s]=to(n[s]))}return i}const Jv=0,Qv=1,eb=2;function tb(i,e,t){for(let n=0,s,r=-1;n<e.length;n++){let a=e[n];if(a>r){for(s=a-1;s>=0&&i[s]==null;)i[s--]=null;for(s=a+1;s<t&&i[s]==null;)i[r=s++]=null}}}function nb(i,e){if(rb(i)){let a=i[0].slice();for(let o=1;o<i.length;o++)a.push(...i[o].slice(1));return ab(a[0])||(a=sb(a)),a}let t=new Set;for(let a=0;a<i.length;a++){let c=i[a][0],l=c.length;for(let h=0;h<l;h++)t.add(c[h])}let n=[Array.from(t).sort((a,o)=>a-o)],s=n[0].length,r=new Map;for(let a=0;a<s;a++)r.set(n[0][a],a);for(let a=0;a<i.length;a++){let o=i[a],c=o[0];for(let l=1;l<o.length;l++){let h=o[l],d=Array(s).fill(void 0),u=e?e[a][l]:Qv,f=[];for(let p=0;p<h.length;p++){let m=h[p],_=r.get(c[p]);m===null?u!=Jv&&(d[_]=m,u==eb&&f.push(_)):d[_]=m}tb(d,f,s),n.push(d)}}return n}const ib=typeof queueMicrotask>"u"?i=>Promise.resolve().then(i):queueMicrotask;function sb(i){let e=i[0],t=e.length,n=Array(t);for(let r=0;r<n.length;r++)n[r]=r;n.sort((r,a)=>e[r]-e[a]);let s=[];for(let r=0;r<i.length;r++){let a=i[r],o=Array(t);for(let c=0;c<t;c++)o[c]=a[n[c]];s.push(o)}return s}function rb(i){let e=i[0][0],t=e.length;for(let n=1;n<i.length;n++){let s=i[n][0];if(s.length!=t)return!1;if(s!=e){for(let r=0;r<t;r++)if(s[r]!=e[r])return!1}}return!0}function ab(i,e=100){const t=i.length;if(t<=1)return!0;let n=0,s=t-1;for(;n<=s&&i[n]==null;)n++;for(;s>=n&&i[s]==null;)s--;if(s<=n)return!0;const r=ci(1,Ri((s-n+1)/e));for(let a=i[n],o=n+r;o<=s;o+=r){const c=i[o];if(c!=null){if(c<=a)return!1;a=c}}return!0}const Sg=["January","February","March","April","May","June","July","August","September","October","November","December"],wg=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function Eg(i){return i.slice(0,3)}const ob=wg.map(Eg),lb=Sg.map(Eg),cb={MMMM:Sg,MMM:lb,WWWW:wg,WWW:ob};function Po(i){return(i<10?"0":"")+i}function hb(i){return(i<10?"00":i<100?"0":"")+i}const ub={YYYY:i=>i.getFullYear(),YY:i=>(i.getFullYear()+"").slice(2),MMMM:(i,e)=>e.MMMM[i.getMonth()],MMM:(i,e)=>e.MMM[i.getMonth()],MM:i=>Po(i.getMonth()+1),M:i=>i.getMonth()+1,DD:i=>Po(i.getDate()),D:i=>i.getDate(),WWWW:(i,e)=>e.WWWW[i.getDay()],WWW:(i,e)=>e.WWW[i.getDay()],HH:i=>Po(i.getHours()),H:i=>i.getHours(),h:i=>{let e=i.getHours();return e==0?12:e>12?e-12:e},AA:i=>i.getHours()>=12?"PM":"AM",aa:i=>i.getHours()>=12?"pm":"am",a:i=>i.getHours()>=12?"p":"a",mm:i=>Po(i.getMinutes()),m:i=>i.getMinutes(),ss:i=>Po(i.getSeconds()),s:i=>i.getSeconds(),fff:i=>hb(i.getMilliseconds())};function nf(i,e){e=e||cb;let t=[],n=/\{([a-z]+)\}|[^{]+/gi,s;for(;s=n.exec(i);)t.push(s[0][0]=="{"?ub[s[1]]:s[0]);return r=>{let a="";for(let o=0;o<t.length;o++)a+=typeof t[o]=="string"?t[o]:t[o](r,e);return a}}const db=new Intl.DateTimeFormat().resolvedOptions().timeZone;function fb(i,e){let t;return e=="UTC"||e=="Etc/UTC"?t=new Date(+i+i.getTimezoneOffset()*6e4):e==db?t=i:(t=new Date(i.toLocaleString("en-US",{timeZone:e})),t.setMilliseconds(i.getMilliseconds())),t}const Tg=i=>i%1==0,kc=[1,2,2.5,5],pb=tl(10,-32,0,kc),Ag=tl(10,0,32,kc),mb=Ag.filter(Tg),zr=pb.concat(Ag),sf=`
`,Rg="{YYYY}",Kp=sf+Rg,Cg="{M}/{D}",Xo=sf+Cg,Dl=Xo+"/{YY}",Lg="{aa}",gb="{h}:{mm}",za=gb+Lg,Zp=sf+za,Jp=":{ss}",Bt=null;function Pg(i){let e=i*1e3,t=e*60,n=t*60,s=n*24,r=s*30,a=s*365,c=(i==1?tl(10,0,3,kc).filter(Tg):tl(10,-3,0,kc)).concat([e,e*5,e*10,e*15,e*30,t,t*5,t*10,t*15,t*30,n,n*2,n*3,n*4,n*6,n*8,n*12,s,s*2,s*3,s*4,s*5,s*6,s*7,s*8,s*9,s*10,s*15,r,r*2,r*3,r*4,r*6,a,a*2,a*5,a*10,a*25,a*50,a*100]);const l=[[a,Rg,Bt,Bt,Bt,Bt,Bt,Bt,1],[s*28,"{MMM}",Kp,Bt,Bt,Bt,Bt,Bt,1],[s,Cg,Kp,Bt,Bt,Bt,Bt,Bt,1],[n,"{h}"+Lg,Dl,Bt,Xo,Bt,Bt,Bt,1],[t,za,Dl,Bt,Xo,Bt,Bt,Bt,1],[e,Jp,Dl+" "+za,Bt,Xo+" "+za,Bt,Zp,Bt,1],[i,Jp+".{fff}",Dl+" "+za,Bt,Xo+" "+za,Bt,Zp,Bt,1]];function h(d){return(u,f,p,m,_,g)=>{let x=[],T=_>=a,b=_>=r&&_<a,S=d(p),M=qt(S*i,3),A=Nh(S.getFullYear(),T?0:S.getMonth(),b||T?1:S.getDate()),v=qt(A*i,3);if(b||T){let E=b?_/r:0,P=T?_/a:0,D=M==v?M:qt(Nh(A.getFullYear()+P,A.getMonth()+E,1)*i,3),L=new Date(En(D/i)),k=L.getFullYear(),U=L.getMonth();for(let O=0;D<=m;O++){let X=Nh(k+P*O,U+E*O,1),z=X-d(qt(X*i,3));D=qt((+X+z)*i,3),D<=m&&x.push(D)}}else{let E=_>=s?s:_,P=Ri(p)-Ri(M),D=v+P+th(M-v,E);x.push(D);let L=d(D),k=L.getHours()+L.getMinutes()/t+L.getSeconds()/n,U=_/n,O=u.axes[f]._space,X=g/O;for(;D=qt(D+_,i==1?0:3),!(D>m);)if(U>1){let z=Ri(qt(k+U,6))%24,te=d(D).getHours()-z;te>1&&(te=-1),D-=te*n,k=(k+U)%24;let H=x[x.length-1];qt((D-H)/_,3)*X>=.7&&x.push(D)}else x.push(D)}return x}}return[c,l,h]}const[_b,xb,vb]=Pg(1),[bb,Mb,yb]=Pg(.001);tl(2,-53,53,[1]);function Qp(i,e){return i.map(t=>t.map((n,s)=>s==0||s==8||n==null?n:e(s==1||t[8]==0?n:t[1]+n)))}function em(i,e){return(t,n,s,r,a)=>{let o=e.find(p=>a>=p[0])||e[e.length-1],c,l,h,d,u,f;return n.map(p=>{let m=i(p),_=m.getFullYear(),g=m.getMonth(),x=m.getDate(),T=m.getHours(),b=m.getMinutes(),S=m.getSeconds(),M=_!=c&&o[2]||g!=l&&o[3]||x!=h&&o[4]||T!=d&&o[5]||b!=u&&o[6]||S!=f&&o[7]||o[1];return c=_,l=g,h=x,d=T,u=b,f=S,M(m)})}}function Sb(i,e){let t=nf(e);return(n,s,r,a,o)=>s.map(c=>t(i(c)))}function Nh(i,e,t){return new Date(i,e,t)}function tm(i,e){return e(i)}const wb="{YYYY}-{MM}-{DD} {h}:{mm}{aa}";function nm(i,e){return(t,n,s,r)=>r==null?Kd:e(i(n))}function Eb(i,e){let t=i.series[e];return t.width?t.stroke(i,e):t.points.width?t.points.stroke(i,e):null}function Tb(i,e){return i.series[e].fill(i,e)}const Ab={show:!0,live:!0,isolate:!1,mount:Xv,markers:{show:!0,width:2,stroke:Eb,fill:Tb,dash:"solid"},idx:null,idxs:null,values:[]};function Rb(i,e){let t=i.cursor.points,n=Fi(),s=t.size(i,e);en(n,Wo,s),en(n,$o,s);let r=s/-2;en(n,"marginLeft",r),en(n,"marginTop",r);let a=t.width(i,e,s);return a&&en(n,"borderWidth",a),n}function Cb(i,e){let t=i.series[e].points;return t._fill||t._stroke}function Lb(i,e){let t=i.series[e].points;return t._stroke||t._fill}function Pb(i,e){return i.series[e].points.size}const Ih=[0,0];function Db(i,e,t){return Ih[0]=e,Ih[1]=t,Ih}function kl(i,e,t,n=!0){return s=>{s.button==0&&(!n||s.target==e)&&t(s)}}function Uh(i,e,t,n=!0){return s=>{(!n||s.target==e)&&t(s)}}const kb={show:!0,x:!0,y:!0,lock:!1,move:Db,points:{one:!1,show:Rb,size:Pb,width:0,stroke:Lb,fill:Cb},bind:{mousedown:kl,mouseup:kl,click:kl,dblclick:kl,mousemove:Uh,mouseleave:Uh,mouseenter:Uh},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(i,e)=>{e.stopPropagation(),e.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(i,e,t,n,s)=>n-s,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},Dg={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},rf=bn({},Dg,{filter:xg}),kg=bn({},rf,{size:10}),Ng=bn({},Dg,{show:!1}),af='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',Ig="bold "+af,Ug=1.5,im={show:!0,scale:"x",stroke:jd,space:50,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:Ig,side:2,grid:rf,ticks:kg,border:Ng,font:af,lineGap:Ug,rotate:0},Nb="Value",Ib="Time",sm={show:!0,scale:"x",auto:!1,sorted:1,min:Xt,max:-Xt,idxs:[]};function Ub(i,e,t,n,s){return e.map(r=>r==null?"":ef(r))}function Fb(i,e,t,n,s,r,a){let o=[],c=xr.get(s)||0;t=a?t:qt(th(t,s),c);for(let l=t;l<=n;l=qt(l+s,c))o.push(Object.is(l,-0)?0:l);return o}function Ou(i,e,t,n,s,r,a){const o=[],c=i.scales[i.axes[e].scale].log,l=c==10?Hs:mg,h=Ri(l(t));s=Qa(c,h),c==10&&(s=zr[ts(s,zr)]);let d=t,u=s*c;c==10&&(u=zr[ts(u,zr)]);do o.push(d),d=d+s,c==10&&!xr.has(d)&&(d=qt(d,xr.get(s))),d>=u&&(s=d,u=s*c,c==10&&(u=zr[ts(u,zr)]));while(d<=n);return o}function Ob(i,e,t,n,s,r,a){let c=i.scales[i.axes[e].scale].asinh,l=n>c?Ou(i,e,ci(c,t),n,s):[c],h=n>=0&&t<=0?[0]:[];return(t<-c?Ou(i,e,ci(c,-n),-t,s):[c]).reverse().map(u=>-u).concat(h,l)}const Fg=/./,Bb=/[12357]/,zb=/[125]/,rm=/1/,Bu=(i,e,t,n)=>i.map((s,r)=>e==4&&s==0||r%n==0&&t.test(s.toExponential()[s<0?1:0])?s:null);function Hb(i,e,t,n,s){let r=i.axes[t],a=r.scale,o=i.scales[a],c=i.valToPos,l=r._space,h=c(10,a),d=c(9,a)-h>=l?Fg:c(7,a)-h>=l?Bb:c(5,a)-h>=l?zb:rm;if(d==rm){let u=An(c(1,a)-h);if(u<l)return Bu(e.slice().reverse(),o.distr,d,Bi(l/u)).reverse()}return Bu(e,o.distr,d,1)}function Vb(i,e,t,n,s){let r=i.axes[t],a=r.scale,o=r._space,c=i.valToPos,l=An(c(1,a)-c(2,a));return l<o?Bu(e.slice().reverse(),3,Fg,Bi(o/l)).reverse():e}function Gb(i,e,t,n){return n==null?Kd:e==null?"":ef(e)}const am={show:!0,scale:"y",stroke:jd,space:30,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:Ig,side:3,grid:rf,ticks:kg,border:Ng,font:af,lineGap:Ug,rotate:0};function Wb(i,e){let t=3+(i||1)*2;return qt(t*e,3)}function $b(i,e){let{scale:t,idxs:n}=i.series[0],s=i._data[0],r=i.valToPos(s[n[0]],t,!0),a=i.valToPos(s[n[1]],t,!0),o=An(a-r),c=i.series[e],l=o/(c.points.space*Ut);return n[1]-n[0]<=l}const om={scale:null,auto:!0,sorted:0,min:Xt,max:-Xt},Og=(i,e,t,n,s)=>s,lm={show:!0,auto:!0,sorted:0,gaps:Og,alpha:1,facets:[bn({},om,{scale:"x"}),bn({},om,{scale:"y"})]},cm={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:Og,alpha:1,points:{show:$b,filter:null},values:null,min:Xt,max:-Xt,idxs:[],path:null,clip:null};function Xb(i,e,t,n,s){return t/10}const Bg={time:_v,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},qb=bn({},Bg,{time:!1,ori:1}),hm={};function zg(i,e){let t=hm[i];return t||(t={key:i,plots:[],sub(n){t.plots.push(n)},unsub(n){t.plots=t.plots.filter(s=>s!=n)},pub(n,s,r,a,o,c,l){for(let h=0;h<t.plots.length;h++)t.plots[h]!=s&&t.plots[h].pub(n,s,r,a,o,c,l)}},i!=null&&(hm[i]=t)),t}const no=1,zu=2;function ra(i,e,t){const n=i.mode,s=i.series[e],r=n==2?i._data[e]:i._data,a=i.scales,o=i.bbox;let c=r[0],l=n==2?r[1]:r[e],h=n==2?a[s.facets[0].scale]:a[i.series[0].scale],d=n==2?a[s.facets[1].scale]:a[s.scale],u=o.left,f=o.top,p=o.width,m=o.height,_=i.valToPosH,g=i.valToPosV;return h.ori==0?t(s,c,l,h,d,_,g,u,f,p,m,sh,uo,ah,Vg,Wg):t(s,c,l,h,d,g,_,f,u,m,p,rh,fo,cf,Gg,$g)}function of(i,e){let t=0,n=0,s=kt(i.bands,tf);for(let r=0;r<s.length;r++){let a=s[r];a.series[0]==e?t=a.dir:a.series[1]==e&&(a.dir==1?n|=1:n|=2)}return[t,n==1?-1:n==2?1:n==3?2:0]}function Yb(i,e,t,n,s){let r=i.mode,a=i.series[e],o=r==2?a.facets[1].scale:a.scale,c=i.scales[o];return s==-1?c.min:s==1?c.max:c.distr==3?c.dir==1?c.min:c.max:0}function Vs(i,e,t,n,s,r){return ra(i,e,(a,o,c,l,h,d,u,f,p,m,_)=>{let g=a.pxRound;const x=l.dir*(l.ori==0?1:-1),T=l.ori==0?uo:fo;let b,S;x==1?(b=t,S=n):(b=n,S=t);let M=g(d(o[b],l,m,f)),A=g(u(c[b],h,_,p)),v=g(d(o[S],l,m,f)),E=g(u(r==1?h.max:h.min,h,_,p)),P=new Path2D(s);return T(P,v,E),T(P,M,E),T(P,M,A),P})}function ih(i,e,t,n,s,r){let a=null;if(i.length>0){a=new Path2D;const o=e==0?ah:cf;let c=t;for(let d=0;d<i.length;d++){let u=i[d];if(u[1]>u[0]){let f=u[0]-c;f>0&&o(a,c,n,f,n+r),c=u[1]}}let l=t+s-c,h=10;l>0&&o(a,c,n-h/2,l,n+r+h)}return a}function jb(i,e,t){let n=i[i.length-1];n&&n[0]==e?n[1]=t:i.push([e,t])}function lf(i,e,t,n,s,r,a){let o=[],c=i.length;for(let l=s==1?t:n;l>=t&&l<=n;l+=s)if(e[l]===null){let d=l,u=l;if(s==1)for(;++l<=n&&e[l]===null;)u=l;else for(;--l>=t&&e[l]===null;)u=l;let f=r(i[d]),p=u==d?f:r(i[u]),m=d-s;f=a<=0&&m>=0&&m<c?r(i[m]):f;let g=u+s;p=a>=0&&g>=0&&g<c?r(i[g]):p,p>=f&&o.push([f,p])}return o}function um(i){return i==0?_g:i==1?En:e=>Br(e,i)}function Hg(i){let e=i==0?sh:rh,t=i==0?(s,r,a,o,c,l)=>{s.arcTo(r,a,o,c,l)}:(s,r,a,o,c,l)=>{s.arcTo(a,r,c,o,l)},n=i==0?(s,r,a,o,c)=>{s.rect(r,a,o,c)}:(s,r,a,o,c)=>{s.rect(a,r,c,o)};return(s,r,a,o,c,l=0,h=0)=>{l==0&&h==0?n(s,r,a,o,c):(l=ss(l,o/2,c/2),h=ss(h,o/2,c/2),e(s,r+l,a),t(s,r+o,a,r+o,a+c,l),t(s,r+o,a+c,r,a+c,h),t(s,r,a+c,r,a,h),t(s,r,a,r+o,a,l),s.closePath())}}const sh=(i,e,t)=>{i.moveTo(e,t)},rh=(i,e,t)=>{i.moveTo(t,e)},uo=(i,e,t)=>{i.lineTo(e,t)},fo=(i,e,t)=>{i.lineTo(t,e)},ah=Hg(0),cf=Hg(1),Vg=(i,e,t,n,s,r)=>{i.arc(e,t,n,s,r)},Gg=(i,e,t,n,s,r)=>{i.arc(t,e,n,s,r)},Wg=(i,e,t,n,s,r,a)=>{i.bezierCurveTo(e,t,n,s,r,a)},$g=(i,e,t,n,s,r,a)=>{i.bezierCurveTo(t,e,s,n,a,r)};function Xg(i){return(e,t,n,s,r)=>ra(e,t,(a,o,c,l,h,d,u,f,p,m,_)=>{let{pxRound:g,points:x}=a,T,b;l.ori==0?(T=sh,b=Vg):(T=rh,b=Gg);const S=qt(x.width*Ut,3);let M=(x.size-x.width)/2*Ut,A=qt(M*2,3),v=new Path2D,E=new Path2D,{left:P,top:D,width:L,height:k}=e.bbox;ah(E,P-A,D-A,L+A*2,k+A*2);const U=O=>{if(c[O]!=null){let X=g(d(o[O],l,m,f)),z=g(u(c[O],h,_,p));T(v,X+M,z),b(v,X,z,M,0,bc*2)}};if(r)r.forEach(U);else for(let O=n;O<=s;O++)U(O);return{stroke:S>0?v:null,fill:v,clip:E,flags:no|zu}})}function qg(i){return(e,t,n,s,r,a)=>{n!=s&&(r!=n&&a!=n&&i(e,t,n),r!=s&&a!=s&&i(e,t,s),i(e,t,a))}}const Kb=qg(uo),Zb=qg(fo);function Yg(i){const e=kt(i?.alignGaps,0);return(t,n,s,r)=>ra(t,n,(a,o,c,l,h,d,u,f,p,m,_)=>{[s,r]=Qc(c,s,r);let g=a.pxRound,x=k=>g(d(k,l,m,f)),T=k=>g(u(k,h,_,p)),b,S;l.ori==0?(b=uo,S=Kb):(b=fo,S=Zb);const M=l.dir*(l.ori==0?1:-1),A={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:no},v=A.stroke;let E=!1;if(r-s>=m*4){let k=se=>t.posToVal(se,l.key,!0),U=null,O=null,X,z,re,q=x(o[M==1?s:r]),te=x(o[s]),H=x(o[r]),J=k(M==1?te+1:H-1);for(let se=M==1?s:r;se>=s&&se<=r;se+=M){let Qe=o[se],Xe=(M==1?Qe<J:Qe>J)?q:x(Qe),Z=c[se];Xe==q?Z!=null?(z=Z,U==null?(b(v,Xe,T(z)),X=U=O=z):z<U?U=z:z>O&&(O=z)):Z===null&&(E=!0):(U!=null&&S(v,q,T(U),T(O),T(X),T(z)),Z!=null?(z=Z,b(v,Xe,T(z)),U=O=X=z):(U=O=null,Z===null&&(E=!0)),q=Xe,J=k(q+M))}U!=null&&U!=O&&re!=q&&S(v,q,T(U),T(O),T(X),T(z))}else for(let k=M==1?s:r;k>=s&&k<=r;k+=M){let U=c[k];U===null?E=!0:U!=null&&b(v,x(o[k]),T(U))}let[D,L]=of(t,n);if(a.fill!=null||D!=0){let k=A.fill=new Path2D(v),U=a.fillTo(t,n,a.min,a.max,D),O=T(U),X=x(o[s]),z=x(o[r]);M==-1&&([z,X]=[X,z]),b(k,z,O),b(k,X,O)}if(!a.spanGaps){let k=[];E&&k.push(...lf(o,c,s,r,M,x,e)),A.gaps=k=a.gaps(t,n,s,r,k),A.clip=ih(k,l.ori,f,p,m,_)}return L!=0&&(A.band=L==2?[Vs(t,n,s,r,v,-1),Vs(t,n,s,r,v,1)]:Vs(t,n,s,r,v,L)),A})}function Jb(i){const e=kt(i.align,1),t=kt(i.ascDesc,!1),n=kt(i.alignGaps,0),s=kt(i.extend,!1);return(r,a,o,c)=>ra(r,a,(l,h,d,u,f,p,m,_,g,x,T)=>{[o,c]=Qc(d,o,c);let b=l.pxRound,{left:S,width:M}=r.bbox,A=te=>b(p(te,u,x,_)),v=te=>b(m(te,f,T,g)),E=u.ori==0?uo:fo;const P={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:no},D=P.stroke,L=u.dir*(u.ori==0?1:-1);let k=v(d[L==1?o:c]),U=A(h[L==1?o:c]),O=U,X=U;s&&e==-1&&(X=S,E(D,X,k)),E(D,U,k);for(let te=L==1?o:c;te>=o&&te<=c;te+=L){let H=d[te];if(H==null)continue;let J=A(h[te]),se=v(H);e==1?E(D,J,k):E(D,O,se),E(D,J,se),k=se,O=J}let z=O;s&&e==1&&(z=S+M,E(D,z,k));let[re,q]=of(r,a);if(l.fill!=null||re!=0){let te=P.fill=new Path2D(D),H=l.fillTo(r,a,l.min,l.max,re),J=v(H);E(te,z,J),E(te,X,J)}if(!l.spanGaps){let te=[];te.push(...lf(h,d,o,c,L,A,n));let H=l.width*Ut/2,J=t||e==1?H:-H,se=t||e==-1?-H:H;te.forEach(Qe=>{Qe[0]+=J,Qe[1]+=se}),P.gaps=te=l.gaps(r,a,o,c,te),P.clip=ih(te,u.ori,_,g,x,T)}return q!=0&&(P.band=q==2?[Vs(r,a,o,c,D,-1),Vs(r,a,o,c,D,1)]:Vs(r,a,o,c,D,q)),P})}function dm(i,e,t,n,s,r,a=Xt){if(i.length>1){let o=null;for(let c=0,l=1/0;c<i.length;c++)if(e[c]!==void 0){if(o!=null){let h=An(i[c]-i[o]);h<l&&(l=h,a=An(t(i[c],n,s,r)-t(i[o],n,s,r)))}o=c}}return a}function Qb(i){i=i||Jo;const e=kt(i.size,[.6,Xt,1]),t=i.align||0,n=i.gap||0;let s=i.radius;s=s==null?[0,0]:typeof s=="number"?[s,0]:s;const r=wt(s),a=1-e[0],o=kt(e[1],Xt),c=kt(e[2],1),l=kt(i.disp,Jo),h=kt(i.each,f=>{}),{fill:d,stroke:u}=l;return(f,p,m,_)=>ra(f,p,(g,x,T,b,S,M,A,v,E,P,D)=>{let L=g.pxRound,k=t,U=n*Ut,O=o*Ut,X=c*Ut,z,re;b.ori==0?[z,re]=r(f,p):[re,z]=r(f,p);const q=b.dir*(b.ori==0?1:-1);let te=b.ori==0?ah:cf,H=b.ori==0?h:(ge,N,w,j,ne,oe,ve)=>{h(ge,N,w,ne,j,ve,oe)},J=kt(f.bands,tf).find(ge=>ge.series[0]==p),se=J!=null?J.dir:0,Qe=g.fillTo(f,p,g.min,g.max,se),it=L(A(Qe,S,D,E)),Xe,Z,he,Ee=P,Ue=L(g.width*Ut),Te=!1,ue=null,pe=null,_e=null,Ge=null;d!=null&&(Ue==0||u!=null)&&(Te=!0,ue=d.values(f,p,m,_),pe=new Map,new Set(ue).forEach(ge=>{ge!=null&&pe.set(ge,new Path2D)}),Ue>0&&(_e=u.values(f,p,m,_),Ge=new Map,new Set(_e).forEach(ge=>{ge!=null&&Ge.set(ge,new Path2D)})));let{x0:ze,size:He}=l;if(ze!=null&&He!=null){k=1,x=ze.values(f,p,m,_),ze.unit==2&&(x=x.map(w=>f.posToVal(v+w*P,b.key,!0)));let ge=He.values(f,p,m,_);He.unit==2?Z=ge[0]*P:Z=M(ge[0],b,P,v)-M(0,b,P,v),Ee=dm(x,T,M,b,P,v,Ee),he=Ee-Z+U}else Ee=dm(x,T,M,b,P,v,Ee),he=Ee*a+U,Z=Ee-he;he<1&&(he=0),Ue>=Z/2&&(Ue=0),he<5&&(L=_g);let ot=he>0,Tt=Ee-he-(ot?Ue:0);Z=L(Fu(Tt,X,O)),Xe=(k==0?Z/2:k==q?0:Z)-k*q*((k==0?U/2:0)+(ot?Ue/2:0));const rt={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},gt=Te?null:new Path2D;let bt=null;if(J!=null)bt=f.data[J.series[1]];else{let{y0:ge,y1:N}=l;ge!=null&&N!=null&&(T=N.values(f,p,m,_),bt=ge.values(f,p,m,_))}let V=z*Z,Ke=re*Z;for(let ge=q==1?m:_;ge>=m&&ge<=_;ge+=q){let N=T[ge];if(N==null)continue;if(bt!=null){let ce=bt[ge]??0;if(N-ce==0)continue;it=A(ce,S,D,E)}let w=b.distr!=2||l!=null?x[ge]:ge,j=M(w,b,P,v),ne=A(kt(N,Qe),S,D,E),oe=L(j-Xe),ve=L(ci(ne,it)),Me=L(ss(ne,it)),le=ve-Me;if(N!=null){let ce=N<0?Ke:V,ye=N<0?V:Ke;Te?(Ue>0&&_e[ge]!=null&&te(Ge.get(_e[ge]),oe,Me+Ri(Ue/2),Z,ci(0,le-Ue),ce,ye),ue[ge]!=null&&te(pe.get(ue[ge]),oe,Me+Ri(Ue/2),Z,ci(0,le-Ue),ce,ye)):te(gt,oe,Me+Ri(Ue/2),Z,ci(0,le-Ue),ce,ye),H(f,p,ge,oe-Ue/2,Me,Z+Ue,le)}}return Ue>0?rt.stroke=Te?Ge:gt:Te||(rt._fill=g.width==0?g._fill:g._stroke??g._fill,rt.width=0),rt.fill=Te?pe:gt,rt})}function eM(i,e){const t=kt(e?.alignGaps,0);return(n,s,r,a)=>ra(n,s,(o,c,l,h,d,u,f,p,m,_,g)=>{[r,a]=Qc(l,r,a);let x=o.pxRound,T=z=>x(u(z,h,_,p)),b=z=>x(f(z,d,g,m)),S,M,A;h.ori==0?(S=sh,A=uo,M=Wg):(S=rh,A=fo,M=$g);const v=h.dir*(h.ori==0?1:-1);let E=T(c[v==1?r:a]),P=E,D=[],L=[];for(let z=v==1?r:a;z>=r&&z<=a;z+=v)if(l[z]!=null){let q=c[z],te=T(q);D.push(P=te),L.push(b(l[z]))}const k={stroke:i(D,L,S,A,M,x),fill:null,clip:null,band:null,gaps:null,flags:no},U=k.stroke;let[O,X]=of(n,s);if(o.fill!=null||O!=0){let z=k.fill=new Path2D(U),re=o.fillTo(n,s,o.min,o.max,O),q=b(re);A(z,P,q),A(z,E,q)}if(!o.spanGaps){let z=[];z.push(...lf(c,l,r,a,v,T,t)),k.gaps=z=o.gaps(n,s,r,a,z),k.clip=ih(z,h.ori,p,m,_,g)}return X!=0&&(k.band=X==2?[Vs(n,s,r,a,U,-1),Vs(n,s,r,a,U,1)]:Vs(n,s,r,a,U,X)),k})}function tM(i){return eM(nM,i)}function nM(i,e,t,n,s,r){const a=i.length;if(a<2)return null;const o=new Path2D;if(t(o,i[0],e[0]),a==2)n(o,i[1],e[1]);else{let c=Array(a),l=Array(a-1),h=Array(a-1),d=Array(a-1);for(let u=0;u<a-1;u++)h[u]=e[u+1]-e[u],d[u]=i[u+1]-i[u],l[u]=h[u]/d[u];c[0]=l[0];for(let u=1;u<a-1;u++)l[u]===0||l[u-1]===0||l[u-1]>0!=l[u]>0?c[u]=0:(c[u]=3*(d[u-1]+d[u])/((2*d[u]+d[u-1])/l[u-1]+(d[u]+2*d[u-1])/l[u]),isFinite(c[u])||(c[u]=0));c[a-1]=l[a-2];for(let u=0;u<a-1;u++)s(o,i[u]+d[u]/3,e[u]+c[u]*d[u]/3,i[u+1]-d[u]/3,e[u+1]-c[u+1]*d[u]/3,i[u+1],e[u+1])}return o}const Hu=new Set;function fm(){for(let i of Hu)i.syncRect(!0)}ho&&(qr(Uv,Xa,fm),qr(Fv,Xa,fm,!0),qr(Pc,Xa,()=>{qn.pxRatio=Ut}));const iM=Yg(),sM=Xg();function pm(i,e,t,n){return(n?[i[0],i[1]].concat(i.slice(2)):[i[0]].concat(i.slice(1))).map((r,a)=>Vu(r,a,e,t))}function rM(i,e){return i.map((t,n)=>n==0?{}:bn({},e,t))}function Vu(i,e,t,n){return bn({},e==0?t:n,i)}function jg(i,e,t){return e==null?eo:[e,t]}const aM=jg;function oM(i,e,t){return e==null?eo:Dc(e,t,Qd,!0)}function Kg(i,e,t,n){return e==null?eo:eh(e,t,i.scales[n].log,!1)}const lM=Kg;function Zg(i,e,t,n){return e==null?eo:Jd(e,t,i.scales[n].log,!1)}const cM=Zg;function hM(i,e,t,n,s){let r=ci(Xp(i),Xp(e)),a=e-i,o=ts(s/n*a,t);do{let c=t[o],l=n*c/a;if(l>=s&&r+(c<5?xr.get(c):0)<=17)return[c,l]}while(++o<t.length);return[0,0]}function mm(i){let e,t;return i=i.replace(/(\d+)px/,(n,s)=>(e=En((t=+s)*Ut))+"px"),[i,e,t]}function uM(i){i.show&&[i.font,i.labelFont].forEach(e=>{let t=qt(e[2]*Ut,1);e[0]=e[0].replace(/[0-9.]+px/,t+"px"),e[1]=t})}function qn(i,e,t){const n={mode:kt(i.mode,1)},s=n.mode;function r(y,C,I,F){let W=C.valToPct(y);return F+I*(C.dir==-1?1-W:W)}function a(y,C,I,F){let W=C.valToPct(y);return F+I*(C.dir==-1?W:1-W)}function o(y,C,I,F){return C.ori==0?r(y,C,I,F):a(y,C,I,F)}n.valToPosH=r,n.valToPosV=a;let c=!1;n.status=0;const l=n.root=Fi(xv);if(i.id!=null&&(l.id=i.id),Ei(l,i.class),i.title){let y=Fi(Mv,l);y.textContent=i.title}const h=es("canvas"),d=n.ctx=h.getContext("2d"),u=Fi(yv,l);qr("click",u,y=>{y.target===p&&(Zt!=fa||nn!=pa)&&Vn.click(n,y)},!0);const f=n.under=Fi(Sv,u);u.appendChild(h);const p=n.over=Fi(wv,u);i=to(i);const m=+kt(i.pxAlign,1),_=um(m);(i.plugins||[]).forEach(y=>{y.opts&&(i=y.opts(n,i)||i)});const g=i.ms||.001,x=n.series=s==1?pm(i.series||[],sm,cm,!1):rM(i.series||[null],lm),T=n.axes=pm(i.axes||[],im,am,!0),b=n.scales={},S=n.bands=i.bands||[];S.forEach(y=>{y.fill=wt(y.fill||null),y.dir=kt(y.dir,-1)});const M=s==2?x[1].facets[0].scale:x[0].scale,A={axes:us,series:Wt},v=(i.drawOrder||["axes","series"]).map(y=>A[y]);function E(y){const C=y.distr==3?I=>Hs(I>0?I:y.clamp(n,I,y.min,y.max,y.key)):y.distr==4?I=>kh(I,y.asinh):y.distr==100?I=>y.fwd(I):I=>I;return I=>{let F=C(I),{_min:W,_max:ie}=y,fe=ie-W;return(F-W)/fe}}function P(y){let C=b[y];if(C==null){let I=(i.scales||Jo)[y]||Jo;if(I.from!=null){P(I.from);let F=bn({},b[I.from],I,{key:y});F.valToPct=E(F),b[y]=F}else{C=b[y]=bn({},y==M?Bg:qb,I),C.key=y;let F=C.time,W=C.range,ie=hr(W);if((y!=M||s==2&&!F)&&(ie&&(W[0]==null||W[1]==null)&&(W={min:W[0]==null?Gp:{mode:1,hard:W[0],soft:W[0]},max:W[1]==null?Gp:{mode:1,hard:W[1],soft:W[1]}},ie=!1),!ie&&nh(W))){let fe=W;W=(xe,Se,Ie)=>Se==null?eo:Dc(Se,Ie,fe)}C.range=wt(W||(F?aM:y==M?C.distr==3?lM:C.distr==4?cM:jg:C.distr==3?Kg:C.distr==4?Zg:oM)),C.auto=wt(ie?!1:C.auto),C.clamp=wt(C.clamp||Xb),C._min=C._max=null,C.valToPct=E(C)}}}P("x"),P("y"),s==1&&x.forEach(y=>{P(y.scale)}),T.forEach(y=>{P(y.scale)});for(let y in i.scales)P(y);const D=b[M],L=D.distr;let k,U;D.ori==0?(Ei(l,vv),k=r,U=a):(Ei(l,bv),k=a,U=r);const O={};for(let y in b){let C=b[y];(C.min!=null||C.max!=null)&&(O[y]={min:C.min,max:C.max},C.min=C.max=null)}const X=i.tzDate||(y=>new Date(En(y/g))),z=i.fmtDate||nf,re=g==1?vb(X):yb(X),q=em(X,Qp(g==1?xb:Mb,z)),te=nm(X,tm(wb,z)),H=[],J=n.legend=bn({},Ab,i.legend),se=n.cursor=bn({},kb,{drag:{y:s==2}},i.cursor),Qe=J.show,it=se.show,Xe=J.markers;J.idxs=H,Xe.width=wt(Xe.width),Xe.dash=wt(Xe.dash),Xe.stroke=wt(Xe.stroke),Xe.fill=wt(Xe.fill);let Z,he,Ee,Ue=[],Te=[],ue,pe=!1,_e={};if(J.live){const y=x[1]?x[1].values:null;pe=y!=null,ue=pe?y(n,1,0):{_:0};for(let C in ue)_e[C]=Kd}if(Qe)if(Z=es("table",Lv,l),Ee=es("tbody",null,Z),J.mount(n,Z),pe){he=es("thead",null,Z,Ee);let y=es("tr",null,he);es("th",null,y);for(var Ge in ue)es("th",Lp,y).textContent=Ge}else Ei(Z,Dv),J.live&&Ei(Z,Pv);const ze={show:!0},He={show:!1};function ot(y,C){if(C==0&&(pe||!J.live||s==2))return eo;let I=[],F=es("tr",kv,Ee,Ee.childNodes[C]);Ei(F,y.class),y.show||Ei(F,Hr);let W=es("th",null,F);if(Xe.show){let xe=Fi(Nv,W);if(C>0){let Se=Xe.width(n,C);Se&&(xe.style.border=Se+"px "+Xe.dash(n,C)+" "+Xe.stroke(n,C)),xe.style.background=Xe.fill(n,C)}}let ie=Fi(Lp,W);y.label instanceof HTMLElement?ie.appendChild(y.label):ie.textContent=y.label,C>0&&(Xe.show||(ie.style.color=y.width>0?Xe.stroke(n,C):Xe.fill(n,C)),rt("click",W,xe=>{if(se._lock)return;We(xe);let Se=x.indexOf(y);if((xe.ctrlKey||xe.metaKey)!=J.isolate){let Ie=x.some((Oe,$e)=>$e>0&&$e!=Se&&Oe.show);x.forEach((Oe,$e)=>{$e>0&&fs($e,Ie?$e==Se?ze:He:ze,!0,xn.setSeries)})}else fs(Se,{show:!y.show},!0,xn.setSeries)},!1),Dn&&rt(Np,W,xe=>{se._lock||(We(xe),fs(x.indexOf(y),ga,!0,xn.setSeries))},!1));for(var fe in ue){let xe=es("td",Iv,F);xe.textContent="--",I.push(xe)}return[F,I]}const Tt=new Map;function rt(y,C,I,F=!0){const W=Tt.get(C)||{},ie=se.bind[y](n,C,I,F);ie&&(qr(y,C,W[y]=ie),Tt.set(C,W))}function gt(y,C,I){const F=Tt.get(C)||{};for(let W in F)(y==null||W==y)&&(Uu(W,C,F[W]),delete F[W]);y==null&&Tt.delete(C)}let bt=0,V=0,Ke=0,ge=0,N=0,w=0,j=N,ne=w,oe=Ke,ve=ge,Me=0,le=0,ce=0,ye=0;n.bbox={};let Ze=!1,Ae=!1,we=!1,qe=!1,nt=!1,st=!1;function $(y,C,I){(I||y!=n.width||C!=n.height)&&Re(y,C),Rt(!1),we=!0,Ae=!0,ha()}function Re(y,C){n.width=bt=Ke=y,n.height=V=ge=C,N=w=0,me(),et();let I=n.bbox;Me=I.left=Br(N*Ut,.5),le=I.top=Br(w*Ut,.5),ce=I.width=Br(Ke*Ut,.5),ye=I.height=Br(ge*Ut,.5)}const de=3;function Ce(){let y=!1,C=0;for(;!y;){C++;let I=Ot(C),F=on(C);y=C==de||I&&F,y||(Re(n.width,n.height),Ae=!0)}}function Ne({width:y,height:C}){$(y,C)}n.setSize=Ne;function me(){let y=!1,C=!1,I=!1,F=!1;T.forEach((W,ie)=>{if(W.show&&W._show){let{side:fe,_size:xe}=W,Se=fe%2,Ie=W.label!=null?W.labelSize:0,Oe=xe+Ie;Oe>0&&(Se?(Ke-=Oe,fe==3?(N+=Oe,F=!0):I=!0):(ge-=Oe,fe==0?(w+=Oe,y=!0):C=!0))}}),Qn[0]=y,Qn[1]=I,Qn[2]=C,Qn[3]=F,Ke-=gi[1]+gi[3],N+=gi[3],ge-=gi[2]+gi[0],w+=gi[0]}function et(){let y=N+Ke,C=w+ge,I=N,F=w;function W(ie,fe){switch(ie){case 1:return y+=fe,y-fe;case 2:return C+=fe,C-fe;case 3:return I-=fe,I+fe;case 0:return F-=fe,F+fe}}T.forEach((ie,fe)=>{if(ie.show&&ie._show){let xe=ie.side;ie._pos=W(xe,ie._size),ie.label!=null&&(ie._lpos=W(xe,ie.labelSize))}})}if(se.dataIdx==null){let y=se.hover,C=y.skip=new Set(y.skip??[]);C.add(void 0);let I=y.prox=wt(y.prox),F=y.bias??=0;se.dataIdx=(W,ie,fe,xe)=>{if(ie==0)return fe;let Se=fe,Ie=I(W,ie,fe,xe)??Xt,Oe=Ie>=0&&Ie<Xt,$e=D.ori==0?Ke:ge,ht=se.left,Nt=e[0],Pt=e[ie];if(C.has(Pt[fe])){Se=null;let yt=null,at=null,tt;if(F==0||F==-1)for(tt=fe;yt==null&&tt-- >0;)C.has(Pt[tt])||(yt=tt);if(F==0||F==1)for(tt=fe;at==null&&tt++<Pt.length;)C.has(Pt[tt])||(at=tt);if(yt!=null||at!=null)if(Oe){let Qt=yt==null?-1/0:k(Nt[yt],D,$e,0),dn=at==null?1/0:k(Nt[at],D,$e,0),Fn=ht-Qt,Vt=dn-ht;Fn<=Vt?Fn<=Ie&&(Se=yt):Vt<=Ie&&(Se=at)}else Se=at==null?yt:yt==null?at:fe-yt<=at-fe?yt:at}else Oe&&An(ht-k(Nt[fe],D,$e,0))>Ie&&(Se=null);return Se}}const We=y=>{se.event=y};se.idxs=H,se._lock=!1;let dt=se.points;dt.show=wt(dt.show),dt.size=wt(dt.size),dt.stroke=wt(dt.stroke),dt.width=wt(dt.width),dt.fill=wt(dt.fill);const _t=n.focus=bn({},i.focus||{alpha:.3},se.focus),Dn=_t.prox>=0,zn=Dn&&dt.one;let ui=[],qs=[],Rs=[];function ca(y,C){let I=dt.show(n,C);if(I instanceof HTMLElement)return Ei(I,Cv),Ei(I,y.class),_s(I,-10,-10,Ke,ge),p.insertBefore(I,ui[C]),I}function yl(y,C){if(s==1||C>0){let I=s==1&&b[y.scale].time,F=y.value;y.value=I?jp(F)?nm(X,tm(F,z)):F||te:F||Gb,y.label=y.label||(I?Ib:Nb)}if(zn||C>0){y.width=y.width==null?1:y.width,y.paths=y.paths||iM||qv,y.fillTo=wt(y.fillTo||Yb),y.pxAlign=+kt(y.pxAlign,m),y.pxRound=um(y.pxAlign),y.stroke=wt(y.stroke||null),y.fill=wt(y.fill||null),y._stroke=y._fill=y._paths=y._focus=null;let I=Wb(ci(1,y.width),1),F=y.points=bn({},{size:I,width:ci(1,I*.2),stroke:y.stroke,space:I*2,paths:sM,_stroke:null,_fill:null},y.points);F.show=wt(F.show),F.filter=wt(F.filter),F.fill=wt(F.fill),F.stroke=wt(F.stroke),F.paths=wt(F.paths),F.pxAlign=y.pxAlign}if(Qe){let I=ot(y,C);Ue.splice(C,0,I[0]),Te.splice(C,0,I[1]),J.values.push(null)}if(it){H.splice(C,0,null);let I=null;zn?C==0&&(I=ca(y,C)):C>0&&(I=ca(y,C)),ui.splice(C,0,I),qs.splice(C,0,0),Rs.splice(C,0,0)}Un("addSeries",C)}function Sl(y,C){C=C??x.length,y=s==1?Vu(y,C,sm,cm):Vu(y,C,{},lm),x.splice(C,0,y),yl(x[C],C)}n.addSeries=Sl;function wl(y){if(x.splice(y,1),Qe){J.values.splice(y,1),Te.splice(y,1);let C=Ue.splice(y,1)[0];gt(null,C.firstChild),C.remove()}it&&(H.splice(y,1),ui.splice(y,1)[0].remove(),qs.splice(y,1),Rs.splice(y,1)),Un("delSeries",y)}n.delSeries=wl;const Qn=[!1,!1,!1,!1];function Mo(y,C){if(y._show=y.show,y.show){let I=y.side%2,F=b[y.scale];F==null&&(y.scale=I?x[1].scale:M,F=b[y.scale]);let W=F.time;y.size=wt(y.size),y.space=wt(y.space),y.rotate=wt(y.rotate),hr(y.incrs)&&y.incrs.forEach(fe=>{!xr.has(fe)&&xr.set(fe,bg(fe))}),y.incrs=wt(y.incrs||(F.distr==2?mb:W?g==1?_b:bb:zr)),y.splits=wt(y.splits||(W&&F.distr==1?re:F.distr==3?Ou:F.distr==4?Ob:Fb)),y.stroke=wt(y.stroke),y.grid.stroke=wt(y.grid.stroke),y.ticks.stroke=wt(y.ticks.stroke),y.border.stroke=wt(y.border.stroke);let ie=y.values;y.values=hr(ie)&&!hr(ie[0])?wt(ie):W?hr(ie)?em(X,Qp(ie,z)):jp(ie)?Sb(X,ie):ie||q:ie||Ub,y.filter=wt(y.filter||(F.distr>=3&&F.log==10?Hb:F.distr==3&&F.log==2?Vb:xg)),y.font=mm(y.font),y.labelFont=mm(y.labelFont),y._size=y.size(n,null,C,0),y._space=y._rotate=y._incrs=y._found=y._splits=y._values=null,y._size>0&&(Qn[C]=!0,y._el=Fi(Ev,u))}}function Ys(y,C,I,F){let[W,ie,fe,xe]=I,Se=C%2,Ie=0;return Se==0&&(xe||ie)&&(Ie=C==0&&!W||C==2&&!fe?En(im.size/3):0),Se==1&&(W||fe)&&(Ie=C==1&&!ie||C==3&&!xe?En(am.size/2):0),Ie}const yo=n.padding=(i.padding||[Ys,Ys,Ys,Ys]).map(y=>wt(kt(y,Ys))),gi=n._padding=yo.map((y,C)=>y(n,C,Qn,0));let _n,an=null,mn=null;const Sr=s==1?x[0].idxs:null;let _i=null,wr=!1;function El(y,C){if(e=y??[],n.data=n._data=e,s==2){_n=0;for(let I=1;I<x.length;I++)_n+=e[I][0].length}else{e.length==0&&(n.data=n._data=e=[[]]),_i=e[0],_n=_i.length;let I=e;if(L==2){I=e.slice();let F=I[0]=Array(_n);for(let W=0;W<_n;W++)F[W]=W}n._data=e=I}if(Rt(!0),Un("setData"),L==2&&(we=!0),C!==!1){let I=D;I.auto(n,wr)?So():Zs(M,I.min,I.max),qe=qe||se.left>=0,st=!0,ha()}}n.setData=El;function So(){wr=!0;let y,C;s==1&&(_n>0?(an=Sr[0]=0,mn=Sr[1]=_n-1,y=e[0][an],C=e[0][mn],L==2?(y=an,C=mn):y==C&&(L==3?[y,C]=eh(y,y,D.log,!1):L==4?[y,C]=Jd(y,y,D.log,!1):D.time?C=y+En(86400/g):[y,C]=Dc(y,C,Qd,!0))):(an=Sr[0]=y=null,mn=Sr[1]=C=null)),Zs(M,y,C)}let Er,R,G,ae,Q,ee,Pe,Fe,Le,De;function je(y,C,I,F,W,ie){y??=Dp,I??=tf,F??="butt",W??=Dp,ie??="round",y!=Er&&(d.strokeStyle=Er=y),W!=R&&(d.fillStyle=R=W),C!=G&&(d.lineWidth=G=C),ie!=Q&&(d.lineJoin=Q=ie),F!=ee&&(d.lineCap=ee=F),I!=ae&&d.setLineDash(ae=I)}function ft(y,C,I,F){C!=R&&(d.fillStyle=R=C),y!=Pe&&(d.font=Pe=y),I!=Fe&&(d.textAlign=Fe=I),F!=Le&&(d.textBaseline=Le=F)}function xt(y,C,I,F,W=0){if(F.length>0&&y.auto(n,wr)&&(C==null||C.min==null)){let ie=kt(an,0),fe=kt(mn,F.length-1),xe=I.min==null?Hv(F,ie,fe,W,y.distr==3):[I.min,I.max];y.min=ss(y.min,I.min=xe[0]),y.max=ci(y.max,I.max=xe[1])}}const Ye={min:null,max:null};function Lt(){for(let F in b){let W=b[F];O[F]==null&&(W.min==null||O[M]!=null&&W.auto(n,wr))&&(O[F]=Ye)}for(let F in b){let W=b[F];O[F]==null&&W.from!=null&&O[W.from]!=null&&(O[F]=Ye)}O[M]!=null&&Rt(!0);let y={};for(let F in O){let W=O[F];if(W!=null){let ie=y[F]=to(b[F],Kv);if(W.min!=null)bn(ie,W);else if(F!=M||s==2)if(_n==0&&ie.from==null){let fe=ie.range(n,null,null,F);ie.min=fe[0],ie.max=fe[1]}else ie.min=Xt,ie.max=-Xt}}if(_n>0){x.forEach((F,W)=>{if(s==1){let ie=F.scale,fe=O[ie];if(fe==null)return;let xe=y[ie];if(W==0){let Se=xe.range(n,xe.min,xe.max,ie);xe.min=Se[0],xe.max=Se[1],an=ts(xe.min,e[0]),mn=ts(xe.max,e[0]),mn-an>1&&(e[0][an]<xe.min&&an++,e[0][mn]>xe.max&&mn--),F.min=_i[an],F.max=_i[mn]}else F.show&&F.auto&&xt(xe,fe,F,e[W],F.sorted);F.idxs[0]=an,F.idxs[1]=mn}else if(W>0&&F.show&&F.auto){let[ie,fe]=F.facets,xe=ie.scale,Se=fe.scale,[Ie,Oe]=e[W],$e=y[xe],ht=y[Se];$e!=null&&xt($e,O[xe],ie,Ie,ie.sorted),ht!=null&&xt(ht,O[Se],fe,Oe,fe.sorted),F.min=fe.min,F.max=fe.max}});for(let F in y){let W=y[F],ie=O[F];if(W.from==null&&(ie==null||ie.min==null)){let fe=W.range(n,W.min==Xt?null:W.min,W.max==-Xt?null:W.max,F);W.min=fe[0],W.max=fe[1]}}}for(let F in y){let W=y[F];if(W.from!=null){let ie=y[W.from];if(ie.min==null)W.min=W.max=null;else{let fe=W.range(n,ie.min,ie.max,F);W.min=fe[0],W.max=fe[1]}}}let C={},I=!1;for(let F in y){let W=y[F],ie=b[F];if(ie.min!=W.min||ie.max!=W.max){ie.min=W.min,ie.max=W.max;let fe=ie.distr;ie._min=fe==3?Hs(ie.min):fe==4?kh(ie.min,ie.asinh):fe==100?ie.fwd(ie.min):ie.min,ie._max=fe==3?Hs(ie.max):fe==4?kh(ie.max,ie.asinh):fe==100?ie.fwd(ie.max):ie.max,C[F]=I=!0}}if(I){x.forEach((F,W)=>{s==2?W>0&&C.y&&(F._paths=null):C[F.scale]&&(F._paths=null)});for(let F in C)we=!0,Un("setScale",F);it&&se.left>=0&&(qe=st=!0)}for(let F in O)O[F]=null}function un(y){let C=Fu(an-1,0,_n-1),I=Fu(mn+1,0,_n-1);for(;y[C]==null&&C>0;)C--;for(;y[I]==null&&I<_n-1;)I++;return[C,I]}function Wt(){if(_n>0){let y=x.some(C=>C._focus)&&De!=_t.alpha;y&&(d.globalAlpha=De=_t.alpha),x.forEach((C,I)=>{if(I>0&&C.show&&(Ft(I,!1),Ft(I,!0),C._paths==null)){let F=De;De!=C.alpha&&(d.globalAlpha=De=C.alpha);let W=s==2?[0,e[I][0].length-1]:un(e[I]);C._paths=C.paths(n,I,W[0],W[1]),De!=F&&(d.globalAlpha=De=F)}}),x.forEach((C,I)=>{if(I>0&&C.show){let F=De;De!=C.alpha&&(d.globalAlpha=De=C.alpha),C._paths!=null&&Sn(I,!1);{let W=C._paths!=null?C._paths.gaps:null,ie=C.points.show(n,I,an,mn,W),fe=C.points.filter(n,I,ie,W);(ie||fe)&&(C.points._paths=C.points.paths(n,I,an,mn,fe),Sn(I,!0))}De!=F&&(d.globalAlpha=De=F),Un("drawSeries",I)}}),y&&(d.globalAlpha=De=1)}}function Ft(y,C){let I=C?x[y].points:x[y];I._stroke=I.stroke(n,y),I._fill=I.fill(n,y)}function Sn(y,C){let I=C?x[y].points:x[y],{stroke:F,fill:W,clip:ie,flags:fe,_stroke:xe=I._stroke,_fill:Se=I._fill,_width:Ie=I.width}=I._paths;Ie=qt(Ie*Ut,3);let Oe=null,$e=Ie%2/2;C&&Se==null&&(Se=Ie>0?"#fff":xe);let ht=I.pxAlign==1&&$e>0;if(ht&&d.translate($e,$e),!C){let Nt=Me-Ie/2,Pt=le-Ie/2,yt=ce+Ie,at=ye+Ie;Oe=new Path2D,Oe.rect(Nt,Pt,yt,at)}C?Mt(xe,Ie,I.dash,I.cap,Se,F,W,fe,ie):Ve(y,xe,Ie,I.dash,I.cap,Se,F,W,fe,Oe,ie),ht&&d.translate(-$e,-$e)}function Ve(y,C,I,F,W,ie,fe,xe,Se,Ie,Oe){let $e=!1;Se!=0&&S.forEach((ht,Nt)=>{if(ht.series[0]==y){let Pt=x[ht.series[1]],yt=e[ht.series[1]],at=(Pt._paths||Jo).band;hr(at)&&(at=ht.dir==1?at[0]:at[1]);let tt,Qt=null;Pt.show&&at&&Gv(yt,an,mn)?(Qt=ht.fill(n,Nt)||ie,tt=Pt._paths.clip):at=null,Mt(C,I,F,W,Qt,fe,xe,Se,Ie,Oe,tt,at),$e=!0}}),$e||Mt(C,I,F,W,ie,fe,xe,Se,Ie,Oe)}const kn=no|zu;function Mt(y,C,I,F,W,ie,fe,xe,Se,Ie,Oe,$e){je(y,C,I,F,W),(Se||Ie||$e)&&(d.save(),Se&&d.clip(Se),Ie&&d.clip(Ie)),$e?(xe&kn)==kn?(d.clip($e),Oe&&d.clip(Oe),ei(W,fe),Hn(y,ie,C)):xe&zu?(ei(W,fe),d.clip($e),Hn(y,ie,C)):xe&no&&(d.save(),d.clip($e),Oe&&d.clip(Oe),ei(W,fe),d.restore(),Hn(y,ie,C)):(ei(W,fe),Hn(y,ie,C)),(Se||Ie||$e)&&d.restore()}function Hn(y,C,I){I>0&&(C instanceof Map?C.forEach((F,W)=>{d.strokeStyle=Er=W,d.stroke(F)}):C!=null&&y&&d.stroke(C))}function ei(y,C){C instanceof Map?C.forEach((I,F)=>{d.fillStyle=R=F,d.fill(I)}):C!=null&&y&&d.fill(C)}function cs(y,C,I,F){let W=T[y],ie;if(F<=0)ie=[0,0];else{let fe=W._space=W.space(n,y,C,I,F),xe=W._incrs=W.incrs(n,y,C,I,F,fe);ie=hM(C,I,xe,F,fe)}return W._found=ie}function hs(y,C,I,F,W,ie,fe,xe,Se,Ie){let Oe=fe%2/2;m==1&&d.translate(Oe,Oe),je(xe,fe,Se,Ie,xe),d.beginPath();let $e,ht,Nt,Pt,yt=W+(F==0||F==3?-ie:ie);I==0?(ht=W,Pt=yt):($e=W,Nt=yt);for(let at=0;at<y.length;at++)C[at]!=null&&(I==0?$e=Nt=y[at]:ht=Pt=y[at],d.moveTo($e,ht),d.lineTo(Nt,Pt));d.stroke(),m==1&&d.translate(-Oe,-Oe)}function Ot(y){let C=!0;return T.forEach((I,F)=>{if(!I.show)return;let W=b[I.scale];if(W.min==null){I._show&&(C=!1,I._show=!1,Rt(!1));return}else I._show||(C=!1,I._show=!0,Rt(!1));let ie=I.side,fe=ie%2,{min:xe,max:Se}=W,[Ie,Oe]=cs(F,xe,Se,fe==0?Ke:ge);if(Oe==0)return;let $e=W.distr==2,ht=I._splits=I.splits(n,F,xe,Se,Ie,Oe,$e),Nt=W.distr==2?ht.map(tt=>_i[tt]):ht,Pt=W.distr==2?_i[ht[1]]-_i[ht[0]]:Ie,yt=I._values=I.values(n,I.filter(n,Nt,F,Oe,Pt),F,Oe,Pt);I._rotate=ie==2?I.rotate(n,yt,F,Oe):0;let at=I._size;I._size=Bi(I.size(n,yt,F,y)),at!=null&&I._size!=at&&(C=!1)}),C}function on(y){let C=!0;return yo.forEach((I,F)=>{let W=I(n,F,Qn,y);W!=gi[F]&&(C=!1),gi[F]=W}),C}function us(){for(let y=0;y<T.length;y++){let C=T[y];if(!C.show||!C._show)continue;let I=C.side,F=I%2,W,ie,fe=C.stroke(n,y),xe=I==0||I==3?-1:1,[Se,Ie]=C._found;if(C.label!=null){let ni=C.labelGap*xe,Mi=En((C._lpos+ni)*Ut);ft(C.labelFont[0],fe,"center",I==2?Lo:Pp),d.save(),F==1?(W=ie=0,d.translate(Mi,En(le+ye/2)),d.rotate((I==3?-bc:bc)/2)):(W=En(Me+ce/2),ie=Mi);let Rr=gg(C.label)?C.label(n,y,Se,Ie):C.label;d.fillText(Rr,W,ie),d.restore()}if(Ie==0)continue;let Oe=b[C.scale],$e=F==0?ce:ye,ht=F==0?Me:le,Nt=C._splits,Pt=Oe.distr==2?Nt.map(ni=>_i[ni]):Nt,yt=Oe.distr==2?_i[Nt[1]]-_i[Nt[0]]:Se,at=C.ticks,tt=C.border,Qt=at.show?at.size:0,dn=En(Qt*Ut),Fn=En((C.alignTo==2?C._size-Qt-C.gap:C.gap)*Ut),Vt=C._rotate*-bc/180,fn=_(C._pos*Ut),vi=(dn+Fn)*xe,ti=fn+vi;ie=F==0?ti:0,W=F==1?ti:0;let ki=C.font[0],$i=C.align==1?xa:C.align==2?Lh:Vt>0?xa:Vt<0?Lh:F==0?"center":I==3?Lh:xa,ms=Vt||F==1?"middle":I==2?Lo:Pp;ft(ki,fe,$i,ms);let bi=C.font[1]*C.lineGap,Ni=Nt.map(ni=>_(o(ni,Oe,$e,ht))),Xi=C._values;for(let ni=0;ni<Xi.length;ni++){let Mi=Xi[ni];if(Mi!=null){F==0?W=Ni[ni]:ie=Ni[ni],Mi=""+Mi;let Rr=Mi.indexOf(`
`)==-1?[Mi]:Mi.split(/\n/gm);for(let ii=0;ii<Rr.length;ii++){let Mp=Rr[ii];Vt?(d.save(),d.translate(W,ie+ii*bi),d.rotate(Vt),d.fillText(Mp,0,0),d.restore()):d.fillText(Mp,W,ie+ii*bi)}}}at.show&&hs(Ni,at.filter(n,Pt,y,Ie,yt),F,I,fn,dn,qt(at.width*Ut,3),at.stroke(n,y),at.dash,at.cap);let gs=C.grid;gs.show&&hs(Ni,gs.filter(n,Pt,y,Ie,yt),F,F==0?2:1,F==0?le:Me,F==0?ye:ce,qt(gs.width*Ut,3),gs.stroke(n,y),gs.dash,gs.cap),tt.show&&hs([fn],[1],F==0?1:0,F==0?1:2,F==1?le:Me,F==1?ye:ce,qt(tt.width*Ut,3),tt.stroke(n,y),tt.dash,tt.cap)}Un("drawAxes")}function Rt(y){x.forEach((C,I)=>{I>0&&(C._paths=null,y&&(s==1?(C.min=null,C.max=null):C.facets.forEach(F=>{F.min=null,F.max=null})))})}let xi=!1,ds=!1,js=[];function Ux(){ds=!1;for(let y=0;y<js.length;y++)Un(...js[y]);js.length=0}function ha(){xi||(ib(ip),xi=!0)}function Fx(y,C=!1){xi=!0,ds=C,y(n),ip(),C&&js.length>0&&queueMicrotask(Ux)}n.batch=Fx;function ip(){if(Ze&&(Lt(),Ze=!1),we&&(Ce(),we=!1),Ae){if(en(f,xa,N),en(f,Lo,w),en(f,Wo,Ke),en(f,$o,ge),en(p,xa,N),en(p,Lo,w),en(p,Wo,Ke),en(p,$o,ge),en(u,Wo,bt),en(u,$o,V),h.width=En(bt*Ut),h.height=En(V*Ut),T.forEach(({_el:y,_show:C,_size:I,_pos:F,side:W})=>{if(y!=null)if(C){let ie=W===3||W===0?I:0,fe=W%2==1;en(y,fe?"left":"top",F-ie),en(y,fe?"width":"height",I),en(y,fe?"top":"left",fe?w:N),en(y,fe?"height":"width",fe?ge:Ke),Iu(y,Hr)}else Ei(y,Hr)}),Er=R=G=Q=ee=Pe=Fe=Le=ae=null,De=1,To(!0),N!=j||w!=ne||Ke!=oe||ge!=ve){Rt(!1);let y=Ke/oe,C=ge/ve;if(it&&!qe&&se.left>=0){se.left*=y,se.top*=C,ua&&_s(ua,En(se.left),0,Ke,ge),da&&_s(da,0,En(se.top),Ke,ge);for(let I=0;I<ui.length;I++){let F=ui[I];F!=null&&(qs[I]*=y,Rs[I]*=C,_s(F,Bi(qs[I]),Bi(Rs[I]),Ke,ge))}}if(Jt.show&&!nt&&Jt.left>=0&&Jt.width>0){Jt.left*=y,Jt.width*=y,Jt.top*=C,Jt.height*=C;for(let I in Eh)en(ma,I,Jt[I])}j=N,ne=w,oe=Ke,ve=ge}Un("setSize"),Ae=!1}bt>0&&V>0&&(d.clearRect(0,0,h.width,h.height),Un("drawClear"),v.forEach(y=>y()),Un("draw")),Jt.show&&nt&&(Tl(Jt),nt=!1),it&&qe&&(Ar(null,!0,!1),qe=!1),J.show&&J.live&&st&&(Sh(),st=!1),c||(c=!0,n.status=1,Un("ready")),wr=!1,xi=!1}n.redraw=(y,C)=>{we=C||!1,y!==!1?Zs(M,D.min,D.max):ha()};function bh(y,C){let I=b[y];if(I.from==null){if(_n==0){let F=I.range(n,C.min,C.max,y);C.min=F[0],C.max=F[1]}if(C.min>C.max){let F=C.min;C.min=C.max,C.max=F}if(_n>1&&C.min!=null&&C.max!=null&&C.max-C.min<1e-16)return;y==M&&I.distr==2&&_n>0&&(C.min=ts(C.min,e[0]),C.max=ts(C.max,e[0]),C.min==C.max&&C.max++),O[y]=C,Ze=!0,ha()}}n.setScale=bh;let Mh,yh,ua,da,sp,rp,fa,pa,ap,op,Zt,nn,Ks=!1;const Vn=se.drag;let Nn=Vn.x,In=Vn.y;it&&(se.x&&(Mh=Fi(Av,p)),se.y&&(yh=Fi(Rv,p)),D.ori==0?(ua=Mh,da=yh):(ua=yh,da=Mh),Zt=se.left,nn=se.top);const Jt=n.select=bn({show:!0,over:!0,left:0,width:0,top:0,height:0},i.select),ma=Jt.show?Fi(Tv,Jt.over?p:f):null;function Tl(y,C){if(Jt.show){for(let I in y)Jt[I]=y[I],I in Eh&&en(ma,I,y[I]);C!==!1&&Un("setSelect")}}n.setSelect=Tl;function Ox(y){if(x[y].show)Qe&&Iu(Ue[y],Hr);else if(Qe&&Ei(Ue[y],Hr),it){let I=zn?ui[0]:ui[y];I!=null&&_s(I,-10,-10,Ke,ge)}}function Zs(y,C,I){bh(y,{min:C,max:I})}function fs(y,C,I,F){C.focus!=null&&Gx(y),C.show!=null&&x.forEach((W,ie)=>{ie>0&&(y==ie||y==null)&&(W.show=C.show,Ox(ie),s==2?(Zs(W.facets[0].scale,null,null),Zs(W.facets[1].scale,null,null)):Zs(W.scale,null,null),ha())}),I!==!1&&Un("setSeries",y,C),F&&Ao("setSeries",n,y,C)}n.setSeries=fs;function Bx(y,C){bn(S[y],C)}function zx(y,C){y.fill=wt(y.fill||null),y.dir=kt(y.dir,-1),C=C??S.length,S.splice(C,0,y)}function Hx(y){y==null?S.length=0:S.splice(y,1)}n.addBand=zx,n.setBand=Bx,n.delBand=Hx;function Vx(y,C){x[y].alpha=C,it&&ui[y]!=null&&(ui[y].style.opacity=C),Qe&&Ue[y]&&(Ue[y].style.opacity=C)}let Cs,Js,Tr;const ga={focus:!0};function Gx(y){if(y!=Tr){let C=y==null,I=_t.alpha!=1;x.forEach((F,W)=>{if(s==1||W>0){let ie=C||W==0||W==y;F._focus=C?null:ie,I&&Vx(W,ie?1:_t.alpha)}}),Tr=y,I&&ha()}}Qe&&Dn&&rt(Ip,Z,y=>{se._lock||(We(y),Tr!=null&&fs(null,ga,!0,xn.setSeries))});function ps(y,C,I){let F=b[C];I&&(y=y/Ut-(F.ori==1?w:N));let W=Ke;F.ori==1&&(W=ge,y=W-y),F.dir==-1&&(y=W-y);let ie=F._min,fe=F._max,xe=y/W,Se=ie+(fe-ie)*xe,Ie=F.distr;return Ie==3?Qa(10,Se):Ie==4?$v(Se,F.asinh):Ie==100?F.bwd(Se):Se}function Wx(y,C){let I=ps(y,M,C);return ts(I,e[0],an,mn)}n.valToIdx=y=>ts(y,e[0]),n.posToIdx=Wx,n.posToVal=ps,n.valToPos=(y,C,I)=>b[C].ori==0?r(y,b[C],I?ce:Ke,I?Me:0):a(y,b[C],I?ye:ge,I?le:0),n.setCursor=(y,C,I)=>{Zt=y.left,nn=y.top,Ar(null,C,I)};function lp(y,C){en(ma,xa,Jt.left=y),en(ma,Wo,Jt.width=C)}function cp(y,C){en(ma,Lo,Jt.top=y),en(ma,$o,Jt.height=C)}let wo=D.ori==0?lp:cp,Eo=D.ori==1?lp:cp;function $x(){if(Qe&&J.live)for(let y=s==2?1:0;y<x.length;y++){if(y==0&&pe)continue;let C=J.values[y],I=0;for(let F in C)Te[y][I++].firstChild.nodeValue=C[F]}}function Sh(y,C){if(y!=null&&(y.idxs?y.idxs.forEach((I,F)=>{H[F]=I}):jv(y.idx)||H.fill(y.idx),J.idx=H[0]),Qe&&J.live){for(let I=0;I<x.length;I++)(I>0||s==1&&!pe)&&Xx(I,H[I]);$x()}st=!1,C!==!1&&Un("setLegend")}n.setLegend=Sh;function Xx(y,C){let I=x[y],F=y==0&&L==2?_i:e[y],W;pe?W=I.values(n,y,C)??_e:(W=I.value(n,C==null?null:F[C],y,C),W=W==null?_e:{_:W}),J.values[y]=W}function Ar(y,C,I){ap=Zt,op=nn,[Zt,nn]=se.move(n,Zt,nn),se.left=Zt,se.top=nn,it&&(ua&&_s(ua,En(Zt),0,Ke,ge),da&&_s(da,0,En(nn),Ke,ge));let F,W=an>mn;Cs=Xt,Js=null;let ie=D.ori==0?Ke:ge,fe=D.ori==1?Ke:ge;if(Zt<0||_n==0||W){F=se.idx=null;for(let xe=0;xe<x.length;xe++){let Se=ui[xe];Se!=null&&_s(Se,-10,-10,Ke,ge)}Dn&&fs(null,ga,!0,y==null&&xn.setSeries),J.live&&(H.fill(F),st=!0)}else{let xe,Se,Ie;s==1&&(xe=D.ori==0?Zt:nn,Se=ps(xe,M),F=se.idx=ts(Se,e[0],an,mn),Ie=k(e[0][F],D,ie,0));let Oe=-10,$e=-10,ht=0,Nt=0,Pt=!0,yt="",at="";for(let tt=s==2?1:0;tt<x.length;tt++){let Qt=x[tt],dn=H[tt],Fn=dn==null?null:s==1?e[tt][dn]:e[tt][1][dn],Vt=se.dataIdx(n,tt,F,Se),fn=Vt==null?null:s==1?e[tt][Vt]:e[tt][1][Vt];if(st=st||fn!=Fn||Vt!=dn,H[tt]=Vt,tt>0&&Qt.show){let vi=Vt==null?-10:Vt==F?Ie:k(s==1?e[0][Vt]:e[tt][0][Vt],D,ie,0),ti=fn==null?-10:U(fn,s==1?b[Qt.scale]:b[Qt.facets[1].scale],fe,0);if(Dn&&fn!=null){let ki=D.ori==1?Zt:nn,$i=An(_t.dist(n,tt,Vt,ti,ki));if($i<Cs){let ms=_t.bias;if(ms!=0){let bi=ps(ki,Qt.scale),Ni=fn>=0?1:-1,Xi=bi>=0?1:-1;Xi==Ni&&(Xi==1?ms==1?fn>=bi:fn<=bi:ms==1?fn<=bi:fn>=bi)&&(Cs=$i,Js=tt)}else Cs=$i,Js=tt}}if(st||zn){let ki,$i;D.ori==0?(ki=vi,$i=ti):(ki=ti,$i=vi);let ms,bi,Ni,Xi,gs,ni,Mi=!0,Rr=dt.bbox;if(Rr!=null){Mi=!1;let ii=Rr(n,tt);Ni=ii.left,Xi=ii.top,ms=ii.width,bi=ii.height}else Ni=ki,Xi=$i,ms=bi=dt.size(n,tt);if(ni=dt.fill(n,tt),gs=dt.stroke(n,tt),zn)tt==Js&&Cs<=_t.prox&&(Oe=Ni,$e=Xi,ht=ms,Nt=bi,Pt=Mi,yt=ni,at=gs);else{let ii=ui[tt];ii!=null&&(qs[tt]=Ni,Rs[tt]=Xi,Vp(ii,ms,bi,Mi),zp(ii,ni,gs),_s(ii,Bi(Ni),Bi(Xi),Ke,ge))}}}}if(zn){let tt=_t.prox,Qt=Tr==null?Cs<=tt:Cs>tt||Js!=Tr;if(st||Qt){let dn=ui[0];dn!=null&&(qs[0]=Oe,Rs[0]=$e,Vp(dn,ht,Nt,Pt),zp(dn,yt,at),_s(dn,Bi(Oe),Bi($e),Ke,ge))}}}if(Jt.show&&Ks)if(y!=null){let[xe,Se]=xn.scales,[Ie,Oe]=xn.match,[$e,ht]=y.cursor.sync.scales,Nt=y.cursor.drag;if(Nn=Nt._x,In=Nt._y,Nn||In){let{left:Pt,top:yt,width:at,height:tt}=y.select,Qt=y.scales[$e].ori,dn=y.posToVal,Fn,Vt,fn,vi,ti,ki=xe!=null&&Ie(xe,$e),$i=Se!=null&&Oe(Se,ht);ki&&Nn?(Qt==0?(Fn=Pt,Vt=at):(Fn=yt,Vt=tt),fn=b[xe],vi=k(dn(Fn,$e),fn,ie,0),ti=k(dn(Fn+Vt,$e),fn,ie,0),wo(ss(vi,ti),An(ti-vi))):wo(0,ie),$i&&In?(Qt==1?(Fn=Pt,Vt=at):(Fn=yt,Vt=tt),fn=b[Se],vi=U(dn(Fn,ht),fn,fe,0),ti=U(dn(Fn+Vt,ht),fn,fe,0),Eo(ss(vi,ti),An(ti-vi))):Eo(0,fe)}else Th()}else{let xe=An(ap-sp),Se=An(op-rp);if(D.ori==1){let ht=xe;xe=Se,Se=ht}Nn=Vn.x&&xe>=Vn.dist,In=Vn.y&&Se>=Vn.dist;let Ie=Vn.uni;Ie!=null?Nn&&In&&(Nn=xe>=Ie,In=Se>=Ie,!Nn&&!In&&(Se>xe?In=!0:Nn=!0)):Vn.x&&Vn.y&&(Nn||In)&&(Nn=In=!0);let Oe,$e;Nn&&(D.ori==0?(Oe=fa,$e=Zt):(Oe=pa,$e=nn),wo(ss(Oe,$e),An($e-Oe)),In||Eo(0,fe)),In&&(D.ori==1?(Oe=fa,$e=Zt):(Oe=pa,$e=nn),Eo(ss(Oe,$e),An($e-Oe)),Nn||wo(0,ie)),!Nn&&!In&&(wo(0,0),Eo(0,0))}if(Vn._x=Nn,Vn._y=In,y==null){if(I){if(bp!=null){let[xe,Se]=xn.scales;xn.values[0]=xe!=null?ps(D.ori==0?Zt:nn,xe):null,xn.values[1]=Se!=null?ps(D.ori==1?Zt:nn,Se):null}Ao(Ph,n,Zt,nn,Ke,ge,F)}if(Dn){let xe=I&&xn.setSeries,Se=_t.prox;Tr==null?Cs<=Se&&fs(Js,ga,!0,xe):Cs>Se?fs(null,ga,!0,xe):Js!=Tr&&fs(Js,ga,!0,xe)}}st&&(J.idx=F,Sh()),C!==!1&&Un("setCursor")}let Qs=null;Object.defineProperty(n,"rect",{get(){return Qs==null&&To(!1),Qs}});function To(y=!1){y?Qs=null:(Qs=p.getBoundingClientRect(),Un("syncRect",Qs))}function hp(y,C,I,F,W,ie,fe){se._lock||Ks&&y!=null&&y.movementX==0&&y.movementY==0||(wh(y,C,I,F,W,ie,fe,!1,y!=null),y!=null?Ar(null,!0,!0):Ar(C,!0,!1))}function wh(y,C,I,F,W,ie,fe,xe,Se){if(Qs==null&&To(!1),We(y),y!=null)I=y.clientX-Qs.left,F=y.clientY-Qs.top;else{if(I<0||F<0){Zt=-10,nn=-10;return}let[Ie,Oe]=xn.scales,$e=C.cursor.sync,[ht,Nt]=$e.values,[Pt,yt]=$e.scales,[at,tt]=xn.match,Qt=C.axes[0].side%2==1,dn=D.ori==0?Ke:ge,Fn=D.ori==1?Ke:ge,Vt=Qt?ie:W,fn=Qt?W:ie,vi=Qt?F:I,ti=Qt?I:F;if(Pt!=null?I=at(Ie,Pt)?o(ht,b[Ie],dn,0):-10:I=dn*(vi/Vt),yt!=null?F=tt(Oe,yt)?o(Nt,b[Oe],Fn,0):-10:F=Fn*(ti/fn),D.ori==1){let ki=I;I=F,F=ki}}Se&&(C==null||C.cursor.event.type==Ph)&&((I<=1||I>=Ke-1)&&(I=Br(I,Ke)),(F<=1||F>=ge-1)&&(F=Br(F,ge))),xe?(sp=I,rp=F,[fa,pa]=se.move(n,I,F)):(Zt=I,nn=F)}const Eh={width:0,height:0,left:0,top:0};function Th(){Tl(Eh,!1)}let up,dp,fp,pp;function mp(y,C,I,F,W,ie,fe){Ks=!0,Nn=In=Vn._x=Vn._y=!1,wh(y,C,I,F,W,ie,fe,!0,!1),y!=null&&(rt(Dh,ku,gp,!1),Ao(kp,n,fa,pa,Ke,ge,null));let{left:xe,top:Se,width:Ie,height:Oe}=Jt;up=xe,dp=Se,fp=Ie,pp=Oe}function gp(y,C,I,F,W,ie,fe){Ks=Vn._x=Vn._y=!1,wh(y,C,I,F,W,ie,fe,!1,!0);let{left:xe,top:Se,width:Ie,height:Oe}=Jt,$e=Ie>0||Oe>0,ht=up!=xe||dp!=Se||fp!=Ie||pp!=Oe;if($e&&ht&&Tl(Jt),Vn.setScale&&$e&&ht){let Nt=xe,Pt=Ie,yt=Se,at=Oe;if(D.ori==1&&(Nt=Se,Pt=Oe,yt=xe,at=Ie),Nn&&Zs(M,ps(Nt,M),ps(Nt+Pt,M)),In)for(let tt in b){let Qt=b[tt];tt!=M&&Qt.from==null&&Qt.min!=Xt&&Zs(tt,ps(yt+at,tt),ps(yt,tt))}Th()}else se.lock&&(se._lock=!se._lock,Ar(C,!0,y!=null));y!=null&&(gt(Dh,ku),Ao(Dh,n,Zt,nn,Ke,ge,null))}function qx(y,C,I,F,W,ie,fe){if(se._lock)return;We(y);let xe=Ks;if(Ks){let Se=!0,Ie=!0,Oe=10,$e,ht;D.ori==0?($e=Nn,ht=In):($e=In,ht=Nn),$e&&ht&&(Se=Zt<=Oe||Zt>=Ke-Oe,Ie=nn<=Oe||nn>=ge-Oe),$e&&Se&&(Zt=Zt<fa?0:Ke),ht&&Ie&&(nn=nn<pa?0:ge),Ar(null,!0,!0),Ks=!1}Zt=-10,nn=-10,H.fill(null),Ar(null,!0,!0),xe&&(Ks=xe)}function _p(y,C,I,F,W,ie,fe){se._lock||(We(y),So(),Th(),y!=null&&Ao(Up,n,Zt,nn,Ke,ge,null))}function xp(){T.forEach(uM),$(n.width,n.height,!0)}qr(Pc,Xa,xp);const _a={};_a.mousedown=mp,_a.mousemove=hp,_a.mouseup=gp,_a.dblclick=_p,_a.setSeries=(y,C,I,F)=>{let W=xn.match[2];I=W(n,C,I),I!=-1&&fs(I,F,!0,!1)},it&&(rt(kp,p,mp),rt(Ph,p,hp),rt(Np,p,y=>{We(y),To(!1)}),rt(Ip,p,qx),rt(Up,p,_p),Hu.add(n),n.syncRect=To);const Al=n.hooks=i.hooks||{};function Un(y,C,I){ds?js.push([y,C,I]):y in Al&&Al[y].forEach(F=>{F.call(null,n,C,I)})}(i.plugins||[]).forEach(y=>{for(let C in y.hooks)Al[C]=(Al[C]||[]).concat(y.hooks[C])});const vp=(y,C,I)=>I,xn=bn({key:null,setSeries:!1,filters:{pub:qp,sub:qp},scales:[M,x[1]?x[1].scale:null],match:[Yp,Yp,vp],values:[null,null]},se.sync);xn.match.length==2&&xn.match.push(vp),se.sync=xn;const bp=xn.key,Ah=zg(bp);function Ao(y,C,I,F,W,ie,fe){xn.filters.pub(y,C,I,F,W,ie,fe)&&Ah.pub(y,C,I,F,W,ie,fe)}Ah.sub(n);function Yx(y,C,I,F,W,ie,fe){xn.filters.sub(y,C,I,F,W,ie,fe)&&_a[y](null,C,I,F,W,ie,fe)}n.pub=Yx;function jx(){Ah.unsub(n),Hu.delete(n),Tt.clear(),Uu(Pc,Xa,xp),l.remove(),Z?.remove(),Un("destroy")}n.destroy=jx;function Rh(){Un("init",i,e),El(e||i.data,!1),O[M]?bh(M,O[M]):So(),nt=Jt.show&&(Jt.width>0||Jt.height>0),qe=st=!0,$(i.width,i.height)}return x.forEach(yl),T.forEach(Mo),t?t instanceof HTMLElement?(t.appendChild(l),Rh()):t(n,Rh):Rh(),n}qn.assign=bn;qn.fmtNum=ef;qn.rangeNum=Dc;qn.rangeLog=eh;qn.rangeAsinh=Jd;qn.orient=ra;qn.pxRatio=Ut;qn.join=nb;qn.fmtDate=nf,qn.tzDate=fb;qn.sync=zg;{qn.addGap=jb,qn.clipGaps=ih;let i=qn.paths={points:Xg};i.linear=Yg,i.stepped=Jb,i.bars=Qb,i.spline=tM}const dM="#898781",gm="#2c2c2a",Nl={L:"#3987e5",R:"#e66767",X:"#199e70",Y:"#c98500"},Nc=(i="")=>({stroke:dM,grid:{stroke:gm,width:1},ticks:{stroke:gm,width:1},font:'11px ui-monospace, "Share Tech Mono", monospace',label:i,labelFont:"11px ui-monospace, monospace",labelSize:i?18:0}),fM=(i,e)=>/L$/.test(i)?Nl.L:/R$/.test(i)?Nl.R:[Nl.X,Nl.Y][e%2],pM={elbowL:"codo izq",elbowR:"codo der",elbowAvg:"codo",extL:"ext. brazo izq",extR:"ext. brazo der",bodyY:"altura cuerpo",balance:"peso izq↔der",kneeL:"rodilla izq",kneeR:"rodilla der"},mM=i=>pM[i]??i;function Ic(i,e){return{width:Math.max(120,i.clientWidth),height:e}}class gM{constructor(e,t=150){this.el=e,this.height=t,this.u=null,this.keys=null,new ResizeObserver(()=>this.u?.setSize(Ic(this.el,this.height))).observe(e)}build(e){this.u?.destroy(),this.keys=e,this.el.innerHTML="";const t={...Ic(this.el,this.height),legend:{show:!0,live:!1},cursor:{show:!1},scales:{x:{time:!1}},axes:[Nc(),Nc()],series:[{label:"s"},...e.map((n,s)=>({label:mM(n),stroke:fM(n,s),width:2,points:{show:!1}}))]};this.u=new qn(t,[[],...e.map(()=>[])],this.el)}update(e,t){if(!t?.length){this.el.style.display="none";return}this.el.style.display="",(!this.u||t.join()!==this.keys.join())&&this.build(t);const n=e.map(r=>r.t/1e3),s=t.map((r,a)=>e.map(o=>Number.isFinite(o.v[a])?o.v[a]:null));this.u.setData([n,...s])}}class hf{constructor(e,t=150){this.el=e,this.height=t,new ResizeObserver(()=>this.u?.setSize(Ic(this.el,this.height))).observe(e)}update(e){const t=Math.max(0,...e.map(r=>r.values.length));if(!t){this.el.style.display="none";return}this.el.style.display="";const n=e.map(r=>r.label).join();(!this.u||this.sig!==n)&&(this.u?.destroy(),this.sig=n,this.el.innerHTML="",this.u=new qn({...Ic(this.el,this.height),legend:{show:e.length>1,live:!1},cursor:{points:{size:8}},scales:{x:{time:!1}},axes:[{...Nc("rep"),incrs:[1,2,5,10,20,50]},Nc("s")],series:[{label:"rep"},...e.map(r=>({label:r.label,stroke:r.color,width:2,points:{show:!0,size:8,fill:r.color,stroke:"#1a1a19",width:2}}))]},[[],...e.map(()=>[])],this.el));const s=Array.from({length:t},(r,a)=>a+1);this.u.setData([s,...e.map(r=>s.map((a,o)=>r.values[o]??null))])}}function Jg(i,e,{mirror:t=!0,aspect:n=16/9,bins:s=48}={}){const r=i.getBoundingClientRect(),a=Math.min(2,window.devicePixelRatio||1);i.width=Math.max(1,Math.round(r.width*a)),i.height=Math.max(1,Math.round(r.width/n*a)),i.style.height=`${Math.round(r.width/n)}px`;const o=i.getContext("2d"),c=i.width,l=i.height;o.fillStyle="#0d0d0d",o.fillRect(0,0,c,l);const h=s,d=Math.max(8,Math.round(s/n)),u=new Float32Array(h*d);for(const[g,x]of e){const T=Math.floor((t?1-g:g)*h),b=Math.floor(x*d);T>=0&&T<h&&b>=0&&b<d&&u[b*h+T]++}const f=Math.max(1,...u),p=["#104281","#184f95","#1c5cab","#256abf","#2a78d6","#3987e5","#5598e7","#86b6ef","#cde2fb"],m=c/h,_=l/d;for(let g=0;g<u.length;g++){if(!u[g])continue;const x=Math.sqrt(u[g]/f);o.fillStyle=p[Math.min(p.length-1,Math.floor(x*p.length))],o.fillRect(g%h*m,Math.floor(g/h)*_,m-1,_-1)}}const _m=(i,e)=>1/(1+1/(2*Math.PI*i)/e);class Mc{constructor({minCutoff:e=1.5,beta:t=20,dCutoff:n=1}={}){this.minCutoff=e,this.beta=t,this.dCutoff=n,this.reset()}reset(){this.tPrev=null,this.xPrev=0,this.dxPrev=0}filter(e,t){if(this.tPrev===null)return this.tPrev=t,this.xPrev=e,this.dxPrev=0,e;const n=Math.max(.001,t-this.tPrev),s=(e-this.xPrev)/n,r=this.dxPrev+_m(this.dCutoff,n)*(s-this.dxPrev),a=this.minCutoff+this.beta*Math.abs(r),o=this.xPrev+_m(a,n)*(e-this.xPrev);return this.tPrev=t,this.xPrev=o,this.dxPrev=r,o}}class xm{constructor(e={}){this.params=e,this.build()}build(){const e=()=>new Mc(this.params);this.f=Array.from({length:Li},()=>[e(),e(),e()]),this.fw=Array.from({length:Li},()=>[e(),e(),e()]),this.tLast=null}configure(e){this.params={...this.params,...e},this.build()}reset(){this.build()}smooth(e){this.tLast!==null&&e.t-this.tLast>500&&this.reset(),this.tLast=e.t;const t=e.t/1e3,n=e.pts.map((r,a)=>[this.f[a][0].filter(r[0],t),this.f[a][1].filter(r[1],t),this.f[a][2].filter(r[2],t),r[3]]),s=e.world?e.world.map((r,a)=>[this.fw[a][0].filter(r[0],t),this.fw[a][1].filter(r[1],t),this.fw[a][2].filter(r[2],t)]):null;return{t:e.t,aspect:e.aspect,pts:n,world:s}}}const _M=[["l_shoulder","r_hip","C"],["r_shoulder","l_hip","C"],["l_shoulder","nose","C"],["r_shoulder","nose","C"]],mr=[...Qx,..._M],xM=3,vM=20,bM=400,vm=.6,MM=.05,yM=mr.map(([i,e],t)=>{const n=a=>a.startsWith("l_")?`r_${a.slice(2)}`:a.startsWith("r_")?`l_${a.slice(2)}`:a,s=n(i),r=n(e);return s===i&&r===e?-1:mr.findIndex(([a,o])=>a===s&&o===r||a===r&&o===s)}),SM=i=>{if(!i.length)return NaN;const e=[...i].sort((t,n)=>t-n);return e[e.length>>1]},wM=(i,e,t)=>Math.hypot(i[e][0]-i[t][0],i[e][1]-i[t][1],i[e][2]-i[t][2]);function EM(i){const e=i.map(t=>t.length>=vM?SM(t):NaN);return e.map((t,n)=>{const s=yM[n];return s<0||!Number.isFinite(e[s])?t:Number.isFinite(t)?(t+e[s])/2:e[s]})}function TM(i,e,t){const n=i.map(c=>[c[0],c[1],c[2]]),s=e.map(c=>Math.max(MM,c[3]));for(let c=0;c<xM;c++)for(let l=0;l<mr.length;l++){const h=t[l];if(!Number.isFinite(h)||h<=0)continue;const d=Be[mr[l][0]],u=Be[mr[l][1]],f=n[u][0]-n[d][0],p=n[u][1]-n[d][1],m=n[u][2]-n[d][2],_=Math.hypot(f,p,m);if(_<1e-6)continue;const g=(_-h)/_,x=s[u]/(s[d]+s[u]),T=s[d]/(s[d]+s[u]);n[d][0]+=f*g*x,n[d][1]+=p*g*x,n[d][2]+=m*g*x,n[u][0]-=f*g*T,n[u][1]-=p*g*T,n[u][2]-=m*g*T}const r=(n[Be.l_hip][0]+n[Be.r_hip][0])/2,a=(n[Be.l_hip][1]+n[Be.r_hip][1])/2,o=(n[Be.l_hip][2]+n[Be.r_hip][2])/2;for(let c=0;c<Li;c++)n[c][0]-=r,n[c][1]-=a,n[c][2]-=o;return n}class AM{constructor({lengths:e=null,learn:t=!0}={}){this.fixed=e,this.learn=t&&!e,this.reset()}configure({lengths:e}={}){e&&(this.fixed=e,this.learn=!1,this.lengths=e)}reset(){this.acc=mr.map(()=>[]),this.lengths=this.fixed??mr.map(()=>NaN),this.seen=0}apply(e){const t=e.world;if(!t)return null;if(this.learn){let n=!1;mr.forEach(([s,r],a)=>{const o=Be[s],c=Be[r];if(e.pts[o][3]<vm||e.pts[c][3]<vm)return;const l=this.acc[a];l.push(wM(t,o,c)),l.length>bM&&l.shift(),n=!0}),n&&(++this.seen<120?this.seen%10===0:this.seen%60===0)&&(this.lengths=EM(this.acc))}return this.lengths.some(Number.isFinite)?TM(t,e.pts,this.lengths):t}}const RM=.35,CM=8,bm=.4,Mm=8,ym=.02;(()=>{const i=new Array(Li).fill(.35);for(const e of["l_shoulder","r_shoulder","l_hip","r_hip"])i[Be[e]]=1;for(const e of["nose","l_ear","r_ear","l_elbow","r_elbow","l_knee","r_knee"])i[Be[e]]=.7;return i})();function LM(i,e=60){return i/2/Math.tan(e*Math.PI/360)}const Qg=60;function PM(i,e){const t=[[i[0][0],i[0][1],i[0][2],e[0]],[i[1][0],i[1][1],i[1][2],e[1]],[i[2][0],i[2][1],i[2][2],e[2]]];for(let n=0;n<3;n++){let s=n;for(let r=n+1;r<3;r++)Math.abs(t[r][n])>Math.abs(t[s][n])&&(s=r);if(Math.abs(t[s][n])<1e-12)return null;[t[n],t[s]]=[t[s],t[n]];for(let r=0;r<3;r++){if(r===n)continue;const a=t[r][n]/t[n][n];for(let o=n;o<4;o++)t[r][o]-=a*t[n][o]}}return[t[0][3]/t[0][0],t[1][3]/t[1][1],t[2][3]/t[2][2]]}function DM(i,{f:e,k:t=1,ground:n=null}={}){const s=i.world;if(!s)return null;const r=i.aspect,a=[],o=[],c=[],l=[],h=[],d=[];for(let v=0;v<Li;v++){const E=i.pts[v];E[3]<RM||(a.push((E[0]-.5)*r),o.push(E[1]-.5),c.push(t*s[v][0]),l.push(t*s[v][1]),h.push(t*s[v][2]),d.push(E[3]*E[3]))}const u=a.length;if(u<CM)return null;let f=0,p=0,m=0,_=0,g=0;for(let v=0;v<u;v++)f+=d[v],p+=d[v]*a[v],m+=d[v]*o[v],_+=d[v]*c[v],g+=d[v]*l[v];p/=f,m/=f,_/=f,g/=f;let x=0,T=0;for(let v=0;v<u;v++){const E=c[v]-_,P=l[v]-g;x+=d[v]*((a[v]-p)*E+(o[v]-m)*P),T+=d[v]*(E*E+P*P)}if(T<1e-9||x<=1e-9)return null;const b=x/T;let S=e/b;if(!(S>bm&&S<Mm))return null;let M=S*p/e-_,A=S*m/e-g;for(let v=0;v<2;v++){const E=[[0,0,0],[0,0,0],[0,0,0]],P=[0,0,0];for(let L=0;L<u;L++){const k=h[L]+S;if(k<.1)continue;const U=c[L]+M,O=l[L]+A,X=e*U/k-a[L],z=e*O/k-o[L],re=Math.hypot(X,z),q=d[L]*(re>ym?ym/re:1),te=[e/k,0,-e*U/(k*k)],H=[0,e/k,-e*O/(k*k)];for(let J=0;J<3;J++){for(let se=0;se<3;se++)E[J][se]+=q*(te[J]*te[se]+H[J]*H[se]);P[J]-=q*(te[J]*X+H[J]*z)}}if(n?.n&&n.idx?.length){const{n:L,c:k}=n,U=n.w??400;for(const O of n.idx){const X=[t*s[O][0]+M,t*s[O][1]+A,t*s[O][2]+S],z=L[0]*X[0]+L[1]*X[1]+L[2]*X[2]+k;for(let re=0;re<3;re++){for(let q=0;q<3;q++)E[re][q]+=U*L[re]*L[q];P[re]-=U*L[re]*z}}}for(let L=0;L<3;L++)E[L][L]+=1e-9;const D=PM(E,P);if(!D)break;if(M+=D[0],A+=D[1],S+=D[2],!(S>bm&&S<Mm))return null;if(Math.hypot(D[0],D[1],D[2])<1e-4)break}return[M,A,S]}const kM={minCutoff:1,beta:8,dCutoff:1},NM={minCutoff:.12,beta:.4,dCutoff:.5};class IM{constructor({fovH:e=Qg,k:t=1,xy:n=kM,z:s=NM}={}){this.fovH=e,this.k=t,this.sxy=n,this.sz=s,this.reset()}configure({fovH:e,k:t}={}){e!=null&&(this.fovH=e),t!=null&&(this.k=t)}reset(){this.f=[new Mc(this.sxy),new Mc(this.sxy),new Mc(this.sz)],this.last=null,this.tLast=null}update(e,t=null){this.tLast!==null&&e.t-this.tLast>500&&this.reset(),this.tLast=e.t;const n=LM(e.aspect,this.fovH),s=DM(e,{f:n,k:this.k,ground:t});if(!s)return this.last?{T:this.last,f:n,k:this.k,fresh:!1}:null;const r=e.t/1e3,a=[this.f[0].filter(s[0],r),this.f[1].filter(s[1],r),this.f[2].filter(s[2],r)];return this.last=a,{T:a,f:n,k:this.k,fresh:!0}}}const UM=.5,FM=.35,Sm=.12,OM=15e3,BM=1500,zM=600,HM=500,e_=35*Math.PI/180,VM=150,GM=120,WM=25,Fh=8,Oh=[["l_ankle","l_heel","l_toe"],["r_ankle","r_heel","r_toe"]],Gu=[0,-1,0],$M=["l_shoulder","r_shoulder","l_hip","r_hip","l_knee","r_knee","l_ankle","r_ankle"],Ti=(i,e)=>i[0]*e[0]+i[1]*e[1]+i[2]*e[2],gr=i=>{const e=Math.hypot(i[0],i[1],i[2])||1;return[i[0]/e,i[1]/e,i[2]/e]},XM=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],Uc=(i,e)=>[i[0]-e[0],i[1]-e[1],i[2]-e[2]],wm=(i,e)=>[(i[0]+e[0])/2,(i[1]+e[1])/2,(i[2]+e[2])/2],yc=i=>{const e=[...i].sort((t,n)=>t-n);return e.length?e[e.length>>1]:NaN},t_=i=>i[0]>-.03&&i[0]<1.03&&i[1]>-.03&&i[1]<1.03,qM=(i,e)=>Ti(e.n,i)+e.c;function Em(i,e,t){const n=gr(Uc(i,e)),s=gr(Uc(t,e));return Math.acos(Math.max(-1,Math.min(1,Ti(n,s))))*180/Math.PI}function YM(i,e){if(!e||!$M.every(a=>i.pts[Be[a]][3]>=.6&&t_(i.pts[Be[a]])))return null;const t=Math.min(Em(e[Be.l_hip],e[Be.l_knee],e[Be.l_ankle]),Em(e[Be.r_hip],e[Be.r_knee],e[Be.r_ankle]));if(t<GM)return null;const n=wm(e[Be.l_shoulder],e[Be.r_shoulder]),s=wm(e[Be.l_ankle],e[Be.r_ankle]),r=gr(Uc(n,s));return Math.acos(Math.min(1,Ti(r,Gu)))>e_?null:{v:r,strict:t>=VM}}function jM(i){if(!i.length)return null;const e=gr([yc(i.map(r=>r[0])),yc(i.map(r=>r[1])),yc(i.map(r=>r[2]))]),t=Math.cos(WM*Math.PI/180);let n=[0,0,0],s=0;for(const r of i)Ti(r,e)>=t&&(n=[n[0]+r[0],n[1]+r[1],n[2]+r[2]],s++);return s?gr(n):e}class KM{constructor({up:e=null}={}){this.seed=e,this.reset()}configure({up:e}={}){e&&(this.seed=gr(e),this.up=this.seed)}reset(){this.buf=[],this.axes=[],this.up=this.seed??Gu,this.upConf=this.seed?.6:0,this.c=null,this.lastFit=-1e9,this.prev={},this.tPrev=null,this.floorGuess=null,this.origin=null,this.contact=[!1,!1],this.contactIdx=[]}_foot(e,t,n){const s=n.map(r=>Be[r]);return s.some(r=>t[r][3]<UM||!t_(t[r]))?null:s.map(r=>e[r])}update(e,t,n,s=1){if(!t||!n)return null;const r=e.t;this.tPrev!==null&&r-this.tPrev>500&&this.reset();const a=this.tPrev===null?0:(r-this.tPrev)/1e3;this.tPrev=r;const o=YM(e,t);o&&(this.axes.push(o),this.axes.length>zM&&this.axes.shift());const c=t.map(x=>[s*x[0]+n[0],s*x[1]+n[1],s*x[2]+n[2]]);this.contact=[!1,!1],this.contactIdx=[];for(let x=0;x<2;x++){const T=this._foot(c,e.pts,Oh[x]);if(!T){this.prev[x]=null;continue}const b=T[0],S=this.prev[x];if(this.prev[x]=b,!S||a<=0||Math.hypot(b[0]-S[0],b[1]-S[1],b[2]-S[2])/a>FM)continue;const M=this.plane();if(M){if(Math.min(...T.map(A=>qM(A,M)))>Sm)continue}else{const A=Math.max(...T.map(v=>v[1]));if(this.floorGuess===null||A>this.floorGuess?this.floorGuess=A:this.floorGuess=this.floorGuess*.999+A*.001,this.floorGuess-A>Sm)continue}this.contact[x]=!0,this.contactIdx.push(Be[Oh[x][1]],Be[Oh[x][2]]);for(const A of T)this.buf.push([A[0],A[1],A[2],r])}for(;this.buf.length&&r-this.buf[0][3]>OM;)this.buf.shift();for(;this.buf.length>BM;)this.buf.shift();if(r-this.lastFit>HM){this.lastFit=r;const x=this.axes.filter(b=>b.strict),T=x.length>=Fh?x:this.axes;if(T.length>=Fh){const b=jM(T.map(S=>S.v));b&&Math.acos(Math.min(1,Ti(b,Gu)))<=e_&&(this.up=this.upConf?gr([this.up[0]*.7+b[0]*.3,this.up[1]*.7+b[1]*.3,this.up[2]*.7+b[2]*.3]):b,this.upConf=Math.min(1,T.length/60)*(x.length>=Fh?1:.6))}if(this.buf.length>=6){const b=-yc(this.buf.map(S=>Ti(this.up,S)));this.c=this.c===null?b:this.c+(b-this.c)*.25}}const l=this.plane();if(!l)return null;const h=l.n,d=[0,0,-1],u=gr(Uc(d,[Ti(d,h)*h[0],Ti(d,h)*h[1],Ti(d,h)*h[2]])),f=XM(h,u),p=x=>[Ti(x,f),Ti(x,h)+l.c,Ti(x,u)],m=p(n);this.origin||(this.origin=[m[0],0,m[2]]);const _=this.origin;return{ok:!0,j:c.map(x=>{const T=p(x);return[T[0]-_[0],T[1],T[2]-_[2]]}),root:[m[0]-_[0],m[1],m[2]-_[2]],floor:{n:h,c:l.c,conf:Math.min(this.upConf,this.c===null?0:1),pts:this.buf.length},cam:{pitch:Math.asin(Math.max(-1,Math.min(1,-h[2]))),roll:Math.atan2(h[0],-h[1])}}}plane(){return this.c!==null?{n:this.up,c:this.c}:this.floorGuess===null?null:{n:this.up,c:-Ti(this.up,[0,this.floorGuess,0])}}}const ZM=.25;class JM{constructor({calib:e=null,fovH:t=Qg}={}){this.fovH=e?.fov??t,this.k=e?.k??1,this.bones=e?.bones??null,this.up=e?.up??null,this.reset()}setCalib(e){e&&(Number.isFinite(e.k)&&(this.k=e.k),e.fov&&(this.fovH=e.fov),e.bones&&(this.bones=e.bones),e.up&&(this.up=e.up),this.rig.configure({lengths:this.bones??void 0}),this.root.configure({fovH:this.fovH,k:this.k}),this.ground.configure({up:this.up??void 0}))}reset(){this.rig=new AM({lengths:this.bones}),this.root=new IM({fovH:this.fovH,k:this.k}),this.ground=new KM({up:this.up}),this.prev=null,this.tPrev=null}step(e){if(!e.world)return{...e,g:null};const t=this.rig.apply(e),n=this.ground.plane(),s=n&&this.ground.contactIdx.length?{n:n.n,c:n.c,idx:this.ground.contactIdx}:null,r=this.root.update({...e,world:t},s);if(!r)return this.prev=null,{...e,world:t,g:null};const a=this.ground.update(e,t,r.T,this.k);if(!a)return this.prev=null,{...e,world:t,g:null};const o=this.tPrev===null?0:(e.t-this.tPrev)/1e3;let c=null;if(this.prev&&o>0&&o<=ZM){c=new Array(Li);for(let l=0;l<Li;l++)c[l]=[(a.j[l][0]-this.prev[l][0])/o,(a.j[l][1]-this.prev[l][1])/o,(a.j[l][2]-this.prev[l][2])/o]}return this.prev=a.j,this.tPrev=e.t,{...e,world:t,g:{pts:a.j,vel:c,root:a.root,floor:a.floor,cam:a.cam,contact:{l:this.ground.contact[0],r:this.ground.contact[1]},k:this.k,fov:this.fovH}}}}const qa=180/Math.PI,Ya=.35,Va=(i,e,t)=>i<e?e:i>t?t:i,Tn=(i,e)=>Math.hypot(i.x-e.x,i.y-e.y),Yr=(i,e)=>({x:(i.x+e.x)/2,y:(i.y+e.y)/2,z:((i.z||0)+(e.z||0))/2,v:Math.min(i.v,e.v)});function QM(i,e,t){const n=i.x-e.x,s=i.y-e.y,r=t.x-e.x,a=t.y-e.y,o=Math.hypot(n,s)*Math.hypot(r,a);return o<1e-9?NaN:Math.acos(Va((n*r+s*a)/o,-1,1))*qa}function e1(i,e,t){const n=[i[0]-e[0],i[1]-e[1],i[2]-e[2]],s=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],r=Math.hypot(...n)*Math.hypot(...s);return r<1e-9?NaN:Math.acos(Va((n[0]*s[0]+n[1]*s[1]+n[2]*s[2])/r,-1,1))*qa}function Tm(i,e,t){const n=t.x-e.x,s=t.y-e.y,r=Math.hypot(n,s);return r<1e-9?Tn(i,e):Math.abs(n*(i.y-e.y)-s*(i.x-e.x))/r}function uf(i){const e={};for(let t=0;t<zi.length;t++){const n=i.pts[t];e[zi[t]]={x:n[0]*i.aspect,y:n[1],z:n[2],v:n[3]}}return e}const Dt=(i,...e)=>e.every(t=>i[t].v>=Ya),sn=(i,e)=>i?e():NaN,Fc=(i,e)=>Number.isFinite(i)&&Number.isFinite(e)?(i+e)/2:Number.isFinite(i)?i:e;function t1(i,e=null){const t=uf(i),n=i.world,s=P=>n[Be[P]],r=(P,D,L)=>n?e1(s(P),s(D),s(L)):QM(t[P],t[D],t[L]),a=Yr(t.l_shoulder,t.r_shoulder),o=Yr(t.l_hip,t.r_hip),c=Yr(t.l_ankle,t.r_ankle),l=Tn(t.l_shoulder,t.r_shoulder),h=Tn(a,o),d=e?.shoulderWidth||l||1e-6,u=e?.torsoLen||h||1e-6,f=Fc(Tn(t.l_knee,t.l_ankle),Tn(t.r_knee,t.r_ankle)),p=e?.shinLen||f||1e-6,m={};m.sw=l,m.torso=h,m.elbowL=sn(Dt(t,"l_shoulder","l_elbow","l_wrist"),()=>r("l_shoulder","l_elbow","l_wrist")),m.elbowR=sn(Dt(t,"r_shoulder","r_elbow","r_wrist"),()=>r("r_shoulder","r_elbow","r_wrist")),m.elbowAvg=Fc(m.elbowL,m.elbowR);const _=[m.elbowL,m.elbowR].filter(Number.isFinite);m.elbowMin=_.length?Math.min(..._):NaN,m.shoulderL=sn(Dt(t,"l_hip","l_shoulder","l_elbow"),()=>r("l_hip","l_shoulder","l_elbow")),m.shoulderR=sn(Dt(t,"r_hip","r_shoulder","r_elbow"),()=>r("r_hip","r_shoulder","r_elbow")),m.kneeL=sn(Dt(t,"l_hip","l_knee","l_ankle"),()=>r("l_hip","l_knee","l_ankle")),m.kneeR=sn(Dt(t,"r_hip","r_knee","r_ankle"),()=>r("r_hip","r_knee","r_ankle")),m.hipL=sn(Dt(t,"l_shoulder","l_hip","l_knee"),()=>r("l_shoulder","l_hip","l_knee")),m.hipR=sn(Dt(t,"r_shoulder","r_hip","r_knee"),()=>r("r_shoulder","r_hip","r_knee")),m.torsoAngle=sn(Dt(t,"l_shoulder","r_shoulder","l_hip","r_hip"),()=>Math.abs(Math.atan2(a.x-o.x,o.y-a.y))*qa),m.shoulderTilt=sn(Dt(t,"l_shoulder","r_shoulder"),()=>{let P=Math.atan2(t.r_shoulder.y-t.l_shoulder.y,t.l_shoulder.x-t.r_shoulder.x)*qa;return P>90?P-=180:P<-90&&(P+=180),P}),m.facingAway=Dt(t,"l_shoulder","r_shoulder")&&t.l_shoulder.x<t.r_shoulder.x?1:0,m.yaw=sn(Dt(t,"l_shoulder","r_shoulder"),()=>Math.acos(Va(l/d,0,1))*qa);const g=n?s("l_shoulder")[2]:t.l_shoulder.z,x=n?s("r_shoulder")[2]:t.r_shoulder.z;m.yawSigned=Number.isFinite(m.yaw)?(g<x?1:-1)*m.yaw:NaN,m.elbowGapL=sn(Dt(t,"l_shoulder","l_hip","l_elbow"),()=>Tm(t.l_elbow,t.l_shoulder,t.l_hip)/d),m.elbowGapR=sn(Dt(t,"r_shoulder","r_hip","r_elbow"),()=>Tm(t.r_elbow,t.r_shoulder,t.r_hip)/d),m.elbowGapMax=Math.max(...[m.elbowGapL,m.elbowGapR].filter(Number.isFinite),-1/0),Number.isFinite(m.elbowGapMax)||(m.elbowGapMax=NaN),m.wristRelL=sn(Dt(t,"l_wrist","l_shoulder"),()=>(t.l_shoulder.y-t.l_wrist.y)/u),m.wristRelR=sn(Dt(t,"r_wrist","r_shoulder"),()=>(t.r_shoulder.y-t.r_wrist.y)/u);const T=Math.min(t.nose.y,t.l_ear.v>=Ya?t.l_ear.y:9,t.r_ear.v>=Ya?t.r_ear.y:9);m.wristHeadL=sn(Dt(t,"l_wrist","nose"),()=>(T-t.l_wrist.y)/u),m.wristHeadR=sn(Dt(t,"r_wrist","nose"),()=>(T-t.r_wrist.y)/u),m.aboveHeadL=Number.isFinite(m.wristHeadL)?m.wristHeadL>.02?1:0:NaN,m.aboveHeadR=Number.isFinite(m.wristHeadR)?m.wristHeadR>.02?1:0:NaN,m.aboveHeadBoth=m.aboveHeadL===1&&m.aboveHeadR===1?1:0,m.aboveShoulderL=Number.isFinite(m.wristRelL)?m.wristRelL>0?1:0:NaN,m.aboveShoulderR=Number.isFinite(m.wristRelR)?m.wristRelR>0?1:0:NaN,m.faceDistL=sn(Dt(t,"l_wrist","nose"),()=>Tn(t.l_wrist,t.nose)/d),m.faceDistR=sn(Dt(t,"r_wrist","nose"),()=>Tn(t.r_wrist,t.nose)/d),m.wristGap=sn(Dt(t,"l_wrist","r_wrist"),()=>Tn(t.l_wrist,t.r_wrist)/d);const b=e?.armLen,S=P=>{const D=`${P}_shoulder`,L=`${P}_elbow`,k=`${P}_wrist`;if(!Dt(t,D,L,k))return NaN;if(n){const O=Math.hypot(...s(D).map((z,re)=>z-s(k)[re])),X=Math.hypot(...s(D).map((z,re)=>z-s(L)[re]))+Math.hypot(...s(L).map((z,re)=>z-s(k)[re]));return Va(O/X,0,1.1)}const U=b||Tn(t[D],t[L])+Tn(t[L],t[k]);return Va(Tn(t[D],t[k])/U,0,1.1)};m.extL=S("l"),m.extR=S("r");for(const P of["l","r"]){const D=P.toUpperCase(),L=Dt(t,`${P}_wrist`,`${P}_shoulder`);m[`wx${D}`]=L?(t[`${P}_wrist`].x-t[`${P}_shoulder`].x)/d:NaN,m[`wy${D}`]=L?(t[`${P}_wrist`].y-t[`${P}_shoulder`].y)/d:NaN}const M=P=>{const D=t[`${P}_wrist`],L=m[`faceDist${P.toUpperCase()}`]<1.6,k=D.y<a.y+.15*u&&D.y>t.nose.y-.5*u,U=m[`elbow${P.toUpperCase()}`]<135;return Dt(t,`${P}_wrist`,"nose")&&L&&k&&U&&!m.facingAway?1:0};m.guardL=M("l"),m.guardR=M("r"),m.guardBoth=m.guardL&&m.guardR?1:0;const A=Dt(t,"l_ankle","r_ankle");m.leadDelta=A?(t.l_ankle.y-t.r_ankle.y)/u:NaN,m.ankleLift=A?Math.abs(t.l_ankle.y-t.r_ankle.y)/p:NaN,m.raisedLeg=A&&m.ankleLift>.3?t.l_ankle.y<t.r_ankle.y?1:-1:0;const v=i1(t)??{x:.6*o.x+.4*a.x,y:.6*o.y+.4*a.y};m.comX=v.x/i.aspect,m.comY=v.y,m.com3=n?s1(n):null;const E=t.r_ankle.x-t.l_ankle.x;return m.balance=A&&Math.abs(E)>.2*d?Va(2*((v.x-t.l_ankle.x)/E)-1,-1.3,1.3):NaN,m.hipY=Dt(t,"l_hip","r_hip")?o.y/u:NaN,m.bodyY=A&&Dt(t,"l_hip","r_hip")?(o.y+c.y)/2/u:NaN,m.feetY=A?c.y/u:NaN,m._g={sm:a,hm:o,am:c,com:v},m}const n1=[["_neck","_head",.081,1],["_hipmid","_shmid",.497,.5],["l_shoulder","l_elbow",.028,.436],["r_shoulder","r_elbow",.028,.436],["l_elbow","l_wrist",.016,.43],["r_elbow","r_wrist",.016,.43],["l_wrist","l_wrist",.006,0],["r_wrist","r_wrist",.006,0],["l_hip","l_knee",.1,.433],["r_hip","r_knee",.1,.433],["l_knee","l_ankle",.0465,.433],["r_knee","r_ankle",.0465,.433],["l_heel","l_toe",.0145,.5],["r_heel","r_toe",.0145,.5]];function n_(i,e){let t=0,n=0,s=0,r=0;for(const[a,o,c,l]of n1){if(!e(a)||!e(o))continue;const h=i(a),d=i(o);t+=c*(h[0]+l*(d[0]-h[0])),n+=c*(h[1]+l*(d[1]-h[1])),s+=c*((h[2]??0)+l*((d[2]??0)-(h[2]??0))),r+=c}return r>=.75?[t/r,n/r,s/r]:null}const fr=(i,e)=>i.map((t,n)=>(t+e[n])/2);function i1(i){const e=o=>[i[o].x,i[o].y,0],t={_shmid:()=>fr(e("l_shoulder"),e("r_shoulder")),_hipmid:()=>fr(e("l_hip"),e("r_hip")),_neck:()=>fr(e("l_shoulder"),e("r_shoulder")),_head:()=>i.l_ear.v>=Ya&&i.r_ear.v>=Ya?fr(e("l_ear"),e("r_ear")):e("nose")},n={_shmid:["l_shoulder","r_shoulder"],_hipmid:["l_hip","r_hip"],_neck:["l_shoulder","r_shoulder"],_head:["nose"]},a=n_(o=>t[o]?t[o]():e(o),o=>(n[o]??[o]).every(c=>i[c].v>=Ya));return a?{x:a[0],y:a[1]}:null}function s1(i){const e=n=>i[Be[n]],t={_shmid:()=>fr(e("l_shoulder"),e("r_shoulder")),_hipmid:()=>fr(e("l_hip"),e("r_hip")),_neck:()=>fr(e("l_shoulder"),e("r_shoulder")),_head:()=>fr(e("l_ear"),e("r_ear"))};return n_(n=>t[n]?t[n]():e(n),()=>!0)}const r1=i=>{const e=i.filter(Number.isFinite).sort((t,n)=>t-n);return e.length?e[Math.floor(e.length/2)]:NaN};function a1(i){const e=i.map(n=>{const s=uf(n);if(!Dt(s,"l_shoulder","r_shoulder","l_hip","r_hip"))return null;const r=Yr(s.l_shoulder,s.r_shoulder),a=Yr(s.l_hip,s.r_hip);return{shoulderWidth:Tn(s.l_shoulder,s.r_shoulder),torsoLen:Tn(r,a),shinLen:Fc(sn(Dt(s,"l_knee","l_ankle"),()=>Tn(s.l_knee,s.l_ankle)),sn(Dt(s,"r_knee","r_ankle"),()=>Tn(s.r_knee,s.r_ankle))),armLen:Fc(sn(Dt(s,"l_shoulder","l_elbow","l_wrist"),()=>Tn(s.l_shoulder,s.l_elbow)+Tn(s.l_elbow,s.l_wrist)),sn(Dt(s,"r_shoulder","r_elbow","r_wrist"),()=>Tn(s.r_shoulder,s.r_elbow)+Tn(s.r_elbow,s.r_wrist))),shoulderTilt:Math.atan2(s.r_shoulder.y-s.l_shoulder.y,s.l_shoulder.x-s.r_shoulder.x)*qa}}).filter(Boolean);if(e.length<5)return null;const t={};for(const n of Object.keys(e[0]))t[n]=r1(e.map(s=>s[n]));return t.frames=e.length,!Number.isFinite(t.shoulderWidth)||!Number.isFinite(t.torsoLen)?null:t}const Am=i=>(i/1e3).toFixed(2);class o1{constructor(e){this.cfg={minRepMs:400,outIsConcentric:!0,...e},this.reset()}reset(){this.state="rest",this.reps=[],this.partials=0,this.lastRestT=null,this.restVal=null,this.maxP=0,this.peakP=0,this.peakT=null,this.peakV=null,this.p=0}progress(e){const{restThr:t,workThr:n}=this.cfg;return(e-t)/(n-t)}update(e,t){if(!Number.isFinite(t))return null;const n=this.progress(t);if(this.p=n,this.state==="rest"){if(n<=0){const s=this.lastRestT!==null&&this.maxP>=.6&&this.maxP<1;if(this.lastRestT=e,this.restVal=t,this.maxP=0,s)return this.partials++,{partial:!0,t:e}}else this.maxP=Math.max(this.maxP,n),n>=1&&this.lastRestT!==null&&(this.state="work",this.peakP=n,this.peakT=e,this.peakV=t);return null}if(n>this.peakP&&(this.peakP=n,this.peakT=e,this.peakV=t),n<=0){const{outIsConcentric:s,minRepMs:r}=this.cfg,a=this.peakT-this.lastRestT,o=e-this.peakT,c=e-this.lastRestT,l={n:this.reps.length+1,tStart:this.lastRestT,tPeak:this.peakT,tEnd:e,concentricMs:s?a:o,eccentricMs:s?o:a,totalMs:c,peakValue:this.peakV,restValue:this.restVal,rom:Math.abs((this.restVal??t)-this.peakV)};return l.tempo=`${Am(l.concentricMs)}s conc · ${Am(l.eccentricMs)}s exc`,this.state="rest",this.lastRestT=e,this.restVal=t,this.maxP=0,c<r?null:(this.reps.push(l),{rep:l})}return null}get count(){return this.reps.length}}function l1(i,e){if(e<3)return i.slice();e%2===0&&e++;const t=e>>1;return i.map((n,s)=>{const r=[];for(let a=-t;a<=t;a++)r.push(i[Math.min(i.length-1,Math.max(0,s+a))]);return r.sort((a,o)=>a-o),r[t]})}function c1(i,e){if(e<2)return i.slice();e%2===0&&e++;const t=e>>1;return i.map((n,s)=>{let r=0;for(let a=-t;a<=t;a++)r+=i[Math.min(i.length-1,Math.max(0,s+a))];return r/e})}function h1(i){const e=i.map((t,n)=>Number.isFinite(t)?n:-1).filter(t=>t>=0);return e.length?i.map((t,n)=>{if(Number.isFinite(t))return t;let s=-1,r=-1;for(const a of e)if(a<n)s=a;else{r=a;break}return s<0?i[r]:r<0?i[s]:i[s]+(i[r]-i[s])*(n-s)/(r-s)}):i.map(()=>0)}const Wu=(i,e)=>{const t=i.slice().sort((n,s)=>n-s);return t[Math.min(t.length-1,Math.floor(e/100*t.length))]};function u1(i){const e=Math.max(...i);if(e<=0)return 0;const t=[];for(let n=1;n<i.length-1;n++)i[n]>=i[n-1]&&i[n]>i[n+1]&&i[n]>.3*e&&t.push(i[n]);return t.length>=3?Wu(t,50):Wu(i,95)}function d1(i,e,t,n){if(t<=e+2)return e;const s=i.slice(e,t+1),r=s.map((l,h)=>h===0?s[1]-s[0]:h===s.length-1?s[h]-s[h-1]:(s[h+1]-s[h-1])/2);let a=0;for(let l=1;l<r.length;l++)r[l]>r[a]&&(a=l);if(r[a]<=0)return e;const o=n*r[a];let c=a;for(;c>0&&r[c]>o;)c--;return e+c}function f1(i,e,t={}){const{invert:n=!1,peakFraction:s=.6,resetFraction:r=.25,medianK:a=5,meanK:o=5,baselinePercentile:c=10,onsetVelFraction:l=.2,minRepMs:h=400}=t;if(i.length<5)return{reps:[],amplitude:0};let d=h1(e);n&&(d=d.map(v=>-v));const u=c1(l1(d,a),o),f=Wu(u,c),p=u.map(v=>v-f),m=u1(p);if(m<=0)return{reps:[],amplitude:m,displacement:p};const _=s*m,g=r*m,x=[];let T="down",b=0,S=0,M=-1/0;const A=v=>{const E=d1(p,b,S,l),P={n:x.length+1,valleyT:i[b],onsetT:i[E],peakT:i[S],endT:i[v],ascentMs:i[S]-i[b],movingMs:i[S]-i[E],descentMs:i[v]-i[S],totalMs:i[v]-i[b],height:p[S]};P.totalMs>=h&&x.push(P)};for(let v=0;v<p.length;v++)T==="down"?(p[v]<p[b]&&(b=v),p[v]>_&&(T="up",S=v,M=p[v])):(p[v]>M&&(S=v,M=p[v]),p[v]<g&&(A(v),T="down",b=v));return T==="up"&&A(p.length-1),x.forEach((v,E)=>{v.n=E+1}),{reps:x,amplitude:m,baseline:f,displacement:p}}function p1(i,e=1e-6){const t=Math.min(...i),n=Math.max(...i),s=i.findIndex(a=>a<=t+e);let r=i.length-1;for(;r>0&&i[r]<n-e;)r--;return{fast:s,slow:r}}function Rm(i,e="totalMs"){if(!i.length)return{count:0};const t=i.map(c=>c[e]),{fast:n,slow:s}=p1(t),r=t.reduce((c,l)=>c+l,0)/t.length,a=t[n]>0?(t[s]/t[n]-1)*100:0,o=t.length>1?Math.sqrt(t.reduce((c,l)=>c+(l-r)**2,0)/t.length)/r:0;return{count:i.length,meanMs:r,fastMs:t[n],slowMs:t[s],fastRep:n+1,slowRep:s+1,slowdownPct:a,rhythmCv:o,fatigued:s>n&&a>=15}}class m1{constructor({hi:e=.022,lo:t=.006,minGapMs:n=170,windowMs:s=2500}={}){this.cfg={hi:e,lo:t,minGapMs:n,windowMs:s},this.reset()}configure(e){this.cfg={...this.cfg,...e}}reset(){this.buf=[],this.state="ground",this.count=0,this.times=[],this.lastJumpT=-1e9,this.peakUp=0}update(e,t,n=NaN){if(!Number.isFinite(t))return null;const{hi:s,lo:r,minGapMs:a,windowMs:o}=this.cfg;for(this.buf.push({t:e,y:t});this.buf.length&&e-this.buf[0].t>o;)this.buf.shift();if(this.buf.length<8)return null;const l=this.buf.reduce((h,d)=>h+d.y,0)/this.buf.length-t;if(Number.isFinite(n)&&this._trackFeet(e,n),this.state==="ground")l>s&&(this.state="air",this.peakUp=l);else if(this.peakUp=Math.max(this.peakUp,l),l<r&&(this.state="ground",e-this.lastJumpT>=a))return this.count++,this.lastJumpT=e,this.times.push(e),{jump:!0,n:this.count,t:e,amp:this.peakUp};return null}_trackFeet(e,t){for((this._feet||=[]).push({t:e,d:t});this._feet.length&&e-this._feet[0].t>2e3;)this._feet.shift()}get stance(){const e=this._feet;if(!e||e.length<20)return null;if(e.reduce((s,r)=>s+Math.abs(r.d),0)/e.length<.12)return"dos pies";let n=0;for(let s=1;s<e.length;s++)Math.sign(e[s].d)!==Math.sign(e[s-1].d)&&Math.abs(e[s].d)>.1&&n++;return n>=3?"alternado":"un pie"}rate(e,t=10){const n=e-t*1e3,s=this.times.filter(a=>a>=n).length,r=Math.min(t,Math.max(1,(e-(this.times[0]??e))/1e3));return s?s/r*60:0}rhythmCv(e=12){const t=this.times.slice(-e-1);if(t.length<4)return NaN;const n=t.slice(1).map((r,a)=>r-t[a]),s=n.reduce((r,a)=>r+a,0)/n.length;return Math.sqrt(n.reduce((r,a)=>r+(a-s)**2,0)/n.length)/s}}class g1{constructor({graceMs:e=300,minMs:t=500}={}){this.graceMs=e,this.minMs=t,this.reset()}reset(){this.active=!1,this.startT=null,this.lastOkT=null,this.holds=[],this.best=0}get currentMs(){return this.active?this.lastOkT-this.startT:0}update(e,t){if(t)return this.active||(this.active=!0,this.startT=e),this.lastOkT=e,null;if(this.active&&e-this.lastOkT>this.graceMs){this.active=!1;const n=this.lastOkT-this.startT;if(n>=this.minMs)return this.holds.push(n),this.best=Math.max(this.best,n),{hold:!0,ms:n,tStart:this.startT,tEnd:this.lastOkT}}return null}}class _1{constructor({lead:e="L",extHi:t=.82,extLo:n=.62,windowMs:s=450,cooldownMs:r=320,hookSpeed:a=3.2}={}){this.cfg={lead:e,extHi:t,extLo:n,windowMs:s,cooldownMs:r,hookSpeed:a},this.reset()}configure(e){this.cfg={...this.cfg,...e}}reset(){this.buf={L:[],R:[]},this.last={L:-1e9,R:-1e9},this.count={jab:0,cross:0,gancho:0,uppercut:0,directo:0}}get total(){return Object.values(this.count).reduce((e,t)=>e+t,0)}update(e,t){const n=[];for(const s of["L","R"]){const r=t[`ext${s}`],a=t[`wx${s}`],o=t[`wy${s}`],c=t[`elbow${s}`];if(![r,a,o].every(Number.isFinite))continue;const l=this.buf[s];for(l.push({t:e,ext:r,x:a,y:o});l.length&&e-l[0].t>this.cfg.windowMs;)l.shift();if(e-this.last[s]<this.cfg.cooldownMs||l.length<4)continue;let h=l[0];for(const f of l)f.ext<h.ext&&(h=f);if(r>=this.cfg.extHi&&h.ext<=this.cfg.extLo&&e>h.t){const f=(r-h.ext)/((e-h.t)/1e3),p=s===this.cfg.lead?"jab":"cross";n.push(this._emit(e,s,p,f));continue}const d=l.find(f=>e-f.t<=220)??l[0],u=(e-d.t)/1e3;if(u>.08&&Number.isFinite(c)&&c>55&&c<145&&r>.4&&r<.88){const f=a-d.x,p=o-d.y,m=Math.hypot(f,p)/u;if(m>=this.cfg.hookSpeed){const _=Math.abs(f),g=-p,x=g>_*1.2&&g>.5?"uppercut":_>.5?"gancho":null;x&&n.push(this._emit(e,s,x,m))}}}return n}_emit(e,t,n,s){this.last[t]=e,this.count[n]=(this.count[n]??0)+1;const r=t==="L"?"izquierdo":"derecho";return{t:e,side:t,kind:n,speed:s,text:`${{jab:"jab",cross:"cruzado",gancho:"gancho",uppercut:"uppercut",directo:"directo"}[n]} ${r}`}}}function i_(i,e){const t=e[i.signal];if(t===void 0||typeof t=="number"&&Number.isNaN(t))return null;switch(i.op){case"gt":return t>i.value;case"lt":return t<i.value;case"absgt":return Math.abs(t)>i.value;case"abslt":return Math.abs(t)<i.value;case"truthy":return!!t;case"falsy":return!t;default:return null}}class s_{constructor(e=0,t=0){this.onMs=e,this.offMs=t,this.value=!1,this.since=null}reset(){this.value=!1,this.since=null}update(e,t){return t===null?null:t===this.value?(this.since=null,null):(this.since===null&&(this.since=e),e-this.since>=(t?this.onMs:this.offMs)?(this.value=t,this.since=null,t):null)}}class x1{constructor(e=[]){this.setRules(e)}setRules(e){this.rules=e,this.flags=e.map(t=>new s_(t.holdMs??350,300)),this.since=e.map(()=>null)}reset(){this.flags.forEach(e=>e.reset()),this.since=this.rules.map(()=>null)}update(e,t,n={}){const s=[],r=[];this.rules.forEach((o,c)=>{let l=i_(o,t);const h=n.p??0;o.when==="active"&&h<=.1&&(l=l===null?null:!1),o.when==="rest"&&h>.1&&(l=l===null?null:!1);const d=this.flags[c].update(e,l);d===!0&&(this.since[c]=e,s.push(o)),d===!1&&(this.since[c]=null,r.push(o))});const a=this.rules.filter((o,c)=>this.flags[c].value);return{started:s,ended:r,active:a}}}const Ws=i=>{const e=Math.max(0,i)/1e3,t=Math.floor(e/60);return`${String(t).padStart(2,"0")}:${(e-t*60).toFixed(1).padStart(4,"0")}`};class v1{constructor(e=700,t=300){this.windowMs=e,this.maxLines=t,this.lines=[]}reset(){this.lines=[]}push(e){const t=this.lines[this.lines.length-1];if(t&&e.t-t.tLast<=this.windowMs&&!t.parts.includes(e.text))return t.parts.push(e.text),t.tLast=e.t,t.kinds.add(e.kind),t.text=t.parts.join(" · "),t;const n={t:e.t,tLast:e.t,parts:[e.text],kinds:new Set([e.kind]),text:e.text};return this.lines.push(n),this.lines.length>this.maxLines&&this.lines.shift(),n}}const Cm=3e3,b1=250,r_={jump_rope:"Soga",boxing_shadow:"Sombra de boxeo",biceps_curl:"Bíceps",pushup:"Flexiones",pullup:"Dominadas / barra",crane_balance:"Equilibrio en un pie",idle:"Quieto",unknown:"Sin clasificar"},Lr=i=>{const e=i.filter(Number.isFinite);return e.length?Math.max(...e)-Math.min(...e):0},Il=i=>{const e=i.filter(Number.isFinite);return e.length?e.reduce((t,n)=>t+n,0)/e.length:NaN};class M1{constructor(){this.reset()}reset(){this.win=[],this.lastEval=-1e9,this.result={label:"unknown",confidence:0,scores:{}},this.punchTimes=[]}notePunch(e){this.punchTimes.push(e)}update(e,t,n={}){for(this.win.push({t:e,sig:t});this.win.length&&e-this.win[0].t>Cm;)this.win.shift();if(this.punchTimes=this.punchTimes.filter(g=>e-g<=Cm),e-this.lastEval<b1||this.win.length<20)return this.result;this.lastEval=e;const s=g=>this.win.map(x=>x.sig[g]),r=Math.max(Lr(s("elbowL")),Lr(s("elbowR"))),a=Il(s("torsoAngle")),o=Il(s("guardBoth"))||0,c=Il(s("aboveHeadBoth"))||0,l=Il(s("raisedLeg").map(g=>g?1:0))||0,h=Math.max(Lr(s("wxL")),Lr(s("wxR")),Lr(s("wyL")),Lr(s("wyR"))),d=Lr(s("bodyY")),u=n.jumpRate??0,f=this.punchTimes.length,p={jump_rope:u>=70?Math.min(1,.55+(u-70)/200):0,boxing_shadow:Math.min(1,o*.7+Math.min(f,4)*.15),pullup:c>.7&&r>45?.6+Math.min(.4,r/200):c>.85?.3:0,pushup:a>55&&r>35?.6+Math.min(.4,r/200):0,biceps_curl:a<25&&r>55&&c<.3&&o<.3&&f<2?.5+Math.min(.5,r/240):0,crane_balance:l>.6&&h<.8?.55+Math.min(.4,l-.6):0,idle:h<.12&&d<.02&&r<12?.5:0};let m="unknown",_=0;for(const[g,x]of Object.entries(p))x>_&&(m=g,_=x);return this.result=_>=.45?{label:m,confidence:_,scores:p}:{label:"unknown",confidence:_,scores:p},this.result}}const Bh={minCutoff:1.5,beta:20,dCutoff:1},y1=2e4,ul={id:"free",name:"Libre (auto-detectar)",family:"free",checks:[]},Lm={L:"izquierda",R:"derecha"};class df{constructor({exercise:e=ul,calib:t=null,lead:n="L"}={}){this.calib=t,this.lead=n,this.smoother=new xm(Bh),this.geo=new JM({calib:t}),this.form=new x1([]),this.punch=new _1({lead:n}),this.jumper=new m1,this.classifier=new M1,this.narrator=new v1,this.setExercise(e)}setCalib(e){this.calib=e,this.geo.setCalib(e)}setLead(e){this.lead=e,this.punch.configure({lead:e})}setSmoothing(e){this.smoother.configure(e)}setExercise(e){this.exercise=e,this.smoother.configure({...Bh,...e.smoothing??{}}),this.counter=e.counter?new o1(e.counter):null,this.hold=e.hold?new g1(e.hold.timer):null,this.jumper.configure(e.jump??{}),this.form.setRules(e.checks??[]),this.reset()}reset(){this.t0=null,this.events=[],this.narrator.reset(),this.counter?.reset(),this.hold?.reset(),this.jumper.reset(),this.punch.reset(),this.form.reset(),this.classifier.reset(),this.guardFlag=new s_(250,350),this.lastGuardT=null,this.leadState=null,this.leadCand=null,this.leadSince=null,this.weightState="C",this.weightCand=null,this.weightSince=null,this.holdWasActive=!1,this.trace=[],this.history={t:[],v:[]},this.smoother.reset(),this.geo.reset()}step(e){this.t0===null&&(this.t0=e.t);const t=e.t-this.t0,n=this.geo.step(this.smoother.smooth(e)),s=t1(n,this.calib),r=[],a=(u,f,p={},m=!0)=>{const _={t,type:u,text:f,data:p};return this.events.push(_),r.push(_),m&&this.narrator.push({t,text:f,kind:u}),_},o=this.exercise;if(this.counter){const u=o.counter.signal;this.history.t.push(t),this.history.v.push(s[u]);const f=this.counter.update(t,s[u]);f?.rep&&a("rep",`rep ${f.rep.n} · ${f.rep.tempo}`,f.rep),f?.partial&&a("partial","rango incompleto",{})}const c=this.jumper.update(t,s.feetY,s.leadDelta);if(c&&c.n%10===0&&o.family==="jumps"&&a("jump",`${c.n} saltos`,c),this.hold){const f=o.hold.conditions.map(m=>i_(m,s)).every(m=>m===!0),p=this.hold.update(t,f);this.hold.active&&!this.holdWasActive&&a("hold_start",o.hold.startText??"posición sostenida",{}),this.holdWasActive=this.hold.active,p&&a("hold",`sostuviste ${(p.ms/1e3).toFixed(1)} s`,p)}if(o.family==="boxing"||o.family==="free"){const u=this.guardFlag.update(t,s.guardBoth===1);u===!0&&a("guard","guardia arriba"),u===!1&&o.family==="boxing"&&a("guard","bajó la guardia"),this.guardFlag.value&&(this.lastGuardT=t);const f=o.family==="boxing"||t-(this.lastGuardT??-1e9)<1500;for(const p of this.punch.update(t,s))f&&(a("punch",p.text,p),this.classifier.notePunch(t));this._updateLead(t,s,a),this._updateWeight(t,s,a)}const l=this.form.update(t,s,{p:this.counter?.p??0});for(const u of l.started)a("form",`⚠ ${u.label}`,{id:u.id,severity:u.severity??"warn"});for(const u of l.ended)a("form_ok",`${u.label}: corregido`,{id:u.id},!1);const h=this.classifier.update(t,s,{jumpRate:this.jumper.rate(t,5)}),d=o.chart?.signals??(o.counter?[o.counter.signal]:[]);if(d.length)for(this.trace.push({t,v:d.map(u=>s[u])});this.trace.length&&t-this.trace[0].t>y1;)this.trace.shift();return{t,frame:n,sig:s,activity:h,newEvents:r,exercise:o,counter:this.counter&&{count:this.counter.count,p:this.counter.p,state:this.counter.state,reps:this.counter.reps,partials:this.counter.partials,last:this.counter.reps.at(-1)??null},jumps:{count:this.jumper.count,rate:this.jumper.rate(t),rate5:this.jumper.rate(t,5),cv:this.jumper.rhythmCv(),stance:this.jumper.stance},hold:this.hold&&{active:this.hold.active,currentMs:this.hold.currentMs,best:this.hold.best,holds:this.hold.holds},punches:{total:this.punch.total,count:this.punch.count},guard:this.guardFlag.value,leadFoot:this.leadState,weight:this.weightState,alerts:l.active,lines:this.narrator.lines,trace:this.trace}}_updateLead(e,t,n){const s=t.leadDelta,r=Number.isFinite(s)?s>.06?"L":s<-.06?"R":null:null;if(!r||r===this.leadState){this.leadCand=null;return}if(this.leadCand!==r){this.leadCand=r,this.leadSince=e;return}if(e-this.leadSince>=400){const a=this.leadState===null;this.leadState=r,this.leadCand=null,a||n("lead",`pierna ${Lm[r]} adelante`,{side:r})}}_updateWeight(e,t,n){const s=t.balance;if(!Number.isFinite(s))return;const r=s<-.55?"L":s>.55?"R":Math.abs(s)<.25?"C":this.weightState;if(r===this.weightState){this.weightCand=null;return}if(this.weightCand!==r){this.weightCand=r,this.weightSince=e;return}e-this.weightSince>=250&&(this.weightState=r,this.weightCand=null,r!=="C"&&n("weight",`peso a la ${Lm[r]}`,{side:r}))}finish(){const e=this.exercise,t={exercise:e.id,live:null,offline:null,jumps:null,hold:null,punches:null};if(this.counter){const n=this.counter.reps;t.live={count:n.length,...Rm(n),reps:n};const s=e.counter.restThr>e.counter.workThr,r=f1(this.history.t,this.history.v,{invert:s});t.offline={count:r.reps.length,...Rm(r.reps,"totalMs"),reps:r.reps}}return this.jumper.count&&(e.family==="jumps"||this.jumper.count>=5)&&(t.jumps={count:this.jumper.count,rate:this.jumper.rate(this.history.t.at(-1)??0,60),cv:this.jumper.rhythmCv(50),stance:this.jumper.stance}),this.hold&&(t.hold={best:this.hold.best,holds:this.hold.holds}),this.punch.total&&(t.punches={total:this.punch.total,...this.punch.count}),t.events=this.events.length,t}static smoothAll(e,t=Bh){const n=new xm(t);return e.map(s=>n.smooth(s))}}const Pm=180/Math.PI,zh=.35,S1=["torso","l_thigh","r_thigh","l_shin","r_shin","l_upper_arm","r_upper_arm","l_forearm","r_forearm","shoulders","neck","hips"],a_=S1.length,Dm=[2,2,2,1,1,1,1,1,1,1,2,2],w1=[6,8,8,10,10,14,14,18,18,8,10,8],E1=i=>(i=((i+180)%360+360)%360-180,i);function T1(i){const e=uf(i),t=new Float32Array(a_).fill(NaN),n=Yr(e.l_shoulder,e.r_shoulder),s=Yr(e.l_hip,e.r_hip);if(Math.min(e.l_shoulder.v,e.r_shoulder.v,e.l_hip.v,e.r_hip.v)<zh)return t;const r=n.x-s.x,a=n.y-s.y,o=Math.hypot(r,a)||1e-9,c=r/o,l=a/o,h=(d,u)=>{if(d.v<zh||u.v<zh)return NaN;const f=u.x-d.x,p=u.y-d.y;return Math.atan2(c*p-l*f,c*f+l*p)*Pm};return t[0]=Math.atan2(c,-l)*Pm,t[1]=h(e.l_hip,e.l_knee),t[2]=h(e.r_hip,e.r_knee),t[3]=h(e.l_knee,e.l_ankle),t[4]=h(e.r_knee,e.r_ankle),t[5]=h(e.l_shoulder,e.l_elbow),t[6]=h(e.r_shoulder,e.r_elbow),t[7]=h(e.l_elbow,e.l_wrist),t[8]=h(e.r_elbow,e.r_wrist),t[9]=h(e.r_shoulder,e.l_shoulder),t[10]=h({...n,v:1},e.nose),t[11]=h(e.r_hip,e.l_hip),t}function o_(i,e,t=1){let n=0,s=0;for(let r=0;r<a_;r++){if(Number.isNaN(i[r])||Number.isNaN(e[r]))continue;const a=Math.max(0,Math.abs(E1(i[r]-e[r]))-w1[r]*t);n+=a*Dm[r],s+=Dm[r]}return s?n/s:NaN}function io(i,e=15){if(i.length<2)return{hz:e,n:0,angles:[],t0:0,durationMs:0};const t=1e3/e,n=i[0].t,s=i[i.length-1].t,r=[];let a=0;for(let o=n;o<=s;o+=t){for(;a<i.length-1&&Math.abs(i[a+1].t-o)<=Math.abs(i[a].t-o);)a++;r.push(T1(i[a]))}return{hz:e,n:r.length,angles:r,t0:n,durationMs:s-n}}const A1=30;function R1(i,e,{band:t=.4,forgiveScale:n=1}={}){const s=i.length,r=e.length;if(!s||!r)return{meanDeg:NaN,path:[]};const a=Math.max(Math.abs(s-r),Math.ceil(t*Math.max(s,r))),o=new Float64Array((s+1)*(r+1)).fill(1/0),c=(p,m)=>p*(r+1)+m;o[c(0,0)]=0;const l=(p,m)=>{const _=o_(i[p],e[m],n);return Number.isNaN(_)?A1:_};for(let p=1;p<=s;p++){const m=Math.max(1,Math.round(p*r/s)-a),_=Math.min(r,Math.round(p*r/s)+a);for(let g=m;g<=_;g++)o[c(p,g)]=l(p-1,g-1)+Math.min(o[c(p-1,g)],o[c(p,g-1)],o[c(p-1,g-1)])}if(!Number.isFinite(o[c(s,r)]))return{meanDeg:NaN,path:[]};const h=[];let d=s,u=r;for(;d>0&&u>0;){h.push([d-1,u-1]);const p=[o[c(d-1,u-1)],o[c(d-1,u)],o[c(d,u-1)]],m=p.indexOf(Math.min(...p));m===0?(d--,u--):m===1?d--:u--}return h.reverse(),{meanDeg:h.reduce((p,[m,_])=>p+l(m,_),0)/h.length,path:h}}const Hh=(i,e,t)=>Math.min(t,Math.max(e,i));function Oc(i,e,{zeroDeg:t=28,band:n=.4}={}){if(!i.n||!e.n)return null;const{meanDeg:s,path:r}=R1(e.angles,i.angles,{band:n});if(!Number.isFinite(s))return null;const a=100*Hh(1-s/t,0,1),o=i.durationMs/Math.max(1,e.durationMs),c=100*Hh(1-Math.abs(Math.log(o))/Math.log(2),0,1),l=new Map;for(const[d,u]of r){const f=o_(e.angles[d],i.angles[u]);if(Number.isNaN(f))continue;const p=l.get(u)??[];p.push(f),l.set(u,p)}const h=[...l.entries()].sort((d,u)=>d[0]-u[0]).map(([d,u])=>({tMs:d*1e3/i.hz,score:100*Hh(1-u.reduce((f,p)=>f+p,0)/u.length/t,0,1)}));return{shape:a,timing:c,total:.75*a+.25*c,meanDeg:s,curve:h,ratio:o}}function po(i){return new Promise((e,t)=>{i.oncomplete=i.onsuccess=()=>e(i.result),i.onabort=i.onerror=()=>t(i.error)})}function oh(i,e){let t;const n=()=>{if(t)return t;const s=indexedDB.open(i);return s.onupgradeneeded=()=>s.result.createObjectStore(e),t=po(s),t.then(r=>{r.onclose=()=>t=void 0},()=>{t=void 0}),t};return(s,r)=>n().then(a=>r(a.transaction(e,s).objectStore(e)))}let Vh;function lh(){return Vh||(Vh=oh("keyval-store","keyval")),Vh}function Bc(i,e=lh()){return e("readonly",t=>po(t.get(i)))}function Qo(i,e,t=lh()){return t("readwrite",n=>(n.put(e,i),po(n.transaction)))}function Gh(i,e=lh()){return e("readwrite",t=>(t.delete(i),po(t.transaction)))}function C1(i,e){return i.openCursor().onsuccess=function(){this.result&&(e(this.result),this.result.continue())},po(i.transaction)}function L1(i=lh()){return i("readonly",e=>{if(e.getAll)return po(e.getAll());const t=[];return C1(e,n=>t.push(n.value)).then(()=>t)})}const nl=oh("motion-lab-meta","meta"),il=oh("motion-lab-data","data"),ff=oh("motion-lab-video","video");let Do=null;async function pf(){if(Do!==null)return Do;try{const i=await fetch("/api/health",{cache:"no-store"});Do=i.ok&&(await i.json()).ok===!0}catch{Do=!1}return Do}const l_=()=>{const i=new Date,e=t=>String(t).padStart(2,"0");return`${i.getFullYear()}${e(i.getMonth()+1)}${e(i.getDate())}-${e(i.getHours())}${e(i.getMinutes())}${e(i.getSeconds())}-${Math.random().toString(36).slice(2,6)}`};async function c_(i,{video:e=null,files:t={}}={}){i.meta.hasVideo=!!e,await Qo(i.id,i.meta,nl),await Qo(i.id,i,il),e&&await Qo(i.id,e,ff);let n=null;if(await pf())try{const s=await fetch(`/api/sessions/${i.id}`,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({session:i,files:t})});s.ok&&(n=(await s.json()).path),e&&s.ok&&await fetch(`/api/sessions/${i.id}/video`,{method:"PUT",body:e,headers:{"content-type":e.type||"video/webm"}})}catch(s){console.warn("no se pudo espejar en disco",s)}return{disk:n}}async function Zr(){return(await L1(nl)).sort((e,t)=>(t.createdAt??"").localeCompare(e.createdAt??""))}const sl=i=>Bc(i,il),mf=i=>Bc(i,ff);async function km(i,e){const t=await Bc(i,nl),n=await Bc(i,il);return t?(Object.assign(t,e),n&&(n.meta=t,await Qo(i,n,il)),await Qo(i,t,nl),t):null}async function P1(i){await Gh(i,nl),await Gh(i,il),await Gh(i,ff),await pf()&&fetch(`/api/sessions/${i}`,{method:"DELETE"}).catch(()=>{})}const Wh=["elbowL","elbowR","kneeL","kneeR","hipL","hipR","shoulderTilt","yawSigned","torsoAngle","extL","extR","elbowGapMax"];function gf(i){return i.frames.map(e=>ug(e,i.aspect))}function so(i,e=ul,{keepStates:t=!0}={}){const n=new df({exercise:e,calib:i.calib??null,lead:i.profile?.lead??"L"}),s=gf(i),r=[],a=Object.fromEntries(Wh.map(x=>[x,[]]));let o=0,c=0,l=null,h=null,d=0,u=0,f=0;const p=[];for(const x of s){const T=n.step(x),b=T.sig;for(const S of Wh)Number.isFinite(b[S])&&a[S].push(b[S]);if(Number.isFinite(b.comX)){f++;const S=[b.comX*x.aspect,b.comY];l&&(o+=Math.hypot(S[0]-l[0],S[1]-l[1])/(b.sw||1)),l=S,p.push([b.comX,b.comY,"com"])}b.com3&&(h&&(c+=Math.hypot(...b.com3.map((S,M)=>S-h[M]))),h=b.com3);for(const S of[9,10,15,16]){const M=T.frame.pts[S];M[3]>=.35&&p.push([M[0],M[1],S])}b.guardBoth&&d++,b.aboveHeadBoth&&u++,t&&r.push({t:T.t,tRaw:x.t,frame:T.frame,sig:b,activity:T.activity.label,count:T.counter?.count??null,jumps:T.jumps.count,holdMs:T.hold?.currentMs??null,punches:T.punches.total,alerts:T.alerts.map(S=>S.id)})}const m=x=>x.length?{min:Math.min(...x),max:Math.max(...x),mean:x.reduce((T,b)=>T+b,0)/x.length}:null,_=Object.fromEntries(Wh.map(x=>[x,m(a[x])])),g=s.length||1;return{summary:n.finish(),events:n.events,lines:n.narrator.lines,states:r,stats:_,heat:p,motion:{comPathShoulderWidths:o,comPathMeters:c||null,guardPct:d/g*100,handsOverHeadPct:u/g*100,trackedPct:f/g*100}}}function $u(i,e=15){const t=i.states.map(r=>r.frame),n=i.summary.live?.reps??[];if(n.length){const r=n.slice().sort((c,l)=>c.totalMs-l.totalMs),a=r[Math.floor(r.length/2)],o=i.states.filter(c=>c.t>=a.tStart&&c.t<=a.tEnd).map(c=>c.frame);return{kind:"rep",rep:a.n,seq:io(o,e)}}const s=t.slice(0,Math.min(t.length,360));return{kind:"full",seq:io(s,e)}}function h_(i,e){return(i.summary.live?.reps??[]).map(n=>{const s=i.states.filter(a=>a.t>=n.tStart&&a.t<=n.tEnd).map(a=>a.frame),r=Oc(io(s,e.seq.hz),e.seq);return{n:n.n,total:r?.total??NaN,shape:r?.shape??NaN,timing:r?.timing??NaN}})}function D1(i,e){const t=$u(i),n=$u(e);let s;if(t.kind==="rep"&&n.kind==="rep")s=Oc(n.seq,t.seq);else{const a=io(i.states.map(c=>c.frame).slice(0,900),15),o=io(e.states.map(c=>c.frame).slice(0,900),15);s=Oc(o,a)}const r=t.kind==="rep"?h_(e,t):[];return{overall:s,perRep:r}}const qi=i=>Number.isFinite(i)?`${(i/1e3).toFixed(2)} s`:"—",Ul=(i,e="")=>Number.isFinite(i)?`${i.toFixed(1)}${e}`:"—",jn=(i,e="")=>Number.isFinite(i)?`${Math.round(i)}${e}`:"—",k1={camera:"cámara en vivo",video:"video subido",sim:"simulador"};function _f(i,e,{precision:t=null,compare:n=null}={}){const s={...i.meta,source:k1[i.meta.source]??i.meta.source},r=e.summary,a=[];if(a.push(`# ${s.exerciseName} — ${new Date(s.createdAt).toLocaleString("es-AR")}`),a.push(""),a.push(`| | |
|---|---|
| Duración | ${qi(s.durationMs)} |
| Frames | ${i.frames.length} (${Ul(i.frames.length/Math.max(1,s.durationMs/1e3))} fps) |
| Motor | ${s.engine} |
| Fuente | ${s.source} |
| Cuerpo detectado | ${jn(e.motion.trackedPct,"%")} del tiempo |`),i.profile){const h=i.profile;a.push(""),a.push(`**Perfil:** ${h.name||"—"} · ${h.heightCm?`${h.heightCm} cm`:"altura —"} · ${h.weightKg?`${h.weightKg} kg`:"peso —"} · guardia ${h.lead==="R"?"zurda (derecha adelante)":"ortodoxa (izquierda adelante)"}${s.loadKg?` · carga ${s.loadKg} kg`:""}`)}if(r.live){const h=r.live;if(a.push("","## Repeticiones",""),a.push(`- **Total: ${h.count}**${h.count?` · media ${qi(h.meanMs)} por rep`:""}${r.offline?` · recuento offline: ${r.offline.count}${r.offline.count!==h.count?" ⚠ difiere del conteo en vivo, revisar el gráfico":" ✓ coincide"}`:""}`),h.count){a.push(`- Más rápida: rep ${h.fastRep} (${qi(h.fastMs)}) · más lenta: rep ${h.slowRep} (${qi(h.slowMs)})`),h.slowRep>h.fastRep&&a.push(`- **${jn(h.slowdownPct,"%")} más lenta** de la rep ${h.fastRep} a la rep ${h.slowRep}${h.fatigued?" → señal de fatiga":""}`),a.push(`- Regularidad del ritmo (CV): ${jn(h.rhythmCv*100,"%")} (más bajo = más parejo)`);const d=h.reps.reduce((u,f)=>u+f.totalMs,0);a.push(`- Tiempo bajo tensión: ${qi(d)} de ${qi(s.durationMs)} (${jn(d/Math.max(1,s.durationMs)*100,"%")})`),a.push("","| rep | concéntrica | excéntrica | total | rango (°) |"+(t?" precisión |":""),"|---|---|---|---|---|"+(t?"---|":"")),h.reps.forEach((u,f)=>{const p=t?.[f];a.push(`| ${u.n} | ${qi(u.concentricMs)} | ${qi(u.eccentricMs)} | ${qi(u.totalMs)} | ${jn(u.rom)} |${p?` ${jn(p.total,"%")} |`:""}`)}),h.partials&&a.push("",`- Intentos con rango incompleto: ${h.partials}`)}}if(r.jumps&&(a.push("","## Saltos",""),a.push(`- **${r.jumps.count} saltos** · ritmo ${jn(r.jumps.rate)} por minuto · regularidad (CV) ${jn(r.jumps.cv*100,"%")} · apoyo: ${r.jumps.stance??"—"}`)),r.hold&&(a.push("","## Tiempo sostenido",""),a.push(`- Mejor: **${qi(r.hold.best)}** · series: ${r.hold.holds.map(qi).join(", ")||"—"}`)),r.punches){const h=r.punches;a.push("","## Boxeo",""),a.push(`- **${h.total} golpes**: jab ${h.jab??0} · cruzado ${h.cross??0} · gancho ${h.gancho??0} · uppercut ${h.uppercut??0}`),a.push(`- Guardia arriba ${jn(e.motion.guardPct,"%")} del tiempo`)}const o=e.events.filter(h=>h.type==="form");if(a.push("","## Forma",""),!o.length)a.push("- Sin alertas de forma.");else{const h={};for(const d of o)h[d.text]=(h[d.text]??0)+1;for(const[d,u]of Object.entries(h))a.push(`- ${d} × ${u}`)}const c=e.stats;a.push("","## Biomecánica",""),a.push("| señal | mín | máx | media |","|---|---|---|---|");const l=(h,d,u="°")=>c[d]&&a.push(`| ${h} | ${jn(c[d].min,u)} | ${jn(c[d].max,u)} | ${jn(c[d].mean,u)} |`);if(l("codo izquierdo","elbowL"),l("codo derecho","elbowR"),l("rodilla izquierda","kneeL"),l("rodilla derecha","kneeR"),l("inclinación de hombros","shoulderTilt"),l("rotación de torso (+ = hombro izq. adelante)","yawSigned"),l("inclinación del tronco","torsoAngle"),a.push("",`- Recorrido del centro de masa: ${Ul(e.motion.comPathShoulderWidths)} anchos de hombro${e.motion.comPathMeters?` (~${Ul(e.motion.comPathMeters)} m en 3D)`:""}`),a.push(`- Manos por encima de la cabeza: ${jn(e.motion.handsOverHeadPct,"%")} del tiempo`),n?.overall&&(a.push("","## Comparación con referencia",""),a.push(`- Similitud total **${jn(n.overall.total,"%")}** (forma ${jn(n.overall.shape,"%")}, tempo ${jn(n.overall.timing,"%")}, error medio ${Ul(n.overall.meanDeg,"°")})`)),e.lines.length){a.push("","## Bitácora","");for(const h of e.lines.slice(0,200))a.push(`- \`${Ws(h.t)}\` ${h.text}`)}return a.push("","---","*Cámara única de frente: la profundidad es estimada; los golpes hacia la cámara y la pierna adelantada son lecturas aproximadas. Generado por Motion Lab.*"),a.join(`
`)+`
`}const N1=i=>JSON.stringify(i);function u_(i){const{frames:e,...t}=i;return[JSON.stringify({type:"meta",...t}),...e.map(n=>JSON.stringify({type:"frame",...n}))].join(`
`)+`
`}function d_(i){const e=i.frames.some(s=>s.w),t=["t_ms"];for(const s of zi)t.push(`${s}_x`,`${s}_y`,`${s}_z`,`${s}_vis`);if(e)for(const s of zi)t.push(`${s}_wx_m`,`${s}_wy_m`,`${s}_wz_m`);const n=[t.join(",")];for(const s of i.frames){const r=[s.t,...s.k];e&&r.push(...s.w??new Array(zi.length*3).fill("")),n.push(r.join(","))}return n.join(`
`)+`
`}const $h=(i,e)=>String(i).padStart(e);function f_(i){const e=i.meta,t=[`MOTION LAB · puntos de la sesión ${e.id}`,`ejercicio: ${e.exerciseName} · motor: ${e.engine} · fuente: ${e.source} · ${i.frames.length} frames · ${(e.durationMs/1e3).toFixed(1)} s`,"coordenadas: x,y normalizadas 0..1 sobre la imagen sin espejar (y crece hacia abajo); v = visibilidad 0..1","l_ / r_ = lado izquierdo / derecho de la persona",""];for(const n of i.frames){const s=ug(n,i.aspect);t.push(`t = ${(s.t/1e3).toFixed(3)} s`),s.pts.forEach((r,a)=>{t.push(`  ${zi[a].padEnd(11)} x=${r[0].toFixed(4)} y=${r[1].toFixed(4)} v=${r[3].toFixed(2)}${s.world?`   3D(m) ${$h(s.world[a][0].toFixed(3),7)} ${$h(s.world[a][1].toFixed(3),7)} ${$h(s.world[a][2].toFixed(3),7)}`:""}`)})}return t.join(`
`)+`
`}function va(i,e,t="text/plain"){const n=e instanceof Blob?e:new Blob([e],{type:t}),s=document.createElement("a");s.href=URL.createObjectURL(n),s.download=i,document.body.appendChild(s),s.click(),setTimeout(()=>{URL.revokeObjectURL(s.href),s.remove()},1e3)}function xf(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var aa=xf();function p_(i){aa=i}var Vr={exec:()=>null};function ba(i){let e=[];return t=>{let n=Math.max(0,Math.min(3,t-1)),s=e[n];return s||(s=i(n),e[n]=s),s}}function mt(i,e=""){let t=typeof i=="string"?i:i.source,n={replace:(s,r)=>{let a=typeof r=="string"?r:r.source;return a=a.replace(Wn.caret,"$1"),t=t.replace(s,a),n},getRegex:()=>new RegExp(t,e)};return n}var I1=((i="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+i)}catch{return!1}})(),Wn={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:i=>new RegExp(`^( {0,3}${i})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:ba(i=>new RegExp(`^ {0,${i}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:ba(i=>new RegExp(`^ {0,${i}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:ba(i=>new RegExp(`^ {0,${i}}(?:\`\`\`|~~~)`)),headingBeginRegex:ba(i=>new RegExp(`^ {0,${i}}#`)),htmlBeginRegex:ba(i=>new RegExp(`^ {0,${i}}(?:</?(?:${fl})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,"i")),blockquoteBeginRegex:ba(i=>new RegExp(`^ {0,${i}}>`))},U1=/^(?:[ \t]*(?:\n|$))+/,F1=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,O1=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,dl=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,B1=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,vf=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,m_=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,g_=mt(m_).replace(/bull/g,vf).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),z1=mt(m_).replace(/bull/g,vf).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),bf=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,H1=/^[^\n]+/,Mf=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,V1=mt(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Mf).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),G1=mt(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,vf).getRegex(),fl="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",yf=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,W1=mt("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",yf).replace("tag",fl).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),__=i=>mt(bf).replace("hr",dl).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",i).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",fl).getRegex(),$1=__(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),X1=__(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),q1=mt(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",X1).getRegex(),Sf={blockquote:q1,code:F1,def:V1,fences:O1,heading:B1,hr:dl,html:W1,lheading:g_,list:G1,newline:U1,paragraph:$1,table:Vr,text:H1},Nm=mt("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",dl).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",fl).getRegex(),Y1={...Sf,lheading:z1,table:Nm,paragraph:mt(bf).replace("hr",dl).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Nm).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",fl).getRegex()},j1={...Sf,html:mt(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",yf).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Vr,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:mt(bf).replace("hr",dl).replace("heading",` *#{1,6} *[^
]`).replace("lheading",g_).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},K1=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Z1=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,x_=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,J1=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Xs=/[\p{P}\p{S}]/u,mo=/[\s\p{P}\p{S}]/u,pl=/[^\s\p{P}\p{S}]/u,Q1=mt(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,mo).getRegex(),ey=/[\p{Pi}\p{Ps}"']/u,v_=/(?!~)[\p{P}\p{S}]/u,ty=/(?!~)[\s\p{P}\p{S}]/u,ny=/(?:[^\s\p{P}\p{S}]|~)/u,iy=mt(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",I1?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),b_=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,sy=mt(b_,"u").replace(/punct/g,Xs).getRegex(),ry=mt(b_,"u").replace(/punct/g,v_).getRegex(),ay=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,oy=mt(ay,"u").replace(/openQuote/g,ey).replace(/punct/g,Xs).getRegex(),M_="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ly=mt(M_,"gu").replace(/notPunctSpace/g,pl).replace(/punctSpace/g,mo).replace(/punct/g,Xs).getRegex(),cy=mt(M_,"gu").replace(/notPunctSpace/g,ny).replace(/punctSpace/g,ty).replace(/punct/g,v_).getRegex(),hy="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",uy=mt(hy,"gu").replace(/notPunctSpace/g,pl).replace(/punctSpace/g,mo).replace(/punct/g,Xs).getRegex(),dy=mt("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,pl).replace(/punctSpace/g,mo).replace(/punct/g,Xs).getRegex(),fy="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",py=mt(fy,"gu").replace(/notPunctSpace/g,pl).replace(/punctSpace/g,mo).replace(/punct/g,Xs).getRegex(),my=mt(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Xs).getRegex(),gy="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",_y=mt(gy,"gu").replace(/notPunctSpace/g,pl).replace(/punctSpace/g,mo).replace(/punct/g,Xs).getRegex(),xy=mt(/\\(punct)/,"gu").replace(/punct/g,Xs).getRegex(),vy=mt(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),by=mt(yf).replace("(?:-->|$)","-->").getRegex(),My=mt("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",by).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),y_=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,zc=mt(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",y_).getRegex(),yy=mt(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",zc).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Sy=mt(/^!?\[(label)\]\[(ref)\]/).replace("label",zc).replace("ref",Mf).getRegex(),wy=mt(/^!?\[(ref)\](?:\[\])?/).replace("ref",Mf).getRegex(),Im=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,Ey=mt(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",y_).getRegex(),Ty=mt("reflink|nolink(?!\\()","g").replace("reflink",mt(/^!?\[(label)\]\[(ref)\]/).replace("label",Ey).replace("ref",Im).getRegex()).replace("nolink",mt(/^!?\[(ref)\](?:\[\])?/).replace("ref",Im).getRegex()).getRegex(),Um=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ay=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,Ry=mt(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,Ay).getRegex(),wf={_backpedal:Vr,anyPunctuation:xy,autolink:vy,blockSkip:iy,br:x_,code:Z1,del:Vr,delLDelim:Vr,delRDelim:Vr,emStrongLDelim:sy,emStrongRDelimAst:ly,emStrongRDelimUnd:dy,escape:K1,link:yy,nolink:wy,punctuation:Q1,reflink:Sy,reflinkSearch:Ty,tag:My,text:J1,url:Vr},Cy={...wf,emStrongLDelim:oy,emStrongRDelimAst:uy,emStrongRDelimUnd:py,link:mt(/^!?\[(label)\]\((.*?)\)/).replace("label",zc).getRegex(),reflink:mt(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",zc).getRegex()},Xu={...wf,emStrongRDelimAst:cy,emStrongLDelim:ry,delLDelim:my,delRDelim:_y,url:mt(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",Ry).replace("protocol",Um).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:mt(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",Um).replace(/emailProtocol/g,/(?:mailto|xmpp):/).getRegex()},Ly={...Xu,br:mt(x_).replace("{2,}","*").getRegex(),text:mt(Xu.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Fl={normal:Sf,gfm:Y1,pedantic:j1},ko={normal:wf,gfm:Xu,breaks:Ly,pedantic:Cy},Py={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Fm=i=>Py[i];function wi(i,e){if(e){if(Wn.escapeTest.test(i))return i.replace(Wn.escapeReplace,Fm)}else if(Wn.escapeTestNoEncode.test(i))return i.replace(Wn.escapeReplaceNoEncode,Fm);return i}function Dy(i){return i.replace(Wn.numericCharacterReference,(e,t,n)=>{let s=t===void 0?Number.parseInt(n,16):Number.parseInt(t,10);return s===0||s>1114111||s>=55296&&s<=57343?"�":String.fromCodePoint(s)})}function Om(i){try{i=encodeURI(i).replace(Wn.percentDecode,"%")}catch{return null}return i}function Bm(i,e){let t=i.replace(Wn.findPipe,(r,a,o)=>{let c=!1,l=a;for(;--l>=0&&o[l]==="\\";)c=!c;return c?"|":" |"}),n=t.split(Wn.splitPipe),s=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;s<n.length;s++)n[s]=n[s].trim().replace(Wn.slashPipe,"|");return n}function tr(i,e,t){let n=i.length;if(n===0)return"";let s=0;for(;s<n&&i.charAt(n-s-1)===e;)s++;return i.slice(0,n-s)}function zm(i){let e=i.split(`
`),t=e.length-1;for(;t>=0&&Wn.blankLine.test(e[t]);)t--;return e.length-t<=2?i:e.slice(0,t+1).join(`
`)}function Hc(i){return i.trim().toLowerCase().toUpperCase().toLowerCase()}function ky(i,e){if(i.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<i.length;n++)if(i[n]==="\\")n++;else if(i[n]===e[0])t++;else if(i[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function Hm(i,e=0){let t=e,n="";for(let s of i)if(s==="	"){let r=4-t%4;n+=" ".repeat(r),t+=r}else n+=s,t++;return n}function Vm(i,e,t,n,s){let r=e.href,a=e.title||null,o=i[1].replace(s.other.outputLinkReplace,"$1"),c=i[0].charAt(0)==="!";n.state.inLink=!0;let l=n.state.linkEmitted,h=n.state.inRawBlock;n.state.linkEmitted=!1;let d=n.inlineTokens(o),u=n.state.linkEmitted;if(n.state.linkEmitted=l,n.state.inLink=!1,!c){if(u){n.state.inRawBlock=h;return}n.state.linkEmitted=!0}return{type:c?"image":"link",raw:t,href:r,title:a,text:o,tokens:d}}function Ny(i,e,t){let n=i.match(t.other.indentCodeCompensation);if(n===null)return e;let s=n[1];return e.split(`
`).map(r=>{let a=r.match(t.other.beginningSpace);if(a===null)return r;let[o]=a;return r.slice(Math.min(o.length,s.length))}).join(`
`)}function Gm(i,e,t,n){if(!e.includes("<"))return!1;for(let s=0;s<e.length;s++){if(e[s]==="\\"){s++;continue}if(e[s]==="`"){let o=n.inline.code.exec(e.slice(s));if(o){s+=o[0].length-1;continue}}if(e[s]!=="<")continue;let r=i.slice(t+s),a=n.inline.tag.exec(r)||n.inline.autolink.exec(r);if(a){if(a[0].length>e.length-s)return!0;s+=a[0].length-1}}return!1}var Vc=class{options;rules;lexer;constructor(e){this.options=e||aa}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=this.options.pedantic?t[0]:zm(t[0]),s=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:s}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Ny(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=tr(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(n=s.trim())}return{type:"heading",raw:tr(t[0],`
`),depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:tr(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=tr(t[0],`
`).split(`
`),s="",r="",a=[];for(;n.length>0;){let o=!1,c=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))c.push(n[l]),o=!0;else if(!o)c.push(n[l]);else break;n=n.slice(l);let h=c.join(`
`),d=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${h}`:h,r=r?`${r}
${d}`:d;let u=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,a,!0),this.lexer.state.top=u,n.length===0)break;let f=a.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let p=f,m=n.join(`
`),_=p.raw+`
`+m.replace(this.rules.other.blockquoteSetextReplace2,""),g=this.blockquote(_);a[a.length-1]=g;let x=_.substring(g.raw.length).replace(/^\n/,""),T=x?x.split(`
`).length:0,b=T?n.slice(0,-T):n;b.length>0&&(s=`${s}
${b.join(`
`)}`),r=r.substring(0,r.length-p.text.length)+g.text;break}else if(f?.type==="list"){let p=f,m=p.raw+`
`+n.join(`
`),_=this.list(m);a[a.length-1]=_,s=s.substring(0,s.length-f.raw.length)+_.raw,r=r.substring(0,r.length-p.raw.length)+_.raw,n=m.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let l=!1,h="",d="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;h=t[0],e=e.substring(h.length);let u=t[2].split(`
`,1)[0],f=t[1].length,p=this.options.pedantic?Hm(u,f):u.replace(this.rules.other.leadingSpaceTab,x=>Hm(x,f)),m=e.split(`
`,1)[0],_=!p.trim(),g=0;if(this.options.pedantic?(g=2,d=p.trimStart()):_?g=f+1:(g=p.search(this.rules.other.nonSpaceChar),g=g>4?1:g,d=p.slice(g),g+=f),_&&this.rules.other.blankLine.test(m)&&(h+=m+`
`,e=e.substring(m.length+1),l=!0),!l){let x=this.rules.other.nextBulletRegex(g),T=this.rules.other.hrRegex(g),b=this.rules.other.fencesBeginRegex(g),S=this.rules.other.headingBeginRegex(g),M=this.rules.other.htmlBeginRegex(g),A=this.rules.other.blockquoteBeginRegex(g);for(;e;){let v=e.split(`
`,1)[0],E;if(m=v,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),E=m):E=m.replace(this.rules.other.leadingSpaceTab,P=>P.replace(this.rules.other.tabCharGlobal,"    ")),b.test(m)||S.test(m)||M.test(m)||A.test(m)||x.test(m)||T.test(m))break;if(E.search(this.rules.other.nonSpaceChar)>=g||!m.trim())d+=`
`+E.slice(g);else{if(_||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(p)||S.test(p)||T.test(p))break;d+=`
`+m}_=!m.trim(),h+=v+`
`,e=e.substring(v.length+1),p=E.slice(g)}}r.loose||(o?r.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(o=!0)),r.items.push({type:"list_item",raw:h,task:!!this.options.gfm&&this.rules.other.listIsTask.test(d),loose:!1,text:d,tokens:[]}),r.raw+=h}let c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items)if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),!r.loose){let h=l.tokens.filter(u=>u.type==="space"),d=h.length>0&&h.some(u=>this.rules.other.anyLine.test(u.raw));r.loose=d}for(let l of r.items){let h=l.tokens[0];if(l.task&&(h?.type==="text"||h?.type==="paragraph")){l.text=l.text.replace(this.rules.other.listReplaceTask,""),h.raw=h.raw.replace(this.rules.other.listReplaceTask,""),h.text=h.text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}let d=this.rules.other.listTaskCheckbox.exec(l.raw);if(d){let u={type:"checkbox",raw:d[0]+" ",checked:d[0]!=="[ ]"};l.checked=u.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=u.raw+l.tokens[0].raw,l.tokens[0].text=u.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(u)):l.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):l.tokens.unshift(u)}}else l.task&&(l.task=!1)}if(r.loose)for(let l of r.items){l.loose=!0;for(let h of l.tokens)h.type==="text"&&(h.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t){let n=zm(t[0]);return{type:"html",block:!0,raw:n,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:n}}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=Hc(t[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:tr(t[0],`
`),href:s,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Bm(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:tr(t[0],`
`),header:[],align:[],rows:[]};if(n.length===s.length){for(let o of s)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(let o of r)a.rows.push(Bm(o,a.header.length).map((c,l)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:a.align[l]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return{type:"heading",raw:tr(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Gm(e,t[1],n,this.rules))return;let s=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(s)){if(!this.rules.other.endAngleBracket.test(s))return;let o=tr(s.slice(0,-1),"\\");if((s.length-o.length)%2===0)return}else{let o=ky(t[2],"()");if(o===-2)return;if(o>-1){let c=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,c).trim(),t[3]=""}}let r=t[2],a="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(r);o&&(r=o[1],a=o[3])}else a=t[3]?t[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(s)?r=r.slice(1):r=r.slice(1,-1)),Vm(t,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Gm(e,n[1],s,this.rules))return;let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),a=t[Hc(r)];if(!a){let o=n[0].charAt(0);return{type:"text",raw:o,text:o}}return Vm(n,a,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||!s[1]&&!s[2]&&!s[3]&&!s[4]||s[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[3])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,a,o,c=r,l=0,h=s[0][0],d=n===h,u=h==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+r);(s=u.exec(t))!==null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(o=[...a].length,s[3]||s[4]){c+=o;continue}else if(s[5]||s[6]){if(r%3&&!((r+o)%3)){l+=o;continue}if(d)break}if(c-=o,c>0)continue;o=Math.min(o,o+c+l);let f=[...s[0]][0].length,p=e.slice(0,r+s.index+f+o);if(Math.min(r,o)%2){let _=p.slice(1,-1);return{type:"em",raw:p,text:_,tokens:this.lexer.inlineTokens(_)}}let m=p.slice(2,-2);return{type:"strong",raw:p,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,a,o,c=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(s=l.exec(t))!==null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a||(o=[...a].length,o!==r))continue;if(s[3]||s[4]){c+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c);let h=[...s[0]][0].length,d=e.slice(0,r+s.index+h+o),u=d.slice(r,-r);return{type:"del",raw:d,text:u,tokens:this.lexer.inlineTokens(u)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:n?t[0]:Dy(t[0]),escaped:n}}}},ns=class qu{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||aa,this.options.tokenizer=this.options.tokenizer||new Vc,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,top:!0};let t={other:Wn,block:Fl.normal,inline:ko.normal};this.options.pedantic?(t.block=Fl.pedantic,t.inline=ko.pedantic):this.options.gfm&&(t.block=Fl.gfm,this.options.breaks?t.inline=ko.breaks:t.inline=ko.gfm),this.tokenizer.rules=t}static get rules(){return{block:Fl,inline:ko}}static lex(e,t){return new qu(t).lex(e)}static lexInline(e,t){return new qu(t).inlineTokens(e)}lex(e){e=e.replace(Wn.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(Wn.tabCharGlobal,"    ").replace(Wn.spaceLine,""));let s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let r;if(this.options.extensions?.block?.some(o=>(r=o.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let o=t.at(-1);r.raw.length===1&&o!==void 0?o.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let a=e;if(this.options.extensions?.startBlock){let o=1/0,c=e.slice(1),l;this.options.extensions.startBlock.forEach(h=>{l=h.call({lexer:this},c),typeof l=="number"&&l>=0&&(o=Math.min(o,l))}),o<1/0&&o>=0&&(a=e.substring(0,o+1))}if(this.state.top&&(r=this.tokenizer.paragraph(a))){let o=t.at(-1);n&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r),n=a.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}linkInText(e){if(!e.includes("["))return!1;let t=this.tokenizer.rules.inline.link;for(let n of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(t.test(n[0])&&e.charAt(n.index-1)!=="!")return!0;for(let n of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let s=n[0],r=s.lastIndexOf("[");if(!(s.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,Hc(s.slice(r+1,-1))))&&!(r>1&&this.linkInText(s.slice(1,r-1))))return!0}return!1}inlineTokens(e,t=[]){this.tokenizer.lexer=this;let n=e;if(this.tokens.links&&e.includes("[")){let o=this.tokenizer.rules.inline.reflinkSearch,c=l=>{let h=l.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,Hc(l.slice(h+1,-1))))return l;if(h>1&&l.charAt(0)!=="!"){let d=l.slice(1,h-1);if(this.linkInText(d))return"["+d.replace(o,c)+"]["+"a".repeat(l.length-h-2)+"]"}return"["+"a".repeat(l.length-2)+"]"};n=n.replace(o,c)}n=n.replace(this.tokenizer.rules.inline.anyPunctuation,o=>"+".repeat(o.length)),n=n.replace(this.tokenizer.rules.inline.blockSkip,(o,c,l)=>{let h=l?l.length:0;return o.slice(0,h)+"["+"a".repeat(o.length-h-2)+"]"}),n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let s=!1,r="",a=1/0;for(;e;){if(e.length<a)a=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}s||(r=""),s=!1;let o;if(this.options.extensions?.inline?.some(l=>(o=l.call({lexer:this},e,t))?(e=e.substring(o.raw.length),t.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let l=t.at(-1);o.type==="text"&&l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):t.push(o);continue}if(o=this.tokenizer.emStrong(e,n,r)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.del(e,n,r)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),t.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),t.push(o);continue}let c=e;if(this.options.extensions?.startInline){let l=1/0,h=e.slice(1),d;this.options.extensions.startInline.forEach(u=>{d=u.call({lexer:this},h),typeof d=="number"&&d>=0&&(l=Math.min(l,d))}),l<1/0&&l>=0&&(c=e.substring(0,l+1))}if(o=this.tokenizer.inlineText(c)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(r=o.raw.slice(-1)),s=!0;let l=t.at(-1);l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):t.push(o);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return t}infiniteLoopError(e){let t="Infinite loop on byte: "+e;if(this.options.silent)console.error(t);else throw new Error(t)}},Gc=class{options;parser;constructor(e){this.options=e||aa}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(Wn.notSpaceStart)?.[0],r=e?e.replace(Wn.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+wi(s)+'">'+(n?r:wi(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:wi(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let o=0;o<e.items.length;o++){let c=e.items[o];s+=this.listitem(c)}let r=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+r+a+`>
`+s+"</"+r+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let s="";for(let r=0;r<e.rows.length;r++){let a=e.rows[r];n="";for(let o=0;o<a.length;o++)n+=this.tablecell(a[o]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${wi(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,text:n,tokens:s,autolink:r}){let a=r?wi(n,!0):this.parser.parseInline(s),o=Om(e);if(o===null)return a;e=wi(o,r);let c='<a href="'+e+'"';return t&&(c+=' title="'+wi(t)+'"'),c+=">"+a+"</a>",c}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=Om(e);if(r===null)return wi(n);e=r;let a=`<img src="${wi(e)}" alt="${wi(n)}"`;return t&&(a+=` title="${wi(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:wi(e.text)}},Ef=class{strong({text:i}){return i}em({text:i}){return i}codespan({text:i}){return i}del({text:i}){return i}html({text:i}){return i}text({text:i}){return i}link({text:i}){return""+i}image({text:i}){return""+i}br(){return""}checkbox({raw:i}){return i}},is=class Yu{options;renderer;textRenderer;constructor(e){this.options=e||aa,this.options.renderer=this.options.renderer||new Gc,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ef}static parse(e,t){return new Yu(t).parse(e)}static parseInline(e,t){return new Yu(t).parseInline(e)}parse(e){this.renderer.parser=this;let t="";for(let n=0;n<e.length;n++){let s=e[n];if(this.options.extensions?.renderers?.[s.type]){let a=s,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(a.type)){t+=o||"";continue}}let r=s;switch(r.type){case"space":{t+=this.renderer.space(r);break}case"hr":{t+=this.renderer.hr(r);break}case"heading":{t+=this.renderer.heading(r);break}case"code":{t+=this.renderer.code(r);break}case"table":{t+=this.renderer.table(r);break}case"blockquote":{t+=this.renderer.blockquote(r);break}case"list":{t+=this.renderer.list(r);break}case"checkbox":{t+=this.renderer.checkbox(r);break}case"html":{t+=this.renderer.html(r);break}case"def":{t+=this.renderer.def(r);break}case"paragraph":{t+=this.renderer.paragraph(r);break}case"text":{t+=this.renderer.text(r);break}default:{let a='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return t}parseInline(e,t=this.renderer){this.renderer.parser=this;let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let o=this.options.extensions.renderers[r.type].call({parser:this},r);if(o!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(r.type)){n+=o||"";continue}}let a=r;switch(a.type){case"escape":{n+=t.text(a);break}case"html":{n+=t.html(a);break}case"link":{n+=t.link(a);break}case"image":{n+=t.image(a);break}case"checkbox":{n+=t.checkbox(a);break}case"strong":{n+=t.strong(a);break}case"em":{n+=t.em(a);break}case"codespan":{n+=t.codespan(a);break}case"br":{n+=t.br(a);break}case"del":{n+=t.del(a);break}case"text":{n+=t.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}},qo=class{options;block;constructor(i){this.options=i||aa}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(i){return i}postprocess(i){return i}processAllTokens(i){return i}emStrongMask(i){return i}provideLexer(i=this.block){return i?ns.lex:ns.lexInline}provideParser(i=this.block){return i?is.parse:is.parseInline}},Iy=class{defaults=xf();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=is;Renderer=Gc;TextRenderer=Ef;Lexer=ns;Tokenizer=Vc;Hooks=qo;constructor(...i){this.use(...i)}walkTokens(i,e){let t=[];for(let n of i)switch(t=t.concat(e.call(this,n)),n.type){case"table":{let s=n;for(let r of s.header)t=t.concat(this.walkTokens(r.tokens,e));for(let r of s.rows)for(let a of r)t=t.concat(this.walkTokens(a.tokens,e));break}case"list":{let s=n;t=t.concat(this.walkTokens(s.items,e));break}default:{let s=n;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(r=>{let a=s[r].flat(1/0);t=t.concat(this.walkTokens(a,e))}):s.tokens&&(t=t.concat(this.walkTokens(s.tokens,e)))}}return t}use(...i){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return i.forEach(t=>{let n={...t};if(n.async=this.defaults.async||n.async||!1,t.extensions&&(t.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let r=e.renderers[s.name];r?e.renderers[s.name]=function(...a){let o=s.renderer.apply(this,a);return o===!1&&(o=r.apply(this,a)),o}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=e[s.level];r?r.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),n.extensions=e),t.renderer){let s=this.defaults.renderer||new Gc(this.defaults);for(let r in t.renderer){if(!(r in s))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;let a=r,o=t.renderer[a],c=s[a];s[a]=(...l)=>{let h=o.apply(s,l);return h===!1&&(h=c.apply(s,l)),h||""}}n.renderer=s}if(t.tokenizer){let s=this.defaults.tokenizer||new Vc(this.defaults);for(let r in t.tokenizer){if(!(r in s))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let a=r,o=t.tokenizer[a],c=s[a];s[a]=(...l)=>{let h=o.apply(s,l);return h===!1&&(h=c.apply(s,l)),h}}n.tokenizer=s}if(t.hooks){let s=this.defaults.hooks||new qo;for(let r in t.hooks){if(!(r in s))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;let a=r,o=t.hooks[a],c=s[a];qo.passThroughHooks.has(r)?s[a]=l=>{if(this.defaults.async&&qo.passThroughHooksRespectAsync.has(r))return(async()=>{let d=await o.call(s,l);return c.call(s,d)})();let h=o.call(s,l);return c.call(s,h)}:s[a]=(...l)=>{if(this.defaults.async)return(async()=>{let d=await o.apply(s,l);return d===!1&&(d=await c.apply(s,l)),d})();let h=o.apply(s,l);return h===!1&&(h=c.apply(s,l)),h}}n.hooks=s}if(t.walkTokens){let s=this.defaults.walkTokens,r=t.walkTokens;n.walkTokens=function(a){let o=[];return o.push(r.call(this,a)),s&&(o=o.concat(s.call(this,a))),o}}this.defaults={...this.defaults,...n}}),this}setOptions(i){return this.defaults={...this.defaults,...i},this}lexer(i,e){return ns.lex(i,e??this.defaults)}parser(i,e){return is.parse(i,e??this.defaults)}parseMarkdown(i){return(e,t)=>{let n={...t},s={...this.defaults,...n},r=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&n.async===!1)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return r(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=i),s.async)return(async()=>{let a=s.hooks?await s.hooks.preprocess(e):e,o=await(s.hooks?await s.hooks.provideLexer(i):i?ns.lex:ns.lexInline)(a,s),c=s.hooks?await s.hooks.processAllTokens(o):o;s.walkTokens&&await Promise.all(this.walkTokens(c,s.walkTokens));let l=await(s.hooks?await s.hooks.provideParser(i):i?is.parse:is.parseInline)(c,s);return s.hooks?await s.hooks.postprocess(l):l})().catch(r);try{s.hooks&&(e=s.hooks.preprocess(e));let a=(s.hooks?s.hooks.provideLexer(i):i?ns.lex:ns.lexInline)(e,s);s.hooks&&(a=s.hooks.processAllTokens(a)),s.walkTokens&&this.walkTokens(a,s.walkTokens);let o=(s.hooks?s.hooks.provideParser(i):i?is.parse:is.parseInline)(a,s);return s.hooks&&(o=s.hooks.postprocess(o)),o}catch(a){return r(a)}}}onError(i,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,i){let n="<p>An error occurred:</p><pre>"+wi(t.message+"",!0)+"</pre>";return e?Promise.resolve(n):n}if(e)return Promise.reject(t);throw t}}},Jr=new Iy;function Gt(i,e){return Jr.parse(i,e)}Gt.options=Gt.setOptions=function(i){return Jr.setOptions(i),Gt.defaults=Jr.defaults,p_(Gt.defaults),Gt};Gt.getDefaults=xf;Gt.defaults=aa;function Uy(...i){return Jr.use(...i),Gt.defaults=Jr.defaults,p_(Gt.defaults),Gt}Gt.use=Uy;Gt.walkTokens=function(i,e){return Jr.walkTokens(i,e)};Gt.parseInline=Jr.parseInline;Gt.Parser=is;Gt.parser=is.parse;Gt.Renderer=Gc;Gt.TextRenderer=Ef;Gt.Lexer=ns;Gt.lexer=ns.lex;Gt.Tokenizer=Vc;Gt.Hooks=qo;Gt.parse=Gt;Gt.options;Gt.setOptions;Gt.walkTokens;Gt.parseInline;is.parse;ns.lex;const Wm="ml.perf",$m=()=>window.__mlBus,rl={on:!1,auto:!0,init(){const i=(()=>{try{return JSON.parse(localStorage.getItem(Wm)??"{}")}catch{return{}}})();this.auto=i.auto??!0,this.set(!!i.on,!1)},set(i,e=!0){if(this.on=!!i,document.body.classList.toggle("perf",this.on),document.querySelector("#btn-perf")?.classList.toggle("on",this.on),document.querySelector("#btn-perf")?.setAttribute("aria-pressed",String(this.on)),$m()?.dispatchEvent(new CustomEvent("perf",{detail:this.on})),e)try{localStorage.setItem(Wm,JSON.stringify({on:this.on,auto:this.auto}))}catch{}},toggle(){this.set(!this.on),$m()?.dispatchEvent(new CustomEvent("toast",{detail:this.on?"Modo rendimiento: solo video y esqueleto":"Modo rendimiento apagado"}))},recording(i){this.auto&&(i?(this.wasOn=this.on,this.on||this.set(!0,!1)):this.wasOn||this.set(!1,!1))}},K=i=>document.querySelector(i),Ci=i=>[...document.querySelectorAll(i)],$n={get(i,e){try{const t=localStorage.getItem(`ml.${i}`);return t?JSON.parse(t):e}catch{return e}},set(i,e){try{localStorage.setItem(`ml.${i}`,JSON.stringify(e))}catch{}}},Ga=(i,e,t)=>Math.min(t,Math.max(e,i)),gn=i=>String(i??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Fy=i=>`${(i/1e3).toFixed(2)} s`,S_={biceps_curl:"curl",pushup_triceps:"curl",pushup_diamond:"curl",pushup_standard:"curl",dips_bench:"curl",pullup_close:"pullup",pullup_wide:"pullup",dead_hang:"pullup",jump_rope:"jumprope",boxing_shadow:"boxing",crane_balance:"crane",free:"boxing"},Oy={elbows_out:["l_elbow","r_elbow"],elbows_flare:["l_elbow","r_elbow"],shoulder_tilt:["l_shoulder","r_shoulder"],torso_swing:["l_shoulder","r_shoulder","l_hip","r_hip"],guard_down:["l_wrist","r_wrist"],hands_apart:["l_wrist","r_wrist"],grip_wide:["l_wrist","r_wrist"],grip_close:["l_wrist","r_wrist"]},B={engine:null,engineKind:null,source:null,exercises:[],custom:$n.get("custom",[]),exercise:ul,refs:{},profile:$n.get("profile",{lead:"L"}),calib:$n.get("calib",null),pipeline:null,last:null,lastSeenAt:0,busy:!1,lastVT:-1,lastSimT:0,fpsN:0,fpsT:performance.now(),fps:0,view:null,rec:null,compareWith:null,template:null,precision:[],buffer:[],hudT:0,chartT:0,worldT:0};window.__ml=B;const w_=new EventTarget;window.__mlBus=w_;const Vi=(i,e)=>w_.dispatchEvent(new CustomEvent(i,{detail:e})),cn={stage:new Ll(K("#stage")),ob:new Ll(K("#ob-canvas")),pl:new Ll(K("#pl-canvas")),cmp:new Ll(K("#cmp-canvas"),{ghosts:!1,trails:!1})},E_=new gv(K("#world"));window.__mlR=cn;window.__mlAct={show:yn,openPlayer:Pf,selectExercise:Gi,openCompare:hh,startReplay:Ky,backToLive:Jy,get transport(){return ur},toast:(i,e)=>jt(i,e),startDemo:_o,obUseDemo:D_,analyzeDemo:Wy};window.__mlWorld=E_;const By=new gM(K("#chart-live"),140),zy=new hf(K("#chart-reps"),140),T_=new hf(K("#pl-chart-reps"),170),Hy=new hf(K("#cmp-chart"),170);function jt(i,e=3500){const t=K("#toast");t.innerHTML=i,t.hidden=!1,clearTimeout(jt.h),jt.h=setTimeout(()=>{t.hidden=!0},e)}function yn(i){B.view=i;for(const e of Ci(".view"))e.hidden=e.id!==`view-${i}`;for(const e of Ci(".tab"))e.classList.toggle("on",e.dataset.view===i);i!=="player"&&(be.playing=!1,be.video?.pause()),B.source?.demo?i==="studio"||i==="onboarding"?B.source.video.play().catch(()=>{}):B.source.video.pause():i==="studio"&&B.engine&&B.engineKind!=="sim"&&!B.source&&_o(),i==="sessions"&&F_(),i==="compare"&&B_(),Vi("view",i)}Ci(".tab").forEach(i=>i.addEventListener("click",()=>yn(i.dataset.view)));K("#btn-setup").addEventListener("click",()=>{K("#view-onboarding .ob").classList.remove("auto"),yn("onboarding"),Wi(1)});async function Vy(){const i=await fetch("exercises/index.json").then(e=>e.json());B.exercises=await Promise.all(i.map(e=>fetch(`exercises/${e}.json`).then(t=>t.json())))}const A_=()=>[...B.exercises,...B.custom],vr=i=>A_().find(e=>e.id===i)??ul;async function R_(){B.refs={};const i=await Zr();for(const e of i.slice().reverse())e.isReference&&(B.refs[e.exercise]=e.id);return i}function Tf(){K("#ex-list").innerHTML=A_().map(i=>`
    <button class="ex ${i.id===B.exercise.id?"on":""}" data-ex="${gn(i.id)}">
      ${gn(i.name)}${B.refs[i.id]?' <span class="ref">★ ref</span>':""}
      <small>${gn({reps:"repeticiones",jumps:"saltos",hold:"tiempo sostenido",boxing:"golpes y guardia",free:i.custom?"mapeado por vos":"auto-detección"}[i.family]??i.family)}</small>
    </button>`).join(""),Ci("#ex-list .ex").forEach(i=>i.addEventListener("click",()=>Gi(i.dataset.ex)))}async function Gi(i){if(B.rec){jt("Pará la grabación antes de cambiar de ejercicio");return}B.exercise=vr(i),B.pipeline.setExercise(B.exercise),cn.stage.reset(),B.precision=[],B.buffer=[],$n.set("exercise",i),B.engine?.name==="sim"&&B.engine.setMode(S_[i]??"curl"),K("#hud-ex").textContent=B.exercise.name,Tf(),Bs(B.exercise.hint??"",5e3),B.template=null,Vi("exercise",B.exercise);const e=B.refs[i];if(e)try{const t=await sl(e),n=so(t,vr(t.meta.exercise));B.template=$u(n)}catch(t){console.warn("no se pudo cargar la referencia",t)}}let Yo=0;function Bs(i,e=0){K("#stage-msg").textContent=i,Yo=e?performance.now()+e:0}async function Qr(i,e=()=>{}){try{B.engine?.close?.()}catch{}B.engine=null;const t=K("#ob-mp-model").value,n=K("#ob-rtm-mode").value,s=i==="mediapipe"?new sv({model:t}):i==="rtmlib"?new rv({mode:n}):new dv(S_[B.exercise.id]??"curl");await s.init(e),B.engine=s,B.engineKind=i,$n.set("engine",{kind:i,model:t,mode:n});const r=K("#st-engine");return r.textContent=i==="mediapipe"?`MediaPipe ${t} · ${s.delegate}`:i==="rtmlib"?`RTMPose ${n} · ${s.info?.device??""}`:"Simulador",r.className="chip ok",i==="sim"&&P_(),s}function go(){const i=B.source;i&&(i.stream?.getTracks().forEach(e=>e.stop()),i.video&&(i.video.pause(),i.url&&URL.revokeObjectURL(i.url)),B.source=null,B.lastVT=-1)}async function C_(){const i=(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="videoinput"),e=$n.get("camera",null);return K("#ob-cam").innerHTML=i.map((t,n)=>`<option value="${gn(t.deviceId)}" ${t.deviceId===e?"selected":""}>${gn(t.label||`Cámara ${n+1}`)}</option>`).join(""),i}async function Af(i){go();const e={width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30}};i&&(e.deviceId={exact:i});const t=await navigator.mediaDevices.getUserMedia({video:e,audio:!1}),n=document.createElement("video");n.playsInline=!0,n.muted=!0,n.srcObject=t,await n.play();const s=t.getVideoTracks()[0];return B.source={kind:"camera",video:n,stream:t,label:s?.label??"cámara"},$n.set("camera",s?.getSettings().deviceId??i??null),ml(!0),K("#st-source").textContent=`📷 ${B.source.label.slice(0,28)}`,K("#st-source").className="chip ok",B.source}function L_(i){go();const e=document.createElement("video");e.playsInline=!0,e.muted=!0,e.preload="auto";const t=URL.createObjectURL(i);return e.src=t,B.source={kind:"video",video:e,file:i,url:t,label:i.name},ml(!1),K("#st-source").textContent=`🎞 ${i.name.slice(0,28)}`,K("#st-source").className="chip ok",new Promise(n=>{e.onloadeddata=()=>n(B.source)})}function P_(){go(),B.source={kind:"sim",video:null,label:"simulador"},ml(!1),K("#st-source").textContent="🧍 simulador",K("#st-source").className="chip ok"}const Us={url:"demo/sombra-boxeo.mp4",name:"Sombra de boxeo · ejemplo",exercise:"boxing_shadow",gap:700};async function _o({play:i=!0}={}){go();const e=document.createElement("video");Object.assign(e,{playsInline:!0,muted:!0,loop:!0,preload:"auto",src:Us.url});const t={kind:"video",video:e,url:null,file:null,label:Us.name,demo:!0,base:0,lastMs:null};return B.source=t,ml(!1),K("#st-source").textContent=`🎞 ${Us.name}`,K("#st-source").className="chip ok",fetch(Us.url).then(n=>n.blob()).then(n=>{t.file=n}).catch(()=>{}),await new Promise(n=>{e.onloadeddata=n,e.onerror=n,setTimeout(n,8e3)}),B.source!==t||(vr(Us.exercise).id===Us.exercise&&await Gi(Us.exercise),i&&e.play().catch(()=>{}),Vi("source",B.source)),t}function Gy(i,e){const t=e.currentTime*1e3;return i.demo?(i.lastMs!=null&&t+250<i.lastMs&&(i.base+=i.lastMs+Us.gap),i.lastMs=t,i.base+t):t}async function D_(i){await _o();const e=K("#ob-preview");e.srcObject=null,e.src=Us.url,e.loop=!0,e.muted=!0,e.play().catch(()=>{}),K("#ob-cam-msg").textContent=i,K("#ob-cam-next").disabled=!1}async function Wy(){(!B.engine||B.engineKind==="sim")&&(jt("Cargando MediaPipe para analizar el video…"),document.querySelector("input[name=engine][value=mediapipe]").checked=!0,await Qr("mediapipe")),await _o(),yn("studio")}function ml(i){K("#tg-mirror").checked=i,cn.stage.set({mirror:i}),cn.ob.set({mirror:i})}function k_(){return B.view==="studio"?cn.stage:B.view==="onboarding"?cn.ob:null}async function $y(i){const e=B.source;let t;if(e.kind==="sim"){if(i-B.lastSimT<33)return;B.lastSimT=i,t=i}else{const n=e.video;if(!n||n.readyState<2||n.currentTime===B.lastVT||e.kind==="video"&&n.paused&&!B.rec)return;B.lastVT=n.currentTime,t=e.kind==="video"?Gy(e,n):i}B.busy=!0;try{const n=await B.engine.detect(e.video,Xy(t));n&&(n.t=t,ju(n,i))}catch(n){console.error(n)}finally{B.busy=!1}}function Xy(i){return(B.detOff==null||i+B.detOff<=B.lastDetT)&&(B.detOff=(B.lastDetT??0)+40-i),B.lastDetT=i+B.detOff,B.lastDetT}function ju(i,e){B.fpsN++,B.lastSeenAt=e,B.rec&&(B.rec.t0===null&&(B.rec.t0=i.t),B.rec.aspect||(B.rec.aspect=i.aspect),B.rec.frames.push(nv({...i,t:i.t-B.rec.t0})));const t=B.pipeline.step(i);for(B.last=t,Vi("step",t),k_()?.push(t.frame,t.sig),B.buffer.push({t:t.t,frame:t.frame});B.buffer.length&&t.t-B.buffer[0].t>3e4;)B.buffer.shift();for(const r of t.newEvents)r.type==="rep"&&B.template?.kind==="rep"&&qy(r.data);B.view==="onboarding"&&nS(t,e);const s=rl.on?200:70;B.view==="studio"&&e-B.hudT>s&&(B.hudT=e,eS(t,e))}function qy(i){const e=B.buffer.filter(n=>n.t>=i.tStart&&n.t<=i.tEnd).map(n=>n.frame),t=Oc(io(e,B.template.seq.hz),B.template.seq);t&&B.precision.push({n:i.n,total:t.total,shape:t.shape,timing:t.timing})}function Yy(i){const e=k_();if(!e)return;const t=B.last&&i-B.lastSeenAt<700,n=t?B.last:null,s=(n?.alerts??[]).map(r=>({...r,joints:Oy[r.id]??[]}));e.set({showVideo:K("#tg-video").checked||B.view==="onboarding"}),e.draw({video:B.source?.video??null,frame:n?.frame??null,sig:n?.sig??null,alerts:s,aspect:n?.frame?.aspect}),B.view==="studio"&&(Yo&&i>Yo&&Bs(""),(B.engine||B.source?.kind==="replay")&&B.source&&!t&&!Yo?Bs(B.source.kind==="video"&&B.source.video.paused?"Video cargado: ▶ para verlo con todos los HUDs o ● Grabar para guardarlo":B.source.kind==="replay"?ur.state().playing?"":"Sesión grabada: ▶ para verla con todos los HUDs":"No se detecta el cuerpo — alejate para que entre completo"):t&&!Yo&&K("#stage-msg").textContent&&Bs(""),(!B.engine&&B.source?.kind!=="replay"||!B.source)&&Bs("Sin motor o sin cámara — tocá Configurar"),n&&i-B.worldT>60&&(B.worldT=i,E_.draw(n.frame)))}function jy(i){B.source?.kind==="replay"&&B.pipeline?Zy(i):B.engine&&B.source&&!B.busy&&B.pipeline&&$y(i),Yy(i),i-B.fpsT>=1e3&&(B.fps=B.fpsN*1e3/(i-B.fpsT),B.fpsN=0,B.fpsT=i,K("#st-fps").textContent=`${B.fps.toFixed(0)} fps`),B.rec&&(K("#rec-time").textContent=Ws(i-B.rec.startPerf).slice(0,5))}async function Ky(i){if(B.rec){jt("Pará la grabación antes de reproducir");return}const e=await sl(i??B.lastSessionId);if(!e){jt("No encontré esa sesión");return}const t=await mf(e.id).catch(()=>null);go();const n=gf(e);let s=null,r=null;t&&(r=URL.createObjectURL(t),s=document.createElement("video"),Object.assign(s,{src:r,muted:!0,playsInline:!0,preload:"auto"}),await new Promise(a=>{s.onloadeddata=a,s.onerror=a,setTimeout(a,3e3)})),B.source={kind:"replay",video:s,url:r,frames:n,i:0,lastT:-1,clock:0,clockAt:0,playing:!1,session:e,label:e.meta.exerciseName,dur:n.at(-1)?.t??0},yn("studio"),await Gi(e.meta.exercise),e.calib&&B.pipeline.setCalib(e.calib),ml(e.mirror??!1),K("#st-source").textContent=`↺ ${e.meta.exerciseName.slice(0,24)}`,K("#st-source").className="chip ok",Vi("source",B.source),ur.play()}function Ku(i,e){return i.video?i.video.currentTime*1e3:i.clock+(i.playing?e-i.clockAt:0)}function Zy(i){const e=B.source;let t=Ku(e,i);!e.video&&t>=e.dur&&(e.clock=e.dur,e.playing=!1,t=e.dur),t+1<e.lastT&&(B.pipeline.reset(),cn.stage.reset(),e.i=0,e.fed=-1,Vi("replay-reset",e));const n=e.frames;for(;e.i<n.length-1&&n[e.i+1].t<=t;)n[e.i+1].t<=t-200?B.pipeline.step(n[e.i]):ju(n[e.i],i),e.i++;e.i<n.length&&n[e.i].t<=t&&e.fed!==e.i&&(ju(n[e.i],i),e.fed=e.i),e.fed>=0&&(B.lastSeenAt=i),e.lastT=t}const ur={state(){const i=B.source;if(!i||i.kind!=="replay"&&i.kind!=="video")return{kind:i?.kind??null,t:0,dur:0,playing:!1};if(i.kind==="video"){const e=i.video;return{kind:"video",t:e.currentTime*1e3,dur:(e.duration||0)*1e3,playing:!e.paused}}return{kind:"replay",t:Ku(i,performance.now()),dur:i.dur,playing:i.video?!i.video.paused:i.playing}},play(){const i=B.source;i&&(i.video?((i.video.ended||i.video.currentTime*1e3>=(i.video.duration||0)*1e3-30)&&ur.seek(0),i.video.play().catch(()=>{}),i.kind==="video"&&(i.video.onended=()=>{B.rec||i.video.pause()})):i.kind==="replay"&&(i.clock>=i.dur&&(i.clock=0),i.clockAt=performance.now(),i.playing=!0))},pause(){const i=B.source;i&&(i.video?i.video.pause():i.kind==="replay"&&i.playing&&(i.clock=Ku(i,performance.now()),i.playing=!1))},seek(i){const e=B.source;if(!e)return;const t=ur.state();i=Ga(i,0,t.dur||0),i<t.t-1&&(B.pipeline.reset(),cn.stage.reset(),e.kind==="replay"&&(e.i=0)),e.video?e.video.currentTime=i/1e3:e.kind==="replay"&&(e.clock=i,e.clockAt=performance.now()),B.lastVT=-1},toggle(){ur.state().playing?ur.pause():ur.play()}};async function Jy(){const i=!!B.source?.demo;if(!(B.source?.kind!=="replay"&&!i)){if(go(),B.pipeline.reset(),cn.stage.reset(),B.engineKind==="sim")P_();else if(B.engine)try{await Af($n.get("camera",void 0)??void 0)}catch(e){jt(`No se pudo abrir la cámara (${gn(e.message)}): sigue el video de ejemplo`),await _o()}Vi("source",B.source)}}const Qy={L:"izquierda",R:"derecha"},Ol=i=>Number.isFinite(i)?`${Math.round(i)}°`:"—";function eS(i,e){const t=i.exercise,n=i.activity;K("#hud-activity").textContent=n.label!=="unknown"?`detectado: ${r_[n.label]} ${Math.round(n.confidence*100)}%`:"detectando…";let s=0,r="",a="",o=0;if(t.family==="reps"||t.counter&&t.family!=="free"){s=i.counter.count,r="reps";const f=i.counter.last,p=B.precision.at(-1);a=f?`rep ${f.n}: ${f.tempo}${p?` · precisión ${Math.round(p.total)}%`:""}`:"arrancá cuando quieras",o=Ga(i.counter.p,0,1)}else if(t.family==="jumps")s=i.jumps.count,r="saltos",a=`${Math.round(i.jumps.rate5)} /min${i.jumps.stance?` · ${i.jumps.stance}`:""}${Number.isFinite(i.jumps.cv)?` · ritmo ±${Math.round(i.jumps.cv*100)}%`:""}`,o=Ga(i.jumps.rate5/(t.targetRate??200),0,1);else if(t.family==="hold")s=(i.hold.currentMs/1e3).toFixed(1),r="seg",a=`mejor ${(i.hold.best/1e3).toFixed(1)} s${i.hold.holds.length?` · ${i.hold.holds.length} series`:""}`,o=Ga(i.hold.currentMs/(t.hold.targetMs??3e4),0,1);else{const f=i.punches.count;s=i.punches.total,r="golpes",a=`jab ${f.jab} · cruzado ${f.cross} · gancho ${f.gancho} · upper ${f.uppercut}`,o=i.guard?1:.15}K("#hud-big").textContent=s,K("#hud-big-label").textContent=r,K("#hud-sub").textContent=a,K("#hud-meter").style.width=`${o*100}%`,K("#hud-alerts").innerHTML=i.alerts.map(f=>`<div class="alert ${f.severity==="info"?"info":""}">⚠ ${gn(f.label)}</div>`).join("");const c=i.sig,l=c.shoulderTilt,h=c.yawSigned,d=c.aboveHeadBoth?"ambas sobre la cabeza":c.aboveHeadL||c.aboveHeadR?`${c.aboveHeadL?"izq":"der"} sobre la cabeza`:c.aboveShoulderL||c.aboveShoulderR?"sobre los hombros":"abajo",u=Number.isFinite(c.balance)?Ga((c.balance+1)/2,0,1):.5;if(K("#hud-stats").innerHTML=[["codo izq",Ol(c.elbowL),"L"],["codo der",Ol(c.elbowR),"R"],["rodilla izq",Ol(c.kneeL),"L"],["rodilla der",Ol(c.kneeR),"R"],["hombros",Number.isFinite(l)?Math.abs(l)<3?"nivelados":`${l>0?"der":"izq"} más bajo ${Math.abs(l).toFixed(0)}°`:"—","C"],["torso",Number.isFinite(h)?Math.abs(h)<12?"de frente":`hombro ${h>0?"izq":"der"} adelante ${Math.abs(h).toFixed(0)}°`:"—","C"],["codos",Number.isFinite(c.elbowGapMax)?c.elbowGapMax>.75?"abiertos":"pegados":"—","C"],["manos",d,"H"],["pierna adelante",i.leadFoot?Qy[i.leadFoot]:"—",i.leadFoot??"C"],["guardia",i.guard?"arriba":"abajo","H"]].map(([f,p,m])=>`<div class="stat"><small><span class="dot" style="background:var(--${m})"></span>${f}</small><b>${p}</b></div>`).join("")+`<div class="stat" style="grid-column:1/-1"><small>peso izq ↔ der</small><div class="bal"><i style="left:${u*100}%"></i></div></div>`,e-B.chartT>220){B.chartT=e;const f=t.chart?.signals??[];By.update(i.trace,f);const p=i.counter?.reps??[];zy.update(p.length?[{label:"duración (s)",color:"#e06040",values:p.map(m=>m.totalMs/1e3)}]:[]),K("#hud-log").innerHTML=i.lines.slice(-12).reverse().map(m=>`<li><time>${Ws(m.t)}</time>${gn(m.text)}</li>`).join("")}}function tS(){for(const i of["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm","video/mp4"])if(window.MediaRecorder?.isTypeSupported?.(i))return i;return""}function ch({mapName:i=null}={}){if(B.source?.kind==="replay"){jt("Estás viendo una sesión grabada: tocá ● En vivo para volver a la cámara y grabar");return}if(!B.engine||!B.source){jt("Primero cargá un motor y una cámara (Configurar)");return}B.pipeline.reset(),B.buffer=[],B.precision=[],cn.stage.reset();const e={t0:B.source.kind==="video"&&!B.source.demo?0:null,frames:[],aspect:null,startedAt:new Date,startPerf:performance.now(),chunks:[],mr:null,mapName:i,exercise:B.exercise,compareWith:B.compareWith,source:B.source.kind};if(B.source.kind==="camera"&&window.MediaRecorder)try{const t=tS();e.mr=new MediaRecorder(B.source.stream,t?{mimeType:t,videoBitsPerSecond:25e5}:void 0),e.mr.ondataavailable=n=>n.data.size&&e.chunks.push(n.data),e.mr.start(1e3)}catch(t){console.warn("sin grabación de video",t),e.mr=null}if(B.source.kind==="video"){const t=B.source.video;t.currentTime=0,B.lastVT=-1,B.engine.resetClock?.(),B.source.demo&&(t.loop=!1),t.onended=()=>Rf(),t.play()}B.rec=e,K("#btn-rec").classList.add("on"),K("#btn-rec").textContent="■ Parar y guardar",K("#rec-badge").hidden=!1,rl.recording(!0),Vi("rec",!0)}async function Rf(){const i=B.rec;if(!i)return;if(B.rec=null,rl.recording(!1),Vi("rec",!1),K("#btn-rec").classList.remove("on"),K("#btn-rec").textContent="● Grabar sesión",K("#rec-badge").hidden=!0,B.source?.kind==="video"&&(B.source.video.onended=null,B.source.video.pause()),B.source?.demo&&(B.source.video.loop=!0),i.mr&&i.mr.state!=="inactive"&&await new Promise(u=>{i.mr.onstop=u,i.mr.stop()}),i.frames.length<15){jt("Sesión muy corta: no se guardó (hacen falta más frames con cuerpo detectado)");return}let e=null;try{const u=document.createElement("canvas"),f=K("#stage");u.width=320,u.height=Math.round(320*f.height/Math.max(1,f.width)),u.getContext("2d").drawImage(f,0,0,u.width,u.height),e=u.toDataURL("image/jpeg",.6)}catch{}let t=i.exercise;const n=l_();i.mapName&&(t={id:`custom_${n}`,name:i.mapName,family:"free",custom:!0,hint:"Movimiento mapeado por vos: se mide la precisión contra esta referencia.",chart:{signals:["elbowL","elbowR"]},checks:[]},B.custom.push(t),$n.set("custom",B.custom));const s=i.mr?new Blob(i.chunks,{type:i.mr.mimeType||"video/webm"}):i.source==="video"?B.source?.file??null:null,r=i.frames.at(-1).t-i.frames[0].t,a={version:1,id:n,meta:{id:n,createdAt:i.startedAt.toISOString(),exercise:t.id,exerciseName:t.name,engine:K("#st-engine").textContent,engineKind:B.engineKind,source:i.source,durationMs:r,frames:i.frames.length,isReference:!!i.mapName,compareWith:i.compareWith,thumb:e,loadKg:Number(K("#in-load").value)||null},aspect:i.aspect,mirror:K("#tg-mirror").checked,calib:B.calib,profile:B.profile,frames:i.frames};jt("Analizando y guardando la sesión…");const o=so(a,t);let c=null;B.template?.kind==="rep"&&!i.mapName&&(c=h_(o,B.template)),a.summary=o.summary,a.precision=c,a.meta.kpis=N_(o.summary,o);const h={"report.md":_f(a,o,{precision:c}),"points.csv":d_(a),"points.txt":f_(a),"frames.ndjson":u_(a)},{disk:d}=await c_(a,{video:s,files:h});B.lastSessionId=n,Vi("saved",n),i.mapName&&(B.refs[t.id]=n,Tf(),Gi(t.id)),jt(`Sesión guardada ✓ ${d?`· en disco: ${d}`:"· en el navegador"}`,5e3),i.compareWith?(B.compareWith=null,K("#compare-banner").hidden=!0,hh(i.compareWith,n)):Pf(n)}function N_(i,e){const t={};return i.live&&(t.reps=i.live.count),i.jumps&&(t.jumps=i.jumps.count),i.punches&&(t.punches=i.punches.total),i.hold&&(t.holdMs=i.hold.best),t.alerts=e.events.filter(n=>n.type==="form").length,t}K("#btn-rec").addEventListener("click",()=>B.rec?Rf():ch());K("#btn-map").addEventListener("click",()=>{if(B.rec)return;const i=prompt('Nombre del movimiento a mapear (ej. "guardia + jab + esquiva"):');i?.trim()&&(ch({mapName:i.trim()}),jt(`Grabando referencia "${gn(i)}"… hacé el movimiento y pará cuando termines`))});window.addEventListener("keydown",i=>{i.code==="Space"&&B.view==="studio"&&!/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)&&(i.preventDefault(),B.rec?Rf():ch())});for(const[i,e]of[["#tg-ghosts","ghosts"],["#tg-trails","trails"],["#tg-angles","showAngles"]])K(i).addEventListener("change",t=>{cn.stage.set({[e]:t.target.checked}),cn.pl.set({[e]:t.target.checked})});K("#tg-mirror").addEventListener("change",i=>{cn.stage.set({mirror:i.target.checked}),cn.ob.set({mirror:i.target.checked})});let Cf=1;const tn={prev:null,stillSince:null,calFrames:[],left:!1,calibrated:!1};function Wi(i){if(Cf=i,Ci(".ob-panel").forEach(e=>{e.hidden=Number(e.dataset.step)!==i}),Ci(".ob-steps li").forEach(e=>{const t=Number(e.dataset.step);e.classList.toggle("on",t===i),e.classList.toggle("done",t<i)}),i===2&&C_().catch(()=>{}),i===3&&(tn.stillSince=null,tn.calFrames=[],tn.calibrated=!!B.calib,tn.left=!1,cn.ob.reset(),Lf()),i===4){const e=B.profile;K("#pf-name").value=e.name??"",K("#pf-height").value=e.heightCm??"",K("#pf-weight").value=e.weightKg??"",K("#pf-lead").value=e.lead??"L",K("#pf-load")&&(K("#pf-load").value=e.loadKg??"")}}Ci("[data-go]").forEach(i=>i.addEventListener("click",()=>Wi(Number(i.dataset.go))));K("#ob-load").addEventListener("click",async()=>{const i=document.querySelector("input[name=engine]:checked").value,e=K("#ob-load");e.disabled=!0;const t=(n,s)=>{K("#ob-prog-text").textContent=n,K("#ob-prog").style.width=`${Math.round(s*100)}%`};try{await Qr(i,t),t(`Motor listo: ${K("#st-engine").textContent}`,1),Wi(i==="sim"?3:2)}catch(n){console.error(n),t(`Error: ${n.message}`,0),K("#st-engine").className="chip bad"}finally{e.disabled=!1}});async function I_(){const i=K("#view-onboarding .ob"),e=$n.get("engine",null);document.querySelector("input[name=engine][value=mediapipe]").checked=!0,K("#ob-mp-model").value=e?.kind==="mediapipe"&&e.model?e.model:"full",i.classList.add("auto");const t=(n,s)=>{K("#ob-prog-text").textContent=n,K("#ob-prog").style.width=`${Math.round(s*100)}%`};try{await Qr("mediapipe",t),t(`Motor listo: ${K("#st-engine").textContent}`,1),B.view==="onboarding"&&Cf===1&&Wi(2)}catch(n){console.error(n),t(`No pude cargar MediaPipe solo (${n.message}). Elegí el motor:`,0),K("#st-engine").className="chip bad",i.classList.remove("auto")}}K("#ob-cam-on").addEventListener("click",async()=>{try{await Af(K("#ob-cam").value||void 0),await C_(),K("#ob-preview").srcObject=B.source.stream,K("#ob-preview").play(),K("#ob-cam-msg").textContent=`Cámara activa: ${B.source.label} (${B.source.video.videoWidth}×${B.source.video.videoHeight})`,K("#ob-cam-next").disabled=!1}catch(i){K("#ob-cam-msg").textContent=`No se pudo abrir la cámara: ${i.message}`,await D_(`No se pudo abrir la cámara (${i.message}). Seguimos con el video de ejemplo: tocá Siguiente.`)}});K("#ob-file").addEventListener("change",async i=>{const e=i.target.files[0];e&&(await L_(e),K("#ob-preview").srcObject=null,K("#ob-preview").src=B.source.url,K("#ob-cam-msg").textContent=`Video: ${e.name}. En el estudio apretá ● Grabar para analizarlo completo.`,K("#ob-cam-next").disabled=!1)});K("#ob-cam-next").addEventListener("click",()=>{if(B.source?.kind==="video"){U_("studio");return}Wi(3)});K("#ob-recal").addEventListener("click",()=>{B.calib=null,tn.calibrated=!1,tn.calFrames=[],Lf()});K("#ob-skip3").addEventListener("click",()=>Wi(4));K("#ob-check-next").addEventListener("click",()=>Wi(4));K("#ob-finish").addEventListener("click",()=>{B.profile={name:K("#pf-name").value.trim(),heightCm:Number(K("#pf-height").value)||null,weightKg:Number(K("#pf-weight").value)||null,lead:K("#pf-lead").value,loadKg:Number(K("#pf-load")?.value)||null},$n.set("profile",B.profile),B.profile.loadKg&&(K("#in-load").value=B.profile.loadKg),U_()});function U_(i="home"){$n.set("onboarded",!0),B.pipeline.setLead(B.profile.lead??"L"),yn(i),Gi(B.exercise.id)}function Lf(){const i=B.calib;K("#ob-calib").textContent=i?`calibración ✓ (${i.frames} frames)
ancho de hombros ${(i.shoulderWidth*100).toFixed(1)}% del alto
torso ${(i.torsoLen*100).toFixed(1)}% · brazo ${(i.armLen*100).toFixed(1)}%
inclinación de hombros ${i.shoulderTilt.toFixed(1)}°`:"sin calibrar todavía",K("#ob-check-next").disabled=!i}function nS(i,e){if(Cf!==3)return;const t=i.frame,n=i.sig,r=["l_shoulder","r_shoulder","l_hip","r_hip","l_knee","r_knee","l_ankle","r_ankle","l_wrist","r_wrist"].every(f=>{const p=t.pts[Be[f]];return p[3]>=.5&&p[0]>.01&&p[0]<.99&&p[1]>.01&&p[1]<.99});let a=Number.isFinite(n.shoulderTilt)&&Math.abs(n.shoulderTilt)<10;t.world&&(a&&=Math.abs(t.world[Be.l_shoulder][2]-t.world[Be.r_shoulder][2])<.15);const o=["l_shoulder","r_shoulder","l_hip","r_hip"].map(f=>t.pts[Be[f]]);let c=1;tn.prev&&(c=o.reduce((f,p,m)=>f+Math.hypot(p[0]-tn.prev[m][0],p[1]-tn.prev[m][1]),0)/4),tn.prev=o.map(f=>[f[0],f[1]]);const l=c<.004;if(r&&a&&l?(tn.stillSince??=e,!tn.calibrated&&e-tn.stillSince>800&&tn.calFrames.push(t)):tn.stillSince=null,!tn.calibrated&&tn.calFrames.length>=40){const f=a1(tn.calFrames);f&&(B.calib=f,tn.calibrated=!0,$n.set("calib",f),B.pipeline.setCalib(f),Lf()),tn.calFrames=[]}const h=n.wristRelL>.25&&!(n.wristRelR>.05),d=n.wristRelR>.25&&!(n.wristRelL>.05);h&&(tn.left=!0);const u=(f,p,m=!1)=>{const _=K(`#ob-checks li[data-k=${f}]`);_.classList.toggle("ok",p),_.classList.toggle("live",m&&!p)};u("full",r),u("front",a),u("still",tn.calibrated,r&&a),u("left",tn.left,d),d&&!tn.left&&(K("#ob-checks li[data-k=left]").innerHTML="Esa es la <b>DERECHA</b> — levantá la IZQUIERDA"),tn.left&&(K("#ob-checks li[data-k=left]").innerHTML="Mano izquierda reconocida ✓")}async function F_(){const i=await R_(),e=K("#sessions-grid");if(!i.length){e.innerHTML='<div class="empty">Todavía no hay sesiones. Grabá una desde el Estudio, analizá un video o probá el simulador.</div>';return}e.innerHTML=i.map(t=>{const n=t.kpis??{},s=[];return n.reps!=null&&s.push(`${n.reps} reps`),n.jumps&&s.push(`${n.jumps} saltos`),n.punches&&s.push(`${n.punches} golpes`),n.holdMs&&s.push(`${(n.holdMs/1e3).toFixed(1)} s sostenido`),n.alerts&&s.push(`${n.alerts} alertas`),`<div class="scard" data-id="${gn(t.id)}">
      ${t.thumb?`<img src="${t.thumb}" alt="" />`:'<div class="noimg"></div>'}
      <div class="body">
        <h3>${gn(t.exerciseName)}${t.isReference?'<span class="badge ref">★ referencia</span>':""}</h3>
        <div class="meta">${new Date(t.createdAt).toLocaleString("es-AR")} · ${(t.durationMs/1e3).toFixed(1)} s · ${gn(t.source)}${t.hasVideo?" · 🎞":""}</div>
        <div class="kpis">${s.join(" · ")||"—"}</div>
      </div></div>`}).join(""),Ci(".scard").forEach(t=>t.addEventListener("click",()=>Pf(t.dataset.id)))}K("#new-cam").addEventListener("click",()=>{if(B.engine&&B.source?.kind==="camera"){yn("studio");return}yn("onboarding"),B.engine&&B.engineKind!=="sim"?Wi(2):(Wi(1),I_())});K("#new-file").addEventListener("change",async i=>{const e=i.target.files[0];e&&((!B.engine||B.engineKind==="sim")&&(jt("Cargando MediaPipe para analizar el video…"),document.querySelector("input[name=engine][value=mediapipe]").checked=!0,await Qr("mediapipe")),await L_(e),yn("studio"),await Gi(B.exercise.id),ch(),jt(`Analizando ${gn(e.name)}… se guarda solo al terminar`),i.target.value="")});K("#new-sim").addEventListener("click",async()=>{document.querySelector("input[name=engine][value=sim]").checked=!0,await Qr("sim"),yn("studio"),Gi(B.exercise.id)});K("#new-import").addEventListener("change",async i=>{const e=i.target.files[0];if(e){try{const t=JSON.parse(await e.text());if(!Array.isArray(t.frames)||!t.meta)throw new Error("no es una sesión de Motion Lab");const n=l_();t.id=n,t.meta={...t.meta,id:n,source:`importada (${t.meta.source})`};const s=so(t,vr(t.meta.exercise),{keepStates:!1});t.summary=s.summary,t.meta.kpis=N_(s.summary,s),await c_(t),jt("Sesión importada ✓"),F_()}catch(t){jt(`No se pudo importar: ${gn(t.message)}`)}i.target.value=""}});const be={session:null,an:null,idx:0,playing:!1,t:0,dur:0,video:null,url:null,lastPerf:0,pushed:-1};window.__mlPL=be;window.__mlAct.plSeek=i=>ro(i);async function Pf(i){const e=await sl(i);if(!e){jt("No encontré esa sesión");return}yn("player"),be.playing=!1,be.url&&URL.revokeObjectURL(be.url),be.video=null,be.url=null;const t=vr(e.meta.exercise),n=so(e,t);be.session=e,be.an=n,be.ex=t,be.dur=n.states.at(-1)?.tRaw??0;const s=await mf(i);if(s){be.url=URL.createObjectURL(s);const h=document.createElement("video");h.src=be.url,h.muted=!0,h.playsInline=!0,h.preload="auto",be.video=h}cn.pl.set({mirror:e.mirror??!1,showVideo:!!s&&K("#pl-video").checked}),K("#pl-title").textContent=e.meta.exerciseName,K("#pl-ref").textContent=e.meta.isReference?"★ Es referencia":"☆ Marcar como referencia";const r=n.summary;be.family=t.family;const a=t.family==="reps"?[r.live?.count??0,"reps"]:t.family==="jumps"?[r.jumps?.count??0,"saltos"]:t.family==="hold"?[((r.hold?.best??0)/1e3).toFixed(1),"seg mejor"]:t.family==="boxing"?[r.punches?.total??0,"golpes"]:[n.lines.length,"eventos"];K("#pl-big").textContent=a[0],K("#pl-big-label").textContent=a[1],K("#pl-report").innerHTML=Gt.parse(_f(e,n,{precision:e.precision}));const o=r.live?.reps??[],c=[];o.length&&c.push({label:"duración (s)",color:"#e06040",values:o.map(h=>h.totalMs/1e3)}),e.precision?.length&&c.push({label:"precisión /100",color:"#ffd60a",values:e.precision.map(h=>h.total/100)}),setTimeout(()=>{T_.update(c),Jg(K("#pl-heat"),n.heat,{mirror:e.mirror??!1,aspect:e.aspect??16/9})},30),K("#pl-log").innerHTML=n.lines.map(h=>`<li data-t="${h.t}"><time>${Ws(h.t)}</time>${gn(h.text)}</li>`).join("")||"<li>sin eventos</li>",Ci("#pl-log li[data-t]").forEach(h=>h.addEventListener("click",()=>ro(Number(h.dataset.t)+(n.states[0]?.tRaw??0))));const l=n.states[0]?.tRaw??0;Vi("player",be),K("#pl-marks").innerHTML=n.events.filter(h=>["rep","punch","jump","form","hold"].includes(h.type)).map(h=>{const d=be.dur?(h.t+l)/be.dur*100:0;return`<i class="${h.type}" style="left:${d}%" title="${gn(Ws(h.t))} ${gn(h.text)}"></i>`}).join(""),ro(0)}function O_(i){const e=be.an.states;let t=0,n=e.length-1;for(;t<n;){const s=t+n+1>>1;e[s].tRaw<=i?t=s:n=s-1}return t}function ro(i){be.t=Ga(i,0,be.dur),be.video&&(be.video.currentTime=be.t/1e3),be.idx=O_(be.t),cn.pl.reset();const e=Math.max(0,be.idx-80);for(let t=e;t<=be.idx;t++)cn.pl.push(be.an.states[t].frame,be.an.states[t].sig);be.pushed=be.idx}function iS(i){if(B.view!=="player"||!be.an)return;be.playing&&(be.video&&!be.video.paused?be.t=be.video.currentTime*1e3:be.video||(be.t+=(i-be.lastPerf)*Number(K("#pl-speed").value)),be.t>=be.dur&&(be.playing=!1,be.video?.pause(),K("#pl-play").textContent="▶")),be.lastPerf=i;const e=O_(be.t);e<be.pushed&&ro(be.t);for(let n=be.pushed+1;n<=e;n++)cn.pl.push(be.an.states[n].frame,be.an.states[n].sig);be.pushed=e,be.idx=e;const t=be.an.states[e];t&&(cn.pl.draw({video:be.video,frame:t.frame,sig:t.sig,aspect:be.session.aspect}),K("#pl-activity").textContent=t.activity!=="unknown"?r_[t.activity]:"",be.family==="reps"?K("#pl-big").textContent=t.count??0:be.family==="jumps"?K("#pl-big").textContent=t.jumps:be.family==="boxing"&&(K("#pl-big").textContent=t.punches)),K("#pl-time").textContent=Ws(be.t),document.activeElement!==K("#pl-seek")&&(K("#pl-seek").value=be.dur?Math.round(be.t/be.dur*1e3):0)}K("#pl-play").addEventListener("click",()=>{be.an&&(be.playing=!be.playing,be.playing&&be.t>=be.dur&&ro(0),K("#pl-play").textContent=be.playing?"❚❚":"▶",be.video&&(be.video.playbackRate=Number(K("#pl-speed").value),be.playing?be.video.play():be.video.pause()))});K("#pl-seek").addEventListener("input",i=>ro(Number(i.target.value)/1e3*be.dur));K("#pl-speed").addEventListener("change",i=>{be.video&&(be.video.playbackRate=Number(i.target.value))});K("#pl-video").addEventListener("change",i=>cn.pl.set({showVideo:i.target.checked&&!!be.video}));Ci(".subtabs button").forEach(i=>i.addEventListener("click",()=>{if(Ci(".subtabs button").forEach(e=>e.classList.toggle("on",e===i)),Ci(".pt").forEach(e=>{e.hidden=e.dataset.pt!==i.dataset.pt}),i.dataset.pt==="charts"&&be.an){const e=be.an.summary.live?.reps??[];T_.update(e.length?[{label:"duración (s)",color:"#e06040",values:e.map(t=>t.totalMs/1e3)}]:[]),Jg(K("#pl-heat"),be.an.heat,{mirror:be.session.mirror??!1,aspect:be.session.aspect??16/9})}}));Ci("[data-exp]").forEach(i=>i.addEventListener("click",async()=>{const e=be.session;if(!e)return;const t=`motion-lab_${e.meta.exercise}_${e.id}`,n=i.dataset.exp;if(n==="json"&&va(`${t}.json`,N1(e),"application/json"),n==="ndjson"&&va(`${t}.ndjson`,u_(e),"application/x-ndjson"),n==="csv"&&va(`${t}_puntos.csv`,d_(e),"text/csv"),n==="txt"&&va(`${t}_puntos.txt`,f_(e)),n==="md"&&va(`${t}_reporte.md`,_f(e,be.an,{precision:e.precision}),"text/markdown"),n==="video"){const s=await mf(e.id);s?va(`${t}.${(s.type||"").includes("mp4")?"mp4":"webm"}`,s):jt("Esta sesión no tiene video")}}));K("#pl-rerecord").addEventListener("click",async()=>{const i=be.session;if(B.compareWith=i.id,K("#compare-banner").textContent=`↺ Regrabando para comparar con "${i.meta.exerciseName}" del ${new Date(i.meta.createdAt).toLocaleString("es-AR")} — apretá ● Grabar`,K("#compare-banner").hidden=!1,!B.engine||!B.source||B.source.kind==="video"){yn("onboarding"),Wi(B.engine?2:1),jt("Activá la cámara y después grabá");return}yn("studio"),await Gi(i.meta.exercise)});K("#pl-ref").addEventListener("click",async()=>{const i=be.session,e=await Zr();for(const t of e)t.exercise===i.meta.exercise&&t.isReference&&t.id!==i.id&&await km(t.id,{isReference:!1});await km(i.id,{isReference:!0}),i.meta.isReference=!0,B.refs[i.meta.exercise]=i.id,K("#pl-ref").textContent="★ Es referencia",jt(`Referencia de "${gn(i.meta.exerciseName)}" actualizada: las próximas reps se puntúan contra esta`),B.exercise.id===i.meta.exercise&&Gi(i.meta.exercise)});K("#pl-compare").addEventListener("click",()=>{const i=be.session,e=B.refs[i.meta.exercise];yn("compare"),e&&e!==i.id?hh(e,i.id):(K("#cmp-b").value=i.id,jt("Elegí la referencia (A) y tocá Comparar"))});K("#pl-delete").addEventListener("click",async()=>{confirm("¿Borrar esta sesión? No se puede deshacer.")&&(await P1(be.session.id),be.an=null,yn("sessions"))});const $t={a:null,b:null,p:0,playing:!1,lastPerf:0};window.__mlCMP=$t;async function B_(){const i=await Zr(),e=i.map(s=>`<option value="${gn(s.id)}">${s.isReference?"★ ":""}${gn(s.exerciseName)} · ${new Date(s.createdAt).toLocaleString("es-AR")}</option>`).join(""),t=K("#cmp-a").value,n=K("#cmp-b").value;K("#cmp-a").innerHTML=e,K("#cmp-b").innerHTML=e,t&&(K("#cmp-a").value=t),n?K("#cmp-b").value=n:i[0]&&(K("#cmp-b").value=i[0].id)}async function hh(i,e){yn("compare"),await B_(),K("#cmp-a").value=i,K("#cmp-b").value=e;const[t,n]=await Promise.all([sl(i),sl(e)]);if(!t||!n){jt("Faltan sesiones para comparar");return}const s=so(t,vr(t.meta.exercise)),r=so(n,vr(n.meta.exercise));$t.a={s:t,an:s},$t.b={s:n,an:r},$t.p=0,cn.cmp.set({mirror:n.mirror??!1,showVideo:!1});const a=D1(s,r),o=a.overall;K("#cmp-score").textContent=o?`${Math.round(o.total)}%`:"—",K("#cmp-sub").textContent=o?`forma ${Math.round(o.shape)}% · tempo ${Math.round(o.timing)}% · error medio ${o.meanDeg.toFixed(1)}° · duración ×${o.ratio.toFixed(2)}`:"sin datos suficientes";const c=(f,p,m=_=>_??"—")=>`<tr><td>${f}</td><td>${m(p(s))}</td><td>${m(p(r))}</td></tr>`,l=f=>Number.isFinite(f)?Fy(f):"—",h=f=>Number.isFinite(f)?`${Math.round(f)}%`:"—";K("#cmp-table").innerHTML="<tr><th></th><th>A · ref</th><th>B · intento</th></tr>"+c("duración",f=>f.states.at(-1)?.t,l)+c("reps",f=>f.summary.live?.count)+c("media por rep",f=>f.summary.live?.meanMs,l)+c("más rápida",f=>f.summary.live?.fastMs,l)+c("más lenta",f=>f.summary.live?.slowMs,l)+c("fatiga",f=>f.summary.live?.slowdownPct,h)+c("saltos",f=>f.summary.jumps?.count)+c("golpes",f=>f.summary.punches?.total)+c("mejor sostenido",f=>f.summary.hold?.best,l)+c("alertas de forma",f=>f.events.filter(p=>p.type==="form").length)+c("guardia arriba",f=>f.motion.guardPct,h)+c("codo mín.",f=>f.stats.elbowL&&Math.min(f.stats.elbowL.min,f.stats.elbowR?.min??999),f=>Number.isFinite(f)?`${Math.round(f)}°`:"—");const d=s.summary.live?.reps??[],u=r.summary.live?.reps??[];setTimeout(()=>Hy.update(d.length||u.length?[{label:"A ref",color:"#898781",values:d.map(f=>f.totalMs/1e3)},{label:"B intento",color:"#e06040",values:u.map(f=>f.totalMs/1e3)}]:[]),30),K("#cmp-prec").innerHTML=a.perRep.length?a.perRep.map(f=>`<div class="prec">rep ${f.n}<span class="bar"><i style="width:${Math.round(f.total||0)}%"></i></span>${Number.isFinite(f.total)?Math.round(f.total):"—"}%</div>`).join(""):'<p class="note">La referencia no tiene reps: se compara la sesión completa.</p>',Vi("compare",$t)}function sS(i){if(B.view!=="compare"||!$t.a)return;const e=$t.b.an.states.at(-1)?.t??1;$t.playing&&($t.p+=(i-$t.lastPerf)/e,$t.p>=1&&($t.p=1,$t.playing=!1,K("#cmp-play").textContent="▶")),$t.lastPerf=i;const t=d=>d.an.states[Math.round($t.p*(d.an.states.length-1))],n=t($t.a),s=t($t.b);if(!n||!s)return;const r=d=>[(d.pts[Be.l_hip][0]+d.pts[Be.r_hip][0])/2,(d.pts[Be.l_hip][1]+d.pts[Be.r_hip][1])/2],[a,o]=r(n.frame),[c,l]=r(s.frame),h={...n.frame,pts:n.frame.pts.map(d=>[d[0]+c-a,d[1]+l-o,d[2],d[3]])};cn.cmp.draw({frame:s.frame,sig:s.sig,ghostFrame:h,ghostLabel:"ref",aspect:$t.b.s.aspect}),K("#cmp-time").textContent=`${Math.round($t.p*100)}%`,document.activeElement!==K("#cmp-seek")&&(K("#cmp-seek").value=Math.round($t.p*1e3))}K("#cmp-run").addEventListener("click",()=>hh(K("#cmp-a").value,K("#cmp-b").value));K("#cmp-play").addEventListener("click",()=>{$t.playing=!$t.playing,$t.playing&&$t.p>=1&&($t.p=0),K("#cmp-play").textContent=$t.playing?"❚❚":"▶"});K("#cmp-seek").addEventListener("input",i=>{$t.p=Number(i.target.value)/1e3});function rS(i){jy(i),iS(i),sS(i)}async function aS(){await Vy(),await R_(),B.exercise=vr($n.get("exercise","free")),B.pipeline=new df({exercise:B.exercise,calib:B.calib,lead:B.profile.lead??"L"}),K("#hud-ex").textContent=B.exercise.name,Tf();const i=await pf();K("#st-disk").textContent=i?"disco ✓":"solo navegador",K("#st-disk").className=`chip ${i?"ok":""}`,i||(document.querySelector("input[name=engine][value=rtmlib]").closest("label").querySelector("span").textContent+=" (requiere start.ps1)"),requestAnimationFrame(function n(s){rS(s),requestAnimationFrame(n)});const e=$n.get("engine",null),t=new URLSearchParams(location.search);if(t.get("sim")!==null){await Qr("sim"),yn("studio"),Gi(t.get("ex")??B.exercise.id);return}if(B.profile?.loadKg&&!K("#in-load").value&&(K("#in-load").value=B.profile.loadKg),!$n.get("onboarded",!1)||!e){yn("onboarding"),Wi(1),I_();return}yn("home"),Bs("Cargando motor…"),document.querySelector(`input[name=engine][value=${e.kind}]`).checked=!0,e.model&&(K("#ob-mp-model").value=e.model),e.mode&&(K("#ob-rtm-mode").value=e.mode);try{if(await Qr(e.kind,n=>Bs(n)),e.kind!=="sim"){let n=!1;try{n=(await navigator.permissions.query({name:"camera"})).state==="granted"}catch{}if(n)await Af($n.get("camera",void 0)??void 0);else{await _o({play:!1}),Bs(""),jt("Sin cámara activa: corre el video de ejemplo. En el Estudio, «usar mi cámara» la activa.",5200);return}}Bs(""),Gi(B.exercise.id)}catch(n){console.error(n),jt(`No se pudo arrancar solo: ${gn(n.message)}`),yn("onboarding"),Wi(1)}}aS();const pr={get(i,e){try{const t=localStorage.getItem(`ml.${i}`);return t?JSON.parse(t):e}catch{return e}},set(i,e){try{localStorage.setItem(`ml.${i}`,JSON.stringify(e))}catch{}}},Xm={home:"light",onboarding:"light",player:"light",studio:"dark",sessions:"dark",compare:"dark"},pt={mode:Xm.home,bg:"particles",get ink(){return this.mode==="light"},apply(){document.documentElement.dataset.theme=this.mode,document.documentElement.dataset.bg=this.bg,document.dispatchEvent(new CustomEvent("ml-theme",{detail:{mode:this.mode,bg:this.bg}}))},setMode(i){i!==this.mode&&(this.mode=i,pr.set("theme",i),this.apply())},toggle(){this.setMode(this.mode==="dark"?"light":"dark")},setBg(i){this.bg=i,pr.set("bg",i),this.apply()},forView(i){const e=Xm[i];e&&this.setMode(e)},animateTo(i,e=innerWidth-60,t=30){if(i===this.mode)return;const n=document.documentElement,s=Math.hypot(Math.max(e,innerWidth-e),Math.max(t,innerHeight-t));n.style.setProperty("--vt-x",`${e}px`),n.style.setProperty("--vt-y",`${t}px`),n.style.setProperty("--vt-r",`${s}px`);const r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!document.startViewTransition||r){this.setMode(i);return}n.classList.add("vt-theme"),document.startViewTransition(()=>this.setMode(i)).finished.finally(()=>n.classList.remove("vt-theme"))}},Df=(i,e=0,t=1)=>i<e?e:i>t?t:i,Pr=(i,e,t)=>i+(e-i)*t,Ts="cubic-bezier(0.16, 1, 0.3, 1)",hn=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;function ao(i){let e=i>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const si=new Uint8Array(512);{const i=ao(1337),e=[...Array(256).keys()];for(let t=255;t>0;t--){const n=Math.floor(i()*(t+1));[e[t],e[n]]=[e[n],e[t]]}for(let t=0;t<512;t++)si[t]=e[t&255]}const Xh=i=>i*i*i*(i*(i*6-15)+10),nr=(i,e,t,n)=>{const s=i<8?e:t,r=i<4?t:i===12||i===14?e:n;return(i&1?-s:s)+(i&2?-r:r)};function Bl(i,e,t){const n=Math.floor(i)&255,s=Math.floor(e)&255,r=Math.floor(t)&255;i-=Math.floor(i),e-=Math.floor(e),t-=Math.floor(t);const a=Xh(i),o=Xh(e),c=Xh(t),l=si[n]+s,h=si[l]+r,d=si[l+1]+r,u=si[n+1]+s,f=si[u]+r,p=si[u+1]+r;return Pr(Pr(Pr(nr(si[h]&15,i,e,t),nr(si[f]&15,i-1,e,t),a),Pr(nr(si[d]&15,i,e-1,t),nr(si[p]&15,i-1,e-1,t),a),o),Pr(Pr(nr(si[h+1]&15,i,e,t-1),nr(si[f+1]&15,i-1,e,t-1),a),Pr(nr(si[d+1]&15,i,e-1,t-1),nr(si[p+1]&15,i-1,e-1,t-1),a),o),c)}function z_(i,e,t){return[(Bl(i,e+.01,t)-Bl(i,e-.01,t))/(2*.01),-(Bl(i+.01,e,t)-Bl(i-.01,e,t))/(2*.01)]}function oS(i,e,{cps:t=90,cursor:n=!0}={}){if(hn())return i.textContent=e,()=>{};let s=0,r=!1;const a=()=>{r||(s=Math.min(e.length,s+Math.max(1,Math.round(t/60))),i.textContent=e.slice(0,s)+(n&&s<e.length?"▍":""),s<e.length&&requestAnimationFrame(a))};return a(),()=>{r=!0,i.textContent=e}}const ea={orange:"#e06040",ink:"#b44528"},as={L:"#2f7bff",R:"#ff3b30",ankleL:"#6aa8ff"},lS=["#ffd60a","#ff3b30","#2f7bff","#e040fb"],cS=()=>document.documentElement.dataset.theme==="light",Zu=()=>cS()?ea.ink:ea.orange;let zl=null,qm=0;function kf(){const i=performance.now();if(zl&&i-qm<250)return zl;const e=getComputedStyle(document.documentElement);return zl=lS.map((t,n)=>hS(e.getPropertyValue(`--hud-${n+1}`).trim())||t),qm=i,zl}function Ym(i){const e=parseInt(i.replace("#",""),16);return[e>>16&255,e>>8&255,e&255]}const Ju=(i,e,t)=>`#${[i,e,t].map(n=>Math.round(Math.max(0,Math.min(255,n))).toString(16).padStart(2,"0")).join("")}`;function Sc(i,e,t){const n=Ym(i),s=Ym(e);return Ju(n[0]+(s[0]-n[0])*t,n[1]+(s[1]-n[1])*t,n[2]+(s[2]-n[2])*t)}function hS(i){if(!i)return null;if(i.startsWith("#"))return i.length===4?`#${[...i.slice(1)].map(t=>t+t).join("")}`:i;const e=i.match(/[\d.]+/g);if(!e)return null;if(i.startsWith("hsl")){const t=+e[0]/360,n=+e[1]/100,s=+e[2]/100,r=s<.5?s*(1+n):s+n-s*n,a=2*s-r,o=c=>(c=(c+1)%1,c<1/6?a+(r-a)*6*c:c<.5?r:c<2/3?a+(r-a)*(2/3-c)*6:a);return Ju(o(t+1/3)*255,o(t)*255,o(t-1/3)*255)}return Ju(+e[0],+e[1],+e[2])}const qh={home:{n:620,flow:1,link:78,reach:150,tint:"brand"},sessions:{n:760,flow:1.4,link:92,reach:170,tint:"sides"},compare:{n:640,flow:.8,link:84,reach:150,tint:"split"},onboarding:{n:420,flow:.6,link:70,reach:140,tint:"brand"}},uS=new Set(["studio","player"]);function dS(){const i=document.createElement("canvas");i.id="bg-canvas",i.setAttribute("aria-hidden","true"),document.body.prepend(i);const e=i.getContext("2d"),t=Math.min(1.5,window.devicePixelRatio||1);let n=0,s=0;const r={x:-1e4,y:-1e4,px:0,py:0},a=ao(7),o=matchMedia("(max-width: 760px)").matches?300:760,c=Array.from({length:o},()=>({x:a(),y:a(),z:.25+a()*.75,vx:0,vy:0,ox:0,oy:0,k:a(),s:.6+a()*1.6,ph:a()*10})),l=()=>{n=window.innerWidth,s=window.innerHeight,i.width=n*t,i.height=s*t,i.style.width=`${n}px`,i.style.height=`${s}px`};l(),addEventListener("resize",l,{passive:!0}),addEventListener("pointermove",x=>{r.x=x.clientX,r.y=x.clientY},{passive:!0}),addEventListener("pointerleave",()=>{r.x=r.y=-1e4});let h=0,d=0,u="home",f=qh.home,p=1,m=!0;document.addEventListener("ml-theme",()=>{m=!0}),window.__mlBus?.addEventListener("view",x=>{u=x.detail,m=!0,qh[u]&&(f=qh[u],p=0)});const _=(x,T,b)=>f.tint==="sides"?x.k<.42?"#2f7bff":x.k<.84?"#ff3b30":b[(x.k*40|0)%4]:f.tint==="split"?x.x<.5?T?"#6d6d66":"#8a8a84":b[(x.k*40|0)%4]:x.k<.62?T?"#0a0a0a":"#9a9a92":x.k<.82?T?ea.ink:ea.orange:b[(x.k*40|0)%4],g=()=>{if(d=requestAnimationFrame(g),document.hidden||document.body.classList.contains("perf"))return;if(uS.has(u)){m&&(e.setTransform(t,0,0,t,0,0),e.fillStyle=pt.ink?"#e8e8e0":"#0a0a0a",e.fillRect(0,0,n,s),m=!1);return}h+=1/60,p=Math.min(1,p+.02);const x=pt.ink,T=kf();e.setTransform(t,0,0,t,0,0),e.fillStyle=x?"#e8e8e0":"#0a0a0a",e.fillRect(0,0,n,s);const b=r.x>-1e3?r.x/n-.5:0,S=r.y>-1e3?r.y/s-.5:0;r.px+=(b-r.px)*.05,r.py+=(S-r.py)*.05;const M=64,A=-r.px*14%M,v=-r.py*14%M;e.strokeStyle=x?"rgba(10,10,10,0.045)":"rgba(255,255,255,0.03)",e.lineWidth=1,e.beginPath();for(let L=A;L<n;L+=M)e.moveTo(L,0),e.lineTo(L,s);for(let L=v;L<s;L+=M)e.moveTo(0,L),e.lineTo(n,L);e.stroke();const E=e.createRadialGradient(n*(.5+r.px*.25),s*(.45+r.py*.2),40,n/2,s/2,Math.max(n,s)*.75);if(E.addColorStop(0,x?"rgba(255,255,255,0.4)":"rgba(224,96,64,0.05)"),E.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=E,e.fillRect(0,0,n,s),hn())return;const P=Math.round(Math.min(o,f.n)),D=[];for(let L=0;L<P;L++){const k=c[L],[U,O]=z_(k.x*2.2,k.y*2.2,h*.05*f.flow+k.ph*.01);k.vx+=U*45e-6*k.z*f.flow,k.vy+=O*45e-6*k.z*f.flow;const X=k.x*n+k.ox-r.px*40*k.z,z=k.y*s+k.oy-r.py*40*k.z,re=X-r.x,q=z-r.y,te=Math.hypot(re,q);if(te<f.reach){const J=(1-te/f.reach)*2.2*k.z;k.ox+=re/(te||1)*J,k.oy+=q/(te||1)*J,te<f.reach*.75&&D.push([X,z,L])}k.ox*=.94,k.oy*=.94,k.vx*=.96,k.vy*=.96,k.x=(k.x+k.vx+1)%1,k.y=(k.y+k.vy+1)%1;const H=(.18+.5*k.z)*(.6+.4*Math.sin(h*1.3+k.ph))*p;e.globalAlpha=x?H*.6:H,e.fillStyle=_(k,x,T),e.fillRect(X,z,k.s*k.z*1.6,k.s*k.z*1.6)}for(let L=0;L<D.length;L++)for(let k=L+1;k<D.length;k++){const[U,O,X]=D[L],[z,re,q]=D[k],te=Math.hypot(U-z,O-re);if(te>f.link)continue;const H=1-te/f.link,J=f.tint==="sides"?(X+q)%2?"#2f7bff":"#ff3b30":T[(X+q)%4];e.globalAlpha=(x?.55:.6)*H*p,e.strokeStyle=J,e.lineWidth=.6+H*.9,e.beginPath(),e.moveTo(U,O),e.lineTo(z,re),e.stroke()}e.globalAlpha=1};return g(),{canvas:i,stop:()=>cancelAnimationFrame(d)}}const Qu={rec:'<circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/>',stop:'<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none"/>',play:'<path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',restart:'<path d="M6 5.5v13" /><path d="M18 5.5v13L8.5 12z" fill="currentColor" stroke="none"/>',back:'<path d="M11 6.5L4.5 12l6.5 5.5z" fill="currentColor" stroke="none"/><path d="M19.5 6.5L13 12l6.5 5.5z" fill="currentColor" stroke="none"/>',live:'<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',windows:'<rect x="3.5" y="4" width="7.5" height="7" rx="1.2"/><rect x="13" y="4" width="7.5" height="4.5" rx="1.2"/><rect x="13" y="10.5" width="7.5" height="9.5" rx="1.2"/><rect x="3.5" y="13" width="7.5" height="7" rx="1.2"/>',reset:'<path d="M4.5 12a7.5 7.5 0 1 0 2.3-5.4"/><path d="M4.5 4.5v4h4"/>',glass:'<circle cx="12" cy="12" r="7.5"/><path d="M12 4.5v15" /><path d="M12 4.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" stroke="none" opacity=".5"/>',min:'<path d="M6 12.5h12"/>',close:'<path d="M7 7l10 10M17 7L7 17"/>',grip:'<g fill="currentColor" stroke="none"><circle cx="9" cy="7" r="1.3"/><circle cx="15" cy="7" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/></g>',layers:'<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5"/><path d="M3.5 16.5L12 21l8.5-4.5"/>',bg:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/>',zoom:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M8 10.5h5M10.5 8v5"/>',gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M5.6 18.4l1.7-1.7M16.7 7.3l1.7-1.7"/>',home:'<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',studio:'<rect x="3" y="5" width="18" height="12.5" rx="2"/><circle cx="12" cy="9" r="1.4" fill="currentColor" stroke="none"/><path d="M12 10.5v3M10 12h4M12 13.5l-1.6 2.3M12 13.5l1.6 2.3"/><path d="M9 21h6"/>',sessions:'<rect x="3.5" y="4" width="17" height="4.5" rx="1.2"/><rect x="3.5" y="10" width="17" height="4.5" rx="1.2"/><rect x="3.5" y="16" width="17" height="4" rx="1.2"/>',compare:'<circle cx="8" cy="5.5" r="1.6"/><path d="M8 7.5v6M5 10h6M8 13.5l-2.3 5M8 13.5l2.3 5"/><circle cx="16" cy="5.5" r="1.6" fill="currentColor" stroke="none"/><path d="M16 7.5v6M13 10h6M16 13.5l-2.3 5M16 13.5l2.3 5" opacity=".55"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',plus:'<path d="M12 5v14M5 12h14"/>',deteccion:'<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><circle cx="12" cy="8" r="1.5"/><path d="M12 10v4.5M9.5 12h5M12 14.5l-2 3.5M12 14.5l2 3.5"/>',esqueleto:'<circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none"/><path d="M12 6.5v7M6.5 9.5h11M12 13.5l-3.5 7M12 13.5l3.5 7"/><g fill="currentColor" stroke="none"><circle cx="6.5" cy="9.5" r="1.3"/><circle cx="17.5" cy="9.5" r="1.3"/><circle cx="8.5" cy="20.5" r="1.3"/><circle cx="15.5" cy="20.5" r="1.3"/></g>',angulos:'<path d="M5 19l7-12 7 12"/><path d="M8.6 13a4.2 4.2 0 0 0 6.8 0"/>',estelas:'<path d="M3.5 17c3-1 5-7 8.5-7s4.5 4 8.5 3" stroke-dasharray="2 2.6"/><circle cx="20" cy="13" r="2" fill="currentColor" stroke="none"/>',fantasmas:'<circle cx="9" cy="5" r="1.6" opacity=".4"/><path d="M9 7v6M6 9.5h6M9 13l-2.5 6M9 13l2.5 6" opacity=".4"/><circle cx="15" cy="5" r="1.6" fill="currentColor" stroke="none"/><path d="M15 7v6M12 9.5h6M15 13l-2.5 6M15 13l2.5 6"/>',golpes:'<path d="M7 9.5a3 3 0 0 1 3-3h4.5a3 3 0 0 1 3 3v3.5a5 5 0 0 1-5 5H11a4 4 0 0 1-4-4z"/><path d="M10 6.5v3.5M13.5 6.5v3.5"/><path d="M3 4l2 2M2.5 9h2M4 14l1.8-1"/>',equilibrio:'<path d="M12 4v16M5 20h14"/><path d="M4 9h16"/><path d="M4 9l-2 5h4zM20 9l-2 5h4z"/><circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none"/>',tresd:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',calor:'<g fill="currentColor" stroke="none"><rect x="4" y="4" width="4" height="4" opacity=".25"/><rect x="10" y="4" width="4" height="4" opacity=".5"/><rect x="16" y="4" width="4" height="4" opacity=".3"/><rect x="4" y="10" width="4" height="4" opacity=".6"/><rect x="10" y="10" width="4" height="4"/><rect x="16" y="10" width="4" height="4" opacity=".5"/><rect x="4" y="16" width="4" height="4" opacity=".3"/><rect x="10" y="16" width="4" height="4" opacity=".7"/><rect x="16" y="16" width="4" height="4" opacity=".2"/></g>',senal:'<path d="M2.5 13h3l2-6 3.5 11 3-8 2 3h5.5"/>',bitacora:'<path d="M7 5h13M7 10h13M7 15h13M7 20h9"/><g fill="currentColor" stroke="none"><circle cx="3.8" cy="5" r="1.1"/><circle cx="3.8" cy="10" r="1.1"/><circle cx="3.8" cy="15" r="1.1"/><circle cx="3.8" cy="20" r="1.1"/></g>',comparar:'<circle cx="8" cy="5.5" r="1.6"/><path d="M8 7.5v6M5 10h6M8 13.5l-2.3 5M8 13.5l2.3 5"/><circle cx="16" cy="5.5" r="1.6" fill="currentColor" stroke="none"/><path d="M16 7.5v6M13 10h6M16 13.5l-2.3 5M16 13.5l2.3 5" opacity=".55"/>',video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5l5-3v9l-5-3z"/>',espejo:'<path d="M12 3v18" stroke-dasharray="2 2"/><path d="M9 7L4 12l5 5z"/><path d="M15 7l5 5-5 5z" opacity=".5"/>',bn:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>',atenuado:'<circle cx="12" cy="12" r="8" opacity=".35"/><circle cx="12" cy="12" r="4"/>',biceps_curl:'<circle cx="8" cy="4.5" r="1.6" fill="currentColor" stroke="none"/><path d="M8 6.5v8M8 14.5l-2 6M8 14.5l2 6M8 8.5l4 3 3.5-4"/><rect x="14" y="4.5" width="5" height="2.4" rx="1"/>',pushup_standard:'<circle cx="19" cy="9" r="1.6" fill="currentColor" stroke="none"/><path d="M17.5 10L5 13.5M17 10.5v4.5M5 13.5l-1.5 1.5M3 17h18"/>',pushup_triceps:'<circle cx="19" cy="9" r="1.6" fill="currentColor" stroke="none"/><path d="M17.5 10L5 13.5M16 10.5l-1 2 1.5 2.5M5 13.5l-1.5 1.5M3 17h18"/>',pushup_diamond:'<circle cx="19" cy="9" r="1.6" fill="currentColor" stroke="none"/><path d="M17.5 10L5 13.5M5 13.5l-1.5 1.5M3 17h18"/><path d="M15 17l1.5-2 1.5 2-1.5 2z"/>',dips_bench:'<circle cx="10" cy="5" r="1.6" fill="currentColor" stroke="none"/><path d="M10 7v6l6 1M10 13l-1 7M16 14l2 6M10 9l-3 3"/><path d="M4 12h6"/>',pullup_close:'<path d="M3 4h18"/><circle cx="12" cy="8" r="1.6" fill="currentColor" stroke="none"/><path d="M10.5 4l-.5 5M13.5 4l.5 5M12 10v6M12 16l-2 5M12 16l2 5"/>',pullup_wide:'<path d="M3 4h18"/><circle cx="12" cy="8" r="1.6" fill="currentColor" stroke="none"/><path d="M7 4l3 5M17 4l-3 5M12 10v6M12 16l-2 5M12 16l2 5"/>',dead_hang:'<path d="M3 4h18"/><circle cx="12" cy="9" r="1.6" fill="currentColor" stroke="none"/><path d="M10 4v4M14 4v4M12 11v6M12 17l-1 4M12 17l1 4"/>',jump_rope:'<circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none"/><path d="M12 7v7M12 14l-2 4M12 14l2 4M8.5 11l3.5-2 3.5 2"/><path d="M8.5 11c-4 1-5 7-1 9.5 3 1.5 6 1.5 9 0 4-2.5 3-8.5-1-9.5"/>',boxing_shadow:'<path d="M6 10a3.2 3.2 0 0 1 3.2-3.2h5.3a3.2 3.2 0 0 1 3.2 3.2v3.3a5.2 5.2 0 0 1-5.2 5.2h-1.3A5.2 5.2 0 0 1 6 13.3z"/><path d="M9.5 6.8V11h7.5"/><path d="M9 18.5V21h6v-2.5"/>',crane_balance:'<circle cx="12" cy="4.5" r="1.6" fill="currentColor" stroke="none"/><path d="M12 6.5v7M6 8l6 2 6-2M12 13.5V21M12 13.5l5 1.5-1 3"/>',free:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'};function At(i,e=18,t=""){const n=Qu[i]??Qu.free;return`<svg class="ico ${t}" viewBox="0 0 24 24" width="${e}" height="${e}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`}const jm=i=>i in Qu;function ja(i,{max:e=10,scale:t=1.03,perspective:n=900,stiffness:s=.14,damping:r=.72}={}){if(hn()||i.__tilt)return;const a=i.querySelector(".tilt-in")??i,o={rx:0,ry:0,vx:0,vy:0,tx:0,ty:0,sc:1,tsc:1,mx:50,my:50,tmx:50,tmy:50,raf:0},c=()=>{o.vx=(o.vx+(o.tx-o.rx)*s)*r,o.rx+=o.vx,o.vy=(o.vy+(o.ty-o.ry)*s)*r,o.ry+=o.vy,o.sc+=(o.tsc-o.sc)*.2,o.mx+=(o.tmx-o.mx)*.2,o.my+=(o.tmy-o.my)*.2,a.style.transform=`perspective(${n}px) rotateX(${o.rx.toFixed(2)}deg) rotateY(${o.ry.toFixed(2)}deg) scale(${o.sc.toFixed(3)})`,i.style.setProperty("--mx",`${o.mx}%`),i.style.setProperty("--my",`${o.my}%`);const h=Math.abs(o.tx-o.rx)+Math.abs(o.ty-o.ry)+Math.abs(o.vx)+Math.abs(o.vy)+Math.abs(o.tsc-o.sc)<.01;o.raf=h?0:requestAnimationFrame(c)},l=()=>{o.raf||(o.raf=requestAnimationFrame(c))};i.addEventListener("pointermove",h=>{const d=i.getBoundingClientRect(),u=(h.clientX-d.left)/d.width,f=(h.clientY-d.top)/d.height;o.ty=(u-.5)*2*e,o.tx=-(f-.5)*2*e,o.tsc=t,o.tmx=u*100,o.tmy=f*100,i.classList.add("tilting"),l()}),i.addEventListener("pointerleave",()=>{o.tx=o.ty=0,o.tsc=1,o.tmx=o.tmy=50,i.classList.remove("tilting"),l()}),i.__tilt=!0}const Km=i=>new Promise(e=>{const t=new Image;t.onload=()=>e(t),t.onerror=()=>e(null),t.src=i});function fS(i){const e={light:null,dark:null};let t=null,n=0,s=pt.ink?"light":"dark",r=null;const a=Math.min(2,devicePixelRatio||1),o=i.getContext("2d"),c=()=>{const p=i.getBoundingClientRect(),m=Math.max(1,Math.round(p.width*a)),_=Math.max(1,Math.round(p.height*a));return(i.width!==m||i.height!==_)&&(i.width=m,i.height=_,t=null),[m,_]},l=()=>{const[p,m]=c(),_=e.light;if(!_)return;const g=document.createElement("canvas");g.width=p,g.height=m;const x=g.getContext("2d");x.drawImage(_,0,0,p,m);const T=x.getImageData(0,0,p,m).data;n=Math.max(2,Math.round(2*a));const b=ao(21);t=[];for(let S=0;S<m;S+=n)for(let M=0;M<p;M+=n)T[((S+(n>>1))*p+Math.min(p-1,M+(n>>1)))*4+3]>110&&t.push({x:M,y:S,a:b()*Math.PI*2,s:.4+b()*.9,d:b()*.3})},h=p=>p==="light"?"#0a0a0a":"#f4f2ec",d=p=>{const[m,_]=c();o.clearRect(0,0,m,_);const g=e[p];g&&o.drawImage(g,0,0,m,_)},u=(p,m)=>{if(hn()||!t){s=m,d(m);return}const[_,g]=c(),x=performance.now()+220,T=1100;cancelAnimationFrame(r);const b=S=>{const M=(S-x)/T;if(M<0){r=requestAnimationFrame(b);return}if(M>=1){s=m,d(m);return}o.clearRect(0,0,_,g);for(const A of t){const v=Math.min(1,Math.max(0,(M-A.d*.4)/.5));if(v<1){const P=v*v;o.globalAlpha=1-v,o.fillStyle=h(p);const D=Math.cos(A.a)*P*26*a*A.s,L=Math.sin(A.a)*P*14*a*A.s-P*6*a,k=n*(1-P*.5);o.fillRect(A.x+D,A.y+L,k,k)}const E=Math.min(1,Math.max(0,(M-.32-A.d*.5)/.55));if(E>0){const P=1-(1-E)**3;o.globalAlpha=Math.min(1,E*1.6),o.fillStyle=h(m);const D=Math.cos(A.a+2)*(1-P)*34*a*A.s,L=Math.sin(A.a+2)*(1-P)*18*a*A.s;o.fillRect(A.x+D,A.y+L,n,n)}}o.globalAlpha=1,r=requestAnimationFrame(b)};r=requestAnimationFrame(b)},f=()=>{if(hn()||!t||r)return;const[p,m]=c(),_=performance.now(),g=ao(Math.floor(_)),x=Array.from({length:Math.ceil(m/n)},()=>(g()-.5)*14*a),T=b=>{const S=(b-_)/380;if(S>=1){r=null,d(s);return}o.clearRect(0,0,p,m),o.fillStyle=h(s);for(const M of t)o.fillRect(M.x+x[M.y/n|0]*(1-S)*(g()>.7?1:.3),M.y,n,n);r=requestAnimationFrame(T)};r=requestAnimationFrame(T)};return Promise.all([Km("brand/moyon-negro.png"),Km("brand/moyon-blanco.png")]).then(([p,m])=>{e.light=p,e.dark=m,l(),d(s)}),new ResizeObserver(()=>{c(),l(),r||d(s)}).observe(i),document.addEventListener("ml-theme",()=>{const p=pt.ink?"light":"dark";p!==s&&(r=null,u(s,p))}),i.closest(".brand")?.addEventListener("pointerenter",f),{glitch:f}}function pS(i){const e=document.createElement("div");e.className="tagline-hud",e.innerHTML='<span class="tilt-in"><img alt="Entrená para ser mejor" /><i class="glare"></i></span>',i.append(e);const t=e.querySelector("img"),n=()=>{t.src=pt.ink?"brand/tagline-negro.png":"brand/tagline-blanco.png"};return n(),document.addEventListener("ml-theme",n),ja(e,{max:16,scale:1.08,perspective:500}),hn()||e.animate([{opacity:0,transform:"translateX(24px)",filter:"blur(8px)"},{opacity:1,transform:"none",filter:"blur(0)"}],{duration:900,delay:1800,easing:Ts,fill:"backwards"}),e}function mS(i){const e=document.createElement("span");return e.className="ml-foot",e.innerHTML='<img src="brand/ml-footer.png" alt="ML" /><em>Moyon Lab · biometric</em>',i.prepend(e),e}const Ma=[48,4,218,292];function gS(i){const e=document.createElement("div");e.className="color-hud",e.title="HUD de color · arrastrá los puntos",e.innerHTML=`<span class="ch-track">${Ma.map((l,h)=>`<i class="ch-dot" data-i="${h}" role="slider" tabindex="0" aria-label="color ${h+1}"></i>`).join("")}</span>`,i.append(e);const t=[...e.querySelectorAll(".ch-dot")],n=[...Ma];let s=!1,r=0;const a=document.documentElement,o=()=>{const l=pt.ink?42:60;t.forEach((h,d)=>{const u=(n[d]%360+360)%360,f=`hsl(${u.toFixed(0)}, 80%, ${l}%)`;a.style.setProperty(`--hud-${d+1}`,f),h.style.background=f,h.style.left=`${u/360*100}%`,h.setAttribute("aria-valuenow",String(Math.round(u)))})},c=()=>{requestAnimationFrame(c),!document.hidden&&(r+=1/60,!s&&!hn()&&(n[0]=Ma[0]+Math.sin(r*.5)*10,n[1]=Ma[1]+Math.sin(r*.37+1)*8,n[2]=Ma[2]+Math.sin(r*.43+2)*12,n[3]=(Ma[3]+r*14)%360),Math.round(r*60)%3===0&&o())};return t.forEach((l,h)=>{l.addEventListener("pointerdown",d=>{d.preventDefault(),s=!0,l.setPointerCapture(d.pointerId),l.classList.add("drag");const u=e.querySelector(".ch-track").getBoundingClientRect(),f=m=>{n[h]=Math.max(0,Math.min(1,(m.clientX-u.left)/u.width))*360,o()},p=()=>{l.classList.remove("drag"),l.removeEventListener("pointermove",f),l.removeEventListener("pointerup",p)};l.addEventListener("pointermove",f),l.addEventListener("pointerup",p),f(d)}),l.addEventListener("keydown",d=>{(d.key==="ArrowRight"||d.key==="ArrowLeft")&&(s=!0,n[h]+=d.key==="ArrowRight"?10:-10,o(),d.preventDefault())})}),e.addEventListener("dblclick",()=>{s=!1}),document.addEventListener("ml-theme",o),o(),c(),e}function _S(i){const e=document.createElement("span");e.className="cursor-hud",i.append(e);let t=.5,n=.5,s=0,r=60,a=performance.now();addEventListener("pointermove",c=>{t=c.clientX/innerWidth,n=c.clientY/innerHeight},{passive:!0});const o=c=>{if(requestAnimationFrame(o),s++,c-a>=500&&(r=s*1e3/(c-a),s=0,a=c),s%4)return;const l=window.__ml?.engine?window.__ml.fps:r;e.textContent=`X:${t.toFixed(2)} Y:${n.toFixed(2)} · FPS ${Math.round(l)}`};return requestAnimationFrame(o),e}const Oi=(i,e=document)=>e.querySelector(i),xS=(i,e=document)=>[...e.querySelectorAll(i)],vS={home:"Inicio",studio:"Estudio",sessions:"Sesiones",compare:"Comparar",player:"Reproductor",onboarding:"Bienvenida"},bS=`<svg class="tg" viewBox="0 0 24 24" aria-hidden="true">
  <defs><mask id="tg-mask"><rect width="24" height="24" fill="#fff"/><circle class="tg-bite" cx="24" cy="0" r="6.2" fill="#000"/></mask></defs>
  <circle class="tg-core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#tg-mask)"/>
  <g class="tg-rays" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    ${[0,45,90,135,180,225,270,315].map(i=>`<line x1="12" y1="2.2" x2="12" y2="4.4" transform="rotate(${i} 12 12)"/>`).join("")}
  </g>
</svg>`,MS=`<svg class="pf" viewBox="0 0 24 24" aria-hidden="true" fill="none">
  <path class="pf-arc" d="M4 17a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <path class="pf-fill" d="M4 17a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <line class="pf-needle" x1="12" y1="17" x2="7.5" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="12" cy="17" r="1.5" fill="currentColor"/>
</svg>`;function yS({onWindowsMenu:i}={}){const e=Oi(".topbar");e.classList.add("v3");const t=Oi(".brand",e);t.innerHTML=`<img class="brand-fig" src="brand/figura.png" alt="" />
    <span class="brand-txt"><canvas class="brand-wm" role="img" aria-label="Moyon Lab"></canvas>
    <span class="brand-now"><i></i><em>visualizando</em><b>Inicio</b></span></span>`,fS(Oi(".brand-wm",t));const n=Oi(".tabs",e),s={home:"home",studio:"studio",sessions:"sessions",compare:"compare"},r=`url("${new URL("brand/banner-activo.png",document.baseURI).href}")`;xS(".tab",n).forEach((_,g)=>{const x=_.textContent.trim();_.innerHTML=`<span class="tab-bg" aria-hidden="true"></span><span class="tab-ico">${At(s[_.dataset.view]??"studio",17)}</span><span class="tab-lbl">${x}</span>`;const T=_.querySelector(".tab-bg");T.style.backgroundImage=r,T.style.animationDelay=`${-g*3}s`,_.addEventListener("pointermove",b=>{const S=_.getBoundingClientRect(),M=(b.clientX-S.left)/S.width,A=(b.clientY-S.top)/S.height;_.style.setProperty("--mx",`${M*100}%`),_.style.setProperty("--my",`${A*100}%`),_.style.setProperty("--ry",`${(M-.5)*36}deg`),_.style.setProperty("--rx",`${(.5-A)*30}deg`)}),_.addEventListener("pointerleave",()=>{_.style.setProperty("--ry","0deg"),_.style.setProperty("--rx","0deg")})}),SS(n);const a=Oi(".status",e),o=Object.assign(document.createElement("span"),{className:"nav-sp"});e.insertBefore(o,a);const c=pS(e);e.insertBefore(c,a);const l=document.createElement("div");l.className="tools",l.innerHTML=`
    <button class="icon-btn" id="btn-windows" title="Ventanas">${At("windows",17)}</button>
    <button class="icon-btn perf-tg" id="btn-perf" aria-pressed="false" title="Modo rendimiento: deja solo el video y el esqueleto para que el tracking tenga más cuadros por segundo">${MS}</button>
    <button class="icon-btn theme-tg" id="btn-theme" title="Modo claro / oscuro">${bS}</button>`,a.insertBefore(l,Oi("#btn-setup"));const h=gS(l);l.prepend(h);const d=Oi("#btn-theme");d.addEventListener("click",()=>{const _=d.getBoundingClientRect();pt.animateTo(pt.ink?"dark":"light",_.left+_.width/2,_.top+_.height/2)}),Zm(d);const u=Oi("#btn-perf");u.addEventListener("click",()=>rl.toggle()),Zm(u),rl.init(),Oi("#btn-windows").addEventListener("click",_=>i?.(_.currentTarget));const f=document.createElement("footer");f.className="footbar",f.innerHTML='<span class="fb-r" id="fb-r"></span>',document.body.append(f),mS(f),_S(Oi("#fb-r",f)),ES(f,16);const p={x:innerWidth/2,y:innerHeight/2};addEventListener("pointerdown",_=>{p.x=_.clientX,p.y=_.clientY},{capture:!0,passive:!0});const m=Oi(".brand-now b",t);return window.__mlBus?.addEventListener("view",_=>{const g=_.detail;pt.forView(g),oS(m,vS[g]??g,{cps:40,cursor:!1});const x=document.getElementById(`view-${g}`);if(!x||hn())return;const T=x.getBoundingClientRect(),b=p.x-T.left,S=p.y-T.top,M=Math.hypot(Math.max(b,T.width-b),Math.max(S,T.height-S));x.animate([{clipPath:`circle(0px at ${b}px ${S}px)`},{clipPath:`circle(${M}px at ${b}px ${S}px)`}],{duration:620,easing:Ts})}),hn()||e.animate([{opacity:0,transform:"translateY(-14px)",filter:"blur(6px)"},{opacity:1,transform:"none",filter:"blur(0)"}],{duration:800,delay:1400,easing:Ts,fill:"backwards"}),{}}function Zm(i,{radius:e=90,pull:t=.3}={}){if(hn())return;const n={x:0,y:0,vx:0,vy:0,tx:0,ty:0,raf:0},s=i.querySelector("svg"),r=()=>{n.vx=(n.vx+(n.tx-n.x)*.16)*.72,n.x+=n.vx,n.vy=(n.vy+(n.ty-n.y)*.16)*.72,n.y+=n.vy,i.style.transform=`translate(${n.x.toFixed(2)}px, ${n.y.toFixed(2)}px)`,s&&(s.style.transform=`translate(${(n.x*.5).toFixed(2)}px, ${(n.y*.5).toFixed(2)}px)`),n.raf=Math.abs(n.tx-n.x)+Math.abs(n.ty-n.y)+Math.abs(n.vx)+Math.abs(n.vy)<.02?0:requestAnimationFrame(r)},a=()=>{n.raf||(n.raf=requestAnimationFrame(r))};addEventListener("pointermove",o=>{const c=i.getBoundingClientRect(),l=c.left+c.width/2-n.x,h=c.top+c.height/2-n.y,d=o.clientX-l,u=o.clientY-h;Math.hypot(d,u)<e?(n.tx=d*t,n.ty=u*t):(n.tx=0,n.ty=0),a()},{passive:!0})}function SS(i){if(hn())return;const e=document.createElement("canvas");e.className="tabs-fx",i.append(e);const t=e.getContext("2d"),n=Math.min(2,devicePixelRatio||1),s=[];let r=null,a=0,o=0;i.addEventListener("pointermove",h=>{const d=i.getBoundingClientRect();a=h.clientX-d.left,o=h.clientY-d.top,r=h.target.closest(".tab")}),i.addEventListener("pointerleave",()=>{r=null});const c=(h,d,u)=>{const f=h.getBoundingClientRect(),p=i.getBoundingClientRect(),m=kf();for(let _=0;_<d;_++){const g=u?a+(Math.random()-.5)*20:f.left-p.left+Math.random()*f.width,x=u?o+(Math.random()-.5)*10:f.top-p.top+f.height*(.4+Math.random()*.6);s.push({x:g,y:x,vx:(Math.random()-.5)*.3,vy:-.15-Math.random()*.45,life:1,dec:.012+Math.random()*.02,s:.8+Math.random()*1.6,c:Math.random()<.55?"#ffffff":Math.random()<.6?"#e06040":m[Math.random()*4|0]})}},l=()=>{if(requestAnimationFrame(l),document.hidden)return;const h=i.getBoundingClientRect(),d=Math.round(h.width*n),u=Math.round(h.height*n);(e.width!==d||e.height!==u)&&(e.width=d,e.height=u);const f=i.querySelector(".tab.on");f&&s.length<90&&Math.random()<.6&&c(f,1,!1),r&&r!==f&&s.length<140&&c(r,2,!0),t.setTransform(n,0,0,n,0,0),t.clearRect(0,0,h.width,h.height);for(let p=s.length-1;p>=0;p--){const m=s[p];if(m.x+=m.vx,m.y+=m.vy,m.vx+=(Math.random()-.5)*.05,m.life-=m.dec,m.life<=0){s.splice(p,1);continue}t.globalAlpha=m.life*(pt.ink?.8:.9),t.fillStyle=pt.ink&&m.c==="#ffffff"?"#0a0a0a":m.c,t.fillRect(m.x,m.y,m.s,m.s)}t.globalAlpha=1};l()}function wS(i,e){Oi(".popover")?.remove();const t=document.createElement("div");t.className="popover",t.innerHTML=e.map((s,r)=>s.sep?"<hr />":`<button data-i="${r}" class="${s.on?"on":""}">${s.icon?At(s.icon,15):""}<span>${s.label}</span>${s.on?At("check",14,"chk"):""}</button>`).join(""),document.body.append(t);const n=i.getBoundingClientRect();return t.style.top=`${n.bottom+8}px`,t.style.left=`${Math.min(innerWidth-t.offsetWidth-10,Math.max(10,n.right-t.offsetWidth))}px`,t.animate([{opacity:0,transform:"translateY(-6px)"},{opacity:1,transform:"none"}],{duration:240,easing:Ts}),t.addEventListener("click",s=>{const r=s.target.closest("button[data-i]");r&&(e[Number(r.dataset.i)].act(),t.remove())}),setTimeout(()=>addEventListener("pointerdown",function s(r){t.contains(r.target)||(t.remove(),removeEventListener("pointerdown",s))}),0),t}function ES(i,e){if(hn())return;const t=document.createElement("canvas");t.className="fb-balls",i.prepend(t);const n=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1);let r=0,a=0;const o=()=>{const u=i.getBoundingClientRect();r=u.width,a=u.height,t.width=r*s,t.height=a*s,n.setTransform(s,0,0,s,0,0)};o(),addEventListener("resize",o,{passive:!0});const c=["#2f7bff","#ff3b30","#22d36b","#ffd60a","#e06040","#6aa8ff","#e040fb"],l=Array.from({length:e},(u,f)=>({x:Math.random(),y:Math.random(),r:2+Math.random()*4.5,vy:.05+Math.random()*.12,wob:Math.random()*6,ws:.01+Math.random()*.02,c:c[f%c.length],boost:0})),h={x:-1e4,y:-1e4};addEventListener("pointermove",u=>{const f=i.getBoundingClientRect();h.x=u.clientX-f.left,h.y=u.clientY-f.top},{passive:!0});const d=()=>{if(requestAnimationFrame(d),!document.hidden){n.clearRect(0,0,r,a);for(const u of l){const f=u.x*r,p=u.y*a,m=Math.hypot(f-h.x,p-h.y);m<90&&(u.boost=Math.min(2.2,u.boost+(90-m)/90*.3)),u.boost*=.93,u.wob+=u.ws,u.y-=(u.vy+u.boost)/Math.max(a,1)*3,u.x+=Math.sin(u.wob)*8e-4,u.y*a<-u.r*2&&(u.y=1+u.r/a,u.x=Math.random(),u.boost=0),n.globalAlpha=.75,n.fillStyle=u.c,n.beginPath(),n.arc(f,p,u.r,0,Math.PI*2),n.fill()}}};d()}const Hl=10;function TS(i,e){const t=document.createElement("div");t.className="win-sb",t.innerHTML="<b></b><i></i>",i.append(t);const n=t.querySelector("b"),s=t.querySelector("i");let r=0,a=0;const o=()=>{r=0;const h=e.scrollHeight-e.clientHeight,d=h>4;if(i.classList.toggle("has-scroll",d),!d)return;const u=Math.min(1,Math.max(0,e.scrollTop/h)),f=u*Math.max(0,t.clientHeight-Hl);s.style.transform=`translateY(${f.toFixed(1)}px)`,n.style.height=`${(f+Hl/2).toFixed(1)}px`,t.style.setProperty("--sb-col",Sc("#ff3b30","#2f7bff",u))},c=()=>{r||(r=requestAnimationFrame(o))};e.addEventListener("scroll",()=>{c(),i.classList.add("scrolling"),clearTimeout(a),a=setTimeout(()=>i.classList.remove("scrolling"),900)},{passive:!0}),new ResizeObserver(c).observe(e),new MutationObserver(c).observe(e,{childList:!0,subtree:!0});const l=h=>{const d=t.getBoundingClientRect(),u=e.scrollHeight-e.clientHeight;e.scrollTop=Math.min(1,Math.max(0,(h-d.top-Hl/2)/Math.max(1,d.height-Hl)))*u};return t.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),t.setPointerCapture(h.pointerId),t.classList.add("drag"),l(h.clientY);const d=f=>l(f.clientY),u=()=>{t.classList.remove("drag"),t.removeEventListener("pointermove",d),t.removeEventListener("pointerup",u)};t.addEventListener("pointermove",d),t.addEventListener("pointerup",u)}),c(),{update:c}}const ir=8,AS=760;class uh{constructor(e,{id:t}){this.root=e,this.id=t,this.key=`layout.${t}.v3`,this.saved=pr.get(this.key,{}),this.wins=new Map,this.z=20,e.classList.add("ws"),new ResizeObserver(()=>this.relayout()).observe(e)}get stacked(){return this.root.clientWidth<AS}add(e){const t=document.createElement("section");t.className=`win ${e.cls??""}`,t.dataset.win=e.id,t.innerHTML=`
      <header class="win-h">
        <span class="win-grip">${At("grip",14)}</span>
        ${e.icon?`<span class="win-ico">${At(e.icon,15)}</span>`:""}
        <span class="win-t">${e.title}</span>
        <span class="win-sp"></span>
        <button class="win-b" data-a="glass" title="Transparente sobre el video">${At("glass",14)}</button>
        <button class="win-b" data-a="min" title="Minimizar">${At("min",14)}</button>
        <button class="win-b" data-a="close" title="Cerrar (se vuelve a abrir desde Ventanas)">${At("close",14)}</button>
      </header>
      <div class="win-c"></div>
      <i class="win-r" title="Redimensionar"></i>`;const n=t.querySelector(".win-c");for(const a of[e.content].flat())a&&n.append(a);this.root.append(t);const s={...e.def,hidden:!!e.hidden,min:!1,glass:e.glass??2,...this.saved[e.id]??{}},r={...e,el:t,st:s,minW:e.minW??160,minH:e.minH??70};return this.wins.set(e.id,r),this.bind(r),this.apply(r),TS(t,n),r}bind(e){const{el:t}=e;t.addEventListener("pointerdown",()=>this.front(e)),t.querySelector(".win-h").addEventListener("dblclick",r=>{r.target.closest(".win-b")||this.set(e.id,{min:!e.st.min})}),t.querySelectorAll(".win-b").forEach(r=>r.addEventListener("click",a=>{a.stopPropagation();const o=r.dataset.a;o==="min"&&this.set(e.id,{min:!e.st.min}),o==="close"&&this.set(e.id,{hidden:!0}),o==="glass"&&this.set(e.id,{glass:(e.st.glass+1)%3})}));const n=t.querySelector(".win-h");n.addEventListener("pointerdown",r=>{if(r.button!==0||r.target.closest(".win-b")||this.stacked)return;r.preventDefault(),n.setPointerCapture(r.pointerId);const a=this.rect(),o=r.clientX,c=r.clientY,l=e.st.x*a.w,h=e.st.y*a.h;t.classList.add("dragging");const d=f=>{let p=l+f.clientX-o,m=h+f.clientY-c;f.shiftKey||(p=Math.round(p/ir)*ir,m=Math.round(m/ir)*ir);const _=t.offsetWidth;p=Math.min(Math.max(p,-_+80),a.w-80),m=Math.min(Math.max(m,0),a.h-36),e.st.x=p/a.w,e.st.y=m/a.h,t.style.left=`${p}px`,t.style.top=`${m}px`},u=()=>{t.classList.remove("dragging"),n.removeEventListener("pointermove",d),n.removeEventListener("pointerup",u),this.save()};n.addEventListener("pointermove",d),n.addEventListener("pointerup",u)});const s=t.querySelector(".win-r");s.addEventListener("pointerdown",r=>{if(r.button!==0||this.stacked)return;r.preventDefault(),r.stopPropagation(),s.setPointerCapture(r.pointerId);const a=this.rect(),o=r.clientX,c=r.clientY,l=t.offsetWidth,h=t.offsetHeight;t.classList.add("dragging");const d=f=>{let p=Math.max(e.minW,l+f.clientX-o),m=Math.max(e.minH,h+f.clientY-c);f.shiftKey||(p=Math.round(p/ir)*ir,m=Math.round(m/ir)*ir),e.st.w=p/a.w,e.st.h=m/a.h,t.style.width=`${p}px`,t.style.height=`${m}px`},u=()=>{t.classList.remove("dragging"),s.removeEventListener("pointermove",d),s.removeEventListener("pointerup",u),this.save()};s.addEventListener("pointermove",d),s.addEventListener("pointerup",u)})}rect(){return{w:this.root.clientWidth||1,h:this.root.clientHeight||1}}apply(e){const{el:t,st:n}=e;if(t.hidden=n.hidden,t.classList.toggle("min",n.min),t.dataset.glass=n.glass,this.stacked){t.style.left=t.style.top=t.style.width=t.style.height="";return}const s=this.rect();t.style.left=`${n.x*s.w}px`,t.style.top=`${n.y*s.h}px`,t.style.width=`${Math.max(e.minW,n.w*s.w)}px`,t.style.height=n.min?"":`${Math.max(e.minH,n.h*s.h)}px`}relayout(){this.root.classList.toggle("ws-stack",this.stacked);for(const e of this.wins.values())this.apply(e)}front(e){e.el.style.zIndex=++this.z}set(e,t){const n=this.wins.get(e);if(!n)return;const s=n.st.hidden;Object.assign(n.st,t),this.apply(n),s&&!n.st.hidden&&(this.front(n),this.pop(n.el)),this.save(),this.root.dispatchEvent(new CustomEvent("ws-change",{detail:{id:e,st:n.st}}))}pop(e){hn()||e.animate([{opacity:0,transform:"translateY(10px) scale(0.97)"},{opacity:1,transform:"none"}],{duration:380,easing:Ts})}isOpen(e){const t=this.wins.get(e);return!!t&&!t.st.hidden}save(){const e={};for(const[t,n]of this.wins)e[t]={x:n.st.x,y:n.st.y,w:n.st.w,h:n.st.h,hidden:n.st.hidden,min:n.st.min,glass:n.st.glass};pr.set(this.key,e)}reset(){for(const e of this.wins.values())e.st={...e.def,hidden:!!e.hidden,min:!1,glass:e.glass??2},this.apply(e),this.pop(e.el);this.save()}intro(){hn()||[...this.wins.values()].filter(e=>!e.st.hidden).forEach((e,t)=>{e.el.animate([{opacity:0,transform:"translateY(14px) scale(0.98)"},{opacity:1,transform:"none"}],{duration:520,delay:40*t,easing:Ts,fill:"backwards"})})}}const Jm={0:[".###.","#...#","#..##","#.#.#","##..#","#...#",".###."],1:["..#..",".##..","..#..","..#..","..#..","..#..",".###."],2:[".###.","#...#","....#","...#.","..#..",".#...","#####"],3:["#####","...#.","..#..","...#.","....#","#...#",".###."],4:["...#.","..##.",".#.#.","#..#.","#####","...#.","...#."],5:["#####","#....","####.","....#","....#","#...#",".###."],6:["..##.",".#...","#....","####.","#...#","#...#",".###."],7:["#####","....#","...#.","..#..",".#...",".#...",".#..."],8:[".###.","#...#","#...#",".###.","#...#","#...#",".###."],9:[".###.","#...#","#...#",".####","....#","...#.",".##.."],".":[".....",".....",".....",".....",".....",".##..",".##.."],":":[".....","..#..","..#..",".....","..#..","..#..","....."],"%":["##..#","##..#","...#.","..#..",".#...","#..##","#..##"],"-":[".....",".....",".....","#####",".....",".....","....."],"+":[".....","..#..","..#..","#####","..#..","..#..","....."],"°":[".##..","#..#.","#..#.",".##..",".....",".....","....."]," ":[".....",".....",".....",".....",".....",".....","....."],"—":[".....",".....",".....","#####",".....",".....","....."]};function ta(i,e,{on:t="#e06040",off:n="rgba(224,96,64,0.1)",glow:s=12,align:r="left",ink:a=!1}={}){const o=i.getBoundingClientRect(),c=Math.min(2,window.devicePixelRatio||1),l=Math.max(1,Math.round(o.width*c)),h=Math.max(1,Math.round(o.height*c));(i.width!==l||i.height!==h)&&(i.width=l,i.height=h);const d=i.getContext("2d");d.clearRect(0,0,l,h);const u=String(e),f=u.length*6-1,p=Math.max(1,Math.min(h/7,l/Math.max(f,1))),m=f*p,_=r==="center"?(l-m)/2:r==="right"?l-m:0,g=(h-7*p)/2,x=p*.42;a&&(t="#0a0a0a",n="rgba(10,10,10,0.07)",s=0);for(const T of[0,1]){d.fillStyle=T?t:n,T&&s?(d.shadowColor=t,d.shadowBlur=s*c):d.shadowBlur=0;for(let b=0;b<u.length;b++){const S=Jm[u[b]]??Jm[" "];for(let M=0;M<7;M++)for(let A=0;A<5;A++){const v=S[M][A]==="#";T&&!v||(d.beginPath(),d.arc(_+(b*6+A)*p+p/2,g+M*p+p/2,x,0,Math.PI*2),d.fill())}}}}const Nf="186",Ka={ROTATE:0,DOLLY:1,PAN:2},Wa={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},RS=0,Qm=1,CS=2,wc=1,LS=2,jo=3,na=0,mi=1,Os=2,ws=0,jr=1,oo=2,e0=3,t0=4,PS=5,Ha=100,DS=101,kS=102,NS=103,IS=104,US=200,FS=201,OS=202,BS=203,H_=204,V_=205,zS=206,HS=207,VS=208,GS=209,WS=210,$S=211,XS=212,qS=213,YS=214,ed=0,td=1,nd=2,al=3,id=4,sd=5,rd=6,ad=7,G_=0,jS=1,KS=2,Es=0,If=1,Uf=2,Ff=3,Of=4,Bf=5,zf=6,Hf=7,W_=300,ia=301,lo=302,Yh=303,jh=304,dh=306,od=1e3,zs=1001,ld=1002,Xn=1003,ZS=1004,Vl=1005,Jn=1006,Kh=1007,Wr=1008,Ai=1009,$_=1010,X_=1011,ol=1012,Vf=1013,As=1014,ys=1015,ls=1016,Gf=1017,Wf=1018,ll=1020,q_=35902,Y_=35899,j_=1021,K_=1022,os=1023,$s=1026,$r=1027,Z_=1028,$f=1029,sa=1030,Xf=1031,qf=1033,Ec=33776,Tc=33777,Ac=33778,Rc=33779,cd=35840,hd=35841,ud=35842,dd=35843,fd=36196,pd=37492,md=37496,gd=37488,_d=37489,Wc=37490,xd=37491,vd=37808,bd=37809,Md=37810,yd=37811,Sd=37812,wd=37813,Ed=37814,Td=37815,Ad=37816,Rd=37817,Cd=37818,Ld=37819,Pd=37820,Dd=37821,kd=36492,Nd=36494,Id=36495,Ud=36283,Fd=36284,$c=36285,Od=36286,JS=3200,Bd=0,QS=1,dr="",ai="srgb",Xc="srgb-linear",qc="linear",zt="srgb",Zh=7680,ew=519,tw=512,nw=513,iw=514,Yf=515,sw=516,rw=517,jf=518,aw=519,ow=35044,n0="300 es",Ss=2e3,cl=2001;function lw(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Yc(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function cw(){const i=Yc("canvas");return i.style.display="block",i}const i0={};function s0(...i){const e="THREE."+i.shift();console.log(e,...i)}function J_(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function lt(...i){i=J_(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ct(...i){i=J_(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Za(...i){const e=i.join(" ");e in i0||(i0[e]=!0,lt(...i))}function hw(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const uw={[ed]:td,[nd]:rd,[id]:ad,[al]:sd,[td]:ed,[rd]:nd,[ad]:id,[sd]:al};class yr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Kn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Cc=Math.PI/180,zd=180/Math.PI;function gl(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Kn[i&255]+Kn[i>>8&255]+Kn[i>>16&255]+Kn[i>>24&255]+"-"+Kn[e&255]+Kn[e>>8&255]+"-"+Kn[e>>16&15|64]+Kn[e>>24&255]+"-"+Kn[t&63|128]+Kn[t>>8&255]+"-"+Kn[t>>16&255]+Kn[t>>24&255]+Kn[n&255]+Kn[n>>8&255]+Kn[n>>16&255]+Kn[n>>24&255]).toLowerCase()}function St(i,e,t){return Math.max(e,Math.min(t,i))}function dw(i,e){return(i%e+e)%e}function Jh(i,e,t){return(1-t)*i+t*e}function No(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function di(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const fw={DEG2RAD:Cc};class Je{static{Je.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=St(this.x,e.x,t.x),this.y=St(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=St(this.x,e,t),this.y=St(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(St(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(St(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class br{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],p=r[a+2],m=r[a+3];if(d!==m||c!==u||l!==f||h!==p){let _=c*u+l*f+h*p+d*m;_<0&&(u=-u,f=-f,p=-p,m=-m,_=-_);let g=1-o;if(_<.9995){const x=Math.acos(_),T=Math.sin(x);g=Math.sin(g*x)/T,o=Math.sin(o*x)/T,c=c*g+u*o,l=l*g+f*o,h=h*g+p*o,d=d*g+m*o}else{c=c*g+u*o,l=l*g+f*o,h=h*g+p*o,d=d*g+m*o;const x=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=x,l*=x,h*=x,d*=x}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+h*d+c*f-l*u,e[t+1]=c*p+h*u+l*d-o*f,e[t+2]=l*p+h*f+o*u-c*d,e[t+3]=h*p-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),d=o(r/2),u=c(n/2),f=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d+u*f*p;break;case"YZX":this._x=u*h*d+l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d-u*f*p;break;case"XZY":this._x=u*h*d-l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d+u*f*p;break;default:lt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(St(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Y{static{Y.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(r0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(r0.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=s+c*d+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=St(this.x,e.x,t.x),this.y=St(this.y,e.y,t.y),this.z=St(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=St(this.x,e,t),this.y=St(this.y,e,t),this.z=St(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(St(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Qh.copy(this).projectOnVector(e),this.sub(Qh)}reflect(e){return this.sub(Qh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(St(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qh=new Y,r0=new br;class ut{static{ut.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],m=s[0],_=s[3],g=s[6],x=s[1],T=s[4],b=s[7],S=s[2],M=s[5],A=s[8];return r[0]=a*m+o*x+c*S,r[3]=a*_+o*T+c*M,r[6]=a*g+o*b+c*A,r[1]=l*m+h*x+d*S,r[4]=l*_+h*T+d*M,r[7]=l*g+h*b+d*A,r[2]=u*m+f*x+p*S,r[5]=u*_+f*T+p*M,r[8]=u*g+f*b+p*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,p=t*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/p;return e[0]=d*m,e[1]=(s*l-h*n)*m,e[2]=(o*n-s*a)*m,e[3]=u*m,e[4]=(h*t-s*c)*m,e[5]=(s*r-o*t)*m,e[6]=f*m,e[7]=(n*c-l*t)*m,e[8]=(a*t-n*r)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Za("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(eu.makeScale(e,t)),this}rotate(e){return Za("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(eu.makeRotation(-e)),this}translate(e,t){return Za("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(eu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const eu=new ut,a0=new ut().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),o0=new ut().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pw(){const i={enabled:!0,workingColorSpace:Xc,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===zt&&(s.r=Gs(s.r),s.g=Gs(s.g),s.b=Gs(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===zt&&(s.r=Ja(s.r),s.g=Ja(s.g),s.b=Ja(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===dr?qc:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Za("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Za("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Xc]:{primaries:e,whitePoint:n,transfer:qc,toXYZ:a0,fromXYZ:o0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ai},outputColorSpaceConfig:{drawingBufferColorSpace:ai}},[ai]:{primaries:e,whitePoint:n,transfer:zt,toXYZ:a0,fromXYZ:o0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ai}}}),i}const Et=pw();function Gs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ja(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ya;class mw{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ya===void 0&&(ya=Yc("canvas")),ya.width=e.width,ya.height=e.height;const s=ya.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ya}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Yc("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Gs(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gs(t[n]/255)*255):t[n]=Gs(t[n]);return{data:t,width:e.width,height:e.height}}else return lt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let gw=0;class Kf{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:gw++}),this.uuid=gl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(tu(s[a].image)):r.push(tu(s[a]))}else r=tu(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function tu(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mw.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(lt("Texture: Unable to serialize Texture."),{})}let _w=0;const nu=new Y;class Yn extends yr{constructor(e=Yn.DEFAULT_IMAGE,t=Yn.DEFAULT_MAPPING,n=zs,s=zs,r=Jn,a=Wr,o=os,c=Ai,l=Yn.DEFAULT_ANISOTROPY,h=dr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_w++}),this.uuid=gl(),this.name="",this.source=new Kf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Je(0,0),this.repeat=new Je(1,1),this.center=new Je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(nu).x}get height(){return this.source.getSize(nu).y}get depth(){return this.source.getSize(nu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){lt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){lt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==W_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case od:e.x=e.x-Math.floor(e.x);break;case zs:e.x=e.x<0?0:1;break;case ld:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case od:e.y=e.y-Math.floor(e.y);break;case zs:e.y=e.y<0?0:1;break;case ld:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Yn.DEFAULT_IMAGE=null;Yn.DEFAULT_MAPPING=W_;Yn.DEFAULT_ANISOTROPY=1;class ln{static{ln.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],p=c[9],m=c[2],_=c[6],g=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-m)<.01&&Math.abs(p-_)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+m)<.1&&Math.abs(p+_)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(l+1)/2,b=(f+1)/2,S=(g+1)/2,M=(h+u)/4,A=(d+m)/4,v=(p+_)/4;return T>b&&T>S?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=M/n,r=A/n):b>S?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=M/s,r=v/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=A/r,s=v/r),this.set(n,s,r,t),this}let x=Math.sqrt((_-p)*(_-p)+(d-m)*(d-m)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(_-p)/x,this.y=(d-m)/x,this.z=(u-h)/x,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=St(this.x,e.x,t.x),this.y=St(this.y,e.y,t.y),this.z=St(this.z,e.z,t.z),this.w=St(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=St(this.x,e,t),this.y=St(this.y,e,t),this.z=St(this.z,e,t),this.w=St(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(St(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xw extends yr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ln(0,0,e,t),this.scissorTest=!1,this.viewport=new ln(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Yn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Jn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Kf(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Hi extends xw{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Q_ extends Yn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=zs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class vw extends Yn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=zs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Kt{static{Kt.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,c,l,h,d,u,f,p,m,_){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,d,u,f,p,m,_)}set(e,t,n,s,r,a,o,c,l,h,d,u,f,p,m,_){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=p,g[11]=m,g[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/Sa.setFromMatrixColumn(e,0).length(),r=1/Sa.setFromMatrixColumn(e,1).length(),a=1/Sa.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,f=a*d,p=o*h,m=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+p*l,t[5]=u-m*l,t[9]=-o*c,t[2]=m-u*l,t[6]=p+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,p=l*h,m=l*d;t[0]=u+m*o,t[4]=p*o-f,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=m+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,p=l*h,m=l*d;t[0]=u-m*o,t[4]=-a*d,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=m-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,f=a*d,p=o*h,m=o*d;t[0]=c*h,t[4]=p*l-f,t[8]=u*l+m,t[1]=c*d,t[5]=m*l+u,t[9]=f*l-p,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,p=o*c,m=o*l;t[0]=c*h,t[4]=m-u*d,t[8]=p*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+p,t[10]=u-m*d}else if(e.order==="XZY"){const u=a*c,f=a*l,p=o*c,m=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+m,t[5]=a*h,t[9]=f*d-p,t[2]=p*d-f,t[6]=o*h,t[10]=m*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bw,e,Mw)}lookAt(e,t,n){const s=this.elements;return yi.subVectors(e,t),yi.lengthSq()===0&&(yi.z=1),yi.normalize(),sr.crossVectors(n,yi),sr.lengthSq()===0&&(Math.abs(n.z)===1?yi.x+=1e-4:yi.z+=1e-4,yi.normalize(),sr.crossVectors(n,yi)),sr.normalize(),Gl.crossVectors(yi,sr),s[0]=sr.x,s[4]=Gl.x,s[8]=yi.x,s[1]=sr.y,s[5]=Gl.y,s[9]=yi.y,s[2]=sr.z,s[6]=Gl.z,s[10]=yi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],m=n[6],_=n[10],g=n[14],x=n[3],T=n[7],b=n[11],S=n[15],M=s[0],A=s[4],v=s[8],E=s[12],P=s[1],D=s[5],L=s[9],k=s[13],U=s[2],O=s[6],X=s[10],z=s[14],re=s[3],q=s[7],te=s[11],H=s[15];return r[0]=a*M+o*P+c*U+l*re,r[4]=a*A+o*D+c*O+l*q,r[8]=a*v+o*L+c*X+l*te,r[12]=a*E+o*k+c*z+l*H,r[1]=h*M+d*P+u*U+f*re,r[5]=h*A+d*D+u*O+f*q,r[9]=h*v+d*L+u*X+f*te,r[13]=h*E+d*k+u*z+f*H,r[2]=p*M+m*P+_*U+g*re,r[6]=p*A+m*D+_*O+g*q,r[10]=p*v+m*L+_*X+g*te,r[14]=p*E+m*k+_*z+g*H,r[3]=x*M+T*P+b*U+S*re,r[7]=x*A+T*D+b*O+S*q,r[11]=x*v+T*L+b*X+S*te,r[15]=x*E+T*k+b*z+S*H,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],p=e[3],m=e[7],_=e[11],g=e[15],x=c*f-l*u,T=o*f-l*d,b=o*u-c*d,S=a*f-l*h,M=a*u-c*h,A=a*d-o*h;return t*(m*x-_*T+g*b)-n*(p*x-_*S+g*M)+s*(p*T-m*S+g*A)-r*(p*b-m*M+_*A)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-n*(r*h-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],p=e[12],m=e[13],_=e[14],g=e[15],x=t*o-n*a,T=t*c-s*a,b=t*l-r*a,S=n*c-s*o,M=n*l-r*o,A=s*l-r*c,v=h*m-d*p,E=h*_-u*p,P=h*g-f*p,D=d*_-u*m,L=d*g-f*m,k=u*g-f*_,U=x*k-T*L+b*D+S*P-M*E+A*v;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/U;return e[0]=(o*k-c*L+l*D)*O,e[1]=(s*L-n*k-r*D)*O,e[2]=(m*A-_*M+g*S)*O,e[3]=(u*M-d*A-f*S)*O,e[4]=(c*P-a*k-l*E)*O,e[5]=(t*k-s*P+r*E)*O,e[6]=(_*b-p*A-g*T)*O,e[7]=(h*A-u*b+f*T)*O,e[8]=(a*L-o*P+l*v)*O,e[9]=(n*P-t*L-r*v)*O,e[10]=(p*M-m*b+g*x)*O,e[11]=(d*b-h*M-f*x)*O,e[12]=(o*E-a*D-c*v)*O,e[13]=(t*D-n*E+s*v)*O,e[14]=(m*T-p*S-_*x)*O,e[15]=(h*S-d*T+u*x)*O,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,p=r*d,m=a*h,_=a*d,g=o*d,x=c*l,T=c*h,b=c*d,S=n.x,M=n.y,A=n.z;return s[0]=(1-(m+g))*S,s[1]=(f+b)*S,s[2]=(p-T)*S,s[3]=0,s[4]=(f-b)*M,s[5]=(1-(u+g))*M,s[6]=(_+x)*M,s[7]=0,s[8]=(p+T)*A,s[9]=(_-x)*A,s[10]=(1-(u+m))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Sa.set(s[0],s[1],s[2]).length();const o=Sa.set(s[4],s[5],s[6]).length(),c=Sa.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Yi.copy(this);const l=1/a,h=1/o,d=1/c;return Yi.elements[0]*=l,Yi.elements[1]*=l,Yi.elements[2]*=l,Yi.elements[4]*=h,Yi.elements[5]*=h,Yi.elements[6]*=h,Yi.elements[8]*=d,Yi.elements[9]*=d,Yi.elements[10]*=d,t.setFromRotationMatrix(Yi),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,s,r,a,o=Ss,c=!1){const l=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s);let p,m;if(c)p=r/(a-r),m=a*r/(a-r);else if(o===Ss)p=-(a+r)/(a-r),m=-2*a*r/(a-r);else if(o===cl)p=-a/(a-r),m=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Ss,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),f=-(n+s)/(n-s);let p,m;if(c)p=1/(a-r),m=a/(a-r);else if(o===Ss)p=-2/(a-r),m=-(a+r)/(a-r);else if(o===cl)p=-1/(a-r),m=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Sa=new Y,Yi=new Kt,bw=new Y(0,0,0),Mw=new Y(1,1,1),sr=new Y,Gl=new Y,yi=new Y,l0=new Kt,c0=new br;class Mr{constructor(e=0,t=0,n=0,s=Mr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(St(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-St(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(St(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-St(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(St(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-St(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:lt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return l0.makeRotationFromQuaternion(e),this.setFromRotationMatrix(l0,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return c0.setFromEuler(this),this.setFromQuaternion(c0,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mr.DEFAULT_ORDER="XYZ";class Zf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let yw=0;const h0=new Y,wa=new br,Ls=new Kt,Wl=new Y,Io=new Y,Sw=new Y,ww=new br,u0=new Y(1,0,0),d0=new Y(0,1,0),f0=new Y(0,0,1),p0={type:"added"},Ew={type:"removed"},Ea={type:"childadded",child:null},iu={type:"childremoved",child:null};class Rn extends yr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yw++}),this.uuid=gl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rn.DEFAULT_UP.clone();const e=new Y,t=new Mr,n=new br,s=new Y(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Kt},normalMatrix:{value:new ut}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=Rn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wa.setFromAxisAngle(e,t),this.quaternion.multiply(wa),this}rotateOnWorldAxis(e,t){return wa.setFromAxisAngle(e,t),this.quaternion.premultiply(wa),this}rotateX(e){return this.rotateOnAxis(u0,e)}rotateY(e){return this.rotateOnAxis(d0,e)}rotateZ(e){return this.rotateOnAxis(f0,e)}translateOnAxis(e,t){return h0.copy(e).applyQuaternion(this.quaternion),this.position.add(h0.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(u0,e)}translateY(e){return this.translateOnAxis(d0,e)}translateZ(e){return this.translateOnAxis(f0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ls.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Wl.copy(e):Wl.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Io.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ls.lookAt(Io,Wl,this.up):Ls.lookAt(Wl,Io,this.up),this.quaternion.setFromRotationMatrix(Ls),s&&(Ls.extractRotation(s.matrixWorld),wa.setFromRotationMatrix(Ls),this.quaternion.premultiply(wa.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ct("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(p0),Ea.child=e,this.dispatchEvent(Ea),Ea.child=null):Ct("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ew),iu.child=e,this.dispatchEvent(iu),iu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ls.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ls.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ls),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(p0),Ea.child=e,this.dispatchEvent(Ea),Ea.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Io,e,Sw),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Io,ww,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Rn.DEFAULT_UP=new Y(0,1,0);Rn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Xr extends Rn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Tw={type:"move"};class su{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const m of e.hand.values()){const _=t.getJointPose(m,n),g=this._getHandJoint(l,m);_!==null&&(g.matrix.fromArray(_.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=_.radius),g.visible=_!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;l.inputState.pinching&&u>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Tw)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Xr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const ex={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},rr={h:0,s:0,l:0},$l={h:0,s:0,l:0};function ru(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ct{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ai){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Et.workingColorSpace){return this.r=e,this.g=t,this.b=n,Et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Et.workingColorSpace){if(e=dw(e,1),t=St(t,0,1),n=St(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ru(a,r,e+1/3),this.g=ru(a,r,e),this.b=ru(a,r,e-1/3)}return Et.colorSpaceToWorking(this,s),this}setStyle(e,t=ai){function n(r){r!==void 0&&parseFloat(r)<1&&lt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:lt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);lt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ai){const n=ex[e.toLowerCase()];return n!==void 0?this.setHex(n,t):lt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gs(e.r),this.g=Gs(e.g),this.b=Gs(e.b),this}copyLinearToSRGB(e){return this.r=Ja(e.r),this.g=Ja(e.g),this.b=Ja(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ai){return Et.workingToColorSpace(Zn.copy(this),e),Math.round(St(Zn.r*255,0,255))*65536+Math.round(St(Zn.g*255,0,255))*256+Math.round(St(Zn.b*255,0,255))}getHexString(e=ai){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Et.workingColorSpace){Et.workingToColorSpace(Zn.copy(this),t);const n=Zn.r,s=Zn.g,r=Zn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Et.workingColorSpace){return Et.workingToColorSpace(Zn.copy(this),t),e.r=Zn.r,e.g=Zn.g,e.b=Zn.b,e}getStyle(e=ai){Et.workingToColorSpace(Zn.copy(this),e);const t=Zn.r,n=Zn.g,s=Zn.b;return e!==ai?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(rr),this.setHSL(rr.h+e,rr.s+t,rr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(rr),e.getHSL($l);const n=Jh(rr.h,$l.h,t),s=Jh(rr.s,$l.s,t),r=Jh(rr.l,$l.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Zn=new ct;ct.NAMES=ex;class fh{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ct(e),this.near=t,this.far=n}clone(){return new fh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ph extends Rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mr,this.environmentIntensity=1,this.environmentRotation=new Mr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ji=new Y,Ps=new Y,au=new Y,Ds=new Y,Ta=new Y,Aa=new Y,m0=new Y,ou=new Y,lu=new Y,cu=new Y,hu=new ln,uu=new ln,du=new ln;class rs{constructor(e=new Y,t=new Y,n=new Y){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ji.subVectors(e,t),s.cross(ji);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ji.subVectors(s,t),Ps.subVectors(n,t),au.subVectors(e,t);const a=ji.dot(ji),o=ji.dot(Ps),c=ji.dot(au),l=Ps.dot(Ps),h=Ps.dot(au),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,p=(a*h-o*c)*u;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ds)===null?!1:Ds.x>=0&&Ds.y>=0&&Ds.x+Ds.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Ds)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Ds.x),c.addScaledVector(a,Ds.y),c.addScaledVector(o,Ds.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return hu.setScalar(0),uu.setScalar(0),du.setScalar(0),hu.fromBufferAttribute(e,t),uu.fromBufferAttribute(e,n),du.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(hu,r.x),a.addScaledVector(uu,r.y),a.addScaledVector(du,r.z),a}static isFrontFacing(e,t,n,s){return ji.subVectors(n,t),Ps.subVectors(e,t),ji.cross(Ps).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ji.subVectors(this.c,this.b),Ps.subVectors(this.a,this.b),ji.cross(Ps).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rs.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rs.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return rs.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return rs.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rs.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ta.subVectors(s,n),Aa.subVectors(r,n),ou.subVectors(e,n);const c=Ta.dot(ou),l=Aa.dot(ou);if(c<=0&&l<=0)return t.copy(n);lu.subVectors(e,s);const h=Ta.dot(lu),d=Aa.dot(lu);if(h>=0&&d<=h)return t.copy(s);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Ta,a);cu.subVectors(e,r);const f=Ta.dot(cu),p=Aa.dot(cu);if(p>=0&&f<=p)return t.copy(r);const m=f*l-c*p;if(m<=0&&l>=0&&p<=0)return o=l/(l-p),t.copy(n).addScaledVector(Aa,o);const _=h*p-f*d;if(_<=0&&d-h>=0&&f-p>=0)return m0.subVectors(r,s),o=(d-h)/(d-h+(f-p)),t.copy(s).addScaledVector(m0,o);const g=1/(_+m+u);return a=m*g,o=u*g,t.copy(n).addScaledVector(Ta,a).addScaledVector(Aa,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class _l{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ki.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ki.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ki.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ki):Ki.fromBufferAttribute(r,a),Ki.applyMatrix4(e.matrixWorld),this.expandByPoint(Ki);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xl.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xl.copy(n.boundingBox)),Xl.applyMatrix4(e.matrixWorld),this.union(Xl)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ki),Ki.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Uo),ql.subVectors(this.max,Uo),Ra.subVectors(e.a,Uo),Ca.subVectors(e.b,Uo),La.subVectors(e.c,Uo),ar.subVectors(Ca,Ra),or.subVectors(La,Ca),Dr.subVectors(Ra,La);let t=[0,-ar.z,ar.y,0,-or.z,or.y,0,-Dr.z,Dr.y,ar.z,0,-ar.x,or.z,0,-or.x,Dr.z,0,-Dr.x,-ar.y,ar.x,0,-or.y,or.x,0,-Dr.y,Dr.x,0];return!fu(t,Ra,Ca,La,ql)||(t=[1,0,0,0,1,0,0,0,1],!fu(t,Ra,Ca,La,ql))?!1:(Yl.crossVectors(ar,or),t=[Yl.x,Yl.y,Yl.z],fu(t,Ra,Ca,La,ql))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ki).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ki).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ks[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ks[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ks[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ks[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ks[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ks[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ks[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ks[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ks),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ks=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],Ki=new Y,Xl=new _l,Ra=new Y,Ca=new Y,La=new Y,ar=new Y,or=new Y,Dr=new Y,Uo=new Y,ql=new Y,Yl=new Y,kr=new Y;function fu(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){kr.fromArray(i,r);const o=s.x*Math.abs(kr.x)+s.y*Math.abs(kr.y)+s.z*Math.abs(kr.z),c=e.dot(kr),l=t.dot(kr),h=n.dot(kr);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const vn=new Y,jl=new Je;let Aw=0;class Gn extends yr{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Aw++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ow,this.updateRanges=[],this.gpuType=ys,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)jl.fromBufferAttribute(this,t),jl.applyMatrix3(e),this.setXY(t,jl.x,jl.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.applyMatrix3(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.applyMatrix4(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.applyNormalMatrix(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)vn.fromBufferAttribute(this,t),vn.transformDirection(e),this.setXYZ(t,vn.x,vn.y,vn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=No(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=di(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=No(t,this.array)),t}setX(e,t){return this.normalized&&(t=di(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=No(t,this.array)),t}setY(e,t){return this.normalized&&(t=di(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=No(t,this.array)),t}setZ(e,t){return this.normalized&&(t=di(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=No(t,this.array)),t}setW(e,t){return this.normalized&&(t=di(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=di(t,this.array),n=di(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=di(t,this.array),n=di(n,this.array),s=di(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=di(t,this.array),n=di(n,this.array),s=di(s,this.array),r=di(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class tx extends Gn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class nx extends Gn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class rn extends Gn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Rw=new _l,Fo=new Y,pu=new Y;class xl{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Rw.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Fo.subVectors(e,this.center);const t=Fo.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Fo,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(pu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Fo.copy(e.center).add(pu)),this.expandByPoint(Fo.copy(e.center).sub(pu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Cw=0;const Ii=new Kt,mu=new Rn,Pa=new Y,Si=new _l,Oo=new _l,On=new Y;class pn extends yr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cw++}),this.uuid=gl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(lw(e)?nx:tx)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ut().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ii.makeRotationFromQuaternion(e),this.applyMatrix4(Ii),this}rotateX(e){return Ii.makeRotationX(e),this.applyMatrix4(Ii),this}rotateY(e){return Ii.makeRotationY(e),this.applyMatrix4(Ii),this}rotateZ(e){return Ii.makeRotationZ(e),this.applyMatrix4(Ii),this}translate(e,t,n){return Ii.makeTranslation(e,t,n),this.applyMatrix4(Ii),this}scale(e,t,n){return Ii.makeScale(e,t,n),this.applyMatrix4(Ii),this}lookAt(e){return mu.lookAt(e),mu.updateMatrix(),this.applyMatrix4(mu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pa).negate(),this.translate(Pa.x,Pa.y,Pa.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new rn(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&lt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _l);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ct("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Si.setFromBufferAttribute(r),this.morphTargetsRelative?(On.addVectors(this.boundingBox.min,Si.min),this.boundingBox.expandByPoint(On),On.addVectors(this.boundingBox.max,Si.max),this.boundingBox.expandByPoint(On)):(this.boundingBox.expandByPoint(Si.min),this.boundingBox.expandByPoint(Si.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ct('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ct("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const n=this.boundingSphere.center;if(Si.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Oo.setFromBufferAttribute(o),this.morphTargetsRelative?(On.addVectors(Si.min,Oo.min),Si.expandByPoint(On),On.addVectors(Si.max,Oo.max),Si.expandByPoint(On)):(Si.expandByPoint(Oo.min),Si.expandByPoint(Oo.max))}Si.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)On.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(On));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)On.fromBufferAttribute(o,l),c&&(Pa.fromBufferAttribute(e,l),On.add(Pa)),s=Math.max(s,n.distanceToSquared(On))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ct('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ct("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Gn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let v=0;v<n.count;v++)o[v]=new Y,c[v]=new Y;const l=new Y,h=new Y,d=new Y,u=new Je,f=new Je,p=new Je,m=new Y,_=new Y;function g(v,E,P){l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,P),u.fromBufferAttribute(r,v),f.fromBufferAttribute(r,E),p.fromBufferAttribute(r,P),h.sub(l),d.sub(l),f.sub(u),p.sub(u);const D=1/(f.x*p.y-p.x*f.y);isFinite(D)&&(m.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(D),_.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(D),o[v].add(m),o[E].add(m),o[P].add(m),c[v].add(_),c[E].add(_),c[P].add(_))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let v=0,E=x.length;v<E;++v){const P=x[v],D=P.start,L=P.count;for(let k=D,U=D+L;k<U;k+=3)g(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const T=new Y,b=new Y,S=new Y,M=new Y;function A(v){S.fromBufferAttribute(s,v),M.copy(S);const E=o[v];T.copy(E),T.sub(S.multiplyScalar(S.dot(E))).normalize(),b.crossVectors(M,E);const D=b.dot(c[v])<0?-1:1;a.setXYZW(v,T.x,T.y,T.z,D)}for(let v=0,E=x.length;v<E;++v){const P=x[v],D=P.start,L=P.count;for(let k=D,U=D+L;k<U;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Gn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new Y,r=new Y,a=new Y,o=new Y,c=new Y,l=new Y,h=new Y,d=new Y;if(e)for(let u=0,f=e.count;u<f;u+=3){const p=e.getX(u+0),m=e.getX(u+1),_=e.getX(u+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,m),a.fromBufferAttribute(t,_),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),l.fromBufferAttribute(n,_),o.add(h),c.add(h),l.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(m,c.x,c.y,c.z),n.setXYZ(_,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)On.fromBufferAttribute(e,t),On.normalize(),e.setXYZ(t,On.x,On.y,On.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,p=0;for(let m=0,_=c.length;m<_;m++){o.isInterleavedBufferAttribute?f=c[m]*o.data.stride+o.offset:f=c[m]*h;for(let g=0;g<h;g++)u[p++]=l[f++]}return new Gn(u,h,d)}if(this.index===null)return lt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new pn,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const gu=new Y,Lw=new Y,Pw=new ut;class Fs{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=gu.subVectors(n,t).cross(Lw.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(gu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Pw.getNormalMatrix(e),s=this.coplanarPoint(gu).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Dw=0;class oa extends yr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dw++}),this.uuid=gl(),this.name="",this.type="Material",this.blending=jr,this.side=na,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=H_,this.blendDst=V_,this.blendEquation=Ha,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ct(0,0,0),this.blendAlpha=0,this.depthFunc=al,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ew,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zh,this.stencilZFail=Zh,this.stencilZPass=Zh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){lt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){lt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ct().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Fs().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Je().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Je().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ns=new Y,_u=new Y,Kl=new Y,Zl=new Y;class vl{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ns)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ns.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ns.copy(this.origin).addScaledVector(this.direction,t),Ns.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){_u.copy(e).add(t).multiplyScalar(.5),Kl.copy(t).sub(e).normalize(),Zl.copy(this.origin).sub(_u);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Kl),o=Zl.dot(this.direction),c=-Zl.dot(Kl),l=Zl.lengthSq(),h=Math.abs(1-a*a);let d,u,f,p;if(h>0)if(d=a*c-o,u=a*o-c,p=r*h,d>=0)if(u>=-p)if(u<=p){const m=1/h;d*=m,u*=m,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=p?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(_u).addScaledVector(Kl,u),f}intersectSphere(e,t){if(e.radius<0)return null;Ns.subVectors(e.center,this.origin);const n=Ns.dot(this.direction),s=Ns.dot(Ns)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ns)!==null}intersectTriangle(e,t,n,s,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,_=t.z-a.z,g=n.x-a.x,x=n.y-a.y,T=n.z-a.z,b=Math.abs(c),S=Math.abs(l),M=Math.abs(h);let A,v,E,P,D,L,k,U,O,X,z,re;if(b>=S&&b>=M?(E=c,L=d,O=p,re=g,c>=0?(A=l,v=h,P=u,D=f,k=m,U=_,X=x,z=T):(A=h,v=l,P=f,D=u,k=_,U=m,X=T,z=x)):S>=M?(E=l,L=u,O=m,re=x,l>=0?(A=h,v=c,P=f,D=d,k=_,U=p,X=T,z=g):(A=c,v=h,P=d,D=f,k=p,U=_,X=g,z=T)):(E=h,L=f,O=_,re=T,h>=0?(A=c,v=l,P=d,D=u,k=p,U=m,X=g,z=x):(A=l,v=c,P=u,D=d,k=m,U=p,X=x,z=g)),E===0)return null;const q=A/E,te=v/E,H=1/E,J=P-q*L,se=D-te*L,Qe=k-q*O,it=U-te*O,Xe=X-q*re,Z=z-te*re,he=Xe*it-Z*Qe,Ee=J*Z-se*Xe,Ue=Qe*se-it*J;if(s){if(he<0||Ee<0||Ue<0)return null}else if((he<0||Ee<0||Ue<0)&&(he>0||Ee>0||Ue>0))return null;const Te=he+Ee+Ue;if(Te===0)return null;const ue=H*(he*L+Ee*O+Ue*re);return(Te>0?ue<0:ue>0)?null:this.at(ue/Te,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class mh extends oa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mr,this.combine=G_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const g0=new Kt,Nr=new vl,Jl=new xl,_0=new Y,Ql=new Y,ec=new Y,tc=new Y,xu=new Y,nc=new Y,x0=new Y,ic=new Y;class hi extends Rn{constructor(e=new pn,t=new mh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){nc.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(xu.fromBufferAttribute(d,e),a?nc.addScaledVector(xu,h):nc.addScaledVector(xu.sub(t),h))}t.add(nc)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Jl.copy(n.boundingSphere),Jl.applyMatrix4(r),Nr.copy(e.ray).recast(e.near),!(Jl.containsPoint(Nr.origin)===!1&&(Nr.intersectSphere(Jl,_0)===null||Nr.origin.distanceToSquared(_0)>(e.far-e.near)**2))&&(g0.copy(r).invert(),Nr.copy(e.ray).applyMatrix4(g0),!(n.boundingBox!==null&&Nr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Nr)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,m=u.length;p<m;p++){const _=u[p],g=a[_.materialIndex],x=Math.max(_.start,f.start),T=Math.min(o.count,Math.min(_.start+_.count,f.start+f.count));for(let b=x,S=T;b<S;b+=3){const M=o.getX(b),A=o.getX(b+1),v=o.getX(b+2);s=sc(this,g,e,n,l,h,d,M,A,v),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=_.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),m=Math.min(o.count,f.start+f.count);for(let _=p,g=m;_<g;_+=3){const x=o.getX(_),T=o.getX(_+1),b=o.getX(_+2);s=sc(this,a,e,n,l,h,d,x,T,b),s&&(s.faceIndex=Math.floor(_/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,m=u.length;p<m;p++){const _=u[p],g=a[_.materialIndex],x=Math.max(_.start,f.start),T=Math.min(c.count,Math.min(_.start+_.count,f.start+f.count));for(let b=x,S=T;b<S;b+=3){const M=b,A=b+1,v=b+2;s=sc(this,g,e,n,l,h,d,M,A,v),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=_.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),m=Math.min(c.count,f.start+f.count);for(let _=p,g=m;_<g;_+=3){const x=_,T=_+1,b=_+2;s=sc(this,a,e,n,l,h,d,x,T,b),s&&(s.faceIndex=Math.floor(_/3),t.push(s))}}}}function kw(i,e,t,n,s,r,a,o){let c;if(e.side===mi?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===na,o),c===null)return null;ic.copy(o),ic.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(ic);return l<t.near||l>t.far?null:{distance:l,point:ic.clone(),object:i}}function sc(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Ql),i.getVertexPosition(c,ec),i.getVertexPosition(l,tc);const h=kw(i,e,t,n,Ql,ec,tc,x0);if(h){const d=new Y;rs.getBarycoord(x0,Ql,ec,tc,d),s&&(h.uv=rs.getInterpolatedAttribute(s,o,c,l,d,new Je)),r&&(h.uv1=rs.getInterpolatedAttribute(r,o,c,l,d,new Je)),a&&(h.normal=rs.getInterpolatedAttribute(a,o,c,l,d,new Y),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new Y,materialIndex:0};rs.getNormal(Ql,ec,tc,u.normal),h.face=u,h.barycoord=d}return h}class Nw extends Yn{constructor(e=null,t=1,n=1,s,r,a,o,c,l=Xn,h=Xn,d,u){super(null,a,o,c,l,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ir=new xl,Iw=new Je(.5,.5),rc=new Y;class Jf{constructor(e=new Fs,t=new Fs,n=new Fs,s=new Fs,r=new Fs,a=new Fs){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ss,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],m=r[9],_=r[10],g=r[11],x=r[12],T=r[13],b=r[14],S=r[15];if(s[0].setComponents(l-a,f-h,g-p,S-x).normalize(),s[1].setComponents(l+a,f+h,g+p,S+x).normalize(),s[2].setComponents(l+o,f+d,g+m,S+T).normalize(),s[3].setComponents(l-o,f-d,g-m,S-T).normalize(),n)s[4].setComponents(c,u,_,b).normalize(),s[5].setComponents(l-c,f-u,g-_,S-b).normalize();else if(s[4].setComponents(l-c,f-u,g-_,S-b).normalize(),t===Ss)s[5].setComponents(l+c,f+u,g+_,S+b).normalize();else if(t===cl)s[5].setComponents(c,u,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ir.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ir.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ir)}intersectsSprite(e){Ir.center.set(0,0,0);const t=Iw.distanceTo(e.center);return Ir.radius=.7071067811865476+t,Ir.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ir)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(rc.x=s.normal.x>0?e.max.x:e.min.x,rc.y=s.normal.y>0?e.max.y:e.min.y,rc.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(rc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class el extends oa{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ct(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const jc=new Y,Kc=new Y,v0=new Kt,Bo=new vl,ac=new xl,vu=new Y,b0=new Y;class ix extends Rn{constructor(e=new pn,t=new el){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)jc.fromBufferAttribute(t,s-1),Kc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=jc.distanceTo(Kc);e.setAttribute("lineDistance",new rn(n,1))}else lt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ac.copy(n.boundingSphere),ac.applyMatrix4(s),ac.radius+=r,e.ray.intersectsSphere(ac)===!1)return;v0.copy(s).invert(),Bo.copy(e.ray).applyMatrix4(v0);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let m=f,_=p-1;m<_;m+=l){const g=h.getX(m),x=h.getX(m+1),T=oc(this,e,Bo,c,g,x,m);T&&t.push(T)}if(this.isLineLoop){const m=h.getX(p-1),_=h.getX(f),g=oc(this,e,Bo,c,m,_,p-1);g&&t.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let m=f,_=p-1;m<_;m+=l){const g=oc(this,e,Bo,c,m,m+1,m);g&&t.push(g)}if(this.isLineLoop){const m=oc(this,e,Bo,c,p-1,f,p-1);m&&t.push(m)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function oc(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(jc.fromBufferAttribute(o,s),Kc.fromBufferAttribute(o,r),t.distanceSqToSegment(jc,Kc,vu,b0)>n)return;vu.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(vu);if(!(l<e.near||l>e.far))return{distance:l,point:b0.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const M0=new Y,y0=new Y;class Hd extends ix{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)M0.fromBufferAttribute(t,s),y0.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+M0.distanceTo(y0);e.setAttribute("lineDistance",new rn(n,1))}else lt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Zc extends oa{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ct(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const S0=new Kt,Vd=new vl,lc=new xl,cc=new Y;class Jc extends Rn{constructor(e=new pn,t=new Zc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),lc.copy(n.boundingSphere),lc.applyMatrix4(s),lc.radius+=r,e.ray.intersectsSphere(lc)===!1)return;S0.copy(s).invert(),Vd.copy(e.ray).applyMatrix4(S0);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=u,m=f;p<m;p++){const _=l.getX(p);cc.fromBufferAttribute(d,_),w0(cc,_,c,s,e,t,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,m=f;p<m;p++)cc.fromBufferAttribute(d,p),w0(cc,p,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function w0(i,e,t,n,s,r,a){const o=Vd.distanceSqToPoint(i);if(o<t){const c=new Y;Vd.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class sx extends Yn{constructor(e=[],t=ia,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rx extends Yn{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class hl extends Yn{constructor(e,t,n=As,s,r,a,o=Xn,c=Xn,l,h=$s,d=1){if(h!==$s&&h!==$r)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Kf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Uw extends hl{constructor(e,t=As,n=ia,s,r,a=Xn,o=Xn,c,l=$s){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ax extends Yn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class bl extends pn{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,s,a,2),p("x","z","y",1,-1,e,n,-t,s,a,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new rn(l,3)),this.setAttribute("normal",new rn(h,3)),this.setAttribute("uv",new rn(d,2));function p(m,_,g,x,T,b,S,M,A,v,E){const P=b/A,D=S/v,L=b/2,k=S/2,U=M/2,O=A+1,X=v+1;let z=0,re=0;const q=new Y;for(let te=0;te<X;te++){const H=te*D-k;for(let J=0;J<O;J++){const se=J*P-L;q[m]=se*x,q[_]=H*T,q[g]=U,l.push(q.x,q.y,q.z),q[m]=0,q[_]=0,q[g]=M>0?1:-1,h.push(q.x,q.y,q.z),d.push(J/A),d.push(1-te/v),z+=1}}for(let te=0;te<v;te++)for(let H=0;H<A;H++){const J=u+H+O*te,se=u+H+O*(te+1),Qe=u+(H+1)+O*(te+1),it=u+(H+1)+O*te;c.push(J,se,it),c.push(se,Qe,it),re+=6}o.addGroup(f,re,E),f+=re,u+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Qf extends pn{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const m=[],_=n/2;let g=0;x(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new rn(d,3)),this.setAttribute("normal",new rn(u,3)),this.setAttribute("uv",new rn(f,2));function x(){const b=new Y,S=new Y;let M=0;const A=(t-e)/n;for(let v=0;v<=r;v++){const E=[],P=v/r,D=P*(t-e)+e;for(let L=0;L<=s;L++){const k=L/s,U=k*c+o,O=Math.sin(U),X=Math.cos(U);S.x=D*O,S.y=-P*n+_,S.z=D*X,d.push(S.x,S.y,S.z),b.set(O,A,X).normalize(),u.push(b.x,b.y,b.z),f.push(k,1-P),E.push(p++)}m.push(E)}for(let v=0;v<s;v++)for(let E=0;E<r;E++){const P=m[E][v],D=m[E+1][v],L=m[E+1][v+1],k=m[E][v+1];(e>0||E!==0)&&(h.push(P,D,k),M+=3),(t>0||E!==r-1)&&(h.push(D,L,k),M+=3)}l.addGroup(g,M,0),g+=M}function T(b){const S=p,M=new Je,A=new Y;let v=0;const E=b===!0?e:t,P=b===!0?1:-1;for(let L=1;L<=s;L++)d.push(0,_*P,0),u.push(0,P,0),f.push(.5,.5),p++;const D=p;for(let L=0;L<=s;L++){const U=L/s*c+o,O=Math.cos(U),X=Math.sin(U);A.x=E*X,A.y=_*P,A.z=E*O,d.push(A.x,A.y,A.z),u.push(0,P,0),M.x=O*.5+.5,M.y=X*.5*P+.5,f.push(M.x,M.y),p++}for(let L=0;L<s;L++){const k=S+L,U=D+L;b===!0?h.push(U,U+1,k):h.push(U+1,U,k),v+=3}l.addGroup(g,v,b===!0?1:2),g+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qf(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class xo extends pn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,d=e/o,u=t/c,f=[],p=[],m=[],_=[];for(let g=0;g<h;g++){const x=g*u-a;for(let T=0;T<l;T++){const b=T*d-r;p.push(b,-x,0),m.push(0,0,1),_.push(T/o),_.push(1-g/c)}}for(let g=0;g<c;g++)for(let x=0;x<o;x++){const T=x+l*g,b=x+l*(g+1),S=x+1+l*(g+1),M=x+1+l*g;f.push(T,b,M),f.push(b,S,M)}this.setIndex(f),this.setAttribute("position",new rn(p,3)),this.setAttribute("normal",new rn(m,3)),this.setAttribute("uv",new rn(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xo(e.width,e.height,e.widthSegments,e.heightSegments)}}class ep extends pn{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new Y,u=new Y,f=[],p=[],m=[],_=[];for(let g=0;g<=n;g++){const x=[],T=g/n,b=a+T*o,S=e*Math.cos(b),M=Math.sqrt(e*e-S*S);let A=0;g===0&&a===0?A=.5/t:g===n&&c===Math.PI&&(A=-.5/t);for(let v=0;v<=t;v++){const E=v/t,P=s+E*r;d.x=-M*Math.cos(P),d.y=S,d.z=M*Math.sin(P),p.push(d.x,d.y,d.z),u.copy(d).normalize(),m.push(u.x,u.y,u.z),_.push(E+A,1-T),x.push(l++)}h.push(x)}for(let g=0;g<n;g++)for(let x=0;x<t;x++){const T=h[g][x+1],b=h[g][x],S=h[g+1][x],M=h[g+1][x+1];(g!==0||a>0)&&f.push(T,b,M),(g!==n-1||c<Math.PI)&&f.push(b,S,M)}this.setIndex(f),this.setAttribute("position",new rn(p,3)),this.setAttribute("normal",new rn(m,3)),this.setAttribute("uv",new rn(_,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ep(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function co(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(E0(s))s.isRenderTargetTexture?(lt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(E0(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function ri(i){const e={};for(let t=0;t<i.length;t++){const n=co(i[t]);for(const s in n)e[s]=n[s]}return e}function E0(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Fw(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ox(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Et.workingColorSpace}const tp={clone:co,merge:ri};var Ow=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bw=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Pi extends oa{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ow,this.fragmentShader=Bw,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=co(e.uniforms),this.uniformsGroups=Fw(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new ct().setHex(s.value);break;case"v2":this.uniforms[n].value=new Je().fromArray(s.value);break;case"v3":this.uniforms[n].value=new Y().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ln().fromArray(s.value);break;case"m3":this.uniforms[n].value=new ut().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Kt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class lx extends Pi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class bu extends oa{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ct(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bd,this.normalScale=new Je(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class zw extends oa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=JS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Hw extends oa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class cx extends Rn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ct(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Vw extends cx{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Rn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ct(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Mu=new Kt,T0=new Y,A0=new Y;class Gw{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Je(512,512),this.mapType=Ai,this.map=null,this.mapPass=null,this.matrix=new Kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jf,this._frameExtents=new Je(1,1),this._viewportCount=1,this._viewports=[new ln(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;T0.setFromMatrixPosition(e.matrixWorld),t.position.copy(T0),A0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(A0),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Mu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Mu,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===cl||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(Mu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const hc=new Y,uc=new br,xs=new Y;class hx extends Rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=Ss,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(hc,uc,xs),xs.x===1&&xs.y===1&&xs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(hc,uc,xs.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(hc,uc,xs),xs.x===1&&xs.y===1&&xs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(hc,uc,xs.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const lr=new Y,R0=new Je,C0=new Je;class li extends hx{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=zd*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Cc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zd*2*Math.atan(Math.tan(Cc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){lr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(lr.x,lr.y).multiplyScalar(-e/lr.z),lr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(lr.x,lr.y).multiplyScalar(-e/lr.z)}getViewSize(e,t){return this.getViewBounds(e,R0,C0),t.subVectors(C0,R0)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Cc*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class gh extends hx{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Ww extends Gw{constructor(){super(new gh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $w extends cx{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rn.DEFAULT_UP),this.updateMatrix(),this.target=new Rn,this.shadow=new Ww}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Da=-90,ka=1;class Xw extends Rn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new li(Da,ka,e,t);s.layers=this.layers,this.add(s);const r=new li(Da,ka,e,t);r.layers=this.layers,this.add(r);const a=new li(Da,ka,e,t);a.layers=this.layers,this.add(a);const o=new li(Da,ka,e,t);o.layers=this.layers,this.add(o);const c=new li(Da,ka,e,t);c.layers=this.layers,this.add(c);const l=new li(Da,ka,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Ss)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===cl)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let _=!1;e.isWebGLRenderer===!0?_=e.state.buffers.depth.getReversed():_=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,s),_&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class qw extends li{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Yw{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=jw.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function jw(){this._document.hidden===!1&&this.reset()}const L0=new Kt;class Kw{constructor(e,t,n=0,s=1/0){this.ray=new vl(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Zf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ct("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return L0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(L0),this}intersectObject(e,t=!0,n=[]){return Gd(e,this,n,t),n.sort(P0),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Gd(e[s],this,n,t);return n.sort(P0),n}}function P0(i,e){return i.distance-e.distance}function Gd(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Gd(r[a],e,t,!0)}}class D0{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=St(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(St(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class ux{static{ux.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}}class dx extends Hd{constructor(e=10,t=10,n=4473924,s=8947848){n=new ct(n),s=new ct(s);const r=t/2,a=e/t,o=e/2,c=[],l=[];for(let u=0,f=0,p=-o;u<=t;u++,p+=a){c.push(-o,0,p,o,0,p),c.push(p,0,-o,p,0,o);const m=u===r?n:s;m.toArray(l,f),f+=3,m.toArray(l,f),f+=3,m.toArray(l,f),f+=3,m.toArray(l,f),f+=3}const h=new pn;h.setAttribute("position",new rn(c,3)),h.setAttribute("color",new rn(l,3));const d=new el({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class Zw extends yr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function k0(i,e,t,n){const s=Jw(n);switch(t){case j_:return i*e;case Z_:return i*e/s.components*s.byteLength;case $f:return i*e/s.components*s.byteLength;case sa:return i*e*2/s.components*s.byteLength;case Xf:return i*e*2/s.components*s.byteLength;case K_:return i*e*3/s.components*s.byteLength;case os:return i*e*4/s.components*s.byteLength;case qf:return i*e*4/s.components*s.byteLength;case Ec:case Tc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ac:case Rc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case hd:case dd:return Math.max(i,16)*Math.max(e,8)/4;case cd:case ud:return Math.max(i,8)*Math.max(e,8)/2;case fd:case pd:case gd:case _d:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case md:case Wc:case xd:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case vd:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case bd:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Md:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case yd:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Sd:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case wd:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ed:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Td:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ad:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Rd:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Cd:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ld:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Pd:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Dd:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case kd:case Nd:case Id:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ud:case Fd:return Math.ceil(i/4)*Math.ceil(e/4)*8;case $c:case Od:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Jw(i){switch(i){case Ai:case $_:return{byteLength:1,components:1};case ol:case X_:case ls:return{byteLength:2,components:1};case Gf:case Wf:return{byteLength:2,components:4};case As:case Vf:case ys:return{byteLength:4,components:1};case q_:case Y_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Nf}}));typeof window<"u"&&(window.__THREE__?lt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Nf);function fx(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Qw(i){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],m=d[f];m.start<=p.start+p.count+1?p.count=Math.max(p.count,m.start+m.count-p.start):(++u,d[u]=m)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const m=d[f];i.bufferSubData(l,m.start*h.BYTES_PER_ELEMENT,h,m.start,m.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var eE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,nE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,iE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,oE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lE=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,cE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,dE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,fE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,pE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,mE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,gE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_E=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,vE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,bE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ME=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,yE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,SE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,wE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,EE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,TE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,AE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,RE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,CE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,LE="gl_FragColor = linearToOutputTexel( gl_FragColor );",PE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,DE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,kE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,NE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,IE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,UE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,FE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,OE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,BE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,zE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,HE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,VE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,GE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,WE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$E=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,XE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,qE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,YE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,KE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ZE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,JE=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,QE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,eT=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,tT=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nT=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,iT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,aT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,oT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,hT=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,pT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gT=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_T=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,vT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,bT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,MT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ST=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ET=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,TT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,AT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,RT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,CT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,LT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,PT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,DT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,NT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,IT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,UT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,FT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,OT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,BT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,zT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,HT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,VT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,GT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,WT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$T=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,XT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,YT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,jT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,KT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ZT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,JT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,QT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,aA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,oA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,lA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,cA=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,hA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,uA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dA=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fA=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,mA=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gA=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_A=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xA=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,vA=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bA=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,MA=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yA=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,SA=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wA=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,EA=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,TA=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,AA=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RA=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,CA=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,LA=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,PA=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,DA=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kA=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vt={alphahash_fragment:eE,alphahash_pars_fragment:tE,alphamap_fragment:nE,alphamap_pars_fragment:iE,alphatest_fragment:sE,alphatest_pars_fragment:rE,aomap_fragment:aE,aomap_pars_fragment:oE,batching_pars_vertex:lE,batching_vertex:cE,begin_vertex:hE,beginnormal_vertex:uE,bsdfs:dE,iridescence_fragment:fE,bumpmap_pars_fragment:pE,clipping_planes_fragment:mE,clipping_planes_pars_fragment:gE,clipping_planes_pars_vertex:_E,clipping_planes_vertex:xE,color_fragment:vE,color_pars_fragment:bE,color_pars_vertex:ME,color_vertex:yE,common:SE,cube_uv_reflection_fragment:wE,defaultnormal_vertex:EE,displacementmap_pars_vertex:TE,displacementmap_vertex:AE,emissivemap_fragment:RE,emissivemap_pars_fragment:CE,colorspace_fragment:LE,colorspace_pars_fragment:PE,envmap_fragment:DE,envmap_common_pars_fragment:kE,envmap_pars_fragment:NE,envmap_pars_vertex:IE,envmap_physical_pars_fragment:XE,envmap_vertex:UE,fog_vertex:FE,fog_pars_vertex:OE,fog_fragment:BE,fog_pars_fragment:zE,gradientmap_pars_fragment:HE,lightmap_pars_fragment:VE,lights_lambert_fragment:GE,lights_lambert_pars_fragment:WE,lights_pars_begin:$E,lights_toon_fragment:qE,lights_toon_pars_fragment:YE,lights_phong_fragment:jE,lights_phong_pars_fragment:KE,lights_physical_fragment:ZE,lights_physical_pars_fragment:JE,lights_fragment_begin:QE,lights_fragment_maps:eT,lights_fragment_end:tT,lightprobes_pars_fragment:nT,logdepthbuf_fragment:iT,logdepthbuf_pars_fragment:sT,logdepthbuf_pars_vertex:rT,logdepthbuf_vertex:aT,map_fragment:oT,map_pars_fragment:lT,map_particle_fragment:cT,map_particle_pars_fragment:hT,metalnessmap_fragment:uT,metalnessmap_pars_fragment:dT,morphinstance_vertex:fT,morphcolor_vertex:pT,morphnormal_vertex:mT,morphtarget_pars_vertex:gT,morphtarget_vertex:_T,normal_fragment_begin:xT,normal_fragment_maps:vT,normal_pars_fragment:bT,normal_pars_vertex:MT,normal_vertex:yT,normalmap_pars_fragment:ST,clearcoat_normal_fragment_begin:wT,clearcoat_normal_fragment_maps:ET,clearcoat_pars_fragment:TT,iridescence_pars_fragment:AT,opaque_fragment:RT,packing:CT,premultiplied_alpha_fragment:LT,project_vertex:PT,dithering_fragment:DT,dithering_pars_fragment:kT,roughnessmap_fragment:NT,roughnessmap_pars_fragment:IT,shadowmap_pars_fragment:UT,shadowmap_pars_vertex:FT,shadowmap_vertex:OT,shadowmask_pars_fragment:BT,skinbase_vertex:zT,skinning_pars_vertex:HT,skinning_vertex:VT,skinnormal_vertex:GT,specularmap_fragment:WT,specularmap_pars_fragment:$T,tonemapping_fragment:XT,tonemapping_pars_fragment:qT,transmission_fragment:YT,transmission_pars_fragment:jT,uv_pars_fragment:KT,uv_pars_vertex:ZT,uv_vertex:JT,worldpos_vertex:QT,background_vert:eA,background_frag:tA,backgroundCube_vert:nA,backgroundCube_frag:iA,cube_vert:sA,cube_frag:rA,depth_vert:aA,depth_frag:oA,distance_vert:lA,distance_frag:cA,equirect_vert:hA,equirect_frag:uA,linedashed_vert:dA,linedashed_frag:fA,meshbasic_vert:pA,meshbasic_frag:mA,meshlambert_vert:gA,meshlambert_frag:_A,meshmatcap_vert:xA,meshmatcap_frag:vA,meshnormal_vert:bA,meshnormal_frag:MA,meshphong_vert:yA,meshphong_frag:SA,meshphysical_vert:wA,meshphysical_frag:EA,meshtoon_vert:TA,meshtoon_frag:AA,points_vert:RA,points_frag:CA,shadow_vert:LA,shadow_frag:PA,sprite_vert:DA,sprite_frag:kA},ke={common:{diffuse:{value:new ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ut}},envmap:{envMap:{value:null},envMapRotation:{value:new ut},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ut},normalScale:{value:new Je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Y},probesMax:{value:new Y},probesResolution:{value:new Y}},points:{diffuse:{value:new ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0},uvTransform:{value:new ut}},sprite:{diffuse:{value:new ct(16777215)},opacity:{value:1},center:{value:new Je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ut},alphaMap:{value:null},alphaMapTransform:{value:new ut},alphaTest:{value:0}}},Ms={basic:{uniforms:ri([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:ri([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new ct(0)},envMapIntensity:{value:1}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:ri([ke.common,ke.specularmap,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,ke.lights,{emissive:{value:new ct(0)},specular:{value:new ct(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:ri([ke.common,ke.envmap,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.roughnessmap,ke.metalnessmap,ke.fog,ke.lights,{emissive:{value:new ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:ri([ke.common,ke.aomap,ke.lightmap,ke.emissivemap,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.gradientmap,ke.fog,ke.lights,{emissive:{value:new ct(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:ri([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,ke.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:ri([ke.points,ke.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:ri([ke.common,ke.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:ri([ke.common,ke.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:ri([ke.common,ke.bumpmap,ke.normalmap,ke.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:ri([ke.sprite,ke.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ut}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distance:{uniforms:ri([ke.common,ke.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distance_vert,fragmentShader:vt.distance_frag},shadow:{uniforms:ri([ke.lights,ke.fog,{color:{value:new ct(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};Ms.physical={uniforms:ri([Ms.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ut},clearcoatNormalScale:{value:new Je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ut},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ut},sheen:{value:0},sheenColor:{value:new ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ut},transmissionSamplerSize:{value:new Je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ut},attenuationDistance:{value:0},attenuationColor:{value:new ct(0)},specularColor:{value:new ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ut},anisotropyVector:{value:new Je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ut}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const dc={r:0,b:0,g:0},NA=new Kt,px=new ut;px.set(-1,0,0,0,1,0,0,0,1);function IA(i,e,t,n,s,r){const a=new ct(0);let o=s===!0?0:1,c,l,h=null,d=0,u=null;function f(x){let T=x.isScene===!0?x.background:null;if(T&&T.isTexture){const b=x.backgroundBlurriness>0;T=e.get(T,b)}return T}function p(x){let T=!1;const b=f(x);b===null?_(a,o):b&&b.isColor&&(_(b,1),T=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,T){const b=f(T);b&&(b.isCubeTexture||b.mapping===dh)?(l===void 0&&(l=new hi(new bl(1,1,1),new Pi({name:"BackgroundCubeMaterial",uniforms:co(Ms.backgroundCube.uniforms),vertexShader:Ms.backgroundCube.vertexShader,fragmentShader:Ms.backgroundCube.fragmentShader,side:mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(S,M,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=b,l.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(NA.makeRotationFromEuler(T.backgroundRotation)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(px),l.material.toneMapped=Et.getTransfer(b.colorSpace)!==zt,(h!==b||d!==b.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=b,d=b.version,u=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new hi(new xo(2,2),new Pi({name:"BackgroundMaterial",uniforms:co(Ms.background.uniforms),vertexShader:Ms.background.vertexShader,fragmentShader:Ms.background.fragmentShader,side:na,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.toneMapped=Et.getTransfer(b.colorSpace)!==zt,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||d!==b.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=b,d=b.version,u=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function _(x,T){x.getRGB(dc,ox(i)),t.buffers.color.setClear(dc.r,dc.g,dc.b,T,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,T=1){a.set(x),o=T,_(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,_(a,o)},render:p,addToRenderList:m,dispose:g}}function UA(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(D,L,k,U,O){let X=!1;const z=d(D,U,k,L);r!==z&&(r=z,l(r.object)),X=f(D,U,k,O),X&&p(D,U,k,O),O!==null&&e.update(O,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,b(D,L,k,U),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function c(){return i.createVertexArray()}function l(D){return i.bindVertexArray(D)}function h(D){return i.deleteVertexArray(D)}function d(D,L,k,U){const O=U.wireframe===!0;let X=n[L.id];X===void 0&&(X={},n[L.id]=X);const z=D.isInstancedMesh===!0?D.id:0;let re=X[z];re===void 0&&(re={},X[z]=re);let q=re[k.id];q===void 0&&(q={},re[k.id]=q);let te=q[O];return te===void 0&&(te=u(c()),q[O]=te),te}function u(D){const L=[],k=[],U=[];for(let O=0;O<t;O++)L[O]=0,k[O]=0,U[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:k,attributeDivisors:U,object:D,attributes:{},index:null}}function f(D,L,k,U){const O=r.attributes,X=L.attributes;let z=0;const re=k.getAttributes();for(const q in re)if(re[q].location>=0){const H=O[q];let J=X[q];if(J===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(J=D.instanceColor)),H===void 0||H.attribute!==J||J&&H.data!==J.data)return!0;z++}return r.attributesNum!==z||r.index!==U}function p(D,L,k,U){const O={},X=L.attributes;let z=0;const re=k.getAttributes();for(const q in re)if(re[q].location>=0){let H=X[q];H===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(H=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(H=D.instanceColor));const J={};J.attribute=H,H&&H.data&&(J.data=H.data),O[q]=J,z++}r.attributes=O,r.attributesNum=z,r.index=U}function m(){const D=r.newAttributes;for(let L=0,k=D.length;L<k;L++)D[L]=0}function _(D){g(D,0)}function g(D,L){const k=r.newAttributes,U=r.enabledAttributes,O=r.attributeDivisors;k[D]=1,U[D]===0&&(i.enableVertexAttribArray(D),U[D]=1),O[D]!==L&&(i.vertexAttribDivisor(D,L),O[D]=L)}function x(){const D=r.newAttributes,L=r.enabledAttributes;for(let k=0,U=L.length;k<U;k++)L[k]!==D[k]&&(i.disableVertexAttribArray(k),L[k]=0)}function T(D,L,k,U,O,X,z){z===!0?i.vertexAttribIPointer(D,L,k,O,X):i.vertexAttribPointer(D,L,k,U,O,X)}function b(D,L,k,U){m();const O=U.attributes,X=k.getAttributes(),z=L.defaultAttributeValues;for(const re in X){const q=X[re];if(q.location>=0){let te=O[re];if(te===void 0&&(re==="instanceMatrix"&&D.instanceMatrix&&(te=D.instanceMatrix),re==="instanceColor"&&D.instanceColor&&(te=D.instanceColor)),te!==void 0){const H=te.normalized,J=te.itemSize,se=e.get(te);if(se===void 0)continue;const Qe=se.buffer,it=se.type,Xe=se.bytesPerElement,Z=it===i.INT||it===i.UNSIGNED_INT||te.gpuType===Vf;if(te.isInterleavedBufferAttribute){const he=te.data,Ee=he.stride,Ue=te.offset;if(he.isInstancedInterleavedBuffer){for(let Te=0;Te<q.locationSize;Te++)g(q.location+Te,he.meshPerAttribute);D.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Te=0;Te<q.locationSize;Te++)_(q.location+Te);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let Te=0;Te<q.locationSize;Te++)T(q.location+Te,J/q.locationSize,it,H,Ee*Xe,(Ue+J/q.locationSize*Te)*Xe,Z)}else{if(te.isInstancedBufferAttribute){for(let he=0;he<q.locationSize;he++)g(q.location+he,te.meshPerAttribute);D.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let he=0;he<q.locationSize;he++)_(q.location+he);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let he=0;he<q.locationSize;he++)T(q.location+he,J/q.locationSize,it,H,J*Xe,J/q.locationSize*he*Xe,Z)}}else if(z!==void 0){const H=z[re];if(H!==void 0)switch(H.length){case 2:i.vertexAttrib2fv(q.location,H);break;case 3:i.vertexAttrib3fv(q.location,H);break;case 4:i.vertexAttrib4fv(q.location,H);break;default:i.vertexAttrib1fv(q.location,H)}}}}x()}function S(){E();for(const D in n){const L=n[D];for(const k in L){const U=L[k];for(const O in U){const X=U[O];for(const z in X)h(X[z].object),delete X[z];delete U[O]}}delete n[D]}}function M(D){if(n[D.id]===void 0)return;const L=n[D.id];for(const k in L){const U=L[k];for(const O in U){const X=U[O];for(const z in X)h(X[z].object),delete X[z];delete U[O]}}delete n[D.id]}function A(D){for(const L in n){const k=n[L];for(const U in k){const O=k[U];if(O[D.id]===void 0)continue;const X=O[D.id];for(const z in X)h(X[z].object),delete X[z];delete O[D.id]}}}function v(D){for(const L in n){const k=n[L],U=D.isInstancedMesh===!0?D.id:0,O=k[U];if(O!==void 0){for(const X in O){const z=O[X];for(const re in z)h(z[re].object),delete z[re];delete O[X]}delete k[U],Object.keys(k).length===0&&delete n[L]}}}function E(){P(),a=!0,r!==s&&(r=s,l(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:P,dispose:S,releaseStatesOfGeometry:M,releaseStatesOfObject:v,releaseStatesOfProgram:A,initAttributes:m,enableAttribute:_,disableUnusedAttributes:x}}function FA(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function OA(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==os&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const v=A===ls&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Ai&&A!==ys&&!v&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(lt("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&lt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),M=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:x,maxVaryings:T,maxFragmentUniforms:b,maxSamples:S,samples:M}}function BA(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Fs,o=new ut,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,m=d.clipIntersection,_=d.clipShadows,g=i.get(d);if(!s||p===null||p.length===0||r&&!_)r?h(null):l();else{const x=r?0:n,T=x*4;let b=g.clippingState||null;c.value=b,b=h(p,u,T,f);for(let S=0;S!==T;++S)b[S]=t[S];g.clippingState=b,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,p){const m=d!==null?d.length:0;let _=null;if(m!==0){if(_=c.value,p!==!0||_===null){const g=f+m*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(_===null||_.length<g)&&(_=new Float32Array(g));for(let T=0,b=f;T!==m;++T,b+=4)a.copy(d[T]).applyMatrix4(x,o),a.normal.toArray(_,b),_[b+3]=a.constant}c.value=_,c.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,_}}const $a=4,zA=6,HA=20,VA=256,zo=new gh,N0=new ct;let yu=null,Su=0,wu=0,Eu=!1;const GA=new Y,Ur=new Y;class I0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=GA}=r;yu=this._renderer.getRenderTarget(),Su=this._renderer.getActiveCubeFace(),wu=this._renderer.getActiveMipmapLevel(),Eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=O0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=F0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(yu,Su,wu),this._renderer.xr.enabled=Eu,e.scissorTest=!1,Na(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ia||e.mapping===lo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yu=this._renderer.getRenderTarget(),Su=this._renderer.getActiveCubeFace(),wu=this._renderer.getActiveMipmapLevel(),Eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Jn,minFilter:Jn,generateMipmaps:!1,type:ls,format:os,colorSpace:Xc,depthBuffer:!1},s=U0(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=U0(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=WA(r)),this._blurMaterial=XA(r,e,t),this._ggxMaterial=$A(r,e,t)}return s}_compileMaterial(e){const t=new hi(new pn,e);this._renderer.compile(t,zo)}_sceneToCubeUV(e,t,n,s,r){const c=new li(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(N0),d.toneMapping=Es,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new hi(new bl,new mh({name:"PMREM.Background",side:mi,depthWrite:!1,depthTest:!1})));const m=this._backgroundBox,_=m.material;let g=!1;const x=e.background;x?x.isColor&&(_.color.copy(x),e.background=null,g=!0):(_.color.copy(N0),g=!0);for(let T=0;T<6;T++){const b=T%3;b===0?(c.up.set(0,l[T],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[T],r.y,r.z)):b===1?(c.up.set(0,0,l[T]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[T],r.z)):(c.up.set(0,l[T],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[T]));const S=this._cubeSize;Na(s,b*S,T>2?S:0,S,S),d.setRenderTarget(s),g&&d.render(m,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=x}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ia||e.mapping===lo;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=O0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=F0());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Na(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,zo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=l*1.25,f=d*u,{_lodMax:p}=this,m=this._sizeLods[n],_=3*m*(n>p-$a?n-p+$a:0),g=4*(this._cubeSize-m);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=p-t,Na(r,_,g,3*m,2*m),s.setRenderTarget(r),s.render(o,zo),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-n,Na(e,_,g,3*m,2*m),s.setRenderTarget(e),s.render(o,zo)}_blur(e,t,n,s){const r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){const a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;const l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;const h=this._sizeLods[s],d=3*h*(s>this._lodMax-$a?s-this._lodMax+$a:0),u=4*(this._cubeSize-h);Na(t,d,u,3*h,2*h),a.setRenderTarget(t),a.render(c,zo)}}function WA(i){const e=[],t=[];let n=i;const s=i-$a+1+zA;for(let r=0;r<s;r++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),c=-o,l=1+o,h=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,u=6,f=3,p=new Float32Array(f*u*d),m=new Float32Array(f*u*d);for(let g=0;g<d;g++){const x=g%3*2/3-1,T=g>2?0:-1,b=[x,T,0,x+2/3,T,0,x+2/3,T+1,0,x,T,0,x+2/3,T+1,0,x,T+1,0];p.set(b,f*u*g);for(let S=0;S<u;S++){const M=h[S*2]*2-1,A=h[S*2+1]*2-1;g===0?Ur.set(1,A,M):g===1?Ur.set(-M,1,-A):g===2?Ur.set(-M,A,1):g===3?Ur.set(-1,A,-M):g===4?Ur.set(-M,-1,A):Ur.set(M,A,-1),Ur.toArray(m,(g*u+S)*f)}}const _=new pn;_.setAttribute("position",new Gn(p,f)),_.setAttribute("outputDirection",new Gn(m,f)),t.push(new hi(_,null)),n>$a&&n--}return{lodMeshes:t,sizeLods:e}}function U0(i,e,t){const n=new Hi(i,e,t);return n.texture.mapping=dh,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Na(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function $A(i,e,t){return new Pi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:VA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:_h(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ws,depthTest:!1,depthWrite:!1})}function XA(i,e,t){return new Pi({name:"SphericalGaussianBlur",defines:{SAMPLES:HA,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:_h(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:ws,depthTest:!1,depthWrite:!1})}function F0(){return new Pi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ws,depthTest:!1,depthWrite:!1})}function O0(){return new Pi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ws,depthTest:!1,depthWrite:!1})}function _h(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class mx extends Hi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new sx(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new bl(5,5,5),r=new Pi({name:"CubemapFromEquirect",uniforms:co(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:mi,blending:ws});r.uniforms.tEquirect.value=t;const a=new hi(s,r),o=t.minFilter;return t.minFilter===Wr&&(t.minFilter=Jn),new Xw(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function qA(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===Yh||f===jh)if(e.has(u)){const p=e.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const m=new mx(p.height);return m.fromEquirectangularTexture(i,u),e.set(u,m),u.addEventListener("dispose",l),o(m.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,p=f===Yh||f===jh,m=f===ia||f===lo;if(p||m){let _=t.get(u);const g=_!==void 0?_.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new I0(i)),_=p?n.fromEquirectangular(u,_):n.fromCubemap(u,_),_.texture.pmremVersion=u.pmremVersion,t.set(u,_),_.texture;if(_!==void 0)return _.texture;{const x=u.image;return p&&x&&x.height>0||m&&x&&c(x)?(n===null&&(n=new I0(i)),_=p?n.fromEquirectangular(u):n.fromCubemap(u),_.texture.pmremVersion=u.pmremVersion,t.set(u,_),u.addEventListener("dispose",h),_.texture):null}}}return u}function o(u,f){return f===Yh?u.mapping=ia:f===jh&&(u.mapping=lo),u}function c(u){let f=0;const p=6;for(let m=0;m<p;m++)u[m]!==void 0&&f++;return f===p}function l(u){const f=u.target;f.removeEventListener("dispose",l);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function YA(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Za("WebGLRenderer: "+n+" extension not supported."),s}}}function jA(i,e,t,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const p in u.attributes)e.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete s[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],i.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,p=d.attributes.position;let m=0;if(p===void 0)return;if(f!==null){const x=f.array;m=f.version;for(let T=0,b=x.length;T<b;T+=3){const S=x[T+0],M=x[T+1],A=x[T+2];u.push(S,M,M,A,A,S)}}else{const x=p.array;m=p.version;for(let T=0,b=x.length/3-1;T<b;T+=3){const S=T+0,M=T+1,A=T+2;u.push(S,M,M,A,A,S)}}const _=new(p.count>=65535?nx:tx)(u,1);_.version=m;const g=r.get(d);g&&e.remove(g),r.set(d,_)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function KA(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function l(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let m=0;for(let _=0;_<f;_++)m+=u[_];t.update(m,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function ZA(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ct("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function JA(i,e,t){const n=new WeakMap,s=new ln;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let E=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,_=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let T=0;f===!0&&(T=1),p===!0&&(T=2),m===!0&&(T=3);let b=o.attributes.position.count*T,S=1;b>e.maxTextureSize&&(S=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const M=new Float32Array(b*S*4*d),A=new Q_(M,b,S,d);A.type=ys,A.needsUpdate=!0;const v=T*4;for(let P=0;P<d;P++){const D=_[P],L=g[P],k=x[P],U=b*S*4*P;for(let O=0;O<D.count;O++){const X=O*v;f===!0&&(s.fromBufferAttribute(D,O),M[U+X+0]=s.x,M[U+X+1]=s.y,M[U+X+2]=s.z,M[U+X+3]=0),p===!0&&(s.fromBufferAttribute(L,O),M[U+X+4]=s.x,M[U+X+5]=s.y,M[U+X+6]=s.z,M[U+X+7]=0),m===!0&&(s.fromBufferAttribute(k,O),M[U+X+8]=s.x,M[U+X+9]=s.y,M[U+X+10]=s.z,M[U+X+11]=k.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new Je(b,S)},n.set(o,u),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let m=0;m<l.length;m++)f+=l[m];const p=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",p),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function QA(i,e,t,n,s){let r=new WeakMap;function a(l){const h=s.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const e2={[If]:"LINEAR_TONE_MAPPING",[Uf]:"REINHARD_TONE_MAPPING",[Ff]:"CINEON_TONE_MAPPING",[Of]:"ACES_FILMIC_TONE_MAPPING",[zf]:"AGX_TONE_MAPPING",[Hf]:"NEUTRAL_TONE_MAPPING",[Bf]:"CUSTOM_TONE_MAPPING"};function t2(i,e,t,n,s,r){const a=new Hi(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null;const l=new pn;l.setAttribute("position",new rn([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new rn([0,2,0,0,2,0],2));const h=new lx({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new hi(l,h),u=new gh(-1,1,1,-1,0,1);let f=null,p=null,m=!1,_,g=null,x=[],T=!1;this.setSize=function(b,S){a.setSize(b,S),o!==null&&o.setSize(b,S),c!==null&&c.setSize(b,S);for(let M=0;M<x.length;M++){const A=x[M];A.setSize&&A.setSize(b,S)}},this.setEffects=function(b){x=b,T=x.length>0&&x[0].isRenderPass===!0;const S=a.width,M=a.height;x.length>0&&o===null&&(o=new Hi(S,M,{type:ls,depthBuffer:!1,stencilBuffer:!1}),c=new Hi(S,M,{type:ls,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<x.length;A++){const v=x[A];v.setSize&&v.setSize(S,M)}},this.begin=function(b,S){if(m||b.toneMapping===Es&&x.length===0)return!1;if(g=S,S!==null){const M=S.width,A=S.height;(a.width!==M||a.height!==A)&&this.setSize(M,A)}return T===!1&&b.setRenderTarget(a),_=b.toneMapping,b.toneMapping=Es,!0},this.hasRenderPass=function(){return T},this.end=function(b,S){b.toneMapping=_,m=!0;let M=a,A=o;for(let v=0;v<x.length;v++){const E=x[v];E.enabled!==!1&&(E.render(b,A,M,S),E.needsSwap!==!1&&(M=A,A=A===o?c:o))}if(f!==b.outputColorSpace||p!==b.toneMapping){f=b.outputColorSpace,p=b.toneMapping,h.defines={},Et.getTransfer(f)===zt&&(h.defines.SRGB_TRANSFER="");const v=e2[p];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,b.setRenderTarget(g),b.render(d,u),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}const gx=new Yn,Wd=new hl(1,1),_x=new Q_,xx=new vw,vx=new sx,B0=[],z0=[],H0=new Float32Array(16),V0=new Float32Array(9),G0=new Float32Array(4);function vo(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=B0[s];if(r===void 0&&(r=new Float32Array(s),B0[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Cn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ln(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function xh(i,e){let t=z0[e];t===void 0&&(t=new Int32Array(e),z0[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function n2(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function i2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Cn(t,e))return;i.uniform2fv(this.addr,e),Ln(t,e)}}function s2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Cn(t,e))return;i.uniform3fv(this.addr,e),Ln(t,e)}}function r2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Cn(t,e))return;i.uniform4fv(this.addr,e),Ln(t,e)}}function a2(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Cn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ln(t,e)}else{if(Cn(t,n))return;G0.set(n),i.uniformMatrix2fv(this.addr,!1,G0),Ln(t,n)}}function o2(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Cn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ln(t,e)}else{if(Cn(t,n))return;V0.set(n),i.uniformMatrix3fv(this.addr,!1,V0),Ln(t,n)}}function l2(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Cn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ln(t,e)}else{if(Cn(t,n))return;H0.set(n),i.uniformMatrix4fv(this.addr,!1,H0),Ln(t,n)}}function c2(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function h2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Cn(t,e))return;i.uniform2iv(this.addr,e),Ln(t,e)}}function u2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Cn(t,e))return;i.uniform3iv(this.addr,e),Ln(t,e)}}function d2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Cn(t,e))return;i.uniform4iv(this.addr,e),Ln(t,e)}}function f2(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function p2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Cn(t,e))return;i.uniform2uiv(this.addr,e),Ln(t,e)}}function m2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Cn(t,e))return;i.uniform3uiv(this.addr,e),Ln(t,e)}}function g2(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Cn(t,e))return;i.uniform4uiv(this.addr,e),Ln(t,e)}}function _2(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Wd.compareFunction=t.isReversedDepthBuffer()?jf:Yf,r=Wd):r=gx,t.setTexture2D(e||r,s)}function x2(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||xx,s)}function v2(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||vx,s)}function b2(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||_x,s)}function M2(i){switch(i){case 5126:return n2;case 35664:return i2;case 35665:return s2;case 35666:return r2;case 35674:return a2;case 35675:return o2;case 35676:return l2;case 5124:case 35670:return c2;case 35667:case 35671:return h2;case 35668:case 35672:return u2;case 35669:case 35673:return d2;case 5125:return f2;case 36294:return p2;case 36295:return m2;case 36296:return g2;case 35678:case 36198:case 36298:case 36306:case 35682:return _2;case 35679:case 36299:case 36307:return x2;case 35680:case 36300:case 36308:case 36293:return v2;case 36289:case 36303:case 36311:case 36292:return b2}}function y2(i,e){i.uniform1fv(this.addr,e)}function S2(i,e){const t=vo(e,this.size,2);i.uniform2fv(this.addr,t)}function w2(i,e){const t=vo(e,this.size,3);i.uniform3fv(this.addr,t)}function E2(i,e){const t=vo(e,this.size,4);i.uniform4fv(this.addr,t)}function T2(i,e){const t=vo(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function A2(i,e){const t=vo(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function R2(i,e){const t=vo(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function C2(i,e){i.uniform1iv(this.addr,e)}function L2(i,e){i.uniform2iv(this.addr,e)}function P2(i,e){i.uniform3iv(this.addr,e)}function D2(i,e){i.uniform4iv(this.addr,e)}function k2(i,e){i.uniform1uiv(this.addr,e)}function N2(i,e){i.uniform2uiv(this.addr,e)}function I2(i,e){i.uniform3uiv(this.addr,e)}function U2(i,e){i.uniform4uiv(this.addr,e)}function F2(i,e,t){const n=this.cache,s=e.length,r=xh(t,s);Cn(n,r)||(i.uniform1iv(this.addr,r),Ln(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Wd:a=gx;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function O2(i,e,t){const n=this.cache,s=e.length,r=xh(t,s);Cn(n,r)||(i.uniform1iv(this.addr,r),Ln(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||xx,r[a])}function B2(i,e,t){const n=this.cache,s=e.length,r=xh(t,s);Cn(n,r)||(i.uniform1iv(this.addr,r),Ln(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||vx,r[a])}function z2(i,e,t){const n=this.cache,s=e.length,r=xh(t,s);Cn(n,r)||(i.uniform1iv(this.addr,r),Ln(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||_x,r[a])}function H2(i){switch(i){case 5126:return y2;case 35664:return S2;case 35665:return w2;case 35666:return E2;case 35674:return T2;case 35675:return A2;case 35676:return R2;case 5124:case 35670:return C2;case 35667:case 35671:return L2;case 35668:case 35672:return P2;case 35669:case 35673:return D2;case 5125:return k2;case 36294:return N2;case 36295:return I2;case 36296:return U2;case 35678:case 36198:case 36298:case 36306:case 35682:return F2;case 35679:case 36299:case 36307:return O2;case 35680:case 36300:case 36308:case 36293:return B2;case 36289:case 36303:case 36311:case 36292:return z2}}class V2{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=M2(t.type)}}class G2{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=H2(t.type)}}class W2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Tu=/(\w+)(\])?(\[|\.)?/g;function W0(i,e){i.seq.push(e),i.map[e.id]=e}function $2(i,e,t){const n=i.name,s=n.length;for(Tu.lastIndex=0;;){const r=Tu.exec(n),a=Tu.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){W0(t,l===void 0?new V2(o,i,e):new G2(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new W2(o),W0(t,d)),t=d}}}class Lc{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);$2(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function $0(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const X2=37297;let q2=0;function Y2(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const X0=new ut;function j2(i){Et._getMatrix(X0,Et.workingColorSpace,i);const e=`mat3( ${X0.elements.map(t=>t.toFixed(4))} )`;switch(Et.getTransfer(i)){case qc:return[e,"LinearTransferOETF"];case zt:return[e,"sRGBTransferOETF"];default:return lt("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function q0(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Y2(i.getShaderSource(e),o)}else return r}function K2(i,e){const t=j2(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Z2={[If]:"Linear",[Uf]:"Reinhard",[Ff]:"Cineon",[Of]:"ACESFilmic",[zf]:"AgX",[Hf]:"Neutral",[Bf]:"Custom"};function J2(i,e){const t=Z2[e];return t===void 0?(lt("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fc=new Y;function Q2(){Et.getLuminanceCoefficients(fc);const i=fc.x.toFixed(4),e=fc.y.toFixed(4),t=fc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function eR(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ko).join(`
`)}function tR(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function nR(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ko(i){return i!==""}function Y0(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function j0(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const iR=/^[ \t]*#include +<([\w\d./]+)>/gm;function $d(i){return i.replace(iR,rR)}const sR=new Map;function rR(i,e){let t=vt[e];if(t===void 0){const n=sR.get(e);if(n!==void 0)t=vt[n],lt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return $d(t)}const aR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function K0(i){return i.replace(aR,oR)}function oR(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Z0(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const lR={[wc]:"SHADOWMAP_TYPE_PCF",[jo]:"SHADOWMAP_TYPE_VSM"};function cR(i){return lR[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const hR={[ia]:"ENVMAP_TYPE_CUBE",[lo]:"ENVMAP_TYPE_CUBE",[dh]:"ENVMAP_TYPE_CUBE_UV"};function uR(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":hR[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const dR={[lo]:"ENVMAP_MODE_REFRACTION"};function fR(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":dR[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const pR={[G_]:"ENVMAP_BLENDING_MULTIPLY",[jS]:"ENVMAP_BLENDING_MIX",[KS]:"ENVMAP_BLENDING_ADD"};function mR(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":pR[i.combine]||"ENVMAP_BLENDING_NONE"}function gR(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function _R(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=cR(t),l=uR(t),h=fR(t),d=mR(t),u=gR(t),f=eR(t),p=tR(r),m=s.createProgram();let _,g,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ko).join(`
`),_.length>0&&(_+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ko).join(`
`),g.length>0&&(g+=`
`)):(_=[Z0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ko).join(`
`),g=[Z0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Es?"#define TONE_MAPPING":"",t.toneMapping!==Es?vt.tonemapping_pars_fragment:"",t.toneMapping!==Es?J2("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,K2("linearToOutputTexel",t.outputColorSpace),Q2(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ko).join(`
`)),a=$d(a),a=Y0(a,t),a=j0(a,t),o=$d(o),o=Y0(o,t),o=j0(o,t),a=K0(a),o=K0(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,_=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,g=["#define varying in",t.glslVersion===n0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===n0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const T=x+_+a,b=x+g+o,S=$0(s,s.VERTEX_SHADER,T),M=$0(s,s.FRAGMENT_SHADER,b);s.attachShader(m,S),s.attachShader(m,M),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function A(D){if(i.debug.checkShaderErrors){const L=s.getProgramInfoLog(m)||"",k=s.getShaderInfoLog(S)||"",U=s.getShaderInfoLog(M)||"",O=L.trim(),X=k.trim(),z=U.trim();let re=!0,q=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(re=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,S,M);else{const te=q0(s,S,"vertex"),H=q0(s,M,"fragment");Ct("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+O+`
`+te+`
`+H)}else O!==""?lt("WebGLProgram: Program Info Log:",O):(X===""||z==="")&&(q=!1);q&&(D.diagnostics={runnable:re,programLog:O,vertexShader:{log:X,prefix:_},fragmentShader:{log:z,prefix:g}})}s.deleteShader(S),s.deleteShader(M),v=new Lc(s,m),E=nR(s,m)}let v;this.getUniforms=function(){return v===void 0&&A(this),v};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(m,X2)),P},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=q2++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=M,this}let xR=0;class vR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new bR(e),t.set(e,n)),n}}class bR{constructor(e){this.id=xR++,this.code=e,this.usedTimes=0}}function MR(i){return i===sa||i===Wc||i===$c}function yR(i,e,t,n,s,r){const a=new Zf,o=new vR,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,E,P,D,L,k){const U=D.fog,O=L.geometry,X=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?D.environment:null,z=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,re=e.get(v.envMap||X,z),q=re&&re.mapping===dh?re.image.height:null,te=f[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&lt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const H=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,J=H!==void 0?H.length:0;let se=0;O.morphAttributes.position!==void 0&&(se=1),O.morphAttributes.normal!==void 0&&(se=2),O.morphAttributes.color!==void 0&&(se=3);let Qe,it,Xe,Z;if(te){const dt=Ms[te];Qe=dt.vertexShader,it=dt.fragmentShader}else{Qe=v.vertexShader,it=v.fragmentShader;const dt=o.getVertexShaderStage(v),_t=o.getFragmentShaderStage(v);o.update(v,dt,_t),Xe=dt.id,Z=_t.id}const he=i.getRenderTarget(),Ee=i.state.buffers.depth.getReversed(),Ue=L.isInstancedMesh===!0,Te=L.isBatchedMesh===!0,ue=!!v.map,pe=!!v.matcap,_e=!!re,Ge=!!v.aoMap,ze=!!v.lightMap,He=!!v.bumpMap&&v.wireframe===!1,ot=!!v.normalMap,Tt=!!v.displacementMap,rt=!!v.emissiveMap,gt=!!v.metalnessMap,bt=!!v.roughnessMap,V=v.anisotropy>0,Ke=v.clearcoat>0,ge=v.dispersion>0,N=v.retroreflectivity>0,w=v.iridescence>0,j=v.sheen>0,ne=v.transmission>0,oe=V&&!!v.anisotropyMap,ve=Ke&&!!v.clearcoatMap,Me=Ke&&!!v.clearcoatNormalMap,le=Ke&&!!v.clearcoatRoughnessMap,ce=w&&!!v.iridescenceMap,ye=w&&!!v.iridescenceThicknessMap,Ze=j&&!!v.sheenColorMap,Ae=j&&!!v.sheenRoughnessMap,we=!!v.specularMap,qe=!!v.specularColorMap,nt=!!v.specularIntensityMap,st=ne&&!!v.transmissionMap,$=ne&&!!v.thicknessMap,Re=!!v.gradientMap,de=!!v.alphaMap,Ce=v.alphaTest>0,Ne=!!v.alphaHash,me=!!v.extensions;let et=Es;v.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(et=i.toneMapping);const We={shaderID:te,shaderType:v.type,shaderName:v.name,vertexShader:Qe,fragmentShader:it,defines:v.defines,customVertexShaderID:Xe,customFragmentShaderID:Z,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:Te,batchingColor:Te&&L._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&L.instanceColor!==null,instancingMorph:Ue&&L.morphTexture!==null,outputColorSpace:he===null?i.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:Et.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:ue,matcap:pe,envMap:_e,envMapMode:_e&&re.mapping,envMapCubeUVHeight:q,aoMap:Ge,lightMap:ze,bumpMap:He,normalMap:ot,displacementMap:Tt,emissiveMap:rt,normalMapObjectSpace:ot&&v.normalMapType===QS,normalMapTangentSpace:ot&&v.normalMapType===Bd,packedNormalMap:ot&&v.normalMapType===Bd&&MR(v.normalMap.format),metalnessMap:gt,roughnessMap:bt,anisotropy:V,anisotropyMap:oe,clearcoat:Ke,clearcoatMap:ve,clearcoatNormalMap:Me,clearcoatRoughnessMap:le,dispersion:ge,retroreflection:N,iridescence:w,iridescenceMap:ce,iridescenceThicknessMap:ye,sheen:j,sheenColorMap:Ze,sheenRoughnessMap:Ae,specularMap:we,specularColorMap:qe,specularIntensityMap:nt,transmission:ne,transmissionMap:st,thicknessMap:$,gradientMap:Re,opaque:v.transparent===!1&&v.blending===jr&&v.alphaToCoverage===!1,alphaMap:de,alphaTest:Ce,alphaHash:Ne,combine:v.combine,mapUv:ue&&p(v.map.channel),aoMapUv:Ge&&p(v.aoMap.channel),lightMapUv:ze&&p(v.lightMap.channel),bumpMapUv:He&&p(v.bumpMap.channel),normalMapUv:ot&&p(v.normalMap.channel),displacementMapUv:Tt&&p(v.displacementMap.channel),emissiveMapUv:rt&&p(v.emissiveMap.channel),metalnessMapUv:gt&&p(v.metalnessMap.channel),roughnessMapUv:bt&&p(v.roughnessMap.channel),anisotropyMapUv:oe&&p(v.anisotropyMap.channel),clearcoatMapUv:ve&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:Me&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:ce&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ze&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&p(v.sheenRoughnessMap.channel),specularMapUv:we&&p(v.specularMap.channel),specularColorMapUv:qe&&p(v.specularColorMap.channel),specularIntensityMapUv:nt&&p(v.specularIntensityMap.channel),transmissionMapUv:st&&p(v.transmissionMap.channel),thicknessMapUv:$&&p(v.thicknessMap.channel),alphaMapUv:de&&p(v.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ot||V),vertexNormals:!!O.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!O.attributes.uv&&(ue||de),fog:!!U,useFog:v.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||O.attributes.normal===void 0&&ot===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ee,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:J,morphTextureStride:se,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:et,decodeVideoTexture:ue&&v.map.isVideoTexture===!0&&Et.getTransfer(v.map.colorSpace)===zt,decodeVideoTextureEmissive:rt&&v.emissiveMap.isVideoTexture===!0&&Et.getTransfer(v.emissiveMap.colorSpace)===zt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Os,flipSided:v.side===mi,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:me&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&v.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return We.vertexUv1s=c.has(1),We.vertexUv2s=c.has(2),We.vertexUv3s=c.has(3),c.clear(),We}function _(v){const E=[];if(v.shaderID?E.push(v.shaderID):(E.push(v.customVertexShaderID),E.push(v.customFragmentShaderID)),v.defines!==void 0)for(const P in v.defines)E.push(P),E.push(v.defines[P]);return v.isRawShaderMaterial===!1&&(g(E,v),x(E,v),E.push(i.outputColorSpace)),E.push(v.customProgramCacheKey),E.join()}function g(v,E){v.push(E.precision),v.push(E.outputColorSpace),v.push(E.envMapMode),v.push(E.envMapCubeUVHeight),v.push(E.mapUv),v.push(E.alphaMapUv),v.push(E.lightMapUv),v.push(E.aoMapUv),v.push(E.bumpMapUv),v.push(E.normalMapUv),v.push(E.displacementMapUv),v.push(E.emissiveMapUv),v.push(E.metalnessMapUv),v.push(E.roughnessMapUv),v.push(E.anisotropyMapUv),v.push(E.clearcoatMapUv),v.push(E.clearcoatNormalMapUv),v.push(E.clearcoatRoughnessMapUv),v.push(E.iridescenceMapUv),v.push(E.iridescenceThicknessMapUv),v.push(E.sheenColorMapUv),v.push(E.sheenRoughnessMapUv),v.push(E.specularMapUv),v.push(E.specularColorMapUv),v.push(E.specularIntensityMapUv),v.push(E.transmissionMapUv),v.push(E.thicknessMapUv),v.push(E.combine),v.push(E.fogExp2),v.push(E.sizeAttenuation),v.push(E.morphTargetsCount),v.push(E.morphAttributeCount),v.push(E.numSunLights),v.push(E.numDirLights),v.push(E.numPointLights),v.push(E.numSpotLights),v.push(E.numSpotLightMaps),v.push(E.numHemiLights),v.push(E.numRectAreaLights),v.push(E.numSunLightShadows),v.push(E.numDirLightShadows),v.push(E.numPointLightShadows),v.push(E.numSpotLightShadows),v.push(E.numSpotLightShadowsWithMaps),v.push(E.numLightProbes),v.push(E.shadowMapType),v.push(E.toneMapping),v.push(E.numClippingPlanes),v.push(E.numClipIntersection),v.push(E.depthPacking)}function x(v,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function T(v){const E=f[v.type];let P;if(E){const D=Ms[E];P=tp.clone(D.uniforms)}else P=v.uniforms;return P}function b(v,E){let P=h.get(E);return P!==void 0?++P.usedTimes:(P=new _R(i,E,v,s),l.push(P),h.set(E,P)),P}function S(v){if(--v.usedTimes===0){const E=l.indexOf(v);l[E]=l[l.length-1],l.pop(),h.delete(v.cacheKey),v.destroy()}}function M(v){o.remove(v)}function A(){o.dispose()}return{getParameters:m,getProgramCacheKey:_,getUniforms:T,acquireProgram:b,releaseProgram:S,releaseShaderCache:M,programs:l,dispose:A}}function SR(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function wR(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function J0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Q0(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,p,m,_,g){let x=i[e];return x===void 0?(x={id:u.id,object:u,geometry:f,material:p,materialVariant:a(u),groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},i[e]=x):(x.id=u.id,x.object=u,x.geometry=f,x.material=p,x.materialVariant=a(u),x.groupOrder=m,x.renderOrder=u.renderOrder,x.z=_,x.group=g),e++,x}function c(u,f,p,m,_,g,x){x.reversedDepth===!0&&(_=-_);const T=o(u,f,p,m,_,g);p.transmission>0?n.push(T):p.transparent===!0?s.push(T):t.push(T)}function l(u,f,p,m,_,g){const x=o(u,f,p,m,_,g);p.transmission>0?n.unshift(x):p.transparent===!0?s.unshift(x):t.unshift(x)}function h(u,f){t.length>1&&t.sort(u||wR),n.length>1&&n.sort(f||J0),s.length>1&&s.sort(f||J0)}function d(){for(let u=e,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:d,sort:h}}function ER(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Q0,i.set(n,[a])):s>=r.length?(a=new Q0,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function TR(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new Y,color:new ct};break;case"SpotLight":t={position:new Y,direction:new Y,color:new ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new ct,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new ct,groundColor:new ct};break;case"RectAreaLight":t={color:new ct,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return i[e.id]=t,t}}}function AR(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let RR=0;function CR(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function LR(i){const e=new TR,t=AR(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new Y);const s=new Y,r=new Kt,a=new Kt;function o(l){let h=0,d=0,u=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let f=0,p=0,m=0,_=0,g=0,x=0,T=0,b=0,S=0,M=0,A=0,v=0,E=0,P=0;l.sort(CR);for(let L=0,k=l.length;L<k;L++){const U=l[L],O=U.color,X=U.intensity,z=U.distance;let re=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===sa?re=U.shadow.map.texture:re=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)h+=O.r*X,d+=O.g*X,u+=O.b*X;else if(U.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(U.sh.coefficients[q],X);P++}else if(U.isSunLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const te=U.shadow,H=t.get(U);H.shadowIntensity=te.intensity,H.shadowBias=te.bias,H.shadowNormalBias=te.normalBias,H.shadowRadius=te.radius,H.shadowMapSize.copy(te.mapSize).multiply(te.getFrameExtents()),n.sunShadow[p]=H,n.sunShadowMap[p]=re;const J=te.getViewportCount();for(let se=0;se<J;se++)n.sunShadowMatrix[m+se]=te.getMatrix(se),n.sunShadowCascade[m+se]=te._cascadeData[se];m+=J,p++}n.sun[f]=q,f++}else if(U.isDirectionalLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const te=U.shadow,H=t.get(U);H.shadowIntensity=te.intensity,H.shadowBias=te.bias,H.shadowNormalBias=te.normalBias,H.shadowRadius=te.radius,H.shadowMapSize=te.mapSize,n.directionalShadow[_]=H,n.directionalShadowMap[_]=re,n.directionalShadowMatrix[_]=U.shadow.matrix,S++}n.directional[_]=q,_++}else if(U.isSpotLight){const q=e.get(U);q.position.setFromMatrixPosition(U.matrixWorld),q.color.copy(O).multiplyScalar(X),q.distance=z,q.coneCos=Math.cos(U.angle),q.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),q.decay=U.decay,n.spot[x]=q;const te=U.shadow;if(U.map&&(n.spotLightMap[v]=U.map,v++,te.updateMatrices(U),U.castShadow&&E++),n.spotLightMatrix[x]=te.matrix,U.castShadow){const H=t.get(U);H.shadowIntensity=te.intensity,H.shadowBias=te.bias,H.shadowNormalBias=te.normalBias,H.shadowRadius=te.radius,H.shadowMapSize=te.mapSize,n.spotShadow[x]=H,n.spotShadowMap[x]=re,A++}x++}else if(U.isRectAreaLight){const q=e.get(U);q.color.copy(O).multiplyScalar(X),q.halfWidth.set(U.width*.5,0,0),q.halfHeight.set(0,U.height*.5,0),n.rectArea[T]=q,T++}else if(U.isPointLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),q.distance=U.distance,q.decay=U.decay,U.castShadow){const te=U.shadow,H=t.get(U);H.shadowIntensity=te.intensity,H.shadowBias=te.bias,H.shadowNormalBias=te.normalBias,H.shadowRadius=te.radius,H.shadowMapSize=te.mapSize,H.shadowCameraNear=te.camera.near,H.shadowCameraFar=te.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=re,n.pointShadowMatrix[g]=U.shadow.matrix,M++}n.point[g]=q,g++}else if(U.isHemisphereLight){const q=e.get(U);q.skyColor.copy(U.color).multiplyScalar(X),q.groundColor.copy(U.groundColor).multiplyScalar(X),n.hemi[b]=q,b++}}T>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ke.LTC_FLOAT_1,n.rectAreaLTC2=ke.LTC_FLOAT_2):(n.rectAreaLTC1=ke.LTC_HALF_1,n.rectAreaLTC2=ke.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const D=n.hash;(D.sunLength!==f||D.directionalLength!==_||D.pointLength!==g||D.spotLength!==x||D.rectAreaLength!==T||D.hemiLength!==b||D.numSunShadows!==p||D.numDirectionalShadows!==S||D.numPointShadows!==M||D.numSpotShadows!==A||D.numSpotMaps!==v||D.numLightProbes!==P)&&(n.sun.length=f,n.directional.length=_,n.spot.length=x,n.rectArea.length=T,n.point.length=g,n.hemi.length=b,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=m,n.sunShadowCascade.length=m,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.pointShadowMatrix.length=M,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+v-E,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=P,D.sunLength=f,D.directionalLength=_,D.pointLength=g,D.spotLength=x,D.rectAreaLength=T,D.hemiLength=b,D.numSunShadows=p,D.numDirectionalShadows=S,D.numPointShadows=M,D.numSpotShadows=A,D.numSpotMaps=v,D.numLightProbes=P,n.version=RR++)}function c(l,h){let d=0,u=0,f=0,p=0,m=0,_=0;const g=h.matrixWorldInverse;for(let x=0,T=l.length;x<T;x++){const b=l[x];if(b.isSunLight){const S=n.sun[d];S.direction.setFromMatrixPosition(b.matrixWorld),S.direction.transformDirection(g),d++}else if(b.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(g),u++}else if(b.isSpotLight){const S=n.spot[p];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(g),p++}else if(b.isRectAreaLight){const S=n.rectArea[m];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(g),a.identity(),r.copy(b.matrixWorld),r.premultiply(g),a.extractRotation(r),S.halfWidth.set(b.width*.5,0,0),S.halfHeight.set(0,b.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),m++}else if(b.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(g),f++}else if(b.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(b.matrixWorld),S.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:n}}function eg(i){const e=new LR(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function c(u){s.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function PR(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new eg(i),e.set(s,[o])):r>=a.length?(o=new eg(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const DR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,NR=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],IR=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],tg=new Kt,Ho=new Y,Au=new Y;function UR(i,e,t){let n=new Jf;const s=new Je,r=new Je,a=new ln,o=new zw,c=new Hw,l={},h=t.maxTextureSize,d={[na]:mi,[mi]:na,[Os]:Os},u=new Pi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Je},radius:{value:4}},vertexShader:DR,fragmentShader:kR}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new pn;p.setAttribute("position",new Gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new hi(p,u),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wc;let g=this.type;this.render=function(M,A,v){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||M.length===0)return;this.type===LS&&(lt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=wc);const E=i.getRenderTarget(),P=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),L=i.state;L.setBlending(ws),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const k=g!==this.type;k&&A.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(O=>O.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,O=M.length;U<O;U++){const X=M[U],z=X.shadow;if(z===void 0){lt("WebGLShadowMap:",X,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const re=z.getFrameExtents();s.multiply(re),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/re.x),s.x=r.x*re.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/re.y),s.y=r.y*re.y,z.mapSize.y=r.y));const q=i.state.buffers.depth.getReversed();if(z.camera._reversedDepth=q,z.map===null||k===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===jo){if(X.isPointLight){lt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Hi(s.x,s.y,{format:sa,type:ls,minFilter:Jn,magFilter:Jn,generateMipmaps:!1}),z.map.texture.name=X.name+".shadowMap",z.map.depthTexture=new hl(s.x,s.y,ys),z.map.depthTexture.name=X.name+".shadowMapDepth",z.map.depthTexture.format=$s,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Xn,z.map.depthTexture.magFilter=Xn}else X.isPointLight?(z.map=new mx(s.x),z.map.depthTexture=new Uw(s.x,As)):(z.map=new Hi(s.x,s.y),z.map.depthTexture=new hl(s.x,s.y,As)),z.map.depthTexture.name=X.name+".shadowMap",z.map.depthTexture.format=$s,this.type===wc?(z.map.depthTexture.compareFunction=q?jf:Yf,z.map.depthTexture.minFilter=Jn,z.map.depthTexture.magFilter=Jn):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Xn,z.map.depthTexture.magFilter=Xn);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);const te=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();X.isPointLight!==!0&&z.updateMatrices(X,v);for(let H=0;H<te;H++){const J=z.getCamera(H);if(X.isPointLight){const se=z.camera,Qe=z.matrix,it=X.distance||se.far;it!==se.far&&(se.far=it,se.updateProjectionMatrix()),Ho.setFromMatrixPosition(X.matrixWorld),se.position.copy(Ho),Au.copy(se.position),Au.add(NR[H]),se.up.copy(IR[H]),se.lookAt(Au),se.updateMatrixWorld(),Qe.makeTranslation(-Ho.x,-Ho.y,-Ho.z),tg.multiplyMatrices(se.projectionMatrix,se.matrixWorldInverse),z._frustum.setFromProjectionMatrix(tg,se.coordinateSystem,se.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)i.setRenderTarget(z.map,H),i.clear();else{H===0&&(i.setRenderTarget(z.map),i.clear());const se=z.getViewport(H);a.set(r.x*se.x,r.y*se.y,r.x*se.z,r.y*se.w),L.viewport(a)}n=z.getFrustum(H),b(A,v,J,X,this.type)}z.isPointLightShadow!==!0&&this.type===jo&&x(z,v),z.needsUpdate=!1}g=this.type,_.needsUpdate=!1,i.setRenderTarget(E,P,D)};function x(M,A){const v=e.update(m);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null?M.mapPass=new Hi(s.x,s.y,{format:sa,type:ls}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(A,null,v,u,m,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(A,null,v,f,m,null)}function T(M,A,v,E){let P=null;const D=v.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(D!==void 0)P=D;else if(P=v.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const L=P.uuid,k=A.uuid;let U=l[L];U===void 0&&(U={},l[L]=U);let O=U[k];O===void 0&&(O=P.clone(),U[k]=O,A.addEventListener("dispose",S)),P=O}if(P.visible=A.visible,P.wireframe=A.wireframe,E===jo?P.side=A.shadowSide!==null?A.shadowSide:A.side:P.side=A.shadowSide!==null?A.shadowSide:d[A.side],P.alphaMap=A.alphaMap,P.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,P.map=A.map,P.clipShadows=A.clipShadows,P.clippingPlanes=A.clippingPlanes,P.clipIntersection=A.clipIntersection,P.displacementMap=A.displacementMap,P.displacementScale=A.displacementScale,P.displacementBias=A.displacementBias,P.wireframeLinewidth=A.wireframeLinewidth,P.linewidth=A.linewidth,v.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const L=i.properties.get(P);L.light=v}return P}function b(M,A,v,E,P){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&P===jo)&&(!M.frustumCulled||M.intersectsFrustum(n))){M.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,M.matrixWorld);const k=e.update(M),U=M.material;if(Array.isArray(U)){const O=k.groups;for(let X=0,z=O.length;X<z;X++){const re=O[X],q=U[re.materialIndex];if(q&&q.visible){const te=T(M,q,E,P);M.onBeforeShadow(i,M,A,v,k,te,re),i.renderBufferDirect(v,null,k,te,M,re),M.onAfterShadow(i,M,A,v,k,te,re)}}}else if(U.visible){const O=T(M,U,E,P);M.onBeforeShadow(i,M,A,v,k,O,null),i.renderBufferDirect(v,null,k,O,M,null),M.onAfterShadow(i,M,A,v,k,O,null)}}const L=M.children;for(let k=0,U=L.length;k<U;k++)b(L[k],A,v,E,P)}function S(M){M.target.removeEventListener("dispose",S);for(const v in l){const E=l[v],P=M.target.uuid;P in E&&(E[P].dispose(),delete E[P])}}}function FR(i,e){function t(){let $=!1;const Re=new ln;let de=null;const Ce=new ln(0,0,0,0);return{setMask:function(Ne){de!==Ne&&!$&&(i.colorMask(Ne,Ne,Ne,Ne),de=Ne)},setLocked:function(Ne){$=Ne},setClear:function(Ne,me,et,We,dt){dt===!0&&(Ne*=We,me*=We,et*=We),Re.set(Ne,me,et,We),Ce.equals(Re)===!1&&(i.clearColor(Ne,me,et,We),Ce.copy(Re))},reset:function(){$=!1,de=null,Ce.set(-1,0,0,0)}}}function n(){let $=!1,Re=!1,de=null,Ce=null,Ne=null;return{setReversed:function(me){if(Re!==me){const et=e.get("EXT_clip_control");me?et.clipControlEXT(et.LOWER_LEFT_EXT,et.ZERO_TO_ONE_EXT):et.clipControlEXT(et.LOWER_LEFT_EXT,et.NEGATIVE_ONE_TO_ONE_EXT),Re=me;const We=Ne;Ne=null,this.setClear(We)}},getReversed:function(){return Re},setTest:function(me){me?he(i.DEPTH_TEST):Ee(i.DEPTH_TEST)},setMask:function(me){de!==me&&!$&&(i.depthMask(me),de=me)},setFunc:function(me){if(Re&&(me=uw[me]),Ce!==me){switch(me){case ed:i.depthFunc(i.NEVER);break;case td:i.depthFunc(i.ALWAYS);break;case nd:i.depthFunc(i.LESS);break;case al:i.depthFunc(i.LEQUAL);break;case id:i.depthFunc(i.EQUAL);break;case sd:i.depthFunc(i.GEQUAL);break;case rd:i.depthFunc(i.GREATER);break;case ad:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ce=me}},setLocked:function(me){$=me},setClear:function(me){Ne!==me&&(Ne=me,Re&&(me=1-me),i.clearDepth(me))},reset:function(){$=!1,de=null,Ce=null,Ne=null,Re=!1}}}function s(){let $=!1,Re=null,de=null,Ce=null,Ne=null,me=null,et=null,We=null,dt=null;return{setTest:function(_t){$||(_t?he(i.STENCIL_TEST):Ee(i.STENCIL_TEST))},setMask:function(_t){Re!==_t&&!$&&(i.stencilMask(_t),Re=_t)},setFunc:function(_t,Dn,zn){(de!==_t||Ce!==Dn||Ne!==zn)&&(i.stencilFunc(_t,Dn,zn),de=_t,Ce=Dn,Ne=zn)},setOp:function(_t,Dn,zn){(me!==_t||et!==Dn||We!==zn)&&(i.stencilOp(_t,Dn,zn),me=_t,et=Dn,We=zn)},setLocked:function(_t){$=_t},setClear:function(_t){dt!==_t&&(i.clearStencil(_t),dt=_t)},reset:function(){$=!1,Re=null,de=null,Ce=null,Ne=null,me=null,et=null,We=null,dt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},d={},u={},f=new WeakMap,p=[],m=null,_=!1,g=null,x=null,T=null,b=null,S=null,M=null,A=null,v=new ct(0,0,0),E=0,P=!1,D=null,L=null,k=null,U=null,O=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,re=0;const q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(q)[1]),z=re>=1):q.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),z=re>=2);let te=null,H={};const J=i.getParameter(i.SCISSOR_BOX),se=i.getParameter(i.VIEWPORT),Qe=new ln().fromArray(J),it=new ln().fromArray(se);function Xe($,Re,de,Ce){const Ne=new Uint8Array(4),me=i.createTexture();i.bindTexture($,me),i.texParameteri($,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri($,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let et=0;et<de;et++)$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?i.texImage3D(Re,0,i.RGBA,1,1,Ce,0,i.RGBA,i.UNSIGNED_BYTE,Ne):i.texImage2D(Re+et,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ne);return me}const Z={};Z[i.TEXTURE_2D]=Xe(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=Xe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=Xe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=Xe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),he(i.DEPTH_TEST),a.setFunc(al),He(!1),ot(Qm),he(i.CULL_FACE),Ge(ws);function he($){h[$]!==!0&&(i.enable($),h[$]=!0)}function Ee($){h[$]!==!1&&(i.disable($),h[$]=!1)}function Ue($,Re){return u[$]!==Re?(i.bindFramebuffer($,Re),u[$]=Re,$===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Re),$===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Re),!0):!1}function Te($,Re){let de=p,Ce=!1;if($){de=f.get(Re),de===void 0&&(de=[],f.set(Re,de));const Ne=$.textures;if(de.length!==Ne.length||de[0]!==i.COLOR_ATTACHMENT0){for(let me=0,et=Ne.length;me<et;me++)de[me]=i.COLOR_ATTACHMENT0+me;de.length=Ne.length,Ce=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,Ce=!0);Ce&&i.drawBuffers(de)}function ue($){return m!==$?(i.useProgram($),m=$,!0):!1}const pe={[Ha]:i.FUNC_ADD,[DS]:i.FUNC_SUBTRACT,[kS]:i.FUNC_REVERSE_SUBTRACT};pe[NS]=i.MIN,pe[IS]=i.MAX;const _e={[US]:i.ZERO,[FS]:i.ONE,[OS]:i.SRC_COLOR,[H_]:i.SRC_ALPHA,[WS]:i.SRC_ALPHA_SATURATE,[VS]:i.DST_COLOR,[zS]:i.DST_ALPHA,[BS]:i.ONE_MINUS_SRC_COLOR,[V_]:i.ONE_MINUS_SRC_ALPHA,[GS]:i.ONE_MINUS_DST_COLOR,[HS]:i.ONE_MINUS_DST_ALPHA,[$S]:i.CONSTANT_COLOR,[XS]:i.ONE_MINUS_CONSTANT_COLOR,[qS]:i.CONSTANT_ALPHA,[YS]:i.ONE_MINUS_CONSTANT_ALPHA};function Ge($,Re,de,Ce,Ne,me,et,We,dt,_t){if($===ws){_===!0&&(Ee(i.BLEND),_=!1);return}if(_===!1&&(he(i.BLEND),_=!0),$!==PS){if($!==g||_t!==P){if((x!==Ha||S!==Ha)&&(i.blendEquation(i.FUNC_ADD),x=Ha,S=Ha),_t)switch($){case jr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case oo:i.blendFunc(i.ONE,i.ONE);break;case e0:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case t0:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ct("WebGLState: Invalid blending: ",$);break}else switch($){case jr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case oo:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case e0:Ct("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case t0:Ct("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ct("WebGLState: Invalid blending: ",$);break}T=null,b=null,M=null,A=null,v.set(0,0,0),E=0,g=$,P=_t}return}Ne=Ne||Re,me=me||de,et=et||Ce,(Re!==x||Ne!==S)&&(i.blendEquationSeparate(pe[Re],pe[Ne]),x=Re,S=Ne),(de!==T||Ce!==b||me!==M||et!==A)&&(i.blendFuncSeparate(_e[de],_e[Ce],_e[me],_e[et]),T=de,b=Ce,M=me,A=et),(We.equals(v)===!1||dt!==E)&&(i.blendColor(We.r,We.g,We.b,dt),v.copy(We),E=dt),g=$,P=!1}function ze($,Re){$.side===Os?Ee(i.CULL_FACE):he(i.CULL_FACE);let de=$.side===mi;Re&&(de=!de),He(de),$.blending===jr&&$.transparent===!1?Ge(ws):Ge($.blending,$.blendEquation,$.blendSrc,$.blendDst,$.blendEquationAlpha,$.blendSrcAlpha,$.blendDstAlpha,$.blendColor,$.blendAlpha,$.premultipliedAlpha),a.setFunc($.depthFunc),a.setTest($.depthTest),a.setMask($.depthWrite),r.setMask($.colorWrite);const Ce=$.stencilWrite;o.setTest(Ce),Ce&&(o.setMask($.stencilWriteMask),o.setFunc($.stencilFunc,$.stencilRef,$.stencilFuncMask),o.setOp($.stencilFail,$.stencilZFail,$.stencilZPass)),rt($.polygonOffset,$.polygonOffsetFactor,$.polygonOffsetUnits),$.alphaToCoverage===!0?he(i.SAMPLE_ALPHA_TO_COVERAGE):Ee(i.SAMPLE_ALPHA_TO_COVERAGE)}function He($){D!==$&&($?i.frontFace(i.CW):i.frontFace(i.CCW),D=$)}function ot($){$!==RS?(he(i.CULL_FACE),$!==L&&($===Qm?i.cullFace(i.BACK):$===CS?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ee(i.CULL_FACE),L=$}function Tt($){$!==k&&(z&&i.lineWidth($),k=$)}function rt($,Re,de){$?(he(i.POLYGON_OFFSET_FILL),(U!==Re||O!==de)&&(U=Re,O=de,a.getReversed()&&(Re=-Re),i.polygonOffset(Re,de))):Ee(i.POLYGON_OFFSET_FILL)}function gt($){$?he(i.SCISSOR_TEST):Ee(i.SCISSOR_TEST)}function bt($){$===void 0&&($=i.TEXTURE0+X-1),te!==$&&(i.activeTexture($),te=$)}function V($,Re,de){de===void 0&&(te===null?de=i.TEXTURE0+X-1:de=te);let Ce=H[de];Ce===void 0&&(Ce={type:void 0,texture:void 0},H[de]=Ce),(Ce.type!==$||Ce.texture!==Re)&&(te!==de&&(i.activeTexture(de),te=de),i.bindTexture($,Re||Z[$]),Ce.type=$,Ce.texture=Re)}function Ke(){const $=H[te];$!==void 0&&$.type!==void 0&&(i.bindTexture($.type,null),$.type=void 0,$.texture=void 0)}function ge(){try{i.compressedTexImage2D(...arguments)}catch($){Ct("WebGLState:",$)}}function N(){try{i.compressedTexImage3D(...arguments)}catch($){Ct("WebGLState:",$)}}function w(){try{i.texSubImage2D(...arguments)}catch($){Ct("WebGLState:",$)}}function j(){try{i.texSubImage3D(...arguments)}catch($){Ct("WebGLState:",$)}}function ne(){try{i.compressedTexSubImage2D(...arguments)}catch($){Ct("WebGLState:",$)}}function oe(){try{i.compressedTexSubImage3D(...arguments)}catch($){Ct("WebGLState:",$)}}function ve(){try{i.texStorage2D(...arguments)}catch($){Ct("WebGLState:",$)}}function Me(){try{i.texStorage3D(...arguments)}catch($){Ct("WebGLState:",$)}}function le(){try{i.texImage2D(...arguments)}catch($){Ct("WebGLState:",$)}}function ce(){try{i.texImage3D(...arguments)}catch($){Ct("WebGLState:",$)}}function ye($){return d[$]!==void 0?d[$]:i.getParameter($)}function Ze($,Re){d[$]!==Re&&(i.pixelStorei($,Re),d[$]=Re)}function Ae($){Qe.equals($)===!1&&(i.scissor($.x,$.y,$.z,$.w),Qe.copy($))}function we($){it.equals($)===!1&&(i.viewport($.x,$.y,$.z,$.w),it.copy($))}function qe($,Re){let de=l.get(Re);de===void 0&&(de=new WeakMap,l.set(Re,de));let Ce=de.get($);Ce===void 0&&(Ce=i.getUniformBlockIndex(Re,$.name),de.set($,Ce))}function nt($,Re){const Ce=l.get(Re).get($);c.get(Re)!==Ce&&(i.uniformBlockBinding(Re,Ce,$.__bindingPointIndex),c.set(Re,Ce))}function st(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},te=null,H={},u={},f=new WeakMap,p=[],m=null,_=!1,g=null,x=null,T=null,b=null,S=null,M=null,A=null,v=new ct(0,0,0),E=0,P=!1,D=null,L=null,k=null,U=null,O=null,Qe.set(0,0,i.canvas.width,i.canvas.height),it.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:he,disable:Ee,bindFramebuffer:Ue,drawBuffers:Te,useProgram:ue,setBlending:Ge,setMaterial:ze,setFlipSided:He,setCullFace:ot,setLineWidth:Tt,setPolygonOffset:rt,setScissorTest:gt,activeTexture:bt,bindTexture:V,unbindTexture:Ke,compressedTexImage2D:ge,compressedTexImage3D:N,texImage2D:le,texImage3D:ce,pixelStorei:Ze,getParameter:ye,updateUBOMapping:qe,uniformBlockBinding:nt,texStorage2D:ve,texStorage3D:Me,texSubImage2D:w,texSubImage3D:j,compressedTexSubImage2D:ne,compressedTexSubImage3D:oe,scissor:Ae,viewport:we,reset:st}}function OR(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Je,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(N,w){return p?new OffscreenCanvas(N,w):Yc("canvas")}function _(N,w,j){let ne=1;const oe=ge(N);if((oe.width>j||oe.height>j)&&(ne=j/Math.max(oe.width,oe.height)),ne<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const ve=Math.floor(ne*oe.width),Me=Math.floor(ne*oe.height);u===void 0&&(u=m(ve,Me));const le=w?m(ve,Me):u;return le.width=ve,le.height=Me,le.getContext("2d").drawImage(N,0,0,ve,Me),lt("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+ve+"x"+Me+")."),le}else return"data"in N&&lt("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),N;return N}function g(N){return N.generateMipmaps}function x(N){i.generateMipmap(N)}function T(N){return N.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?i.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(N,w,j,ne,oe,ve=!1){if(N!==null){if(i[N]!==void 0)return i[N];lt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let Me;ne&&(Me=e.get("EXT_texture_norm16"),Me||lt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let le=w;if(w===i.RED&&(j===i.FLOAT&&(le=i.R32F),j===i.HALF_FLOAT&&(le=i.R16F),j===i.UNSIGNED_BYTE&&(le=i.R8),j===i.UNSIGNED_SHORT&&Me&&(le=Me.R16_EXT),j===i.SHORT&&Me&&(le=Me.R16_SNORM_EXT)),w===i.RED_INTEGER&&(j===i.UNSIGNED_BYTE&&(le=i.R8UI),j===i.UNSIGNED_SHORT&&(le=i.R16UI),j===i.UNSIGNED_INT&&(le=i.R32UI),j===i.BYTE&&(le=i.R8I),j===i.SHORT&&(le=i.R16I),j===i.INT&&(le=i.R32I)),w===i.RG&&(j===i.FLOAT&&(le=i.RG32F),j===i.HALF_FLOAT&&(le=i.RG16F),j===i.UNSIGNED_BYTE&&(le=i.RG8),j===i.UNSIGNED_SHORT&&Me&&(le=Me.RG16_EXT),j===i.SHORT&&Me&&(le=Me.RG16_SNORM_EXT)),w===i.RG_INTEGER&&(j===i.UNSIGNED_BYTE&&(le=i.RG8UI),j===i.UNSIGNED_SHORT&&(le=i.RG16UI),j===i.UNSIGNED_INT&&(le=i.RG32UI),j===i.BYTE&&(le=i.RG8I),j===i.SHORT&&(le=i.RG16I),j===i.INT&&(le=i.RG32I)),w===i.RGB_INTEGER&&(j===i.UNSIGNED_BYTE&&(le=i.RGB8UI),j===i.UNSIGNED_SHORT&&(le=i.RGB16UI),j===i.UNSIGNED_INT&&(le=i.RGB32UI),j===i.BYTE&&(le=i.RGB8I),j===i.SHORT&&(le=i.RGB16I),j===i.INT&&(le=i.RGB32I)),w===i.RGBA_INTEGER&&(j===i.UNSIGNED_BYTE&&(le=i.RGBA8UI),j===i.UNSIGNED_SHORT&&(le=i.RGBA16UI),j===i.UNSIGNED_INT&&(le=i.RGBA32UI),j===i.BYTE&&(le=i.RGBA8I),j===i.SHORT&&(le=i.RGBA16I),j===i.INT&&(le=i.RGBA32I)),w===i.RGB&&(j===i.UNSIGNED_SHORT&&Me&&(le=Me.RGB16_EXT),j===i.SHORT&&Me&&(le=Me.RGB16_SNORM_EXT),j===i.UNSIGNED_INT_5_9_9_9_REV&&(le=i.RGB9_E5),j===i.UNSIGNED_INT_10F_11F_11F_REV&&(le=i.R11F_G11F_B10F)),w===i.RGBA){const ce=ve?qc:Et.getTransfer(oe);j===i.FLOAT&&(le=i.RGBA32F),j===i.HALF_FLOAT&&(le=i.RGBA16F),j===i.UNSIGNED_BYTE&&(le=ce===zt?i.SRGB8_ALPHA8:i.RGBA8),j===i.UNSIGNED_SHORT&&Me&&(le=Me.RGBA16_EXT),j===i.SHORT&&Me&&(le=Me.RGBA16_SNORM_EXT),j===i.UNSIGNED_SHORT_4_4_4_4&&(le=i.RGBA4),j===i.UNSIGNED_SHORT_5_5_5_1&&(le=i.RGB5_A1)}return(le===i.R16F||le===i.R32F||le===i.RG16F||le===i.RG32F||le===i.RGBA16F||le===i.RGBA32F)&&e.get("EXT_color_buffer_float"),le}function S(N,w){let j;return N?w===null||w===As||w===ll?j=i.DEPTH24_STENCIL8:w===ys?j=i.DEPTH32F_STENCIL8:w===ol&&(j=i.DEPTH24_STENCIL8,lt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===As||w===ll?j=i.DEPTH_COMPONENT24:w===ys?j=i.DEPTH_COMPONENT32F:w===ol&&(j=i.DEPTH_COMPONENT16),j}function M(N,w){return g(N)===!0||N.isFramebufferTexture&&N.minFilter!==Xn&&N.minFilter!==Jn?Math.log2(Math.max(w.width,w.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?w.mipmaps.length:1}function A(N){const w=N.target;w.removeEventListener("dispose",A),E(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&d.delete(w)}function v(N){const w=N.target;w.removeEventListener("dispose",v),D(w)}function E(N){const w=n.get(N);if(w.__webglInit===void 0)return;const j=N.source,ne=f.get(j);if(ne){const oe=ne[w.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&P(N),Object.keys(ne).length===0&&f.delete(j)}n.remove(N)}function P(N){const w=n.get(N);i.deleteTexture(w.__webglTexture);const j=N.source,ne=f.get(j);delete ne[w.__cacheKey],a.memory.textures--}function D(N){const w=n.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),n.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(w.__webglFramebuffer[ne]))for(let oe=0;oe<w.__webglFramebuffer[ne].length;oe++)i.deleteFramebuffer(w.__webglFramebuffer[ne][oe]);else i.deleteFramebuffer(w.__webglFramebuffer[ne]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[ne])}else{if(Array.isArray(w.__webglFramebuffer))for(let ne=0;ne<w.__webglFramebuffer.length;ne++)i.deleteFramebuffer(w.__webglFramebuffer[ne]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ne=0;ne<w.__webglColorRenderbuffer.length;ne++)w.__webglColorRenderbuffer[ne]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[ne]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const j=N.textures;for(let ne=0,oe=j.length;ne<oe;ne++){const ve=n.get(j[ne]);ve.__webglTexture&&(i.deleteTexture(ve.__webglTexture),a.memory.textures--),n.remove(j[ne])}n.remove(N)}let L=0;function k(){L=0}function U(){return L}function O(N){L=N}function X(){const N=L;return N>=s.maxTextures&&lt("WebGLTextures: Trying to use "+(N+1)+" texture units while this GPU supports only "+s.maxTextures),L+=1,N}function z(N){const w=[];return w.push(N.wrapS),w.push(N.wrapT),w.push(N.wrapR||0),w.push(N.magFilter),w.push(N.minFilter),w.push(N.anisotropy),w.push(N.internalFormat),w.push(N.format),w.push(N.type),w.push(N.generateMipmaps),w.push(N.premultiplyAlpha),w.push(N.flipY),w.push(N.unpackAlignment),w.push(N.colorSpace),w.join()}function re(N,w){const j=n.get(N);if(N.isVideoTexture&&V(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&j.__version!==N.version){const ne=N.image;if(ne===null)lt("WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)lt("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(j,N,w);return}}else N.isExternalTexture&&(j.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,j.__webglTexture,i.TEXTURE0+w)}function q(N,w){const j=n.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&j.__version!==N.version){Ee(j,N,w);return}else N.isExternalTexture&&(j.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,j.__webglTexture,i.TEXTURE0+w)}function te(N,w){const j=n.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&j.__version!==N.version){Ee(j,N,w);return}t.bindTexture(i.TEXTURE_3D,j.__webglTexture,i.TEXTURE0+w)}function H(N,w){const j=n.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&j.__version!==N.version){Ue(j,N,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture,i.TEXTURE0+w)}const J={[od]:i.REPEAT,[zs]:i.CLAMP_TO_EDGE,[ld]:i.MIRRORED_REPEAT},se={[Xn]:i.NEAREST,[ZS]:i.NEAREST_MIPMAP_NEAREST,[Vl]:i.NEAREST_MIPMAP_LINEAR,[Jn]:i.LINEAR,[Kh]:i.LINEAR_MIPMAP_NEAREST,[Wr]:i.LINEAR_MIPMAP_LINEAR},Qe={[tw]:i.NEVER,[aw]:i.ALWAYS,[nw]:i.LESS,[Yf]:i.LEQUAL,[iw]:i.EQUAL,[jf]:i.GEQUAL,[sw]:i.GREATER,[rw]:i.NOTEQUAL};function it(N,w){if(w.type===ys&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Jn||w.magFilter===Kh||w.magFilter===Vl||w.magFilter===Wr||w.minFilter===Jn||w.minFilter===Kh||w.minFilter===Vl||w.minFilter===Wr)&&lt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(N,i.TEXTURE_WRAP_S,J[w.wrapS]),i.texParameteri(N,i.TEXTURE_WRAP_T,J[w.wrapT]),(N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY)&&i.texParameteri(N,i.TEXTURE_WRAP_R,J[w.wrapR]),i.texParameteri(N,i.TEXTURE_MAG_FILTER,se[w.magFilter]),i.texParameteri(N,i.TEXTURE_MIN_FILTER,se[w.minFilter]),w.compareFunction&&(i.texParameteri(N,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(N,i.TEXTURE_COMPARE_FUNC,Qe[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Xn||w.minFilter!==Vl&&w.minFilter!==Wr||w.type===ys&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");i.texParameterf(N,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Xe(N,w){let j=!1;N.__webglInit===void 0&&(N.__webglInit=!0,w.addEventListener("dispose",A));const ne=w.source;let oe=f.get(ne);oe===void 0&&(oe={},f.set(ne,oe));const ve=z(w);if(ve!==N.__cacheKey){oe[ve]===void 0&&(oe[ve]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,j=!0),oe[ve].usedTimes++;const Me=oe[N.__cacheKey];Me!==void 0&&(oe[N.__cacheKey].usedTimes--,Me.usedTimes===0&&P(w)),N.__cacheKey=ve,N.__webglTexture=oe[ve].texture}return j}function Z(N,w,j){return Math.floor(Math.floor(N/j)/w)}function he(N,w,j,ne){const ve=N.updateRanges;if(ve.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,j,ne,w.data);else{ve.sort((Ze,Ae)=>Ze.start-Ae.start);let Me=0;for(let Ze=1;Ze<ve.length;Ze++){const Ae=ve[Me],we=ve[Ze],qe=Ae.start+Ae.count,nt=Z(we.start,w.width,4),st=Z(Ae.start,w.width,4);we.start<=qe+1&&nt===st&&Z(we.start+we.count-1,w.width,4)===nt?Ae.count=Math.max(Ae.count,we.start+we.count-Ae.start):(++Me,ve[Me]=we)}ve.length=Me+1;const le=t.getParameter(i.UNPACK_ROW_LENGTH),ce=t.getParameter(i.UNPACK_SKIP_PIXELS),ye=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let Ze=0,Ae=ve.length;Ze<Ae;Ze++){const we=ve[Ze],qe=Math.floor(we.start/4),nt=Math.ceil(we.count/4),st=qe%w.width,$=Math.floor(qe/w.width),Re=nt,de=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,st),t.pixelStorei(i.UNPACK_SKIP_ROWS,$),t.texSubImage2D(i.TEXTURE_2D,0,st,$,Re,de,j,ne,w.data)}N.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,le),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ce),t.pixelStorei(i.UNPACK_SKIP_ROWS,ye)}}function Ee(N,w,j){let ne=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ne=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ne=i.TEXTURE_3D);const oe=Xe(N,w),ve=w.source;t.bindTexture(ne,N.__webglTexture,i.TEXTURE0+j);const Me=n.get(ve);if(ve.version!==Me.__version||oe===!0){if(t.activeTexture(i.TEXTURE0+j),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){const de=Et.getPrimaries(Et.workingColorSpace),Ce=w.colorSpace===dr?null:Et.getPrimaries(w.colorSpace),Ne=w.colorSpace===dr||de===Ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne)}t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment);let ce=_(w.image,!1,s.maxTextureSize);ce=Ke(w,ce);const ye=r.convert(w.format,w.colorSpace),Ze=r.convert(w.type);let Ae=b(w.internalFormat,ye,Ze,w.normalized,w.colorSpace,w.isVideoTexture);it(ne,w);let we;const qe=w.mipmaps,nt=w.isVideoTexture!==!0,st=Me.__version===void 0||oe===!0,$=ve.dataReady,Re=M(w,ce);if(w.isDepthTexture)Ae=S(w.format===$r,w.type),st&&(nt?t.texStorage2D(i.TEXTURE_2D,1,Ae,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,Ae,ce.width,ce.height,0,ye,Ze,null));else if(w.isDataTexture)if(qe.length>0){nt&&st&&t.texStorage2D(i.TEXTURE_2D,Re,Ae,qe[0].width,qe[0].height);for(let de=0,Ce=qe.length;de<Ce;de++)we=qe[de],nt?$&&t.texSubImage2D(i.TEXTURE_2D,de,0,0,we.width,we.height,ye,Ze,we.data):t.texImage2D(i.TEXTURE_2D,de,Ae,we.width,we.height,0,ye,Ze,we.data);w.generateMipmaps=!1}else nt?(st&&t.texStorage2D(i.TEXTURE_2D,Re,Ae,ce.width,ce.height),$&&he(w,ce,ye,Ze)):t.texImage2D(i.TEXTURE_2D,0,Ae,ce.width,ce.height,0,ye,Ze,ce.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){nt&&st&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,Ae,qe[0].width,qe[0].height,ce.depth);for(let de=0,Ce=qe.length;de<Ce;de++)if(we=qe[de],w.format!==os)if(ye!==null)if(nt){if($)if(w.layerUpdates.size>0){const Ne=k0(we.width,we.height,w.format,w.type);for(const me of w.layerUpdates){const et=we.data.subarray(me*Ne/we.data.BYTES_PER_ELEMENT,(me+1)*Ne/we.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,de,0,0,me,we.width,we.height,1,ye,et)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,de,0,0,0,we.width,we.height,ce.depth,ye,we.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,de,Ae,we.width,we.height,ce.depth,0,we.data,0,0);else lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else nt?$&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,de,0,0,0,we.width,we.height,ce.depth,ye,Ze,we.data):t.texImage3D(i.TEXTURE_2D_ARRAY,de,Ae,we.width,we.height,ce.depth,0,ye,Ze,we.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{nt&&st&&t.texStorage2D(i.TEXTURE_2D,Re,Ae,qe[0].width,qe[0].height);for(let de=0,Ce=qe.length;de<Ce;de++)we=qe[de],w.format!==os?ye!==null?nt?$&&t.compressedTexSubImage2D(i.TEXTURE_2D,de,0,0,we.width,we.height,ye,we.data):t.compressedTexImage2D(i.TEXTURE_2D,de,Ae,we.width,we.height,0,we.data):lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):nt?$&&t.texSubImage2D(i.TEXTURE_2D,de,0,0,we.width,we.height,ye,Ze,we.data):t.texImage2D(i.TEXTURE_2D,de,Ae,we.width,we.height,0,ye,Ze,we.data)}else if(w.isDataArrayTexture)if(nt){if(st&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,Ae,ce.width,ce.height,ce.depth),$)if(w.layerUpdates.size>0){const de=k0(ce.width,ce.height,w.format,w.type);for(const Ce of w.layerUpdates){const Ne=ce.data.subarray(Ce*de/ce.data.BYTES_PER_ELEMENT,(Ce+1)*de/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ce,ce.width,ce.height,1,ye,Ze,Ne)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,ye,Ze,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,ce.width,ce.height,ce.depth,0,ye,Ze,ce.data);else if(w.isData3DTexture)nt?(st&&t.texStorage3D(i.TEXTURE_3D,Re,Ae,ce.width,ce.height,ce.depth),$&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,ye,Ze,ce.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,ce.width,ce.height,ce.depth,0,ye,Ze,ce.data);else if(w.isFramebufferTexture){if(st)if(nt)t.texStorage2D(i.TEXTURE_2D,Re,Ae,ce.width,ce.height);else{let de=ce.width,Ce=ce.height;for(let Ne=0;Ne<Re;Ne++)t.texImage2D(i.TEXTURE_2D,Ne,Ae,de,Ce,0,ye,Ze,null),de>>=1,Ce>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in i){const de=i.canvas;if(de.hasAttribute("layoutsubtree")||de.setAttribute("layoutsubtree","true"),ce.parentNode!==de){de.appendChild(ce),d.add(w),de.onpaint=Ce=>{const Ne=Ce.changedElements;for(const me of d)Ne.includes(me.image)&&(me.needsUpdate=!0)},de.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ce);else{const Ne=i.RGBA,me=i.RGBA,et=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Ne,me,et,ce)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(qe.length>0){if(nt&&st){const de=ge(qe[0]);t.texStorage2D(i.TEXTURE_2D,Re,Ae,de.width,de.height)}for(let de=0,Ce=qe.length;de<Ce;de++)we=qe[de],nt?$&&t.texSubImage2D(i.TEXTURE_2D,de,0,0,ye,Ze,we):t.texImage2D(i.TEXTURE_2D,de,Ae,ye,Ze,we);w.generateMipmaps=!1}else if(nt){if(st){const de=ge(ce);t.texStorage2D(i.TEXTURE_2D,Re,Ae,de.width,de.height)}$&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ye,Ze,ce)}else t.texImage2D(i.TEXTURE_2D,0,Ae,ye,Ze,ce);g(w)&&x(ne),Me.__version=ve.version,w.onUpdate&&w.onUpdate(w)}N.__version=w.version}function Ue(N,w,j){if(w.image.length!==6)return;const ne=Xe(N,w),oe=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+j);const ve=n.get(oe);if(oe.version!==ve.__version||ne===!0){t.activeTexture(i.TEXTURE0+j);const Me=Et.getPrimaries(Et.workingColorSpace),le=w.colorSpace===dr?null:Et.getPrimaries(w.colorSpace),ce=w.colorSpace===dr||Me===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const ye=w.isCompressedTexture||w.image[0].isCompressedTexture,Ze=w.image[0]&&w.image[0].isDataTexture,Ae=[];for(let me=0;me<6;me++)!ye&&!Ze?Ae[me]=_(w.image[me],!0,s.maxCubemapSize):Ae[me]=Ze?w.image[me].image:w.image[me],Ae[me]=Ke(w,Ae[me]);const we=Ae[0],qe=r.convert(w.format,w.colorSpace),nt=r.convert(w.type),st=b(w.internalFormat,qe,nt,w.normalized,w.colorSpace),$=w.isVideoTexture!==!0,Re=ve.__version===void 0||ne===!0,de=oe.dataReady;let Ce=M(w,we);it(i.TEXTURE_CUBE_MAP,w);let Ne;if(ye){$&&Re&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,st,we.width,we.height);for(let me=0;me<6;me++){Ne=Ae[me].mipmaps;for(let et=0;et<Ne.length;et++){const We=Ne[et];w.format!==os?qe!==null?$?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et,0,0,We.width,We.height,qe,We.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et,st,We.width,We.height,0,We.data):lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et,0,0,We.width,We.height,qe,nt,We.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et,st,We.width,We.height,0,qe,nt,We.data)}}}else{if(Ne=w.mipmaps,$&&Re){Ne.length>0&&Ce++;const me=ge(Ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,st,me.width,me.height)}for(let me=0;me<6;me++)if(Ze){$?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Ae[me].width,Ae[me].height,qe,nt,Ae[me].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,st,Ae[me].width,Ae[me].height,0,qe,nt,Ae[me].data);for(let et=0;et<Ne.length;et++){const dt=Ne[et].image[me].image;$?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et+1,0,0,dt.width,dt.height,qe,nt,dt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et+1,st,dt.width,dt.height,0,qe,nt,dt.data)}}else{$?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,qe,nt,Ae[me]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,st,qe,nt,Ae[me]);for(let et=0;et<Ne.length;et++){const We=Ne[et];$?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et+1,0,0,qe,nt,We.image[me]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,et+1,st,qe,nt,We.image[me])}}}g(w)&&x(i.TEXTURE_CUBE_MAP),ve.__version=oe.version,w.onUpdate&&w.onUpdate(w)}N.__version=w.version}function Te(N,w,j,ne,oe,ve){const Me=r.convert(j.format,j.colorSpace),le=r.convert(j.type),ce=b(j.internalFormat,Me,le,j.normalized,j.colorSpace),ye=n.get(w),Ze=n.get(j);if(Ze.__renderTarget=w,!ye.__hasExternalTextures){const Ae=Math.max(1,w.width>>ve),we=Math.max(1,w.height>>ve);oe===i.TEXTURE_3D||oe===i.TEXTURE_2D_ARRAY?t.texImage3D(oe,ve,ce,Ae,we,w.depth,0,Me,le,null):t.texImage2D(oe,ve,ce,Ae,we,0,Me,le,null)}t.bindFramebuffer(i.FRAMEBUFFER,N),bt(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,oe,Ze.__webglTexture,0,gt(w)):(oe===i.TEXTURE_2D||oe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ne,oe,Ze.__webglTexture,ve),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ue(N,w,j){if(i.bindRenderbuffer(i.RENDERBUFFER,N),w.depthBuffer){const ne=w.depthTexture,oe=ne&&ne.isDepthTexture?ne.type:null,ve=S(w.stencilBuffer,oe),Me=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;bt(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(w),ve,w.width,w.height):j?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(w),ve,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,ve,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,N)}else{const ne=w.textures;for(let oe=0;oe<ne.length;oe++){const ve=ne[oe],Me=r.convert(ve.format,ve.colorSpace),le=r.convert(ve.type),ce=b(ve.internalFormat,Me,le,ve.normalized,ve.colorSpace);bt(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(w),ce,w.width,w.height):j?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(w),ce,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,ce,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function pe(N,w,j){const ne=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,N),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const oe=n.get(w.depthTexture);if(oe.__renderTarget=w,(!oe.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),ne){if(oe.__webglInit===void 0&&(oe.__webglInit=!0,w.depthTexture.addEventListener("dispose",A)),oe.__webglTexture===void 0){oe.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,oe.__webglTexture),it(i.TEXTURE_CUBE_MAP,w.depthTexture);const ye=r.convert(w.depthTexture.format),Ze=r.convert(w.depthTexture.type);let Ae;w.depthTexture.format===$s?Ae=i.DEPTH_COMPONENT24:w.depthTexture.format===$r&&(Ae=i.DEPTH24_STENCIL8);for(let we=0;we<6;we++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+we,0,Ae,w.width,w.height,0,ye,Ze,null)}}else re(w.depthTexture,0);const ve=oe.__webglTexture,Me=gt(w),le=ne?i.TEXTURE_CUBE_MAP_POSITIVE_X+j:i.TEXTURE_2D,ce=w.depthTexture.format===$r?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(w.depthTexture.format===$s)bt(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,le,ve,0,Me):i.framebufferTexture2D(i.FRAMEBUFFER,ce,le,ve,0);else if(w.depthTexture.format===$r)bt(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,le,ve,0,Me):i.framebufferTexture2D(i.FRAMEBUFFER,ce,le,ve,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function _e(N){const w=n.get(N),j=N.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==N.depthTexture){const ne=N.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ne){const oe=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ne.removeEventListener("dispose",oe)};ne.addEventListener("dispose",oe),w.__depthDisposeCallback=oe}w.__boundDepthTexture=ne}if(N.depthTexture&&!w.__autoAllocateDepthBuffer)if(j)for(let ne=0;ne<6;ne++)pe(w.__webglFramebuffer[ne],N,ne);else{const ne=N.texture.mipmaps;ne&&ne.length>0?pe(w.__webglFramebuffer[0],N,0):pe(w.__webglFramebuffer,N,0)}else if(j){w.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[ne]),w.__webglDepthbuffer[ne]===void 0)w.__webglDepthbuffer[ne]=i.createRenderbuffer(),ue(w.__webglDepthbuffer[ne],N,!1);else{const oe=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ve=w.__webglDepthbuffer[ne];i.bindRenderbuffer(i.RENDERBUFFER,ve),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,ve)}}else{const ne=N.texture.mipmaps;if(ne&&ne.length>0?t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),ue(w.__webglDepthbuffer,N,!1);else{const oe=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ve=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ve),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,ve)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(N,w,j){const ne=n.get(N);w!==void 0&&Te(ne.__webglFramebuffer,N,N.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),j!==void 0&&_e(N)}function ze(N){const w=N.texture,j=n.get(N),ne=n.get(w);N.addEventListener("dispose",v);const oe=N.textures,ve=N.isWebGLCubeRenderTarget===!0,Me=oe.length>1;if(Me||(ne.__webglTexture===void 0&&(ne.__webglTexture=i.createTexture()),ne.__version=w.version,a.memory.textures++),ve){j.__webglFramebuffer=[];for(let le=0;le<6;le++)if(w.mipmaps&&w.mipmaps.length>0){j.__webglFramebuffer[le]=[];for(let ce=0;ce<w.mipmaps.length;ce++)j.__webglFramebuffer[le][ce]=i.createFramebuffer()}else j.__webglFramebuffer[le]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){j.__webglFramebuffer=[];for(let le=0;le<w.mipmaps.length;le++)j.__webglFramebuffer[le]=i.createFramebuffer()}else j.__webglFramebuffer=i.createFramebuffer();if(Me)for(let le=0,ce=oe.length;le<ce;le++){const ye=n.get(oe[le]);ye.__webglTexture===void 0&&(ye.__webglTexture=i.createTexture(),a.memory.textures++)}if(N.samples>0&&bt(N)===!1){j.__webglMultisampledFramebuffer=i.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let le=0;le<oe.length;le++){const ce=oe[le];j.__webglColorRenderbuffer[le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,j.__webglColorRenderbuffer[le]);const ye=r.convert(ce.format,ce.colorSpace),Ze=r.convert(ce.type),Ae=b(ce.internalFormat,ye,Ze,ce.normalized,ce.colorSpace,N.isXRRenderTarget===!0),we=gt(N);i.renderbufferStorageMultisample(i.RENDERBUFFER,we,Ae,N.width,N.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,j.__webglColorRenderbuffer[le])}i.bindRenderbuffer(i.RENDERBUFFER,null),N.depthBuffer&&(j.__webglDepthRenderbuffer=i.createRenderbuffer(),ue(j.__webglDepthRenderbuffer,N,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ve){t.bindTexture(i.TEXTURE_CUBE_MAP,ne.__webglTexture),it(i.TEXTURE_CUBE_MAP,w);for(let le=0;le<6;le++)if(w.mipmaps&&w.mipmaps.length>0)for(let ce=0;ce<w.mipmaps.length;ce++)Te(j.__webglFramebuffer[le][ce],N,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ce);else Te(j.__webglFramebuffer[le],N,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);g(w)&&x(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let le=0,ce=oe.length;le<ce;le++){const ye=oe[le],Ze=n.get(ye);let Ae=i.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(Ae=N.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ae,Ze.__webglTexture),it(Ae,ye),Te(j.__webglFramebuffer,N,ye,i.COLOR_ATTACHMENT0+le,Ae,0),g(ye)&&x(Ae)}t.unbindTexture()}else{let le=i.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(le=N.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,ne.__webglTexture),it(le,w),w.mipmaps&&w.mipmaps.length>0)for(let ce=0;ce<w.mipmaps.length;ce++)Te(j.__webglFramebuffer[ce],N,w,i.COLOR_ATTACHMENT0,le,ce);else Te(j.__webglFramebuffer,N,w,i.COLOR_ATTACHMENT0,le,0);g(w)&&x(le),t.unbindTexture()}N.depthBuffer&&_e(N)}function He(N){const w=N.textures;for(let j=0,ne=w.length;j<ne;j++){const oe=w[j];if(g(oe)){const ve=T(N),Me=n.get(oe).__webglTexture;t.bindTexture(ve,Me),x(ve),t.unbindTexture()}}}const ot=[],Tt=[];function rt(N){if(N.samples>0){if(bt(N)===!1){const w=N.textures,j=N.width,ne=N.height;let oe=i.COLOR_BUFFER_BIT;const ve=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(N),le=w.length>1;if(le)for(let ye=0;ye<w.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);const ce=N.texture.mipmaps;ce&&ce.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let ye=0;ye<w.length;ye++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(oe|=i.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(oe|=i.STENCIL_BUFFER_BIT)),le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[ye]);const Ze=n.get(w[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ze,0)}i.blitFramebuffer(0,0,j,ne,0,0,j,ne,oe,i.NEAREST),c===!0&&(ot.length=0,Tt.length=0,ot.push(i.COLOR_ATTACHMENT0+ye),N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&(ot.push(ve),Tt.push(ve),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Tt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),le)for(let ye=0;ye<w.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,Me.__webglColorRenderbuffer[ye]);const Ze=n.get(w[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,Ze,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&c){const w=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function gt(N){return Math.min(s.maxSamples,N.samples)}function bt(N){const w=n.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function V(N){const w=a.render.frame;h.get(N)!==w&&(h.set(N,w),N.update())}function Ke(N,w){const j=N.colorSpace,ne=N.format,oe=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||j!==Xc&&j!==dr&&(Et.getTransfer(j)===zt?(ne!==os||oe!==Ai)&&lt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ct("WebGLTextures: Unsupported texture color space:",j)),w}function ge(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(l.width=N.naturalWidth||N.width,l.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(l.width=N.displayWidth,l.height=N.displayHeight):(l.width=N.width,l.height=N.height),l}this.allocateTextureUnit=X,this.resetTextureUnits=k,this.getTextureUnits=U,this.setTextureUnits=O,this.setTexture2D=re,this.setTexture2DArray=q,this.setTexture3D=te,this.setTextureCube=H,this.rebindTextures=Ge,this.setupRenderTarget=ze,this.updateRenderTargetMipmap=He,this.updateMultisampleRenderTarget=rt,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=bt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function BR(i,e){function t(n,s=dr){let r;const a=Et.getTransfer(s);if(n===Ai)return i.UNSIGNED_BYTE;if(n===Gf)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Wf)return i.UNSIGNED_SHORT_5_5_5_1;if(n===q_)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Y_)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===$_)return i.BYTE;if(n===X_)return i.SHORT;if(n===ol)return i.UNSIGNED_SHORT;if(n===Vf)return i.INT;if(n===As)return i.UNSIGNED_INT;if(n===ys)return i.FLOAT;if(n===ls)return i.HALF_FLOAT;if(n===j_)return i.ALPHA;if(n===K_)return i.RGB;if(n===os)return i.RGBA;if(n===$s)return i.DEPTH_COMPONENT;if(n===$r)return i.DEPTH_STENCIL;if(n===Z_)return i.RED;if(n===$f)return i.RED_INTEGER;if(n===sa)return i.RG;if(n===Xf)return i.RG_INTEGER;if(n===qf)return i.RGBA_INTEGER;if(n===Ec||n===Tc||n===Ac||n===Rc)if(a===zt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ec)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Tc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ac)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Rc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ec)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Tc)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ac)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Rc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===cd||n===hd||n===ud||n===dd)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===cd)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===hd)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ud)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===dd)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fd||n===pd||n===md||n===gd||n===_d||n===Wc||n===xd)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===fd||n===pd)return a===zt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===md)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===gd)return r.COMPRESSED_R11_EAC;if(n===_d)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Wc)return r.COMPRESSED_RG11_EAC;if(n===xd)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===vd||n===bd||n===Md||n===yd||n===Sd||n===wd||n===Ed||n===Td||n===Ad||n===Rd||n===Cd||n===Ld||n===Pd||n===Dd)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===vd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===bd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Md)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===yd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Sd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===wd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ed)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Td)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ad)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Rd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Cd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ld)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Pd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Dd)return a===zt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===kd||n===Nd||n===Id)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===kd)return a===zt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Nd)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Id)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ud||n===Fd||n===$c||n===Od)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ud)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Fd)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$c)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Od)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ll?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const zR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,HR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class VR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new ax(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Pi({vertexShader:zR,fragmentShader:HR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new hi(new xo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class GR extends yr{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,p=null;const m=typeof XRWebGLBinding<"u",_=new VR,g={},x=t.getContextAttributes();let T=null,b=null;const S=[],M=[],A=new Je;let v=null,E=null;const P=new li;P.viewport=new ln;const D=new li;D.viewport=new ln;const L=[P,D],k=new qw;let U=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let he=S[Z];return he===void 0&&(he=new su,S[Z]=he),he.getTargetRaySpace()},this.getControllerGrip=function(Z){let he=S[Z];return he===void 0&&(he=new su,S[Z]=he),he.getGripSpace()},this.getHand=function(Z){let he=S[Z];return he===void 0&&(he=new su,S[Z]=he),he.getHandSpace()};function X(Z){const he=M.indexOf(Z.inputSource);if(he===-1)return;const Ee=S[he];Ee!==void 0&&(Ee.update(Z.inputSource,Z.frame,l||a),Ee.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",re);for(let Z=0;Z<S.length;Z++){const he=M[Z];he!==null&&(M[Z]=null,S[Z].disconnect(he))}U=null,O=null,_.reset();for(const Z in g)delete g[Z];if(e.setRenderTarget(T),f=null,u=null,d=null,s=null,b=null,Xe.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(A.width,A.height,!1),E!==null){const Z=E.camera;Z.fov=E.fov,Z.zoom=E.zoom,Z.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&lt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&lt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&m&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",z),s.addEventListener("inputsourceschange",re),x.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(A),m&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,Ue=null,Te=null;x.depth&&(Te=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ee=x.stencil?$r:$s,Ue=x.stencil?ll:As);const ue={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ue),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),b=new Hi(u.textureWidth,u.textureHeight,{format:os,type:Ai,depthTexture:new hl(u.textureWidth,u.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const Ee={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Ee),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Hi(f.framebufferWidth,f.framebufferHeight,{format:os,type:Ai,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Xe.setContext(s),Xe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function re(Z){for(let he=0;he<Z.removed.length;he++){const Ee=Z.removed[he],Ue=M.indexOf(Ee);Ue>=0&&(M[Ue]=null,S[Ue].disconnect(Ee))}for(let he=0;he<Z.added.length;he++){const Ee=Z.added[he];let Ue=M.indexOf(Ee);if(Ue===-1){for(let ue=0;ue<S.length;ue++)if(ue>=M.length){M.push(Ee),Ue=ue;break}else if(M[ue]===null){M[ue]=Ee,Ue=ue;break}if(Ue===-1)break}const Te=S[Ue];Te&&Te.connect(Ee)}}const q=new Y,te=new Y;function H(Z,he,Ee){q.setFromMatrixPosition(he.matrixWorld),te.setFromMatrixPosition(Ee.matrixWorld);const Ue=q.distanceTo(te),Te=he.projectionMatrix.elements,ue=Ee.projectionMatrix.elements,pe=Te[14]/(Te[10]-1),_e=Te[14]/(Te[10]+1),Ge=(Te[9]+1)/Te[5],ze=(Te[9]-1)/Te[5],He=(Te[8]-1)/Te[0],ot=(ue[8]+1)/ue[0],Tt=pe*He,rt=pe*ot,gt=Ue/(-He+ot),bt=gt*-He;if(he.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(bt),Z.translateZ(gt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Te[10]===-1)Z.projectionMatrix.copy(he.projectionMatrix),Z.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const V=pe+gt,Ke=_e+gt,ge=Tt-bt,N=rt+(Ue-bt),w=Ge*_e/Ke*V,j=ze*_e/Ke*V;Z.projectionMatrix.makePerspective(ge,N,w,j,V,Ke),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function J(Z,he){he===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(he.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let he=Z.near,Ee=Z.far;_.texture!==null&&(_.depthNear>0&&(he=_.depthNear),_.depthFar>0&&(Ee=_.depthFar)),k.near=D.near=P.near=he,k.far=D.far=P.far=Ee,(U!==k.near||O!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),U=k.near,O=k.far),k.layers.mask=Z.layers.mask|6,P.layers.mask=k.layers.mask&-5,D.layers.mask=k.layers.mask&-3;const Ue=Z.parent,Te=k.cameras;J(k,Ue);for(let ue=0;ue<Te.length;ue++)J(Te[ue],Ue);Te.length===2?H(k,P,D):k.projectionMatrix.copy(P.projectionMatrix),E===null&&Z.isPerspectiveCamera&&(E={camera:Z,fov:Z.fov,zoom:Z.zoom}),se(Z,k,Ue)};function se(Z,he,Ee){Ee===null?Z.matrix.copy(he.matrixWorld):(Z.matrix.copy(Ee.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(he.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(he.projectionMatrix),Z.projectionMatrixInverse.copy(he.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=zd*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(Z){c=Z,u!==null&&(u.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(k)},this.getCameraTexture=function(Z){return g[Z]};let Qe=null;function it(Z,he){if(h=he.getViewerPose(l||a),p=he,h!==null){const Ee=h.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let Ue=!1;Ee.length!==k.cameras.length&&(k.cameras.length=0,Ue=!0);for(let _e=0;_e<Ee.length;_e++){const Ge=Ee[_e];let ze=null;if(f!==null)ze=f.getViewport(Ge);else{const ot=d.getViewSubImage(u,Ge);ze=ot.viewport,_e===0&&(e.setRenderTargetTextures(b,ot.colorTexture,ot.depthStencilTexture),e.setRenderTarget(b))}let He=L[_e];He===void 0&&(He=new li,He.layers.enable(_e),He.viewport=new ln,L[_e]=He),He.matrix.fromArray(Ge.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(Ge.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(ze.x,ze.y,ze.width,ze.height),_e===0&&(k.matrix.copy(He.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Ue===!0&&k.cameras.push(He)}const Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&m){d=n.getBinding();const _e=d.getDepthInformation(Ee[0]);_e&&_e.isValid&&_e.texture&&_.init(_e,s.renderState)}if(Te&&Te.includes("camera-access")&&m){e.state.unbindTexture(),d=n.getBinding();for(let _e=0;_e<Ee.length;_e++){const Ge=Ee[_e].camera;if(Ge){let ze=g[Ge];ze||(ze=new ax,g[Ge]=ze);const He=d.getCameraImage(Ge);ze.sourceTexture=He}}}}for(let Ee=0;Ee<S.length;Ee++){const Ue=M[Ee],Te=S[Ee];Ue!==null&&Te!==void 0&&Te.update(Ue,he,l||a)}Qe&&Qe(Z,he),he.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:he}),p=null}const Xe=new fx;Xe.setAnimationLoop(it),this.setAnimationLoop=function(Z){Qe=Z},this.dispose=function(){}}}const WR=new Kt,bx=new ut;bx.set(-1,0,0,0,1,0,0,0,1);function $R(i,e){function t(_,g){_.matrixAutoUpdate===!0&&_.updateMatrix(),g.value.copy(_.matrix)}function n(_,g){g.color.getRGB(_.fogColor.value,ox(i)),g.isFog?(_.fogNear.value=g.near,_.fogFar.value=g.far):g.isFogExp2&&(_.fogDensity.value=g.density)}function s(_,g,x,T,b){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(_,g):g.isMeshLambertMaterial?(r(_,g),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(_,g),d(_,g)):g.isMeshPhongMaterial?(r(_,g),h(_,g),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(_,g),u(_,g),g.isMeshPhysicalMaterial&&f(_,g,b)):g.isMeshMatcapMaterial?(r(_,g),p(_,g)):g.isMeshDepthMaterial?r(_,g):g.isMeshDistanceMaterial?(r(_,g),m(_,g)):g.isMeshNormalMaterial?r(_,g):g.isLineBasicMaterial?(a(_,g),g.isLineDashedMaterial&&o(_,g)):g.isPointsMaterial?c(_,g,x,T):g.isSpriteMaterial?l(_,g):g.isShadowMaterial?(_.color.value.copy(g.color),_.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(_,g){_.opacity.value=g.opacity,g.color&&_.diffuse.value.copy(g.color),g.emissive&&_.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.bumpMap&&(_.bumpMap.value=g.bumpMap,t(g.bumpMap,_.bumpMapTransform),_.bumpScale.value=g.bumpScale,g.side===mi&&(_.bumpScale.value*=-1)),g.normalMap&&(_.normalMap.value=g.normalMap,t(g.normalMap,_.normalMapTransform),_.normalScale.value.copy(g.normalScale),g.side===mi&&_.normalScale.value.negate()),g.displacementMap&&(_.displacementMap.value=g.displacementMap,t(g.displacementMap,_.displacementMapTransform),_.displacementScale.value=g.displacementScale,_.displacementBias.value=g.displacementBias),g.emissiveMap&&(_.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,_.emissiveMapTransform)),g.specularMap&&(_.specularMap.value=g.specularMap,t(g.specularMap,_.specularMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest);const x=e.get(g),T=x.envMap,b=x.envMapRotation;T&&(_.envMap.value=T,_.envMapRotation.value.setFromMatrix4(WR.makeRotationFromEuler(b)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&_.envMapRotation.value.premultiply(bx),_.reflectivity.value=g.reflectivity,_.ior.value=g.ior,_.refractionRatio.value=g.refractionRatio),g.lightMap&&(_.lightMap.value=g.lightMap,_.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,_.lightMapTransform)),g.aoMap&&(_.aoMap.value=g.aoMap,_.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,_.aoMapTransform))}function a(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform))}function o(_,g){_.dashSize.value=g.dashSize,_.totalSize.value=g.dashSize+g.gapSize,_.scale.value=g.scale}function c(_,g,x,T){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.size.value=g.size*x,_.scale.value=T*.5,g.map&&(_.map.value=g.map,t(g.map,_.uvTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function l(_,g){_.diffuse.value.copy(g.color),_.opacity.value=g.opacity,_.rotation.value=g.rotation,g.map&&(_.map.value=g.map,t(g.map,_.mapTransform)),g.alphaMap&&(_.alphaMap.value=g.alphaMap,t(g.alphaMap,_.alphaMapTransform)),g.alphaTest>0&&(_.alphaTest.value=g.alphaTest)}function h(_,g){_.specular.value.copy(g.specular),_.shininess.value=Math.max(g.shininess,1e-4)}function d(_,g){g.gradientMap&&(_.gradientMap.value=g.gradientMap)}function u(_,g){_.metalness.value=g.metalness,g.metalnessMap&&(_.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,_.metalnessMapTransform)),_.roughness.value=g.roughness,g.roughnessMap&&(_.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,_.roughnessMapTransform)),g.envMap&&(_.envMapIntensity.value=g.envMapIntensity)}function f(_,g,x){_.ior.value=g.ior,g.sheen>0&&(_.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),_.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(_.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,_.sheenColorMapTransform)),g.sheenRoughnessMap&&(_.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,_.sheenRoughnessMapTransform))),g.clearcoat>0&&(_.clearcoat.value=g.clearcoat,_.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(_.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,_.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(_.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===mi&&_.clearcoatNormalScale.value.negate())),g.dispersion>0&&(_.dispersion.value=g.dispersion),g.retroreflectivity>0&&(_.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(_.iridescence.value=g.iridescence,_.iridescenceIOR.value=g.iridescenceIOR,_.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(_.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,_.iridescenceMapTransform)),g.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),g.transmission>0&&(_.transmission.value=g.transmission,_.transmissionSamplerMap.value=x.texture,_.transmissionSamplerSize.value.set(x.width,x.height),g.transmissionMap&&(_.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,_.transmissionMapTransform)),_.thickness.value=g.thickness,g.thicknessMap&&(_.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=g.attenuationDistance,_.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(_.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(_.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=g.specularIntensity,_.specularColor.value.copy(g.specularColor),g.specularColorMap&&(_.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,_.specularColorMapTransform)),g.specularIntensityMap&&(_.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,_.specularIntensityMapTransform))}function p(_,g){g.matcap&&(_.matcap.value=g.matcap)}function m(_,g){const x=e.get(g).light;_.referencePosition.value.setFromMatrixPosition(x.matrixWorld),_.nearDistance.value=x.shadow.camera.near,_.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function XR(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,S){const M=S.program;n.uniformBlockBinding(b,M)}function l(b,S){let M=s[b.id];M===void 0&&(_(b),M=h(b),s[b.id]=M,b.addEventListener("dispose",x));const A=S.program;n.updateUBOMapping(b,A);const v=e.render.frame;r[b.id]!==v&&(u(b),r[b.id]=v)}function h(b){const S=d();b.__bindingPointIndex=S;const M=i.createBuffer(),A=b.__size,v=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,A,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,M),M}function d(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return Ct("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(b){const S=s[b.id],M=b.uniforms,A=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let v=0,E=M.length;v<E;v++){const P=M[v];if(Array.isArray(P))for(let D=0,L=P.length;D<L;D++)f(P[D],v,D,A);else f(P,v,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,S,M,A){if(m(b,S,M,A)===!0){const v=b.__offset,E=b.value;if(Array.isArray(E)){let P=0;for(let D=0;D<E.length;D++){const L=E[D],k=g(L);p(L,b.__data,P),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(P+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,b.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,b.__data)}}function p(b,S,M){typeof b=="number"||typeof b=="boolean"?S[0]=b:b.isMatrix3?(S[0]=b.elements[0],S[1]=b.elements[1],S[2]=b.elements[2],S[3]=0,S[4]=b.elements[3],S[5]=b.elements[4],S[6]=b.elements[5],S[7]=0,S[8]=b.elements[6],S[9]=b.elements[7],S[10]=b.elements[8],S[11]=0):ArrayBuffer.isView(b)?S.set(new b.constructor(b.buffer,b.byteOffset,S.length)):b.toArray(S,M)}function m(b,S,M,A){const v=b.value,E=S+"_"+M;if(A[E]===void 0)return typeof v=="number"||typeof v=="boolean"?A[E]=v:ArrayBuffer.isView(v)?A[E]=v.slice():A[E]=v.clone(),!0;{const P=A[E];if(typeof v=="number"||typeof v=="boolean"){if(P!==v)return A[E]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(P.equals(v)===!1)return P.copy(v),!0}}return!1}function _(b){const S=b.uniforms;let M=0;const A=16;for(let E=0,P=S.length;E<P;E++){const D=Array.isArray(S[E])?S[E]:[S[E]];for(let L=0,k=D.length;L<k;L++){const U=D[L],O=Array.isArray(U.value)?U.value:[U.value];for(let X=0,z=O.length;X<z;X++){const re=O[X],q=g(re),te=M%A,H=te%q.boundary,J=te+H;M+=H,J!==0&&A-J<q.storage&&(M+=A-J),U.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=M,M+=q.storage}}}const v=M%A;return v>0&&(M+=A-v),b.__size=M,b.__cache={},this}function g(b){const S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?lt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(S.boundary=16,S.storage=b.byteLength):lt("WebGLRenderer: Unsupported uniform value type.",b),S}function x(b){const S=b.target;S.removeEventListener("dispose",x);const M=a.indexOf(S.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function T(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:c,update:l,dispose:T}}const qR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let vs=null;function YR(){return vs===null&&(vs=new Nw(qR,16,16,sa,ls),vs.name="DFG_LUT",vs.minFilter=Jn,vs.magFilter=Jn,vs.wrapS=zs,vs.wrapT=zs,vs.generateMipmaps=!1,vs.needsUpdate=!0),vs}class vh{constructor(e={}){const{canvas:t=cw(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Ai}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const m=f,_=new Set([qf,Xf,$f]),g=new Set([Ai,As,ol,ll,Gf,Wf]),x=new Uint32Array(4),T=new Int32Array(4),b=new Y;let S=null,M=null;const A=[],v=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Es,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let D=!1,L=null,k=null,U=null,O=null;this._outputColorSpace=ai;let X=0,z=0,re=null,q=-1,te=null;const H=new ln,J=new ln;let se=null;const Qe=new ct(0);let it=0,Xe=t.width,Z=t.height,he=1,Ee=null,Ue=null;const Te=new ln(0,0,Xe,Z),ue=new ln(0,0,Xe,Z);let pe=!1;const _e=new Jf;let Ge=!1,ze=!1;const He=new Kt,ot=new Y,Tt=new ln,rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function bt(){return re===null?he:1}let V=n;function Ke(R,G){return t.getContext(R,G)}let ge,N,w,j,ne,oe,ve,Me,le,ce,ye,Ze,Ae,we,qe,nt,st,$,Re,de,Ce,Ne,me;try{const R={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Nf}`),t.addEventListener("webglcontextlost",dt,!1),t.addEventListener("webglcontextrestored",_t,!1),t.addEventListener("webglcontextcreationerror",Dn,!1),V===null){const G="webgl2";if(V=Ke(G,R),V===null)throw Ke(G)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}et()}catch(R){throw t.removeEventListener("webglcontextlost",dt,!1),t.removeEventListener("webglcontextrestored",_t,!1),t.removeEventListener("webglcontextcreationerror",Dn,!1),Ct("WebGLRenderer: "+R.message),R}function et(){ge=new YA(V),ge.init(),Ce=new BR(V,ge),N=new OA(V,ge,e,Ce),w=new FR(V,ge),N.reversedDepthBuffer&&u&&w.buffers.depth.setReversed(!0),k=V.createFramebuffer(),U=V.createFramebuffer(),O=V.createFramebuffer(),j=new ZA(V),ne=new SR,oe=new OR(V,ge,w,ne,N,Ce,j),ve=new qA(P),Me=new Qw(V),Ne=new UA(V,Me),le=new jA(V,Me,j,Ne),ce=new QA(V,le,Me,Ne,j),$=new JA(V,N,oe),qe=new BA(ne),ye=new yR(P,ve,ge,N,Ne,qe),Ze=new $R(P,ne),Ae=new ER,we=new PR(ge),st=new IA(P,ve,w,ce,p,c),nt=new UR(P,ce,N),me=new XR(V,j,N,w),Re=new FA(V,ge,j),de=new KA(V,ge,j),j.programs=ye.programs,P.capabilities=N,P.extensions=ge,P.properties=ne,P.renderLists=Ae,P.shadowMap=nt,P.state=w,P.info=j}m!==Ai&&(E=new t2(m,t.width,t.height,o,s,r));const We=new GR(P,V);this.xr=We,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const R=ge.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=ge.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(R){R!==void 0&&(he=R,this.setSize(Xe,Z,!1))},this.getSize=function(R){return R.set(Xe,Z)},this.setSize=function(R,G,ae=!0){if(We.isPresenting){lt("WebGLRenderer: Can't change size while VR device is presenting.");return}Xe=R,Z=G,t.width=Math.floor(R*he),t.height=Math.floor(G*he),ae===!0&&(t.style.width=R+"px",t.style.height=G+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,R,G)},this.getDrawingBufferSize=function(R){return R.set(Xe*he,Z*he).floor()},this.setDrawingBufferSize=function(R,G,ae){Xe=R,Z=G,he=ae,t.width=Math.floor(R*ae),t.height=Math.floor(G*ae),this.setViewport(0,0,R,G)},this.setEffects=function(R){if(m===Ai){Ct("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let G=0;G<R.length;G++)if(R[G].isOutputPass===!0){lt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(H)},this.getViewport=function(R){return R.copy(Te)},this.setViewport=function(R,G,ae,Q){R.isVector4?Te.set(R.x,R.y,R.z,R.w):Te.set(R,G,ae,Q),w.viewport(H.copy(Te).multiplyScalar(he).round())},this.getScissor=function(R){return R.copy(ue)},this.setScissor=function(R,G,ae,Q){R.isVector4?ue.set(R.x,R.y,R.z,R.w):ue.set(R,G,ae,Q),w.scissor(J.copy(ue).multiplyScalar(he).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(R){w.setScissorTest(pe=R)},this.setOpaqueSort=function(R){Ee=R},this.setTransparentSort=function(R){Ue=R},this.getClearColor=function(R){return R.copy(st.getClearColor())},this.setClearColor=function(){st.setClearColor(...arguments)},this.getClearAlpha=function(){return st.getClearAlpha()},this.setClearAlpha=function(){st.setClearAlpha(...arguments)},this.clear=function(R=!0,G=!0,ae=!0){let Q=0;if(R){let ee=!1;if(re!==null){const Pe=re.texture.format;ee=_.has(Pe)}if(ee){const Pe=re.texture.type,Fe=g.has(Pe),Le=st.getClearColor(),De=st.getClearAlpha(),je=Le.r,ft=Le.g,xt=Le.b;Fe?(x[0]=je,x[1]=ft,x[2]=xt,x[3]=De,V.clearBufferuiv(V.COLOR,0,x)):(T[0]=je,T[1]=ft,T[2]=xt,T[3]=De,V.clearBufferiv(V.COLOR,0,T))}else Q|=V.COLOR_BUFFER_BIT}G&&(Q|=V.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ae&&(Q|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Q!==0&&V.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),L=R},this.dispose=function(){t.removeEventListener("webglcontextlost",dt,!1),t.removeEventListener("webglcontextrestored",_t,!1),t.removeEventListener("webglcontextcreationerror",Dn,!1),st.dispose(),Ae.dispose(),we.dispose(),ne.dispose(),ve.dispose(),ce.dispose(),Ne.dispose(),me.dispose(),ye.dispose(),We.dispose(),We.removeEventListener("sessionstart",Sl),We.removeEventListener("sessionend",wl),Qn.stop()};function dt(R){R.preventDefault(),s0("WebGLRenderer: Context Lost."),D=!0}function _t(){s0("WebGLRenderer: Context Restored."),D=!1;const R=j.autoReset,G=nt.enabled,ae=nt.autoUpdate,Q=nt.needsUpdate,ee=nt.type;et(),j.autoReset=R,nt.enabled=G,nt.autoUpdate=ae,nt.needsUpdate=Q,nt.type=ee}function Dn(R){Ct("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function zn(R){const G=R.target;G.removeEventListener("dispose",zn),ui(G)}function ui(R){qs(R),ne.remove(R)}function qs(R){const G=ne.get(R).programs;G!==void 0&&(G.forEach(function(ae){ye.releaseProgram(ae)}),R.isShaderMaterial&&ye.releaseShaderCache(R))}this.renderBufferDirect=function(R,G,ae,Q,ee,Pe){G===null&&(G=rt);const Fe=ee.isMesh&&ee.matrixWorld.determinantAffine()<0,Le=wr(R,G,ae,Q,ee);w.setMaterial(Q,Fe);let De=ae.index,je=1;if(Q.wireframe===!0){if(De=le.getWireframeAttribute(ae),De===void 0)return;je=2}const ft=ae.drawRange,xt=ae.attributes.position;let Ye=ft.start*je,Lt=(ft.start+ft.count)*je;Pe!==null&&(Ye=Math.max(Ye,Pe.start*je),Lt=Math.min(Lt,(Pe.start+Pe.count)*je)),De!==null?(Ye=Math.max(Ye,0),Lt=Math.min(Lt,De.count)):xt!=null&&(Ye=Math.max(Ye,0),Lt=Math.min(Lt,xt.count));const un=Lt-Ye;if(un<0||un===1/0)return;Ne.setup(ee,Q,Le,ae,De);let Wt,Ft=Re;if(De!==null&&(Wt=Me.get(De),Ft=de,Ft.setIndex(Wt)),ee.isMesh)Q.wireframe===!0?(w.setLineWidth(Q.wireframeLinewidth*bt()),Ft.setMode(V.LINES)):Ft.setMode(V.TRIANGLES);else if(ee.isLine){let Sn=Q.linewidth;Sn===void 0&&(Sn=1),w.setLineWidth(Sn*bt()),ee.isLineSegments?Ft.setMode(V.LINES):ee.isLineLoop?Ft.setMode(V.LINE_LOOP):Ft.setMode(V.LINE_STRIP)}else ee.isPoints?Ft.setMode(V.POINTS):ee.isSprite&&Ft.setMode(V.TRIANGLES);if(ee.isBatchedMesh)if(ge.get("WEBGL_multi_draw"))Ft.renderMultiDraw(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount);else{const Sn=ee._multiDrawStarts,Ve=ee._multiDrawCounts,kn=ee._multiDrawCount,Mt=De?Me.get(De).bytesPerElement:1,Hn=ne.get(Q).currentProgram.getUniforms();for(let ei=0;ei<kn;ei++)Hn.setValue(V,"_gl_DrawID",ei),Ft.render(Sn[ei]/Mt,Ve[ei])}else if(ee.isInstancedMesh)Ft.renderInstances(Ye,un,ee.count);else if(ae.isInstancedBufferGeometry){const Sn=ae._maxInstanceCount!==void 0?ae._maxInstanceCount:1/0,Ve=Math.min(ae.instanceCount,Sn);Ft.renderInstances(Ye,un,Ve)}else Ft.render(Ye,un)};function Rs(R,G,ae,Q){L!==null&&R.isNodeMaterial&&L.setObject(Q,R),Ge===!0&&qe.setState(R,ae,!1),R.transparent===!0&&R.side===Os&&R.forceSinglePass===!1?(R.side=mi,R.needsUpdate=!0,an(R,G,Q),R.side=na,R.needsUpdate=!0,an(R,G,Q),R.side=Os):an(R,G,Q)}this.compile=function(R,G,ae=null){ae===null&&(ae=R),L!==null&&L.renderStart(R,G,ae),M=we.get(ae),M.init(G),v.push(M),ae.traverseVisible(function(ee){ee.isLight&&ee.layers.test(G.layers)&&(M.pushLight(ee),ee.castShadow&&M.pushShadow(ee))}),R!==ae&&R.traverseVisible(function(ee){ee.isLight&&ee.layers.test(G.layers)&&(M.pushLight(ee),ee.castShadow&&M.pushShadow(ee))}),M.setupLights(),L!==null&&L.updateLights(M.state.lightsArray),ze=this.localClippingEnabled,Ge=qe.init(this.clippingPlanes,ze),Ge===!0&&qe.setGlobalState(this.clippingPlanes,G),L!==null&&nt.render(M.state.shadowsArray,ae,G);const Q=new Set;return R.traverse(function(ee){if(!(ee.isMesh||ee.isPoints||ee.isLine||ee.isSprite))return;const Pe=ee.material;if(Pe)if(Array.isArray(Pe))for(let Fe=0;Fe<Pe.length;Fe++){const Le=Pe[Fe];Rs(Le,ae,G,ee),Q.add(Le)}else Rs(Pe,ae,G,ee),Q.add(Pe)}),M=v.pop(),L!==null&&L.renderEnd(),Q},this.compileAsync=function(R,G,ae=null){const Q=this.compile(R,G,ae);return new Promise(ee=>{function Pe(){if(Q.forEach(function(Fe){const De=ne.get(Fe).currentProgram;(De===void 0||De.isReady())&&Q.delete(Fe)}),Q.size===0){ee(R);return}setTimeout(Pe,10)}ge.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let ca=null;function yl(R){ca&&ca(R)}function Sl(){Qn.stop()}function wl(){Qn.start()}const Qn=new fx;Qn.setAnimationLoop(yl),typeof self<"u"&&Qn.setContext(self),this.setAnimationLoop=function(R){ca=R,We.setAnimationLoop(R),R===null?Qn.stop():Qn.start()},We.addEventListener("sessionstart",Sl),We.addEventListener("sessionend",wl),this.render=function(R,G){if(G!==void 0&&G.isCamera!==!0){Ct("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;L!==null&&L.renderStart(R,G);const ae=We.enabled===!0&&We.isPresenting===!0,Q=E!==null&&(re===null||ae)&&E.begin(P,re);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),We.enabled===!0&&We.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(We.cameraAutoUpdate===!0&&We.updateCamera(G),G=We.getCamera()),R.isScene===!0&&R.onBeforeRender(P,R,G,re),M=we.get(R,v.length),M.init(G),M.state.textureUnits=oe.getTextureUnits(),v.push(M),He.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),_e.setFromProjectionMatrix(He,Ss,G.reversedDepth),ze=this.localClippingEnabled,Ge=qe.init(this.clippingPlanes,ze),S=Ae.get(R,A.length),S.init(),A.push(S),We.enabled===!0&&We.isPresenting===!0){const Fe=P.xr.getDepthSensingMesh();Fe!==null&&Mo(Fe,G,-1/0,P.sortObjects)}Mo(R,G,0,P.sortObjects),S.finish(),L!==null&&L.updateLights(M.state.lightsArray),P.sortObjects===!0&&S.sort(Ee,Ue),gt=We.enabled===!1||We.isPresenting===!1||We.hasDepthSensing()===!1,gt&&st.addToRenderList(S,R),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ge===!0&&qe.beginShadows();const ee=M.state.shadowsArray;if(nt.render(ee,R,G),Ge===!0&&qe.endShadows(),(Q&&E.hasRenderPass())===!1){const Fe=S.opaque,Le=S.transmissive;if(M.setupLights(),G.isArrayCamera){const De=G.cameras;if(Le.length>0)for(let je=0,ft=De.length;je<ft;je++){const xt=De[je];yo(Fe,Le,R,xt)}gt&&st.render(R);for(let je=0,ft=De.length;je<ft;je++){const xt=De[je];Ys(S,R,xt,xt.viewport)}}else Le.length>0&&yo(Fe,Le,R,G),gt&&st.render(R),Ys(S,R,G)}re!==null&&z===0&&(oe.updateMultisampleRenderTarget(re),oe.updateRenderTargetMipmap(re)),Q&&E.end(P),R.isScene===!0&&R.onAfterRender(P,R,G),Ne.resetDefaultState(),q=-1,te=null,v.pop(),v.length>0?(M=v[v.length-1],oe.setTextureUnits(M.state.textureUnits),Ge===!0&&qe.setGlobalState(P.clippingPlanes,M.state.camera)):M=null,A.pop(),A.length>0?S=A[A.length-1]:S=null,L!==null&&L.renderEnd()};function Mo(R,G,ae,Q){if(R.visible===!1)return;if(R.layers.test(G.layers)){if(R.isGroup)ae=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(G);else if(R.isLightProbeGrid)M.pushLightProbeGrid(R);else if(R.isLight)M.pushLight(R),R.castShadow&&M.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||R.intersectsFrustum(_e)){Q&&Tt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(He);const Fe=ce.update(R),Le=R.material;Le.visible&&S.push(R,Fe,Le,ae,Tt.z,null,G)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||R.intersectsFrustum(_e))){const Fe=ce.update(R),Le=R.material;if(Q&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Tt.copy(R.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),Tt.copy(Fe.boundingSphere.center)),Tt.applyMatrix4(R.matrixWorld).applyMatrix4(He)),Array.isArray(Le)){const De=Fe.groups;for(let je=0,ft=De.length;je<ft;je++){const xt=De[je],Ye=Le[xt.materialIndex];Ye&&Ye.visible&&S.push(R,Fe,Ye,ae,Tt.z,xt,G)}}else Le.visible&&S.push(R,Fe,Le,ae,Tt.z,null,G)}}const Pe=R.children;for(let Fe=0,Le=Pe.length;Fe<Le;Fe++)Mo(Pe[Fe],G,ae,Q)}function Ys(R,G,ae,Q){const{opaque:ee,transmissive:Pe,transparent:Fe}=R;M.setupLightsView(ae),Ge===!0&&qe.setGlobalState(P.clippingPlanes,ae),Q&&w.viewport(H.copy(Q)),ee.length>0&&gi(ee,G,ae),Pe.length>0&&gi(Pe,G,ae),Fe.length>0&&gi(Fe,G,ae),w.buffers.depth.setTest(!0),w.buffers.depth.setMask(!0),w.buffers.color.setMask(!0),w.setPolygonOffset(!1)}function yo(R,G,ae,Q){if((ae.isScene===!0?ae.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[Q.id]===void 0){const Ye=ge.has("EXT_color_buffer_half_float")||ge.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[Q.id]=new Hi(1,1,{generateMipmaps:!0,type:Ye?ls:Ai,minFilter:Wr,samples:Math.max(4,N.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Et.workingColorSpace})}const Pe=M.state.transmissionRenderTarget[Q.id],Fe=Q.viewport||H;Pe.setSize(Fe.z*P.transmissionResolutionScale,Fe.w*P.transmissionResolutionScale);const Le=P.getRenderTarget(),De=P.getActiveCubeFace(),je=P.getActiveMipmapLevel();P.setRenderTarget(Pe),P.getClearColor(Qe),it=P.getClearAlpha(),it<1&&P.setClearColor(16777215,.5),P.clear(),gt&&st.render(ae);const ft=P.toneMapping;P.toneMapping=Es;const xt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),M.setupLightsView(Q),Ge===!0&&qe.setGlobalState(P.clippingPlanes,Q),gi(R,ae,Q),oe.updateMultisampleRenderTarget(Pe),oe.updateRenderTargetMipmap(Pe),ge.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let Lt=0,un=G.length;Lt<un;Lt++){const Wt=G[Lt],{object:Ft,geometry:Sn,material:Ve,group:kn}=Wt;if(Ve.side===Os&&Ft.layers.test(Q.layers)){const Mt=Ve.side;Ve.side=mi,Ve.needsUpdate=!0,_n(Ft,ae,Q,Sn,Ve,kn),Ve.side=Mt,Ve.needsUpdate=!0,Ye=!0}}Ye===!0&&(oe.updateMultisampleRenderTarget(Pe),oe.updateRenderTargetMipmap(Pe))}P.setRenderTarget(Le,De,je),P.setClearColor(Qe,it),xt!==void 0&&(Q.viewport=xt),P.toneMapping=ft}function gi(R,G,ae){const Q=G.isScene===!0?G.overrideMaterial:null;for(let ee=0,Pe=R.length;ee<Pe;ee++){const Fe=R[ee],{object:Le,geometry:De,group:je}=Fe;let ft=Fe.material;ft.allowOverride===!0&&Q!==null&&(ft=Q),Le.layers.test(ae.layers)&&_n(Le,G,ae,De,ft,je)}}function _n(R,G,ae,Q,ee,Pe){L!==null&&ee.isNodeMaterial&&L.setObject(R,ee),R.onBeforeRender(P,G,ae,Q,ee,Pe),R.modelViewMatrix.multiplyMatrices(ae.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),ee.onBeforeRender(P,G,ae,Q,R,Pe),ee.transparent===!0&&ee.side===Os&&ee.forceSinglePass===!1?(ee.side=mi,ee.needsUpdate=!0,P.renderBufferDirect(ae,G,Q,ee,R,Pe),ee.side=na,ee.needsUpdate=!0,P.renderBufferDirect(ae,G,Q,ee,R,Pe),ee.side=Os):P.renderBufferDirect(ae,G,Q,ee,R,Pe),R.onAfterRender(P,G,ae,Q,ee,Pe)}function an(R,G,ae){G.isScene!==!0&&(G=rt);const Q=ne.get(R),ee=M.state.lights,Pe=M.state.shadowsArray,Fe=ee.state.version,Le=ye.getParameters(R,ee.state,Pe,G,ae,M.state.lightProbeGridArray),De=ye.getProgramCacheKey(Le);let je=Q.programs;Q.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?G.environment:null,Q.fog=G.fog;const ft=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;Q.envMap=ve.get(R.envMap||Q.environment,ft),Q.envMapRotation=Q.environment!==null&&R.envMap===null?G.environmentRotation:R.envMapRotation,je===void 0&&(R.addEventListener("dispose",zn),je=new Map,Q.programs=je);let xt=je.get(De);if(xt!==void 0){if(Q.currentProgram===xt&&Q.lightsStateVersion===Fe)return Sr(R,Le),xt}else Le.uniforms=ye.getUniforms(R),L!==null&&R.isNodeMaterial&&L.build(R,ae,Le),R.onBeforeCompile(Le,P),xt=ye.acquireProgram(Le,De),je.set(De,xt),Q.uniforms=Le.uniforms;const Ye=Q.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ye.clippingPlanes=qe.uniform),Sr(R,Le),Q.needsLights=So(R),Q.lightsStateVersion=Fe,Q.needsLights&&(Ye.ambientLightColor.value=ee.state.ambient,Ye.lightProbe.value=ee.state.probe,Ye.sunLights.value=ee.state.sun,Ye.sunLightShadows.value=ee.state.sunShadow,Ye.directionalLights.value=ee.state.directional,Ye.directionalLightShadows.value=ee.state.directionalShadow,Ye.spotLights.value=ee.state.spot,Ye.spotLightShadows.value=ee.state.spotShadow,Ye.rectAreaLights.value=ee.state.rectArea,Ye.ltc_1.value=ee.state.rectAreaLTC1,Ye.ltc_2.value=ee.state.rectAreaLTC2,Ye.pointLights.value=ee.state.point,Ye.pointLightShadows.value=ee.state.pointShadow,Ye.hemisphereLights.value=ee.state.hemi,Ye.sunShadowMatrix.value=ee.state.sunShadowMatrix,Ye.sunShadowCascade.value=ee.state.sunShadowCascade,Ye.directionalShadowMatrix.value=ee.state.directionalShadowMatrix,Ye.spotLightMatrix.value=ee.state.spotLightMatrix,Ye.spotLightMap.value=ee.state.spotLightMap,Ye.pointShadowMatrix.value=ee.state.pointShadowMatrix),Q.lightProbeGrid=M.state.lightProbeGridArray.length>0,Q.currentProgram=xt,Q.uniformsList=null,xt}function mn(R){if(R.uniformsList===null){const G=R.currentProgram.getUniforms();R.uniformsList=Lc.seqWithValue(G.seq,R.uniforms)}return R.uniformsList}function Sr(R,G){const ae=ne.get(R);ae.outputColorSpace=G.outputColorSpace,ae.batching=G.batching,ae.batchingColor=G.batchingColor,ae.instancing=G.instancing,ae.instancingColor=G.instancingColor,ae.instancingMorph=G.instancingMorph,ae.skinning=G.skinning,ae.morphTargets=G.morphTargets,ae.morphNormals=G.morphNormals,ae.morphColors=G.morphColors,ae.morphTargetsCount=G.morphTargetsCount,ae.numClippingPlanes=G.numClippingPlanes,ae.numIntersection=G.numClipIntersection,ae.vertexAlphas=G.vertexAlphas,ae.vertexTangents=G.vertexTangents,ae.toneMapping=G.toneMapping}function _i(R,G){if(R.length===0)return null;if(R.length===1)return R[0].texture!==null?R[0]:null;b.setFromMatrixPosition(G.matrixWorld);for(let ae=0,Q=R.length;ae<Q;ae++){const ee=R[ae];if(ee.texture!==null&&ee.boundingBox.containsPoint(b))return ee}return null}function wr(R,G,ae,Q,ee){G.isScene!==!0&&(G=rt),oe.resetTextureUnits();const Pe=G.fog,Fe=Q.isMeshStandardMaterial||Q.isMeshLambertMaterial||Q.isMeshPhongMaterial?G.environment:null,Le=re===null?P.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Et.workingColorSpace,De=Q.isMeshStandardMaterial||Q.isMeshLambertMaterial&&!Q.envMap||Q.isMeshPhongMaterial&&!Q.envMap,je=ve.get(Q.envMap||Fe,De),ft=Q.vertexColors===!0&&!!ae.attributes.color&&ae.attributes.color.itemSize===4,xt=!!ae.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ye=!!ae.morphAttributes.position,Lt=!!ae.morphAttributes.normal,un=!!ae.morphAttributes.color;let Wt=Es;Q.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(Wt=P.toneMapping);const Ft=ae.morphAttributes.position||ae.morphAttributes.normal||ae.morphAttributes.color,Sn=Ft!==void 0?Ft.length:0,Ve=ne.get(Q),kn=M.state.lights;if(Ge===!0&&(ze===!0||R!==te)){const Rt=R===te&&Q.id===q;qe.setState(Q,R,Rt)}let Mt=!1;Q.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==kn.state.version||Ve.outputColorSpace!==Le||ee.isBatchedMesh&&Ve.batching===!1||!ee.isBatchedMesh&&Ve.batching===!0||ee.isBatchedMesh&&Ve.batchingColor===!0&&ee._colorsTexture===null||ee.isBatchedMesh&&Ve.batchingColor===!1&&ee._colorsTexture!==null||ee.isInstancedMesh&&Ve.instancing===!1||!ee.isInstancedMesh&&Ve.instancing===!0||ee.isSkinnedMesh&&Ve.skinning===!1||!ee.isSkinnedMesh&&Ve.skinning===!0||ee.isInstancedMesh&&Ve.instancingColor===!0&&ee.instanceColor===null||ee.isInstancedMesh&&Ve.instancingColor===!1&&ee.instanceColor!==null||ee.isInstancedMesh&&Ve.instancingMorph===!0&&ee.morphTexture===null||ee.isInstancedMesh&&Ve.instancingMorph===!1&&ee.morphTexture!==null||Ve.envMap!==je||Q.fog===!0&&Ve.fog!==Pe||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==qe.numPlanes||Ve.numIntersection!==qe.numIntersection)||Ve.vertexAlphas!==ft||Ve.vertexTangents!==xt||Ve.morphTargets!==Ye||Ve.morphNormals!==Lt||Ve.morphColors!==un||Ve.toneMapping!==Wt||Ve.morphTargetsCount!==Sn||!!Ve.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(Mt=!0):(Mt=!0,Ve.__version=Q.version);let Hn=Ve.currentProgram;Mt===!0&&(Hn=an(Q,G,ee),L&&Q.isNodeMaterial&&L.onUpdateProgram(Q,Hn,Ve));let ei=!1,cs=!1,hs=!1;const Ot=Hn.getUniforms(),on=Ve.uniforms;if(w.useProgram(Hn.program)&&(ei=!0,cs=!0,hs=!0),Q.id!==q&&(q=Q.id,cs=!0),Ve.needsLights){const Rt=_i(M.state.lightProbeGridArray,ee);Ve.lightProbeGrid!==Rt&&(Ve.lightProbeGrid=Rt,cs=!0)}if(ei||te!==R){w.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Ot.setValue(V,"projectionMatrix",R.projectionMatrix),Ot.setValue(V,"viewMatrix",R.matrixWorldInverse);const xi=Ot.map.cameraPosition;xi!==void 0&&xi.setValue(V,ot.setFromMatrixPosition(R.matrixWorld)),N.logarithmicDepthBuffer&&Ot.setValue(V,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Ot.setValue(V,"isOrthographic",R.isOrthographicCamera===!0),te!==R&&(te=R,cs=!0,hs=!0)}if(Ve.needsLights&&(kn.state.sunShadowMap.length>0&&Ot.setValue(V,"sunShadowMap",kn.state.sunShadowMap,oe),kn.state.directionalShadowMap.length>0&&Ot.setValue(V,"directionalShadowMap",kn.state.directionalShadowMap,oe),kn.state.spotShadowMap.length>0&&Ot.setValue(V,"spotShadowMap",kn.state.spotShadowMap,oe),kn.state.pointShadowMap.length>0&&Ot.setValue(V,"pointShadowMap",kn.state.pointShadowMap,oe)),ee.isSkinnedMesh){Ot.setOptional(V,ee,"bindMatrix"),Ot.setOptional(V,ee,"bindMatrixInverse");const Rt=ee.skeleton;Rt&&(Rt.boneTexture===null&&Rt.computeBoneTexture(),Ot.setValue(V,"boneTexture",Rt.boneTexture,oe))}ee.isBatchedMesh&&(Ot.setOptional(V,ee,"batchingTexture"),Ot.setValue(V,"batchingTexture",ee._matricesTexture,oe),Ot.setOptional(V,ee,"batchingIdTexture"),Ot.setValue(V,"batchingIdTexture",ee._indirectTexture,oe),Ot.setOptional(V,ee,"batchingColorTexture"),ee._colorsTexture!==null&&Ot.setValue(V,"batchingColorTexture",ee._colorsTexture,oe));const us=ae.morphAttributes;if((us.position!==void 0||us.normal!==void 0||us.color!==void 0)&&$.update(ee,ae,Hn),(cs||Ve.receiveShadow!==ee.receiveShadow)&&(Ve.receiveShadow=ee.receiveShadow,Ot.setValue(V,"receiveShadow",ee.receiveShadow)),(Q.isMeshStandardMaterial||Q.isMeshLambertMaterial||Q.isMeshPhongMaterial)&&Q.envMap===null&&G.environment!==null&&(on.envMapIntensity.value=G.environmentIntensity),on.dfgLUT!==void 0&&(on.dfgLUT.value=YR()),cs){if(Ot.setValue(V,"toneMappingExposure",P.toneMappingExposure),Ve.needsLights&&El(on,hs),Pe&&Q.fog===!0&&Ze.refreshFogUniforms(on,Pe),Ze.refreshMaterialUniforms(on,Q,he,Z,M.state.transmissionRenderTarget[R.id]),Ve.needsLights&&Ve.lightProbeGrid){const Rt=Ve.lightProbeGrid;on.probesSH.value=Rt.texture,on.probesMin.value.copy(Rt.boundingBox.min),on.probesMax.value.copy(Rt.boundingBox.max),on.probesResolution.value.copy(Rt.resolution)}Lc.upload(V,mn(Ve),on,oe)}if(Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Lc.upload(V,mn(Ve),on,oe),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Ot.setValue(V,"center",ee.center),Ot.setValue(V,"modelViewMatrix",ee.modelViewMatrix),Ot.setValue(V,"normalMatrix",ee.normalMatrix),Ot.setValue(V,"modelMatrix",ee.matrixWorld),Q.uniformsGroups!==void 0){const Rt=Q.uniformsGroups;for(let xi=0,ds=Rt.length;xi<ds;xi++){const js=Rt[xi];me.update(js,Hn),me.bind(js,Hn)}}return Hn}function El(R,G){R.ambientLightColor.needsUpdate=G,R.lightProbe.needsUpdate=G,R.sunLights.needsUpdate=G,R.sunLightShadows.needsUpdate=G,R.directionalLights.needsUpdate=G,R.directionalLightShadows.needsUpdate=G,R.pointLights.needsUpdate=G,R.pointLightShadows.needsUpdate=G,R.spotLights.needsUpdate=G,R.spotLightShadows.needsUpdate=G,R.rectAreaLights.needsUpdate=G,R.hemisphereLights.needsUpdate=G}function So(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return re},this.setRenderTargetTextures=function(R,G,ae){const Q=ne.get(R);Q.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),ne.get(R.texture).__webglTexture=G,ne.get(R.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:ae,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,G){const ae=ne.get(R);ae.__webglFramebuffer=G,ae.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(R,G=0,ae=0){re=R,X=G,z=ae;let Q=null,ee=!1,Pe=!1;if(R){const Le=ne.get(R);if(Le.__useDefaultFramebuffer!==void 0){w.bindFramebuffer(V.FRAMEBUFFER,Le.__webglFramebuffer),H.copy(R.viewport),J.copy(R.scissor),se=R.scissorTest,w.viewport(H),w.scissor(J),w.setScissorTest(se),q=-1;return}else if(Le.__webglFramebuffer===void 0)oe.setupRenderTarget(R);else if(Le.__hasExternalTextures)oe.rebindTextures(R,ne.get(R.texture).__webglTexture,ne.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const ft=R.depthTexture;if(Le.__boundDepthTexture!==ft){if(ft!==null&&ne.has(ft)&&(R.width!==ft.image.width||R.height!==ft.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");oe.setupDepthRenderbuffer(R)}}const De=R.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(Pe=!0);const je=ne.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(je[G])?Q=je[G][ae]:Q=je[G],ee=!0):R.samples>0&&oe.useMultisampledRTT(R)===!1?Q=ne.get(R).__webglMultisampledFramebuffer:Array.isArray(je)?Q=je[ae]:Q=je,H.copy(R.viewport),J.copy(R.scissor),se=R.scissorTest}else H.copy(Te).multiplyScalar(he).floor(),J.copy(ue).multiplyScalar(he).floor(),se=pe;if(ae!==0&&(Q=k),w.bindFramebuffer(V.FRAMEBUFFER,Q)&&w.drawBuffers(R,Q),w.viewport(H),w.scissor(J),w.setScissorTest(se),ee){const Le=ne.get(R.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+G,Le.__webglTexture,ae)}else if(Pe){const Le=G;for(let De=0;De<R.textures.length;De++){const je=ne.get(R.textures[De]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+De,je.__webglTexture,ae,Le)}}else if(R!==null&&ae!==0){const Le=ne.get(R.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Le.__webglTexture,ae)}q=-1};function Er(R){const G=ne.get(R);return(G.__readFormat!==R.format||G.__readType!==R.type)&&(G.__readFormat=R.format,G.__readType=R.type,G.__formatReadable=N.textureFormatReadable(R.format),G.__typeReadable=N.textureTypeReadable(R.type)),G}this.readRenderTargetPixels=function(R,G,ae,Q,ee,Pe,Fe,Le=0){if(!(R&&R.isWebGLRenderTarget)){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=ne.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(De=De[Fe]),De){w.bindFramebuffer(V.FRAMEBUFFER,De);try{const je=R.textures[Le],ft=je.format,xt=je.type;R.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+Le);const Ye=Er(je);if(Ye.__formatReadable===!1){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ye.__typeReadable===!1){Ct("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=R.width-Q&&ae>=0&&ae<=R.height-ee&&V.readPixels(G,ae,Q,ee,Ce.convert(ft),Ce.convert(xt),Pe)}finally{const je=re!==null?ne.get(re).__webglFramebuffer:null;w.bindFramebuffer(V.FRAMEBUFFER,je)}}},this.readRenderTargetPixelsAsync=async function(R,G,ae,Q,ee,Pe,Fe,Le=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=ne.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Fe!==void 0&&(De=De[Fe]),De)if(G>=0&&G<=R.width-Q&&ae>=0&&ae<=R.height-ee){w.bindFramebuffer(V.FRAMEBUFFER,De);const je=R.textures[Le],ft=je.format,xt=je.type;R.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+Le);const Ye=Er(je);if(Ye.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ye.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Lt=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Lt),V.bufferData(V.PIXEL_PACK_BUFFER,Pe.byteLength,V.STREAM_READ),V.readPixels(G,ae,Q,ee,Ce.convert(ft),Ce.convert(xt),0),V.bindBuffer(V.PIXEL_PACK_BUFFER,null);const un=re!==null?ne.get(re).__webglFramebuffer:null;w.bindFramebuffer(V.FRAMEBUFFER,un);const Wt=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await hw(V,Wt,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Lt),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,Pe),V.bindBuffer(V.PIXEL_PACK_BUFFER,null),V.deleteBuffer(Lt),V.deleteSync(Wt),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,G=null,ae=0){const Q=Math.pow(2,-ae),ee=Math.floor(R.image.width*Q),Pe=Math.floor(R.image.height*Q),Fe=G!==null?G.x:0,Le=G!==null?G.y:0;oe.setTexture2D(R,0),V.copyTexSubImage2D(V.TEXTURE_2D,ae,0,0,Fe,Le,ee,Pe),w.unbindTexture()},this.copyTextureToTexture=function(R,G,ae=null,Q=null,ee=0,Pe=0){let Fe,Le,De,je,ft,xt,Ye,Lt,un;const Wt=R.isCompressedTexture?R.mipmaps[Pe]:R.image;if(ae!==null)Fe=ae.max.x-ae.min.x,Le=ae.max.y-ae.min.y,De=ae.isBox3?ae.max.z-ae.min.z:1,je=ae.min.x,ft=ae.min.y,xt=ae.isBox3?ae.min.z:0;else{const on=Math.pow(2,-ee);Fe=Math.floor(Wt.width*on),Le=Math.floor(Wt.height*on),R.isDataArrayTexture?De=Wt.depth:R.isData3DTexture?De=Math.floor(Wt.depth*on):De=1,je=0,ft=0,xt=0}Q!==null?(Ye=Q.x,Lt=Q.y,un=Q.z):(Ye=0,Lt=0,un=0);const Ft=Ce.convert(G.format),Sn=Ce.convert(G.type);let Ve;G.isData3DTexture?(oe.setTexture3D(G,0),Ve=V.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(oe.setTexture2DArray(G,0),Ve=V.TEXTURE_2D_ARRAY):(oe.setTexture2D(G,0),Ve=V.TEXTURE_2D),w.activeTexture(V.TEXTURE0),w.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,G.flipY),w.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),w.pixelStorei(V.UNPACK_ALIGNMENT,G.unpackAlignment);const kn=w.getParameter(V.UNPACK_ROW_LENGTH),Mt=w.getParameter(V.UNPACK_IMAGE_HEIGHT),Hn=w.getParameter(V.UNPACK_SKIP_PIXELS),ei=w.getParameter(V.UNPACK_SKIP_ROWS),cs=w.getParameter(V.UNPACK_SKIP_IMAGES);w.pixelStorei(V.UNPACK_ROW_LENGTH,Wt.width),w.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Wt.height),w.pixelStorei(V.UNPACK_SKIP_PIXELS,je),w.pixelStorei(V.UNPACK_SKIP_ROWS,ft),w.pixelStorei(V.UNPACK_SKIP_IMAGES,xt);const hs=R.isDataArrayTexture||R.isData3DTexture,Ot=G.isDataArrayTexture||G.isData3DTexture;if(R.isDepthTexture){const on=ne.get(R),us=ne.get(G),Rt=ne.get(on.__renderTarget),xi=ne.get(us.__renderTarget);w.bindFramebuffer(V.READ_FRAMEBUFFER,Rt.__webglFramebuffer),w.bindFramebuffer(V.DRAW_FRAMEBUFFER,xi.__webglFramebuffer);for(let ds=0;ds<De;ds++)hs&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,ne.get(R).__webglTexture,ee,xt+ds),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,ne.get(G).__webglTexture,Pe,un+ds)),V.blitFramebuffer(je,ft,Fe,Le,Ye,Lt,Fe,Le,V.DEPTH_BUFFER_BIT,V.NEAREST);w.bindFramebuffer(V.READ_FRAMEBUFFER,null),w.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(ee!==0||R.isRenderTargetTexture||ne.has(R)){const on=ne.get(R),us=ne.get(G);w.bindFramebuffer(V.READ_FRAMEBUFFER,U),w.bindFramebuffer(V.DRAW_FRAMEBUFFER,O);for(let Rt=0;Rt<De;Rt++)hs?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,on.__webglTexture,ee,xt+Rt):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,on.__webglTexture,ee),Ot?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,us.__webglTexture,Pe,un+Rt):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,us.__webglTexture,Pe),ee!==0?V.blitFramebuffer(je,ft,Fe,Le,Ye,Lt,Fe,Le,V.COLOR_BUFFER_BIT,V.NEAREST):Ot?V.copyTexSubImage3D(Ve,Pe,Ye,Lt,un+Rt,je,ft,Fe,Le):V.copyTexSubImage2D(Ve,Pe,Ye,Lt,je,ft,Fe,Le);w.bindFramebuffer(V.READ_FRAMEBUFFER,null),w.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else Ot?R.isDataTexture||R.isData3DTexture?V.texSubImage3D(Ve,Pe,Ye,Lt,un,Fe,Le,De,Ft,Sn,Wt.data):G.isCompressedArrayTexture?V.compressedTexSubImage3D(Ve,Pe,Ye,Lt,un,Fe,Le,De,Ft,Wt.data):V.texSubImage3D(Ve,Pe,Ye,Lt,un,Fe,Le,De,Ft,Sn,Wt):R.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,Pe,Ye,Lt,Fe,Le,Ft,Sn,Wt.data):R.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,Pe,Ye,Lt,Wt.width,Wt.height,Ft,Wt.data):V.texSubImage2D(V.TEXTURE_2D,Pe,Ye,Lt,Fe,Le,Ft,Sn,Wt);w.pixelStorei(V.UNPACK_ROW_LENGTH,kn),w.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Mt),w.pixelStorei(V.UNPACK_SKIP_PIXELS,Hn),w.pixelStorei(V.UNPACK_SKIP_ROWS,ei),w.pixelStorei(V.UNPACK_SKIP_IMAGES,cs),Pe===0&&G.generateMipmaps&&V.generateMipmap(Ve),w.unbindTexture()},this.initRenderTarget=function(R){ne.get(R).__webglFramebuffer===void 0&&oe.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?oe.setTextureCube(R,0):R.isData3DTexture?oe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?oe.setTexture2DArray(R,0):oe.setTexture2D(R,0),w.unbindTexture()},this.resetState=function(){X=0,z=0,re=null,w.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ss}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Et._getDrawingBufferColorSpace(e),t.unpackColorSpace=Et._getUnpackColorSpace()}}const ng={type:"change"},np={type:"start"},Mx={type:"end"},pc=new vl,ig=new Fs,jR=Math.cos(70*fw.DEG2RAD),wn=new Y,fi=2*Math.PI,Ht={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ru=1e-6;class KR extends Zw{constructor(e,t=null){super(e,t),this.state=Ht.NONE,this.target=new Y,this.cursor=new Y,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ka.ROTATE,MIDDLE:Ka.DOLLY,RIGHT:Ka.PAN},this.touches={ONE:Wa.ROTATE,TWO:Wa.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new Y,this._lastQuaternion=new br,this._lastTargetPosition=new Y,this._quat=new br().setFromUnitVectors(e.up,new Y(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new D0,this._sphericalDelta=new D0,this._scale=1,this._panOffset=new Y,this._rotateStart=new Je,this._rotateEnd=new Je,this._rotateDelta=new Je,this._panStart=new Je,this._panEnd=new Je,this._panDelta=new Je,this._dollyStart=new Je,this._dollyEnd=new Je,this._dollyDelta=new Je,this._dollyDirection=new Y,this._mouse=new Je,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=JR.bind(this),this._onPointerDown=ZR.bind(this),this._onPointerUp=QR.bind(this),this._onContextMenu=aC.bind(this),this._onMouseWheel=nC.bind(this),this._onKeyDown=iC.bind(this),this._onTouchStart=sC.bind(this),this._onTouchMove=rC.bind(this),this._onMouseDown=eC.bind(this),this._onMouseMove=tC.bind(this),this._interceptControlDown=oC.bind(this),this._interceptControlUp=lC.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Ht.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ng),this.update(),this.state=Ht.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;wn.copy(t).sub(this.target),wn.applyQuaternion(this._quat),this._spherical.setFromVector3(wn),this.autoRotate&&this.state===Ht.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=fi:n>Math.PI&&(n-=fi),s<-Math.PI?s+=fi:s>Math.PI&&(s-=fi),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(wn.setFromSpherical(this._spherical),wn.applyQuaternion(this._quatInverse),t.copy(this.target).add(wn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=wn.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new Y(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new Y(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=wn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(pc.origin.copy(this.object.position),pc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(pc.direction))<jR?this.object.lookAt(this.target):(ig.setFromNormalAndCoplanarPoint(this.object.up,this.target),pc.intersectPlane(ig,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Ru||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ru||this._lastTargetPosition.distanceToSquared(this.target)>Ru?(this.dispatchEvent(ng),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?fi/60*this.autoRotateSpeed*e:fi/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){wn.setFromMatrixColumn(t,0),wn.multiplyScalar(-e),this._panOffset.add(wn)}_panUp(e,t){this.screenSpacePanning===!0?wn.setFromMatrixColumn(t,1):(wn.setFromMatrixColumn(t,0),wn.crossVectors(this.object.up,wn)),wn.multiplyScalar(e),this._panOffset.add(wn)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;wn.copy(s).sub(this.target);let r=wn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(fi*this._rotateDelta.x/t.clientHeight),this._rotateUp(fi*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(fi*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-fi*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(fi*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-fi*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(fi*this._rotateDelta.x/t.clientHeight),this._rotateUp(fi*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Je,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function ZR(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function JR(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function QR(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Mx),this.state=Ht.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function eC(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ka.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Ht.DOLLY;break;case Ka.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ht.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ht.ROTATE}break;case Ka.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ht.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ht.PAN}break;default:this.state=Ht.NONE}this.state!==Ht.NONE&&this.dispatchEvent(np)}function tC(i){switch(this.state){case Ht.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Ht.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Ht.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function nC(i){this.enabled===!1||this.enableZoom===!1||this.state!==Ht.NONE||(i.preventDefault(),this.dispatchEvent(np),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Mx))}function iC(i){this.enabled!==!1&&this._handleKeyDown(i)}function sC(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Wa.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Ht.TOUCH_ROTATE;break;case Wa.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Ht.TOUCH_PAN;break;default:this.state=Ht.NONE}break;case 2:switch(this.touches.TWO){case Wa.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Ht.TOUCH_DOLLY_PAN;break;case Wa.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Ht.TOUCH_DOLLY_ROTATE;break;default:this.state=Ht.NONE}break;default:this.state=Ht.NONE}this.state!==Ht.NONE&&this.dispatchEvent(np)}function rC(i){switch(this._trackPointer(i),this.state){case Ht.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Ht.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Ht.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Ht.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Ht.NONE}}function aC(i){this.enabled!==!1&&i.preventDefault()}function oC(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function lC(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ia={L:3111935,R:16726832,C:2282347,H:16766474},Zi=[["_neck","_pelvis","C"],["l_shoulder","r_shoulder","C"],["l_hip","r_hip","C"],["l_shoulder","l_hip","C"],["r_shoulder","r_hip","C"],["_neck","nose","C"],["l_shoulder","l_elbow","L"],["l_elbow","l_wrist","L"],["r_shoulder","r_elbow","R"],["r_elbow","r_wrist","R"],["l_hip","l_knee","L"],["l_knee","l_ankle","L"],["r_hip","r_knee","R"],["r_knee","r_ankle","R"],["l_ankle","l_heel","L"],["l_heel","l_toe","L"],["l_ankle","l_toe","L"],["r_ankle","r_heel","R"],["r_heel","r_toe","R"],["r_ankle","r_toe","R"]],cC=[["l_wrist",3111935],["r_wrist",16726832],["l_ankle",6990079],["r_ankle",14696699]],yx=["frente","perfil","cenital","libre","seguimiento"],mc=6,sg=50,Fr=2600,Cu=.95;class Sx{constructor(e,{ink:t=!1}={}){this.el=e,this.ink=t,this.frame=null,this.pov="frente",this.mode="figura";const n=document.createElement("canvas");n.className="w3d",e.append(n),this.wait=document.createElement("div"),this.wait.className="w3d-wait",this.wait.textContent="esperando el cuerpo…",e.append(this.wait),this.hasFrame=!1,this.renderer=new vh({canvas:n,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1)),this.renderer.outputColorSpace=ai,this.scene=new ph,this.camera=new li(34,1,.05,50),this.camera.position.set(0,.1,3.3),this.controls=new KR(this.camera,n),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.target.set(0,-.05,0),this.controls.addEventListener("start",()=>{this.pov!=="libre"&&this.setPOV("libre",!1)}),this.scene.add(new Vw(16777215,2241348,1.1));const s=new $w(16777215,1.2);s.position.set(2,3,4),this.scene.add(s),this.scene.fog=new fh(329223,5,11),this.grid=new dx(6,24,14704704,3808532),this.grid.material.transparent=!0,this.grid.material.opacity=.55,this.scene.add(this.grid),this.floorY=-1,this.fig=new Xr,this.scene.add(this.fig);const r=new Qf(1,1,1,10,1,!1);this.bones=Zi.map(([,,f])=>{const p=new hi(r,new bu({color:Ia[f],emissive:Ia[f],emissiveIntensity:.55,roughness:.4,metalness:.1}));return this.fig.add(p),p});const a=new ep(1,14,10);this.joints=["l_shoulder","r_shoulder","l_elbow","r_elbow","l_wrist","r_wrist","l_hip","r_hip","l_knee","r_knee","l_ankle","r_ankle"].map(f=>{const p=new hi(a,new bu({color:16777215,emissive:8947848,roughness:.3}));return p.userData.name=f,p.scale.setScalar(.032),this.fig.add(p),p}),this.head=new hi(a,new bu({color:Ia.H,emissive:Ia.H,emissiveIntensity:.7})),this.head.scale.setScalar(.1),this.fig.add(this.head),this.ghostFrames=[],this.ghosts=Array.from({length:mc},(f,p)=>{const m=new pn;m.setAttribute("position",new Gn(new Float32Array(Zi.length*6),3));const _=new Hd(m,new el({color:14704704,transparent:!0,opacity:.08+.3*(p/mc)}));return this.scene.add(_),_}),this.trails=cC.map(([f,p])=>{const m=new pn;m.setAttribute("position",new Gn(new Float32Array(sg*3),3)),m.setDrawRange(0,0);const _=new ix(m,new el({color:p,transparent:!0,opacity:.85}));return _.userData={name:f,pts:[]},this.scene.add(_),_});const o=new pn,c=new Float32Array(Fr*3),l=new Float32Array(Fr*3);this.pBone=new Uint8Array(Fr),this.pT=new Float32Array(Fr),this.pOff=new Float32Array(Fr*3);for(let f=0;f<Fr;f++){this.pBone[f]=f%Zi.length,this.pT[f]=Math.random();const p=.012+Math.random()*.05,m=Math.random()*Math.PI*2,_=Math.acos(2*Math.random()-1);this.pOff.set([p*Math.sin(_)*Math.cos(m),p*Math.sin(_)*Math.sin(m),p*Math.cos(_)],f*3)}o.setAttribute("position",new Gn(c,3)),o.setAttribute("color",new Gn(l,3)),this.points=new Jc(o,new Zc({size:.022,vertexColors:!0,transparent:!0,opacity:.95,blending:oo,depthWrite:!1})),this.points.visible=!1,this.scene.add(this.points),this.fig.visible=!1;const h=new pn;h.setAttribute("position",new Gn(new Float32Array(Zi.length*6),3)),this.refLines=new Hd(h,new el({color:10132116,transparent:!0,opacity:.85})),this.refLines.visible=!1,this.scene.add(this.refLines),this.refFrame=null,this.activity=new Float32Array(Zi.length),this.prevDirs=null,this.tmp=[new Y,new Y,new Y,new Y],this.focus=new Y(0,Cu,0),this.want=new Y(0,Cu,0),this.setInk(t),this.setPOV("frente",!1),new ResizeObserver(()=>this.resize()).observe(e),this.resize(),this.alive=!0;let d=0;this.paused=!1;const u=f=>{this.alive&&(requestAnimationFrame(u),!(this.paused||this.el.offsetParent===null||f-d<32)&&(d=f,this.render()))};requestAnimationFrame(u)}setInk(e){this.ink=e,this.scene.fog.color.set(e?15263968:329223),this.grid.material.color?.set?.(e?657930:14704704),this.grid.material.opacity=e?.25:.55;for(const[t,n]of this.bones.entries()){const s=Zi[t][2];n.material.color.set(e?657930:Ia[s]),n.material.emissive.set(e?0:Ia[s])}for(const t of this.ghosts)t.material.color.set(e?657930:14704704);this.points.material.blending=e?jr:oo}setMode(e){this.mode=e,this.fig.visible=this.hasFrame&&e!=="calor",this.points.visible=this.hasFrame&&e==="calor"}setPaused(e){this.paused=!!e}setPOV(e,t=!0){this.pov=e;const n=3.3,s={frente:[0,.15,n],perfil:[n,.15,0],cenital:[0,n,.01],libre:null,seguimiento:[n*.7,.75,n*.7]}[e];if(!s)return;const r=this.focus.clone();this.anim={from:this.camera.position.clone(),to:r.clone().add(new Y(...s)),fromT:this.controls.target.clone(),toT:r,t0:performance.now(),d:t?650:1}}resize(){const e=Math.max(1,this.el.clientWidth),t=Math.max(1,this.el.clientHeight);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}draw(e){e?.world&&(this.frame=e)}_points(e){return e.g?.pts?e.g.pts.map(t=>[-t[0],t[1],t[2]]):e.world.map(t=>[-t[0],-t[1],-t[2]])}drawRef(e){this.refFrame=e?.world?e:null,this.refLines.visible=!!this.refFrame}get(e,t){return e==="_neck"?t[Be.l_shoulder].map((n,s)=>(n+t[Be.r_shoulder][s])/2):e==="_pelvis"?t[Be.l_hip].map((n,s)=>(n+t[Be.r_hip][s])/2):t[Be[e]]}update(){const e=this.frame;if(!e?.world)return;this.hasFrame||(this.hasFrame=!0,this.wait.hidden=!0,this.setMode(this.mode));const t=this._points(e),[n,s,r,a]=this.tmp,o=e.g;if(o)this.grid.position.set(Math.round(-o.root[0]),0,Math.round(o.root[2])),this.grid.material.opacity=(this.ink?.25:.55)*(o.floor.conf<.3?.4:1);else{const h=["l_ankle","r_ankle","l_heel","r_heel","l_toe","r_toe"].filter(d=>e.pts[Be[d]][3]>=.5).map(d=>t[Be[d]][1]);h.length&&(this.floorY+=(Math.min(...h)-.01-this.floorY)*.15),this.grid.position.set(0,this.floorY,0)}const c=[];Zi.forEach(([h,d],u)=>{n.fromArray(this.get(h,t)),s.fromArray(this.get(d,t)),r.addVectors(n,s).multiplyScalar(.5),a.subVectors(s,n);const f=a.length()||.001,p=this.bones[u];p.position.copy(r),p.scale.set(.022,f,.022),p.quaternion.setFromUnitVectors(new Y(0,1,0),a.clone().normalize()),c.push(a.clone().normalize())});for(const h of this.joints)h.position.fromArray(t[Be[h.userData.name]]);this.head.position.fromArray(t[Be.nose]),this.head.position.y+=.06,this.prevDirs&&c.forEach((h,d)=>{const u=Math.acos(Math.min(1,Math.max(-1,h.dot(this.prevDirs[d]))));this.activity[d]=this.activity[d]*.985+u*.6}),this.prevDirs=c,this.gc=(this.gc??0)+1,this.gc%4===0&&(this.ghostFrames.push(t),this.ghostFrames.length>mc&&this.ghostFrames.shift()),this.ghostFrames.forEach((h,d)=>{const u=this.ghosts[mc-this.ghostFrames.length+d].geometry.attributes.position;Zi.forEach(([f,p],m)=>{n.fromArray(this.get(f,h)),s.fromArray(this.get(p,h)),u.setXYZ(m*2,n.x,n.y,n.z),u.setXYZ(m*2+1,s.x,s.y,s.z)}),u.needsUpdate=!0});for(const h of this.trails){const d=new Y().fromArray(t[Be[h.userData.name]]);h.userData.pts.push(d),h.userData.pts.length>sg&&h.userData.pts.shift();const u=h.geometry.attributes.position;h.userData.pts.forEach((f,p)=>u.setXYZ(p,f.x,f.y,f.z)),u.needsUpdate=!0,h.geometry.setDrawRange(0,h.userData.pts.length)}if(this.points.visible){const h=this.points.geometry.attributes.position,d=this.points.geometry.attributes.color,u=Math.max(.05,...this.activity),f=Zi.map(([m,_])=>[new Y().fromArray(this.get(m,t)),new Y().fromArray(this.get(_,t))]),p=performance.now()/1e3;for(let m=0;m<Fr;m++){const _=this.pBone[m],[g,x]=f[_],T=this.pT[m],b=Math.sin(p*3+m)*.004;h.setXYZ(m,g.x+(x.x-g.x)*T+this.pOff[m*3]+b,g.y+(x.y-g.y)*T+this.pOff[m*3+1],g.z+(x.z-g.z)*T+this.pOff[m*3+2]);const S=Math.min(1,this.activity[_]/u),M=S<.5?.18+1.5*S:.93+.07*(S-.5)*2,A=S<.5?.48-.1*S:.38+.52*(S-.5)*2,v=S<.5?1-1.5*S:.25+.5*(S-.5)*2;this.ink?d.setXYZ(m,.12+.6*S,.2+.1*S,.8-.65*S):d.setXYZ(m,M*(.35+.65*S),A*(.35+.65*S),v*(.35+.65*S))}h.needsUpdate=!0,d.needsUpdate=!0}if(this.refFrame?.world){const h=this._points(this.refFrame),d=this.get("_pelvis",t),u=this.get("_pelvis",h),f=[d[0]-u[0],d[1]-u[1],d[2]-u[2]],p=_=>[_[0]+f[0],_[1]+f[1],_[2]+f[2]],m=this.refLines.geometry.attributes.position;Zi.forEach(([_,g],x)=>{n.fromArray(p(this.get(_,h))),s.fromArray(p(this.get(g,h))),m.setXYZ(x*2,n.x,n.y,n.z),m.setXYZ(x*2+1,s.x,s.y,s.z)}),m.needsUpdate=!0}const l=n.fromArray(this.get("_pelvis",t));this.want.set(l.x,o?Cu:l.y,l.z),this.pov!=="libre"&&!this.anim&&(r.subVectors(this.want,this.focus).multiplyScalar(this.pov==="seguimiento"?.12:.06),this.focus.add(r),this.camera.position.add(r),this.controls.target.copy(this.focus))}render(){if(this.update(),this.anim){const e=Math.min(1,(performance.now()-this.anim.t0)/this.anim.d),t=1-(1-e)**3;this.camera.position.lerpVectors(this.anim.from,this.anim.to,t),this.controls.target.lerpVectors(this.anim.fromT,this.anim.toT,t),e>=1&&(this.anim=null)}this.controls.update(),this.renderer.render(this.scene,this.camera)}hottest(){const e=Math.max(...this.activity);if(e<.02)return null;const t=this.activity.indexOf(e),[n,s]=Zi[t],r={shoulder:"hombro",elbow:"codo",wrist:"muñeca",hip:"cadera",knee:"rodilla",ankle:"tobillo",heel:"talón",toe:"punta",nose:"cabeza",neck:"cuello",pelvis:"pelvis"},a=o=>{const[c,l]=o.startsWith("_")?["",o.slice(1)]:o.split("_");return`${r[l]??l}${c?c==="l"?" izq":" der":""}`};return`${a(n)} → ${a(s)}`}dispose(){this.alive=!1,this.renderer.dispose()}}const hC=.38;class uC{constructor(){this.reset()}reset(){this.steps=0,this.leadChanges=0,this.shifts=0,this.feet={l:{anchor:null,prev:null,moving:!1,v:0},r:{anchor:null,prev:null,moving:!1,v:0}},this.speed=0,this.stance=NaN,this.lastT=null,this.gapAt=null}update(e){const t=[],n=e.t,s=this.lastT==null?0:(n-this.lastT)/1e3;if(this.lastT=n,s>.25){this.gapAt=n;for(const h of["l","r"])Object.assign(this.feet[h],{anchor:null,prev:null,moving:!1,v:0})}for(const h of e.newEvents??[])h.type==="lead"&&!(this.gapAt!=null&&n-this.gapAt<1e3)&&(this.leadChanges++,t.push({kind:"lead",side:h.data?.side,text:h.text})),h.type==="weight"&&(this.shifts++,t.push({kind:"weight",side:h.data?.side,text:h.text})),h.type==="jump"&&t.push({kind:"jump",text:h.text});const r=e.frame,a=Math.max(Number.isFinite(e.sig?.sw)?e.sig.sw:0,Number.isFinite(e.sig?.torso)?e.sig.torso*.78:0);if(!r||a<.001)return t;const o=r.aspect??16/9;let c=0;const l={};for(const h of["l","r"]){const d=r.pts[Be[`${h}_ankle`]];if(!d||d[3]<.35)continue;const u=[d[0]*o/a,d[1]/a];l[h]=u;const f=this.feet[h];if(f.prev&&s>0&&s<.25){const m=Math.hypot(u[0]-f.prev[0],u[1]-f.prev[1])/s;m>12?(f.anchor=u,f.moving=!1):f.v=f.v*.6+m*.4}f.prev=u,f.anchor||(f.anchor=u);const p=Math.hypot(u[0]-f.anchor[0],u[1]-f.anchor[1]);if(!f.moving&&f.v>1.3&&p>.08&&(f.moving=!0),f.moving&&f.v<.5){if(f.moving=!1,p>.32){this.steps++;const m=u[0]-f.anchor[0],_=u[1]-f.anchor[1],g=Math.abs(m)>Math.abs(_)*1.2?m>0?"→":"←":_>0?"↓":"↑";t.push({kind:"step",side:h==="l"?"L":"R",text:`paso ${h==="l"?"izq":"der"} ${g}`})}f.anchor=u}c=Math.max(c,f.v)}return this.speed=this.speed*.85+c*hC*.15,l.l&&l.r&&(this.stance=this.stance*.8+Math.abs(l.l[0]-l.r[0])*.2||Math.abs(l.l[0]-l.r[0])),t}}const la=i=>{const e=document.createElement("template");return e.innerHTML=i.trim(),e.content.firstElementChild},wx=i=>String(i??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Yt=(i,e)=>i.querySelector(`[data-k=${e}]`),Xd={jab:"Jab",cross:"Cruzado",gancho:"Gancho",uppercut:"Upper",directo:"Directo"},gc=i=>Number.isFinite(i)?`${Math.round(i)}°`:"—",Ex={L:"izquierda",R:"derecha"};function Tx(i,e,t=performance.now()){if(e&&t-e.t<340)return e.side==="L"?as.L:as.R;const n=i?.sig?.balance;if(Number.isFinite(n)&&Math.abs(n)>.12)return Sc(Zu(),n<0?as.L:as.R,Math.min(1,(Math.abs(n)-.12)/.5));const s=kf(),r=t/5e3%4,a=Math.floor(r);return Sc(Zu(),Sc(s[a],s[(a+1)%4],r-a),.45)}function Ax(){const i=la(`<div class="w-bal">
    <div class="vs">
      <div class="vs-side l"><b data-k="pl">50%</b><small>peso izq</small></div>
      <div class="vs-bars"><div class="vs-bar l"><i></i></div><div class="vs-mid"></div><div class="vs-bar r"><i></i></div></div>
      <div class="vs-side r"><b data-k="pr">50%</b><small>peso der</small></div>
    </div>
    <div class="vs-foot"><span data-k="wstate">centrado</span><span data-k="lead">pierna adelante —</span><span class="lamp" data-k="guard">guardia —</span></div>
  </div>`),e=i.querySelector(".vs-bar.l i"),t=i.querySelector(".vs-bar.r i");return{el:i,update(n){const s=n.sig,r=Number.isFinite(s.balance)?Df(s.balance,-1,1):0,a=Math.round((r+1)*50),o=100-a;Yt(i,"pl").textContent=`${o}%`,Yt(i,"pr").textContent=`${a}%`,e.style.width=`${o}%`,t.style.width=`${a}%`,Yt(i,"wstate").textContent=n.weight==="L"?"peso a la izquierda":n.weight==="R"?"peso a la derecha":"centrado",Yt(i,"lead").textContent=`pierna adelante ${n.leadFoot?Ex[n.leadFoot]:"—"}`;const c=Yt(i,"guard");c.textContent=n.guard?"guardia arriba":"guardia abajo",c.classList.toggle("on",!!n.guard)},reset(){e.style.width=t.style.width="50%"}}}function Rx(){const i=la(`<div class="w-prog">
    <div class="pg-top"><span data-k="plabel">progreso de la rep</span><b data-k="pval">0%</b></div>
    <div class="pg-bar"><i data-k="pfill"></i><span class="pg-ticks"><u></u><u></u><u></u></span></div>
    <div class="pg-sub" data-k="psub">arrancá cuando quieras</div>
  </div>`);return{el:i,update(e){const t=e.sig,n=e.exercise;let s=0,r="",a="";if(n.family==="reps"||n.counter&&n.family!=="free")s=e.counter.p,r=`rep ${e.counter.count+1}`,a=e.counter.last?`última: ${e.counter.last.tempo}`:"completá el recorrido: la barra llega al final";else if(n.family==="jumps")s=e.jumps.rate5/(n.targetRate??200),r=`${Math.round(e.jumps.rate5)} saltos/min`,a=e.jumps.stance??"";else if(n.family==="hold")s=e.hold.currentMs/(n.hold.targetMs??3e4),r=`sostenido ${(e.hold.currentMs/1e3).toFixed(1)} s`,a=`mejor ${(e.hold.best/1e3).toFixed(1)} s`;else{const o=Math.max(t.extL??0,t.extR??0);s=Number.isFinite(o)?o:0,r="extensión del brazo",a=e.guard?"guardia arriba · listo para golpear":"subí la guardia"}s=Df(s||0,0,1),Yt(i,"pfill").style.width=`${s*100}%`,Yt(i,"pval").textContent=`${Math.round(s*100)}%`,Yt(i,"plabel").textContent=r,Yt(i,"psub").textContent=a},reset(){}}}function dC(){const i=la(`<div class="w-count">
    <div class="hud-top"><div class="ex-name" data-k="ex">—</div><div class="activity" data-k="act"></div></div>
    <div class="big has-led"><canvas class="led led-big" data-k="led"></canvas><small data-k="lbl">reps</small></div>
    <div class="sub" data-k="sub">&nbsp;</div>
  </div>`);let e="";return{el:i,update(t){const n=t.exercise;let s=0,r="",a="";if(n.family==="reps"||n.counter&&n.family!=="free")s=t.counter.count,r="reps",a=t.counter.last?`rep ${t.counter.last.n}: ${t.counter.last.tempo}`:"";else if(n.family==="jumps")s=t.jumps.count,r="saltos",a=`${Math.round(t.jumps.rate5)} /min`;else if(n.family==="hold")s=(t.hold.currentMs/1e3).toFixed(1),r="seg",a=`mejor ${(t.hold.best/1e3).toFixed(1)} s`;else{const c=t.punches.count;s=t.punches.total,r="golpes",a=`jab ${c.jab} · cruzado ${c.cross} · gancho ${c.gancho} · upper ${c.uppercut}`}Yt(i,"ex").textContent=n.name,Yt(i,"lbl").textContent=r,Yt(i,"sub").textContent=a,Yt(i,"act").textContent=t.activity?.label&&t.activity.label!=="unknown"?`${Math.round(t.activity.confidence*100)}% seguro`:"detectando…";const o=String(s);o!==e&&(e=o,ta(Yt(i,"led"),o,{ink:pt.ink,on:pt.ink?"#0a0a0a":ea.orange}))},reset(){e=""}}}function Cx(){const i=la(`<div class="w-act">
    <div class="act-top">
      <div class="act-led"><canvas class="led" data-k="ptotal"></canvas><small>golpes</small></div>
      <div class="act-led"><canvas class="led" data-k="steps"></canvas><small>pasos</small></div>
      <span class="lamp" data-k="pguard">guardia —</span>
    </div>
    <div class="pu-rows">${["jab","cross","gancho","uppercut"].map(o=>`<div class="pu-row" data-t="${o}"><span>${Xd[o].toLowerCase()}</span><div class="pu-bar"><i></i></div><b>0</b></div>`).join("")}</div>
    <div class="fw-grid">
      <div class="fw"><small>pies</small><b data-k="fspeed">0.0</b><em>m/s</em></div>
      <div class="fw"><small>guardia</small><b data-k="stance">—</b><em>anchos de hombro</em></div>
      <div class="fw"><small>cambios</small><b data-k="leads">0</b><em>pierna adelante</em></div>
      <div class="fw"><small>peso</small><b data-k="shifts">0</b><em>transferencias</em></div>
      <div class="fw"><small>saltos</small><b data-k="jumps">0</b><em data-k="jrate">ritmo —</em></div>
    </div>
    <div class="act-strip" data-k="strip"></div>
    <div class="pu-last" data-k="last">—</div>
  </div>`),e=new uC;let t=[],n="",s="",r="";const a={el:i,lastHit:null,update(o,{wristSpeed:c}={}){const l=performance.now();for(const g of o.newEvents??[]){if(g.type!=="punch")continue;const x=g.data.side,T=c?c(x):0,b=`${Xd[g.data.kind]??g.data.kind} ${x==="L"?"izq":"der"}`;t.push({t:l,kind:"punch",side:x,text:b,v:T}),a.lastHit={t:l,side:x,text:b,v:T}}for(const g of e.update(o))t.push({t:l,...g});for(;t.length&&l-t[0].t>4200;)t.shift();t.length>9&&(t=t.slice(-9));const h=o.punches.count,d=String(o.punches.total),u=String(e.steps);d!==n&&(n=d,ta(Yt(i,"ptotal"),d,{ink:pt.ink,on:pt.ink?"#0a0a0a":ea.orange})),u!==s&&(s=u,ta(Yt(i,"steps"),u,{ink:pt.ink,on:pt.ink?"#0a0a0a":"#ffd60a",off:"rgba(255,214,10,0.08)"}));const f=Math.max(1,h.jab,h.cross,h.gancho,h.uppercut);for(const g of i.querySelectorAll(".pu-row")){const x=h[g.dataset.t]??0;g.querySelector("i").style.width=`${x/f*100}%`,g.querySelector("b").textContent=x}const p=Yt(i,"pguard");p.textContent=o.guard?"guardia arriba":"guardia abajo",p.classList.toggle("on",!!o.guard),Yt(i,"fspeed").textContent=e.speed.toFixed(1),Yt(i,"stance").textContent=Number.isFinite(e.stance)?e.stance.toFixed(1):"—",Yt(i,"leads").textContent=e.leadChanges,Yt(i,"shifts").textContent=e.shifts,Yt(i,"jumps").textContent=o.jumps.count,Yt(i,"jrate").textContent=o.jumps.rate5?`${Math.round(o.jumps.rate5)} /min`:"ritmo —";const m=t.map(g=>g.t+g.text).join();m!==r&&(r=m,Yt(i,"strip").innerHTML=t.map(g=>`<span class="k-${g.kind} s-${g.side??"n"}">${wx(g.text)}</span>`).join("<i>→</i>"));const _=a.lastHit;Yt(i,"last").textContent=_?`último: ${_.text}${_.v>.2?` · ${_.v.toFixed(1)} m/s`:""}`:"—"},reset(){e.reset(),t=[],n=s=r="",a.lastHit=null}};return a}function fC(){const i=la('<div class="grid2 w-body"></div>');return{el:i,update(e){const t=e.sig,n=t.shoulderTilt,s=t.yawSigned,r=t.aboveHeadBoth?"ambas sobre la cabeza":t.aboveHeadL||t.aboveHeadR?`${t.aboveHeadL?"izq":"der"} sobre la cabeza`:t.aboveShoulderL||t.aboveShoulderR?"sobre los hombros":"abajo";i.innerHTML=[["codo izq",gc(t.elbowL),"L"],["codo der",gc(t.elbowR),"R"],["rodilla izq",gc(t.kneeL),"L"],["rodilla der",gc(t.kneeR),"R"],["hombros",Number.isFinite(n)?Math.abs(n)<3?"nivelados":`${n>0?"der":"izq"} más bajo ${Math.abs(n).toFixed(0)}°`:"—","C"],["torso",Number.isFinite(s)?Math.abs(s)<12?"de frente":`hombro ${s>0?"izq":"der"} adelante ${Math.abs(s).toFixed(0)}°`:"—","C"],["codos",Number.isFinite(t.elbowGapMax)?t.elbowGapMax>.75?"abiertos":"pegados":"—","C"],["manos",r,"H"],["pierna adelante",e.leadFoot?Ex[e.leadFoot]:"—",e.leadFoot??"C"],["guardia",e.guard?"arriba":"abajo","H"]].map(([a,o,c])=>`<div class="stat"><small><span class="dot" style="background:var(--${c})"></span>${a}</small><b>${o}</b></div>`).join("")},reset(){i.innerHTML=""}}}function Lx({series:i,min:e,max:t,windowMs:n=9e3,unit:s=""}){const r=la(`<div class="w-chart"><div class="ch-legend">${i.map(h=>`<span style="--c:${h.color}"><i></i>${h.label} <b data-k="${h.key}">—</b></span>`).join("")}</div><canvas></canvas></div>`),a=r.querySelector("canvas");let o=[],c=0;const l=()=>{const h=a.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1),u=Math.max(1,Math.round(h.width*d)),f=Math.max(1,Math.round(h.height*d));(a.width!==u||a.height!==f)&&(a.width=u,a.height=f);const p=a.getContext("2d"),m=pt.ink;p.clearRect(0,0,u,f),p.strokeStyle=m?"rgba(10,10,10,0.08)":"rgba(255,255,255,0.06)",p.lineWidth=1,p.beginPath();for(let x=0;x<=4;x++){const T=f*x/4;p.moveTo(0,T),p.lineTo(u,T)}for(let x=0;x<=9;x++){const T=u*x/9;p.moveTo(T,0),p.lineTo(T,f)}if(p.stroke(),o.length<2)return;const _=o.at(-1).t,g=_-n;i.forEach((x,T)=>{p.beginPath();let b=!1,S=0,M=0;for(const A of o){const v=A.v[T];if(!Number.isFinite(v)){b=!1;continue}const E=(A.t-g)/n*u,P=f-(v-e)/(t-e)*f;b?p.lineTo(E,P):(p.moveTo(E,P),b=!0),S=E,M=P}p.strokeStyle=x.color,p.lineWidth=1.8*d,p.lineJoin="round",m||(p.shadowColor=x.color,p.shadowBlur=8*d),p.stroke(),p.shadowBlur=0,b&&(p.fillStyle=x.color,p.beginPath(),p.arc(S,M,3*d,0,Math.PI*2),p.fill())})};return{el:r,update(h){const d=i.map(f=>h.sig[f.key]);for(o.push({t:h.t,v:d});o.length&&h.t-o[0].t>n;)o.shift();i.forEach((f,p)=>{const m=Yt(r,f.key);m&&(m.textContent=Number.isFinite(d[p])?`${f.fmt?f.fmt(d[p]):Math.round(d[p])}${s}`:"—")});const u=performance.now();u-c>40&&(c=u,l())},reset(){o=[],l()}}}const pC=()=>Lx({series:[{key:"extL",label:"brazo izq",color:as.L,fmt:i=>Math.round(i*100)},{key:"extR",label:"brazo der",color:as.R,fmt:i=>Math.round(i*100)}],min:.2,max:1.05,unit:"%"}),Px=()=>Lx({series:[{key:"kneeL",label:"rodilla izq",color:as.L},{key:"kneeR",label:"rodilla der",color:as.R}],min:60,max:185,unit:"°"});function mC(){const i=la('<ol class="log w-log"></ol>');let e=-1;return{el:i,update(t){const n=t.lines??[],s=n.length+(n.at(-1)?.text??"");s!==e&&(e=s,i.innerHTML=n.slice(-14).reverse().map(r=>`<li><time>${Ws(r.t)}</time>${wx(r.text)}</li>`).join(""))},reset(){i.innerHTML="",e=-1}}}const It=(i,e=document)=>e.querySelector(i),Vo=(i,e=document)=>[...e.querySelectorAll(i)],Ua=i=>{const e=document.createElement("template");return e.innerHTML=i.trim(),e.content.firstElementChild},gC=[["deteccion","Detección"],["esqueleto","Esqueleto"],["angulos","Ángulos"],["estelas","Estelas"],["fantasmas","Fantasmas"],["golpes","Golpes"],["equilibrio","Equilibrio"],["tresd","3D"],["calor","Mapa de calor"],["senal","Señal"],["bitacora","Bitácora"],["comparar","Comparar"]],_C={deteccion:!0,esqueleto:!0,angulos:!0,estelas:!0,fantasmas:!0,golpes:!0,equilibrio:!0,tresd:!0,calor:!1,senal:!0,bitacora:!0,comparar:!0},pi={ejercicios:{x:.008,y:.02,w:.145,h:.34},progreso:{x:.162,y:.02,w:.215,h:.155},senal:{x:.008,y:.38,w:.215,h:.2},piernas:{x:.008,y:.6,w:.215,h:.19},bitacora:{x:.008,y:.81,w:.215,h:.175},equilibrio:{x:.29,y:.63,w:.42,h:.18},dock:{x:.235,y:.825,w:.53,h:.16},tresd:{x:.585,y:.03,w:.205,h:.46},conteo:{x:.8,y:.02,w:.192,h:.22},golpes:{x:.8,y:.26,w:.192,h:.41},cuerpo:{x:.8,y:.69,w:.192,h:.295},reps:{x:.232,y:.38,w:.2,h:.2},calor:{x:.585,y:.51,w:.205,h:.28},lecturas:{x:.28,y:.2,w:.44,h:.4}};function xC(){const i=window.__ml,e=window.__mlR,t=window.__mlBus,n=window.__mlAct,s=It("#view-studio"),r=It(".stage-wrap",s);r.classList.add("ws-anchor");const a=It(".toolbar",r),o=It(".world",r),c=It(".exlist",s),l=It(".hud",s),h=new uh(s,{id:"studio"}),d={..._C,...pr.get("readings",{})},u={bn:!1,atenuado:!1,...pr.get("filters",{})},f={zoom:1,panX:0,panY:0},p=Ax(),m=Rx(),_=Cx(),g=Px(),x=Ua('<div class="w-heat"><canvas data-k="heatcv"></canvas><label class="tog"><input type="checkbox" data-k="heatover" /> sobre el video</label></div>'),T=Ua(`<div class="w-lect">
      <div class="lx-grid">${gC.map(([ue,pe],_e)=>`<button class="lx" data-r="${ue}" aria-pressed="false">${At(ue,20)}<span><em>${String(_e+1).padStart(2,"0")}</em>${pe}</span></button>`).join("")}</div>
      <div class="lx-filters">
        <button class="lx-f" data-f="video">${At("video",16)}video</button>
        <button class="lx-f" data-f="espejo">${At("espejo",16)}espejo</button>
        <button class="lx-f" data-f="bn">${At("bn",16)}b&amp;n</button>
        <button class="lx-f" data-f="atenuado">${At("atenuado",16)}atenuado</button>
        <button class="lx-f" data-f="tinta">${At("sun",16)}modo claro</button>
      </div>
    </div>`),b=It(".big",l),S=document.createElement("canvas");S.className="led led-big",b.prepend(S),b.classList.add("has-led");const M=[It(".hud-top",l),b,It("#hud-sub"),It(".meter",l),It("#hud-alerts")];Vo("h4",l).forEach(ue=>ue.remove()),a.classList.add("dock");const A=Ua(`<span class="dock-x">
      <button class="icon-btn" data-d="lecturas" title="Lecturas">${At("layers",17)}</button>
      <button class="icon-btn" data-d="zoom" title="Zoom del visor (rueda / arrastre · doble click resetea)">${At("zoom",17)}<small data-k="zoomv">1.0×</small></button>
    </span>`),v=Ua(`<div class="transport">
      <button class="icon-btn" data-t="restart" title="Al principio">${At("restart",15)}</button>
      <button class="icon-btn" data-t="back" title="5 s atrás">${At("back",15)}</button>
      <button class="icon-btn tp-play" data-t="play" title="Reproducir / pausa">${At("play",16,"i-play")}${At("pause",16,"i-pause")}</button>
      <div class="tp-line"><input type="range" min="0" max="1000" value="0" data-k="tpseek" aria-label="línea de tiempo" /><span class="tp-marks" data-k="tpmarks"></span></div>
      <span class="tp-time" data-k="tptime">en vivo</span>
      <button class="tp-btn" data-t="last" title="Reproducir tu última sesión acá, con todos los HUDs">${At("play",13)} lo que grabaste</button>
      <button class="tp-btn tp-live" data-t="live" hidden>${At("live",14)} en vivo</button>
    </div>`);a.prepend(A),a.prepend(v),h.add({id:"equilibrio",title:"Equilibrio · peso izq ↔ der",icon:"equilibrio",content:p.el,def:pi.equilibrio,minW:320,minH:110,cls:"w-hero"}),h.add({id:"progreso",title:"Progreso del movimiento",icon:"senal",content:m.el,def:pi.progreso,minW:260,minH:96,cls:"w-hero"}),h.add({id:"ejercicios",title:"Ejercicios",icon:"esqueleto",content:c,def:pi.ejercicios,minW:180,minH:140}),h.add({id:"conteo",title:"Conteo",icon:"check",content:M,def:pi.conteo,minW:210,minH:140}),h.add({id:"golpes",title:"Acciones · golpes y footwork",icon:"golpes",content:_.el,def:pi.golpes,minW:220,minH:180}),h.add({id:"cuerpo",title:"Cuerpo",icon:"angulos",content:It("#hud-stats"),def:pi.cuerpo,minW:210,minH:140}),h.add({id:"senal",title:"Señal · extensión del brazo",icon:"senal",content:It("#chart-live"),def:pi.senal,minW:230,minH:110}),h.add({id:"piernas",title:"Piernas · rodillas",icon:"estelas",content:g.el,def:pi.piernas,minW:230,minH:110}),h.add({id:"reps",title:"Duración por rep",icon:"senal",content:It("#chart-reps"),def:pi.reps,minW:230,minH:110,hidden:!0}),h.add({id:"bitacora",title:"Bitácora",icon:"bitacora",content:It("#hud-log"),def:pi.bitacora,minW:210,minH:90}),h.add({id:"tresd",title:"3D · calor en seguimiento",icon:"tresd",content:o,def:pi.tresd,minW:220,minH:180,glass:1}),h.add({id:"calor",title:"Mapa térmico",icon:"calor",content:x,def:pi.calor,minW:200,minH:150,hidden:!0}),h.add({id:"lecturas",title:"Lecturas · 12 capas",icon:"layers",content:T,def:pi.lecturas,minW:320,minH:200,hidden:!0}),h.add({id:"dock",title:"Grabación",icon:"rec",content:a,def:pi.dock,minW:440,minH:104,cls:"w-dock"}),l.hidden=!0;const E=new Sx(o,{ink:pt.ink});It("#world",o).style.display="none",window.__mlWorld.draw=ue=>E.draw(ue),E.setMode("calor"),E.setPOV("seguimiento",!1);const P=Ua(`<div class="pov">${yx.map(ue=>`<button data-p="${ue}" class="${ue==="seguimiento"?"on":""}">${ue}</button>`).join("")}<span class="pov-sp"></span><button data-m="calor" class="on" title="Partículas: se encienden los segmentos que más se mueven">${At("calor",14)}calor</button></div>`),D=Ua('<div class="pov-hot"></div>');o.append(P,D),P.addEventListener("click",ue=>{const pe=ue.target.closest("button");if(pe&&(pe.dataset.p&&(E.setPOV(pe.dataset.p),Vo("[data-p]",P).forEach(_e=>_e.classList.toggle("on",_e===pe))),pe.dataset.m)){const _e=E.mode!=="calor";E.setMode(_e?"calor":"figura"),pe.classList.toggle("on",_e)}}),document.addEventListener("ml-theme",()=>E.setInk(pt.ink)),setInterval(()=>{if(document.body.classList.contains("perf"))return;const ue=E.mode==="calor"?E.hottest():null;D.textContent=ue?`más activo: ${ue}`:""},500),window.__mlBus?.addEventListener("perf",ue=>E.setPaused(!!ue.detail));const L=(ue,pe)=>{const _e=It(ue);_e&&_e.checked!==pe&&(_e.checked=pe,_e.dispatchEvent(new Event("change")))},k=()=>{for(const ue of Vo(".lx",T)){const pe=!!d[ue.dataset.r];ue.classList.toggle("on",pe),ue.setAttribute("aria-pressed",pe)}L("#tg-trails",d.estelas),L("#tg-ghosts",d.fantasmas),L("#tg-angles",d.angulos);for(const[ue,pe]of[["tresd","tresd"],["senal","senal"],["bitacora","bitacora"]])h.isOpen(pe)!==d[ue]&&h.set(pe,{hidden:!d[ue]});It("[data-k=heatover]",x).checked=d.calor,pr.set("readings",d)},U=()=>{for(const ue of Vo(".lx-f",T)){const pe=ue.dataset.f,_e=pe==="video"?It("#tg-video").checked:pe==="espejo"?It("#tg-mirror").checked:pe==="tinta"?pt.ink:!!u[pe];ue.classList.toggle("on",_e)}pr.set("filters",u)};T.addEventListener("click",ue=>{const pe=ue.target.closest(".lx")?.dataset.r;if(pe==="comparar"){It(".tab[data-view=compare]")?.click();return}if(pe){d[pe]=!d[pe],k();return}const _e=ue.target.closest(".lx-f")?.dataset.f;if(_e){if(_e==="video"){const Ge=It("#tg-video");Ge.checked=!Ge.checked,Ge.dispatchEvent(new Event("change"))}else if(_e==="espejo"){const Ge=It("#tg-mirror");Ge.checked=!Ge.checked,Ge.dispatchEvent(new Event("change"))}else _e==="tinta"?pt.toggle():u[_e]=!u[_e];U()}}),It("[data-k=heatover]",x).addEventListener("change",ue=>{d.calor=ue.target.checked,k()}),s.addEventListener("ws-change",ue=>{const _e={tresd:"tresd",senal:"senal",bitacora:"bitacora"}[ue.detail.id];_e&&d[_e]===ue.detail.st.hidden&&(d[_e]=!ue.detail.st.hidden,k())}),document.addEventListener("ml-theme",U),k(),U(),A.addEventListener("click",ue=>{const pe=ue.target.closest("[data-d]")?.dataset.d;pe==="lecturas"&&h.set("lecturas",{hidden:h.isOpen("lecturas")}),pe==="zoom"&&(f.zoom=1,f.panX=f.panY=0)});const O=n.transport,X=It("[data-k=tpseek]",v),z=It("[data-k=tpmarks]",v),re=It("[data-k=tptime]",v);let q=[],te=!1;v.addEventListener("click",async ue=>{const pe=ue.target.closest("[data-t]")?.dataset.t;if(!pe)return;const _e=O.state();if(pe==="play"&&O.toggle(),pe==="restart"&&(O.seek(0),q=[]),pe==="back"&&O.seek(_e.t-5e3),pe==="last"){const Ge=i.lastSessionId??(await Zr())[0]?.id;if(!Ge){t.dispatchEvent(new CustomEvent("toast",{detail:"Todavía no grabaste nada"}));return}q=[],await n.startReplay(Ge)}pe==="live"&&(q=[],await n.backToLive())}),X.addEventListener("pointerdown",()=>{te=!0}),X.addEventListener("input",()=>{const ue=O.state();ue.dur&&O.seek(Number(X.value)/1e3*ue.dur)}),X.addEventListener("change",()=>{te=!1}),t.addEventListener("replay-reset",()=>{_.reset(),g.reset(),q=q.filter(()=>!1)}),t.addEventListener("source",()=>{_.reset(),g.reset(),q=[]});const H=It("#stage");H.addEventListener("wheel",ue=>{ue.preventDefault();const pe=H.getBoundingClientRect(),_e=ue.clientX-pe.left-pe.width/2,Ge=ue.clientY-pe.top-pe.height/2,ze=Df(f.zoom*Math.exp(-ue.deltaY*.0015),1,5),He=(_e-f.panX)/f.zoom,ot=(Ge-f.panY)/f.zoom;f.zoom=ze,f.panX=ze===1?0:_e-He*ze,f.panY=ze===1?0:Ge-ot*ze},{passive:!1}),H.addEventListener("pointerdown",ue=>{if(ue.button!==0||f.zoom===1)return;H.setPointerCapture(ue.pointerId);const pe=ue.clientX-f.panX,_e=ue.clientY-f.panY,Ge=He=>{f.panX=He.clientX-pe,f.panY=He.clientY-_e},ze=()=>{H.removeEventListener("pointermove",Ge),H.removeEventListener("pointerup",ze)};H.addEventListener("pointermove",Ge),H.addEventListener("pointerup",ze)}),H.addEventListener("dblclick",()=>{f.zoom=1,f.panX=f.panY=0});const J={st:null,fx:[],hist:[],heat:{gx:48,gy:27,g:new Float32Array(1296)},heatMax:1e-6},se=ue=>{const pe=ue==="L"?"l":"r";let _e=0;for(let Ge=1;Ge<J.hist.length;Ge++){const ze=J.hist[Ge-1],He=J.hist[Ge],ot=(He.t-ze.t)/1e3;!ze[pe]||!He[pe]||ot<=0||J.hist.at(-1).t-He.t>260||(_e=Math.max(_e,Math.hypot(He[pe][0]-ze[pe][0],He[pe][1]-ze[pe][1],He[pe][2]-ze[pe][2])/ot))}return _e};t.addEventListener("step",ue=>{if(i.view!=="studio")return;const pe=ue.detail;J.st=pe;const _e=pe.frame,Ge=performance.now();if(_e?.world)for(J.hist.push({t:pe.t,l:_e.world[Be.l_wrist],r:_e.world[Be.r_wrist]});J.hist.length>12;)J.hist.shift();if(_e){const ze=(He,ot,Tt)=>{const rt=Math.floor(He*J.heat.gx),gt=Math.floor(ot*J.heat.gy);if(rt>=0&&rt<J.heat.gx&&gt>=0&&gt<J.heat.gy){const bt=gt*J.heat.gx+rt;J.heat.g[bt]+=Tt,J.heat.g[bt]>J.heatMax&&(J.heatMax=J.heat.g[bt])}};for(const He of["l_wrist","r_wrist","l_ankle","r_ankle"]){const ot=_e.pts[Be[He]];ot[3]>=.4&&ze(ot[0],ot[1],1)}Number.isFinite(pe.sig.comX)&&ze(pe.sig.comX,pe.sig.comY,1.5)}_.update(pe,{wristSpeed:se}),g.update(pe);for(const ze of pe.newEvents){if(ze.type==="punch"&&_e){const He=ze.data.side,ot=_e.pts[Be[He==="L"?"l_wrist":"r_wrist"]],Tt=se(He);J.fx.push({t0:Ge,x:ot[0],y:ot[1],color:He==="L"?as.L:as.R,label:`${(Xd[ze.data.kind]??ze.data.kind).toUpperCase()} ${He==="L"?"IZQ":"DER"}`,sub:Tt>.2?`${Tt.toFixed(1)} m/s`:"",seed:Math.random()*6})}else if(ze.type==="rep"&&_e&&Number.isFinite(pe.sig.comX))J.fx.push({t0:Ge,x:pe.sig.comX,y:pe.sig.comY,color:ea.orange,label:`REP ${ze.data.n}`,sub:ze.data.tempo??""});else if(ze.type==="jump"&&_e){const He=_e.pts[Be.l_ankle];J.fx.push({t0:Ge,x:He[0],y:He[1],color:as.ankleL,label:ze.text.toUpperCase(),sub:""})}["punch","rep","jump","lead","weight"].includes(ze.type)&&q.push({t:O.state().t,type:ze.type})}for(;J.fx.length&&Ge-J.fx[0].t0>900;)J.fx.shift();q.length>400&&(q=q.slice(-400))});const Qe=()=>{J.heat.g.fill(0),J.heatMax=1e-6,_.reset(),g.reset()};t.addEventListener("exercise",Qe),t.addEventListener("rec",ue=>ue.detail&&Qe());const it=(ue,pe)=>ue.querySelector(`[data-k=${pe}]`);let Xe="",Z="",he=0,Ee=0;const Ue=it(x,"heatcv"),Te=ue=>{if(requestAnimationFrame(Te),i.view!=="studio")return;const pe=document.body.classList.contains("perf"),_e=J.heat,Ge=!pe&&d.calor?_e.g.map(rt=>rt/J.heatMax):null;if(e.stage.set(pe?{angleArcs:!1,bbox:!1,showSkeleton:!0,showCom:!1,fx:null,heat:null,ghosts:!1,trails:!1,chrome:!0,recT:i.rec?(ue-i.rec.startPerf)/1e3:null,ink:pt.ink,videoFilter:"",dimVideo:.35,zoom:f.zoom,panX:f.panX,panY:f.panY}:{angleArcs:!0,bbox:d.deteccion,showSkeleton:d.esqueleto,showCom:d.equilibrio,fx:d.golpes?J.fx:null,heat:d.calor?{gx:_e.gx,gy:_e.gy,g:Ge}:null,ghosts:!0,trails:!0,chrome:!0,recT:i.rec?(ue-i.rec.startPerf)/1e3:null,ink:pt.ink,videoFilter:u.bn?"grayscale(1) contrast(1.1)":"",dimVideo:u.atenuado?.68:.35,zoom:f.zoom,panX:f.panX,panY:f.panY}),pe||(it(A,"zoomv").textContent=`${f.zoom.toFixed(1)}×`),ue-Ee>100){Ee=ue;const rt=O.state(),gt=rt.kind==="video"||rt.kind==="replay";v.classList.toggle("on",gt),v.classList.toggle("playing",rt.playing);const bt=!!i.source?.demo,V=It("[data-t=live]",v),Ke=bt?" usar mi cámara":" en vivo";V.hidden=!(rt.kind==="replay"||bt),V.lastChild.textContent!==Ke&&(V.lastChild.textContent=Ke);for(const ge of Vo("[data-t=restart], [data-t=back], [data-t=play]",v))ge.disabled=!gt;X.disabled=!gt,gt&&!te&&(X.value=rt.dur?Math.round(rt.t/rt.dur*1e3):0),re.textContent=gt?`${Ws(rt.t)} / ${Ws(rt.dur)}`:"en vivo",gt&&rt.dur?z.innerHTML=q.map(ge=>`<i class="m-${ge.type}" style="left:${(ge.t/rt.dur*100).toFixed(2)}%"></i>`).join(""):z.childElementCount&&(z.innerHTML="")}if(ue-he<(pe?100:33))return;he=ue;const ze=J.st,He=ze&&ue-i.lastSeenAt<700;if(pe){const rt=It("#hud-big").textContent;rt!==Xe&&(Xe=rt,ta(S,rt,{align:"left",ink:pt.ink,on:Zu()}));return}const ot=Tx(He?ze:null,_.lastHit,ue);s.style.setProperty("--live",ot);const Tt=It("#hud-big").textContent;(Tt!==Xe||ot!==Z&&ue%3<1.5)&&(Xe=Tt,Z=ot,ta(S,Tt,{align:"left",ink:pt.ink,on:pt.ink?"#0a0a0a":ot})),He&&(p.update(ze),m.update(ze),h.isOpen("calor")&&vC(Ue,_e,J.heatMax,ze.frame,pt.ink))};return requestAnimationFrame(Te),t.addEventListener("view",ue=>{ue.detail==="studio"&&(h.relayout(),h.intro())}),h}const Lu=i=>{const e=Math.sin(i*12.9898)*43758.5453;return e-Math.floor(e)};function vC(i,e,t,n,s){const r=i.getBoundingClientRect(),a=Math.min(2,devicePixelRatio||1),o=Math.max(1,Math.round(r.width*a)),c=Math.max(1,Math.round(r.height*a));(i.width!==o||i.height!==c)&&(i.width=o,i.height=c);const l=i.getContext("2d");l.globalCompositeOperation="source-over",l.fillStyle=s?"#efeee8":"#05070a",l.fillRect(0,0,o,c);const h=o/e.gx,d=c/e.gy,u=performance.now()/1e3;l.globalCompositeOperation=s?"multiply":"lighter";for(let f=0;f<e.gy;f++)for(let p=0;p<e.gx;p++){const m=e.g[f*e.gx+p]/t;if(m<.015)continue;const _=1+Math.round(m*7);for(let g=0;g<_;g++){const x=p*7919+f*104729+g*31,T=(e.gx-1-p+Lu(x)+Math.sin(u*.8+x)*.25)*h,b=(f+Lu(x+1)+Math.cos(u*.7+x)*.25)*d,S=(.8+m*2.2+Lu(x+2))*a;l.fillStyle=s?m>.4?`rgba(180,69,40,${.3+m*.6})`:`rgba(31,79,209,${.25+m*.6})`:m>.6?`rgba(255,232,196,${.5+m*.5})`:m>.25?`rgba(224,96,64,${.35+m})`:`rgba(47,123,255,${.3+m})`,l.beginPath(),l.arc(T,b,S,0,Math.PI*2),l.fill()}}if(l.globalCompositeOperation="source-over",n){l.strokeStyle=s?"rgba(10,10,10,0.65)":"rgba(224,96,64,0.6)",l.lineWidth=1.4*a;const f=p=>{const m=n.pts[Be[p]];return[(1-m[0])*o,m[1]*c]};for(const[p,m]of[["l_shoulder","r_shoulder"],["l_hip","r_hip"],["l_shoulder","l_hip"],["r_shoulder","r_hip"],["l_shoulder","l_elbow"],["l_elbow","l_wrist"],["r_shoulder","r_elbow"],["r_elbow","r_wrist"],["l_hip","l_knee"],["l_knee","l_ankle"],["r_hip","r_knee"],["r_knee","r_ankle"]]){const _=f(p),g=f(m);l.beginPath(),l.moveTo(_[0],_[1]),l.lineTo(g[0],g[1]),l.stroke()}}}function bC(i,e){if(!e)return;const t=[...e.wins.values()].map(n=>({label:n.title,icon:n.icon,on:!n.st.hidden,act:()=>e.set(n.id,{hidden:!n.st.hidden})}));t.push({sep:!0},{label:"Restablecer layout",icon:"reset",act:()=>e.reset()}),wS(i,t)}const MC={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Ml{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const yC=new gh(-1,1,1,-1,0,1);class SC extends pn{constructor(){super(),this.setAttribute("position",new rn([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new rn([0,2,0,0,2,0],2))}}const wC=new SC;class Dx{constructor(e){this._mesh=new hi(wC,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,yC)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class kx extends Ml{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Pi?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=tp.clone(e.uniforms),this.material=new Pi({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Dx(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class rg extends Ml{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class EC extends Ml{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class TC{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Je);this._width=n.width,this._height=n.height,t=new Hi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ls}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new kx(MC),this.copyPass.material.blending=ws,this.timer=new Yw}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}rg!==void 0&&(a instanceof rg?n=!0:a instanceof EC&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Je);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class AC extends Ml{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ct}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const _c={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class RC extends Ml{constructor(){super(),this.isOutputPass=!0,this.uniforms=tp.clone(_c.uniforms),this.material=new lx({name:_c.name,uniforms:this.uniforms,vertexShader:_c.vertexShader,fragmentShader:_c.fragmentShader}),this._fsQuad=new Dx(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Et.getTransfer(this._outputColorSpace)===zt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===If?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Uf?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ff?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Of?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===zf?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Hf?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Bf&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const CC={uniforms:{tDiffuse:{value:null},tFog:{value:null},uTime:{value:0},uHover:{value:0},uPull:{value:1},uRes:{value:new Je(1,1)},uMouse:{value:new Je(.5,.5)},uVel:{value:new Je(0,0)},uInk:{value:0},uRing:{value:new ct(14704704)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform sampler2D tFog; uniform float uTime, uHover, uInk, uPull; uniform vec2 uRes, uMouse, uVel; uniform vec3 uRing;
    varying vec2 vUv;
    vec4 tap(vec2 uv, vec2 off){ return texture2D(tDiffuse, uv + off); }
    void main(){
      vec2 uv = vUv;
      vec2 d = uv - 0.5; float r2 = dot(d, d);
      // empañado: el lienzo guarda lo limpiado (0) y lo que volvió (1); en reposo el centro se ve un poco más
      float rest = mix(0.72, 1.0, smoothstep(0.02, 0.2, r2));
      float fog = clamp(texture2D(tFog, uv).a * rest + uPull, 0.0, 1.0);
      // aberración cromática: más en los bordes, en el empañado y con hover
      vec2 ca = d * (0.003 + 0.018 * r2 + 0.006 * fog + 0.005 * uHover);
      vec4 base = vec4(tap(uv, ca).r, tap(uv, vec2(0.0)).g, tap(uv, -ca).b, tap(uv, vec2(0.0)).a);
      // filtro de movimiento: barrido en la dirección del cursor cuando se mueve rápido
      float sp = clamp(length(uVel) * 28.0, 0.0, 1.0);
      if (sp > 0.02) {
        vec4 mb = vec4(0.0);
        for (int i = 0; i < 8; i++) mb += tap(uv, uVel * 1.6 * (float(i) / 7.0 - 0.5));
        base = mix(base, mb / 8.0, sp * 0.85);
      }
      // blur de disco pesado por el empañado (y por la apertura de foco al entrar)
      vec4 acc = vec4(0.0); float rad = (1.0 + 7.5 * fog + 9.0 * uPull) / uRes.y;
      for (int i = 0; i < 12; i++) {
        float a = float(i) * 0.5236 + uTime * 0.2;
        acc += tap(uv, vec2(cos(a), sin(a)) * rad * (0.55 + 0.45 * mod(float(i), 2.0)));
      }
      acc /= 12.0;
      vec4 col = mix(base, acc, smoothstep(0.04, 0.85, fog));
      // velo lechoso donde está empañado (claro sobre papel, oscuro de noche)
      vec3 veil = mix(vec3(0.05, 0.05, 0.06), vec3(0.93, 0.92, 0.88), uInk);
      col.rgb = mix(col.rgb, veil, 0.14 * fog * col.a);
      col.rgb *= 1.0 - 0.3 * smoothstep(0.12, 0.5, r2);
      // retícula de foco que sigue al cursor (anillo + 4 marcas)
      vec2 q = (uv - uMouse) * vec2(uRes.x / uRes.y, 1.0);
      float px = 1.0 / uRes.y, rr = length(q);
      float ring = smoothstep(1.6 * px, 0.0, abs(rr - 0.1));
      float tick = step(abs(q.x), px) * step(0.075, abs(q.y)) * step(abs(q.y), 0.125)
                 + step(abs(q.y), px) * step(0.075, abs(q.x)) * step(abs(q.x), 0.125);
      float hud = max(ring * 0.7, tick * 0.85) * uHover;
      col.rgb = mix(col.rgb, uRing, hud);
      col.a = max(col.a, hud);
      gl_FragColor = col;
    }`};class LC{constructor(e){this.host=e,this.el=document.createElement("div"),this.el.className="home-disc",this.el.innerHTML=`<canvas></canvas>
      <div class="disc-glass"></div>
      <span class="disc-c"><i></i><i></i><i></i><i></i></span>
      <span class="disc-tag">lente · pasá el mouse para limpiarlo</span>
      <span class="disc-read">X:0.50 Y:0.50</span>`,e.append(this.el),this.canvas=this.el.querySelector("canvas"),this.read=this.el.querySelector(".disc-read"),this.hover=0,this.hoverT=0,this.mouse=new Je(0,0),this.mouseUV=new Je(.5,.5),this.smooth=new Je(0,0),this.lensUV=new Je(.5,.5),this.prevUV=new Je(.5,.5),this.vel=new Je(0,0),this.pull=1,this.t0=performance.now(),this.ready=!1,this.init()}async init(){const e=await new Promise(_=>{const g=new Image;g.onload=()=>_(g),g.onerror=()=>_(null),g.src="brand/hero-disc.png"});if(!e)return;const t=new vh({canvas:this.canvas,antialias:!0,alpha:!0,premultipliedAlpha:!1});t.setPixelRatio(Math.min(1.5,devicePixelRatio||1)),t.setClearColor(0,0),this.r=t,this.scene=new ph,this.cam=new li(30,1,.1,50),this.cam.position.set(0,0,4.2);const n=e.width/e.height,s=1.9,r=s*n;this.size={W:r,H:s};const a=new Yn(e);a.colorSpace=ai,a.needsUpdate=!0,this.planeMat=new mh({map:a,transparent:!0,opacity:1,depthWrite:!1}),this.plane=new hi(new xo(r,s),this.planeMat),this.group=new Xr,this.group.add(this.plane),this.scene.add(this.group);const o=document.createElement("canvas"),c=3;o.width=Math.round(e.width/c),o.height=Math.round(e.height/c);const l=o.getContext("2d");l.drawImage(e,0,0,o.width,o.height);const h=l.getImageData(0,0,o.width,o.height).data,d=[],u=[],f=[];for(let _=0;_<o.height;_++)for(let g=0;g<o.width;g++){const x=(_*o.width+g)*4;if(h[x+3]/255<.5)continue;const b=h[x]/255,S=h[x+1]/255,M=h[x+2]/255,A=.3*b+.59*S+.11*M,v=Math.max(b,S,M)-Math.min(b,S,M);if(A<.14&&v<.1)continue;const P=b>.6&&S<.55&&M<.45?.03+Math.random()*.06:v>.25?.12+Math.random()*.04:.02;d.push((g/o.width-.5)*r,(.5-_/o.height)*s,P),u.push(b,S,M),f.push(Math.random())}const p=new pn;p.setAttribute("position",new rn(d,3)),p.setAttribute("color",new rn(u,3)),p.setAttribute("seed",new rn(f,1)),this.pMat=new Pi({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uHover:{value:0},uMouse:{value:new Je(0,0)},uSize:{value:1.8*t.getPixelRatio()}},vertexShader:`
        attribute float seed; varying vec3 vColor; varying float vA;
        uniform float uTime, uHover, uSize; uniform vec2 uMouse;
        void main(){
          vColor = color;
          vec3 p = position;
          float dm = distance(p.xy, uMouse);
          float near = smoothstep(0.75, 0.0, dm) * uHover;
          // respiración leve + descomposición alrededor del mouse
          p.z += sin(uTime * 1.3 + seed * 40.0) * 0.012 + near * (0.28 + seed * 0.7);
          p.xy += normalize(p.xy - uMouse + 1e-4) * near * (0.08 + seed * 0.2);
          p.xy += vec2(sin(uTime * 0.7 + seed * 20.0), cos(uTime * 0.9 + seed * 17.0)) * 0.006;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * (1.0 + near * 0.9) * (4.2 / -mv.z);
          vA = 0.4 + 0.55 * near;
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        varying vec3 vColor; varying float vA;
        void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25) discard; gl_FragColor = vec4(vColor, vA * smoothstep(0.25, 0.05, r)); }`,vertexColors:!0}),this.points=new Jc(p,this.pMat),this.group.add(this.points),this.fog=document.createElement("canvas"),this.fog.width=this.fog.height=128,this.fctx=this.fog.getContext("2d"),this.fctx.fillStyle="#fff",this.fctx.fillRect(0,0,128,128),this.fogTex=new rx(this.fog),this.composer=new TC(t),this.composer.addPass(new AC(this.scene,this.cam)),this.lens=new kx(CC),this.lens.uniforms.tFog.value=this.fogTex,this.composer.addPass(this.lens),this.composer.addPass(new RC),this.el.addEventListener("pointerenter",()=>{this.hoverT=1}),this.el.addEventListener("pointerleave",()=>{this.hoverT=0}),this.el.addEventListener("pointermove",_=>{const g=this.el.getBoundingClientRect(),x=(_.clientX-g.left)/g.width,T=(_.clientY-g.top)/g.height;this.mouseUV.set(x,T),this.mouse.set((x-.5)*2,(.5-T)*2),this.read.textContent=`X:${x.toFixed(2)} Y:${T.toFixed(2)}`,this.el.style.setProperty("--dx",`${x*100}%`),this.el.style.setProperty("--dy",`${T*100}%`),this.wipe(x,T)}),window.__mlBus?.addEventListener("view",_=>{_.detail==="home"&&(this.pull=1)}),new ResizeObserver(()=>this.resize()).observe(this.el),this.resize(),this.ready=!0;const m=()=>{requestAnimationFrame(m),!(this.el.offsetParent===null||document.hidden)&&this.render()};requestAnimationFrame(m)}wipe(e,t){const n=this.fctx,s=e*128,r=t*128,a=n.createRadialGradient(s,r,3,s,r,24);a.addColorStop(0,"rgba(0,0,0,1)"),a.addColorStop(.55,"rgba(0,0,0,0.6)"),a.addColorStop(1,"rgba(0,0,0,0)"),n.globalCompositeOperation="destination-out",n.fillStyle=a,n.beginPath(),n.arc(s,r,24,0,Math.PI*2),n.fill(),n.globalCompositeOperation="source-over"}resize(){if(!this.r)return;const e=Math.max(1,this.el.clientWidth),t=Math.max(1,this.el.clientHeight);this.r.setSize(e,t,!1),this.composer.setSize(e,t),this.cam.aspect=e/t;const n=this.size.H*1.18,s=this.size.W*1.12/this.cam.aspect;this.base=Math.max(n,s)/(2*Math.tan(this.cam.fov*Math.PI/360)),this.cam.updateProjectionMatrix(),this.lens.uniforms.uRes.value.set(e,t)}render(){const e=(performance.now()-this.t0)/1e3;this.hover+=(this.hoverT-this.hover)*.06,this.smooth.lerp(this.mouse,.08);const t=this.fctx;t.globalCompositeOperation="source-over";const n=t.createRadialGradient(64,64,10,64,64,90);n.addColorStop(0,"rgba(255,255,255,0.0035)"),n.addColorStop(1,"rgba(255,255,255,0.013)"),t.fillStyle=n,t.fillRect(0,0,128,128),this.fogTex.needsUpdate=!0;const s=hn()?0:1,r=1-.36*this.hover;this.pull*=hn()?0:.955,this.cam.position.set(this.smooth.x*.55*this.hover+Math.sin(e*.3)*.05*s,this.smooth.y*.45*this.hover+Math.cos(e*.25)*.04*s,this.base*r),this.cam.lookAt(this.smooth.x*.35*this.hover,this.smooth.y*.3*this.hover,0),this.group.rotation.y=this.smooth.x*.22+Math.sin(e*.35)*.06*s,this.group.rotation.x=-this.smooth.y*.16+Math.cos(e*.3)*.04*s;const a=this.smooth.x*this.size.W*.5,o=this.smooth.y*this.size.H*.5;this.pMat.uniforms.uTime.value=e,this.pMat.uniforms.uHover.value=this.hover,this.pMat.uniforms.uMouse.value.set(a,o);const c=this.lens.uniforms;c.uTime.value=e,c.uHover.value=this.hover,c.uInk.value=pt.ink?1:0,c.uPull.value=this.pull,this.lensUV.lerp(new Je(this.mouseUV.x,1-this.mouseUV.y),.25),this.vel.lerp(new Je(this.mouseUV.x-this.prevUV.x,this.prevUV.y-this.mouseUV.y),.3),this.prevUV.copy(this.mouseUV),c.uMouse.value.copy(this.lensUV),c.uVel.value.copy(this.vel),c.uRing.value.set(pt.ink?11814184:14704704),this.composer.render()}}const Go=[{f:"'Faculty Glyphic'",s:"normal",w:400,k:1},{f:"'Instrument Serif'",s:"italic",w:400,k:1.14},{f:"'Bodoni Moda'",s:"italic",w:500,k:1.02},{f:"'Unbounded'",s:"normal",w:500,k:.74},{f:"'Syne'",s:"normal",w:700,k:.92},{f:"'Six Caps'",s:"normal",w:400,k:1.55},{f:"'Big Shoulders Display'",s:"normal",w:800,k:1.1},{f:"'Fraunces'",s:"italic",w:400,k:1}],PC={titulares:["No train, no gain.","Cada golpe cuenta.","Entrená para ser mejor."],subtitulos:["Tecnología interconectada con la naturaleza","Technology interconnected with nature"]},bs=i=>new Promise(e=>setTimeout(e,i)),DC=i=>Promise.race([document.fonts?.load(`${i.s} ${i.w} 40px ${i.f}`).catch(()=>{}),bs(900)]);async function kC(i,e){let t=PC;try{t=await(await fetch("data/frases.json")).json()}catch{}const n=f=>{i.style.fontFamily=`${f.f}, 'Instrument Serif', serif`,i.style.fontStyle=f.s,i.style.fontWeight=f.w,i.style.setProperty("--k",f.k)},s=f=>{const p=a.textContent;a.textContent=f;let m=1;i.style.setProperty("--fit",m);const _=i.clientHeight+2;for(;c.offsetHeight>_&&m>.45;)m-=.05,i.style.setProperty("--fit",m.toFixed(2));a.textContent=p},r=async(f,p)=>{await DC(f),n(f),s(p)},a=document.createElement("span");a.className="ph-txt";const o=document.createElement("i");o.className="ph-caret";const c=document.createElement("span");if(c.className="ph-line",c.append(a,o),i.replaceChildren(c),hn()){await r(Go[0],t.titulares[0]),a.textContent=t.titulares[0],e.textContent=t.subtitulos[0];return}let l=0,h=0,d=0;e.textContent=t.subtitulos[0];const u=()=>i.offsetParent!==null&&!document.hidden;for(;;){if(!u()){await bs(500);continue}const f=t.titulares[h%t.titulares.length];await r(Go[l%Go.length],f),i.classList.add("typing");for(let p=1;p<=f.length;p++)a.textContent=f.slice(0,p),await bs(38+Math.random()*40);i.classList.remove("typing"),await bs(1300);for(let p=0;p<3;p++)l++,await r(Go[l%Go.length],f),i.classList.add("swap"),await bs(90),i.classList.remove("swap"),await bs(560);await bs(900),d++,e.classList.add("fade"),await bs(260),e.textContent=t.subtitulos[d%t.subtitulos.length],e.classList.remove("fade"),i.classList.add("typing");for(let p=f.length;p>=0;p--)a.textContent=f.slice(0,p),await bs(16);h++,l++,await bs(260)}}const Fa=(i,e=document)=>e.querySelector(i),xc=(i,e=document)=>[...e.querySelectorAll(i)],Is=i=>String(i??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Or=i=>{const e=document.createElement("template");return e.innerHTML=i.trim(),e.content.firstElementChild},Oa={racha:{x:.635,y:.025,w:.19,h:.3},hoy:{x:.83,y:.025,w:.162,h:.3},progreso:{x:.635,y:.345,w:.357,h:.2},ejercicios:{x:.635,y:.565,w:.357,h:.42},ultimas:{x:.012,y:.7,w:.325,h:.285},manifiesto:{x:.41,y:.745,w:.215,h:.24}},vc=(i={})=>i.punches!=null?["golpes",i.punches]:i.reps!=null?["reps",i.reps]:i.jumps!=null?["saltos",i.jumps]:i.holdMs!=null?["s",+(i.holdMs/1e3).toFixed(1)]:["—",null],Ba=i=>`${i.getFullYear()}-${i.getMonth()}-${i.getDate()}`;function NC(){const i=Fa("#view-home"),e=window.__ml,t=window.__mlAct,n=Or(`<div class="home-anchor">
      <div class="home-bg"></div>
      <div class="home-hero">
        <p class="kicker">${At("esqueleto",14)} Moyon Lab · South Hustles Biometric</p>
        <h1 class="home-title">No train, no gain.</h1>
        <p class="home-sub">Tecnología interconectada con la naturaleza</p>
        <nav class="acts">
          <button data-act="entrena"><span class="tilt-in"><b>ENTRENÁ</b><small>Elegí un ejercicio y arrancá</small><i class="glare"></i></span></button>
          <button data-act="graba"><span class="tilt-in"><b>GRABÁ</b><small>Sesión con cámara · barra espaciadora</small><i class="glare"></i></span></button>
          <button data-act="analiza"><span class="tilt-in"><b>ANALIZÁ</b><small>Tu última sesión, cuadro a cuadro</small><i class="glare"></i></span></button>
          <button data-act="compara"><span class="tilt-in"><b>COMPARÁ</b><small>Referencia vs intento</small><i class="glare"></i></span></button>
        </nav>
        <p class="motif"><span>①</span><span>②</span><span>③</span><em>Grabá</em><i class="motif-line"></i><b>✳</b><em>Analizá</em></p>
        <p class="home-status" data-k="status"></p>
      </div>
    </div>`);i.append(n),n.querySelectorAll(".acts button").forEach(m=>{m.querySelector(".tilt-in").insertAdjacentHTML("beforeend",`<span class="bx"><i></i><i></i><i></i><i></i><em>${m.dataset.act} 0.99</em></span>`),ja(m,{max:12,scale:1.035})});const s=[...n.querySelectorAll(".acts button")];let r=0,a=!1;n.querySelector(".acts").addEventListener("pointerenter",()=>{a=!0,s.forEach(m=>m.classList.remove("scan"))}),n.querySelector(".acts").addEventListener("pointerleave",()=>{a=!1}),setInterval(()=>{if(a||i.hidden)return;s.forEach((_,g)=>_.classList.toggle("scan",g===r));const m=s[r].querySelector(".bx em");m.textContent=`${s[r].dataset.act} 0.${90+Math.floor(Math.random()*10)}`,r=(r+1)%s.length},1e3),new LC(n),kC(n.querySelector(".home-title"),n.querySelector(".home-sub"));const o=new uh(i,{id:"home"}),c=Or('<div class="w-hoy"></div>'),l=Or('<div class="w-racha"></div>'),h=Or('<div class="w-progreso"></div>'),d=Or('<div class="w-ultimas"></div>'),u=Or('<div class="w-exs"></div>'),f=Or(`<div class="w-manifiesto">
      <p class="mf-q">¿Por qué motion tracking?</p>
      <p class="mf-eq">Una cámara = sin traje = sin nube.</p>
      <p class="mf-body">Un espejo te muestra cómo te ves. El motion tracking, cómo te movés — y lo guarda para que puedas comparar cada sesión.</p>
    </div>`);o.add({id:"hoy",title:"Hoy",icon:"check",content:c,def:Oa.hoy,minW:200,minH:150}),o.add({id:"racha",title:"Racha",icon:"calor",content:l,def:Oa.racha,minW:220,minH:150}),o.add({id:"progreso",title:"Progreso por ejercicio",icon:"senal",content:h,def:Oa.progreso,minW:300,minH:160}),o.add({id:"ultimas",title:"Últimas sesiones",icon:"sessions",content:d,def:Oa.ultimas,minW:320,minH:180}),o.add({id:"ejercicios",title:"Ejercicios",icon:"esqueleto",content:u,def:Oa.ejercicios,minW:300,minH:180}),o.add({id:"manifiesto",title:"Manifiesto",icon:"bitacora",content:f,def:Oa.manifiesto,minW:220,minH:120}),n.querySelector(".acts").addEventListener("click",async m=>{const _=m.target.closest("[data-act]")?.dataset.act;if(_){if(_==="entrena"&&t.show("studio"),_==="graba"&&(t.show("studio"),Fa("#btn-rec")?.animate([{boxShadow:"0 0 0 0 rgba(255,59,48,0.9)"},{boxShadow:"0 0 0 18px rgba(255,59,48,0)"}],{duration:900,iterations:2})),_==="analiza"){const[g]=await Zr();g?t.openPlayer(g.id):t.show("sessions")}_==="compara"&&t.show("compare")}}),new UC(Fa(".home-bg",n));async function p(){const m=await Zr(),_=new Date,g=Ba(_),x=m.filter(L=>Ba(new Date(L.createdAt))===g),T=(L,k)=>L.reduce((U,O)=>U+(O.kpis?.[k]??0),0),b=x.reduce((L,k)=>L+(k.durationMs??0),0)/6e4;c.innerHTML=`
      <div class="big3"><div><b>${x.length}</b><small>sesiones</small></div><div><b>${b.toFixed(b<10?1:0)}</b><small>minutos</small></div></div>
      <div class="big3"><div><b>${T(x,"punches")}</b><small>golpes</small></div><div><b>${T(x,"reps")}</b><small>reps</small></div><div><b>${T(x,"jumps")}</b><small>saltos</small></div></div>
      <p class="muted">${x.length?[...new Set(x.map(L=>L.exerciseName))].map(Is).join(" · "):"Hoy todavía no entrenaste."}</p>`;const S=new Map;for(const L of m){const k=Ba(new Date(L.createdAt));S.set(k,(S.get(k)??0)+1)}let M=0;for(let L=new Date(_);S.get(Ba(L));L.setDate(L.getDate()-1))M++;const A=new Date(_);A.setDate(A.getDate()-83);const v=[];for(let L=0;L<84;L++){const k=new Date(A);k.setDate(A.getDate()+L);const U=S.get(Ba(k))??0;v.push(`<i class="l${Math.min(4,U)}${Ba(k)===g?" today":""}" title="${k.toLocaleDateString("es-AR")} · ${U} sesiones"></i>`)}l.innerHTML=`<div class="rk-top"><b>${M}</b><small>día${M===1?"":"s"} seguidos</small></div><div class="rk-grid">${v.join("")}</div><p class="muted">${S.size} días entrenados · ${m.length} sesiones</p>`;const E=new Map;for(const L of[...m].reverse())E.has(L.exercise)||E.set(L.exercise,[]),E.get(L.exercise).push(L);const P=[...E.entries()].map(([L,k])=>{const[U]=vc(k.at(-1).kpis),O=k.map(q=>vc(q.kpis)[1]).filter(q=>q!=null).slice(-14),X=O.at(-1),z=O.at(-2),re=z?Math.round((X-z)/Math.max(1e-6,z)*100):null;return`<div class="pr-row" data-ex="${Is(L)}"><span class="pr-ico">${At(jm(L)?L:"free",18)}</span><span class="pr-name">${Is(k.at(-1).exerciseName)}<small>${k.length} sesiones</small></span>${IC(O)}<b>${X??"—"}<small>${Is(U)}</small></b><em class="${re>0?"up":re<0?"down":""}">${re==null?"":`${re>0?"+":""}${re}%`}</em></div>`});h.innerHTML=P.length?P.join(""):'<p class="muted">Grabá sesiones para ver tu progreso: cada ejercicio suma su línea.</p>',d.innerHTML=m.length?`<div class="ul-row">${m.slice(0,8).map(L=>{const[k,U]=vc(L.kpis);return`<button class="ucard" data-id="${Is(L.id)}"><span class="tilt-in">${L.thumb?`<img src="${L.thumb}" alt="" />`:'<span class="noimg"></span>'}<span class="uc-b"><b>${Is(L.exerciseName)}</b><small>${new Date(L.createdAt).toLocaleString("es-AR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})} · ${((L.durationMs??0)/1e3).toFixed(0)} s</small><em>${U??"—"} ${Is(k)}</em></span><i class="glare"></i></span></button>`}).join("")}</div>`:'<p class="muted">Todavía no hay sesiones: tocá GRABÁ.</p>',xc(".ucard",d).forEach(L=>{ja(L),L.addEventListener("click",()=>t.openPlayer(L.dataset.id))});const D=new Map;for(const L of m){const k=vc(L.kpis)[1];k!=null&&D.set(L.exercise,Math.max(D.get(L.exercise)??0,k))}u.innerHTML=`<div class="ex-grid">${e.exercises.map(L=>`<button class="excard" data-ex="${Is(L.id)}"><span class="tilt-in">${At(jm(L.id)?L.id:"free",30)}<b>${Is(L.name)}</b><small>${D.has(L.id)?`mejor: ${D.get(L.id)}`:"sin sesiones"}</small><i class="glare"></i></span></button>`).join("")}</div>`,xc(".excard",u).forEach(L=>{ja(L,{max:14}),L.addEventListener("click",()=>{t.selectExercise(L.dataset.ex),t.show("studio")})}),xc(".pr-row",h).forEach(L=>L.addEventListener("click",()=>{t.selectExercise(L.dataset.ex),t.show("studio")})),Fa("[data-k=status]",n).textContent=e.engine?`motor listo · ${Fa("#st-engine").textContent} · ${Fa("#st-source").textContent}`:"configurá el motor y la cámara desde Configurar"}return window.__mlBus.addEventListener("view",m=>{m.detail==="home"&&(p(),o.relayout(),o.intro(),hn()||xc(".acts button",n).forEach((_,g)=>_.animate([{opacity:0,transform:"translateY(26px)"},{opacity:1,transform:"none"}],{duration:620,delay:60*g,easing:Ts,fill:"backwards"})))}),window.__mlBus.addEventListener("rec",m=>{m.detail||setTimeout(p,1500)}),o}function IC(i){if(i.length<2)return'<svg class="spark" viewBox="0 0 100 28"></svg>';const e=Math.min(...i),t=Math.max(...i),n=t-e||1,s=i.map((o,c)=>`${c/(i.length-1)*100},${26-(o-e)/n*22}`).join(" "),[r,a]=s.split(" ").at(-1).split(",");return`<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none"><polyline points="${s}" /><circle cx="${r}" cy="${a}" r="2.4" /></svg>`}class UC{constructor(e){this.el=e,this.t0=performance.now(),this.mouse={x:0,y:0,sx:0,sy:0};const t=document.createElement("canvas");e.append(t),this.r=new vh({canvas:t,antialias:!0,alpha:!0}),this.r.setPixelRatio(Math.min(1.75,devicePixelRatio||1)),this.scene=new ph,this.cam=new li(32,1,.1,40),this.frames=null,fetch("demo/boxer.json").then(l=>l.json()).then(l=>{this.frames=l.frames});const n={nose:0,ls:5,rs:6,le:7,re:8,lw:9,rw:10,lh:11,rh:12,lk:13,rk:14,la:15,ra:16,lt:19,rt:20};this.bones=[[n.ls,n.rs,"C"],[n.lh,n.rh,"C"],[n.ls,n.lh,"C"],[n.rs,n.rh,"C"],[n.ls,n.le,"L"],[n.le,n.lw,"L"],[n.rs,n.re,"R"],[n.re,n.rw,"R"],[n.lh,n.lk,"L"],[n.lk,n.la,"L"],[n.rh,n.rk,"R"],[n.rk,n.ra,"R"],[n.la,n.lt,"L"],[n.ra,n.rt,"R"],[n.nose,n.ls,"H"],[n.nose,n.rs,"H"]];const s=5200;this.N=s;const r=new pn;this.pos=new Float32Array(s*3),this.col=new Float32Array(s*3),this.pb=new Uint8Array(s),this.pt=new Float32Array(s),this.po=new Float32Array(s*3),this.pd=new Float32Array(s);for(let l=0;l<s;l++){this.pb[l]=l%this.bones.length,this.pt[l]=Math.random();const h=this.bones[this.pb[l]][2]==="H",d=(h?.09:.02)+Math.random()*(h?.05:.07),u=Math.random()*6.283,f=Math.acos(2*Math.random()-1);this.po.set([d*Math.sin(f)*Math.cos(u),d*Math.sin(f)*Math.sin(u),d*Math.cos(f)],l*3),this.pd[l]=Math.random()}r.setAttribute("position",new Gn(this.pos,3)),r.setAttribute("color",new Gn(this.col,3)),this.mat=new Zc({size:.017,vertexColors:!0,transparent:!0,opacity:.9,blending:oo,depthWrite:!1}),this.points=new Jc(r,this.mat),this.scene.add(this.points);const a=new pn,o=new Float32Array(900*3);for(let l=0;l<900;l++)o.set([(Math.random()-.5)*7,(Math.random()-.5)*4,(Math.random()-.5)*5],l*3);a.setAttribute("position",new Gn(o,3)),this.dustMat=new Zc({size:.012,color:14704704,transparent:!0,opacity:.35,depthWrite:!1}),this.dust=new Jc(a,this.dustMat),this.scene.add(this.dust),this.grid=new dx(8,32,14704704,2757904),this.grid.position.y=-.98,this.grid.material.transparent=!0,this.grid.material.opacity=.35,this.scene.add(this.grid),this.cols={L:new ct(3111935),R:new ct(16726832),C:new ct(2282347),H:new ct(16766474),A:new ct(14704704)},addEventListener("pointermove",l=>{this.mouse.x=l.clientX/innerWidth-.5,this.mouse.y=l.clientY/innerHeight-.5},{passive:!0}),new ResizeObserver(()=>this.resize()).observe(e),this.resize(),document.addEventListener("ml-theme",()=>this.themed()),this.themed();const c=()=>{requestAnimationFrame(c),!(e.offsetParent===null||document.hidden)&&this.render()};requestAnimationFrame(c)}themed(){const e=pt.ink;this.mat.blending=e?jr:oo,this.mat.needsUpdate=!0,this.dustMat.color.set(e?657930:14704704),this.dustMat.opacity=e?.18:.35,this.grid.material.color?.set?.(e?657930:14704704),this.grid.material.opacity=e?.15:.35}resize(){const e=Math.max(1,this.el.clientWidth),t=Math.max(1,this.el.clientHeight);this.r.setSize(e,t,!1),this.cam.aspect=e/t,this.cam.updateProjectionMatrix()}render(){const e=(performance.now()-this.t0)/1e3;this.mouse.sx+=(this.mouse.x-this.mouse.sx)*.05,this.mouse.sy+=(this.mouse.y-this.mouse.sy)*.05;const t=Math.sin(e*.15)*.35+this.mouse.sx*.9;if(this.cam.position.set(Math.sin(t)*5+.05,-.2-this.mouse.sy*.8,Math.cos(t)*5),this.cam.lookAt(.05,-.46,0),this.dust.rotation.y=e*.02+this.mouse.sx*.2,this.frames?.length){const n=e*30%this.frames.length,s=Math.floor(n),r=(s+1)%this.frames.length,a=n-s,o=this.frames[s],c=this.frames[r],l=f=>[-(o[f][0]+(c[f][0]-o[f][0])*a),-(o[f][1]+(c[f][1]-o[f][1])*a),-(o[f][2]+(c[f][2]-o[f][2])*a)],h=this.bones.map(([f,p])=>[l(f),l(p)]),d=pt.ink,u=new ct;for(let f=0;f<this.N;f++){const p=this.pb[f],[m,_]=h[p],g=this.pt[f],x=Math.sin(e*2+this.pd[f]*20)*.01;this.pos[f*3]=m[0]+(_[0]-m[0])*g+this.po[f*3]+x-.02,this.pos[f*3+1]=m[1]+(_[1]-m[1])*g+this.po[f*3+1],this.pos[f*3+2]=m[2]+(_[2]-m[2])*g+this.po[f*3+2];const T=this.bones[p][2];u.copy(this.pd[f]>.55?this.cols.A:this.cols[T]);const b=d?.55:.35+.65*this.pd[f];d?(this.col[f*3]=u.r*.5,this.col[f*3+1]=u.g*.5,this.col[f*3+2]=u.b*.5):(this.col[f*3]=u.r*b,this.col[f*3+1]=u.g*b,this.col[f*3+2]=u.b*b)}this.points.geometry.attributes.position.needsUpdate=!0,this.points.geometry.attributes.color.needsUpdate=!0}this.r.render(this.scene,this.cam)}}const ag={L:"#2f7bff",R:"#ff3b30",C:"#22d36b",H:"#ffd60a"},FC=[["l_shoulder","r_shoulder","C"],["l_hip","r_hip","C"],["l_shoulder","l_hip","C"],["r_shoulder","r_hip","C"],["l_shoulder","l_elbow","L"],["l_elbow","l_wrist","L"],["r_shoulder","r_elbow","R"],["r_elbow","r_wrist","R"],["l_hip","l_knee","L"],["l_knee","l_ankle","L"],["r_hip","r_knee","R"],["r_knee","r_ankle","R"],["l_ankle","l_toe","L"],["r_ankle","r_toe","R"],["nose","l_shoulder","H"],["nose","r_shoulder","H"]];function OC(i,e){const t=i.getBoundingClientRect(),n=Math.min(2,devicePixelRatio||1),s=Math.max(1,Math.round(t.width*n)),r=Math.max(1,Math.round(t.height*n));(i.width!==s||i.height!==r)&&(i.width=s,i.height=r);const a=i.getContext("2d"),o=Math.min(s,r*1.6)/1e3,c=(H,J)=>Math.round(Math.max(J*n,H*o));a.fillStyle="#e8e8e0",a.fillRect(0,0,s,r);const l=a.createRadialGradient(s/2,r/2,20,s/2,r/2,Math.max(s,r)*.7);l.addColorStop(0,"rgba(255,255,255,0.4)"),l.addColorStop(1,"rgba(120,118,105,0.14)"),a.fillStyle=l,a.fillRect(0,0,s,r),a.fillStyle="rgba(10,10,10,0.045)";for(let H=80*o;H<s;H+=80*o)a.fillRect(H,0,1,r);a.fillStyle="#0a0a0a",a.textBaseline="alphabetic",a.font=`italic ${c(58,22)}px "Instrument Serif", Georgia, serif`,a.fillText(e.title??"cada golpe, cuadro a cuadro",16*n+24*o,c(58,22)+10*n),a.font=`${c(15,9.5)}px "Share Tech Mono", monospace`,a.letterSpacing=`${2*n}px`,a.fillStyle="#6d6d66",a.fillText(`${e.label} · ${e.sub}`.toUpperCase(),17*n+24*o,c(58,22)+c(15,9.5)+20*n),a.letterSpacing="0px";const h=e.frames;if(!h?.length)return;const d=[];for(let H=Math.max(0,e.from);H<=Math.min(h.length-1,e.to);H++)h[H]&&d.push(H);if(!d.length)return;const u=H=>(e.mirror?1-H[0]:H[0])*e.aspect,f=H=>H[1];let p=1e9,m=1e9,_=-1e9,g=-1e9;for(const H of d)for(const J of Object.keys(Be)){const se=h[H].pts[Be[J]];se[3]<.3||(p=Math.min(p,u(se)),_=Math.max(_,u(se)),m=Math.min(m,f(se)),g=Math.max(g,f(se)))}const x=c(58,22)+c(15,9.5)+34*n,T=r-c(15,9.5)*3.2-14*n,b=40*o,S=s-40*o,M=Math.min((S-b)/Math.max(.001,_-p),(T-x)/Math.max(.001,g-m)),A=(b+S)/2-(p+_)/2*M,v=x+(T-x)/2-(m+g)/2*M,E=(H,J)=>{const se=H.pts[Be[J]];return se[3]<.3?null:[A+u(se)*M,v+f(se)*M]},P=(H,J)=>{for(const[se,Qe,it]of FC){const Xe=E(H,se),Z=E(H,Qe);!Xe||!Z||(a.strokeStyle=J.color??ag[it],a.lineWidth=J.w,a.globalAlpha=J.a,a.beginPath(),a.moveTo(Xe[0],Xe[1]),a.lineTo(Z[0],Z[1]),a.stroke())}a.globalAlpha=1};a.lineCap="round";const D=Math.max(1,Math.round(d.length/12));d.filter((H,J)=>J%D===0).forEach((H,J,se)=>P(h[H],{color:"#0a0a0a",w:1.3*n,a:.1+.45*(J/Math.max(1,se.length-1))}));const L=d.map(H=>[H,E(h[H],e.joint)]).filter(([,H])=>H);a.save(),a.setLineDash([7*n,7*n]),a.strokeStyle="rgba(10,10,10,0.75)",a.lineWidth=1.6*n,a.beginPath(),L.forEach(([,H],J)=>J?a.lineTo(H[0],H[1]):a.moveTo(H[0],H[1])),a.stroke(),a.setLineDash([]),L.forEach(([,H],J)=>{if(J===0||J%2)return;const se=L[J-1][1],Qe=Math.atan2(H[1]-se[1],H[0]-se[0])+Math.PI/2;a.strokeStyle="#0a0a0a",a.lineWidth=1.6*n,a.beginPath(),a.moveTo(H[0]-Math.cos(Qe)*7*n,H[1]-Math.sin(Qe)*7*n),a.lineTo(H[0]+Math.cos(Qe)*7*n,H[1]+Math.sin(Qe)*7*n),a.stroke()}),a.restore();const k=h[Math.min(h.length-1,Math.max(0,e.mark))];if(k){P(k,{w:3.6*n,a:1});for(const H of Object.keys(Be)){const J=E(k,H);if(!J)continue;const se=H==="nose"||H.endsWith("eye")||H.endsWith("ear")?"H":H.startsWith("l_")?"L":H.startsWith("r_")?"R":"C";a.fillStyle=se==="H"?"#fff":ag[se],a.strokeStyle="#0a0a0a",a.lineWidth=1.2*n,a.beginPath(),a.arc(J[0],J[1],(se==="H"?2.6:3.6)*n,0,Math.PI*2),a.fill(),a.stroke()}}const U=T+12*n;a.fillStyle="#0a0a0a",a.fillRect(b-20*o,U,S-b+40*o,2.5*n);const O=[[e.mark,e.label],[d[0],"INICIO"]];a.textAlign="center";const X=[];for(const[H,J]of O){const se=h[H]&&E(h[H],e.joint);se&&(X.some(Qe=>Math.abs(Qe-se[0])<110*n)||(X.push(se[0]),a.save(),a.globalAlpha=.5,a.setLineDash([3*n,6*n]),a.strokeStyle="#0a0a0a",a.lineWidth=1*n,a.beginPath(),a.moveTo(se[0],se[1]+10*n),a.lineTo(se[0],U-6*n),a.stroke(),a.restore(),a.fillStyle="#0a0a0a",a.fillRect(se[0]-1,U+5*n,2*n,8*n),a.font=`${c(15,10)}px "Share Tech Mono", monospace`,a.letterSpacing=`${1.5*n}px`,a.fillText(J.toUpperCase(),se[0],U+13*n+c(15,10)),a.letterSpacing="0px",a.fillStyle="#6d6d66",a.font=`${c(12,9)}px "Share Tech Mono", monospace`,a.fillText(`f.${String(H).padStart(3,"0")}`,se[0],U+16*n+c(15,10)+c(12,9))))}a.textAlign="left";const z=s-300*o,re=r-26*o,q=240*o;a.fillStyle="#0a0a0a",a.fillRect(z,re,q,1.5*n);for(let H=0;H<=10;H++)a.fillRect(z+H*q/10,re-(H%5?7:12)*o,1.5*n,(H%5?7:12)*o);const te=(e.mark-d[0])/Math.max(1,d.at(-1)-d[0]);a.fillStyle="#b44528",a.fillRect(z+te*q-1.5,re-20*o,3*n,26*o)}const Mn=(i,e=document)=>e.querySelector(i),Gr=(i,e=document)=>[...e.querySelectorAll(i)],_r=i=>{const e=document.createElement("template");return e.innerHTML=i.trim(),e.content.firstElementChild},qd=i=>String(i??"").replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),og=i=>{const e=Math.max(0,i)/1e3;return`${String(Math.floor(e/60)).padStart(2,"0")}:${(e%60).toFixed(1).padStart(4,"0")}`},lg={jab:"JAB",cross:"CRUZADO",gancho:"GANCHO",uppercut:"UPPER",directo:"DIRECTO"};function Nx(i,e={}){const t=new Sx(i,{ink:pt.ink}),n=_r(`<div class="pov">${yx.map(s=>`<button data-p="${s}" class="${s==="frente"?"on":""}">${s}</button>`).join("")}<span class="pov-sp"></span>${e.heat===!1?"":`<button data-m="calor">${At("calor",14)}calor</button>`}</div>`);return i.append(n),n.addEventListener("click",s=>{const r=s.target.closest("button");if(r&&(r.dataset.p&&(t.setPOV(r.dataset.p),Gr("[data-p]",n).forEach(a=>a.classList.toggle("on",a===r))),r.dataset.m)){const a=t.mode!=="calor";t.setMode(a?"calor":"figura"),r.classList.toggle("on",a)}}),document.addEventListener("ml-theme",()=>t.setInk(pt.ink)),t}const Ji={conteo:{x:.006,y:.02,w:.19,h:.2},progreso:{x:.006,y:.23,w:.19,h:.15},senal:{x:.006,y:.395,w:.19,h:.19},piernas:{x:.006,y:.6,w:.19,h:.19},cuadro:{x:.2,y:.02,w:.235,h:.3},tresd:{x:.6,y:.02,w:.195,h:.36},equilibrio:{x:.3,y:.655,w:.4,h:.15},sesion:{x:.8,y:.02,w:.194,h:.44},acciones:{x:.8,y:.475,w:.194,h:.385},cuerpo:{x:.6,y:.4,w:.195,h:.26},bitacora:{x:.2,y:.34,w:.2,h:.28}};function BC(){const i=Mn("#view-player"),e=window.__mlR,t=window.__mlBus;Mn(".stage-wrap",i).classList.add("ws-anchor");const s=Mn(".hud.wide",i),r=new uh(i,{id:"player"});r.add({id:"sesion",title:"Sesión · reporte y exportar",icon:"bitacora",content:[...s.children],def:Ji.sesion,minW:300,minH:240}),s.hidden=!0;const a=_r('<div class="world"></div>');r.add({id:"tresd",title:"3D · la grabación",icon:"tresd",content:a,def:Ji.tresd,minW:220,minH:160});const o=Nx(a),c=e.pl.draw.bind(e.pl);e.pl.draw=M=>{c(M),M?.frame&&o.draw(M.frame)};const l=_r(`<div class="w-onion"><div class="on-bar"><div class="on-ev"></div><button class="on-go" title="Ir a ese momento en el reproductor">${At("play",13)} ir</button></div><canvas></canvas></div>`);r.add({id:"cuadro",title:"Cuadro a cuadro",icon:"fantasmas",content:l,def:Ji.cuadro,minW:320,minH:200});const h=Mn("canvas",l),d={evs:[],sel:0},u=()=>{const M=window.__mlPL;if(!M?.an||!r.isOpen("cuadro"))return;const A=M.an.states,v=A.map(X=>X.frame),E=d.evs[d.sel],P=A[0]?.tRaw??0,L=E?(X=>{let z=0,re=A.length-1;for(;z<re;){const q=z+re+1>>1;A[q].tRaw-P<=X?z=q:re=q-1}return z})(E.t):Math.floor(A.length/2),k=Math.round(.45*(A.length/Math.max(.5,(M.dur||1)/1e3))),U=E?.data?.side==="R"?"r_wrist":E?.data?.side==="L"?"l_wrist":E?.type==="jump"?"l_ankle":"r_wrist",O=E?E.type==="punch"?`${lg[E.data.kind]??E.data.kind} ${E.data.side==="L"?"IZQ":"DER"}`:E.text:"sesión";OC(h,{frames:v,from:L-k,to:L+Math.round(k*.35),mark:L,joint:U,label:O,sub:`${og(E?.t??0)} · ${M.session.meta.exerciseName}`,mirror:M.session.mirror??!1,aspect:M.session.aspect??16/9})},f=()=>{const M=window.__mlPL;M?.an&&(d.evs=M.an.events.filter(A=>["punch","rep","jump","hold"].includes(A.type)).slice(0,60),d.sel=0,Mn(".on-ev",l).innerHTML=d.evs.length?d.evs.map((A,v)=>`<button data-i="${v}" class="${A.type} ${v===0?"on":""}">${qd(A.type==="punch"?`${lg[A.data.kind]??A.data.kind} ${A.data.side==="L"?"izq":"der"}`:A.text)}<small>${og(A.t)}</small></button>`).join(""):'<span class="muted">Sin golpes ni reps: se muestra el medio de la sesión.</span>',requestAnimationFrame(u))};l.addEventListener("click",M=>{const A=M.target.closest(".on-ev button");if(A&&(d.sel=Number(A.dataset.i),Gr(".on-ev button",l).forEach(v=>v.classList.toggle("on",v===A)),u()),M.target.closest(".on-go")){const v=d.evs[d.sel],E=window.__mlPL;v&&E?.an&&window.__mlAct.plSeek(v.t+(E.an.states[0]?.tRaw??0))}}),new ResizeObserver(()=>u()).observe(h),t.addEventListener("player",f),t.addEventListener("view",M=>{M.detail==="player"&&(r.relayout(),r.intro(),requestAnimationFrame(u))});const p={cnt:dC(),prog:Rx(),arm:pC(),legs:Px(),bal:Ax(),act:Cx(),body:fC(),log:mC()};r.add({id:"conteo",title:"Conteo",icon:"check",content:p.cnt.el,def:Ji.conteo,minW:200,minH:130}),r.add({id:"progreso",title:"Progreso del movimiento",icon:"senal",content:p.prog.el,def:Ji.progreso,minW:240,minH:96,cls:"w-hero"}),r.add({id:"senal",title:"Señal · extensión del brazo",icon:"senal",content:p.arm.el,def:Ji.senal,minW:230,minH:110}),r.add({id:"piernas",title:"Piernas · rodillas",icon:"estelas",content:p.legs.el,def:Ji.piernas,minW:230,minH:110}),r.add({id:"equilibrio",title:"Equilibrio · peso izq ↔ der",icon:"equilibrio",content:p.bal.el,def:Ji.equilibrio,minW:320,minH:110,cls:"w-hero"}),r.add({id:"acciones",title:"Acciones · golpes y footwork",icon:"golpes",content:p.act.el,def:Ji.acciones,minW:220,minH:180}),r.add({id:"cuerpo",title:"Cuerpo",icon:"angulos",content:p.body.el,def:Ji.cuerpo,minW:210,minH:140,hidden:!0}),r.add({id:"bitacora",title:"Bitácora",icon:"bitacora",content:p.log.el,def:Ji.bitacora,minW:210,minH:90,hidden:!0});const m={session:null,raw:[],pl:null,i:0,lastT:0,hist:[]},_=M=>{const A=M==="L"?"l":"r";let v=0;for(let E=1;E<m.hist.length;E++){const P=m.hist[E-1],D=m.hist[E],L=(D.t-P.t)/1e3;!P[A]||!D[A]||L<=0||(v=Math.max(v,Math.hypot(D[A][0]-P[A][0],D[A][1]-P[A][1],D[A][2]-P[A][2])/L))}return v},g=()=>{const M=window.__mlPL;m.pl=new df({exercise:M.ex??ul,calib:M.session.calib??null,lead:M.session.profile?.lead??"L"}),m.i=0,m.hist=[];for(const A of Object.values(p))A.reset()},x=900,T=()=>{const M=window.__mlPL;if(!M?.session||!M.an||i.hidden)return;(m.session!==M.session||m.ex!==M.ex)&&(m.session=M.session,m.ex=M.ex,m.raw=gf(M.session),m.lastT=0,g()),M.t<m.lastT-1&&g(),m.lastT=M.t;const A=M.t-9500;let v=0,E=null;for(;m.i<m.raw.length&&m.raw[m.i].t<=M.t&&v<x;){const P=m.raw[m.i++];v++,E=m.pl.step(P),E.frame?.world&&(m.hist.push({t:E.t,l:E.frame.world[Be.l_wrist],r:E.frame.world[Be.r_wrist]}),m.hist.length>8&&m.hist.shift()),p.act.update(E,{wristSpeed:_}),P.t>=A&&(p.arm.update(E),p.legs.update(E))}E&&(E.lines=m.pl.narrator?.lines??[],p.cnt.update(E),p.prog.update(E),p.bal.update(E),p.body.update(E),p.log.update(E),i.style.setProperty("--live",Tx(E,p.act.lastHit)))},b=()=>{requestAnimationFrame(b),T()};requestAnimationFrame(b),document.addEventListener("ml-theme",()=>{p.cnt.reset(),m.lastT=1/0});const S=_r(`<button class="ghost pl-open" title="Ver esta sesión en el Estudio, con el transporte y todas las ventanas">${At("live",14)} Abrir en el Estudio</button>`);return Mn("#pl-ref")?.after(S),S.addEventListener("click",()=>{const M=window.__mlPL;M?.session&&window.__mlAct.startReplay(M.session.meta.id)}),r}function zC(){const i=Mn("#view-compare"),e=window.__mlR,t=window.__mlBus;Mn(".stage-wrap",i).classList.add("ws-anchor");const s=Mn(".hud.wide",i),r=Mn(".big",s),a=document.createElement("canvas");a.className="led led-big",r.prepend(a),r.classList.add("has-led");const o=new uh(i,{id:"compare"});o.add({id:"comparacion",title:"Comparación · referencia vs intento",icon:"compare",content:[...s.children],def:{x:.695,y:.02,w:.295,h:.84},minW:300,minH:240}),s.hidden=!0;const c=_r('<div class="world"></div>');o.add({id:"tresd",title:"3D · gris = referencia",icon:"tresd",content:c,def:{x:.47,y:.47,w:.215,h:.39},minW:220,minH:160});const l=Nx(c,{heat:!1}),h=e.cmp.draw.bind(e.cmp);e.cmp.draw=f=>{h(f),f?.frame&&l.draw(f.frame);const p=window.__mlCMP;if(p?.a){const m=p.a.an.states[Math.round(p.p*(p.a.an.states.length-1))];l.drawRef(m?.frame)}};let d="";const u=()=>{const f=Mn("#cmp-score").textContent.trim();f!==d&&(d=f,ta(a,f==="—"?"—":f,{ink:pt.ink}))};return t.addEventListener("compare",u),document.addEventListener("ml-theme",()=>{d="",u()}),t.addEventListener("view",f=>{f.detail==="compare"&&(o.relayout(),o.intro(),d="",setTimeout(u,50))}),o}function HC(){const i=Mn("#sessions-grid"),e=Mn("#view-sessions .page-head"),t=_r(`<div class="ses-tools">
      <label class="ses-q">${At("zoom",15)}<input type="search" placeholder="buscar sesión…" /></label>
      <div class="ses-f"></div>
      <span class="grow"></span>
      <div class="seg"><button data-v="grid" class="on">${At("windows",14)} grilla</button><button data-v="wall">${At("tresd",14)} pared 3D</button></div>
    </div>`);e.after(t);const n=_r('<div class="ses-wall" hidden><canvas></canvas><div class="wall-hint">arrastrá para mirar · click en una sesión para abrirla</div></div>');i.after(n);const s={q:"",ex:null,mode:"grid"},r=()=>{for(const c of Gr(".scard",i)){const l=Mn("h3",c)?.textContent??"",h=c.textContent.toLowerCase();c.hidden=s.ex&&!l.startsWith(s.ex)||s.q&&!h.includes(s.q)}},a=()=>{const c=new Set;for(const l of Gr(".scard",i))c.add((Mn("h3",l)?.childNodes[0]?.textContent??"").trim()),l.querySelector(".glare")||l.append(_r('<i class="glare"></i>')),ja(l,{max:8,scale:1.02});Mn(".ses-f",t).innerHTML=[...c].filter(Boolean).map(l=>`<button data-ex="${qd(l)}" class="${s.ex===l?"on":""}">${qd(l)}</button>`).join(""),r(),s.mode==="wall"&&o.build()};new MutationObserver(a).observe(i,{childList:!0}),Mn("input",t).addEventListener("input",c=>{s.q=c.target.value.toLowerCase().trim(),r()}),t.addEventListener("click",c=>{const l=c.target.closest(".ses-f button");l&&(s.ex=s.ex===l.dataset.ex?null:l.dataset.ex,Gr(".ses-f button",t).forEach(d=>d.classList.toggle("on",d.dataset.ex===s.ex)),r());const h=c.target.closest(".seg button");h&&(s.mode=h.dataset.v,Gr(".seg button",t).forEach(d=>d.classList.toggle("on",d===h)),i.hidden=s.mode==="wall",n.hidden=s.mode!=="wall",s.mode==="wall"&&o.build())});const o=new VC(n,()=>Gr(".scard",i).filter(c=>!c.hidden))}class VC{constructor(e,t){this.box=e,this.cards=t,this.tiles=[];const n=Mn("canvas",e);this.r=new vh({canvas:n,antialias:!0,alpha:!0}),this.r.setPixelRatio(Math.min(2,devicePixelRatio||1)),this.scene=new ph,this.scene.fog=new fh(329223,6,16),this.cam=new li(40,1,.1,50),this.group=new Xr,this.scene.add(this.group),this.mouse={x:0,y:0,sx:0,sy:0,drag:0},this.ray=new Kw,e.addEventListener("pointermove",r=>{const a=e.getBoundingClientRect();this.mouse.x=(r.clientX-a.left)/a.width-.5,this.mouse.y=(r.clientY-a.top)/a.height-.5}),e.addEventListener("click",r=>{const a=e.getBoundingClientRect();this.ray.setFromCamera(new Je((r.clientX-a.left)/a.width*2-1,-((r.clientY-a.top)/a.height)*2+1),this.cam),this.ray.intersectObjects(this.tiles)[0]?.object.userData.card?.click()}),new ResizeObserver(()=>this.resize()).observe(e),document.addEventListener("ml-theme",()=>this.scene.fog.color.set(pt.ink?15263968:329223));const s=()=>{requestAnimationFrame(s),!(e.hidden||e.offsetParent===null)&&this.render()};requestAnimationFrame(s)}resize(){const e=Math.max(1,this.box.clientWidth),t=Math.max(1,this.box.clientHeight);this.r.setSize(e,t,!1),this.cam.aspect=e/t,this.cam.updateProjectionMatrix()}build(){for(const o of this.tiles)this.group.remove(o),o.material.map?.dispose(),o.material.dispose();this.tiles=[];const e=this.cards(),t=Math.max(1,e.length),n=Math.max(2,Math.ceil(Math.sqrt(t*1.8))),s=1.6,r=.9,a=.18;this.dist=Math.max(3,n*1.45),e.forEach((o,c)=>{const l=document.createElement("canvas");l.width=480,l.height=300;const h=l.getContext("2d");h.fillStyle="#0d0f11",h.fillRect(0,0,480,300);const d=o.querySelector("img"),u=new rx(l);u.colorSpace=ai;const f=()=>{h.fillStyle="rgba(0,0,0,0.65)",h.fillRect(0,232,480,68),h.fillStyle="#e8e8e0",h.font='30px "Bebas Neue", sans-serif',h.fillText((Mn("h3",o)?.childNodes[0]?.textContent??"").trim().slice(0,30),14,262),h.fillStyle="#e06040",h.font='15px "Share Tech Mono", monospace',h.fillText((Mn(".kpis",o)?.textContent??"").slice(0,44),14,286),h.strokeStyle="rgba(224,96,64,0.5)",h.lineWidth=3,h.strokeRect(1.5,1.5,477,297),u.needsUpdate=!0};d?.complete&&d.naturalWidth?(h.drawImage(d,0,0,480,270),f()):d?d.onload=()=>{h.drawImage(d,0,0,480,270),f()}:f();const p=new hi(new xo(s,r*(300/270)),new mh({map:u,toneMapped:!1})),m=c%n,_=Math.floor(c/n),g=Math.ceil(t/n),x=(m-(n-1)/2)*(s+a),T=((g-1)/2-_)*(r+a+.1),b=x/8;p.position.set(Math.sin(b)*8,T,-Math.cos(b)*8+8),p.rotation.y=-b,p.userData.card=o,this.group.add(p),this.tiles.push(p)}),this.t0=performance.now()}render(){const e=(performance.now()-(this.t0??0))/1e3,t=Math.min(1,e/1.2),n=1-(1-t)**3;this.mouse.sx+=(this.mouse.x-this.mouse.sx)*.06,this.mouse.sy+=(this.mouse.y-this.mouse.sy)*.06,this.cam.position.set(this.mouse.sx*2.2,-this.mouse.sy*1.2+.2,1.2+n*((this.dist??5.8)-1.2)),this.cam.lookAt(this.mouse.sx*.6,0,0),this.r.render(this.scene,this.cam)}}function GC(){if(hn())return;const i=document.createElement("div");i.className="splash v3",i.innerHTML=`<canvas class="sp-fx"></canvas><div class="sp-in"><img class="sp-fig" src="brand/figura.png" alt="" />
    <img class="sp-wm3" src="brand/moyon-negro.png" alt="Moyon Lab" /><div class="sp-bar"><i></i></div>
    <pre class="sp-term"></pre></div>`,document.body.append(i),WC(i.querySelector(".sp-fx"));const e=i.querySelector(".sp-term"),t=["PS D:\\motion-lab> .\\start.ps1",()=>"▸ análisis   11 módulos · 33 puntos · 3D en metros",()=>`▸ disco      ${document.querySelector("#st-disk")?.textContent||"—"}`,()=>`▸ listo  →   ${location.host||"localhost:8000"}`];let n=0,s=0,r="";const a=()=>{if(n>=t.length)return;const o=typeof t[n]=="function"?t[n]():t[n];s+=3,e.textContent=r+o.slice(0,s)+"▍",s>=o.length&&(r+=`${o}
`,n++,s=0),setTimeout(a,n===0?14:10)};setTimeout(a,350),setTimeout(()=>{const o=i.animate([{clipPath:"circle(150% at 50% 45%)",opacity:1},{clipPath:"circle(0% at 50% 45%)",opacity:1}],{duration:620,easing:"cubic-bezier(0.7, 0, 0.84, 0)",fill:"forwards"});o.onfinish=()=>i.remove()},1700)}function WC(i){const e=new Image;e.onload=()=>{if(!i.isConnected)return;const t=Math.min(2,devicePixelRatio||1),n=innerWidth,s=innerHeight;i.width=n*t,i.height=s*t;const r=i.getContext("2d");r.scale(t,t);const a=document.createElement("canvas"),o=3;a.width=Math.round(e.width/o),a.height=Math.round(e.height/o);const c=a.getContext("2d");c.drawImage(e,0,0,a.width,a.height);const l=c.getImageData(0,0,a.width,a.height).data,h=ao(4),d=[],u=["#d05838","#2f7bff","#ff3b30","#ffd60a"],f=e.width/e.height;for(let _=0;_<a.height;_++)for(let g=0;g<a.width;g++){const x=(_*a.width+g)*4;l[x+3]<100||d.push({x:g/a.width-.5,y:_/a.height-.5,c:h()<.2?u[Math.floor(h()*4)]:`rgb(${l[x]},${l[x+1]},${l[x+2]})`,s:1+h()*2.4,ph:h()*6.283})}const p=performance.now(),m=_=>{if(!i.isConnected)return;const g=(_-p)/1e3,x=s*(2.7-.4*Math.min(1,g/1.9)),T=n*.6,b=s*.44;r.clearRect(0,0,n,s);for(const S of d){const M=T+S.x*x*f+Math.sin(g*.8+S.ph)*3,A=b+S.y*x+Math.cos(g*.7+S.ph)*3;M<-8||A<-8||M>n+8||A>s+8||(r.globalAlpha=.14+.12*Math.sin(g*2.2+S.ph),r.fillStyle=S.c,r.fillRect(M,A,S.s*2,S.s*2))}requestAnimationFrame(m)};requestAnimationFrame(m)},e.src="brand/figura.png"}function $C(i="ENTRENÁ"){if(hn())return;const e=document.createElement("canvas");e.className="pword",document.body.append(e);const t=Math.min(2,devicePixelRatio||1),n=innerWidth,s=innerHeight;e.width=n*t,e.height=s*t;const r=e.getContext("2d");r.scale(t,t);const a=document.createElement("canvas");a.width=n,a.height=s;const o=a.getContext("2d"),c=Math.min(n/(i.length*.52),s*.34);o.font=`${c}px "Bebas Neue", "Arial Narrow", sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(i,n/2,s/2);const l=o.getImageData(0,0,n,s).data,h=[];for(let x=0;x<s;x+=5)for(let T=0;T<n;T+=5)l[(x*n+T)*4+3]>120&&h.push([T,x]);const d=ao(9),u=Math.min(1500,h.length),f=Array.from({length:u},(x,T)=>{const b=h[Math.floor(d()*h.length)],S=d()*6.283,M=40+d()*260,[A,v]=z_(b[0]*.004,b[1]*.004,.3);return{sx:n/2+Math.cos(S)*M,sy:s/2+Math.sin(S)*M*.6,tx:b[0],ty:b[1],d:d()*.25,c:T%5,cx:A,cy:v}}),p=pt.ink?["#0a0a0a","#0a0a0a","#b44528","#2f7bff","#ff3b30"]:["#e06040","#e06040","#2f7bff","#ff3b30","#ffd60a"],m=performance.now(),_=1300,g=x=>{const T=(x-m)/_;if(T>1){e.remove();return}r.clearRect(0,0,n,s),r.globalCompositeOperation=pt.ink?"source-over":"lighter";const b=T>.78?1-(T-.78)/.22:1;for(const S of f){const M=Math.min(1,Math.max(0,(T*1.35-S.d)/.7)),A=M<.5?4*M**3:1-(-2*M+2)**3/2,v=S.cx,E=S.cy,P=Math.sin(M*Math.PI)*120;r.globalAlpha=b*(.35+.65*A),r.fillStyle=p[S.c],r.fillRect(S.sx+(S.tx-S.sx)*A+v*P,S.sy+(S.ty-S.sy)*A+E*P,2.4,2.4)}requestAnimationFrame(g)};requestAnimationFrame(g),e.animate([{opacity:0},{opacity:1}],{duration:200,easing:Ts})}const Bn=(i,e=document)=>e.querySelector(i),Yd=(i,e=document)=>[...e.querySelectorAll(i)];function XC(){const i=window.__mlR,e=window.__mlBus,t=Bn("#view-onboarding .ob");t.classList.add("v2");const n={mediapipe:"esqueleto",rtmlib:"tresd",sim:"fantasmas"};Yd(".card.pick",t).forEach(d=>{const u=Bn("input",d).value;d.insertAdjacentHTML("afterbegin",`<span class="eng-ico">${At(n[u]??"free",30)}</span>`),d.insertAdjacentHTML("beforeend",'<i class="glare"></i>'),ja(d,{max:7,scale:1.02})}),Yd(".ob-steps li",t).forEach(d=>{d.innerHTML=`<b>0${d.dataset.step}</b><span>${d.textContent}</span>`});const s=Bn("#ob-preview"),r=document.createElement("div");r.className="ob-viewfinder",s.replaceWith(r),r.append(s),r.insertAdjacentHTML("beforeend",'<i></i><i></i><i></i><i></i><span class="vf-rec">● EN VIVO</span>'),i.ob.set({bbox:!0,chrome:!0,angleArcs:!0});const a=Bn(".ob-side",t),o=document.createElement("div");o.className="ob-pts",o.innerHTML='<canvas class="led"></canvas><div><b>PUNTOS VISIBLES</b><small>de 21 del esquema · 33 de MediaPipe</small></div>',Bn("h1",a).after(o);const c=Bn("canvas",o);let l=-1;e.addEventListener("step",d=>{if(window.__ml.view!=="onboarding")return;const u=d.detail.frame;if(!u)return;const f=u.pts.filter(p=>p[3]>=.5).length;f!==l&&(l=f,ta(c,String(f).padStart(2,"0"),{ink:pt.ink}))}),new MutationObserver(d=>{for(const u of d){const f=u.target;f.classList.contains("ok")&&!u.oldValue?.includes("ok")&&!hn()&&f.animate([{transform:"scale(1.04)",boxShadow:"0 0 0 2px rgba(34,211,107,0.6)"},{transform:"none",boxShadow:"0 0 0 0 rgba(34,211,107,0)"}],{duration:520,easing:Ts})}}).observe(Bn("#ob-checks"),{attributes:!0,subtree:!0,attributeFilter:["class"],attributeOldValue:!0}),Bn("#ob-finish").addEventListener("click",()=>setTimeout(()=>$C("ENTRENÁ"),60)),qC(t);const h=document.createElement("div");h.className="vs-prev",e.addEventListener("player",async d=>{const u=d.detail,f=u.session.meta,m=(await Zr()).find(A=>A.exercise===f.exercise&&A.id!==f.id&&A.createdAt<f.createdAt),_=(A={})=>A.punches!=null?["golpes",A.punches]:A.reps!=null?["reps",A.reps]:A.jumps!=null?["saltos",A.jumps]:A.holdMs!=null?["s",+(A.holdMs/1e3).toFixed(1)]:[null,null],[g,x]=_(f.kpis),[,T]=_(m?.kpis),b=Bn("#pl-big")?.closest(".big");if(b&&!h.isConnected&&b.after(h),x==null||T==null){h.innerHTML=`<small>${m?"sin métrica comparable con la anterior":"primera sesión de este ejercicio"}</small>`;return}const S=T?Math.round((x-T)/T*100):0,M=Math.max(.04,Math.min(1,x/Math.max(x,T,1e-6)));h.innerHTML=`<div class="vp-top"><small>vs tu sesión anterior (${T} ${g})</small><b class="${S>0?"up":S<0?"down":""}">${S>0?"+":""}${S}%</b></div><div class="vp-bar"><i style="width:${M*100}%"></i><u style="left:${Math.min(100,T/Math.max(x,T,1e-6)*100)}%"></u></div>`,hn()||Bn("i",h).animate([{width:"0%"},{width:`${M*100}%`}],{duration:900,easing:Ts})})}function qC(i){i.classList.add("v3"),i.insertAdjacentHTML("afterbegin",'<div class="ob-win-h"><img src="brand/figura.png" alt="" /><span>Empezá · Moyon Lab</span><em class="ob-win-sub">tres pasos y a entrenar</em></div>'),Bn('.ob-panel[data-step="1"]',i).insertAdjacentHTML("afterbegin",'<div class="ob-auto"><span class="ob-spin"></span><div><b>Preparando el tracking</b><small>MediaPipe se carga solo, en tu máquina. El motor se cambia en Configurar.</small></div></div>');const t=()=>{const p=i.classList.contains("auto");Yd(".ob-steps li",i).forEach(m=>{const _=Number(m.dataset.step)-(p?1:0),g=Bn("b",m);g&&(g.textContent=`0${Math.max(1,_)}`)})};new MutationObserver(t).observe(i,{attributes:!0,attributeFilter:["class"]}),t();const n=Bn("#pf-weight")?.closest("label");n&&!Bn("#pf-load")&&n.insertAdjacentHTML("afterend",'<label>Carga habitual (kg)<input id="pf-load" type="number" min="0" max="200" step="0.5" placeholder="p. ej. 8" /></label>');const s=window.__ml;Bn("#pf-load")&&s?.profile?.loadKg&&(Bn("#pf-load").value=s.profile.loadKg),Bn("#ob-finish").textContent="Entrar a Moyon Lab";const r=Bn("#view-onboarding"),a=["home","studio"];let o=0,c=0,l=null;const h=p=>{const m=r.getBoundingClientRect();Object.assign(p.style,{position:"fixed",left:`${m.left}px`,top:`${m.top}px`,width:`${m.width}px`,height:`${m.height}px`})},d=p=>{p.classList.remove("ob-back");for(const m of["position","left","top","width","height","zIndex"])p.style[m]=""},u=()=>{if(window.__ml?.view!=="onboarding"||hn())return;const p=document.getElementById(`view-${a[o++%a.length]}`);if(!p)return;const m=l;l=p,m&&(m.style.zIndex="0"),h(p),p.style.zIndex="1",p.classList.add("ob-back"),p.hidden=!1,m&&m!==p&&setTimeout(()=>{l!==m&&window.__ml?.view==="onboarding"&&(m.hidden=!0,d(m))},900)},f=()=>{clearInterval(c),c=0;for(const p of a){const m=document.getElementById(`view-${p}`);m&&d(m)}l=null};window.__mlBus?.addEventListener("view",p=>{p.detail==="onboarding"?(f(),document.body.classList.add("ob-over"),u(),c=setInterval(u,5200)):(f(),document.body.classList.remove("ob-over"))}),new ResizeObserver(()=>{l&&h(l)}).observe(r),window.__ml?.view==="onboarding"&&(document.body.classList.add("ob-over"),u(),c=setInterval(u,5200))}const cg=(i,e=document)=>e.querySelector(i),YC="demo/sombra-boxeo.mp4",Pu=i=>!i.srcObject&&(i.currentSrc||i.getAttribute("src")||"").includes("sombra-boxeo");function jC(){const i=window.__mlAct,e=(o,c)=>{const l=document.getElementById(o),h=l?.closest("label");if(!h)return;h.title="Carga el video de ejemplo (sombra de boxeo, en bucle)",h.addEventListener("click",u=>{u.target!==l&&(u.preventDefault(),c())});const d=document.createElement("button");d.type="button",d.className="ghost demo-own",d.textContent="o subí el tuyo",d.addEventListener("click",()=>l.click()),h.after(d)};e("ob-file",()=>i.obUseDemo("Video de ejemplo: sombra de boxeo, 4 s en bucle. Tocá Siguiente para verlo con todos los HUDs.")),e("new-file",()=>i.analyzeDemo());const t=cg('.ob-panel[data-step="2"]'),n=cg("#ob-preview");if(!t||!n)return;const s=()=>n.closest(".ob-viewfinder"),r=()=>{t.hidden||n.srcObject||n.getAttribute("src")&&!Pu(n)||(Pu(n)||(n.src=YC,n.loop=!0,n.muted=!0),n.play().catch(()=>{}))};new MutationObserver(r).observe(t,{attributes:!0,attributeFilter:["hidden"]});const a=()=>{s()?.classList.toggle("is-demo",Pu(n)),s()?.classList.toggle("is-cam",!!n.srcObject)};for(const o of["playing","loadeddata","emptied"])n.addEventListener(o,a);r()}const bo={};pt.apply();GC();dS();yS({onWindowsMenu:i=>{const e=bo[window.__ml?.view];e?bC(i,e):window.__mlBus?.dispatchEvent(new CustomEvent("toast",{detail:"Esta vista todavía no tiene ventanas"}))}});bo.studio=xC();bo.home=NC();bo.player=BC();bo.compare=zC();HC();XC();jC();const KC=window.__mlR,Ix=()=>{for(const i of["pl","cmp","ob"])KC?.[i]?.set({ink:pt.ink,angleArcs:!0})};document.addEventListener("ml-theme",Ix);Ix();window.__mlBus?.addEventListener("toast",i=>window.__mlAct?.toast?.(i.detail));window.__mlUI={workspaces:bo,theme:pt};
