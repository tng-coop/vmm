import { html, render } from "lit";

class TriangleGroupDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  
  connectedCallback() {
    this.render();
  }
  
  applyTransformation(transformStr) {
    // This method is used for the other buttons (r, r², f, r·f, r²·f)
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
    // Enlarge the triangle to 1.2x size (simulate "raised by hand")
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
    // Return the triangle to its normal size (scale(1))
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
    // The cat icon is embedded in the middle of the triangle.
    // The triangle's centroid is (0,0) so we position a foreignObject with x="-40", y="-40" and size 80x80.
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
          <!-- Embed the cat-icon in the center of the triangle using a foreignObject -->
          <text x="0" y="10" font-size="36" text-anchor="middle" fill="white">🐱</text>
          <!-- Vertex labels positioned inside the triangle -->
          <text x="0" y="-60" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">1</text>
          <text x="50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">2</text>
          <text x="-50" y="30" font-size="20" text-anchor="middle" fill="white" dominant-baseline="middle">3</text>
        </g>
      </svg>
      <div class="buttons">
        <!-- Identity button now uses pointer events for press-and-hold behavior -->
        <button id="identity-button"
          @pointerdown="${() => this.raiseTriangle()}"
          @pointerup="${() => this.lowerTriangle()}"
          @pointercancel="${() => this.lowerTriangle()}">
          1 (Identity)
        </button>
        <button @click="${() => this.applyTransformation('rotate(120)')}">
          r (Rotate 120°)
        </button>
        <button @click="${() => this.applyTransformation('rotate(240)')}">
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
