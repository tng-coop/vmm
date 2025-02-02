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
      // Cancel any ongoing animations on the group.
      group.getAnimations().forEach(animation => animation.cancel());
      // Reset the transform attribute to the identity (no rotation, no scale).
      group.setAttribute("transform", "rotate(0) scale(1)");
    }
    // Remove any counter-rotation from the vertex labels.
    const labels = this.shadowRoot.querySelectorAll('.vertex-label');
    labels.forEach(label => label.removeAttribute('transform'));
  }
  
  /**
   * Manually animate rotation using requestAnimationFrame.
   * This function updates the triangle's rotation at roughly 60 fps.
   *
   * @param {number} targetAngle - The final rotation angle (in degrees).
   * @param {number} duration - The duration of the animation in milliseconds.
   */
  animateRotation(targetAngle, duration = 500) {
    const group = this.shadowRoot.getElementById("triangle-group");
    if (!group) return;
    
    let startTime = null;
    // Because resetTriangle() sets rotation to 0, we assume an initial angle of 0.
    const initialAngle = 0; 

    // The animation loop:
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      // Compute progress (clamped between 0 and 1)
      const progress = Math.min(elapsed / duration, 1);
      // Linear interpolation between initialAngle and targetAngle.
      const currentAngle = initialAngle + progress * (targetAngle - initialAngle);
      
      // Apply the current rotation to the whole group.
      group.setAttribute("transform", `rotate(${currentAngle})`);
      
      // Continue the animation until progress reaches 1.
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Animation complete.
        // For each vertex label, apply a counter rotation so that it remains upright.
        const labels = this.shadowRoot.querySelectorAll('.vertex-label');
        labels.forEach(label => {
          // Get the label’s own x and y coordinates.
          const x = label.getAttribute("x");
          const y = label.getAttribute("y");
          // Rotate the label by the negative of the final angle about its (x,y) center.
          label.setAttribute("transform", `rotate(-${targetAngle}, ${x}, ${y})`);
        });
      }
    };
    requestAnimationFrame(step);
  }
  
  // Existing method for the other buttons (f, r·f, r²·f, etc.)
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
        <!-- Group containing the triangle, embedded cat icon, and vertex labels -->
        <g id="triangle-group">
          <!-- Equilateral triangle with vertices at (0,-100), (86.6,50), and (-86.6,50) -->
          <polygon points="0,-100 86.6,50 -86.6,50" fill="#007BFF" stroke="#0056b3" stroke-width="3"></polygon>
          <!-- Embed the cat-icon in the center of the triangle -->
          <text x="0" y="10" font-size="36" text-anchor="middle" fill="white">🐱</text>
          <!-- Vertex labels positioned inside the triangle (added class "vertex-label") -->
          <text class="vertex-label" x="0" y="-60" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">1</text>
          <text class="vertex-label" x="50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">2</text>
          <text class="vertex-label" x="-50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">3</text>
        </g>
      </svg>
      <div class="buttons">
        <!-- Identity button with press-and-hold behavior -->
        <button id="identity-button"
          @pointerdown="${() => this.raiseTriangle()}"
          @pointerup="${() => this.lowerTriangle()}"
          @pointercancel="${() => this.lowerTriangle()}">
          1 (Identity)
        </button>
        <!-- r button: pointerdown resets, pointerup animates rotation of 120° in 500ms -->
        <button 
          @pointerdown="${() => this.resetTriangle()}"
          @pointerup="${() => this.animateRotation(120, 500)}"
          @pointercancel="${() => this.animateRotation(120, 500)}">
          r (Rotate 120°)
        </button>
        <!-- r² button: pointerdown resets, pointerup animates rotation of 240° in 1000ms -->
        <button 
          @pointerdown="${() => this.resetTriangle()}"
          @pointerup="${() => this.animateRotation(240, 1000)}"
          @pointercancel="${() => this.animateRotation(240, 1000)}">
          r² (Rotate 240°)
        </button>
        <button @click="${() => this.applyTransformation('scale(-1,1)')}">
          f (Reflect)
        </button>
        <button @click="${() => this.applyTransformation('rotate(120) scale(-1,1)')}">
          r·f
        </button>
        <button @click="${() => this.applyTransformation('rotate(240) scale(-1,1)')}">
          r²·f
        </button>
      </div>
    `;
    render(template, this.shadowRoot);
  }
}

customElements.define("triangle-group-demo", TriangleGroupDemo);
