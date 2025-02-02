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
    // Get the SVG group element that holds both the triangle and its labels.
    const group = this.shadowRoot.getElementById("triangle-group");
    if (group) {
      const current = group.getAttribute("transform") || "";
      group.animate([{ transform: current }, { transform: transformStr }], {
        duration: 500,
        fill: "forwards",
      });
      group.setAttribute("transform", transformStr);
    }
  }

  render() {
    // Adjust label positions so they appear clearly inside the triangle.
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
          /* Removed border to eliminate the white box border */
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
        <!-- Group containing the triangle and its vertex labels -->
        <g id="triangle-group">
          <!-- Equilateral triangle with vertices at (0,-100), (86.6,50), and (-86.6,50) -->
          <polygon
            points="0,-100 86.6,50 -86.6,50"
            fill="#007BFF"
            stroke="#0056b3"
            stroke-width="3"
          ></polygon>
          <!-- Labels positioned inside the triangle -->
          <text
            x="0"
            y="-40"
            font-size="20"
            text-anchor="middle"
            fill="white"
            dominant-baseline="middle"
          >
            1
          </text>
          <text
            x="40"
            y="20"
            font-size="20"
            text-anchor="middle"
            fill="white"
            dominant-baseline="middle"
          >
            2
          </text>
          <text
            x="-40"
            y="20"
            font-size="20"
            text-anchor="middle"
            fill="white"
            dominant-baseline="middle"
          >
            3
          </text>
        </g>
      </svg>
      <div class="buttons">
        <button @click="${() => this.applyTransformation('')}">
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
        <button
          @click="${() => this.applyTransformation('rotate(120) scale(-1,1)')}"
        >
          r·f
        </button>
        <button
          @click="${() => this.applyTransformation('rotate(240) scale(-1,1)')}"
        >
          r²·f
        </button>
      </div>
    `;
    render(template, this.shadowRoot);
  }
}

customElements.define("triangle-group-demo", TriangleGroupDemo);
