// Add at the beginning of the file
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn === 'true' && userName) {
        updateNavigationAfterAuth(userName);
        updateHeroButtons();
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);

// Enhanced smooth scrolling with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Add active state to navigation items based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.main-nav a[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// Contact form handling
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    if (!email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    alert('Message sent successfully!');
    this.reset();
});

// Login button functionality
document.querySelector('.login-btn')?.addEventListener('click', function() {
    alert('Login functionality coming soon!');
});

// Mobile navigation toggle
function createMobileNav() {
    const nav = document.querySelector('.main-nav');
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
        hamburger.innerHTML = nav.classList.contains('nav-open') ? '✕' : '☰';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && nav.classList.contains('nav-open')) {
            nav.classList.remove('nav-open');
            hamburger.innerHTML = '☰';
        }
    });

    nav.insertBefore(hamburger, nav.firstChild);
}

// Initialize mobile navigation on small screens
if (window.innerWidth <= 768) {
    createMobileNav();
}

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// Add hover effect to navigation
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('mouseenter', (e) => {
        const rect = e.target.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.classList.add('nav-highlight');
        highlight.style.width = `${rect.width}px`;
        highlight.style.transform = `translateX(${rect.left}px)`;
        document.body.appendChild(highlight);
    });
    link.addEventListener('mouseleave', () => {
        document.querySelectorAll('.nav-highlight').forEach(h => h.remove());
    });
});

// Cleanup observer
function cleanup() {
    observer.disconnect();
    document.querySelectorAll('.nav-highlight').forEach(h => h.remove());
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cleanup();
    }
});

// Enhanced Auth Modal Functionality
const authModal = document.querySelector('.auth-modal');
const loginBtn = document.querySelector('.login-btn');
const closeModal = document.querySelector('.close-modal');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

// Function to close modal
function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Function to switch tabs
function switchAuthTab(tabName) {
    // Remove active class from all tabs and forms
    authTabs.forEach(tab => tab.classList.remove('active'));
    authForms.forEach(form => form.classList.remove('active'));
    
    // Add active class to selected tab and form
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedForm = document.getElementById(`${tabName}-form`);
    
    if (selectedTab && selectedForm) {
        selectedTab.classList.add('active');
        selectedForm.classList.add('active');
    }
}

// Close modal when clicking close button or outside modal
closeModal?.addEventListener('click', closeAuthModal);
authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// Handle tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchAuthTab(tab.dataset.tab);
    });
});

// Open modal with specific tab
function openAuthModal(tab = 'login') {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab);
}

// Update all auth triggers
document.querySelectorAll('.open-auth').forEach(trigger => {
    trigger.addEventListener('click', () => {
        openAuthModal(trigger.dataset.auth || 'signup');
    });
});

// Add keyboard support for closing modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
        closeAuthModal();
    }
});

// Update login button to default to login tab
loginBtn?.addEventListener('click', () => openAuthModal('login'));

// Handle scroll to pricing when clicking "Learn More"
document.querySelector('.learn-more')?.addEventListener('click', () => {
    document.querySelector('#pricing').scrollIntoView({ behavior: 'smooth' });
});

// Form submissions with improved UX
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const email = e.target.querySelector('input[type="email"]').value;
    button.disabled = true;
    button.innerHTML = 'Logging in...';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const username = email.split('@')[0]; // Simple username extraction
        localStorage.setItem('userName', username);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        closeAuthModal();
        window.location.href = 'index.html';
    } catch (error) {
        alert('Login failed. Please try again.');
        button.disabled = false;
        button.innerHTML = 'Login';
    }
});

document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const nameInput = e.target.querySelector('input[type="text"]');
    button.disabled = true;
    button.innerHTML = 'Creating Account...';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.setItem('userName', nameInput.value);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        closeAuthModal();
        window.location.href = 'index.html';
    } catch (error) {
        alert('Signup failed. Please try again.');
        button.disabled = false;
        button.innerHTML = 'Sign Up';
    }
});

// Add click handler for pricing contact sales button
document.querySelector('.pricing-card:last-child .btn')?.addEventListener('click', () => {
    const contactForm = document.querySelector('.contact-form');
    contactForm.scrollIntoView({ behavior: 'smooth' });
    contactForm.querySelector('textarea').value = 'I\'m interested in Enterprise pricing...';
});

