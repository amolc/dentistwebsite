/* AuraDental Main JS File */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll-sensitive Glassmorphism Navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 2. Intersection Observer for Scroll Reveals
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach((item, index) => {
      // Add staggered delay
      const delay = item.getAttribute('data-delay') || (index % 3) * 100;
      item.style.transitionDelay = `${delay}ms`;
      revealObserver.observe(item);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealItems.forEach(item => item.classList.add('revealed'));
  }

  // 3. Custom Accordion Toggle for FAQs
  const accordionHeaders = document.querySelectorAll('.accordion-header-btn');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const panel = header.nextElementSibling;
      const isCollapsed = header.classList.contains('collapsed');
      
      // Close other panels in the same accordion group
      const siblingHeaders = header.closest('.accordion-group')?.querySelectorAll('.accordion-header-btn') || [];
      siblingHeaders.forEach(sibling => {
        if (sibling !== header) {
          sibling.classList.add('collapsed');
          sibling.setAttribute('aria-expanded', 'false');
          if (sibling.nextElementSibling) {
            sibling.nextElementSibling.style.display = 'none';
          }
        }
      });

      if (isCollapsed) {
        header.classList.remove('collapsed');
        header.setAttribute('aria-expanded', 'true');
        panel.style.display = 'block';
      } else {
        header.classList.add('collapsed');
        header.setAttribute('aria-expanded', 'false');
        panel.style.display = 'none';
      }
    });
  });

  // 4. Testimonials Slider Mechanic (if arrows exist)
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const testSlides = document.querySelectorAll('.testimonial-slide');
  
  if (testSlides.length > 0 && prevBtn && nextBtn) {
    let currentSlide = 0;

    const showSlide = (index) => {
      testSlides.forEach((slide, idx) => {
        slide.style.display = idx === index ? 'block' : 'none';
      });
    };

    // Initialize first slide
    showSlide(currentSlide);

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentSlide = (currentSlide - 1 + testSlides.length) % testSlides.length;
      showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentSlide = (currentSlide + 1) % testSlides.length;
      showSlide(currentSlide);
    });
  }

  // 5. Interactive Appointment Wizard Setup
  initBookingWizard();
});

