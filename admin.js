// Enhanced Admin Panel JavaScript - Version 2.0
class AdminPanel {
    constructor() {
        this.currentConfig = this.getDefaultConfig();
        this.validationRules = this.getValidationRules();
        this.isInitialized = false;
        this.debounceTimers = {};
        this.init();
    }

    getDefaultConfig() {
        return {
            REDIRECT_URL: "https://www.google.com",
            OG_TITLE: "Earn $100 daily",
            OG_DESCRIPTION: "Check out this amazing offer and start earning today!",
            OG_IMAGE_URL: "https://i.imghippo.com/files/gbuB7452ddM.png",
            DISPLAY_IMAGE_URL: "https://i.imghippo.com/files/gbuB7452ddM.png",
            REDIRECT_DELAY_MS: 2000,
            REDIRECT_MESSAGE: "Redirecting you shortly...",
            PAGE_TITLE: "Redirecting...",
            OG_URL: "https://rajonbd1.github.io/bestone/",
            CRAWLER_DETECTION: {
                facebook: true,
                twitter: false,
                linkedin: false,
                google: false
            },
            CUSTOM_CSS: "",
            SECURITY: {
                httpsOnly: false,
                strictReferrer: false
            }
        };
    }

    getValidationRules() {
        return {
            redirectUrl: {
                required: true,
                type: 'url',
                message: 'Please enter a valid URL'
            },
            ogTitle: {
                required: true,
                maxLength: 60,
                message: 'Title is required and should be under 60 characters'
            },
            ogDescription: {
                required: true,
                maxLength: 160,
                message: 'Description is required and should be under 160 characters'
            },
            ogUrl: {
                required: true,
                type: 'url',
                message: 'Please enter a valid canonical URL'
            },
            ogImageUrl: {
                type: 'url',
                message: 'Please enter a valid image URL'
            },
            displayImageUrl: {
                type: 'url',
                message: 'Please enter a valid image URL'
            },
            redirectDelay: {
                type: 'number',
                min: 0,
                max: 60,
                message: 'Delay must be between 0 and 60 seconds'
            },
            redirectMessage: {
                maxLength: 100,
                message: 'Message should be under 100 characters'
            },
            pageTitle: {
                maxLength: 60,
                message: 'Title should be under 60 characters'
            }
        };
    }

