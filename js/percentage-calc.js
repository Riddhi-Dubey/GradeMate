/**
 * GradeMate - Percentage Calculator Module
 * Handles Simple Mode & Subject-wise Mode calculations
 */

(function () {
  // DOM Elements - Modes
  const modeSimpleBtn = document.getElementById('mode-simple-btn');
  const modeSubjectBtn = document.getElementById('mode-subject-btn');
  const simpleModeContainer = document.getElementById('simple-mode-container');
  const subjectModeContainer = document.getElementById('subject-mode-container');

  // Simple Mode Inputs
  const simpleObtainedInput = document.getElementById('simple-obtained');
  const simpleTotalInput = document.getElementById('simple-total');
  const simpleCalcBtn = document.getElementById('simple-calc-btn');
  const simpleResetBtn = document.getElementById('simple-reset-btn');
  const simpleAlert = document.getElementById('simple-alert');
  const simpleAlertMsg = document.getElementById('simple-alert-msg');

  // Simple Mode Results
  const pctResultValue = document.getElementById('pct-result-value');
  const pctObtainedValue = document.getElementById('pct-obtained-value');
  const pctLostValue = document.getElementById('pct-lost-value');
  const pctStandingBadge = document.getElementById('pct-standing-badge');
  const pctGaugeCircle = document.getElementById('pct-gauge-circle');
  const pctCopyBtn = document.getElementById('pct-copy-btn');

  // Subject-wise Elements
  const subjectsTableBody = document.getElementById('subjects-table-body');
  const addSubjectBtn = document.getElementById('add-subject-btn');
  const subjectCalcBtn = document.getElementById('subject-calc-btn');
  const subjectResetBtn = document.getElementById('subject-reset-btn');
  const subjectAlert = document.getElementById('subject-alert');
  const subjectAlertMsg = document.getElementById('subject-alert-msg');

  // Gauge circumference: 2 * PI * r = 2 * PI * 70 ≈ 439.82
  const GAUGE_CIRCUMFERENCE = 439.82;

  let currentMode = 'simple'; // 'simple' or 'subject'

  // Initialize Default Subject Data
  const defaultSubjects = [
    { name: 'Mathematics', obtained: 85, max: 100 },
    { name: 'Physics', obtained: 78, max: 100 },
    { name: 'Chemistry', obtained: 82, max: 100 },
    { name: 'English', obtained: 75, max: 100 },
    { name: 'Computer Science', obtained: 92, max: 100 }
  ];

  // ==========================================
  // Mode Switching
  // ==========================================
  function switchMode(mode) {
    currentMode = mode;
    if (mode === 'simple') {
      modeSimpleBtn.classList.add('active');
      modeSubjectBtn.classList.remove('active');
      simpleModeContainer.style.display = 'block';
      subjectModeContainer.style.display = 'none';
      calculateSimple(false);
    } else {
      modeSimpleBtn.classList.remove('active');
      modeSubjectBtn.classList.add('active');
      simpleModeContainer.style.display = 'none';
      subjectModeContainer.style.display = 'block';
      calculateSubjectWise(false);
    }
  }

  modeSimpleBtn.addEventListener('click', () => switchMode('simple'));
  modeSubjectBtn.addEventListener('click', () => switchMode('subject'));

  // ==========================================
  // Helper: Standing Remarks
  // ==========================================
  function getAcademicStanding(percentage) {
    if (percentage >= 75) {
      return { text: 'Distinction / First Class', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' };
    } else if (percentage >= 60) {
      return { text: 'First Class', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' };
    } else if (percentage >= 50) {
      return { text: 'Second Class', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' };
    } else if (percentage >= 40) {
      return { text: 'Pass Class', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    } else {
      return { text: 'Needs Improvement', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
    }
  }

  // ==========================================
  // Helper: Update Radial Gauge
  // ==========================================
  function updateGauge(percentage) {
    const clampedPct = Math.max(0, Math.min(100, percentage));
    const offset = GAUGE_CIRCUMFERENCE - (clampedPct / 100) * GAUGE_CIRCUMFERENCE;
    if (pctGaugeCircle) {
      pctGaugeCircle.style.strokeDashoffset = offset;
      if (percentage >= 75) {
        pctGaugeCircle.style.stroke = '#4f46e5';
      } else if (percentage >= 60) {
        pctGaugeCircle.style.stroke = '#2563eb';
      } else if (percentage >= 40) {
        pctGaugeCircle.style.stroke = '#d97706';
      } else {
        pctGaugeCircle.style.stroke = '#ef4444';
      }
    }
  }

  // ==========================================
  // Simple Mode Calculation
  // ==========================================
  function calculateSimple(isUserAction = true) {
    simpleAlert.classList.remove('visible');

    const obtainedRaw = simpleObtainedInput.value.trim();
    const totalRaw = simpleTotalInput.value.trim();

    if (obtainedRaw === '' || totalRaw === '') {
      if (isUserAction) {
        simpleAlertMsg.textContent = 'Please enter both marks obtained and total marks.';
        simpleAlert.classList.add('visible');
      }
      return;
    }

    const obtained = parseFloat(obtainedRaw);
    const total = parseFloat(totalRaw);

    if (isNaN(obtained) || isNaN(total)) {
      simpleAlertMsg.textContent = 'Please enter valid numerical marks.';
      simpleAlert.classList.add('visible');
      return;
    }

    if (obtained < 0 || total <= 0) {
      simpleAlertMsg.textContent = 'Marks must be positive, and total marks must be greater than 0.';
      simpleAlert.classList.add('visible');
      return;
    }

    if (obtained > total) {
      simpleAlertMsg.textContent = 'Marks obtained cannot exceed maximum marks. Please enter marks between 0 and the maximum marks.';
      simpleAlert.classList.add('visible');
      return;
    }

    // Accurate calculation
    const percentage = (obtained / total) * 100;
    const lostMarks = total - obtained;
    const standing = getAcademicStanding(percentage);

    // Update Result UI
    pctResultValue.textContent = `${percentage.toFixed(2)}%`;
    pctObtainedValue.textContent = `${obtained} / ${total}`;
    pctLostValue.textContent = `${lostMarks % 1 === 0 ? lostMarks : lostMarks.toFixed(2)}`;

    pctStandingBadge.textContent = standing.text;
    pctStandingBadge.style.color = standing.color;
    pctStandingBadge.style.backgroundColor = standing.bg;
    pctStandingBadge.style.borderColor = standing.border;

    updateGauge(percentage);

    if (isUserAction) {
      pctResultValue.classList.add('animate-pop');
      setTimeout(() => pctResultValue.classList.remove('animate-pop'), 400);
      window.GradeMateApp?.showToast('Percentage calculated successfully!');
    }
  }

  // ==========================================
  // Subject-wise Rows & Calculations
  // ==========================================
  function renderSubjectRows(subjects) {
    subjectsTableBody.innerHTML = '';
    subjects.forEach((subj, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'table-row-item';
      tr.innerHTML = `
        <td>
          <input type="text" class="table-input subj-name" value="${escapeHTML(subj.name)}" placeholder="Subject ${idx + 1}" />
        </td>
        <td>
          <input type="number" class="table-input subj-obtained" value="${subj.obtained !== null ? subj.obtained : ''}" placeholder="0" min="0" step="any" />
        </td>
        <td>
          <input type="number" class="table-input subj-max" value="${subj.max !== null ? subj.max : ''}" placeholder="100" min="1" step="any" />
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-delete-row" title="Delete subject" aria-label="Delete subject">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      `;

      // Delete listener
      const deleteBtn = tr.querySelector('.btn-delete-row');
      deleteBtn.addEventListener('click', () => {
        if (subjectsTableBody.querySelectorAll('tr').length <= 1) {
          window.GradeMateApp?.showToast('You must have at least one subject.');
          return;
        }
        tr.remove();
        updateRowDeleteButtons();
        calculateSubjectWise(false);
      });

      // Live change listener
      tr.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
          if (subjectAlert.classList.contains('visible')) {
            subjectAlert.classList.remove('visible');
          }
        });
      });

      subjectsTableBody.appendChild(tr);
    });
    updateRowDeleteButtons();
  }

  function updateRowDeleteButtons() {
    const rows = subjectsTableBody.querySelectorAll('tr');
    const deleteBtns = subjectsTableBody.querySelectorAll('.btn-delete-row');
    deleteBtns.forEach(btn => {
      btn.disabled = rows.length <= 1;
    });
  }

  function addSubjectRow() {
    const rowCount = subjectsTableBody.querySelectorAll('tr').length + 1;
    const newSubject = { name: `Subject ${rowCount}`, obtained: '', max: 100 };
    renderSubjectRows(getCurrentSubjects().concat(newSubject));
    const allInputs = subjectsTableBody.querySelectorAll('tr:last-child input');
    if (allInputs[0]) allInputs[0].focus();
  }

  function getCurrentSubjects() {
    const rows = subjectsTableBody.querySelectorAll('tr');
    const list = [];
    rows.forEach(tr => {
      const name = tr.querySelector('.subj-name').value.trim();
      const obtainedRaw = tr.querySelector('.subj-obtained').value.trim();
      const maxRaw = tr.querySelector('.subj-max').value.trim();
      list.push({
        name: name || 'Subject',
        obtained: obtainedRaw !== '' ? parseFloat(obtainedRaw) : null,
        max: maxRaw !== '' ? parseFloat(maxRaw) : null
      });
    });
    return list;
  }

  function calculateSubjectWise(isUserAction = true) {
    subjectAlert.classList.remove('visible');
    const subjects = getCurrentSubjects();

    if (subjects.length === 0) {
      if (isUserAction) {
        subjectAlertMsg.textContent = 'Please add at least one subject.';
        subjectAlert.classList.add('visible');
      }
      return;
    }

    let totalObtained = 0;
    let totalMax = 0;
    let hasInvalid = false;
    let errorText = '';

    for (let i = 0; i < subjects.length; i++) {
      const subj = subjects[i];
      if (subj.obtained === null || subj.max === null || isNaN(subj.obtained) || isNaN(subj.max)) {
        hasInvalid = true;
        errorText = `Please enter valid marks for all subjects (check row ${i + 1}).`;
        break;
      }
      if (subj.obtained < 0 || subj.max <= 0) {
        hasInvalid = true;
        errorText = `Marks must be positive, and maximum marks must be greater than 0 (check row ${i + 1}).`;
        break;
      }
      if (subj.obtained > subj.max) {
        hasInvalid = true;
        errorText = `Please enter marks between 0 and the maximum marks. Subject "${subj.name}" has obtained marks greater than max marks.`;
        break;
      }
      totalObtained += subj.obtained;
      totalMax += subj.max;
    }

    if (hasInvalid) {
      if (isUserAction) {
        subjectAlertMsg.textContent = errorText;
        subjectAlert.classList.add('visible');
      }
      return;
    }

    if (totalMax === 0) {
      subjectAlertMsg.textContent = 'Total maximum marks cannot be zero.';
      subjectAlert.classList.add('visible');
      return;
    }

    const percentage = (totalObtained / totalMax) * 100;
    const lostMarks = totalMax - totalObtained;
    const standing = getAcademicStanding(percentage);

    pctResultValue.textContent = `${percentage.toFixed(2)}%`;
    pctObtainedValue.textContent = `${totalObtained % 1 === 0 ? totalObtained : totalObtained.toFixed(1)} / ${totalMax % 1 === 0 ? totalMax : totalMax.toFixed(1)}`;
    pctLostValue.textContent = `${lostMarks % 1 === 0 ? lostMarks : lostMarks.toFixed(1)}`;

    pctStandingBadge.textContent = standing.text;
    pctStandingBadge.style.color = standing.color;
    pctStandingBadge.style.backgroundColor = standing.bg;
    pctStandingBadge.style.borderColor = standing.border;

    updateGauge(percentage);

    if (isUserAction) {
      pctResultValue.classList.add('animate-pop');
      setTimeout(() => pctResultValue.classList.remove('animate-pop'), 400);
      window.GradeMateApp?.showToast('Subject percentage calculated!');
    }
  }

  // ==========================================
  // Reset Functions
  // ==========================================
  function resetSimple() {
    simpleObtainedInput.value = '';
    simpleTotalInput.value = '';
    simpleAlert.classList.remove('visible');
    pctResultValue.textContent = '0.00%';
    pctObtainedValue.textContent = '0 / 0';
    pctLostValue.textContent = '0';
    pctStandingBadge.textContent = 'Enter marks';
    pctStandingBadge.style.color = '#64748b';
    pctStandingBadge.style.backgroundColor = '#f1f5f9';
    pctStandingBadge.style.borderColor = '#cbd5e1';
    updateGauge(0);
    window.GradeMateApp?.showToast('Percentage calculator reset.');
  }

  function resetSubjectWise() {
    renderSubjectRows(defaultSubjects);
    subjectAlert.classList.remove('visible');
    calculateSubjectWise(false);
    window.GradeMateApp?.showToast('Subject list reset to default.');
  }

  // Copy Result
  pctCopyBtn.addEventListener('click', () => {
    const textToCopy = `GradeMate Result: ${pctResultValue.textContent} (${pctObtainedValue.textContent})`;
    window.GradeMateApp?.copyToClipboard(textToCopy);
  });

  // Helpers
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
  simpleCalcBtn.addEventListener('click', () => calculateSimple(true));
  simpleResetBtn.addEventListener('click', resetSimple);
  simpleObtainedInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateSimple(true); });
  simpleTotalInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateSimple(true); });

  addSubjectBtn.addEventListener('click', addSubjectRow);
  subjectCalcBtn.addEventListener('click', () => calculateSubjectWise(true));
  subjectResetBtn.addEventListener('click', resetSubjectWise);

  // Initialize
  renderSubjectRows(defaultSubjects);
  calculateSimple(false);

  // Expose
  window.GradeMatePercentage = {
    calculateSimple,
    calculateSubjectWise,
    resetSimple,
    resetSubjectWise
  };
})();
