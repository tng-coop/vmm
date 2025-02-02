import{B as t,x as e}from"./lit-element-d0893540.js";const o={1:{k:0,d:0},r:{k:1,d:0},r2:{k:2,d:0},f:{k:0,d:1},rf:{k:1,d:1},r2f:{k:2,d:1}};function i(t,e){const i=o[t],n=o[e];let r=i.k+(0===i.d?n.k:-n.k);r=(r%3+3)%3;const a=(i.d+n.d)%2;for(let t in o){const e=o[t];if(e.k===r&&e.d===a)return t}return null}function n(t){switch(t){case"1":return"<mi>1</mi>";case"r":return"<mi>r</mi>";case"r2":return"<msup><mi>r</mi><mn>2</mn></msup>";case"f":return"<mi>f</mi>";case"rf":return"<mrow><mi>r</mi><mo>&#x22C5;</mo><mi>f</mi></mrow>";case"r2f":return"<mrow><msup><mi>r</mi><mn>2</mn></msup><mo>&#x22C5;</mo><mi>f</mi></mrow>";default:return`<mi>${t}</mi>`}}class r extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.setupInteractive()}resetTriangle(){const t=this.shadowRoot.getElementById("triangle-group");t&&(t.getAnimations().forEach((t=>t.cancel())),t.setAttribute("transform","rotate(0) scale(1)"));this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>t.removeAttribute("transform")))}animateRotation(t,e=500){const o=this.shadowRoot.getElementById("triangle-group");if(!o)return;let i=null;const n=r=>{i||(i=r);const a=r-i,s=Math.min(a/e,1),l=0+s*(t-0);if(o.setAttribute("transform",`rotate(${l})`),s<1)requestAnimationFrame(n);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((e=>{const o=e.getAttribute("x"),i=e.getAttribute("y");e.setAttribute("transform",`rotate(-${t}, ${o}, ${i})`)}))}};requestAnimationFrame(n)}animateFlip(t=500){const e=this.shadowRoot.getElementById("triangle-group");if(!e)return;let o=null;const i=n=>{o||(o=n);const r=n-o,a=Math.min(r/t,1),s=1+-2*a;if(e.setAttribute("transform",`rotate(0) scale(${s}, 1)`),a<1)requestAnimationFrame(i);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>{const e=t.getAttribute("x"),o=t.getAttribute("y");t.setAttribute("transform",`translate(${e}, ${o}) scale(-1,1) translate(${-e}, ${-o})`)}))}};requestAnimationFrame(i)}animateFlipThenRotation(t,e=500,o=500){const i=this.shadowRoot.getElementById("triangle-group");if(!i)return;let n=null;const r=t=>{n||(n=t);const o=t-n,s=Math.min(o/e,1),l=1+-2*s;if(i.setAttribute("transform",`rotate(0) scale(${l}, 1)`),s<1)requestAnimationFrame(r);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>{const e=t.getAttribute("x"),o=t.getAttribute("y");t.setAttribute("transform",`translate(${e}, ${o}) scale(-1,1) translate(${-e}, ${-o})`)})),a()}},a=()=>{let e=null;const n=r=>{e||(e=r);const a=r-e,s=Math.min(a/o,1),l=s*t;if(i.setAttribute("transform",`rotate(${l}) scale(-1,1)`),s<1)requestAnimationFrame(n);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((e=>{const o=e.getAttribute("x"),i=e.getAttribute("y");e.setAttribute("transform",`translate(${o}, ${i}) scale(-1,1) rotate(-${t}) translate(${-o}, ${-i})`)}))}};requestAnimationFrame(n)};requestAnimationFrame(r)}raiseTriangle(){const t=this.shadowRoot.getElementById("triangle-group");if(t){const e=t.getAttribute("transform")||"";t.animate([{transform:e},{transform:"scale(1.2)"}],{duration:150,fill:"forwards",easing:"ease-out"}),t.setAttribute("transform","scale(1.2)")}}lowerTriangle(){const t=this.shadowRoot.getElementById("triangle-group");if(t){const e=t.getAttribute("transform")||"";t.animate([{transform:e},{transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease-out"}),t.setAttribute("transform","scale(1)")}}setupInteractive(){this.shadowRoot.getElementById("check-closure").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("closure-a").value,e=this.shadowRoot.getElementById("closure-b").value,o=i(t,e);this.shadowRoot.getElementById("closure-result").innerHTML=`Result: <math><mrow>${n(t)}<mo>&#x22C5;</mo>${n(e)}<mo>=</mo>${n(o)}</mrow></math>. Closure holds because the result is in D₃.`})),this.shadowRoot.getElementById("check-identity-prop").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("identity-element").value,e=i("1",t);this.shadowRoot.getElementById("identity-result-prop").innerHTML=`Result: <math><mrow>${n("1")}<mo>&#x22C5;</mo>${n(t)}<mo>=</mo>${n(e)}</mrow></math>. The identity element is 1.`})),this.shadowRoot.getElementById("check-associativity-prop").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("assoc-a").value,e=this.shadowRoot.getElementById("assoc-b").value,o=this.shadowRoot.getElementById("assoc-c").value,r=i(i(t,e),o),a=i(t,i(e,o));let s=`Result: <math><mrow>( ${n(t)}<mo>&#x22C5;</mo>${n(e)} )<mo>&#x22C5;</mo>${n(o)}<mo>=</mo>${n(r)}</mrow></math> and <math><mrow>${n(t)}<mo>&#x22C5;</mo>( ${n(e)}<mo>&#x22C5;</mo>${n(o)} )<mo>=</mo>${n(a)}</mrow></math>. `;s+=r===a?"Associativity holds.":"Associativity fails!",this.shadowRoot.getElementById("associativity-result-prop").innerHTML=s})),this.shadowRoot.getElementById("check-inverse-prop").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("inverse-element").value,e=function(t){for(let e in o)if("1"===i(t,e))return e;return null}(t);i(t,e),this.shadowRoot.getElementById("inverse-result-prop").innerHTML=`Result: <math><mrow>${n(t)}<mo>&#x22C5;</mo>${n(e)}<mo>=</mo><mi>1</mi></mrow></math>  Inverse holds.`}))}render(){const o=e`
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #eef;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        svg {
          display: block;
          margin: 0 auto 20px;
        }
        .buttons, .interactive {
          text-align: center;
          margin-top: 20px;
        }
        button {
          padding: 8px 16px;
          margin: 5px;
          font-size: 14px;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: #fff;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #0056b3;
        }
        .math {
          text-align: center;
          margin-top: 10px;
        }
        section {
          background: #fff;
          border: 1px solid #ccc;
          padding: 15px;
          margin: 20px auto;
          max-width: 600px;
          border-radius: 8px;
          text-align: left;
        }
        section h2 {
          margin-top: 0;
          text-align: center;
        }
        section label {
          margin-right: 10px;
        }
        section select, section input {
          margin: 5px;
          padding: 5px;
          width: 80px;
        }
        section div.result {
          margin-top: 10px;
          font-weight: bold;
          text-align: center;
        }
      </style>
      <h1>Triangle Group Demonstration (Dihedral Group D₃)</h1>
      
      <!-- Animated triangle with transformation buttons -->
      <svg id="triangle-svg" width="300" height="300" viewBox="-150 -150 300 300">
        <g id="triangle-group">
          <polygon points="0,-100 86.6,50 -86.6,50" fill="#007BFF" stroke="#0056b3" stroke-width="3"></polygon>
          <text x="0" y="10" font-size="36" text-anchor="middle" fill="white">🐱</text>
          <text class="vertex-label" x="0" y="-60" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">1</text>
          <text class="vertex-label" x="50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">2</text>
          <text class="vertex-label" x="-50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">3</text>
        </g>
      </svg>
      
      <div class="buttons">
        <button id="identity-button"
          @pointerdown="${()=>{this.resetTriangle(),this.raiseTriangle()}}"
          @pointerup="${()=>this.lowerTriangle()}"
          @pointercancel="${()=>this.lowerTriangle()}">
          1 (Identity)
        </button>
        <button @pointerdown="${()=>this.resetTriangle()}" 
                @pointerup="${()=>this.animateRotation(120,500)}" 
                @pointercancel="${()=>this.animateRotation(120,500)}">
          r (Rotate 120°)
        </button>
        <button @pointerdown="${()=>this.resetTriangle()}" 
                @pointerup="${()=>this.animateRotation(240,1e3)}" 
                @pointercancel="${()=>this.animateRotation(240,1e3)}">
          r² (Rotate 240°)
        </button>
        <button @pointerdown="${()=>this.resetTriangle()}" 
                @pointerup="${()=>this.animateFlip(500)}" 
                @pointercancel="${()=>this.animateFlip(500)}">
          f (Reflect)
        </button>
        <button @pointerdown="${()=>this.resetTriangle()}" 
                @pointerup="${()=>this.animateFlipThenRotation(120,500,500)}" 
                @pointercancel="${()=>this.animateFlipThenRotation(120,500,500)}">
          r·f
        </button>
        <button @pointerdown="${()=>this.resetTriangle()}" 
                @pointerup="${()=>this.animateFlipThenRotation(240,500,1e3)}" 
                @pointercancel="${()=>this.animateFlipThenRotation(240,500,1e3)}">
          r²·f
        </button>
      </div>
      
      <!-- Interactive sections for group properties -->
      <div class="interactive">
        <section id="closure">
          <h2>Closure</h2>
          <p>Select two elements to check closure under composition:</p>
          <label for="closure-a">a:</label>
          <select id="closure-a">
            <option value="1">1</option>
            <option value="r">r</option>
            <option value="r2">r²</option>
            <option value="f">f</option>
            <option value="rf">r·f</option>
            <option value="r2f">r²·f</option>
          </select>
          <label for="closure-b">b:</label>
          <select id="closure-b">
            <option value="1">1</option>
            <option value="r">r</option>
            <option value="r2">r²</option>
            <option value="f">f</option>
            <option value="rf">r·f</option>
            <option value="r2f">r²·f</option>
          </select>
          <button id="check-closure">Check Closure</button>
          <div id="closure-result" class="result"></div>
        </section>
        
        <section id="identity-property">
          <h2>Identity</h2>
          <p>Select an element to see that composing with the identity yields the same element:</p>
          <label for="identity-element">a:</label>
          <select id="identity-element">
            <option value="1">1</option>
            <option value="r">r</option>
            <option value="r2">r²</option>
            <option value="f">f</option>
            <option value="rf">r·f</option>
            <option value="r2f">r²·f</option>
          </select>
          <button id="check-identity-prop">Check Identity</button>
          <div id="identity-result-prop" class="result"></div>
        </section>
        
        <section id="associativity-property">
          <h2>Associativity</h2>
          <p>Select three elements to verify associativity: (a·b)·c = a·(b·c)</p>
          <label for="assoc-a">a:</label>
          <select id="assoc-a">
            <option value="1">1</option>
            <option value="r">r</option>
            <option value="r2">r²</option>
            <option value="f">f</option>
            <option value="rf">r·f</option>
            <option value="r2f">r²·f</option>
          </select>
          <label for="assoc-b">b:</label>
          <select id="assoc-b">
            <option value="1">1</option>
            <option value="r">r</option>
            <option value="r2">r²</option>
            <option value="f">f</option>
            <option value="rf">r·f</option>
            <option value="r2f">r²·f</option>
          </select>
          <label for="assoc-c">c:</label>
          <select id="assoc-c">
            <option value="1">1</option>
            <option value="r">r</option>
            <option value="r2">r²</option>
            <option value="f">f</option>
            <option value="rf">r·f</option>
            <option value="r2f">r²·f</option>
          </select>
          <button id="check-associativity-prop">Check Associativity</button>
          <div id="associativity-result-prop" class="result"></div>
        </section>
        
        <section id="inverse-property">
          <h2>Inverse</h2>
          <p>Select an element to find its inverse (b such that a·b = 1):</p>
          <label for="inverse-element">a:</label>
          <select id="inverse-element">
            <option value="1">1</option>
            <option value="r">r</option>
            <option value="r2">r²</option>
            <option value="f">f</option>
            <option value="rf">r·f</option>
            <option value="r2f">r²·f</option>
          </select>
          <button id="check-inverse-prop">Check Inverse</button>
          <div id="inverse-result-prop" class="result"></div>
        </section>
      </div>
    `;t(o,this.shadowRoot)}}customElements.define("triangle-group-demo",r);
//# sourceMappingURL=triangle-group-demo.js.map
