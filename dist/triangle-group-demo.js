import{B as t,x as e}from"./lit-element-d0893540.js";const o={1:{k:0,d:0},r:{k:1,d:0},r2:{k:2,d:0},f:{k:0,d:1},rf:{k:1,d:1},r2f:{k:2,d:1}};function n(t,e){const n=o[t],i=o[e];let r=n.k+(0===n.d?i.k:-i.k);r=(r%3+3)%3;const a=(n.d+i.d)%2;for(let t in o){const e=o[t];if(e.k===r&&e.d===a)return t}return null}function i(t){switch(t){case"1":return"<mi>1</mi>";case"r":return"<mi>r</mi>";case"r2":return"<msup><mi>r</mi><mn>2</mn></msup>";case"f":return"<mi>f</mi>";case"rf":return"<mrow><mi>r</mi><mo>&#x22C5;</mo><mi>f</mi></mrow>";case"r2f":return"<mrow><msup><mi>r</mi><mn>2</mn></msup><mo>&#x22C5;</mo><mi>f</mi></mrow>";default:return`<mi>${t}</mi>`}}class r extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.currentElement="1"}connectedCallback(){this.render(),this.resetDemo(),this.setupInteractive()}resetTriangle(){const t=this.shadowRoot.getElementById("triangle-group");t&&(t.getAnimations().forEach((t=>t.cancel())),t.setAttribute("transform","rotate(0) scale(1)"));this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>t.removeAttribute("transform")))}resetDemo(){this.resetTriangle(),this.currentElement="1";const t=this.shadowRoot.getElementById("formula-display");t&&(t.innerHTML=`Result: <math><mrow>${i("1")}<mo>=</mo>${i("1")}</mrow></math>`)}updateFormulaDisplay(t,e,o){const n=this.shadowRoot.getElementById("formula-display");n&&(n.innerHTML=`Result: <math><mrow>${i(t)}<mo>&#x22C5;</mo>${i(e)}<mo>=</mo>${i(o)}</mrow></math>`)}getCurrentRotation(){const t=(this.shadowRoot.getElementById("triangle-group").getAttribute("transform")||"").match(/rotate\(([-\d.]+)/);return t?parseFloat(t[1]):0}getCurrentScale(){const t=(this.shadowRoot.getElementById("triangle-group").getAttribute("transform")||"").match(/scale\(([-\d.]+)/);return t?parseFloat(t[1]):1}animateRotation(t,e=500){const o=this.shadowRoot.getElementById("triangle-group");if(!o)return;let n=null;const i=this.getCurrentRotation(),r=i+t,a=this.getCurrentScale(),s=t=>{n||(n=t);const l=t-n,c=Math.min(l/e,1),u=i+c*(r-i);if(o.setAttribute("transform",`rotate(${u}) scale(${a}, 1)`),c<1)requestAnimationFrame(s);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>{const e=t.getAttribute("x"),o=t.getAttribute("y");t.setAttribute("transform",`rotate(-${r}, ${e}, ${o})`)}))}};requestAnimationFrame(s)}animateFlip(t=500){const e=this.shadowRoot.getElementById("triangle-group");if(!e)return;let o=null;const n=this.getCurrentRotation(),i=r=>{o||(o=r);const a=r-o,s=Math.min(a/t,1),l=1+-2*s;if(e.setAttribute("transform",`rotate(${n}) translate(0, 100) scale(${l},1) translate(0, -100)`),s<1)requestAnimationFrame(i);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>{const e=t.getAttribute("x"),o=t.getAttribute("y");t.setAttribute("transform",`translate(${e}, ${o}) scale(-1,1) translate(${-e}, ${-o})`)}))}};requestAnimationFrame(i)}animateFlipThenRotation(t,e=500,o=500){const n=this.shadowRoot.getElementById("triangle-group");if(!n)return;const i=this.getCurrentRotation();let r=null;const a=t=>{r||(r=t);const o=t-r,l=Math.min(o/e,1),c=1+-2*l;if(n.setAttribute("transform",`rotate(${i}) translate(0, 100) scale(${c},1) translate(0, -100)`),l<1)requestAnimationFrame(a);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>{const e=t.getAttribute("x"),o=t.getAttribute("y");t.setAttribute("transform",`translate(${e}, ${o}) scale(-1,1) translate(${-e}, ${-o})`)})),s()}},s=()=>{let e=null;const r=i+t,a=t=>{e||(e=t);const s=t-e,l=Math.min(s/o,1),c=i+l*(r-i);if(n.setAttribute("transform",`rotate(${c}) translate(0, 100) scale(-1,1) translate(0, -100)`),l<1)requestAnimationFrame(a);else{this.shadowRoot.querySelectorAll(".vertex-label").forEach((t=>{const e=t.getAttribute("x"),o=t.getAttribute("y");t.setAttribute("transform",`translate(${e}, ${o}) scale(-1,1) rotate(-${r}) translate(${-e}, ${-o})`)}))}};requestAnimationFrame(a)};requestAnimationFrame(a)}raiseTriangle(){const t=this.shadowRoot.getElementById("triangle-group");if(t){const e=t.getAttribute("transform")||"";t.animate([{transform:e},{transform:e+" scale(1.2)"}],{duration:150,fill:"forwards",easing:"ease-out"})}}lowerTriangle(){const t=this.shadowRoot.getElementById("triangle-group");if(t){const e=t.getAttribute("transform")||"";t.animate([{transform:e},{transform:e.replace(/scale\([^)]*\)/,"scale(1)")}],{duration:150,fill:"forwards",easing:"ease-out"})}}setupInteractive(){this.shadowRoot.getElementById("check-closure").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("closure-a").value,e=this.shadowRoot.getElementById("closure-b").value,o=n(t,e);this.shadowRoot.getElementById("closure-result").innerHTML=`Result: <math><mrow>${i(t)}<mo>&#x22C5;</mo>${i(e)}<mo>=</mo>${i(o)}</mrow></math>. Closure holds because the result is in D₃.`})),this.shadowRoot.getElementById("check-identity-prop").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("identity-element").value,e=n("1",t);this.shadowRoot.getElementById("identity-result-prop").innerHTML=`Result: <math><mrow>${i("1")}<mo>&#x22C5;</mo>${i(t)}<mo>=</mo>${i(e)}</mrow></math>. The identity element is 1.`})),this.shadowRoot.getElementById("check-associativity-prop").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("assoc-a").value,e=this.shadowRoot.getElementById("assoc-b").value,o=this.shadowRoot.getElementById("assoc-c").value,r=n(n(t,e),o),a=n(t,n(e,o));let s=`Result: <math><mrow>( ${i(t)}<mo>&#x22C5;</mo>${i(e)} )<mo>&#x22C5;</mo>${i(o)}<mo>=</mo>${i(r)}</mrow></math> and <math><mrow>${i(t)}<mo>&#x22C5;</mo>( ${i(e)}<mo>&#x22C5;</mo>${i(o)} )<mo>=</mo>${i(a)}</mrow></math>. `;s+=r===a?"Associativity holds.":"Associativity fails!",this.shadowRoot.getElementById("associativity-result-prop").innerHTML=s})),this.shadowRoot.getElementById("check-inverse-prop").addEventListener("click",(()=>{const t=this.shadowRoot.getElementById("inverse-element").value,e=function(t){for(let e in o)if("1"===n(t,e))return e;return null}(t);n(t,e),this.shadowRoot.getElementById("inverse-result-prop").innerHTML=`Result: <math><mrow>${i(t)}<mo>&#x22C5;</mo>${i(e)}<mo>=</mo><mi>1</mi></mrow></math> Inverse holds.`}))}render(){const o=e`
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
        #formula-display {
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
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
      
      <!-- Formula display: will be reset to identity on load -->
      <div id="formula-display"></div>
      
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
        <!-- Identity button: New element = 1 · (current) -->
        <button id="identity-button"
          @pointerdown="${()=>this.raiseTriangle()}"
          @pointerup="${()=>{const t=n("1",this.currentElement);this.updateFormulaDisplay("1",this.currentElement,t),this.currentElement=t,this.lowerTriangle()}}"
          @pointercancel="${()=>{}}">
          1 (Identity)
        </button>
        <!-- Rotation by 120°: New element = r · (current) -->
        <button 
          @pointerdown="${()=>{}}"
          @pointerup="${()=>{const t=n("r",this.currentElement);this.updateFormulaDisplay("r",this.currentElement,t),this.currentElement=t,this.animateRotation(120,500)}}"
          @pointercancel="${()=>this.animateRotation(120,500)}">
          r (Rotate 120°)
        </button>
        <!-- Rotation by 240° (r²): New element = r² · (current) -->
        <button 
          @pointerdown="${()=>{}}"
          @pointerup="${()=>{const t=n("r2",this.currentElement);this.updateFormulaDisplay("r2",this.currentElement,t),this.currentElement=t,this.animateRotation(240,1e3)}}"
          @pointercancel="${()=>this.animateRotation(240,1e3)}">
          r² (Rotate 240°)
        </button>
        <!-- Reflection: New element = f · (current) -->
        <button 
          @pointerdown="${()=>{}}"
          @pointerup="${()=>{const t=n("f",this.currentElement);this.updateFormulaDisplay("f",this.currentElement,t),this.currentElement=t,this.animateFlip(500)}}"
          @pointercancel="${()=>this.animateFlip(500)}">
          f (Reflect)
        </button>
        <!-- Reflection then rotation (r · f): New element = (r·f) · (current) -->
        <button 
          @pointerdown="${()=>{}}"
          @pointerup="${()=>{const t=n("rf",this.currentElement);this.updateFormulaDisplay("rf",this.currentElement,t),this.currentElement=t,this.animateFlipThenRotation(120,500,500)}}"
          @pointercancel="${()=>this.animateFlipThenRotation(120,500,500)}">
          r·f
        </button>
        <!-- Reflection then rotation (r² · f): New element = (r²·f) · (current) -->
        <button 
          @pointerdown="${()=>{}}"
          @pointerup="${()=>{const t=n("r2f",this.currentElement);this.updateFormulaDisplay("r2f",this.currentElement,t),this.currentElement=t,this.animateFlipThenRotation(240,500,1e3)}}"
          @pointercancel="${()=>this.animateFlipThenRotation(240,500,1e3)}">
          r²·f
        </button>
        <!-- Explicit Reset Button -->
        <button id="reset-button"
          @pointerup="${()=>this.resetDemo()}">
          Reset
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
