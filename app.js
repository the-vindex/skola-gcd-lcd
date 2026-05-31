let currentNums = [];
let correctNSD = 0;
let correctNSN = 0;
let solutionVisible = false;
let selectedCount = 2;

const SMOOTH_PRIMES = [2, 3, 5, 7, 11, 13, 17];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isSmooth(n) {
  for (const p of SMOOTH_PRIMES) {
    while (n % p === 0) n = Math.floor(n / p);
  }
  return n === 1;
}

function randomSmooth() {
  let n;
  do { n = randomInt(2, 1000); } while (!isSmooth(n));
  return n;
}

function gcd(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function gcdAll(nums) {
  return nums.reduce((a, b) => gcd(a, b));
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function lcmAll(nums) {
  return nums.reduce((a, b) => lcm(a, b));
}

function primeFactorization(n) {
  const factors = new Map();
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      factors.set(p, (factors.get(p) || 0) + 1);
      n = Math.floor(n / p);
    }
  }
  if (n > 1) factors.set(n, (factors.get(n) || 0) + 1);
  return factors;
}

function buildLadderSteps(n) {
  const steps = [];
  let current = n;
  for (let p = 2; current > 1; ) {
    if (current % p === 0) {
      steps.push([current, p]);
      current = Math.floor(current / p);
    } else {
      p++;
    }
  }
  steps.push([1, null]);
  return steps;
}

function formatFactMap(factMap) {
  return [...factMap.entries()]
    .map(([p, e]) => e === 1 ? String(p) : `${p}<sup>${e}</sup>`)
    .join(' &middot; ');
}

function renderLadder(n) {
  const steps = buildLadderSteps(n);
  const rows = steps.map(([num, div]) =>
    `<tr><td class="lnum">${num}</td><td class="ldiv">${div !== null ? div : ''}</td></tr>`
  ).join('');
  return `<table class="ladder">${rows}</table>`;
}

function renderSolution(nums) {
  const factMaps = nums.map(n => primeFactorization(n));

  const laddersHtml = nums.map(n => renderLadder(n)).join('');

  const factLines = nums.map((n, i) =>
    `<tr>
      <td class="fn">${n}</td>
      <td class="feq">=</td>
      <td class="ff">${formatFactMap(factMaps[i])}</td>
    </tr>`
  ).join('');

  const allPrimes = [...new Set(factMaps.flatMap(m => [...m.keys()]))].sort((a, b) => a - b);

  const nsdParts = [];
  for (const p of allPrimes) {
    const minExp = Math.min(...factMaps.map(m => m.get(p) || 0));
    if (minExp > 0) nsdParts.push([p, minExp]);
  }

  const nsnParts = allPrimes.map(p => [p, Math.max(...factMaps.map(m => m.get(p) || 0))]);

  const fmtParts = parts =>
    parts.map(([p, e]) => e === 1 ? String(p) : `${p}<sup>${e}</sup>`).join(' &middot; ');

  const nsdFormula = nsdParts.length > 0 ? fmtParts(nsdParts) : '1';
  const nsnFormula = fmtParts(nsnParts);

  return `
    <div class="ladders">${laddersHtml}</div>
    <div class="factorizations"><table>${factLines}</table></div>
    <div class="derivation">
      <div class="nsd-line">NSD = ${nsdFormula} = ${correctNSD}</div>
      <div class="nsn-line">NSN = ${nsnFormula} = ${correctNSN}</div>
    </div>
  `;
}

function setCount(n) {
  selectedCount = n;
  document.querySelectorAll('.count-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i + 2 === n);
  });
  newTask();
}

function newTask() {
  currentNums = Array.from({ length: selectedCount }, () => randomSmooth());
  correctNSD = gcdAll(currentNums);
  correctNSN = lcmAll(currentNums);

  document.getElementById('task-numbers').textContent = currentNums.join(', ');
  document.getElementById('input-nsd').value = '';
  document.getElementById('input-nsn').value = '';

  const feedback = document.getElementById('feedback');
  feedback.textContent = '';
  feedback.className = 'feedback';

  const solution = document.getElementById('solution');
  solution.hidden = true;
  solutionVisible = false;
  document.getElementById('btn-solution').textContent = 'Zobrazit řešení';
}

function checkAnswer() {
  const nsdVal = document.getElementById('input-nsd').value.trim();
  const nsnVal = document.getElementById('input-nsn').value.trim();
  if (nsdVal === '' || nsnVal === '') return;

  const nsdInput = parseInt(nsdVal, 10);
  const nsnInput = parseInt(nsnVal, 10);
  const feedback = document.getElementById('feedback');

  if (nsdInput === correctNSD && nsnInput === correctNSN) {
    feedback.textContent = '✓ Správně!';
    feedback.className = 'feedback correct';
  } else {
    feedback.textContent = '✗ Špatně, zkus znovu';
    feedback.className = 'feedback incorrect';
  }
}

function toggleSolution() {
  const solution = document.getElementById('solution');
  const btn = document.getElementById('btn-solution');

  if (!solutionVisible) {
    document.getElementById('solution-content').innerHTML = renderSolution(currentNums);
    solution.hidden = false;
    btn.textContent = 'Skrýt řešení';
    solutionVisible = true;
  } else {
    solution.hidden = true;
    btn.textContent = 'Zobrazit řešení';
    solutionVisible = false;
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') checkAnswer();
});

newTask();
