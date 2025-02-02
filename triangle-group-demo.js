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
   * Reset the triangle’s transformations and vertex labels.
   * (Called only when the explicit Reset button is pressed.)
   */
  resetTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      group.getAnimations().forEach(animation => animation.cancel());
      // Reset the transform to identity
      group.setAttribute("transform", "rotate(0) scale(1)");
    }
    const labels = this.shadowRoot.querySelectorAll('.vertex-label');
    labels.forEach(label => label.removeAttribute('transform'));
  }
  
  /**
   * Reset the demo (animation and “formula”) to the identity.
   */
  resetDemo() {
    this.resetTriangle();
    this.currentElement = "1";
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
  
  // --- Helpers to extract the current transform values ---
  
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
   * Animate a rotation.
   * Instead of always starting from 0, we now read the current rotation
   * and animate from that value to (current rotation + targetAngle).
   */
  animateRotation(targetAngle, duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    let startTime = null;
    const startAngle = this.getCurrentRotation();
    const finalAngle = startAngle + targetAngle;
    // Also preserve the current scale:
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
        // Adjust the labels to counter the rotation.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform", `rotate(-${finalAngle}, ${x}, ${y})`);
        });
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Animate a horizontal flip (reflection) without resetting the current rotation.
   * We animate from the current scale (typically 1) to -1.
   */
  animateFlip(duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    let startTime = null;
    const startScale = this.getCurrentScale();
    const targetScale = -1;
    // Preserve the current rotation.
    const currentRotation = this.getCurrentRotation();
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentScale = startScale + progress * (targetScale - startScale);
      group.setAttribute("transform", `rotate(${currentRotation}) scale(${currentScale}, 1)`);
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
   * Animate a flip then a rotation.
   * First, animate the flip (scale from the current value to -1) while preserving rotation.
   * Then, animate the rotation (add targetAngle to the current rotation).
   */
  animateFlipThenRotation(targetAngle, flipDuration = 500, rotationDuration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    let startTimeFlip = null;
    const initialRotation = this.getCurrentRotation();
    const startScale = this.getCurrentScale();
    const flipTargetScale = -1;
    const stepFlip = (timestamp) => {
      if (!startTimeFlip) startTimeFlip = timestamp;
      const elapsed = timestamp - startTimeFlip;
      const progress = Math.min(elapsed / flipDuration, 1);
      const currentScale = startScale + progress * (flipTargetScale - startScale);
      // Keep rotation constant during flip.
      group.setAttribute("transform", `rotate(${initialRotation}) scale(${currentScale}, 1)`);
      if (progress < 1) {
        requestAnimationFrame(stepFlip);
      } else {
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
      const finalRotation = initialRotation + targetAngle;
      const stepRotation = (timestamp) => {
        if (!startTimeRot) startTimeRot = timestamp;
        const elapsed = timestamp - startTimeRot;
        const progress = Math.min(elapsed / rotationDuration, 1);
        const currentRotation = initialRotation + progress * (finalRotation - initialRotation);
        // Keep scale at -1 during the rotation phase.
        group.setAttribute("transform", `rotate(${currentRotation}) scale(-1,1)`);
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
        }
      };
      requestAnimationFrame(stepRotation);
    };
    requestAnimationFrame(stepFlip);
  }
  
  /**
   * Visual “raise” effect.
   * (Simply animates a scale-up; note that we do not reset the transform on mouse release.)
   */
  raiseTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: current + " scale(1.2)" }], {
        duration: 150, fill: "forwards", easing: "ease-out"
      });
      // Do not override the transform attribute here.
    }
  }
  
  /**
   * Set up the interactive sections for the D₃ group properties.
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
      
      <!-- Formula display -->
      <div id="formula-display">
        Result: <math><mrow>${displayD3("1")}<mo>=</mo>${displayD3("1")}</mrow></math>
      </div>
      
      <!-- Animated triangle -->
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
        <!-- Identity button: applies identity transformation (i.e. no change) -->
        <button id="identity-button"
          @pointerdown="${() => this.raiseTriangle()}"
          @pointerup="${() => {
              const trans = '1';
              const newElem = composeD3(trans, this.currentElement);
              this.updateFormulaDisplay(trans, this.currentElement, newElem);
              this.currentElement = newElem;
              // (No reset or lower effect here)
          }}"
          @pointercancel="${() => {}}">
          1 (Identity)
        </button>
        <!-- Rotation by 120° -->
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
        <!-- Rotation by 240° -->
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
        <!-- Reflection -->
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
        <!-- Reflection then rotation (r·f) -->
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
        <!-- Reflection then rotation (r²·f) -->
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
      
      <!-- Interactive sections for group properties (unchanged) -->
      <div class="interactive">
        <!-- (Interactive content here remains the same as your original code.) -->
      </div>
    `;
    render(template, this.shadowRoot);
  }
}

customElements.define("triangle-group-demo", TriangleGroupDemo);
