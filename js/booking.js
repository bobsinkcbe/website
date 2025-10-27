// Booking functionality
document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    initDateTimePicker();
    initPriceCalculator();
    initBookingValidation();
});

// Booking configuration
const bookingConfig = {
    artists: {
        'marcus': {
            name: 'Marcus Rivera',
            specialty: 'Realism & Portraits',
            hourlyRate: 150,
            availability: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        },
        'sakura': {
            name: 'Sakura Chen',
            specialty: 'Japanese Traditional',
            hourlyRate: 140,
            availability: ['monday', 'wednesday', 'thursday', 'friday', 'saturday']
        },
        'alex': {
            name: 'Alex Thompson',
            specialty: 'Neo-Traditional',
            hourlyRate: 130,
            availability: ['tuesday', 'wednesday', 'friday', 'saturday', 'sunday']
        }
    },
    sizeMultipliers: {
        'small': 1,
        'medium': 1.5,
        'large': 2.5,
        'sleeve': 4
    },
    styleComplexity: {
        'realism': 1.3,
        'traditional': 1,
        'neo-traditional': 1.2,
        'blackwork': 1.1,
        'color': 1.4
    },
    consultationFee: 50,
    depositPercentage: 0.3 // 30% deposit required
};

function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Add dynamic form enhancements
    addFormEnhancements();
}

function addFormEnhancements() {
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Artist selection change handler
    const artistSelect = document.getElementById('artist');
    if (artistSelect) {
        artistSelect.addEventListener('change', updateArtistInfo);
    }
    
    // Size and style change handlers for price estimation
    const sizeSelect = document.getElementById('size');
    const styleSelect = document.getElementById('style');
    
    if (sizeSelect) sizeSelect.addEventListener('change', updatePriceEstimate);
    if (styleSelect) styleSelect.addEventListener('change', updatePriceEstimate);
    
    // Add price estimate display
    addPriceEstimateDisplay();
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})/, '($1) ');
    }
    
    e.target.value = value;
}

function updateArtistInfo() {
    const artistSelect = document.getElementById('artist');
    const selectedArtist = artistSelect.value;
    
    if (selectedArtist && bookingConfig.artists[selectedArtist]) {
        const artist = bookingConfig.artists[selectedArtist];
        
        // Show artist info
        showArtistInfo(artist);
        
        // Update available time slots
        updateAvailableSlots(artist.availability);
    } else {
        hideArtistInfo();
    }
    
    updatePriceEstimate();
}

function showArtistInfo(artist) {
    let infoContainer = document.getElementById('artist-info');
    
    if (!infoContainer) {
        infoContainer = document.createElement('div');
        infoContainer.id = 'artist-info';
        infoContainer.className = 'artist-info-display';
        
        const artistSelect = document.getElementById('artist');
        artistSelect.parentNode.insertBefore(infoContainer, artistSelect.nextSibling);
    }
    
    infoContainer.innerHTML = `
        <div class="artist-info-card">
            <h4>${artist.name}</h4>
            <p><strong>Specialty:</strong> ${artist.specialty}</p>
            <p><strong>Rate:</strong> $${artist.hourlyRate}/hour</p>
        </div>
    `;
    
    infoContainer.style.cssText = `
        margin-top: 10px;
        padding: 15px;
        background: var(--background-light);
        border-radius: var(--border-radius);
        border-left: 3px solid var(--primary-color);
    `;
}

function hideArtistInfo() {
    const infoContainer = document.getElementById('artist-info');
    if (infoContainer) {
        infoContainer.remove();
    }
}

