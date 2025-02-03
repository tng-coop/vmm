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
  // Multiplication: (k₁, d₁)·(k₂, d₂) = (k₁ + (-1)^(d₁)*k₂ mod 3, d₁+d₂ mod 2)
  let k = A.k + (A.d === 0 ? B.k : -B.k);
  k = ((k % 3) + 3) % 3;
  const d = (A.d + B.d) % 2;
  for (let key in elementToObj) {
    const val = elementToObj[key];
    if (val.k === k && val.d === d) return key;
  }
  return null;
}

function inverseD3(a) {
  for (let candidate in elementToObj) {
    if (composeD3(a, candidate) === "1") return candidate;
  }
  return null;
}

/**
 * Convert a D₃ element (as a string) to a MathML representation.
 */
function displayD3(elem) {
  switch (elem) {
    case "1":
      return "<mi>1</mi>";
    case "r":
      return "<mi>r</mi>";
    case "r2":
      return "<msup><mi>r</mi><mn>2</mn></msup>";
    case "f":
      return "<mi>f</mi>";
    case "rf":
      return "<mrow><mi>r</mi><mo>&#x22C5;</mo><mi>f</mi></mrow>";
    case "r2f":
      return "<mrow><msup><mi>r</mi><mn>2</mn></msup><mo>&#x22C5;</mo><mi>f</mi></mrow>";
    default:
      return `<mi>${elem}</mi>`;
  }
}

/* 
  For a triangle with vertices (top, right, left) initially labeled ["1", "2", "3"],
  we define the permutation (i.e. the new label ordering) associated with each D₃ element.
  (We assume here that f is the reflection fixing the top vertex.)
*/
const vertexPermutations = {
  "1":   ["1", "2", "3"],
  "r":   ["3", "1", "2"],  // r rotates so that: top becomes old left, right becomes old top, left becomes old right.
  "r2":  ["2", "3", "1"],  // r² rotates so that: top becomes old right, right becomes old left, left becomes old top.
  "f":   ["1", "3", "2"],  // f (reflection) fixes the top and swaps right and left.
  "rf":  ["2", "1", "3"],  // rf = r · f yields: top becomes old right, right becomes old top, left becomes old left? (see below)
  "r2f": ["3", "2", "1"]   // r²f = r² · f yields: top becomes old left, right becomes old right, left becomes old top.
};