    async init() {
        try {
            this.showLoadingOverlay();

            // Initialize theme
            this.initializeTheme();

            // Load configuration
            await this.loadConfiguration();

            // Setup all event listeners
            this.setupEventListeners();
            this.setupNavigation();
            this.setupThemeToggle();
            this.setupHelpModal();
            this.setupPreviewTabs();
            this.setupValidation();

            // Load profiles and update preview
            this.loadProfiles();
            this.updateConfigPreview();

            // Small delay to ensure DOM is ready
            setTimeout(() => {
                this.updateAllPreviews();
                this.isInitialized = true;
                this.hideLoadingOverlay();
                this.showToast('Admin panel loaded successfully!', 'success');
            }, 100);
        } catch (error) {
            console.error('Error initializing admin panel:', error);
            this.hideLoadingOverlay();
            this.showToast('Error loading admin panel. Please refresh the page.', 'error');
        }
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('adminPanelTheme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('adminPanelTheme', newTheme);
        this.updateThemeIcon(newTheme);

        this.showToast(`Switched to ${newTheme} theme`, 'info');
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Loading Overlay
    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 500);
        }
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type] || icons.info}"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto hide
        const hideToast = () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };

        setTimeout(hideToast, duration);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', hideToast);
    }

    setupEventListeners() {
        // Save configuration
        document.getElementById('saveBtn').addEventListener('click', () => this.saveConfiguration());

        // Test now functionality
        document.getElementById('testBtn').addEventListener('click', () => this.testConfiguration());

        // Preview modal
        document.getElementById('previewBtn').addEventListener('click', () => this.showPreview());

        // Help modal
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelpModal());

        // Profile management
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfile());

        // Export/Import
        document.getElementById('exportConfigBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportJson());
        document.getElementById('importFile').addEventListener('change', (e) => this.importConfig(e));

        // Quick actions
        const resetBasicBtn = document.getElementById('resetBasicBtn');
        if (resetBasicBtn) {
            resetBasicBtn.addEventListener('click', () => this.resetBasicSettings());
        }

        const validateBasicBtn = document.getElementById('validateBasicBtn');
        if (validateBasicBtn) {
            validateBasicBtn.addEventListener('click', () => this.validateAllFields());
        }

        // Image tools
        const testImageBtn = document.getElementById('testImageBtn');
        if (testImageBtn) {
            testImageBtn.addEventListener('click', () => this.testImage());
        }

        const imageInfoBtn = document.getElementById('imageInfoBtn');
        if (imageInfoBtn) {
            imageInfoBtn.addEventListener('click', () => this.showImageInfo());
        }

        // Real-time updates
        this.setupRealTimeUpdates();

        // Modal event listeners
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Close modals when clicking outside or on close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
            if (e.target.classList.contains('modal-close')) {
                this.hideAllModals();
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    setupValidation() {
        // Setup real-time validation for all form fields
        Object.keys(this.validationRules).forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('blur', () => this.validateField(fieldId));
                element.addEventListener('input', () => {
                    this.debounceValidation(fieldId, 500);
                    this.updateCharCounter(fieldId);
                });
            }
        });

        // Setup delay display update
        const delayInput = document.getElementById('redirectDelay');
        if (delayInput) {
            delayInput.addEventListener('input', () => this.updateDelayDisplay());
        }
    }

    debounceValidation(fieldId, delay) {
        clearTimeout(this.debounceTimers[fieldId]);
        this.debounceTimers[fieldId] = setTimeout(() => {
            this.validateField(fieldId);
        }, delay);
    }

    validateField(fieldId) {
        const element = document.getElementById(fieldId);
        const rules = this.validationRules[fieldId];
        const formGroup = element.closest('.form-group');

        if (!element || !rules || !formGroup) return true;

        const value = element.value.trim();
        let isValid = true;
        let message = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            message = rules.message || 'This field is required';
        }

        // URL validation
        if (isValid && value && rules.type === 'url') {
            try {
                new URL(value);
            } catch {
                isValid = false;
                message = rules.message || 'Please enter a valid URL';
            }
        }

        // Number validation
        if (isValid && value && rules.type === 'number') {
            const num = parseFloat(value);
            if (isNaN(num)) {
                isValid = false;
                message = 'Please enter a valid number';
            } else if (rules.min !== undefined && num < rules.min) {
                isValid = false;
                message = `Value must be at least ${rules.min}`;
            } else if (rules.max !== undefined && num > rules.max) {
                isValid = false;
                message = `Value must be at most ${rules.max}`;
            }
        }

        // Length validation
        if (isValid && value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            message = `Must be under ${rules.maxLength} characters`;
        }

        // Update UI
        formGroup.classList.toggle('valid', isValid && value);
        formGroup.classList.toggle('invalid', !isValid);

        const validationMessage = formGroup.querySelector('.validation-message');
        if (validationMessage) {
            validationMessage.textContent = message;
        }

        return isValid;
    }

    validateAllFields() {
        let allValid = true;
        Object.keys(this.validationRules).forEach(fieldId => {
            if (!this.validateField(fieldId)) {
                allValid = false;
            }
        });

        if (allValid) {
            this.showToast('All fields are valid!', 'success');
        } else {
            this.showToast('Please fix the validation errors', 'error');
        }

        return allValid;
    }

    updateCharCounter(fieldId) {
        const element = document.getElementById(fieldId);
        const counter = document.getElementById(fieldId.replace(/([A-Z])/g, '$1') + 'CharCount') ||
                       document.getElementById(fieldId + 'CharCount');

        if (element && counter) {
            const length = element.value.length;
            const maxLength = this.validationRules[fieldId]?.maxLength;

            counter.textContent = length;

            if (maxLength) {
                const counterContainer = counter.closest('.char-counter');
                if (counterContainer) {
                    counterContainer.classList.toggle('warning', length > maxLength * 0.8);
                    counterContainer.classList.toggle('danger', length > maxLength);
                }
            }
        }
    }

    updateDelayDisplay() {
        const delayInput = document.getElementById('redirectDelay');
        const delayDisplay = document.getElementById('delayDisplay');

        if (delayInput && delayDisplay) {
            const delay = parseFloat(delayInput.value) || 0;
            delayDisplay.textContent = `${delay.toFixed(1)}s`;
        }
    }

    // Preview Tabs Management
    setupPreviewTabs() {
        const tabs = document.querySelectorAll('.preview-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const platform = tab.getAttribute('data-platform');
                this.switchPreviewPlatform(platform);
            });
        });
    }

    switchPreviewPlatform(platform) {
        // Update tab states
        document.querySelectorAll('.preview-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-platform') === platform);
        });

        // Update preview cards
        document.querySelectorAll('.preview-card').forEach(card => {
            card.classList.toggle('active', card.classList.contains(`${platform}-preview`));
        });
    }

    // Help Modal Management
    setupHelpModal() {
        const helpTabs = document.querySelectorAll('.help-tab');
        helpTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchHelpTab(tabId);
            });
        });
    }

    switchHelpTab(tabId) {
        // Update tab states
        document.querySelectorAll('.help-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
        });

        // Update content sections
        document.querySelectorAll('.help-section').forEach(section => {
            section.classList.toggle('active', section.id === tabId);
        });
    }

    showHelpModal() {
        const modal = document.getElementById('helpModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    hideAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
    }

    // Quick Actions
    resetBasicSettings() {
        if (confirm('Are you sure you want to reset basic settings to defaults?')) {
            const defaults = this.getDefaultConfig();

            document.getElementById('redirectUrl').value = defaults.REDIRECT_URL;
            document.getElementById('redirectDelay').value = defaults.REDIRECT_DELAY_MS / 1000;
            document.getElementById('redirectMessage').value = defaults.REDIRECT_MESSAGE;
            document.getElementById('pageTitle').value = defaults.PAGE_TITLE;

            this.updateConfigFromForm();
            this.updateConfigPreview();
            this.updateAllPreviews();
            this.updateDelayDisplay();

            // Validate all fields
            ['redirectUrl', 'redirectDelay', 'redirectMessage', 'pageTitle'].forEach(fieldId => {
                this.validateField(fieldId);
                this.updateCharCounter(fieldId);
            });

            this.showToast('Basic settings reset to defaults', 'success');
        }
    }

    // Image Tools
    async testImage() {
        const imageUrl = document.getElementById('ogImageUrl').value.trim();
        if (!imageUrl) {
            this.showToast('Please enter an image URL first', 'warning');
            return;
        }

        try {
            const img = new Image();
            img.onload = () => {
                this.showToast(`Image loaded successfully! Size: ${img.width}x${img.height}px`, 'success');
            };
            img.onerror = () => {
                this.showToast('Failed to load image. Please check the URL.', 'error');
            };
            img.src = imageUrl;
        } catch (error) {
            this.showToast('Error testing image: ' + error.message, 'error');
        }
    }

    async showImageInfo() {
        const imageUrl = document.getElementById('ogImageUrl').value.trim();
        if (!imageUrl) {
            this.showToast('Please enter an image URL first', 'warning');
            return;
        }

        const modal = document.getElementById('imageInfoModal');
        const content = document.getElementById('imageInfoContent');

        if (!modal || !content) return;

        modal.style.display = 'flex';
        modal.classList.add('show');

        content.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading image information...</div>';

        try {
            const img = new Image();
            img.onload = () => {
                const fileSize = this.estimateImageSize(img.width, img.height);
                const aspectRatio = (img.width / img.height).toFixed(2);
                const isOptimal = img.width >= 1200 && img.height >= 630;

                content.innerHTML = `
                    <div class="image-info">
                        <div class="image-preview-container">
                            <img src="${imageUrl}" alt="Preview" style="max-width: 100%; height: auto; border-radius: 8px;">
                        </div>
                        <div class="image-details">
                            <h4>Image Information</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>Dimensions:</strong> ${img.width} × ${img.height} pixels
                                </div>
                                <div class="info-item">
                                    <strong>Aspect Ratio:</strong> ${aspectRatio}:1
                                </div>
                                <div class="info-item">
                                    <strong>Estimated Size:</strong> ${fileSize}
                                </div>
                                <div class="info-item">
                                    <strong>Social Media Optimal:</strong>
                                    <span class="${isOptimal ? 'text-success' : 'text-warning'}">
                                        ${isOptimal ? 'Yes' : 'No (recommended: 1200×630px)'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            };
            img.onerror = () => {
                content.innerHTML = '<div class="error">Failed to load image. Please check the URL.</div>';
            };
            img.src = imageUrl;
        } catch (error) {
            content.innerHTML = `<div class="error">Error loading image: ${error.message}</div>`;
        }
    }

    estimateImageSize(width, height) {
        // Rough estimation based on dimensions
        const pixels = width * height;
        const estimatedBytes = pixels * 3; // Rough estimate for compressed image

        if (estimatedBytes < 1024) return `${estimatedBytes} bytes`;
        if (estimatedBytes < 1024 * 1024) return `${(estimatedBytes / 1024).toFixed(1)} KB`;
        return `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.config-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links and sections
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding section
                const sectionId = link.getAttribute('data-section');
                document.getElementById(sectionId).classList.add('active');
            });
        });
    }

    setupRealTimeUpdates() {
        const inputs = [
            'redirectUrl', 'redirectDelay', 'redirectMessage', 'pageTitle',
            'ogTitle', 'ogDescription', 'ogImageUrl', 'displayImageUrl', 'ogUrl',
            'detectFacebook', 'detectTwitter', 'detectLinkedIn', 'detectGoogle',
            'customCss', 'enableHttpsOnly', 'enableReferrerPolicy'
        ];

        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                const updateHandler = () => {
                    this.updateConfigFromForm();
                    this.updateConfigPreview();
                    this.updateAllPreviews();
                };

                element.addEventListener('input', updateHandler);

                if (element.type === 'checkbox') {
                    element.addEventListener('change', updateHandler);
                }
            }
        });
    }

    updateAllPreviews() {
        this.updatePreviewCard('facebook');
        this.updatePreviewCard('twitter');
        this.updatePreviewCard('linkedin');
    }

    updatePreviewCard(platform) {
        const config = this.currentConfig;
        const suffix = platform === 'facebook' ? 'Fb' : platform === 'twitter' ? 'Tw' : 'Li';

        const titleElement = document.getElementById(`previewTitle${suffix}`);
        const descElement = document.getElementById(`previewDescription${suffix}`);
        const urlElement = document.getElementById(`previewUrl${suffix}`);
        const imgElement = document.getElementById(`previewImg${suffix}`);

        if (titleElement) {
            titleElement.textContent = config.OG_TITLE || 'Your Title Here';
        }

        if (descElement) {
            descElement.textContent = config.OG_DESCRIPTION || 'Your description will appear here...';
        }

        if (urlElement) {
            try {
                const url = new URL(config.OG_URL || 'https://yourdomain.com');
                urlElement.textContent = url.hostname;
            } catch {
                urlElement.textContent = 'yourdomain.com';
            }
        }

        if (imgElement) {
            const placeholder = imgElement.parentElement.querySelector('.preview-placeholder');
            if (config.OG_IMAGE_URL && config.OG_IMAGE_URL.trim()) {
                imgElement.src = config.OG_IMAGE_URL;
                imgElement.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';

                // Handle image load errors
                imgElement.onerror = () => {
                    imgElement.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'flex';
                };
            } else {
                imgElement.style.display = 'none';
                if (placeholder) placeholder.style.display = 'flex';
            }
        }
    }

    loadConfiguration() {
        // Start with default configuration
        this.currentConfig = this.getDefaultConfig();

        // Load from localStorage if available and merge with defaults
        const saved = localStorage.getItem('redirectPageConfig');
        if (saved) {
            try {
                const savedConfig = JSON.parse(saved);
                this.currentConfig = { ...this.currentConfig, ...savedConfig };
            } catch (e) {
                console.error('Error loading saved configuration:', e);
            }
        }

        // Update form fields with the configuration
        this.updateFormFromConfig();

        // Update previews after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.updateAllPreviews();
            this.updateDelayDisplay();
        }, 50);
    }

    updateFormFromConfig() {
        const config = this.currentConfig;

        // Basic settings
        const redirectUrl = document.getElementById('redirectUrl');
        const redirectDelay = document.getElementById('redirectDelay');
        const redirectMessage = document.getElementById('redirectMessage');
        const pageTitle = document.getElementById('pageTitle');

        if (redirectUrl) redirectUrl.value = config.REDIRECT_URL || '';
        if (redirectDelay) redirectDelay.value = (config.REDIRECT_DELAY_MS || 2000) / 1000;
        if (redirectMessage) redirectMessage.value = config.REDIRECT_MESSAGE || '';
        if (pageTitle) pageTitle.value = config.PAGE_TITLE || '';

        // Social media settings
        const ogTitle = document.getElementById('ogTitle');
        const ogDescription = document.getElementById('ogDescription');
        const ogImageUrl = document.getElementById('ogImageUrl');
        const displayImageUrl = document.getElementById('displayImageUrl');
        const ogUrl = document.getElementById('ogUrl');

        if (ogTitle) ogTitle.value = config.OG_TITLE || '';
        if (ogDescription) ogDescription.value = config.OG_DESCRIPTION || '';
        if (ogImageUrl) ogImageUrl.value = config.OG_IMAGE_URL || '';
        if (displayImageUrl) displayImageUrl.value = config.DISPLAY_IMAGE_URL || '';
        if (ogUrl) ogUrl.value = config.OG_URL || '';

        // Advanced settings
        if (config.CRAWLER_DETECTION) {
            const detectFacebook = document.getElementById('detectFacebook');
            const detectTwitter = document.getElementById('detectTwitter');
            const detectLinkedIn = document.getElementById('detectLinkedIn');
            const detectGoogle = document.getElementById('detectGoogle');

            if (detectFacebook) detectFacebook.checked = config.CRAWLER_DETECTION.facebook || false;
            if (detectTwitter) detectTwitter.checked = config.CRAWLER_DETECTION.twitter || false;
            if (detectLinkedIn) detectLinkedIn.checked = config.CRAWLER_DETECTION.linkedin || false;
            if (detectGoogle) detectGoogle.checked = config.CRAWLER_DETECTION.google || false;
        }

        const customCss = document.getElementById('customCss');
        if (customCss) customCss.value = config.CUSTOM_CSS || '';

        if (config.SECURITY) {
            const enableHttpsOnly = document.getElementById('enableHttpsOnly');
            const enableReferrerPolicy = document.getElementById('enableReferrerPolicy');

            if (enableHttpsOnly) enableHttpsOnly.checked = config.SECURITY.httpsOnly || false;
            if (enableReferrerPolicy) enableReferrerPolicy.checked = config.SECURITY.strictReferrer || false;
        }
    }

    updateConfigFromForm() {
        this.currentConfig = {
            REDIRECT_URL: document.getElementById('redirectUrl').value,
            REDIRECT_DELAY_MS: parseFloat(document.getElementById('redirectDelay').value) * 1000,
            REDIRECT_MESSAGE: document.getElementById('redirectMessage').value,
            PAGE_TITLE: document.getElementById('pageTitle').value,
            OG_TITLE: document.getElementById('ogTitle').value,
            OG_DESCRIPTION: document.getElementById('ogDescription').value,
            OG_IMAGE_URL: document.getElementById('ogImageUrl').value,
            DISPLAY_IMAGE_URL: document.getElementById('displayImageUrl').value,
            OG_URL: document.getElementById('ogUrl').value,
            CRAWLER_DETECTION: {
                facebook: document.getElementById('detectFacebook').checked,
                twitter: document.getElementById('detectTwitter').checked,
                linkedin: document.getElementById('detectLinkedIn').checked,
                google: document.getElementById('detectGoogle').checked
            },
            CUSTOM_CSS: document.getElementById('customCss').value,
            SECURITY: {
                httpsOnly: document.getElementById('enableHttpsOnly').checked,
                strictReferrer: document.getElementById('enableReferrerPolicy').checked
            }
        };
    }

    async saveConfiguration() {
        try {
            this.updateConfigFromForm();

            // Enhanced validation
            if (!this.validateAllFields() || !this.validateConfig()) {
                this.showToast('Please fix all validation errors before saving', 'error');
                return;
            }

            // Show loading state
            const saveBtn = document.getElementById('saveBtn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;

            // Save to localStorage
            localStorage.setItem('redirectPageConfig', JSON.stringify(this.currentConfig));

            // Generate and save config.js file
            this.generateConfigFile();

            // Auto-download the config.js file
            this.exportConfig();

            // Success feedback
            this.showToast('Configuration saved successfully! Config file downloaded.', 'success');

            // Reset button
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
            }, 1000);

        } catch (error) {
            console.error('Error saving configuration:', error);
            this.showToast('Error saving configuration: ' + error.message, 'error');

            // Reset button
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save & Download';
            saveBtn.disabled = false;
        }
    }

    async testConfiguration() {
        try {
            this.updateConfigFromForm();

            // Enhanced validation
            if (!this.validateAllFields() || !this.validateConfig()) {
                this.showToast('Please fix all validation errors before testing', 'error');
                return;
            }

            // Show loading state
            const testBtn = document.getElementById('testBtn');
            const originalText = testBtn.innerHTML;
            testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
            testBtn.disabled = true;

            // Save to localStorage so the redirect page can use it
            localStorage.setItem('redirectPageConfig', JSON.stringify(this.currentConfig));

            // Create test URL with parameters as backup
            const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '');
            const testUrl = `${baseUrl}?url=${encodeURIComponent(this.currentConfig.REDIRECT_URL)}&delay=${this.currentConfig.REDIRECT_DELAY_MS / 1000}`;

            // Open in new tab for testing
            const testWindow = window.open(testUrl, '_blank');

            if (testWindow) {
                this.showToast('Test page opened in new tab!', 'success');
            } else {
                this.showToast('Please allow popups to test the configuration', 'warning');
            }

            // Reset button
            setTimeout(() => {
                testBtn.innerHTML = originalText;
                testBtn.disabled = false;
            }, 1000);

        } catch (error) {
            console.error('Error testing configuration:', error);
            this.showToast('Error testing configuration: ' + error.message, 'error');

            // Reset button
            const testBtn = document.getElementById('testBtn');
            testBtn.innerHTML = '<i class="fas fa-play"></i> Test Now';
            testBtn.disabled = false;
        }
    }

    validateConfig() {
        const config = this.currentConfig;

        if (!config.REDIRECT_URL) {
            this.showToast('Redirect URL is required!', 'error');
            return false;
        }

        try {
            new URL(config.REDIRECT_URL);
        } catch (e) {
            this.showToast('Invalid redirect URL format!', 'error');
            return false;
        }

        if (config.OG_IMAGE_URL) {
            try {
                new URL(config.OG_IMAGE_URL);
            } catch (e) {
                this.showToast('Invalid social media image URL format!', 'error');
                return false;
            }
        }

        if (config.DISPLAY_IMAGE_URL) {
            try {
                new URL(config.DISPLAY_IMAGE_URL);
            } catch (e) {
                this.showToast('Invalid display image URL format!', 'error');
                return false;
            }
        }

        // Additional security validation
        if (config.SECURITY?.httpsOnly && !config.REDIRECT_URL.startsWith('https://')) {
            this.showToast('HTTPS-only mode requires HTTPS redirect URL!', 'error');
            return false;
        }

        return true;
    }

    generateConfigFile() {
        const config = this.currentConfig;
        const configContent = `// config.js - Generated by Admin Panel
// Last updated: ${new Date().toISOString()}

const CONFIG = {
    REDIRECT_URL: "${config.REDIRECT_URL}",
    OG_TITLE: "${config.OG_TITLE}",
    OG_DESCRIPTION: "${config.OG_DESCRIPTION}",
    OG_IMAGE_URL: "${config.OG_IMAGE_URL}",
    DISPLAY_IMAGE_URL: "${config.DISPLAY_IMAGE_URL}",
    REDIRECT_DELAY_MS: ${config.REDIRECT_DELAY_MS},
    REDIRECT_MESSAGE: "${config.REDIRECT_MESSAGE}",
    PAGE_TITLE: "${config.PAGE_TITLE}",
    OG_URL: "${config.OG_URL}",
    CRAWLER_DETECTION: ${JSON.stringify(config.CRAWLER_DETECTION, null, 4)},
    CUSTOM_CSS: \`${config.CUSTOM_CSS}\`,
    SECURITY: ${JSON.stringify(config.SECURITY, null, 4)}
};`;

        // Save to localStorage for download
        localStorage.setItem('generatedConfig', configContent);
        
        return configContent;
    }

    updateConfigPreview() {
        const configContent = this.generateConfigFile();
        document.getElementById('configPreview').value = configContent;
    }

    showPreview() {
        const config = this.currentConfig;
        
        // Update preview content
        document.getElementById('previewTitle').textContent = config.OG_TITLE || 'No title';
        document.getElementById('previewDescription').textContent = config.OG_DESCRIPTION || 'No description';
        document.getElementById('previewUrl').textContent = config.OG_URL || 'No URL';
        
        const previewImg = document.getElementById('previewImg');
        if (config.OG_IMAGE_URL) {
            previewImg.src = config.OG_IMAGE_URL;
            previewImg.style.display = 'block';
        } else {
            previewImg.style.display = 'none';
        }
        
        // Show modal
        document.getElementById('previewModal').style.display = 'block';
    }

    hidePreview() {
        document.getElementById('previewModal').style.display = 'none';
    }

    saveProfile() {
        const profileName = document.getElementById('profileName').value.trim();
        if (!profileName) {
            this.showToast('Please enter a profile name!', 'error');
            return;
        }

        this.updateConfigFromForm();

        // Validate before saving
        if (!this.validateAllFields()) {
            this.showToast('Please fix validation errors before saving profile', 'error');
            return;
        }

        const profiles = JSON.parse(localStorage.getItem('redirectPageProfiles') || '{}');
        profiles[profileName] = {
            config: this.currentConfig,
            created: new Date().toISOString()
        };

        localStorage.setItem('redirectPageProfiles', JSON.stringify(profiles));
        document.getElementById('profileName').value = '';

        this.loadProfiles();
        this.showToast(`Profile "${profileName}" saved successfully!`, 'success');
    }

    loadProfiles() {
        const profiles = JSON.parse(localStorage.getItem('redirectPageProfiles') || '{}');
        const profilesList = document.getElementById('profilesList');
        
        if (Object.keys(profiles).length === 0) {
            profilesList.innerHTML = '<p style="padding: 1rem; text-align: center; color: #666;">No saved profiles</p>';
            return;
        }
        
        profilesList.innerHTML = Object.entries(profiles).map(([name, data]) => `
            <div class="profile-item">
                <div class="profile-info">
                    <div class="profile-name">${name}</div>
                    <div class="profile-date">Created: ${new Date(data.created).toLocaleDateString()}</div>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-secondary" onclick="adminPanel.loadProfile('${name}')">
                        <i class="fas fa-upload"></i> Load
                    </button>
                    <button class="btn btn-danger" onclick="adminPanel.deleteProfile('${name}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadProfile(profileName) {
        const profiles = JSON.parse(localStorage.getItem('redirectPageProfiles') || '{}');
        if (profiles[profileName]) {
            this.currentConfig = profiles[profileName].config;
            this.updateFormFromConfig();
            this.updateConfigPreview();
            this.updateAllPreviews();
            this.updateDelayDisplay();

            // Revalidate all fields
            Object.keys(this.validationRules).forEach(fieldId => {
                this.validateField(fieldId);
                this.updateCharCounter(fieldId);
            });

            this.showToast(`Profile "${profileName}" loaded successfully!`, 'success');
        }
    }

    deleteProfile(profileName) {
        if (confirm(`Are you sure you want to delete the profile "${profileName}"?`)) {
            const profiles = JSON.parse(localStorage.getItem('redirectPageProfiles') || '{}');
            delete profiles[profileName];
            localStorage.setItem('redirectPageProfiles', JSON.stringify(profiles));
            this.loadProfiles();
            this.showToast(`Profile "${profileName}" deleted successfully!`, 'success');
        }
    }

    exportConfig() {
        const configContent = this.generateConfigFile();
        this.downloadFile('config.js', configContent, 'text/javascript');
    }

    exportJson() {
        const jsonContent = JSON.stringify(this.currentConfig, null, 2);
        this.downloadFile('redirect-config.json', jsonContent, 'application/json');
    }

    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importConfig(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let config;
                const content = e.target.result;
                
                if (file.name.endsWith('.json')) {
                    config = JSON.parse(content);
                } else if (file.name.endsWith('.js')) {
                    // Extract CONFIG object from JavaScript file
                    const configMatch = content.match(/const CONFIG = ({[\s\S]*?});/);
                    if (configMatch) {
                        config = eval('(' + configMatch[1] + ')');
                    } else {
                        throw new Error('Invalid config.js format');
                    }
                } else {
                    throw new Error('Unsupported file format');
                }
                
                this.currentConfig = { ...this.getDefaultConfig(), ...config };
                this.updateFormFromConfig();
                this.updateConfigPreview();
                this.updateAllPreviews();
                this.updateDelayDisplay();

                // Revalidate all fields
                Object.keys(this.validationRules).forEach(fieldId => {
                    this.validateField(fieldId);
                    this.updateCharCounter(fieldId);
                });

                this.showToast('Configuration imported successfully!', 'success');

            } catch (error) {
                this.showToast('Error importing configuration: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
