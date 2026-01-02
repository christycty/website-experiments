/**
 * Share Functionality
 * Handles downloading fortune as image and social media sharing
 */

const ShareManager = {
    /**
     * Initialize share functionality
     */
    init() {
        // Get DOM elements
        this.downloadBtn = document.getElementById('downloadBtn');
        this.instagramBtn = document.getElementById('instagramBtn');
        this.whatsappBtn = document.getElementById('whatsappBtn');
        this.twitterBtn = document.getElementById('twitterBtn');
        this.linkBtn = document.getElementById('linkBtn');
        this.linkBtnText = document.getElementById('linkBtnText');
        this.fortuneDisplay = document.getElementById('fortuneDisplay');
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Share manager initialized');
    },
    
    /**
     * Setup event listeners for share buttons
     */
    setupEventListeners() {
        this.downloadBtn.addEventListener('click', () => this.downloadAsImage());
        this.instagramBtn.addEventListener('click', () => this.shareToInstagram());
        this.whatsappBtn.addEventListener('click', () => this.shareToWhatsApp());
        this.twitterBtn.addEventListener('click', () => this.shareToTwitter());
        this.linkBtn.addEventListener('click', () => this.copyLink());
    },
    
    /**
     * Download fortune as image using html2canvas
     */
    async downloadAsImage() {
        try {
            // Show loading state
            this.downloadBtn.disabled = true;
            this.downloadBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>Generating...</span>
            `;
            
            // Get the fortune paper element
            const fortunePaper = this.fortuneDisplay.querySelector('.fortune-paper');
            
            // Temporarily hide share section and reset button for cleaner image
            const shareSection = document.getElementById('shareSection');
            const resetButton = document.getElementById('resetButton');
            const originalShareDisplay = shareSection.style.display;
            const originalResetDisplay = resetButton.style.display;
            
            shareSection.style.display = 'none';
            resetButton.style.display = 'none';
            
            // Generate canvas from HTML
            const canvas = await html2canvas(fortunePaper, {
                backgroundColor: '#FFFAF0',
                scale: 2, // Higher quality
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            
            // Restore hidden elements
            shareSection.style.display = originalShareDisplay;
            resetButton.style.display = originalResetDisplay;
            
            // Convert canvas to blob
            canvas.toBlob((blob) => {
                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0, 10);
                link.download = `omikuji-fortune-${timestamp}.png`;
                link.href = url;
                link.click();
                
                // Cleanup
                URL.revokeObjectURL(url);
                
                // Show success message
                this.showSuccessMessage(this.downloadBtn, 'Downloaded!');
            }, 'image/png');
            
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            // Reset button state
            setTimeout(() => {
                this.downloadBtn.disabled = false;
                this.downloadBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Download</span>
                `;
            }, 2000);
        }
    },
    
    /**
     * Share to Instagram (opens Instagram with instructions)
     */
    async shareToInstagram() {
        // Instagram doesn't support direct web sharing, so we'll download the image
        // and provide instructions
        try {
            await this.downloadAsImage();
            
            // Show instructions
            setTimeout(() => {
                alert('Image downloaded! Open Instagram and upload the image from your device gallery.');
            }, 500);
            
        } catch (error) {
            console.error('Error sharing to Instagram:', error);
        }
    },
    
    /**
     * Share to WhatsApp
     */
    shareToWhatsApp() {
        const fortune = OmikujiApp.currentFortune;
        if (!fortune) return;
        
        // Create share text
        const text = this.createShareText(fortune);
        const url = window.location.href;
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`;
        
        // Open WhatsApp
        window.open(shareUrl, '_blank');
    },
    
    /**
     * Share to Twitter/X
     */
    shareToTwitter() {
        const fortune = OmikujiApp.currentFortune;
        if (!fortune) return;
        
        // Create share text (Twitter has character limit)
        const text = `I drew ${fortune.level.english} (${fortune.level.japanese}) from the Omikuji! 🎋✨`;
        const url = window.location.href;
        const hashtags = 'omikuji,fortune,Japanese';
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
        
        // Open Twitter
        window.open(shareUrl, '_blank', 'width=550,height=420');
    },
    
    /**
     * Copy link to clipboard
     */
    async copyLink() {
        try {
            const url = window.location.href;
            
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            // Show success state
            this.linkBtn.classList.add('copied');
            this.linkBtnText.textContent = 'Copied!';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.linkBtn.classList.remove('copied');
                this.linkBtnText.textContent = 'Copy Link';
            }, 2000);
            
        } catch (error) {
            console.error('Error copying link:', error);
            alert('Failed to copy link. Please copy manually: ' + window.location.href);
        }
    },
    
    /**
     * Create share text from fortune
     */
    createShareText(fortune) {
        return `🎋 I drew ${fortune.level.english} (${fortune.level.japanese}) from the Omikuji! ✨

📿 Wishes: ${fortune.categories.wishes}
💕 Love: ${fortune.categories.love}
💪 Health: ${fortune.categories.health}
💼 Business: ${fortune.categories.business}
📚 Studies: ${fortune.categories.studies}
✈️ Travel: ${fortune.categories.travel}

Draw your own fortune at:`;
    },
    
    /**
     * Show success message on button
     */
    showSuccessMessage(button, message) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${message}</span>
        `;
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }
};

// Initialize share manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ShareManager.init());
} else {
    ShareManager.init();
}

