// Navigation functionality
const nav = document.querySelector('.nav');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navigation background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(250, 249, 246, 0.98)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(250, 249, 246, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// Active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes and observe elements
function initAnimations() {
    const animatedElements = [
        { selector: '.hero-content', animation: 'fade-in' },
        { selector: '.hero-image', animation: 'slide-in-right' },
        { selector: '.about-text', animation: 'slide-in-left' },
        { selector: '.about-image', animation: 'slide-in-right' },
        { selector: '.skill-category', animation: 'fade-in' },
        { selector: '.project-card', animation: 'fade-in' },
        { selector: '.contact-info', animation: 'slide-in-left' },
        { selector: '.contact-form', animation: 'slide-in-right' }
    ];

    animatedElements.forEach(({ selector, animation }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add(animation);
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initAnimations);

// Typing animation for hero title
function typeWriter() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = 'Hello, I\'m';
    const speed = 100;
    let i = 0;
    
    typingElement.textContent = '';
    
    function type() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 1000);
}

// Start typing animation when page loads
window.addEventListener('load', typeWriter);

// Stats counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 50);
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}
//skill section
// Load data from JSON and initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        renderTimeline(data.experiences);
        renderSkills(data.skills);
        initializeAnimations();
        initializeInteractiveFeatures();
        initializeTypewriterEffect();
    } catch (error) {
        console.error('Error loading data:', error);
        initializeAnimations();
        initializeInteractiveFeatures();
        initializeTypewriterEffect();
    }
});

// Render timeline from JSON data
function renderTimeline(experiences) {
    const timeline = document.getElementById('timeline');
    if (!timeline || !experiences) return;
    
    timeline.innerHTML = '';
    
    experiences.forEach((exp, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        const achievementsList = exp.achievements.map(achievement => 
            `<li>${achievement}</li>`
        ).join('');
        
        const techTags = exp.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        timelineItem.innerHTML = `
            <div class="timeline-marker">
                <div class="timeline-dot"></div>
                ${index < experiences.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content">
                <div class="experience-card">
                    <div class="card-header">
                        <h3 class="position">${exp.position}</h3>
                        <span class="duration">${exp.duration}</span>
                    </div>
                    <h4 class="company">${exp.company}</h4>
                    <div class="description">
                        <p>${exp.description}</p>
                        <ul class="achievements">
                            ${achievementsList}
                        </ul>
                    </div>
                    <div class="tech-stack">
                        ${techTags}
                    </div>
                </div>
            </div>
        `;
        
        timeline.appendChild(timelineItem);
    });
}

// Render skills from JSON data
function renderSkills(skills) {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid || !skills) return;
    
    skillsGrid.innerHTML = '';
    
    Object.entries(skills).forEach(([category, items]) => {
        const skillCategory = document.createElement('div');
        skillCategory.className = 'skill-category';
        
        const skillItems = items.map(skill => 
            `<span>${skill}</span>`
        ).join('');
        
        skillCategory.innerHTML = `
            <h4>${category}</h4>
            <div class="skill-items">
                ${skillItems}
            </div>
        `;
        
        skillsGrid.appendChild(skillCategory);
    });
}

// Intersection Observer for scroll animations
const observerOptions2 = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions2);

// Initialize animations
function initializeAnimations() {
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            observer2.observe(item); // <-- fixed here
        });
        initializeSkillsAnimation();
    }, 100);
}

// Interactive features
function initializeInteractiveFeatures() {
    setTimeout(() => {
        const experienceCards = document.querySelectorAll('.experience-card');
        
        experienceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        const timelineDots = document.querySelectorAll('.timeline-dot');
        timelineDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const correspondingCard = experienceCards[index];
                if (correspondingCard) {
                    correspondingCard.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            });
        });
    }, 200);
}

// Skills animation
function initializeSkillsAnimation() {
    const skillsSection = document.querySelector('.skills-summary');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItems = document.querySelectorAll('.skill-items span');
                skillItems.forEach((skill, index) => {
                    setTimeout(() => {
                        skill.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.3 });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// Typewriter effect
function initializeTypewriterEffect() {
    const title = document.querySelector('.section-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '3px solid #000';
    
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                title.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple form validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
const originalText = submitButton.textContent;

submitButton.textContent = 'Sending...';
submitButton.disabled = true;

fetch('/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, subject, message }),
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text();
})
.then(data => {
    alert('Thank you for your message! I\'ll get back to you soon.');
    contactForm.reset();
})
.catch(error => {
    alert('Something went wrong. Please try again later.');
    console.error('Error:', error);
})
.finally(() => {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
});

    });
}

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add smooth reveal animation for skill categories
const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach((category, index) => {
    category.style.transitionDelay = `${index * 0.2}s`;
});

// Add dynamic background color change on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            const sectionId = section.getAttribute('id');
            document.body.setAttribute('data-section', sectionId);
        }
    });
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove loading class after a delay
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);
});

// Add scroll to top functionality
function createScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--black);
        color: var(--bone-white);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
createScrollToTop();

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add focus management for accessibility
const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
);

// Trap focus in mobile menu when open
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        const focusableMenuElements = navMenu.querySelectorAll('a');
        const firstElement = focusableMenuElements[0];
        const lastElement = focusableMenuElements[focusableMenuElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});
