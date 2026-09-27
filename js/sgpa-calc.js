/**
 * GradeMate - SGPA Calculator Module
 * Calculates Semester Grade Point Average from credits & grade points (0-10 scale)
 */

(function () {
  // DOM Elements
  const sgpaTableBody = document.getElementById('sgpa-table-body');
  const addSgpaRowBtn = document.getElementById('add-sgpa-row-btn');
  const sgpaCalcBtn = document.getElementById('sgpa-calc-btn');
  const sgpaResetBtn = document.getElementById('sgpa-reset-btn');
  const sgpaAlert = document.getElementById('sgpa-alert');
  const sgpaAlertMsg = document.getElementById('sgpa-alert-msg');

  // Results DOM
  const sgpaResultValue = document.getElementById('sgpa-result-value');
  const sgpaTotalCredits = document.getElementById('sgpa-total-credits');
  const sgpaTotalPoints = document.getElementById('sgpa-total-points');
  const sgpaStandingBadge = document.getElementById('sgpa-standing-badge');
  const sgpaGaugeCircle = document.getElementById('sgpa-gauge-circle');
  const sgpaCopyBtn = document.getElementById('sgpa-copy-btn');

  const GAUGE_CIRCUMFERENCE = 439.82;

  // Default Course Data from prompt
  const initialSgpaCourses = [
    { name: 'Mathematics', credits: 4, gradePoint: 8 },
    { name: 'C++', credits: 4, gradePoint: 9 },
    { name: 'Digital Logic', credits: 3, gradePoint: 8 }
  ];

  // ==========================================
  // Helper: Grade Category on 10-point scale
  // ==========================================
  function getSgpaStanding(sgpa) {
    if (sgpa >= 9.0) {
      return { text: 'Outstanding (O)', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' };
    } else if (sgpa >= 8.0) {
      return { text: 'Excellent (A+)', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' };
    } else if (sgpa >= 7.0) {
      return { text: 'Very Good (A)', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' };
    } else if (sgpa >= 6.0) {
      return { text: 'Good (B+)', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' };
    } else if (sgpa >= 5.0) {
      return { text: 'Above Average (B)', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    } else if (sgpa >= 4.0) {
      return { text: 'Pass (P)', color: '#b45309', bg: '#fffbeb', border: '#fde68a' };
    } else {
      return { text: 'Re-appear (F)', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
    }
  }

  // ==========================================
  // Gauge Updater (0 - 10 scale)
  // ==========================================
  function updateSgpaGauge(sgpa) {
    const clampedSgpa = Math.max(0, Math.min(10, sgpa));
    const offset = GAUGE_CIRCUMFERENCE - (clampedSgpa / 10) * GAUGE_CIRCUMFERENCE;
    if (sgpaGaugeCircle) {
      sgpaGaugeCircle.style.strokeDashoffset = offset;
      if (sgpa >= 8.0) {
        sgpaGaugeCircle.style.stroke = '#7c3aed';
      } else if (sgpa >= 7.0) {
        sgpaGaugeCircle.style.stroke = '#4f46e5';
      } else if (sgpa >= 5.0) {
        sgpaGaugeCircle.style.stroke = '#d97706';
      } else {
        sgpaGaugeCircle.style.stroke = '#ef4444';
      }
    }
  }

  // ==========================================
  // Render SGPA Table Rows
  // ==========================================
  function renderSgpaRows(courses) {
    sgpaTableBody.innerHTML = '';
    courses.forEach((course, index) => {
      const tr = document.createElement('tr');
      tr.className = 'table-row-item';
      tr.innerHTML = `
        <td>
          <input type="text" class="table-input course-name" value="${escapeHTML(course.name)}" placeholder="Course ${index + 1}" />
        </td>
        <td>
          <input type="number" class="table-input course-credits" value="${course.credits !== null ? course.credits : ''}" placeholder="3" min="0.5" max="30" step="any" />
        </td>
        <td>
          <input type="number" class="table-input course-gp" value="${course.gradePoint !== null ? course.gradePoint : ''}" placeholder="0-10" min="0" max="10" step="any" />
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-delete-row" title="Delete course" aria-label="Delete course">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      `;

      // Delete listener
      const delBtn = tr.querySelector('.btn-delete-row');
      delBtn.addEventListener('click', () => {
        if (sgpaTableBody.querySelectorAll('tr').length <= 1) {
          window.GradeMateApp?.showToast('You must have at least one course.');
          return;
        }
        tr.remove();
        updateSgpaDeleteButtons();
        calculateSGPA(false);
      });

      // Clear alert on user typing
      tr.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          if (sgpaAlert.classList.contains('visible')) {
            sgpaAlert.classList.remove('visible');
          }
        });
      });

      sgpaTableBody.appendChild(tr);
    });
    updateSgpaDeleteButtons();
  }

  function updateSgpaDeleteButtons() {
    const rows = sgpaTableBody.querySelectorAll('tr');
    const deleteBtns = sgpaTableBody.querySelectorAll('.btn-delete-row');
    deleteBtns.forEach(btn => {
      btn.disabled = rows.length <= 1;
    });
  }

  function addSgpaRow() {
    const currentCount = sgpaTableBody.querySelectorAll('tr').length + 1;
    const newCourse = { name: `Subject ${currentCount}`, credits: '', gradePoint: '' };
    const current = getCurrentCourses();
    current.push(newCourse);
    renderSgpaRows(current);
    const lastRowInputs = sgpaTableBody.querySelectorAll('tr:last-child input');
    if (lastRowInputs[0]) lastRowInputs[0].focus();
  }

  function getCurrentCourses() {
    const rows = sgpaTableBody.querySelectorAll('tr');
    const courses = [];
    rows.forEach(tr => {
      const name = tr.querySelector('.course-name').value.trim();
      const creditsRaw = tr.querySelector('.course-credits').value.trim();
      const gpRaw = tr.querySelector('.course-gp').value.trim();
      courses.push({
        name: name || 'Course',
        credits: creditsRaw !== '' ? parseFloat(creditsRaw) : null,
        gradePoint: gpRaw !== '' ? parseFloat(gpRaw) : null
      });
    });
    return courses;
  }

  // ==========================================
  // Calculate SGPA
  // SGPA = Σ(Credit × Grade Point) / Σ(Credits)
  // ==========================================
  function calculateSGPA(isUserAction = true) {
    sgpaAlert.classList.remove('visible');
    const courses = getCurrentCourses();

    if (courses.length === 0) {
      if (isUserAction) {
        sgpaAlertMsg.textContent = 'Please add at least one subject.';
        sgpaAlert.classList.add('visible');
      }
      return;
    }

    let totalCredits = 0;
    let totalCreditPoints = 0;
    let hasError = false;
    let errorMsg = '';

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      if (c.credits === null || c.gradePoint === null || isNaN(c.credits) || isNaN(c.gradePoint)) {
        hasError = true;
        errorMsg = `Please enter valid credits and grade points for row ${i + 1}.`;
        break;
      }

      if (c.credits <= 0) {
        hasError = true;
        errorMsg = `Credits must be a positive number greater than 0 (row ${i + 1}).`;
        break;
      }

      if (c.gradePoint < 0 || c.gradePoint > 10) {
        hasError = true;
        errorMsg = `Grade point must be between 0 and 10 on the 10-point scale (row ${i + 1}).`;
        break;
      }

      totalCredits += c.credits;
      totalCreditPoints += (c.credits * c.gradePoint);
    }

    if (hasError) {
      if (isUserAction) {
        sgpaAlertMsg.textContent = errorMsg;
        sgpaAlert.classList.add('visible');
      }
      return;
    }

    if (totalCredits <= 0) {
      sgpaAlertMsg.textContent = 'Total credits must be greater than zero.';
      sgpaAlert.classList.add('visible');
      return;
    }

    const sgpa = totalCreditPoints / totalCredits;
    const standing = getSgpaStanding(sgpa);

    // Update UI elements
    sgpaResultValue.textContent = sgpa.toFixed(2);
    sgpaTotalCredits.textContent = totalCredits % 1 === 0 ? totalCredits : totalCredits.toFixed(1);
    sgpaTotalPoints.textContent = totalCreditPoints.toFixed(2);

    sgpaStandingBadge.textContent = standing.text;
    sgpaStandingBadge.style.color = standing.color;
    sgpaStandingBadge.style.backgroundColor = standing.bg;
    sgpaStandingBadge.style.borderColor = standing.border;

    updateSgpaGauge(sgpa);

    if (isUserAction) {
      sgpaResultValue.classList.add('animate-pop');
      setTimeout(() => sgpaResultValue.classList.remove('animate-pop'), 400);
      window.GradeMateApp?.showToast(`SGPA Calculated: ${sgpa.toFixed(2)}`);
    }
  }

  // ==========================================
  // Reset
  // ==========================================
  function resetSGPA() {
    renderSgpaRows(initialSgpaCourses);
    sgpaAlert.classList.remove('visible');
    calculateSGPA(false);
    window.GradeMateApp?.showToast('SGPA calculator reset to default.');
  }

  // Copy Result
  sgpaCopyBtn.addEventListener('click', () => {
    const text = `GradeMate SGPA: ${sgpaResultValue.textContent} (Total Credits: ${sgpaTotalCredits.textContent}, Credit Points: ${sgpaTotalPoints.textContent})`;
    window.GradeMateApp?.copyToClipboard(text);
  });

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Event Listeners
  addSgpaRowBtn.addEventListener('click', addSgpaRow);
  sgpaCalcBtn.addEventListener('click', () => calculateSGPA(true));
  sgpaResetBtn.addEventListener('click', resetSGPA);

  // Initialize
  renderSgpaRows(initialSgpaCourses);
  calculateSGPA(false);

  window.GradeMateSGPA = {
    calculateSGPA,
    resetSGPA
  };
})();