function addPriceEstimateDisplay() {
    const form = document.getElementById('booking-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    const estimateContainer = document.createElement('div');
    estimateContainer.id = 'price-estimate';
    estimateContainer.className = 'price-estimate-display';
    estimateContainer.style.cssText = `
        margin: 20px 0;
        padding: 20px;
        background: var(--background-light);
        border-radius: var(--border-radius);
        border: 2px solid var(--primary-color);
        text-align: center;
        display: none;
    `;
    
    form.insertBefore(estimateContainer, submitButton);
}

function updatePriceEstimate() {
    const artistSelect = document.getElementById('artist');
    const sizeSelect = document.getElementById('size');
    const styleSelect = document.getElementById('style');
    const estimateContainer = document.getElementById('price-estimate');
    
    if (!artistSelect.value || !sizeSelect.value || !styleSelect.value) {
        estimateContainer.style.display = 'none';
        return;
    }
    
    const artist = bookingConfig.artists[artistSelect.value];
    const sizeMultiplier = bookingConfig.sizeMultipliers[sizeSelect.value];
    const styleMultiplier = bookingConfig.styleComplexity[styleSelect.value];
    
    // Base calculation (2-4 hours for small, scaling up)
    const baseHours = sizeSelect.value === 'small' ? 3 : 
                     sizeSelect.value === 'medium' ? 5 :
                     sizeSelect.value === 'large' ? 8 : 15;
    
    const estimatedHours = Math.ceil(baseHours * styleMultiplier);
    const totalCost = (estimatedHours * artist.hourlyRate) + bookingConfig.consultationFee;
    const depositAmount = Math.ceil(totalCost * bookingConfig.depositPercentage);
    
    estimateContainer.innerHTML = `
        <h4>Price Estimate</h4>
        <div class="estimate-breakdown">
            <p><strong>Estimated Time:</strong> ${estimatedHours} hours</p>
            <p><strong>Rate:</strong> $${artist.hourlyRate}/hour</p>
            <p><strong>Consultation Fee:</strong> $${bookingConfig.consultationFee}</p>
            <hr style="margin: 15px 0; border-color: var(--text-secondary);">
            <p><strong>Total Estimate:</strong> $${totalCost}</p>
            <p><strong>Required Deposit:</strong> $${depositAmount}</p>
        </div>
        <small style="color: var(--text-secondary); margin-top: 10px; display: block;">
            *This is an estimate. Final pricing will be determined during consultation.
        </small>
    `;
    
    estimateContainer.style.display = 'block';
    
    // Animate in
    estimateContainer.style.opacity = '0';
    estimateContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        estimateContainer.style.transition = 'all 0.3s ease';
        estimateContainer.style.opacity = '1';
        estimateContainer.style.transform = 'translateY(0)';
    }, 100);
}

function initDateTimePicker() {
    // Add enhanced date/time selection
    addDateTimeFields();
}

