import { html, render } from "lit";

class TriangleGroupDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  
  connectedCallback() {
    this.render();
  }
  
  /**
   * Immediately reset the triangle to its identity state.
   */
  resetTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      // Cancel any ongoing animations.
      group.getAnimations().forEach(animation => animation.cancel());
      // Reset the group's transform.
      group.setAttribute("transform", "rotate(0) scale(1)");
    }
    // Remove any transform from the vertex labels.
    const labels = this.shadowRoot.querySelectorAll('.vertex-label');
    labels.forEach(label => label.removeAttribute('transform'));
  }
  
  /**
   * Animate a rotation from 0° to targetAngle over the given duration.
   * At the end, counter-rotate each vertex label so that it remains upright.
   *
   * @param {number} targetAngle - The final rotation angle (in degrees).
   * @param {number} duration - Animation duration in milliseconds.
   */
  animateRotation(targetAngle, duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    
    let startTime = null;
    const initialAngle = 0; 

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentAngle = initialAngle + progress * (targetAngle - initialAngle);
      
      group.setAttribute("transform", `rotate(${currentAngle})`);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Once rotation completes, for a pure rotation we can cancel it by:
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          // For a pure rotation the inverse is simple.
          label.setAttribute("transform", `rotate(-${targetAngle}, ${x}, ${y})`);
        });
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Animate a horizontal flip (reflection) of the triangle.
   * This interpolates the group's x‑scale from 1 to –1 over the given duration.
   * When complete, sets each vertex label's transform to counter the flip.
   *
   * @param {number} duration - Animation duration in milliseconds.
   */
  animateFlip(duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    
    let startTime = null;
    const initialScale = 1;
    const targetScale = -1;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentScale = initialScale + progress * (targetScale - initialScale); // = 1 - 2*progress
      
      // No rotation in the flip phase.
      group.setAttribute("transform", `rotate(0) scale(${currentScale}, 1)`);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Flip phase complete.
        // For a pure flip the proper inverse about each label's center is:
        //    translate(x,y) scale(-1,1) translate(-x,-y)
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform", `translate(${x}, ${y}) scale(-1,1) translate(${-x}, ${-y})`);
        });
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Sequentially animate the r·f transformation by:
   *   1. Animating a horizontal flip (f) from identity to scale(-1,1) over flipDuration.
   *      When complete, counter the flip on the vertex labels.
   *   2. Then animating a rotation (r) from 0° to targetAngle over rotationDuration.
   *      When complete, counter the rotation on the vertex labels.
   *
   * This realizes the product: first f, then r.
   *
   * At the end, each vertex label is given the transform:
   *    translate(x,y) scale(-1,1) rotate(-targetAngle) translate(-x,-y)
   * which exactly cancels the parent's combined transform
   *    rotate(targetAngle) scale(-1,1)
   * so the letters appear upright.
   *
   * @param {number} targetAngle - The final rotation angle (in degrees).
   * @param {number} flipDuration - Duration for the flip phase in milliseconds.
   * @param {number} rotationDuration - Duration for the rotation phase in milliseconds.
   */
  animateFlipThenRotation(targetAngle, flipDuration = 500, rotationDuration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    
    // --- Phase 1: Animate Flip ---
    let startTimeFlip = null;
    const stepFlip = (timestamp) => {
      if (!startTimeFlip) startTimeFlip = timestamp;
      const elapsed = timestamp - startTimeFlip;
      const progress = Math.min(elapsed / flipDuration, 1);
      const currentScale = 1 + progress * (-1 - 1); // = 1 - 2*progress
      
      // No rotation in the flip phase.
      group.setAttribute("transform", `rotate(0) scale(${currentScale}, 1)`);
      
      if (progress < 1) {
        requestAnimationFrame(stepFlip);
      } else {
        // Flip phase complete.
        // For each label, cancel the parent's flip about its own center.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          label.setAttribute("transform", `translate(${x}, ${y}) scale(-1,1) translate(${-x}, ${-y})`);
        });
        // Begin the rotation phase.
        startRotationPhase();
      }
    };
    
    // --- Phase 2: Animate Rotation ---
    const startRotationPhase = () => {
      let startTimeRot = null;
      const stepRotation = (timestamp) => {
        if (!startTimeRot) startTimeRot = timestamp;
        const elapsed = timestamp - startTimeRot;
        const progress = Math.min(elapsed / rotationDuration, 1);
        const currentRotation = progress * targetAngle;
        
        // The group already carries the flip (scale(-1,1)) from phase 1.
        group.setAttribute("transform", `rotate(${currentRotation}) scale(-1,1)`);
        
        if (progress < 1) {
          requestAnimationFrame(stepRotation);
        } else {
          // Rotation phase complete.
          // The parent's transform is now: rotate(targetAngle) scale(-1,1)
          // To cancel it, for each vertex label we apply the inverse transformation:
          //    translate(x,y) scale(-1,1) rotate(-targetAngle) translate(-x,-y)
          const labels = this.shadowRoot.querySelectorAll('.vertex-label');
          labels.forEach(label => {
            const x = label.getAttribute("x");
            const y = label.getAttribute("y");
            label.setAttribute(
              "transform",
              `translate(${x}, ${y}) scale(-1,1) rotate(-${targetAngle}) translate(${-x}, ${-y})`
            );
          });
        }
      };
      requestAnimationFrame(stepRotation);
    };
    
    requestAnimationFrame(stepFlip);
  }
  
  // For other buttons (r², r²·f, etc.) we continue to use the existing transformation.
  applyTransformation(transformStr) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: transformStr }], {
        duration: 500,
        fill: "forwards",
        easing: "ease-out"
      });
      group.setAttribute("transform", transformStr);
    }
  }
  
  raiseTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: "scale(1.2)" }], {
        duration: 150,
        fill: "forwards",
        easing: "ease-out"
      });
      group.setAttribute("transform", "scale(1.2)");
    }
  }
  
  lowerTriangle() {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: "scale(1)" }], {
        duration: 150,
        fill: "forwards",
        easing: "ease-out"
      });
      group.setAttribute("transform", "scale(1)");
    }
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
          margin: 0 auto;
        }
        .buttons {
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
      </style>
      <h1>Triangle Group Demonstration (Dihedral Group D₃)</h1>
      <p class="math">
        The symmetries of an equilateral triangle:
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mrow>
            <mi>D</mi><mn>3</mn> = { 1, r, r², f, r·f, r²·f }
          </mrow>
        </math>
      </p>
      <svg id="triangle-svg" width="300" height="300" viewBox="-150 -150 300 300">
        <!-- Group containing the triangle, cat icon, and vertex labels -->
        <g id="triangle-group">
          <!-- Equilateral triangle -->
          <polygon points="0,-100 86.6,50 -86.6,50" fill="#007BFF" stroke="#0056b3" stroke-width="3"></polygon>
          <!-- Cat icon in the center -->
          <text x="0" y="10" font-size="36" text-anchor="middle" fill="white">🐱</text>
          <!-- Vertex labels (with class "vertex-label") -->
          <text class="vertex-label" x="0" y="-60" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">1</text>
          <text class="vertex-label" x="50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">2</text>
          <text class="vertex-label" x="-50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">3</text>
        </g>
      </svg>
      <div class="buttons">
        <!-- Identity (no transformation) -->
        <button id="identity-button"
          @pointerdown="${() => this.raiseTriangle()}"
          @pointerup="${() => this.lowerTriangle()}"
          @pointercancel="${() => this.lowerTriangle()}">
          1 (Identity)
        </button>
        <!-- r: rotate 120° over 500ms -->
        <button 
          @pointerdown="${() => this.resetTriangle()}"
          @pointerup="${() => this.animateRotation(120, 500)}"
          @pointercancel="${() => this.animateRotation(120, 500)}">
          r (Rotate 120°)
        </button>
        <!-- r²: rotate 240° over 1000ms -->
        <button 
          @pointerdown="${() => this.resetTriangle()}"
          @pointerup="${() => this.animateRotation(240, 1000)}"
          @pointercancel="${() => this.animateRotation(240, 1000)}">
          r² (Rotate 240°)
        </button>
        <!-- f: horizontal flip over 500ms -->
        <button 
          @pointerdown="${() => this.resetTriangle()}"
          @pointerup="${() => this.animateFlip(500)}"
          @pointercancel="${() => this.animateFlip(500)}">
          f (Reflect)
        </button>
        <!-- r·f: perform f then r sequentially (flip then rotate) -->
        <button 
          @pointerdown="${() => this.resetTriangle()}"
          @pointerup="${() => this.animateFlipThenRotation(120, 500, 500)}"
          @pointercancel="${() => this.animateFlipThenRotation(120, 500, 500)}">
          r·f
        </button>
        <!-- r²·f remains using the existing transformation method -->
        <button @click="${() => this.applyTransformation('rotate(240) scale(-1,1)')}">
          r²·f
        </button>
      </div>
    `;
    render(template, this.shadowRoot);
  }
}

customElements.define("triangle-group-demo", TriangleGroupDemo);
