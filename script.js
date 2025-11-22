// Page navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    const breadcrumb = document.getElementById('currentPage');
    
    // Page titles for breadcrumb
    const pageTitles = {
        home: '🏠 Home',
        about: 'ℹ️ About',
        stories: '📚 Stories', 
        contact: '📧 Contact'
    };
    
    // Handle navigation
    function navigateToPage(targetPage) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        
        const targetButton = document.querySelector(`[data-page="${targetPage}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
            document.getElementById(`${targetPage}-page`).classList.add('active');
            breadcrumb.textContent = pageTitles[targetPage];
            
            // Show navigation feedback
            showNotification(`Navigated to ${pageTitles[targetPage]}`, 'info');
        }
    }
    
    // Handle navigation button clicks
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPage = button.getAttribute('data-page');
            navigateToPage(targetPage);
        });
    });
    
    // Handle quick action buttons
    document.querySelectorAll('.quick-btn, .feature-item.clickable').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.getAttribute('data-page');
            if (targetPage) navigateToPage(targetPage);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchData = [
        { title: 'Home', page: 'home', keywords: 'welcome start main' },
        { title: 'About Kuzhi', page: 'about', keywords: 'character info kuzhi underworld' },
        { title: 'First Adventure', page: 'stories', keywords: 'story adventure journey' },
        { title: 'Contact', page: 'contact', keywords: 'message email touch' }
    ];
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 1) {
            const results = searchData.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.keywords.includes(query)
            );
            showSearchResults(results);
        } else {
            hideSearchResults();
        }
    });
    
    function showSearchResults(results) {
        const resultsDiv = document.getElementById('searchResults');
        if (results.length > 0) {
            resultsDiv.innerHTML = results.map(item => 
                `<div class="search-result-item" data-page="${item.page}">${item.title}</div>`
            ).join('');
            resultsDiv.style.display = 'block';
            
            // Handle result clicks
            resultsDiv.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    navigateToPage(item.getAttribute('data-page'));
                    hideSearchResults();
                    searchInput.value = '';
                });
            });
        } else {
            resultsDiv.innerHTML = '<div class="search-result-item">No results found</div>';
            resultsDiv.style.display = 'block';
        }
    }
    
    function hideSearchResults() {
        document.getElementById('searchResults').style.display = 'none';
    }
    
    // Help system
    document.getElementById('helpBtn').addEventListener('click', () => {
        showHelpModal();
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
        showNotification(`Switched to ${isDark ? 'dark' : 'light'} theme`, 'success');
    });
    
    // Enhanced form handling
    const contactForm = document.querySelector('.contact-form');
    const clearBtn = document.getElementById('clearForm');
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.querySelector('.btn-text').style.display = 'none';
                submitBtn.querySelector('.btn-loading').style.display = 'inline';
                
                // Collect all form data
                const formData = {
                    name: name,
                    email: email,
                    phone: document.getElementById('phone').value,
                    location: document.getElementById('location').value,
                    service: document.getElementById('service').value,
                    budget: document.getElementById('budget').value,
                    timeline: document.getElementById('timeline').value,
                    message: message,
                    confidential: document.getElementById('confidential').checked,
                    urgent: document.getElementById('urgent').checked,
                    timestamp: new Date().toLocaleString()
                };
                
                // Send email
                sendEmailToOwner(formData)
                    .then(() => {
                        showNotification(`Thank you ${name}! Your hiring request has been sent to Kuzhi.`, 'success');
                        this.reset();
                    })
                    .catch(() => {
                        showNotification('Error sending request. Please try again.', 'error');
                    })
                    .finally(() => {
                        // Reset button state
                        submitBtn.disabled = false;
                        submitBtn.querySelector('.btn-text').style.display = 'inline';
                        submitBtn.querySelector('.btn-loading').style.display = 'none';
                    });
            }
        });
        
        // Clear form button
        clearBtn.addEventListener('click', () => {
            contactForm.reset();
            showNotification('Form cleared!', 'info');
        });
    }
    
    // Handle story read more buttons
    const readButtons = document.querySelectorAll('.read-btn');
    readButtons.forEach(button => {
        button.addEventListener('click', function() {
            const storyTitle = this.parentElement.querySelector('h3').textContent;
            showNotification(`Opening "${storyTitle}" story...`, 'info');
        });
    });
    
    // Add smooth animations to cards
    const cards = document.querySelectorAll('.welcome-card, .info-card, .stories-card, .contact-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Animate cards when page loads
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
                padding: 0 0.5rem;
            }
            .notification-close:hover {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        const navButtons = document.querySelectorAll('.nav-btn');
        let currentIndex = Array.from(navButtons).findIndex(btn => btn.classList.contains('active'));
        
        switch(e.key) {
            case '1':
                e.preventDefault();
                navButtons[0].click();
                break;
            case '2':
                e.preventDefault();
                navButtons[1].click();
                break;
            case '3':
                e.preventDefault();
                navButtons[2].click();
                break;
            case '4':
                e.preventDefault();
                navButtons[3].click();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                currentIndex = currentIndex > 0 ? currentIndex - 1 : navButtons.length - 1;
                navButtons[currentIndex].click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                currentIndex = currentIndex < navButtons.length - 1 ? currentIndex + 1 : 0;
                navButtons[currentIndex].click();
                break;
        }
    }
});

// Help modal system
function showHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
        <div class="help-content">
            <div class="help-header">
                <h3>🎆 Welcome to Kuzhi's Underworld!</h3>
                <button class="help-close">×</button>
            </div>
            <div class="help-body">
                <div class="help-section">
                    <h4>🗺️ Navigation Tips:</h4>
                    <ul>
                        <li>Use the colorful buttons to switch between pages</li>
                        <li>Try keyboard shortcuts: Ctrl+1,2,3,4</li>
                        <li>Click on feature cards for quick navigation</li>
                        <li>Use the search box to find content quickly</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>🌈 Features:</h4>
                    <ul>
                        <li>🌙 Toggle dark/light theme with the moon button</li>
                        <li>🔍 Search for stories and characters</li>
                        <li>💬 Send messages directly to Kuzhi</li>
                        <li>📱 Fully responsive - works on mobile!</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>✨ Pro Tips:</h4>
                    <ul>
                        <li>Hover over elements to see interactive effects</li>
                        <li>All forms have helpful validation</li>
                        <li>Notifications will guide you through actions</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    const helpContent = modal.querySelector('.help-content');
    helpContent.style.cssText = `
        background: white;
        border-radius: 20px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;
    
    const helpHeader = modal.querySelector('.help-header');
    helpHeader.style.cssText = `
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 20px 20px 0 0;
    `;
    
    const helpBody = modal.querySelector('.help-body');
    helpBody.style.cssText = `
        padding: 2rem;
    `;
    
    const helpSections = modal.querySelectorAll('.help-section');
    helpSections.forEach(section => {
        section.style.cssText = `
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
            border-left: 4px solid #FFD700;
        `;
    });
    
    const closeBtn = modal.querySelector('.help-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    `;
    
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    document.body.appendChild(modal);
}

// Add CSS animations for modals
if (!document.querySelector('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        }
        .search-result-item {
            padding: 0.8rem;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            color: #333;
            transition: background 0.2s ease;
        }
        .search-result-item:hover {
            background: #f5f5f5;
        }
        .feature-item.clickable {
            cursor: pointer;
            border: 2px solid transparent;
        }
        .feature-item.clickable:hover {
            border-color: #FFD700;
            transform: translateY(-8px);
        }
        .feature-item small {
            display: block;
            margin-top: 0.5rem;
            color: #FFD700;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .feature-item.clickable:hover small {
            opacity: 1;
        }
        .form-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        .clear-btn {
            background: rgba(255, 0, 0, 0.1);
            color: #ff4444;
            border: 2px solid #ff4444;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .clear-btn:hover {
            background: #ff4444;
            color: white;
        }
        .form-help {
            text-align: center;
            margin-top: 1rem;
            color: #666;
        }
        .form-help small {
            background: rgba(255, 215, 0, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 15px;
            border-left: 3px solid #FFD700;
        }
    `;
    document.head.appendChild(style);
}

// Story toggle functionality
function toggleStory() {
    const storyContent = document.getElementById('storyContent');
    const readBtn = event.target;
    
    if (storyContent.style.display === 'none') {
        storyContent.style.display = 'block';
        readBtn.textContent = 'Close Story';
        // Smooth scroll to story
        setTimeout(() => {
            storyContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        storyContent.style.display = 'none';
        readBtn.textContent = 'Read More';
    }
}

// Hiring form functionality
function setContactType(type) {
    const optionBtns = document.querySelectorAll('.option-btn');
    const messageLabel = document.getElementById('messageLabel');
    const messageField = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn .btn-text');
    
    // Update active button
    optionBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.option-btn').classList.add('active');
    
    if (type === 'consult') {
        messageLabel.innerHTML = '💬 Consultation Request *';
        messageField.placeholder = 'Briefly describe your situation for a free consultation...';
        submitBtn.innerHTML = '📞 Request Free Consultation';
    } else {
        messageLabel.innerHTML = '📜 Project Details *';
        messageField.placeholder = 'Describe your situation, requirements, and any specific details Kuzhi should know...';
        submitBtn.innerHTML = '💼 Submit Hiring Request';
    }
}

// Email sending function
function sendEmailToOwner(formData) {
    // For actual email functionality, you need to:
    // 1. Set up EmailJS account at https://www.emailjs.com/
    // 2. Create email template
    // 3. Get your service ID and template ID
    // 4. Add EmailJS script to HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    // 5. Initialize: emailjs.init('YOUR_PUBLIC_KEY');
    
    // Example EmailJS implementation:
    /*
    return emailjs.send('service_id', 'template_id', {
        to_email: 'abhinavr3238s@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        location: formData.location,
        service: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message,
        confidential: formData.confidential ? 'Yes' : 'No',
        urgent: formData.urgent ? 'Yes' : 'No',
        timestamp: formData.timestamp
    });
    */
    
    // Temporary simulation - replace with actual email service
    return new Promise((resolve) => {
        console.log('Form Data to be emailed:', formData);
        setTimeout(resolve, 2000);
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        showNotification('Welcome to Kuzhi\'s Underworld! Click the ? button for help.', 'info');
    }, 100);
});