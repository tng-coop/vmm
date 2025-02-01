// Closure: For any two integers a and b, a + b is an integer.
document.getElementById('check-closure').addEventListener('click', function() {
    const a = parseInt(document.getElementById('closure-a').value, 10);
    const b = parseInt(document.getElementById('closure-b').value, 10);
    if (isNaN(a) || isNaN(b)) {
      document.getElementById('closure-result').textContent = "Please enter valid integers for a and b.";
      return;
    }
    const sum = a + b;
    document.getElementById('closure-result').textContent = `Result: ${a} + ${b} = ${sum}. Closure holds because the sum is an integer.`;
  });
  
  // Identity: For any integer a, a + 0 = a.
  document.getElementById('check-identity').addEventListener('click', function() {
    const a = parseInt(document.getElementById('identity-a').value, 10);
    if (isNaN(a)) {
      document.getElementById('identity-result').textContent = "Please enter a valid integer for a.";
      return;
    }
    const result = a + 0;
    document.getElementById('identity-result').textContent = `Result: ${a} + 0 = ${result}. The identity element in (ℤ, +) is 0.`;
  });
  
  // Associativity: For any three integers a, b, and c, (a + b) + c = a + (b + c).
  document.getElementById('check-associativity').addEventListener('click', function() {
    const a = parseInt(document.getElementById('assoc-a').value, 10);
    const b = parseInt(document.getElementById('assoc-b').value, 10);
    const c = parseInt(document.getElementById('assoc-c').value, 10);
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      document.getElementById('associativity-result').textContent = "Please enter valid integers for a, b, and c.";
      return;
    }
    const left = (a + b) + c;
    const right = a + (b + c);
    let message = `Result: ( ${a} + ${b} ) + ${c} = ${left} and ${a} + ( ${b} + ${c} ) = ${right}. `;
    message += (left === right) ? "Associativity holds." : "Associativity does not hold!";
    document.getElementById('associativity-result').textContent = message;
  });
  
  // Inverse: For any integer a, there exists an inverse –a such that a + (–a) = 0.
  document.getElementById('check-inverse').addEventListener('click', function() {
    const a = parseInt(document.getElementById('inverse-a').value, 10);
    if (isNaN(a)) {
      document.getElementById('inverse-result').textContent = "Please enter a valid integer for a.";
      return;
    }
    const inverse = -a;
    const sum = a + inverse;
    document.getElementById('inverse-result').textContent = `Result: ${a} + (${inverse}) = ${sum}. Every integer a has an inverse (–a) such that a + (–a) = 0.`;
  });
  