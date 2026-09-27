/**
 * GradeMate - CGPA Calculator Module
 * Calculates Cumulative Grade Point Average from semester SGPAs
 */

(function () {
  // DOM Elements
  const cgpaTableBody = document.getElementById('cgpa-table-body');
  const addSemesterBtn = document.getElementById('add-semester-btn');
  const cgpaCalcBtn = document.getElementById('cgpa-calc-btn');
  const cgpaResetBtn = document.getElementById('cgpa-reset-btn');
  const cgpaAlert = document.getElementById('cgpa-alert');
  const cgpaAlertMsg = document.getElementById('cgpa-alert-msg');

  // Results DOM
  const cgpaResultValue = document.getElementById('cgpa-result-value');
  const cgpaSemesterCount = document.getElementById('cgpa-semester-count');
  const cgpaAverageSgpa = document.getElementById('cgpa-average-sgpa');
  const cgpaStandingBadge = document.getElementById('cgpa-standing-badge');
  const cgpaGaugeCircle = document.getElementById('cgpa-gauge-circle');
  const cgpaCopyBtn = document.getElementById('cgpa-copy-btn');
  const cgpaSendToConverterBtn = document.getElementById('cgpa-send-to-converter-btn');

  const GAUGE_CIRCUMFERENCE = 439.82;

  // Default Semesters from prompt
  const initialSemesters = [
    { name: 'Semester 1', sgpa: 8.2 },
    { name: 'Semester 2', sgpa: 8.5 },
    { name: 'Semester 3', sgpa: 8.7 }
  ];

  // Helper: Standing on 10-point scale
  function getCgpaStanding(cgpa) {
    if (cgpa >= 9.0) {
      return { text: 'Outstanding (O)', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' };
    } else if (cgpa >= 8.0) {
      return { text: 'First Class with Distinction', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' };
    } else if (cgpa >= 7.0) {
      return { text: 'First Class', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' };
    } else if (cgpa >= 6.0) {
      return { text: 'Second Class (Upper)', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' };
    } else if (cgpa >= 5.0) {
      return { text: 'Second Class (Lower)', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    } else if (cgpa >= 4.0) {
      return { text: 'Pass Class', color: '#b45309', bg: '#fffbeb', border: '#fde68a' };
    } else {
      return { text: 'Fail / Arrear', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
    }
  }

  // Update Radial Gauge (0-10 scale)
  function updateCgpaGauge(cgpa) {
    const clampedCgpa = Math.max(0, Math.min(10, cgpa));
    const offset = GAUGE_CIRCUMFERENCE - (clampedCgpa / 10) * GAUGE_CIRCUMFERENCE;
    if (cgpaGaugeCircle) {
      cgpaGaugeCircle.style.strokeDashoffset = offset;
      if (cgpa >= 8.0) {
        cgpaGaugeCircle.style.stroke = '#2563eb';
      } else if (cgpa >= 7.0) {
        cgpaGaugeCircle.style.stroke = '#4f46e5';
      } else if (cgpa >= 5.0) {
        cgpaGaugeCircle.style.stroke = '#d97706';
      } else {
        cgpaGaugeCircle.style.stroke = '#ef4444';
      }
    }
  }

  // Render Rows
  function renderSemesterRows(semesters) {
    cgpaTableBody.innerHTML = '';
    semesters.forEach((sem, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'table-row-item';
      tr.innerHTML = `
        <td>
          <input type="text" class="table-input sem-name" value="${escapeHTML(sem.name)}" placeholder="Semester ${idx + 1}" />
        </td>
        <td>
          <input type="number" class="table-input sem-sgpa" value="${sem.sgpa !== null ? sem.sgpa : ''}" placeholder="0 - 10" min="0" max="10" step="any" />
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-delete-row" title="Delete semester" aria-label="Delete semester">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      `;

      // Delete listener
      const delBtn = tr.querySelector('.btn-delete-row');
      delBtn.addEventListener('click', () => {
        if (cgpaTableBody.querySelectorAll('tr').length <= 1) {
          window.GradeMateApp?.showToast('You must have at least one semester.');
          return;
        }
        tr.remove();
        updateSemesterDeleteButtons();
        calculateCGPA(false);
      });

      // Clear alert on input
      tr.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          if (cgpaAlert.classList.contains('visible')) {
            cgpaAlert.classList.remove('visible');
          }
        });
      });

      cgpaTableBody.appendChild(tr);
    });
    updateSemesterDeleteButtons();
  }

  function updateSemesterDeleteButtons() {
    const rows = cgpaTableBody.querySelectorAll('tr');
    const deleteBtns = cgpaTableBody.querySelectorAll('.btn-delete-row');
    deleteBtns.forEach(btn => {
      btn.disabled = rows.length <= 1;
    });
  }

  function addSemesterRow() {
    const nextNum = cgpaTableBody.querySelectorAll('tr').length + 1;
    const newSem = { name: `Semester ${nextNum}`, sgpa: '' };
    const current = getCurrentSemesters();
    current.push(newSem);
    renderSemesterRows(current);
    const lastRowInputs = cgpaTableBody.querySelectorAll('tr:last-child input');
    if (lastRowInputs[1]) lastRowInputs[1].focus();
  }

  function getCurrentSemesters() {
    const rows = cgpaTableBody.querySelectorAll('tr');
    const semesters = [];
    rows.forEach((tr, i) => {
      const name = tr.querySelector('.sem-name').value.trim();
      const sgpaRaw = tr.querySelector('.sem-sgpa').value.trim();
      semesters.push({
        name: name || `Semester ${i + 1}`,
        sgpa: sgpaRaw !== '' ? parseFloat(sgpaRaw) : null
      });
    });
    return semesters;
  }

  // ==========================================
  // Calculate CGPA
  // CGPA = Average of entered semester SGPAs
  // ==========================================
  function calculateCGPA(isUserAction = true) {
    cgpaAlert.classList.remove('visible');
    const semesters = getCurrentSemesters();

    if (semesters.length === 0) {
      if (isUserAction) {
        cgpaAlertMsg.textContent = 'Please add at least one semester.';
        cgpaAlert.classList.add('visible');
      }
      return;
    }

    let totalSgpa = 0;
    let hasError = false;
    let errorMsg = '';

    for (let i = 0; i < semesters.length; i++) {
      const sem = semesters[i];
      if (sem.sgpa === null || isNaN(sem.sgpa)) {
        hasError = true;
        errorMsg = `Please enter an SGPA for ${sem.name} (row ${i + 1}).`;
        break;
      }
      if (sem.sgpa < 0 || sem.sgpa > 10) {
        hasError = true;
        errorMsg = `SGPA must be between 0.0 and 10.0 (check ${sem.name}).`;
        break;
      }
      totalSgpa += sem.sgpa;
    }

    if (hasError) {
      if (isUserAction) {
        cgpaAlertMsg.textContent = errorMsg;
        cgpaAlert.classList.add('visible');
      }
      return;
    }

    const count = semesters.length;
    const cgpa = totalSgpa / count;
    const standing = getCgpaStanding(cgpa);

    // Update Result UI
    cgpaResultValue.textContent = cgpa.toFixed(2);
    cgpaSemesterCount.textContent = `${count} ${count === 1 ? 'Semester' : 'Semesters'}`;
    cgpaAverageSgpa.textContent = cgpa.toFixed(2);

    cgpaStandingBadge.textContent = standing.text;
    cgpaStandingBadge.style.color = standing.color;
    cgpaStandingBadge.style.backgroundColor = standing.bg;
    cgpaStandingBadge.style.borderColor = standing.border;

    updateCgpaGauge(cgpa);

    // Auto-update or suggest to converter
    if (window.GradeMateConverter && typeof window.GradeMateConverter.syncFromCGPA === 'function') {
      window.GradeMateConverter.syncFromCGPA(cgpa.toFixed(2));
    }

    if (isUserAction) {
      cgpaResultValue.classList.add('animate-pop');
      setTimeout(() => cgpaResultValue.classList.remove('animate-pop'), 400);
      window.GradeMateApp?.showToast(`CGPA Calculated: ${cgpa.toFixed(2)}`);
    }
  }

  // ==========================================
  // Reset
  // ==========================================
  function resetCGPA() {
    renderSemesterRows(initialSemesters);
    cgpaAlert.classList.remove('visible');
    calculateCGPA(false);
    window.GradeMateApp?.showToast('CGPA calculator reset to default.');
  }

  // Copy Result
  cgpaCopyBtn.addEventListener('click', () => {
    const text = `GradeMate CGPA: ${cgpaResultValue.textContent} (Semesters: ${cgpaSemesterCount.textContent})`;
    window.GradeMateApp?.copyToClipboard(text);
  });

  // Send to Converter & smooth scroll
  if (cgpaSendToConverterBtn) {
    cgpaSendToConverterBtn.addEventListener('click', () => {
      const val = cgpaResultValue.textContent;
      if (window.GradeMateConverter?.syncFromCGPA) {
        window.GradeMateConverter.syncFromCGPA(val);
      }
      const converterSection = document.getElementById('converter-section');
      if (converterSection) {
        converterSection.scrollIntoView({ behavior: 'smooth' });
      }
      window.GradeMateApp?.showToast(`Sent ${val} CGPA to converter!`);
    });
  }

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

  // Listeners
  addSemesterBtn.addEventListener('click', addSemesterRow);
  cgpaCalcBtn.addEventListener('click', () => calculateCGPA(true));
  cgpaResetBtn.addEventListener('click', resetCGPA);

  // Initialize
  renderSemesterRows(initialSemesters);
  calculateCGPA(false);

  window.GradeMateCGPA = {
    calculateCGPA,
    resetCGPA,
    getCurrentCGPA: () => parseFloat(cgpaResultValue.textContent) || 0
  };
})();
