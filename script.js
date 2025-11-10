let currentStep = 1;
const totalSteps = 3;

function showStep(step) {
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.step-indicator').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.help-text').forEach(el => el.classList.remove('active'));

  document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
  document.querySelector(`.step-indicator[data-step="${step}"]`).classList.add('active');

  document.getElementById('backBtn').style.display = step === 1 ? 'none' : 'block';
  document.getElementById('nextBtn').textContent = step === totalSteps ? '✓ Завершить' : 'Далее →';
  document.getElementById('nextBtn').onclick = step === totalSteps ? () => completeRegistration() : () => nextStep();
}

function nextStep() {
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

function validateCurrentStep() {
  const fields = document.querySelectorAll(`.step[data-step="${currentStep}"] input`);
  for (let field of fields) {
    if (!field.value) {
      alert('Пожалуйста, заполните все поля');
      return false;
    }
  }

  if (currentStep === 3) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return false;
    }
  }

  return true;
}

function toggleHelp() {
  const helpText = document.getElementById(`help-${currentStep}`);
  helpText.classList.toggle('active');
}

function completeRegistration() {
  if (validateCurrentStep()) {
    document.getElementById('registerForm').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    document.getElementById('successMessage').classList.add('active');
  }
}

showStep(1);


function logAction(action, data = null) {
  try {
    const entry = { timestamp: new Date().toISOString(), action, data };
    let logs = JSON.parse(localStorage.getItem('registrationLogs') || '[]');
    logs.push(entry);
    localStorage.setItem('registrationLogs', JSON.stringify(logs));
    console.log('[LOG]', entry);
  } catch (e) {
    console.error('Logging error:', e);
  }
}

function clearLogs() {
  try {
    localStorage.removeItem('registrationLogs');
    console.log('Logs cleared');
    alert('Логи очищены');
  } catch (e) {
    console.error('Clear logs error:', e);
  }
}

function restartForm() {
  try {
    logAction('RESTART');
    currentStep = 1;
    document.getElementById('registerForm').style.display = 'block';
    document.querySelector('.buttons').style.display = 'flex';
    document.getElementById('successMessage').classList.remove('active');
    document.getElementById('registerForm').reset();
    showStep(1);
    console.log('Form restarted');
  } catch (e) {
    console.error('Restart error:', e);
    logAction('ERROR', e.message);
  }
}

const origShowStep = showStep;
showStep = function(step) {
  try {
    logAction('STEP_CHANGE', { from: currentStep, to: step });
    origShowStep(step);
  } catch (e) {
    console.error('showStep error:', e);
    logAction('ERROR', e.message);
  }
};

const origValidate = validateCurrentStep;
validateCurrentStep = function() {
  try {
    const result = origValidate();
    if (!result) logAction('VALIDATION_ERROR', { step: currentStep });
    return result;
  } catch (e) {
    console.error('validateCurrentStep error:', e);
    logAction('ERROR', e.message);
    return false;
  }
};

window.addEventListener('error', (event) => {
  logAction('RUNTIME_ERROR', { message: event.message, filename: event.filename });
  console.error('Runtime error caught:', event);
});
