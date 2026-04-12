// Legado — no enlazado en HTML. La app usa site.js.

// Enhanced Course Navigation
const EnhancedNavigation = {
    // Initialize enhanced navigation
    init: function() {
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupKeyboardNavigation();
    },
    
    // Setup smooth scrolling for all internal links
    setupSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },
    
    // Setup active navigation highlighting
    setupActiveNavigation: function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    },
    
    // Setup keyboard navigation
    setupKeyboardNavigation: function() {
        document.addEventListener('keydown', (e) => {
            // ESC key to close modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.case-modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
            
            // Arrow keys for navigation
            if (e.altKey) {
                switch(e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateToNextUnit();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateToPreviousUnit();
                        break;
                }
            }
        });
    },
    
    // Navigate to next unit
    navigateToNextUnit: function() {
        const currentPage = this.getCurrentPage();
        const pageOrder = ['index', 'unidad1', 'unidad2', 'unidad3', 'ley4108', 'casos', 'glosario'];
        const currentIndex = pageOrder.indexOf(currentPage);
        
        if (currentIndex < pageOrder.length - 1) {
            const nextPage = pageOrder[currentIndex + 1];
            this.navigateToPage(nextPage);
        }
    },
    
    // Navigate to previous unit
    navigateToPreviousUnit: function() {
        const currentPage = this.getCurrentPage();
        const pageOrder = ['index', 'unidad1', 'unidad2', 'unidad3', 'ley4108', 'casos', 'glosario'];
        const currentIndex = pageOrder.indexOf(currentPage);
        
        if (currentIndex > 0) {
            const prevPage = pageOrder[currentIndex - 1];
            this.navigateToPage(prevPage);
        }
    },
    
    // Get current page name
    getCurrentPage: function() {
        const path = window.location.pathname;
        if (path.includes('unidad1')) return 'unidad1';
        if (path.includes('unidad2')) return 'unidad2';
        if (path.includes('unidad3')) return 'unidad3';
        if (path.includes('ley4108')) return 'ley4108';
        if (path.includes('casos')) return 'casos';
        if (path.includes('glosario')) return 'glosario';
        return 'index';
    },
    
    // Navigate to specific page
    navigateToPage: function(page) {
        if (page === 'index') {
            window.location.href = 'index.html';
        } else {
            window.location.href = `${page}.html`;
        }
    }
};

// Enhanced Progress Tracking
const EnhancedProgress = {
    storageKey: 'inap-course-progress-v2',
    
    // Initialize enhanced progress tracking
    init: function() {
        this.loadProgress();
        this.trackPageView();
        this.updateProgressUI();
    },
    
    // Load progress from localStorage
    loadProgress: function() {
        const saved = localStorage.getItem(this.storageKey);
        this.data = saved ? JSON.parse(saved) : {
            pagesVisited: [],
            totalTime: 0,
            lastVisit: null,
            progressByUnit: {}
        };
    },
    
    // Save progress to localStorage
    saveProgress: function() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    },
    
    // Track page view
    trackPageView: function() {
        const currentPage = EnhancedNavigation.getCurrentPage();
        const timestamp = new Date().toISOString();
        
        if (!this.data.pagesVisited.includes(currentPage)) {
            this.data.pagesVisited.push(currentPage);
        }
        
        this.data.lastVisit = timestamp;
        this.saveProgress();
    },
    
    // Update progress UI
    updateProgressUI: function() {
        const totalPages = 7; // Total number of pages
        const visitedPages = this.data.pagesVisited.length;
        const overallProgress = Math.round((visitedPages / totalPages) * 100);
        
        // Update progress bars
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const unit = bar.closest('[data-progress-unit]')?.dataset.progressUnit;
            if (unit && this.data.pagesVisited.includes(unit)) {
                bar.style.width = '100%';
            }
        });
        
        // Update percentage texts
        document.querySelectorAll('.percentage-text').forEach(text => {
            const unit = text.closest('[data-progress-unit]')?.dataset.progressUnit;
            if (unit && this.data.pagesVisited.includes(unit)) {
                text.textContent = '100%';
            }
        });
    },
    
    // Get overall progress
    getOverallProgress: function() {
        const totalPages = 7;
        const visitedPages = this.data.pagesVisited.length;
        return Math.round((visitedPages / totalPages) * 100);
    }
};

// Enhanced Animations
const EnhancedAnimations = {
    // Initialize enhanced animations
    init: function() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
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
    },
    
    // Setup loading animations
    setupLoadingAnimations: function() {
        // Add loading animation to buttons
        document.querySelectorAll('button[onclick]').forEach(button => {
            const originalOnClick = button.getAttribute('onclick');
            
            button.addEventListener('click', function(e) {
                const originalText = this.innerHTML;
                
                // Add loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Cargando...';
                this.disabled = true;
                
                // Restore after animation
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1000);
            });
        });
    }
};

// Enhanced Modal System
const EnhancedModal = {
    activeModal: null,
    
    // Initialize enhanced modal system
    init: function() {
        this.setupEventListeners();
        this.setupAccessibility();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeModal && e.target.classList.contains('case-modal')) {
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
    
    // Setup accessibility features
    setupAccessibility: function() {
        // Add ARIA attributes to modals
        document.querySelectorAll('.case-modal').forEach(modal => {
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('role', 'dialog');
        });
    },
    
    // Open modal with enhanced features
    open: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            this.activeModal = modalId;
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    },
    
    // Close modal with enhanced features
    close: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            this.activeModal = null;
            document.body.style.overflow = 'auto';
        }
    }
};

// Initialize all enhanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    EnhancedNavigation.init();
    EnhancedProgress.init();
    EnhancedAnimations.init();
    EnhancedModal.init();
    
    console.log('Enhanced features initialized successfully');
});

// Export for global use
window.Enhanced = {
    Navigation: EnhancedNavigation,
    Progress: EnhancedProgress,
    Animations: EnhancedAnimations,
    Modal: EnhancedModal
};