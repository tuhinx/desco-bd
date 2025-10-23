// DESCO BD App Configuration
let APP_CONFIG = {
    // App version will be loaded from version.json
    version: null, // Will be loaded from version.json
    
    // GitHub repository information
    github: {
        owner: "tuhinx",        // Your GitHub username
        repo: "desco-bd",      // Your repository name
        branch: "master"       // Default branch
    },
    
    // Download URLs - these will be automatically generated
    get downloadUrl() {
        return `https://github.com/${this.github.owner}/${this.github.repo}/releases/download/${this.version}/Desco_BD_V${this.version}.apk`;
    },
    
    get releaseUrl() {
        return `https://github.com/${this.github.owner}/${this.github.repo}/releases/tag/${this.version}`;
    },
    
    get latestReleaseUrl() {
        return `https://github.com/${this.github.owner}/${this.github.repo}/releases/latest`;
    }
};

// Load version from version.json file
async function loadVersion() {
    try {
        const response = await fetch('./version.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const versionData = await response.json();
        
        if (!versionData.version) {
            throw new Error('Version not found in version.json');
        }
        
        APP_CONFIG.version = versionData.version;
        APP_CONFIG.build = versionData.build || '1';
        APP_CONFIG.releaseDate = versionData.releaseDate || new Date().toISOString().split('T')[0];
        APP_CONFIG.changelog = versionData.changelog || ['Initial release'];
        
        return true;
    } catch (error) {
        return false;
    }
}

// Auto-update version display and download URL when config changes
document.addEventListener('DOMContentLoaded', async function() {
    // Load version from version.json
    const versionLoaded = await loadVersion();
    
    if (!versionLoaded) {
        // Show error message if version couldn't be loaded
        const versionElement = document.getElementById('app-version');
        if (versionElement) {
            versionElement.textContent = 'Error';
            versionElement.style.color = 'red';
            versionElement.title = 'Could not load version information';
        }
        
        // Set fallback download URL to latest releases page (dynamic-safe)
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.href = APP_CONFIG.latestReleaseUrl;
        }
        return;
    }
    
    // Update version display if element exists
    const versionElement = document.getElementById('app-version');
    if (versionElement) {
        versionElement.textContent = APP_CONFIG.version;
        versionElement.style.color = '';
        versionElement.title = `Build: ${APP_CONFIG.build} | Released: ${APP_CONFIG.releaseDate}`;
    }
    
    // Update download button URL
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.href = APP_CONFIG.downloadUrl;
        downloadBtn.setAttribute('data-version', APP_CONFIG.version);
    }
    
    // Add click tracking and direct download
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Ensure download proceeds by opening the URL directly
            window.open(downloadBtn.href, '_blank');
        });
    }
});

// Export for use in other scripts
window.APP_CONFIG = APP_CONFIG;
