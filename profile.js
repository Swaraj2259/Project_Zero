let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progress = (currentStep - 1) / (totalSteps - 1) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
    });
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    updateProgress();
}

document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Profile created successfully! Redirecting to Create Course...');
    setTimeout(() => {
        window.location.href = 'create-course.html';
    }, 1500);
});

// Initialize first step
showStep(1);

// Add form validation
function validateStep(step) {
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    return Array.from(requiredFields).every(field => field.value.trim() !== '');
}