// --- The TriangleGroupDemo Component ---
class TriangleGroupDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // currentElement holds the “accumulated” D₃ element (starts with the identity)
    this.currentElement = "1";
  }
  
  connectedCallback() {
    this.render();
    // Set up interactive group property demonstrations.
    this.setupInteractive();
  }
  
  /**
   * Update the text content of the vertex labels based on the current group element.
   */
  updateVertexLabels() {
    const permutation = vertexPermutations[this.currentElement];
    if (!permutation) return;
    const labels = this.shadowRoot.querySelectorAll('.vertex-label');
    if (labels.length >= 3) {
      labels[0].textContent = permutation[0];
      labels[1].textContent = permutation[1];
      labels[2].textContent = permutation[2];
    }
  }
  
  /**
   * Reset the triangle’s transformations and vertex labels.
   */
  resetTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      group.getAnimations().forEach(animation => animation.cancel());
      // Reset the transform to identity.
      group.setAttribute("transform", "rotate(0) scale(1)");
    }
    const labels = this.shadowRoot.querySelectorAll('.vertex-label');
    labels.forEach(label => {
      label.removeAttribute('transform');
      // Reset the label text to the default ordering.
      // (Assuming initial order is "1", "2", "3")
      // You could also reset them directly:
      // label.textContent = (label.getAttribute("data-default") || label.textContent);
    });
  }
  
  /**
   * Reset the demo (animation and “formula”) to the identity.
   */
  resetDemo() {
    this.resetTriangle();
    this.currentElement = "1";
    this.updateVertexLabels();
    const formulaDisplay = this.shadowRoot.getElementById("formula-display");
    if (formulaDisplay) {
      formulaDisplay.innerHTML = `Result: <math><mrow>${displayD3("1")}<mo>=</mo>${displayD3("1")}</mrow></math>`;
    }
  }
  
  /**
   * Update the “formula display” showing the multiplication step:
   * (new transformation) · (current state) = (new state)
   */
  updateFormulaDisplay(factorLeft, factorRight, product) {
    const formulaDisplay = this.shadowRoot.getElementById("formula-display");
    if (formulaDisplay) {
      formulaDisplay.innerHTML =
        `Result: <math><mrow>${displayD3(factorLeft)}<mo>&#x22C5;</mo>${displayD3(factorRight)}<mo>=</mo>${displayD3(product)}</mrow></math>`;
    }
  }
  
  // --- Helpers to read current transform values ---
  
  getCurrentRotation() {
    const group = this.shadowRoot.getElementById("triangle-group");
    const transform = group.getAttribute("transform") || "";
    const match = transform.match(/rotate\(([-\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }
  
  getCurrentScale() {
    const group = this.shadowRoot.getElementById("triangle-group");
    const transform = group.getAttribute("transform") || "";
    const match = transform.match(/scale\(([-\d.]+)/);
    return match ? parseFloat(match[1]) : 1;
  }
  
  /**
   * Animate a rotation relative to the current rotation.
   * The triangle rotates from its current rotation to (current rotation + targetAngle)
   * while preserving the current scale.
   */
  animateRotation(targetAngle, duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    let startTime = null;
    const startAngle = this.getCurrentRotation();
    const finalAngle = startAngle + targetAngle;
    const currentScale = this.getCurrentScale();
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentAngle = startAngle + progress * (finalAngle - startAngle);
      group.setAttribute("transform", `rotate(${currentAngle}) scale(${currentScale}, 1)`);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Adjust vertex labels to counter the rotation.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform", `rotate(-${finalAngle}, ${x}, ${y})`);
        });
        // For a pure rotation, you may also update the vertex labels.
        // (Uncomment the next line if you want rotations to reassign the numbers.)
        // this.updateVertexLabels();
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Animate a horizontal flip (reflection) about a fixed global axis.
   * (The fixed global axis is the vertical line through (0,-100).)
   * This is done by composing the transform:
   *   translate(0, 100) scale(s,1) translate(0, -100) rotate(currentRotation)
   * where s is animated from 1 to -1.
   */
  animateFlip(duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    let startTime = null;
    const startS = 1;
    const targetS = -1;
    const currentRotation = this.getCurrentRotation();
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const s = startS + progress * (targetS - startS);
      // Use fixed global axis by applying flip (translate/scale/translate) first, then the rotation.
      group.setAttribute("transform",
        `translate(0, 100) scale(${s},1) translate(0, -100) rotate(${currentRotation})`
      );
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Adjust vertex labels (for orientation) as before.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform",
            `translate(${x}, ${y}) scale(-1,1) translate(${-x}, ${-y})`
          );
        });
        // Now update the actual text (number) on each vertex based on the new group element.
        this.updateVertexLabels();
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Animate a flip then a rotation.
   * First the triangle flips about the fixed global axis (using the modified composite transform)
   * and then rotates by targetAngle.
   */
  animateFlipThenRotation(targetAngle, flipDuration = 500, rotationDuration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    const initialRotation = this.getCurrentRotation();
    const startS = 1;
    const targetS = -1;
    let startTimeFlip = null;
    const stepFlip = (timestamp) => {
      if (!startTimeFlip) startTimeFlip = timestamp;
      const elapsed = timestamp - startTimeFlip;
      const progress = Math.min(elapsed / flipDuration, 1);
      const s = startS + progress * (targetS - startS);
      // During flip, keep the rotation constant.
      group.setAttribute("transform",
        `translate(0, 100) scale(${s},1) translate(0, -100) rotate(${initialRotation})`
      );
      if (progress < 1) {
        requestAnimationFrame(stepFlip);
      } else {
        // Adjust labels for the flip.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform",
            `translate(${x}, ${y}) scale(-1,1) translate(${-x}, ${-y})`
          );
        });
        // Update vertex numbers after the flip.
        this.updateVertexLabels();
        startRotationPhase();
      }
    };
    const startRotationPhase = () => {
      let startTimeRot = null;
      const finalRotation = initialRotation + targetAngle;
      const stepRotation = (timestamp) => {
        if (!startTimeRot) startTimeRot = timestamp;
        const elapsed = timestamp - startTimeRot;
        const progress = Math.min(elapsed / rotationDuration, 1);
        const currentRotation = initialRotation + progress * (finalRotation - initialRotation);
        // Keep the flipped scale (-1) constant during the rotation phase.
        group.setAttribute("transform",
          `translate(0, 100) scale(${targetS},1) translate(0, -100) rotate(${currentRotation})`
        );
        if (progress < 1) {
          requestAnimationFrame(stepRotation);
        } else {
          const labels = this.shadowRoot.querySelectorAll('.vertex-label');
          labels.forEach(label => {
            const x = label.getAttribute("x");
            const y = label.getAttribute("y");
            label.setAttribute("transform",
              `translate(${x}, ${y}) scale(-1,1) rotate(-${finalRotation}) translate(${-x}, ${-y})`
            );
          });
          // Update the vertex numbers after the composite operation.
          this.updateVertexLabels();
        }
      };
      requestAnimationFrame(stepRotation);
    };
    requestAnimationFrame(stepFlip);
  }
  
  /**
   * Visual “raise” effect.
   * (This scales the triangle up slightly for visual feedback; it does not override the accumulated transform.)
   */
  raiseTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: current + " scale(1.2)" }], {
        duration: 150, fill: "forwards", easing: "ease-out"
      });
    }
  }
  
  /**
   * Visual “lower” effect.
   * (Used with the identity button to give press–release feedback without resetting the accumulated transform.)
   */
  lowerTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: current.replace(/scale\([^)]*\)/, "scale(1)") }], {
        duration: 150, fill: "forwards", easing: "ease-out"
      });
    }
  }
  
  /**
   * Set up the interactive sections for the D₃ group properties.
   * (These remain unchanged from before.)
   */
  setupInteractive() {
    // Closure
    this.shadowRoot.getElementById('check-closure').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('closure-a').value;
      const b = this.shadowRoot.getElementById('closure-b').value;
      const product = composeD3(a, b);
      this.shadowRoot.getElementById('closure-result').innerHTML =
        `Result: <math><mrow>${displayD3(a)}<mo>&#x22C5;</mo>${displayD3(b)}<mo>=</mo>${displayD3(product)}</mrow></math>. Closure holds because the result is in D₃.`;
    });
    // Identity property: 1 · a = a.
    this.shadowRoot.getElementById('check-identity-prop').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('identity-element').value;
      const product = composeD3("1", a);
      this.shadowRoot.getElementById('identity-result-prop').innerHTML =
        `Result: <math><mrow>${displayD3("1")}<mo>&#x22C5;</mo>${displayD3(a)}<mo>=</mo>${displayD3(product)}</mrow></math>. The identity element is 1.`;
    });
    // Associativity: (a · b) · c = a · (b · c)
    this.shadowRoot.getElementById('check-associativity-prop').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('assoc-a').value;
      const b = this.shadowRoot.getElementById('assoc-b').value;
      const c = this.shadowRoot.getElementById('assoc-c').value;
      const left = composeD3(composeD3(a, b), c);
      const right = composeD3(a, composeD3(b, c));
      let msg = `Result: <math><mrow>( ${displayD3(a)}<mo>&#x22C5;</mo>${displayD3(b)} )<mo>&#x22C5;</mo>${displayD3(c)}<mo>=</mo>${displayD3(left)}</mrow></math> and <math><mrow>${displayD3(a)}<mo>&#x22C5;</mo>( ${displayD3(b)}<mo>&#x22C5;</mo>${displayD3(c)} )<mo>=</mo>${displayD3(right)}</mrow></math>. `;
      msg += (left === right) ? "Associativity holds." : "Associativity fails!";
      this.shadowRoot.getElementById('associativity-result-prop').innerHTML = msg;
    });
    // Inverse: a · a⁻¹ = 1.
    this.shadowRoot.getElementById('check-inverse-prop').addEventListener('click', () => {
      const a = this.shadowRoot.getElementById('inverse-element').value;
      const inv = inverseD3(a);
      const prod = composeD3(a, inv);
      this.shadowRoot.getElementById('inverse-result-prop').innerHTML =
        `Result: <math><mrow>${displayD3(a)}<mo>&#x22C5;</mo>${displayD3(inv)}<mo>=</mo><mi>1</mi></mrow></math> Inverse holds.`;
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
      
      <!-- Formula display: shows the “current multiplication” -->
      <div id="formula-display">
        Result: <math><mrow>${displayD3("1")}<mo>=</mo>${displayD3("1")}</mrow></math>
      </div>
      
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
          @pointerdown="${() => this.raiseTriangle()}"
          @pointerup="${() => {
              const trans = '1';
              const newElem = composeD3(trans, this.currentElement);
              this.updateFormulaDisplay(trans, this.currentElement, newElem);
              this.currentElement = newElem;
              this.updateVertexLabels();
              this.lowerTriangle();
          }}"
          @pointercancel="${() => {}}">
          1 (Identity)
        </button>
        <!-- Rotation by 120°: New element = r · (current) -->
        <button 
          @pointerdown="${() => {}}"
          @pointerup="${() => {
              const trans = 'r';
              const newElem = composeD3(trans, this.currentElement);
              this.updateFormulaDisplay(trans, this.currentElement, newElem);
              this.currentElement = newElem;
              this.animateRotation(120, 500);
          }}"
          @pointercancel="${() => this.animateRotation(120, 500)}">
          r (Rotate 120°)
        </button>
        <!-- Rotation by 240° (r²): New element = r² · (current) -->
        <button 
          @pointerdown="${() => {}}"
          @pointerup="${() => {
              const trans = 'r2';
              const newElem = composeD3(trans, this.currentElement);
              this.updateFormulaDisplay(trans, this.currentElement, newElem);
              this.currentElement = newElem;
              this.animateRotation(240, 1000);
          }}"
          @pointercancel="${() => this.animateRotation(240, 1000)}">
          r² (Rotate 240°)
        </button>
        <!-- Reflection: New element = f · (current) -->
        <button 
          @pointerdown="${() => {}}"
          @pointerup="${() => {
              const trans = 'f';
              const newElem = composeD3(trans, this.currentElement);
              this.updateFormulaDisplay(trans, this.currentElement, newElem);
              this.currentElement = newElem;
              this.animateFlip(500);
          }}"
          @pointercancel="${() => this.animateFlip(500)}">
          f (Reflect)
        </button>
        <!-- Reflection then rotation (r · f): New element = (r·f) · (current) -->
        <button 
          @pointerdown="${() => {}}"
          @pointerup="${() => {
              const trans = 'rf';
              const newElem = composeD3(trans, this.currentElement);
              this.updateFormulaDisplay(trans, this.currentElement, newElem);
              this.currentElement = newElem;
              this.animateFlipThenRotation(120, 500, 500);
          }}"
          @pointercancel="${() => this.animateFlipThenRotation(120, 500, 500)}">
          r·f
        </button>
        <!-- Reflection then rotation (r² · f): New element = (r²·f) · (current) -->
        <button 
          @pointerdown="${() => {}}"
          @pointerup="${() => {
              const trans = 'r2f';
              const newElem = composeD3(trans, this.currentElement);
              this.updateFormulaDisplay(trans, this.currentElement, newElem);
              this.currentElement = newElem;
              this.animateFlipThenRotation(240, 500, 1000);
          }}"
          @pointercancel="${() => this.animateFlipThenRotation(240, 500, 1000)}">
          r²·f
        </button>
        <!-- Explicit Reset Button -->
        <button id="reset-button"
          @pointerup="${() => this.resetDemo()}">
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
    `;
    render(template, this.shadowRoot);
  }
}

customElements.define("triangle-group-demo", TriangleGroupDemo);
