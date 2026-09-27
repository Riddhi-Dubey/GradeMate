// Test calculation logic and constraints for GradeMate
const assert = require('assert');

console.log('Running GradeMate Calculation & Validation Tests...\n');

// 1. Percentage Simple Mode
function calcPercentageSimple(obtained, total) {
  if (obtained === '' || total === '' || isNaN(obtained) || isNaN(total)) {
    throw new Error('Please enter valid numerical marks.');
  }
  if (obtained < 0 || total <= 0) {
    throw new Error('Marks must be positive, and total marks must be greater than 0.');
  }
  if (obtained > total) {
    throw new Error('Marks obtained cannot exceed maximum marks.');
  }
  return {
    percentage: ((obtained / total) * 100).toFixed(2),
    obtainedStr: `${obtained} / ${total}`
  };
}

const test1 = calcPercentageSimple(392, 500);
console.log('Test 1: Simple percentage (392/500):', test1);
assert.strictEqual(test1.percentage, '78.40');
assert.strictEqual(test1.obtainedStr, '392 / 500');

// Test validation error obtained > total
assert.throws(() => calcPercentageSimple(550, 500), /Marks obtained cannot exceed maximum marks/);
// Test validation negative
assert.throws(() => calcPercentageSimple(-10, 500), /Marks must be positive/);
// Test validation zero total
assert.throws(() => calcPercentageSimple(10, 0), /total marks must be greater than 0/);
console.log('✔ Simple Mode Percentage & Validations Passed!\n');

// 2. Percentage Subject-wise Mode
function calcPercentageSubjectWise(subjects) {
  if (!subjects || subjects.length === 0) throw new Error('Please add at least one subject.');
  let totalObtained = 0;
  let totalMax = 0;
  for (const s of subjects) {
    if (s.obtained < 0 || s.max <= 0) throw new Error('Marks must be positive.');
    if (s.obtained > s.max) throw new Error(`Marks obtained cannot exceed maximum marks for ${s.name}.`);
    totalObtained += s.obtained;
    totalMax += s.max;
  }
  return {
    totalObtained,
    totalMax,
    percentage: ((totalObtained / totalMax) * 100).toFixed(2)
  };
}

const defaultSubjects = [
  { name: 'Mathematics', obtained: 85, max: 100 },
  { name: 'Physics', obtained: 78, max: 100 },
  { name: 'Chemistry', obtained: 82, max: 100 },
  { name: 'English', obtained: 75, max: 100 },
  { name: 'Computer Science', obtained: 92, max: 100 }
];
const test2 = calcPercentageSubjectWise(defaultSubjects);
console.log('Test 2: Subject-wise Percentage:', test2);
assert.strictEqual(test2.totalObtained, 412);
assert.strictEqual(test2.totalMax, 500);
assert.strictEqual(test2.percentage, '82.40');
console.log('✔ Subject-wise Percentage Passed!\n');

// 3. SGPA Calculation: SGPA = Σ(Credit × Grade Point) / Σ(Credits)
function calcSGPA(courses) {
  if (!courses || courses.length === 0) throw new Error('At least one course needed.');
  let totalCredits = 0;
  let totalCreditPoints = 0;
  for (const c of courses) {
    if (c.credits <= 0) throw new Error('Credits must be positive.');
    if (c.gradePoint < 0 || c.gradePoint > 10) throw new Error('Grade point must be 0 to 10.');
    totalCredits += c.credits;
    totalCreditPoints += (c.credits * c.gradePoint);
  }
  return {
    sgpa: (totalCreditPoints / totalCredits).toFixed(2),
    totalCredits,
    totalCreditPoints: totalCreditPoints.toFixed(2)
  };
}

const defaultCourses = [
  { name: 'Mathematics', credits: 4, gradePoint: 8 },
  { name: 'C++', credits: 4, gradePoint: 9 },
  { name: 'Digital Logic', credits: 3, gradePoint: 8 }
];
const test3 = calcSGPA(defaultCourses);
console.log('Test 3: SGPA calculation:', test3);
// 4*8 + 4*9 + 3*8 = 32 + 36 + 24 = 92 / 11 = 8.36
assert.strictEqual(test3.totalCredits, 11);
assert.strictEqual(test3.totalCreditPoints, '92.00');
assert.strictEqual(test3.sgpa, '8.36');
console.log('✔ SGPA Calculation Passed!\n');

// 4. CGPA Calculation: CGPA = Average of entered semester SGPAs
function calcCGPA(semesters) {
  if (!semesters || semesters.length === 0) throw new Error('At least one semester needed.');
  let sum = 0;
  for (const sem of semesters) {
    if (sem.sgpa < 0 || sem.sgpa > 10) throw new Error('SGPA must be 0-10.');
    sum += sem.sgpa;
  }
  const avg = sum / semesters.length;
  return {
    cgpa: avg.toFixed(2),
    semestersCount: semesters.length
  };
}

const defaultSemesters = [
  { name: 'Semester 1', sgpa: 8.2 },
  { name: 'Semester 2', sgpa: 8.5 },
  { name: 'Semester 3', sgpa: 8.7 }
];
const test4 = calcCGPA(defaultSemesters);
console.log('Test 4: CGPA calculation:', test4);
// (8.2 + 8.5 + 8.7) / 3 = 25.4 / 3 = 8.4667 -> 8.47
assert.strictEqual(test4.cgpa, '8.47');
assert.strictEqual(test4.semestersCount, 3);
console.log('✔ CGPA Calculation Passed!\n');

// 5. CGPA to Percentage Conversion: Percentage = CGPA × Multiplier
function convertCgpaToPercentage(cgpa, multiplier = 9.5) {
  if (cgpa < 0 || cgpa > 10) throw new Error('CGPA must be 0-10.');
  if (multiplier <= 0) throw new Error('Multiplier must be > 0.');
  const pct = cgpa * multiplier;
  return {
    percentage: pct.toFixed(2) + '%',
    breakdown: `${cgpa.toFixed(2)} × ${multiplier} = ${pct.toFixed(2)}%`
  };
}

const test5 = convertCgpaToPercentage(8.47, 9.5);
console.log('Test 5: Standard CGPA -> % (8.47 * 9.5):', test5);
// 8.47 * 9.5 = 80.465 -> 80.47%
assert.strictEqual(test5.percentage, '80.47%');

const test5Custom = convertCgpaToPercentage(8.47, 10.0);
console.log('Test 5b: Custom multiplier (8.47 * 10.0):', test5Custom);
assert.strictEqual(test5Custom.percentage, '84.70%');
console.log('✔ CGPA to % Conversion Passed!\n');

console.log('ALL TESTS PASSED WITH 100% ACCURACY! 🎉');
