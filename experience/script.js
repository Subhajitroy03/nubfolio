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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Initialize animations
function initializeAnimations() {
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            observer.observe(item);
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