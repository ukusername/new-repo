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
