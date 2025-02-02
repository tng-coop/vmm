import { html, render } from 'lit';

class EvenGroupDemo extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    // Render the template into the shadow root
    this.render();
    
    // Helper function to check if a number is even
    const isEven = n => n % 2 === 0;
  
    // Closure: For any two even numbers a and b, a + b is even.
    this.shadowRoot.getElementById('check-closure').addEventListener('click', () => {
      const a = parseInt(this.shadowRoot.getElementById('closure-a').value, 10);
      const b = parseInt(this.shadowRoot.getElementById('closure-b').value, 10);
      const resultDiv = this.shadowRoot.getElementById('closure-result');
      if (isNaN(a) || isNaN(b)) {
        resultDiv.textContent = "Please enter valid integers for a and b.";
        return;
      }
      if (!isEven(a) || !isEven(b)) {
        resultDiv.textContent = "Both a and b must be even numbers.";
        return;
      }
      const sum = a + b;
      resultDiv.textContent = `Result: ${a} + ${b} = ${sum}. Closure holds because the sum is even.`;
    });
  
    // Identity: For any even number a, a + 0 = a.
    this.shadowRoot.getElementById('check-identity').addEventListener('click', () => {
      const a = parseInt(this.shadowRoot.getElementById('identity-a').value, 10);
      const resultDiv = this.shadowRoot.getElementById('identity-result');
      if (isNaN(a)) {
        resultDiv.textContent = "Please enter a valid integer for a.";
        return;
      }
      if (!isEven(a)) {
        resultDiv.textContent = "Please enter an even number for a.";
        return;
      }
      const result = a + 0;
      resultDiv.textContent = `Result: ${a} + 0 = ${result}. The identity element is 0, which is even.`;
    });
  
    // Associativity: For any three even numbers a, b, and c, (a + b) + c = a + (b + c).
    this.shadowRoot.getElementById('check-associativity').addEventListener('click', () => {
      const a = parseInt(this.shadowRoot.getElementById('assoc-a').value, 10);
      const b = parseInt(this.shadowRoot.getElementById('assoc-b').value, 10);
      const c = parseInt(this.shadowRoot.getElementById('assoc-c').value, 10);
      const resultDiv = this.shadowRoot.getElementById('associativity-result');
      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        resultDiv.textContent = "Please enter valid integers for a, b, and c.";
        return;
      }
      if (!isEven(a) || !isEven(b) || !isEven(c)) {
        resultDiv.textContent = "All of a, b, and c must be even numbers.";
        return;
      }
      const left = (a + b) + c;
      const right = a + (b + c);
      let message = `Result: ( ${a} + ${b} ) + ${c} = ${left} and ${a} + ( ${b} + ${c} ) = ${right}. `;
      message += (left === right) ? "Associativity holds." : "Associativity does not hold!";
      resultDiv.textContent = message;
    });
  
    // Inverse: For any even number a, there exists an inverse (–a) such that a + (–a) = 0.
    this.shadowRoot.getElementById('check-inverse').addEventListener('click', () => {
      const a = parseInt(this.shadowRoot.getElementById('inverse-a').value, 10);
      const resultDiv = this.shadowRoot.getElementById('inverse-result');
      if (isNaN(a)) {
        resultDiv.textContent = "Please enter a valid integer for a.";
        return;
      }
      if (!isEven(a)) {
        resultDiv.textContent = "Please enter an even number for a.";
        return;
      }
      const inverse = -a;
      const sum = a + inverse;
      resultDiv.textContent = `Result: ${a} + (${inverse}) = ${sum}. Every even number a has an inverse (-a) such that a + (-a) = 0.`;
    });
  }
  
  render() {
    const template = html`
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
        (<math xmlns="http://www.w3.org/1998/Math/MathML">
          <mn>2</mn><mi>&#x2124;</mi>
        </math>) under addition.
      </p>
      
      <section id="closure">
        <h2>Closure</h2>
        <p>Enter two even numbers to demonstrate closure: a + b should be even.</p>
        <label for="closure-a">a:</label>
        <input id="closure-a" type="number" step="1">
        <label for="closure-b">b:</label>
        <input id="closure-b" type="number" step="1">
        <button id="check-closure">Check Closure</button>
        <div id="closure-result"></div>
      </section>
      
      <section id="identity">
        <h2>Identity</h2>
        <p>The identity element is 0. Enter an even number to demonstrate a + 0 = a.</p>
        <label for="identity-a">a:</label>
        <input id="identity-a" type="number" step="1">
        <button id="check-identity">Check Identity</button>
        <div id="identity-result"></div>
      </section>
      
      <section id="associativity">
        <h2>Associativity</h2>
        <p>Enter three even numbers to demonstrate associativity: (a + b) + c = a + (b + c).</p>
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
        <p>Enter an even number to demonstrate the inverse property: a + (–a) = 0.</p>
        <label for="inverse-a">a:</label>
        <input id="inverse-a" type="number" step="1">
        <button id="check-inverse">Check Inverse</button>
        <div id="inverse-result"></div>
      </section>
    `;
    render(template, this.shadowRoot);
  }
}

customElements.define('even-group-demo', EvenGroupDemo);
