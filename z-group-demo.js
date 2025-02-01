class ZGroupDemo extends HTMLElement {
    constructor() {
      super();
      // Attach shadow DOM for encapsulation
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
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
        <h1>Z Group Demonstration</h1>
        <p>This demonstration shows the group properties of the set of integers (ℤ) under addition.</p>
        
        <section id="closure">
          <h2>Closure</h2>
          <p>Enter two integers to demonstrate closure: a + b is an integer.</p>
          <label for="closure-a">a:</label>
          <input id="closure-a" type="number" step="1">
          <label for="closure-b">b:</label>
          <input id="closure-b" type="number" step="1">
          <button id="check-closure">Check Closure</button>
          <div id="closure-result"></div>
        </section>
        
        <section id="identity">
          <h2>Identity</h2>
          <p>Enter an integer to demonstrate the identity element (0): a + 0 = a.</p>
          <label for="identity-a">a:</label>
          <input id="identity-a" type="number" step="1">
          <button id="check-identity">Check Identity</button>
          <div id="identity-result"></div>
        </section>
        
        <section id="associativity">
          <h2>Associativity</h2>
          <p>Enter three integers to demonstrate associativity: (a + b) + c = a + (b + c).</p>
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
          <p>Enter an integer to demonstrate the inverse property: a + (–a) = 0.</p>
          <label for="inverse-a">a:</label>
          <input id="inverse-a" type="number" step="1">
          <button id="check-inverse">Check Inverse</button>
          <div id="inverse-result"></div>
        </section>
      `;
    }
  
    connectedCallback() {
      // Closure
      this.shadowRoot.getElementById('check-closure').addEventListener('click', () => {
        const a = parseInt(this.shadowRoot.getElementById('closure-a').value, 10);
        const b = parseInt(this.shadowRoot.getElementById('closure-b').value, 10);
        if (isNaN(a) || isNaN(b)) {
          this.shadowRoot.getElementById('closure-result').textContent = "Please enter valid integers for a and b.";
          return;
        }
        const sum = a + b;
        this.shadowRoot.getElementById('closure-result').textContent = `Result: ${a} + ${b} = ${sum}. Closure holds because the sum is an integer.`;
      });
  
      // Identity
      this.shadowRoot.getElementById('check-identity').addEventListener('click', () => {
        const a = parseInt(this.shadowRoot.getElementById('identity-a').value, 10);
        if (isNaN(a)) {
          this.shadowRoot.getElementById('identity-result').textContent = "Please enter a valid integer for a.";
          return;
        }
        const result = a + 0;
        this.shadowRoot.getElementById('identity-result').textContent = `Result: ${a} + 0 = ${result}. The identity element in (ℤ, +) is 0.`;
      });
  
      // Associativity
      this.shadowRoot.getElementById('check-associativity').addEventListener('click', () => {
        const a = parseInt(this.shadowRoot.getElementById('assoc-a').value, 10);
        const b = parseInt(this.shadowRoot.getElementById('assoc-b').value, 10);
        const c = parseInt(this.shadowRoot.getElementById('assoc-c').value, 10);
        if (isNaN(a) || isNaN(b) || isNaN(c)) {
          this.shadowRoot.getElementById('associativity-result').textContent = "Please enter valid integers for a, b, and c.";
          return;
        }
        const left = (a + b) + c;
        const right = a + (b + c);
        let message = `Result: ( ${a} + ${b} ) + ${c} = ${left} and ${a} + ( ${b} + ${c} ) = ${right}. `;
        message += (left === right) ? "Associativity holds." : "Associativity does not hold!";
        this.shadowRoot.getElementById('associativity-result').textContent = message;
      });
  
      // Inverse
      this.shadowRoot.getElementById('check-inverse').addEventListener('click', () => {
        const a = parseInt(this.shadowRoot.getElementById('inverse-a').value, 10);
        if (isNaN(a)) {
          this.shadowRoot.getElementById('inverse-result').textContent = "Please enter a valid integer for a.";
          return;
        }
        const inverse = -a;
        const sum = a + inverse;
        this.shadowRoot.getElementById('inverse-result').textContent = `Result: ${a} + (${inverse}) = ${sum}. Every integer a has an inverse (–a) such that a + (–a) = 0.`;
      });
    }
  }
  
  // Define the new element
  customElements.define('z-group-demo', ZGroupDemo);
  