function initBookingWizard() {
  const bookingWizard = document.getElementById('booking-wizard-form');
  if (!bookingWizard) return;

  const steps = document.querySelectorAll('.booking-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const progressBar = document.querySelector('.step-progress-bar');
  const nextStepBtns = document.querySelectorAll('.btn-next-step');
  const prevStepBtns = document.querySelectorAll('.btn-prev-step');
  
  let currentStep = 1;
  const totalSteps = steps.length;
  
  // Selection State
  let bookingData = {
    service: '',
    serviceName: '',
    doctor: '',
    doctorName: '',
    date: '',
    timeSlot: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientNotes: ''
  };

  // Service Selection Cards
  const serviceCards = document.querySelectorAll('.service-select-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingData.service = card.getAttribute('data-service');
      bookingData.serviceName = card.querySelector('h5').innerText;
      
      // Automatically advance button enabled or color highlighted
      document.querySelector(`.booking-step[data-step="1"] .btn-next-step`).removeAttribute('disabled');
    });
  });

  // Doctor Selection Cards
  const doctorCards = document.querySelectorAll('.doctor-select-card');
  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      doctorCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingData.doctor = card.getAttribute('data-doctor');
      bookingData.doctorName = card.querySelector('h5').innerText;

      document.querySelector(`.booking-step[data-step="2"] .btn-next-step`).removeAttribute('disabled');
    });
  });

  // Date and Time Slot Handlers
  const dateInput = document.getElementById('booking-date');
  const timeSlotsContainer = document.getElementById('time-slots-container');

  if (dateInput) {
    // Restrict date input to today onwards
    const todayStr = new Date().toISOString().split('T')[0];
    dateInput.min = todayStr;

    dateInput.addEventListener('change', (e) => {
      bookingData.date = e.target.value;
      generateTimeSlots();
    });
  }

  function generateTimeSlots() {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';
    
    // Simulate available timeslots
    const defaultSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM'];
    
    defaultSlots.forEach(slot => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn time-slot-btn m-1';
      button.innerText = slot;
      button.addEventListener('click', () => {
        document.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        bookingData.timeSlot = slot;
        document.querySelector(`.booking-step[data-step="3"] .btn-next-step`).removeAttribute('disabled');
      });
      timeSlotsContainer.appendChild(button);
    });
  }

  // Navigation Logic
  const updateWizardUI = () => {
    // Update step visibility
    steps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      step.style.display = stepNum === currentStep ? 'block' : 'none';
    });

    // Update progress dots
    stepDots.forEach((dot, index) => {
      const dotStep = index + 1;
      dot.classList.remove('active', 'completed');
      if (dotStep === currentStep) {
        dot.classList.add('active');
      } else if (dotStep < currentStep) {
        dot.classList.add('completed');
      }
    });

    // Update progress bar width
    if (progressBar) {
      const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Populate Booking Summary in Step 4
    if (currentStep === 4) {
      document.getElementById('summary-service').innerText = bookingData.serviceName || 'Not Selected';
      document.getElementById('summary-doctor').innerText = bookingData.doctorName || 'Not Selected';
      document.getElementById('summary-datetime').innerText = `${bookingData.date || 'Not Selected'} at ${bookingData.timeSlot || 'Not Selected'}`;
    }
  };

  // Hook Step Buttons
  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateWizardUI();
      }
    });
  });

  prevStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  });

  // Handle Form Submission with Simulated Razorpay
  bookingWizard.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Read final user inputs
    bookingData.patientName = document.getElementById('patient-name').value;
    bookingData.patientPhone = document.getElementById('patient-phone').value;
    bookingData.patientEmail = document.getElementById('patient-email').value;
    bookingData.patientNotes = document.getElementById('patient-notes').value;

    if (!bookingData.patientName || !bookingData.patientPhone || !bookingData.patientEmail) {
      alert('Please fill out all required fields.');
      return;
    }

    // Trigger Simulated Razorpay Checkout Dialog
    simulateRazorpayPayment(() => {
      // Success Callback: Write to LocalStorage database
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const newBooking = {
        ...bookingData,
        id: 'APT-' + Math.floor(100000 + Math.random() * 900000),
        paymentId: 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
        paymentStatus: 'Paid via Razorpay',
        bookingStatus: 'scheduled',
        created_at: new Date().toLocaleString('en-IN')
      };
      appointments.push(newBooking);
      localStorage.setItem('appointments', JSON.stringify(appointments));

      // Populate success details in the modal
      document.getElementById('success-summary-service').innerText = newBooking.serviceName;
      document.getElementById('success-summary-doctor').innerText = newBooking.doctorName;
      document.getElementById('success-summary-datetime').innerText = `${newBooking.date} at ${newBooking.timeSlot}`;
      document.getElementById('success-patient-name').innerText = newBooking.patientName;

      // Show success modal
      const successModal = document.getElementById('successModal');
      if (successModal) {
        successModal.style.display = 'block';
        successModal.classList.add('show');
        document.body.classList.add('modal-open');
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    });
  });

  // Simulated Razorpay Modal Generator
  function simulateRazorpayPayment(onSuccess) {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(15,23,42,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
    
    const modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;width:90%;max-width:420px;border-radius:12px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.3);font-family:sans-serif;border:1px solid #e2e8f0;animation:float-slow 0.3s ease-out;';
    
    modal.innerHTML = `
      <div style="background:#0b2240;padding:20px;color:#fff;display:flex;align-items:center;justify-content:between;">
        <div>
          <h5 style="margin:0;font-weight:700;font-size:1.1rem;letter-spacing:-0.5px;">Smile Dental Clinic</h5>
          <span style="font-size:0.8rem;opacity:0.8;">Appointment Booking Deposit</span>
        </div>
        <div style="margin-left:auto;text-align:right;">
          <h5 style="margin:0;font-weight:700;color:#10b981;">₹500.00</h5>
          <span style="font-size:0.75rem;opacity:0.8;">INR</span>
        </div>
      </div>
      <div style="padding:25px;background:#f8fafc;">
        <p style="font-size:0.85rem;color:#64748b;margin-bottom:20px;line-height:1.4;">This is a simulated secure Razorpay Payment Gateway integration for client review.</p>
        
        <div style="border:1px solid #e2e8f0;border-radius:8px;background:#fff;padding:15px;margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;font-size:0.9rem;font-weight:600;color:#0f172a;">
            <i class="bi bi-qr-code" style="color:#0ea5e9;font-size:1.2rem;"></i> UPI / QR Code (Recommended)
          </div>
          <div style="display:flex;align-items:center;gap:12px;font-size:0.9rem;font-weight:600;color:#0f172a;border-top:1px solid #f1f5f9;padding-top:12px;">
            <i class="bi bi-credit-card" style="color:#0ea5e9;font-size:1.2rem;"></i> Cards, Netbanking & Wallets
          </div>
        </div>

        <button id="rzp-sim-success" type="button" style="background:#10b981;color:#fff;border:none;width:100%;padding:12px;border-radius:6px;font-weight:600;transition:all 0.2s;">
          Simulate Payment Success
        </button>
        <button id="rzp-sim-cancel" type="button" style="background:transparent;color:#64748b;border:none;width:100%;padding:8px;margin-top:10px;font-size:0.85rem;">
          Cancel Transaction
        </button>
      </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    document.getElementById('rzp-sim-success').addEventListener('click', () => {
      backdrop.remove();
      onSuccess();
    });

    document.getElementById('rzp-sim-cancel').addEventListener('click', () => {
      backdrop.remove();
      alert('Payment cancelled by patient. Reservation not completed.');
    });
  }

  // Handle Modal Close
  const closeBtns = document.querySelectorAll('[data-bs-dismiss="modal"]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const successModal = document.getElementById('successModal');
      if (successModal) {
        successModal.style.display = 'none';
        successModal.classList.remove('show');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        
        // Reset the wizard back to step 1 and clear form
        bookingWizard.reset();
        currentStep = 1;
        bookingData = { service: '', serviceName: '', doctor: '', doctorName: '', date: '', timeSlot: '', patientName: '', patientPhone: '', patientEmail: '', patientNotes: '' };
        
        document.querySelectorAll('.service-select-card, .doctor-select-card').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('.btn-next-step').forEach((b, idx) => {
          if (idx < 3) b.setAttribute('disabled', 'true');
        });
        updateWizardUI();
      }
    });
  });

  // Set initial wizard visual state
  updateWizardUI();
}
