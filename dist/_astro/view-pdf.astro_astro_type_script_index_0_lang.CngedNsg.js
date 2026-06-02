import{g as h}from"./index.DkoCMfrF.js";import"./gsap-core.CWHeOKWG.js";const rt=window["pdfjs-dist/build/pdf"];rt.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";let B=null,k=.707,p=0,l=0,i=0,y=!1,m=1;const yt=2,Pt=.8;let Y=0,X=0;const F=document.getElementById("loader"),L=document.getElementById("loader-status"),M=document.getElementById("loader-progress"),vt=document.getElementById("document-title"),d=document.getElementById("book"),u=document.getElementById("page-curl-canvas"),Et=document.getElementById("error-container"),xt=document.getElementById("error-message"),N=document.getElementById("btn-first"),G=document.getElementById("btn-prev"),V=document.getElementById("btn-next"),Z=document.getElementById("btn-last"),Ct=document.getElementById("btn-zoom-in"),wt=document.getElementById("btn-zoom-out"),it=document.getElementById("btn-zoom-reset"),St=document.getElementById("btn-fullscreen"),P=document.getElementById("scrubber"),Tt=document.getElementById("scrub-max"),R=document.getElementById("page-indicator"),at=document.getElementById("hotspot-prev"),st=document.getElementById("hotspot-next");let a=null,_=null,v=null,E=null,x=null,b=null;function lt(){if(!a||!u||!d)return;const t=window.devicePixelRatio||1,e=Math.max(1,Math.round(d.clientWidth*t)),n=Math.max(1,Math.round(d.clientHeight*t));u.width!==e&&(u.width=e),u.height!==n&&(u.height=n),a.viewport(0,0,e,n)}function q(t,e){if(!a)return null;const n=a.createShader(t);return n?(a.shaderSource(n,e),a.compileShader(n),a.getShaderParameter(n,a.COMPILE_STATUS)?n:(console.error("Curl shader compile failed:",a.getShaderInfoLog(n)),a.deleteShader(n),null)):null}function At(){if(!u||a)return;const t=u.getContext("webgl",{alpha:!0,antialias:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!1});if(!t)return;a=t;const e=`
          attribute vec2 aPos;
          varying vec2 vUV;
          void main(){
            gl_Position = vec4(aPos, 0.0, 1.0);
            vUV = aPos * 0.5 + 0.5;
          }
        `,n=`
          precision mediump float;
          uniform sampler2D uTex0;
          uniform sampler2D uTex1;
          uniform float uProgress;
          uniform float uDir;
          varying vec2 vUV;
          const float pcPI    = 3.141592653589793;
          const float pcCylR  = 1.0 / pcPI / 2.0;
          const float pcScale = 512.0;
          const float pcSharp = 3.0;
          vec3 pcHitPt(float ha, float yc, vec3 pt, mat3 rr) {
            pt.y = ha / (2.0 * pcPI);
            return rr * pt;
          }
          vec4 pcAA(vec4 c1, vec4 c2, float d) {
            d *= pcScale;
            if (d < 0.0) return c2;
            if (d > 2.0) return c1;
            float dd = pow(1.0 - d / 2.0, pcSharp);
            return (c2 - c1) * dd + c1;
          }
          float pcEdgeDist(vec3 pt) {
            float dx = abs(pt.x > 0.5 ? 1.0 - pt.x : pt.x);
            float dy = abs(pt.y > 0.5 ? 1.0 - pt.y : pt.y);
            if (pt.x < 0.0) dx = -pt.x;
            if (pt.x > 1.0) dx = pt.x - 1.0;
            if (pt.y < 0.0) dy = -pt.y;
            if (pt.y > 1.0) dy = pt.y - 1.0;
            if ((pt.x < 0.0 || pt.x > 1.0) && (pt.y < 0.0 || pt.y > 1.0)) return sqrt(dx*dx + dy*dy);
            return min(dx, dy);
          }
          void main() {
            float t = clamp(uProgress, 0.0, 1.0);
            float dir = uDir;
            vec2 pcP = vUV; vec2 pcQ = vUV;
            float pcAmt = t * 1.66 - 0.16;
            float pcCylAng = 2.0 * pcPI * pcAmt;
            float pcDeg = 100.0 * pcPI / 180.0;
            float pcCosA = cos(pcDeg);
            float pcSinA = sin(pcDeg);
            mat3 pcRot  = mat3(pcCosA,-pcSinA,0.0, pcSinA,pcCosA,0.0, -0.801,0.890,1.0);
            mat3 pcRRot = mat3(pcCosA, pcSinA,0.0,-pcSinA,pcCosA,0.0,  0.985,0.985,1.0);
            vec2  pcGeomP = dir > 0.0 ? pcP : vec2(1.0-pcP.x, pcP.y);
            vec3  pcPt = pcRot * vec3(pcGeomP, 1.0);
            float pcYC = pcPt.y - pcAmt;
            float pcSC = 0.0;
            float tr = 0.0;
            vec2 uv = pcP;

            if (pcYC < -pcCylR) {
              float pcSh = 0.0;
              float pcYN = -pcCylR - pcCylR - pcYC;
              float pcHA2 = (acos(clamp(pcYN/pcCylR,-1.0,1.0)) + pcCylAng) - pcPI;
              vec3 pcBP = pcHitPt(pcHA2, pcYN, pcPt, pcRRot);
              if (pcYN < 0.0 && pcBP.x >= 0.0 && pcBP.y >= 0.0 && pcBP.x <= 1.0 && pcBP.y <= 1.0 && (pcHA2 < pcPI || pcAmt > 0.5))
                pcSh = (1.0 - sqrt(pow(pcBP.x-0.5,2.0)+pow(pcBP.y-0.5,2.0))/0.71) * pow(-pcYN/pcCylR,3.0) * 0.5;
              gl_FragColor = vec4(texture2D(uTex1,pcQ).rgb - pcSh, 1.0);
              return;
            } else if (pcYC > pcCylR) {
              tr = 0.0;
              uv = pcP;
            } else {
              float pcHA = (acos(clamp(pcYC/pcCylR,-1.0,1.0)) + pcCylAng) - pcPI;
              float pcHM = mod(pcHA, 2.0*pcPI);
              if ((pcHM > pcPI && pcAmt < 0.5) || (pcHM > pcPI/2.0 && pcAmt < 0.0)) {
                float pcStHA = pcPI - (acos(clamp(pcYC/pcCylR,-1.0,1.0)) - pcCylAng);
                vec3 pcStPt = pcHitPt(pcStHA, pcYC, pcPt, pcRRot);
                if (pcYC <= 0.0 && (pcStPt.x < 0.0 || pcStPt.y < 0.0 || pcStPt.x > 1.0 || pcStPt.y > 1.0)) {
                  gl_FragColor = texture2D(uTex1,pcQ);
                  return;
                } else if (pcYC > 0.0) {
                  tr = 0.0;
                  uv = pcP;
                } else {
                  vec2 pcStUV = dir > 0.0 ? pcStPt.xy : vec2(1.0-pcStPt.x,pcStPt.y);
                  tr = 0.0;
                  uv = pcStUV;
                }
              } else {
                vec3 pcCP = pcHitPt(pcHA, pcYC, pcPt, pcRRot);
                if (pcCP.x < 0.0 || pcCP.y < 0.0 || pcCP.x > 1.0 || pcCP.y > 1.0) {
                  float pcStHA2 = pcPI - (acos(clamp(pcYC/pcCylR,-1.0,1.0)) - pcCylAng);
                  vec3 pcSP2 = pcHitPt(pcStHA2, pcYC, pcPt, pcRRot);
                  float pcSh2 = max(0.0, (1.0 - pcEdgeDist(pcCP)*30.0)/3.0) * pcAmt;
                  if (pcYC <= 0.0 && (pcSP2.x < 0.0 || pcSP2.y < 0.0 || pcSP2.x > 1.0 || pcSP2.y > 1.0)) {
                    vec4 pcThr = texture2D(uTex1,pcQ);
                    pcThr.rgb -= pcSh2;
                    gl_FragColor = pcThr;
                    return;
                  } else if (pcYC > 0.0) {
                    tr = 0.0;
                    uv = pcP;
                    pcSC = pcSh2;
                  } else {
                    vec2 pcSt2UV = dir>0.0 ? pcSP2.xy : vec2(1.0-pcSP2.x,pcSP2.y);
                    tr=0.0;
                    uv=clamp(pcSt2UV,0.0,1.0);
                    pcSC=pcSh2;
                  }
                } else {
                  float pcGray = 0.8*(pow(1.0-abs(pcYC/pcCylR),0.2)/2.0+0.5);
                  vec4 pcBk = vec4(vec3(pcGray),1.0);
                  vec4 pcOt;
                  if (pcYC < 0.0) {
                    float s2=(1.0-sqrt(pow(pcCP.x-0.5,2.0)+pow(pcCP.y-0.5,2.0))/0.71)*pow(-pcYC/pcCylR,3.0)*0.5;
                    pcOt=vec4(0.0,0.0,0.0,s2);
                  } else {
                    pcOt = texture2D(uTex1,pcQ);
                  }
                  vec4 pcBF = pcAA(pcBk, pcOt, pcCylR - abs(pcYC));
                  float pcDst = pcEdgeDist(pcCP);
                  float pcSh3 = max(0.0,(1.0-pcDst*30.0)/3.0)*pcAmt;
                  vec4 pcThru = texture2D(uTex1,pcQ);
                  pcThru.rgb -= pcSh3;
                  gl_FragColor = pcAA(pcBF, pcThru, pcDst);
                  return;
                }
              }
            }

            vec4 city = texture2D(uTex0, uv);
            city.rgb -= pcSC;
            gl_FragColor = mix(city, texture2D(uTex1,pcQ), tr);
          }
        `,o=q(t.VERTEX_SHADER,e),r=q(t.FRAGMENT_SHADER,n);if(!o||!r)return;const c=t.createProgram();if(!c)return;if(t.attachShader(c,o),t.attachShader(c,r),t.linkProgram(c),!t.getProgramParameter(c,t.LINK_STATUS)){console.error("Curl shader link failed:",t.getProgramInfoLog(c)),t.deleteProgram(c);return}t.useProgram(c),_=c;const g=t.createBuffer();if(!g)return;t.bindBuffer(t.ARRAY_BUFFER,g),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);const T=t.getAttribLocation(c,"aPos");if(t.enableVertexAttribArray(T),t.vertexAttribPointer(T,2,t.FLOAT,!1,0,0),t.uniform1i(t.getUniformLocation(c,"uTex0"),0),t.uniform1i(t.getUniformLocation(c,"uTex1"),1),x=t.getUniformLocation(c,"uProgress"),b=t.getUniformLocation(c,"uDir"),v=t.createTexture(),E=t.createTexture(),!v||!E)return;function A(I){t.bindTexture(t.TEXTURE_2D,I),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]))}A(v),A(E),lt(),x&&t.uniform1f(x,0),b&&t.uniform1f(b,1),t.drawArrays(t.TRIANGLE_STRIP,0,4)}function K(t,e,n){if(!a||!_)return;const o=a;o.activeTexture(o.TEXTURE0+e),o.bindTexture(o.TEXTURE_2D,t),o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,!0),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,n)}function J(t){!a||!_||(x&&a.uniform1f(x,t),a.drawArrays(a.TRIANGLE_STRIP,0,4))}function tt(t,e){const n=document.getElementById(`sheet-${t}`);return n?n.querySelector(`.page-${e} canvas`):null}function et(t){const e=t>0?tt(t,"back"):null,n=t<l?tt(t+1,"front"):null,o=e||n;if(!o)return null;const r=document.createElement("canvas");r.width=o.width*2,r.height=o.height;const c=r.getContext("2d");return c?(e?c.drawImage(e,0,0,o.width,o.height):(c.fillStyle="#1e160f",c.fillRect(0,0,o.width,o.height)),n?c.drawImage(n,o.width,0,o.width,o.height):(c.fillStyle="#1e160f",c.fillRect(o.width,0,o.width,o.height)),r):null}try{At()}catch{}const pt=new URLSearchParams(window.location.search);let D=pt.get("pdf");const It=pt.get("title")||"The Chronicle";D||(D="https://sainifreelance1207-maker.github.io/magazine/The%20Chronicle%20%231.pdf");vt.textContent=It;L.textContent="Connecting to source...";M.style.width="5%";async function bt(){try{const t=rt.getDocument({url:D,withCredentials:!1});t.onProgress=function(o){if(o.total>0){const r=Math.round(o.loaded/o.total*100);M.style.width=`${Math.max(5,r)}%`,L.textContent=`Downloading document: ${r}%`}else{const r=Math.round(o.loaded/1024);L.textContent=`Downloading document: ${r} KB loaded`}},B=await t.promise,p=B.numPages,l=Math.ceil((p+1)/2),L.textContent="Analyzing structure...",M.style.width="100%";const n=(await B.getPage(1)).getViewport({scale:1});k=n.width/n.height,d.style.setProperty("--page-aspect-ratio",k.toString()),await Rt(),F.classList.add("fade-out"),setTimeout(()=>{F.style.display="none"},500),C(),ut()}catch(t){console.error("PDF loading error: ",t),F.style.display="none",Et.style.display="flex",xt.textContent=`Could not fetch or parse the PDF document from: ${D}. (${t.message||t})`}}async function Rt(){for(let t=1;t<=l;t++){const e=document.createElement("div");e.className="sheet",e.id=`sheet-${t}`,e.style.zIndex=(l-t+1).toString();const n=document.createElement("div");n.className="page-front";const o=document.createElement("div");o.className="page-back",e.appendChild(n),e.appendChild(o),d.appendChild(e),h.set(e,{rotateY:0,rotateX:0,rotateZ:0,z:0,scale:1,transformPerspective:1600,force3D:!0});const r=2*t-1;nt(r,n);const c=2*t;nt(c,o),e.dataset.sheetIndex=String(t)}d.addEventListener("click",t=>{if(y||t.target.closest("button, a, input, select"))return;const e=t.target.closest(".sheet");if(!e)return;const n=parseInt(e.dataset.sheetIndex||"0",10);n&&(n===i?S():n===i+1&&w())}),P.min="1",P.max=p.toString(),P.value="1",Tt.textContent=p.toString()}async function nt(t,e){if(t>p){e.classList.add("blank-page"),e.innerHTML=`
            <div class="page-content-fallback">
              <h3>The Chronicle</h3>
              <p>End of Edition</p>
            </div>
          `;return}try{const n=await B.getPage(t),o=document.createElement("canvas");e.appendChild(o);const r=o.getContext("2d"),c=n.getViewport({scale:2});o.width=c.width,o.height=c.height;const s={canvasContext:r,viewport:c};await n.render(s).promise}catch(n){console.error(`Error rendering page ${t}: `,n),e.classList.add("blank-page"),e.innerHTML=`
            <div class="page-content-fallback">
              <h3 style="color: #eb5e55;">Error</h3>
              <p>Page ${t} failed to load</p>
            </div>
          `}}function ct(t){y=t,[N,G,V,Z,at,st,P].forEach(n=>{n&&(n.style.pointerEvents=t?"none":"")}),t||C()}function Bt(t){return t<=1?0:Math.ceil((t-1)/2)}function w(){if(y||i>=l)return;const t=i+1,e=document.getElementById(`sheet-${t}`);e&&j(e,-180,"forward",()=>{i=t,C()})}function S(){if(y||i<=0)return;const t=i,e=document.getElementById(`sheet-${t}`);e&&j(e,0,"backward",()=>{i=t-1,C()})}function W(t){if(y||t===i)return;const e=i;let n=null,o=0,r="forward";if(t>e){for(let c=e+1;c<t;c++){const s=document.getElementById(`sheet-${c}`);s&&(h.killTweensOf(s),h.set(s,{rotateY:-180,rotateX:0,rotateZ:0,z:0,scale:1}),s.classList.add("flipped"))}n=document.getElementById(`sheet-${t}`),o=-180,r="forward"}else{for(let c=e;c>t+1;c--){const s=document.getElementById(`sheet-${c}`);s&&(h.killTweensOf(s),h.set(s,{rotateY:0,rotateX:0,rotateZ:0,z:0,scale:1}),s.classList.remove("flipped"))}n=document.getElementById(`sheet-${t+1}`),o=0,r="backward"}n?j(n,o,r,()=>{i=t,C()}):(i=t,C())}function j(t,e,n,o){if(y)return;const r=n==="forward";h.killTweensOf(t),ct(!0),t.classList.add("is-flipping"),t.classList.toggle("is-flipping-forward",r),t.classList.toggle("is-flipping-backward",!r),$(t);const c=1.7,s=72,g=et(i),T=et(r?i+1:i-1),A=!!g&&!!T&&!!a&&!!_&&!!v&&!!E&&!!x,I={p:0},Q=()=>{t.classList.remove("is-flipping","is-flipping-forward","is-flipping-backward"),A&&u&&(u.style.opacity="0",d.classList.remove("is-curling")),e===-180?t.classList.add("flipped"):t.classList.remove("flipped"),h.set(t,{rotateX:0,rotateZ:0,z:0,scale:1}),$(null),o?.(),ct(!1)},f=h.timeline({onComplete:Q,onInterrupt:Q});if(A&&u&&a){d.classList.add("is-curling"),u.style.opacity="1";const ht=r?1:-1;b&&a.uniform1f(b,ht),v&&K(v,0,g),E&&K(E,1,T),J(0),I.p=0,f.to(I,{p:1,duration:c,ease:"power4.inOut",onUpdate:()=>{J(I.p)}},0)}f.to(t,{rotateY:e,duration:c,ease:"power4.inOut"},0),f.to(t,{z:s,duration:c*.48,ease:"power2.out"},0),f.to(t,{z:0,duration:c*.52,ease:"power3.in"},c*.48),f.to(t,{rotateX:r?-10:10,duration:c*.42,ease:"sine.out"},0),f.to(t,{rotateX:0,duration:c*.58,ease:"power2.out"},c*.42);const gt=r?-4:4;f.to(t,{rotateZ:gt,duration:c*.4,ease:"sine.out"},0),f.to(t,{rotateZ:0,duration:c*.6,ease:"power3.inOut"},c*.4),f.to(t,{scale:1.018,duration:c*.45,ease:"power1.out"},0),f.to(t,{scale:1,duration:c*.55,ease:"power2.inOut"},c*.45)}function C(){if(dt(),$(null),G.disabled=i===0,N.disabled=i===0,V.disabled=i===l,Z.disabled=i===l,i===0?P.value="1":P.value=Math.min(p,2*i).toString(),i===0)R.textContent=`Page 1 of ${p} (Cover)`;else if(i===l)R.textContent=`Page ${p} of ${p} (Back Cover)`;else{const t=2*i,e=Math.min(p,t+1);t===e?R.textContent=`Page ${t} of ${p}`:R.textContent=`Pages ${t}-${e} of ${p}`}}function $(t){for(let e=1;e<=l;e++){const n=document.getElementById(`sheet-${e}`);n&&(n===t?n.style.zIndex="1000":n.classList.contains("flipped")?n.style.zIndex=String(l+e):n.style.zIndex=String(l*2-e))}}function dt(){let t=0;i===0?t=-25:i===l&&(t=25),h.to(d,{scale:m,xPercent:t,duration:y?1.05:.5,ease:y?"power4.inOut":"power2.out"})}function ut(){const t=document.getElementById("book-workspace");if(!d||!k)return;const e=t.clientWidth,n=t.clientHeight,o=e>600?80:30,r=e>600?100:60,c=e-o,s=n-r,g=2*k;c/s>g?(X=s,Y=s*g):(Y=c,X=c/g),U()}function U(){d.style.width=`${Y*m}px`,d.style.height=`${X*m}px`,dt(),lt();const t=it.querySelector("span");t&&(t.textContent=`${Math.round(m*100)}%`)}function Lt(){m<yt&&(m+=.2,U())}function kt(){m>Pt&&(m-=.2,U())}function ft(){m=1,U()}function Dt(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(t=>{console.error(`Error attempting to enable fullscreen: ${t.message}`)})}N.addEventListener("click",()=>W(0));G.addEventListener("click",S);V.addEventListener("click",w);Z.addEventListener("click",()=>W(l));at.addEventListener("click",S);st.addEventListener("click",w);Ct.addEventListener("click",Lt);wt.addEventListener("click",kt);it.addEventListener("click",ft);St.addEventListener("click",Dt);P.addEventListener("input",t=>{const e=parseInt(t.target.value,10);W(Bt(e))});window.addEventListener("keydown",t=>{t.key==="ArrowLeft"?S():t.key==="ArrowRight"?w():t.key==="Escape"&&m>1&&ft()});let H=!1,mt=0;window.addEventListener("mousedown",t=>{t.target.closest(".book-workspace")&&!t.target.closest("button, a, input, select")&&(H=!0,mt=t.clientX)});window.addEventListener("mouseup",t=>{if(H){const n=t.clientX-mt,o=80;n<-o?w():n>o&&S(),H=!1}});let z=0,O=0;window.addEventListener("touchstart",t=>{z=t.changedTouches[0].screenX},{passive:!0});window.addEventListener("touchend",t=>{O=t.changedTouches[0].screenX,_t()},{passive:!0});function _t(){O<z-50?w():O>z+50&&S()}let ot;window.addEventListener("resize",()=>{clearTimeout(ot),ot=setTimeout(ut,150)});bt();
