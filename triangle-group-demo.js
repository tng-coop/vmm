import { html, render } from "lit";

// --- Helper functions for D₃ ---

// Represent each element as an object { k, d } where k ∈ {0,1,2} and d ∈ {0,1}.
// Here, d = 0 means no reflection (a rotation) and d = 1 means reflection.
// Mapping:
//   "1"   → { k: 0, d: 0 }
//   "r"   → { k: 1, d: 0 }
//   "r2"  → { k: 2, d: 0 }
//   "f"   → { k: 0, d: 1 }
//   "rf"  → { k: 1, d: 1 }
//   "r2f" → { k: 2, d: 1 }
const elementToObj = {
  "1":   { k: 0, d: 0 },
  "r":   { k: 1, d: 0 },
  "r2":  { k: 2, d: 0 },
  "f":   { k: 0, d: 1 },
  "rf":  { k: 1, d: 1 },
  "r2f": { k: 2, d: 1 }
};

function composeD3(a, b) {
  const A = elementToObj[a];
  const B = elementToObj[b];
  // The multiplication law: (k₁, d₁)·(k₂, d₂) = (k₁ + (-1)^(d₁)*k₂ mod 3, d₁+d₂ mod 2)
  let k = A.k + (A.d === 0 ? B.k : -B.k);
  k = ((k % 3) + 3) % 3; // ensure nonnegative mod 3
  const d = (A.d + B.d) % 2;
  // Find the corresponding element string.
  for (let key in elementToObj) {
    const val = elementToObj[key];
    if (val.k === k && val.d === d) return key;
  }
  return null; // should not happen
}

function inverseD3(a) {
  // Find b such that a * b = 1.
  for (let candidate in elementToObj) {
    if (composeD3(a, candidate) === "1") return candidate;
  }
  return null;
}

// --- The TriangleGroupDemo Component ---

class TriangleGroupDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  
  connectedCallback() {
    this.render();
    // Set up the interactive group property demonstrations.
    this.setupInteractive();
  }
  
  /**
   * Reset the triangle and its vertex labels.
   */
  resetTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      group.getAnimations().forEach(animation => animation.cancel());
      group.setAttribute("transform", "rotate(0) scale(1)");
    }
    const labels = this.shadowRoot.querySelectorAll('.vertex-label');
    labels.forEach(label => label.removeAttribute('transform'));
  }
  
  /**
   * Animate a rotation from 0° to targetAngle.
   */
  animateRotation(targetAngle, duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    let startTime = null;
    const initialAngle = 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentAngle = initialAngle + progress * (targetAngle - initialAngle);
      group.setAttribute("transform", `rotate(${currentAngle})`);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Counter-rotate the vertex labels.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform", `rotate(-${targetAngle}, ${x}, ${y})`);
        });
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Animate a horizontal flip (reflection) of the triangle.
   */
  animateFlip(duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    let startTime = null;
    const initialScale = 1;
    const targetScale = -1;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentScale = initialScale + progress * (targetScale - initialScale);
      group.setAttribute("transform", `rotate(0) scale(${currentScale}, 1)`);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform",
            `translate(${x}, ${y}) scale(-1,1) translate(${-x}, ${-y})`
          );
        });
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Animate a flip then a rotation (r·f).
   */
  animateFlipThenRotation(targetAngle, flipDuration = 500, rotationDuration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    // Phase 1: Flip
    let startTimeFlip = null;
    const stepFlip = (timestamp) => {
      if (!startTimeFlip) startTimeFlip = timestamp;
      const elapsed = timestamp - startTimeFlip;
      const progress = Math.min(elapsed / flipDuration, 1);
      const currentScale = 1 + progress * (-1 - 1); // = 1 - 2*progress
      group.setAttribute("transform", `rotate(0) scale(${currentScale}, 1)`);
      if (progress < 1) {
        requestAnimationFrame(stepFlip);
      } else {
        // Counter the flip on vertex labels.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform",
            `translate(${x}, ${y}) scale(-1,1) translate(${-x}, ${-y})`
          );
        });
        startRotationPhase();
      }
    };
    const startRotationPhase = () => {
      let startTimeRot = null;
      const stepRotation = (timestamp) => {
        if (!startTimeRot) startTimeRot = timestamp;
        const elapsed = timestamp - startTimeRot;
        const progress = Math.min(elapsed / rotationDuration, 1);
        const currentRotation = progress * targetAngle;
        group.setAttribute("transform", `rotate(${currentRotation}) scale(-1,1)`);
        if (progress < 1) {
          requestAnimationFrame(stepRotation);
        } else {
          const labels = this.shadowRoot.querySelectorAll('.vertex-label');
          labels.forEach(label => {
            const x = label.getAttribute("x");
            const y = label.getAttribute("y");
            label.setAttribute("transform",
              `translate(${x}, ${y}) scale(-1,1) rotate(-${targetAngle}) translate(${-x}, ${-y})`
            );
          });
        }
      };
      requestAnimationFrame(stepRotation);
    };
    requestAnimationFrame(stepFlip);
  }
  
  /**
   * Visual press and release animations.
   */
  raiseTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: "scale(1.2)" }], {
        duration: 150, fill: "forwards", easing: "ease-out"
      });
      group.setAttribute("transform", "scale(1.2)");
    }
  }
  lowerTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: "scale(1)" }], {
        duration: 150, fill: "forwards", easing: "ease-out"
      });
      group.setAttribute("transform", "scale(1)");
    }
  }
  
  /**
   * Set up the interactive sections for the group properties.
   */
  setupInteractive() {
    // Closure
    this.shadowRoot.getElementById('check-closure').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('closure-a').value;
      const b = this.shadowRoot.getElementById('closure-b').value;
      const product = composeD3(a, b);
      this.shadowRoot.getElementById('closure-result').textContent =
        `Result: ${a} · ${b} = ${product}. Closure holds because the result is in D₃.`;
    });
    // Identity: show that 1 · a = a.
    this.shadowRoot.getElementById('check-identity-prop').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('identity-element').value;
      const product = composeD3("1", a);
      this.shadowRoot.getElementById('identity-result-prop').textContent =
        `Result: 1 · ${a} = ${product}. The identity element is 1.`;
    });
    // Associativity: (a · b) · c = a · (b · c)
    this.shadowRoot.getElementById('check-associativity-prop').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('assoc-a').value;
      const b = this.shadowRoot.getElementById('assoc-b').value;
      const c = this.shadowRoot.getElementById('assoc-c').value;
      const left = composeD3(composeD3(a, b), c);
      const right = composeD3(a, composeD3(b, c));
      let msg = `Result: ( ${a} · ${b} ) · ${c} = ${left} and ${a} · ( ${b} · ${c} ) = ${right}. `;
      msg += (left === right) ? "Associativity holds." : "Associativity fails!";
      this.shadowRoot.getElementById('associativity-result-prop').textContent = msg;
    });
    // Inverse: For a, find a⁻¹ so that a · a⁻¹ = 1.
    this.shadowRoot.getElementById('check-inverse-prop').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('inverse-element').value;
      const inv = inverseD3(a);
      const prod = composeD3(a, inv);
      this.shadowRoot.getElementById('inverse-result-prop').textContent =
        `Result: ${a} · (${inv}) = ${prod}. Inverse holds.`;
    });
  }
  
  render() {
    const template = html`
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
      
      <!-- The animated triangle and its transformation buttons -->
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
          @pointerdown="${() => { this.resetTriangle(); this.raiseTriangle(); }}"
          @pointerup="${() => this.lowerTriangle()}"
          @pointercancel="${() => this.lowerTriangle()}">
          1 (Identity)
        </button>
        <button @pointerdown="${() => this.resetTriangle()}" 
                @pointerup="${() => this.animateRotation(120, 500)}" 
                @pointercancel="${() => this.animateRotation(120, 500)}">
          r (Rotate 120°)
        </button>
        <button @pointerdown="${() => this.resetTriangle()}" 
                @pointerup="${() => this.animateRotation(240, 1000)}" 
                @pointercancel="${() => this.animateRotation(240, 1000)}">
          r² (Rotate 240°)
        </button>
        <button @pointerdown="${() => this.resetTriangle()}" 
                @pointerup="${() => this.animateFlip(500)}" 
                @pointercancel="${() => this.animateFlip(500)}">
          f (Reflect)
        </button>
        <button @pointerdown="${() => this.resetTriangle()}" 
                @pointerup="${() => this.animateFlipThenRotation(120, 500, 500)}" 
                @pointercancel="${() => this.animateFlipThenRotation(120, 500, 500)}">
          r·f
        </button>
        <button @pointerdown="${() => this.resetTriangle()}" 
                @pointerup="${() => this.animateFlipThenRotation(240, 500, 1000)}" 
                @pointercancel="${() => this.animateFlipThenRotation(240, 500, 1000)}">
          r²·f
        </button>
      </div>
      
      <!-- Interactive group property sections -->
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
    `;
    render(template, this.shadowRoot);
  }
}

customElements.define("triangle-group-demo", TriangleGroupDemo);