// Profile Circle Functionality
function updateNavigationAfterAuth(userName = 'User') {
    const loginBtn = document.querySelector('.login-btn');
    const nav = loginBtn.parentElement;
    
    // Create profile circle with dropdown
    const profileContainer = document.createElement('div');
    profileContainer.className = 'profile-container';
    
    const initials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    profileContainer.innerHTML = `
        <div class="profile-circle">
            <div class="default-avatar">${initials}</div>
        </div>
        <div class="profile-dropdown">
            <div class="profile-dropdown-header">
                <h4>${userName}</h4>
                <p>Student Account</p>
            </div>
            <div class="profile-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <span>Dashboard</span>
            </div>
            <div class="profile-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <span>Edit Profile</span>
            </div>
            <div class="profile-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
                <span>Settings</span>
            </div>
            <div class="profile-dropdown-item danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
                </svg>
                <span>Logout</span>
            </div>
        </div>
    `;
    
    // Replace login button with profile circle
    loginBtn.replaceWith(profileContainer);
    
    // Handle dropdown item clicks
    profileContainer.querySelectorAll('.profile-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.querySelector('span').textContent.toLowerCase();
            switch(action) {
                case 'dashboard':
                    window.location.href = 'dashboard.html';
                    break;
                case 'edit profile':
                    window.location.href = 'edit-profile.html';
                    break;
                case 'settings':
                    window.location.href = 'settings.html';
                    break;
                case 'logout':
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('loginTime');
                    window.location.href = 'index.html';
                    break;
            }
        });
    });
}

// Add session check to restricted pages
function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
}

// Update form submission handlers
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const email = e.target.querySelector('input[type="email"]').value;
    button.disabled = true;
    button.innerHTML = 'Logging in...';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const username = email.split('@')[0]; // Simple username extraction
        localStorage.setItem('userName', username);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        closeAuthModal();
        window.location.href = 'index.html';
    } catch (error) {
        alert('Login failed. Please try again.');
        button.disabled = false;
        button.innerHTML = 'Login';
    }
});

document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const nameInput = e.target.querySelector('input[type="text"]');
    button.disabled = true;
    button.innerHTML = 'Creating Account...';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.setItem('userName', nameInput.value);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        closeAuthModal();
        window.location.href = 'index.html';
    } catch (error) {
        alert('Signup failed. Please try again.');
        button.disabled = false;
        button.innerHTML = 'Sign Up';
    }
});

// Add welcome message handler
function showWelcomeMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const isWelcome = urlParams.get('welcome');
    const userName = urlParams.get('name') || localStorage.getItem('userName');
    const loginTime = localStorage.getItem('loginTime');
    const isRecentLogin = loginTime && (new Date() - new Date(loginTime)) < 5000;

    if (isWelcome && userName && isRecentLogin) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div class="welcome-content">
                <h3>Welcome back, ${userName}! 👋</h3>
                <p>Ready to continue your learning journey?</p>
            </div>
            <button class="close-welcome">&times;</button>
        `;
        
        document.body.appendChild(welcomeMessage);
        setTimeout(() => welcomeMessage.classList.add('active'), 100);
        
        // Update navigation with profile circle
        updateNavigationAfterAuth(userName);
        
        // Remove welcome message after 2 seconds
        setTimeout(() => {
            welcomeMessage.classList.remove('active');
            setTimeout(() => welcomeMessage.remove(), 300);
        }, 2000);
        
        // Allow manual close
        welcomeMessage.querySelector('.close-welcome').addEventListener('click', () => {
            welcomeMessage.classList.remove('active');
            setTimeout(() => welcomeMessage.remove(), 300);
        });
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Initialize welcome message if needed
document.addEventListener('DOMContentLoaded', showWelcomeMessage);

// Update hero section buttons based on login status
function updateHeroButtons() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const ctaButtons = document.querySelector('.cta-buttons');
    
    if (isLoggedIn && ctaButtons) {
        ctaButtons.innerHTML = `
            <a href="create-course.html" class="btn primary">Create Course</a>
        `;
    }
}

// Update active state for navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = ['how-it-works', 'testimonials', 'pricing'];
    const navItems = document.querySelectorAll('.main-nav a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section;
            }
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
