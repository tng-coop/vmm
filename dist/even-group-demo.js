import{B as e,x as t}from"./lit-element-d0893540.js";class o extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render();const e=e=>e%2==0;this.shadowRoot.getElementById("check-closure").addEventListener("click",(()=>{const t=parseInt(this.shadowRoot.getElementById("closure-a").value,10),o=parseInt(this.shadowRoot.getElementById("closure-b").value,10),n=this.shadowRoot.getElementById("closure-result");if(isNaN(t)||isNaN(o))return void(n.textContent="Please enter valid integers for a and b.");if(!e(t)||!e(o))return void(n.textContent="Both a and b must be even numbers.");const i=t+o;n.textContent=`Result: ${t} + ${o} = ${i}. Closure holds because the sum is even.`})),this.shadowRoot.getElementById("check-identity").addEventListener("click",(()=>{const t=parseInt(this.shadowRoot.getElementById("identity-a").value,10),o=this.shadowRoot.getElementById("identity-result");if(isNaN(t))return void(o.textContent="Please enter a valid integer for a.");if(!e(t))return void(o.textContent="Please enter an even number for a.");const n=t+0;o.textContent=`Result: ${t} + 0 = ${n}. The identity element is 0, which is even.`})),this.shadowRoot.getElementById("check-associativity").addEventListener("click",(()=>{const t=parseInt(this.shadowRoot.getElementById("assoc-a").value,10),o=parseInt(this.shadowRoot.getElementById("assoc-b").value,10),n=parseInt(this.shadowRoot.getElementById("assoc-c").value,10),i=this.shadowRoot.getElementById("associativity-result");if(isNaN(t)||isNaN(o)||isNaN(n))return void(i.textContent="Please enter valid integers for a, b, and c.");if(!e(t)||!e(o)||!e(n))return void(i.textContent="All of a, b, and c must be even numbers.");const s=t+o+n,a=t+(o+n);let r=`Result: ( ${t} + ${o} ) + ${n} = ${s} and ${t} + ( ${o} + ${n} ) = ${a}. `;r+=s===a?"Associativity holds.":"Associativity does not hold!",i.textContent=r})),this.shadowRoot.getElementById("check-inverse").addEventListener("click",(()=>{const t=parseInt(this.shadowRoot.getElementById("inverse-a").value,10),o=this.shadowRoot.getElementById("inverse-result");if(isNaN(t))return void(o.textContent="Please enter a valid integer for a.");if(!e(t))return void(o.textContent="Please enter an even number for a.");const n=-t,i=t+n;o.textContent=`Result: ${t} + (${n}) = ${i}. Every even number a has an inverse (-a) such that a + (-a) = 0.`}))}render(){const o=t`
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          background-color: #eef;
          margin: 0;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        section {
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 15px;
          margin: 20px 0;
          border-radius: 8px;
        }
        label {
          margin-right: 10px;
        }
        input {
          margin: 5px;
          padding: 5px;
          width: 60px;
        }
        button {
          padding: 8px 16px;
          font-size: 14px;
          margin-top: 10px;
          cursor: pointer;
          border: none;
          border-radius: 4px;
          background-color: #007BFF;
          color: #fff;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #0056b3;
        }
        div {
          margin-top: 10px;
          font-weight: bold;
        }
      </style>
      <h1>Even Numbers Group Demonstration</h1>
      <p>
        This demonstration shows the group properties of the set of even numbers 
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mn>2</mn>
          <mi>&#x2124;</mi>
        </math>
        under addition.
      </p>
      
      <section id="closure">
        <h2>Closure</h2>
        <p>
          Enter two even numbers to demonstrate closure:
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mi>a</mi>
            <mo>+</mo>
            <mi>b</mi>
            <mo>=</mo>
            <mrow>
              <mn>2</mn>
              <mi>&#x2124;</mi>
            </mrow>
          </math>
        </p>
        <label for="closure-a">a:</label>
        <input id="closure-a" type="number" step="1">
        <label for="closure-b">b:</label>
        <input id="closure-b" type="number" step="1">
        <button id="check-closure">Check Closure</button>
        <div id="closure-result"></div>
      </section>
      
      <section id="identity">
        <h2>Identity</h2>
        <p>
          Enter an even number to demonstrate the identity property:
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mi>a</mi>
            <mo>+</mo>
            <mn>0</mn>
            <mo>=</mo>
            <mi>a</mi>
          </math>
        </p>
        <label for="identity-a">a:</label>
        <input id="identity-a" type="number" step="1">
        <button id="check-identity">Check Identity</button>
        <div id="identity-result"></div>
      </section>
      
      <section id="associativity">
        <h2>Associativity</h2>
        <p>
          Enter three even numbers to demonstrate associativity:
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mo>(</mo>
            <mi>a</mi>
            <mo>+</mo>
            <mi>b</mi>
            <mo>)</mo>
            <mo>+</mo>
            <mi>c</mi>
            <mo>=</mo>
            <mi>a</mi>
            <mo>+</mo>
            <mo>(</mo>
            <mi>b</mi>
            <mo>+</mo>
            <mi>c</mi>
            <mo>)</mo>
          </math>
        </p>
        <label for="assoc-a">a:</label>
        <input id="assoc-a" type="number" step="1">
        <label for="assoc-b">b:</label>
        <input id="assoc-b" type="number" step="1">
        <label for="assoc-c">c:</label>
        <input id="assoc-c" type="number" step="1">
        <button id="check-associativity">Check Associativity</button>
        <div id="associativity-result"></div>
      </section>
      
      <section id="inverse">
        <h2>Inverse</h2>
        <p>
          Enter an even number to demonstrate the inverse property:
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mi>a</mi>
            <mo>+</mo>
            <mrow>
              <mo>(</mo>
              <mo>&#x2212;</mo>
              <mi>a</mi>
              <mo>)</mo>
            </mrow>
            <mo>=</mo>
            <mn>0</mn>
          </math>
        </p>
        <label for="inverse-a">a:</label>
        <input id="inverse-a" type="number" step="1">
        <button id="check-inverse">Check Inverse</button>
        <div id="inverse-result"></div>
      </section>
    `;e(o,this.shadowRoot)}}customElements.define("even-group-demo",o);
//# sourceMappingURL=even-group-demo.js.map
