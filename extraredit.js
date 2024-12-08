// Modal DOM Elements
const continueModal = document.getElementById('continueModal');
const continueButton = document.getElementById('continueButton');
const clearButton = document.getElementById('clearButton');
const modalClose = document.getElementById('modalClose');

// Check if there is saved data in localStorage and show modal
function checkSavedData() {
    if (localStorage.getItem('formData')) {
        continueModal.style.display = 'block';
    }
}

// Prefill the form with data from localStorage
function prefillForm() {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
        for (const key in savedData) {
            const field = document.getElementById(key);
            if (field) {
                field.value = savedData[key];
            }
        }
    }
}

// Save all form data to localStorage
function saveFormData() {
    const formData = {};
    const formElements = document.getElementById('patientForm').elements;
    for (const element of formElements) {
        if (element.id) {
            formData[element.id] = element.value;
        }
    }
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Clear localStorage and reset the form
function clearFormData() {
    localStorage.removeItem('formData');
    document.getElementById('patientForm').reset();
}

// Event Listeners for Modal Buttons
continueButton.addEventListener('click', () => {
    prefillForm();
    continueModal.style.display = 'none';
});

clearButton.addEventListener('click', () => {
    clearFormData();
    continueModal.style.display = 'none';
});

modalClose.addEventListener('click', () => {
    continueModal.style.display = 'none';
});

// Save data on input change
document.getElementById('patientForm').addEventListener('input', saveFormData);

// Check for saved data on page load
window.onload = function () {
    checkSavedData();
};