function addDateTimeFields() {
    const form = document.getElementById('booking-form');
    const descriptionGroup = form.querySelector('#description').parentNode;
    
    // Create date/time section
    const dateTimeSection = document.createElement('div');
    dateTimeSection.className = 'datetime-section';
    dateTimeSection.innerHTML = `
        <div class="form-group">
            <label for="preferred-date">Preferred Date</label>
            <input type="date" id="preferred-date" name="preferred-date" min="${getTomorrowDate()}">
        </div>
        <div class="form-group">
            <label for="preferred-time">Preferred Time</label>
            <select id="preferred-time" name="preferred-time">
                <option value="">Select a time</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
            </select>
        </div>
    `;
    
    form.insertBefore(dateTimeSection, descriptionGroup);
    
    // Add event listeners
    const dateInput = document.getElementById('preferred-date');
    const timeSelect = document.getElementById('preferred-time');
    
    dateInput.addEventListener('change', checkAvailability);
    timeSelect.addEventListener('change', checkAvailability);
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function checkAvailability() {
    const artistSelect = document.getElementById('artist');
    const dateInput = document.getElementById('preferred-date');
    const timeSelect = document.getElementById('preferred-time');
    
    if (artistSelect.value && dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = selectedDate.toLocaleLowerCase().slice(0, 3) + 
                         selectedDate.toLocaleLowerCase().slice(3);
        const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = weekdays[selectedDate.getDay()];
        
        const artist = bookingConfig.artists[artistSelect.value];
        
        if (!artist.availability.includes(dayName)) {
            showAvailabilityWarning(`${artist.name} is not available on ${dayName}s. Available days: ${artist.availability.join(', ')}`);
        } else {
            hideAvailabilityWarning();
        }
    }
}

function showAvailabilityWarning(message) {
    let warningDiv = document.getElementById('availability-warning');
    
    if (!warningDiv) {
        warningDiv = document.createElement('div');
        warningDiv.id = 'availability-warning';
        warningDiv.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: rgba(255, 107, 53, 0.1);
            border: 1px solid var(--primary-color);
            border-radius: var(--border-radius);
            color: var(--primary-color);
            font-size: 0.9rem;
        `;
        
        const timeSelect = document.getElementById('preferred-time');
        timeSelect.parentNode.insertBefore(warningDiv, timeSelect.nextSibling);
    }
    
    warningDiv.textContent = message;
}

function hideAvailabilityWarning() {
    const warningDiv = document.getElementById('availability-warning');
    if (warningDiv) {
        warningDiv.remove();
    }
}

function initPriceCalculator() {
    // Already implemented in updatePriceEstimate function
}

function initBookingValidation() {
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateBookingForm()) {
            submitBookingForm();
        }
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    switch(field.id) {
        case 'name':
            if (!value) {
                showFieldError(field, 'Name is required');
                return false;
            } else if (value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
                return false;
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(field, 'Email is required');
                return false;
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'phone':
            if (!value) {
                showFieldError(field, 'Phone number is required');
                return false;
            } else if (!isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'description':
            if (!value) {
                showFieldError(field, 'Please describe your tattoo idea');
                return false;
            } else if (value.length < 10) {
                showFieldError(field, 'Please provide more details about your tattoo idea');
                return false;
            }
            break;
    }
    
    return true;
}

function validateBookingForm() {
    const requiredFields = ['name', 'email', 'phone', 'description'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--primary-color);
        font-size: 0.9rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--primary-color)';
    
    // Add shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function submitBookingForm() {
    const form = document.getElementById('booking-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Convert FormData to object
    const bookingData = {};
    formData.forEach((value, key) => {
        bookingData[key] = value;
    });
    
    // Add timestamp
    bookingData.timestamp = new Date().toISOString();
    bookingData.source = 'website';
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Success simulation
        if (Math.random() > 0.1) { // 90% success rate
            handleBookingSuccess(bookingData);
        } else {
            handleBookingError('There was an error submitting your request. Please try again.');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleBookingSuccess(bookingData) {
    const form = document.getElementById('booking-form');
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'booking-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Booking Request Submitted!</h3>
            <p>Thank you for your interest! We'll review your request and contact you within 24 hours to confirm your consultation.</p>
            <div class="booking-reference">
                <strong>Reference ID:</strong> #${generateReferenceId()}
            </div>
            <div class="next-steps">
                <h4>What's Next?</h4>
                <ul>
                    <li>We'll call you to discuss your design ideas</li>
                    <li>Schedule your consultation appointment</li>
                    <li>Provide detailed pricing information</li>
                    <li>Send pre-appointment preparation instructions</li>
                </ul>
            </div>
        </div>
    `;
    
    successMessage.style.cssText = `
        background: var(--background-light);
        border: 2px solid var(--primary-color);
        border-radius: var(--border-radius);
        padding: 30px;
        margin: 20px 0;
        text-align: center;
        animation: fadeInUp 0.6s ease forwards;
    `;
    
    // Replace form with success message
    form.style.opacity = '0';
    setTimeout(() => {
        form.parentNode.insertBefore(successMessage, form);
        form.style.display = 'none';
    }, 300);
    
    // Send confirmation email (simulation)
    sendConfirmationEmail(bookingData);
    
    // Show notification
    showNotification('Booking request submitted successfully!', 'success');
    
    // Scroll to success message
    setTimeout(() => {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
}

function handleBookingError(errorMessage) {
    showNotification(errorMessage, 'error');
}

function generateReferenceId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return (timestamp + randomStr).toUpperCase();
}

function sendConfirmationEmail(bookingData) {
    // In a real application, this would trigger an email send
    console.log('Sending confirmation email:', bookingData);
    
    // Show email confirmation notification
    setTimeout(() => {
        showNotification('Confirmation email sent to ' + bookingData.email, 'info');
    }, 1000);
}

// Utility function to reset booking form
function resetBookingForm() {
    const form = document.getElementById('booking-form');
    const successMessage = document.querySelector('.booking-success');
    
    if (successMessage) {
        successMessage.remove();
    }
    
    form.style.display = 'block';
    form.style.opacity = '1';
    form.reset();
    
    // Clear any errors
    const errors = form.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    // Reset price estimate
    const estimateContainer = document.getElementById('price-estimate');
    if (estimateContainer) {
        estimateContainer.style.display = 'none';
    }
    
    // Reset artist info
    hideArtistInfo();
    hideAvailabilityWarning();
}

// Export functions for global access
window.bookConsultation = function() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
};

window.resetBookingForm = resetBookingForm;