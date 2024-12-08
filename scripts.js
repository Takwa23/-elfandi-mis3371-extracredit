// Show current date in the header
window.onload = function () {
    // Ensure 'current-date' element exists before setting its content
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        const today = new Date();
        currentDateElement.innerText = today.toLocaleDateString(undefined, options);
    } else {
        console.error("Element with ID 'current-date' not found in the DOM.");
    }

    // Attach the onsubmit handler to the form after the DOM is fully loaded
    const form = document.getElementById('patientForm');
    if (form) {
        form.onsubmit = function () {
            return handleSubmit(); // Call handleSubmit and prevent actual form submission
        };
    } else {
        console.error("Form with ID 'patientForm' not found in the DOM.");
    }

    // Load the first name and set up other logic
    loadFirstName();
    handleNewUserCheckbox();

    // Show the current date in the header iframe (if applicable)
    const headerIframe = document.querySelector('iframe[title="Header Content"]');
    if (headerIframe) {
        headerIframe.onload = function () {
            const currentDateSpan = headerIframe.contentWindow.document.getElementById('current-date');
            if (currentDateSpan) {
                currentDateSpan.innerText = new Date().toLocaleDateString();
            }
        };
    } else {
        console.error("Header iframe not found.");
    }
};

// Function to save the first name to localStorage or cookies
function saveFirstName() {
    const firstName = document.getElementById('fname').value;
    if (firstName) {
        localStorage.setItem('firstName', firstName);
    }
}

// Function to load the first name from localStorage or cookies
function loadFirstName() {
    const savedFirstName = localStorage.getItem('firstName');
    const userGreeting = document.getElementById('userGreeting');
    const newUserOption = document.getElementById('newUserOption');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (savedFirstName) {
        if (userGreeting) {
            userGreeting.innerText = `Welcome Back, ${savedFirstName}!`;
        }
        if (userNameDisplay) {
            userNameDisplay.innerText = savedFirstName;
        }
        if (newUserOption) {
            newUserOption.style.display = 'block';
        }

        const firstNameField = document.getElementById('fname');
        if (firstNameField) {
            firstNameField.value = savedFirstName;
        }
    } else {
        if (userGreeting) {
            userGreeting.innerText = "Welcome, New User!";
        }
        if (newUserOption) {
            newUserOption.style.display = 'none';
        }
    }
}

// Function to handle the "Not You?" checkbox
function handleNewUserCheckbox() {
    const checkbox = document.getElementById('newUserCheckbox');
    if (checkbox) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                localStorage.removeItem('firstName');
                document.getElementById('patientForm').reset();
                loadFirstName(); // Refresh the greeting and form
            }
        });
    }
}

// Function to handle form submission
function handleSubmit() {
    // Perform validation logic here
    const formIsValid = validateForm(); // Replace this with your validation function

    if (formIsValid) {
        // Allow form submission and navigate to thankyou.html
        return true; // Returning true allows the default form action to proceed
    } else {
        alert("Please correct the errors in the form before submitting.");
        return false; // Prevent form submission if validation fails
    }
}

// Automatically format SSN with dashes as user types
function formatSSN() {
    const ssnField = document.getElementById('ssn');
    let ssn = ssnField.value.replace(/\D/g, ''); // Remove non-numeric characters

    // Format with dashes: 123-45-6789
    if (ssn.length > 3 && ssn.length <= 5) {
        ssn = ssn.slice(0, 3) + '-' + ssn.slice(3);
    } else if (ssn.length > 5) {
        ssn = ssn.slice(0, 3) + '-' + ssn.slice(3, 5) + '-' + ssn.slice(5, 9);
    }

    ssnField.value = ssn;
}

// Validate SSN to ensure it follows the format 123-45-6789 and contains only numbers
function validateSSN() {
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    const ssn = document.getElementById('ssn').value;
    return ssnPattern.test(ssn) ? "PASS" : "ERROR: SSN must be 9 digits in the format 123-45-6789.";
}

// Check fields against format required 
function validateField(fieldId, pattern) {
    const value = document.getElementById(fieldId).value;
    const regex = new RegExp(pattern);
    if (regex.test(value)) {
        return "PASS";
    } else {
        return `ERROR: Invalid ${fieldId}`;
    }
}

// Validate date selected is not in the future and not more than 120 years ago
function validateDate(fieldId) {
    const inputDate = new Date(document.getElementById(fieldId).value);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 120);

    if (inputDate > today) {
        return "ERROR: Date cannot be in the future.";
    } else if (inputDate < maxDate) {
        return "ERROR: Date cannot be more than 120 years ago.";
    }
    return "PASS";
}

// Check ZIP code format
function validateAndFormatZipCode() {
    const zipCode = document.getElementById('zipcode').value;
    const zipPattern = /^\d{5}(-\d{4})?$/; 

    if (zipPattern.test(zipCode)) {
        return { status: "PASS", formattedZip: zipCode };
    } else {
        return { status: "ERROR: Invalid ZIP Code", formattedZip: zipCode };
    }
}

// Check user ID format and change entered values to lowercase
function validateAndFormatUserID() {
    const userID = document.getElementById('username').value;
    const userIDPattern = /^[a-zA-Z][a-zA-Z0-9_-]{4,19}$/; 

    if (userIDPattern.test(userID)) {
        return { status: "PASS", formattedUserID: userID.toLowerCase() }; 
    } else {
        return { status: "ERROR: Invalid User ID - ID must be between 5-20 characters", formattedUserID: userID };
    }
}

