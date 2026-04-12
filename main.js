// INAP Course Website — legado (no enlazado en HTML). Usar site.js.
// Johan Tapia, PhD - 2024

// Global variables
const INAP_CONFIG = {
    colors: {
        primary: '#0f2b5b',
        secondary: '#1e40af',
        lightBlue: '#dbeafe',
        white: '#ffffff',
        gray50: '#f8fafc',
        gray100: '#f1f5f9',
        gray600: '#64748b',
        gray800: '#1e293b'
    },
    animations: {
        duration: 300,
        easing: 'ease-out'
    }
};

// Utility functions
const Utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Smooth scroll to element
    scrollTo: function(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Format date for display
    formatDate: function(date) {
        return new Intl.DateTimeFormat('es-DO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Generate unique ID
    generateId: function(prefix = 'id') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Progress tracking system
const ProgressTracker = {
    storageKey: 'inap-course-progress',
    
    // Initialize progress tracker
    init: function() {
        this.loadProgress();
        this.updateUI();
    },
    
    // Load progress from localStorage
    loadProgress: function() {
        const saved = localStorage.getItem(this.storageKey);
        this.data = saved ? JSON.parse(saved) : {};
    },
    
    // Save progress to localStorage
    saveProgress: function() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    },
    
    // Update progress for a specific unit
    updateProgress: function(unitId, percentage) {
        this.data[unitId] = {
            percentage: Math.min(100, Math.max(0, percentage)),
            lastUpdated: new Date().toISOString()
        };
        this.saveProgress();
        this.updateUI();
    },
    
    // Get progress for a unit
    getProgress: function(unitId) {
        return this.data[unitId] ? this.data[unitId].percentage : 0;
    },
    
    // Update UI elements with current progress
    updateUI: function() {
        document.querySelectorAll('[data-progress-unit]').forEach(element => {
            const unitId = element.dataset.progressUnit;
            const progress = this.getProgress(unitId);
            
            // Update progress bar
            const progressBar = element.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            // Update percentage text
            const percentageText = element.querySelector('.percentage-text');
            if (percentageText) {
                percentageText.textContent = `${progress}%`;
            }
        });
    }
};

// Notification system
const NotificationSystem = {
    container: null,
    
    // Initialize notification system
    init: function() {
        this.createContainer();
    },
    
    // Create notification container
    createContainer: function() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'fixed top-20 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
    },
    
    // Show notification
    show: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification bg-white border-l-4 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
        
        // Set border color based on type
        const colors = {
            info: 'border-blue-400',
            success: 'border-green-400',
            warning: 'border-yellow-400',
            error: 'border-red-400'
        };
        
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle'
        };
        
        notification.classList.add(colors[type]);
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="${icons[type]} text-${type === 'info' ? 'blue' : type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'}-400 mr-3"></i>
                <div class="flex-1">
                    <p class="text-sm text-gray-800">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};

// Animation system
const AnimationSystem = {
    // Initialize animations
    init: function() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    },
    
    // Setup scroll-based animations
    setupScrollAnimations: function() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    },
    
    // Animate individual element
    animateElement: function(element) {
        const animationType = element.dataset.animate;
        
        switch (animationType) {
            case 'fade-in':
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
                break;
                
            case 'slide-in-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-30px)';
                element.style.transition = 'all 0.8s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }, 100);
                break;
                
            case 'slide-in-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(30px)';
                element.style.transition = 'all 0.8s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }, 100);
                break;
        }
    },
    
    // Setup hover effects
    setupHoverEffects: function() {
        document.querySelectorAll('[data-hover-effect]').forEach(element => {
            const effect = element.dataset.hoverEffect;
            
            element.addEventListener('mouseenter', () => {
                switch (effect) {
                    case 'lift':
                        element.style.transform = 'translateY(-4px) scale(1.02)';
                        break;
                    case 'scale':
                        element.style.transform = 'scale(1.05)';
                        break;
                    case 'glow':
                        element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                        break;
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.boxShadow = '';
            });
        });
    }
};

// Modal system
const ModalSystem = {
    activeModal: null,
    
    // Initialize modal system
    init: function() {
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeModal && e.target.classList.contains('modal-backdrop')) {
                this.close(this.activeModal);
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });
    },
    
    // Open modal
    open: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            this.activeModal = modalId;
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Close modal
    close: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            this.activeModal = null;
            document.body.style.overflow = 'auto';
        }
    }
};

// Navigation system
const NavigationSystem = {
    currentPage: 'index',
    
    // Initialize navigation
    init: function() {
        this.detectCurrentPage();
        this.setupNavigation();
        this.setupMobileMenu();
    },
    
    // Detect current page
    detectCurrentPage: function() {
        const path = window.location.pathname;
        if (path.includes('unidad1')) this.currentPage = 'unidad1';
        else if (path.includes('unidad2')) this.currentPage = 'unidad2';
        else if (path.includes('unidad3')) this.currentPage = 'unidad3';
        else if (path.includes('ley4108')) this.currentPage = 'ley4108';
        else if (path.includes('casos')) this.currentPage = 'casos';
        else if (path.includes('glosario')) this.currentPage = 'glosario';
        else this.currentPage = 'index';
    },
    
    // Setup navigation highlighting
    setupNavigation: function() {
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(this.currentPage)) {
                link.classList.add('active');
            }
        });
    },
    
    // Setup mobile menu
    setupMobileMenu: function() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
};

// Progress bar system
const ProgressBar = {
    // Initialize progress bar
    init: function() {
        this.update();
        window.addEventListener('scroll', Utils.debounce(() => this.update(), 100));
    },
    
    // Update progress bar
    update: function() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }
};

// Course navigation
const CourseNavigation = {
    // Navigate to specific unit
    goToUnit: function(unitId) {
        // Store current unit
        localStorage.setItem('currentUnit', unitId);
        
        // Show notification
        NotificationSystem.show(`Navegando a ${unitId}...`, 'info');
        
        // Navigate to page
        setTimeout(() => {
            window.location.href = `${unitId}.html`;
        }, 500);
    },
    
    // Start course
    startCourse: function() {
        this.goToUnit('unidad1');
    },
    
    // Show progress
    showProgress: function() {
        const totalProgress = ProgressTracker.getOverallProgress();
        NotificationSystem.show(`Progreso total del curso: ${totalProgress}%`, 'info');
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    ProgressTracker.init();
    NotificationSystem.init();
    AnimationSystem.init();
    ModalSystem.init();
    NavigationSystem.init();
    ProgressBar.init();
    
    // Setup smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                Utils.scrollTo(target, 80);
            }
        });
    });
    
    console.log('INAP Course Website initialized successfully');
});

// Export for global use
window.INAP = {
    Utils,
    ProgressTracker,
    NotificationSystem,
    AnimationSystem,
    ModalSystem,
    NavigationSystem,
    ProgressBar,
    CourseNavigation
};