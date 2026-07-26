document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // Initialize Lucide Icons
  // ==========================================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // Header / Sticky Navbar on Scroll
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });

  // ==========================================================================
  // Mobile Navigation Toggle
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('mobile-active');
    });

    // Close menu when clicking on any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('mobile-active');
      });
    });
  }

  // ==========================================================================
  // Active Navigation Link on Scroll (Scrollspy)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');

  function highlightNavigation() {
    const scrollPosition = window.scrollY + 100; // Offset for navbar height

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.getElementById(`link-${sectionId}`);

      if (correspondingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        } else if (scrollPosition < sections[0].offsetTop - 120) {
          // If above first section, remove active from all links
          navLinks.forEach(link => link.classList.remove('active'));
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);
  highlightNavigation(); // Run on load

  // ==========================================================================
  // Interactive Hover Glow Track (Mouse Move)
  // ==========================================================================
  const cards = document.querySelectorAll('.card-wrapper');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================================================
  // Scroll-Triggered Reveal Animations & Skill Bars
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const revealObserverOptions = {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters the viewport
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Separate observer for skill competency animations
  const skillsObserverOptions = {
    root: null,
    threshold: 0.2
  };

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetProgress = bar.getAttribute('data-progress');
          bar.style.width = targetProgress;
        });
        observer.unobserve(entry.target);
      }
    });
  }, skillsObserverOptions);

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ==========================================================================
  // Contact Form Submission Simulation
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Select form fields
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Check fields are filled (HTML attributes double safety)
      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all the fields.', 'error');
        return;
      }

      // Visual Loading state
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = `Sending... <i data-lucide="loader-2" class="animate-spin" style="width: 18px; height: 18px;"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons(); // render spinner icon

      // Send message via FormSubmit API
      fetch('https://formsubmit.co/ajax/buddikasampathwork@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `New Portfolio Message: ${subject}`,
          message: message
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Restore button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (typeof lucide !== 'undefined') lucide.createIcons();

          // Successful submit feedback
          showStatus('Message sent successfully! Thank you for reaching out.', 'success');

          // Reset form inputs
          contactForm.reset();

          // Clear active classes of labels (since placeholder-shown triggers again on reset)
          document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.blur();
          });
        })
        .catch(error => {
          // Restore button state
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (typeof lucide !== 'undefined') lucide.createIcons();

          showStatus('Failed to send message. Please try again later.', 'error');
        });
    });
  }

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;

    // Clear message after 5 seconds
    setTimeout(() => {
      formStatus.style.opacity = '0';
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        formStatus.style.opacity = '1';
      }, 300);
    }, 5000);
  }
});