// Validate matching passwords and enforce password format
function validatePasswords() {
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;      
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/; 
    if (!passwordPattern.test(password)) {
        return "ERROR: Password must be 8-30 characters long, contain at least one uppercase letter, one number, and one special character.";
    }    
    if (password !== repassword) {
        return "ERROR: Passwords do not match.";
    }
    return "PASS";
}

// Show number beside the slider
function updateHealthValue() {
    const healthSlider = document.getElementById('health');
    const healthValueDisplay = document.getElementById('healthValue');
    healthValueDisplay.textContent = healthSlider.value;
}

// Shows the status of each review
function addValidationStatus(status) {
    if (status === "PASS") {
        return `<span style="color:green;">Pass</span>`;
    } else {
        return `<span style="color:red;">${status}</span>`;
    }
}

// Execute the review process
function handleReview() {
    const fnamePattern = /^[a-zA-Z'-]+$/; 
    const mnamePattern = /^[a-zA-Z]?$/; // Allows a single letter or blank for Middle Initial
    const lnamePattern = /^[a-zA-Z0-9'-]+$/; 
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/; 
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/; 

    // Validate Full Name including Middle Initial
    const firstNameValid = validateField("fname", fnamePattern) === "PASS";
    const middleInitialValid = validateField("mname", mnamePattern) === "PASS";
    const lastNameValid = validateField("lname", lnamePattern) === "PASS";

    const fullNameStatus = firstNameValid && middleInitialValid && lastNameValid ? "PASS" : "ERROR: Invalid Name";

    // Display full name with consolidated status in review section
    const fullName = document.getElementById('fname').value + " " +
                     (document.getElementById('mname').value || '') + " " +
                     document.getElementById('lname').value;
    document.getElementById('reviewFullName').innerText = fullName;
    document.getElementById('reviewFullNameStatus').innerHTML = addValidationStatus(fullNameStatus);

    // Check date of birth in review section
    const dobStatus = validateDate("dob");

    document.getElementById('reviewDob').innerText = document.getElementById('dob').value;
    document.getElementById('reviewDobStatus').innerHTML = addValidationStatus(dobStatus);

    // Check SSN in review section
    const ssnStatus = validateSSN();
    document.getElementById('reviewSSN').innerText = document.getElementById('ssn').value;
    document.getElementById('reviewSSNStatus').innerHTML = addValidationStatus(ssnStatus);

    // Check e-mail and phone format in review section
    document.getElementById('reviewEmail').innerText = document.getElementById('email').value;
    document.getElementById('reviewEmailStatus').innerHTML = addValidationStatus(validateField("email", emailPattern));

    document.getElementById('reviewPhone').innerText = document.getElementById('phone').value;
    document.getElementById('reviewPhoneStatus').innerHTML = addValidationStatus(validateField("phone", phonePattern));

    // Check ZIP code in review section
    const zipValidation = validateAndFormatZipCode();
    const zipStatus = zipValidation.status;
    const formattedZip = zipValidation.formattedZip;

    // Address fields in review section
    const addressLine1 = document.getElementById('addr1').value;
    const addressLine2 = document.getElementById('addr2').value;
    const cityStateZip = document.getElementById('city').value + ", " + document.getElementById('state').value + " " + formattedZip;

    document.getElementById('reviewAddressLine1').innerText = addressLine1;
    document.getElementById('reviewAddressLine2').innerText = addressLine2;
    document.getElementById('reviewCityStateZip').innerText = cityStateZip;
    document.getElementById('reviewAddressStatus').innerHTML = addValidationStatus(zipStatus);

    // Gender field in review section
    const gender = document.querySelector('input[name="gender"]:checked').value;
    document.getElementById('reviewGender').innerText = gender;

    // User ID in review section
    const userIDValidation = validateAndFormatUserID();
    const userIDStatus = userIDValidation.status;
    const formattedUserID = userIDValidation.formattedUserID;

    // Validate passwords
    const passwordStatus = validatePasswords();

    // Illness and requested info in review section
    document.getElementById('reviewChickenPox').innerText = document.getElementById('chickenpox').checked ? "Y" : "N";
    document.getElementById('reviewVaccinated').innerText = document.getElementById('vaccine-yes').checked ? "Y" : "N";

    document.getElementById('reviewMeasles').innerText = document.getElementById('measles').checked ? "Y" : "N";
    document.getElementById('reviewMumps').innerText = document.getElementById('mumps').checked ? "Y" : "N";
    document.getElementById('reviewHeartDisease').innerText = document.getElementById('heartDisease').checked ? "Y" : "N";
    document.getElementById('reviewDiabetic').innerText = document.getElementById('diabetic').checked ? "Y" : "N";
    document.getElementById('reviewCovid19').innerText = document.getElementById('covid').checked ? "Y" : "N";

    // Symptoms textarea in review section
    document.getElementById('reviewSymptoms').innerText = document.getElementById('symptoms').value;

    // User ID and password in review section with feature to show password
    document.getElementById('reviewUserID').innerText = formattedUserID; 
    document.getElementById('reviewUserIDStatus').innerHTML = addValidationStatus(userIDStatus); 
    document.getElementById('reviewPasswordStatus').innerHTML = addValidationStatus(passwordStatus);
    document.getElementById('reviewPassword').innerText = document.getElementById('password').value; 

    // Display the review section
    document.getElementById('reviewSection').style.display = 'block';
}
