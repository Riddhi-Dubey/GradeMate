/**
 * GradeMate - CGPA to Percentage Converter Module
 * Converts CGPA to percentage using standard 9.5 multiplier or custom multiplier
 */

(function () {
  // DOM Elements
  const convCgpaInput = document.getElementById('conv-cgpa-input');
  const multiplierStandardRadio = document.getElementById('multiplier-standard');
  const multiplierCustomRadio = document.getElementById('multiplier-custom');
  const customMultiplierGroup = document.getElementById('custom-multiplier-group');
  const convMultiplierInput = document.getElementById('conv-multiplier-input');

  const convCalcBtn = document.getElementById('conv-calc-btn');
  const convResetBtn = document.getElementById('conv-reset-btn');
  const convAlert = document.getElementById('conv-alert');
  const convAlertMsg = document.getElementById('conv-alert-msg');

  // Results DOM
  const convResultPercentage = document.getElementById('conv-result-percentage');
  const convResultBreakdown = document.getElementById('conv-result-breakdown');
  const convResultGaugeCircle = document.getElementById('conv-gauge-circle');
  const convCopyBtn = document.getElementById('conv-copy-btn');

  const GAUGE_CIRCUMFERENCE = 439.82;

  // Handle Radio Pill Selection Styles
  const standardCard = document.getElementById('radio-card-standard');
  const customCard = document.getElementById('radio-card-custom');

  function updateRadioState() {
    if (multiplierStandardRadio.checked) {
      standardCard.classList.add('selected');
      customCard.classList.remove('selected');
      customMultiplierGroup.style.display = 'none';
    } else {
      standardCard.classList.remove('selected');
      customCard.classList.add('selected');
      customMultiplierGroup.style.display = 'block';
    }
  }

  multiplierStandardRadio.addEventListener('change', () => {
    updateRadioState();
    calculateConversion(false);
  });

  multiplierCustomRadio.addEventListener('change', () => {
    updateRadioState();
    convMultiplierInput.focus();
    calculateConversion(false);
  });

  standardCard.addEventListener('click', () => {
    multiplierStandardRadio.checked = true;
    updateRadioState();
    calculateConversion(false);
  });

  customCard.addEventListener('click', () => {
    multiplierCustomRadio.checked = true;
    updateRadioState();
    convMultiplierInput.focus();
    calculateConversion(false);
  });

  function updateConverterGauge(percentage) {
    const clampedPct = Math.max(0, Math.min(100, percentage));
    const offset = GAUGE_CIRCUMFERENCE - (clampedPct / 100) * GAUGE_CIRCUMFERENCE;
    if (convResultGaugeCircle) {
      convResultGaugeCircle.style.strokeDashoffset = offset;
      if (percentage >= 75) {
        convResultGaugeCircle.style.stroke = '#2563eb';
      } else if (percentage >= 60) {
        convResultGaugeCircle.style.stroke = '#4f46e5';
      } else if (percentage >= 40) {
        convResultGaugeCircle.style.stroke = '#d97706';
      } else {
        convResultGaugeCircle.style.stroke = '#ef4444';
      }
    }
  }

  // ==========================================
  // Calculate Conversion
  // Percentage = CGPA × Multiplier
  // ==========================================
  function calculateConversion(isUserAction = true) {
    convAlert.classList.remove('visible');

    const cgpaRaw = convCgpaInput.value.trim();
    if (cgpaRaw === '') {
      if (isUserAction) {
        convAlertMsg.textContent = 'Please enter a CGPA value to convert.';
        convAlert.classList.add('visible');
      }
      return;
    }

    const cgpa = parseFloat(cgpaRaw);
    if (isNaN(cgpa)) {
      convAlertMsg.textContent = 'Please enter a valid numeric CGPA.';
      convAlert.classList.add('visible');
      return;
    }

    if (cgpa < 0 || cgpa > 10) {
      convAlertMsg.textContent = 'CGPA must be between 0.0 and 10.0 on a 10-point scale.';
      convAlert.classList.add('visible');
      return;
    }

    // Determine multiplier
    let multiplier = 9.5;
    if (multiplierCustomRadio.checked) {
      const multRaw = convMultiplierInput.value.trim();
      if (multRaw === '') {
        convAlertMsg.textContent = 'Please enter your custom multiplier value (e.g. 10.0, 9.5).';
        convAlert.classList.add('visible');
        return;
      }
      multiplier = parseFloat(multRaw);
      if (isNaN(multiplier) || multiplier <= 0) {
        convAlertMsg.textContent = 'Custom multiplier must be a positive number greater than 0.';
        convAlert.classList.add('visible');
        return;
      }
    }

    const percentage = cgpa * multiplier;

    // Display
    convResultPercentage.textContent = `${percentage.toFixed(2)}%`;
    convResultBreakdown.textContent = `${cgpa.toFixed(2)} × ${multiplier} = ${percentage.toFixed(2)}%`;
    updateConverterGauge(percentage);

    if (isUserAction) {
      convResultPercentage.classList.add('animate-pop');
      setTimeout(() => convResultPercentage.classList.remove('animate-pop'), 400);
      window.GradeMateApp?.showToast(`Converted: ${percentage.toFixed(2)}%`);
    }
  }

  // ==========================================
  // Reset Converter
  // ==========================================
  function resetConverter() {
    convCgpaInput.value = '8.47';
    multiplierStandardRadio.checked = true;
    convMultiplierInput.value = '9.5';
    updateRadioState();
    convAlert.classList.remove('visible');
    calculateConversion(false);
    window.GradeMateApp?.showToast('Converter reset to default (8.47 × 9.5).');
  }

  // Sync from CGPA Calculator
  function syncFromCGPA(cgpaVal) {
    if (cgpaVal !== undefined && cgpaVal !== null) {
      convCgpaInput.value = cgpaVal;
      calculateConversion(false);
    }
  }

  // Copy Result
  convCopyBtn.addEventListener('click', () => {
    const text = `GradeMate Conversion: ${convCgpaInput.value} CGPA = ${convResultPercentage.textContent} (${convResultBreakdown.textContent})`;
    window.GradeMateApp?.copyToClipboard(text);
  });

  // Event Listeners
  convCalcBtn.addEventListener('click', () => calculateConversion(true));
  convResetBtn.addEventListener('click', resetConverter);
  convCgpaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateConversion(true); });
  convMultiplierInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateConversion(true); });
  convCgpaInput.addEventListener('input', () => {
    if (convAlert.classList.contains('visible')) convAlert.classList.remove('visible');
  });

  // Initialize
  updateRadioState();
  calculateConversion(false);

  window.GradeMateConverter = {
    calculateConversion,
    resetConverter,
    syncFromCGPA
  };
})();
