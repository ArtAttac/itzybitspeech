// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Smooth scroll with offset for fixed header
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling
    const consultationForm = document.getElementById('consultation-form');
    
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Create email body
        const emailBody = `
New consultation request from Itzy Bitzy Speech Therapy website:

Parent/Guardian Name: ${formObject['parent-name']}
Child's Name: ${formObject['child-name']}
Child's Age: ${formObject['child-age']}
Email: ${formObject['email']}
Phone: ${formObject['phone']}
Preferred Contact: ${formObject['preferred-contact']}

Concerns:
${formObject['concerns'] || 'No specific concerns mentioned.'}
        `.trim();
        
        // Create mailto link
        const subject = encodeURIComponent('New Consultation Request - ' + formObject['child-name']);
        const body = encodeURIComponent(emailBody);
        const mailtoLink = `mailto:itzybitzyspeechtherapy@gmail.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        this.reset();
    });

    // Show success message function
    function showSuccessMessage() {
        const submitButton = document.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Email Client Opened!';
        submitButton.style.background = '#27ae60';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '#e67e22';
        }, 3000);
    }

    // Active navigation link highlighting
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Scroll event listener for active navigation
    window.addEventListener('scroll', highlightActiveSection);

    // Scroll to top functionality for logo
    document.querySelector('.nav-brand').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add entrance animations for cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    const cards = document.querySelectorAll('.feature-card, .service-card, .faq-item, .support-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add loading state to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                // Internal link - smooth scroll handled above
                return;
            }
            
            // External link or action
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });

    // Form validation enhancements
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add real-time validation feedback
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Remove error styling on input
            this.style.borderColor = '#e1e8ed';
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
        }

        if (!isValid) {
            field.style.borderColor = '#e74c3c';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '0.9rem';
            errorDiv.style.marginTop = '0.5rem';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.style.borderColor = '#27ae60';
        }

        return isValid;
    }

    // Enhanced form submission validation
    const originalSubmitHandler = consultationForm.onsubmit;
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let allValid = true;
        const requiredFields = this.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        if (allValid) {
            // Proceed with original submit logic
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            const emailBody = `
New consultation request from Itzy Bitzy Speech Therapy website:

Parent/Guardian Name: ${formObject['parent-name']}
Child's Name: ${formObject['child-name']}
Child's Age: ${formObject['child-age']}
Email: ${formObject['email']}
Phone: ${formObject['phone']}
Preferred Contact: ${formObject['preferred-contact']}

Concerns:
${formObject['concerns'] || 'No specific concerns mentioned.'}
            `.trim();
            
            const subject = encodeURIComponent('New Consultation Request - ' + formObject['child-name']);
            const body = encodeURIComponent(emailBody);
            const mailtoLink = `mailto:itzybitzyspeechtherapy@gmail.com?subject=${subject}&body=${body}`;
            
            window.location.href = mailtoLink;
            showSuccessMessage();
            this.reset();
        } else {
            // Scroll to first error
            const firstError = this.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});