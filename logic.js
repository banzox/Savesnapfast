/**
 * SaveTikFast - TikTok Downloader Logic
 * =====================================
 * Main JavaScript file for handling video downloads
 * with viral naming and ad monetization.
 * 
 * @author SaveTikFast Team
 * @version 2.0.0
 */

// ==================== CONSTANTS ====================

/**
 * Smart Link for ad monetization (opens on every download)
 */
const SMART_LINK = "https://www.effectivegatecpm.com/pjjsq7g4?key=d767025cc7e5239dd2334794b7167308";

/**
 * Cloudflare Worker URL for proxying video downloads (CORS bypass)
 */
const WORKER_URL = "https://api.savetik-fast.xyz";


// ==================== DOM ELEMENTS ====================

const urlInput = document.getElementById('url-input');
const downloadBtn = document.getElementById('download-btn');
const pasteBtn = document.getElementById('paste-btn');
const resultArea = document.getElementById('result-area');

// ==================== UTILITY FUNCTIONS ====================

/**
 * Sanitize username/author name for use in filename
 * Removes special characters, emojis, and keeps only alphanumeric + underscore
 * @param {string} name - Raw author name
 * @returns {string} - Cleaned name safe for filenames
 */
function sanitizeFileName(name) {
    if (!name) return 'TikTok';

    // Remove emojis and special characters, keep letters, numbers, underscore
    return name
        .replace(/[^\w\s-]/gi, '') // Remove non-word characters except space and dash
        .replace(/\s+/g, '_')       // Replace spaces with underscores
        .replace(/_+/g, '_')        // Remove multiple underscores
        .replace(/^_|_$/g, '')      // Remove leading/trailing underscores
        .substring(0, 30)           // Limit length
        || 'TikTok';                // Fallback if empty
}

/**
 * Generate a random alphanumeric string
 * @param {number} length - Length of random string
 * @returns {string} - Random string
 */
function generateRandomId(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate viral filename for downloaded video
 * Format: SaveTikFast_[AuthorName]_[RandomID].mp4
 * @param {string} authorName - TikTok author username
 * @param {string} extension - File extension (mp4, mp3)
 * @returns {string} - Viral filename
 */
function generateViralFileName(authorName, extension = 'mp4') {
    const cleanName = sanitizeFileName(authorName);
    const randomId = generateRandomId(6);
    return `SaveTikFast_${cleanName}_${randomId}.${extension}`;
}

/**
 * Validate TikTok URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid TikTok URL
 */
function isValidTikTokUrl(url) {
    if (!url) return false;

    const patterns = [
        /tiktok\.com\/@[\w.-]+\/video\/\d+/i,
        /tiktok\.com\/t\/[\w]+/i,
        /vm\.tiktok\.com\/[\w]+/i,
        /vt\.tiktok\.com\/[\w]+/i,
        /tiktok\.com\/[\w]+\/video\/\d+/i
    ];

    return patterns.some(pattern => pattern.test(url));
}

/**
 * Show loading state in result area
 */
function showLoading() {
    const loadingText = typeof i18next !== 'undefined'
        ? i18next.t('downloader.processing')
        : 'Processing...';

    resultArea.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin fa-3x"></i>
            <p>${loadingText}</p>
        </div>
    `;
}

/**
 * Show error message in result area
 * @param {string} message - Error message to display
 */
function showError(message) {
    resultArea.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Clear result area
 */
function clearResult() {
    resultArea.innerHTML = '';
}

// ==================== MAIN FUNCTIONS ====================

/**
 * Render video result with download buttons
 * @param {Object} data - Video data from API
 */
function renderResult(data) {
    if (!data) {
        showError('No data received from server.');
        return;
    }

    // Extract author name for viral filename (new API uses `author` string)
    const authorName = data.author
        || data.authorName
        || 'TikTok';

    // Generate viral filenames
    const videoFileName = generateViralFileName(authorName, 'mp4');
    const hdVideoFileName = generateViralFileName(authorName + '_HD', 'mp4');
    const audioFileName = generateViralFileName(authorName, 'mp3');

    // Get video URLs from new API response structure
    // Primary video URL (no watermark)
    const videoUrl = data.video || '';

    // HD video URL (same as video in new API, or fallback)
    const hdVideoUrl = data.video || '';

    // Audio/Music URL
    const audioUrl = data.music || '';

    // Get thumbnail (cover image)
    const thumbnail = data.cover || '';

    // Get video title/description
    const description = data.title || '';

    // Check if this is a photo slideshow
    const images = data.images || [];

    // Context Detection
    const currentPath = window.location.pathname;
    const isMp3Page = currentPath.includes('/mp3/');
    const isStoryPage = currentPath.includes('/story/');

    // Build Slideshow HTML
    let contentHtml = '';
    if (images.length > 0) {
        contentHtml += '<div class="slideshow-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 15px;">';
        images.forEach((img, index) => {
            const fileName = generateViralFileName(`${authorName}_slide_${index + 1}`, 'jpg');
            contentHtml += `
                <div class="slide-item" style="position: relative;">
                    <img src="${img}" style="width: 100%; border-radius: 8px; aspect-ratio: 9/16; object-fit: cover;" loading="lazy">
                    <button class="btn-download btn-sm" 
                            style="font-size: 0.8rem; padding: 5px; margin-top: 5px; width: 100%;"
                            onclick="downloadFile('${img}', '${fileName}')">
                        <i class="fas fa-download"></i> Save
                    </button>
                </div>`;
        });
        contentHtml += '</div>';

        // If it's a slideshow, we might also have audio
        if (audioUrl) {
            contentHtml += `
                <div style="margin-top: 15px;">
                     <button class="btn-download btn-audio" onclick="downloadFile('${audioUrl}', '${audioFileName}')">
                        <i class="fas fa-music"></i> Download Slideshow Music
                    </button>
                </div>
            `;
        }
    }

    // Build Buttons HTML based on Context
    let buttonsHtml = '';

    if (images.length === 0) {
        // Video Content
        if (isMp3Page) {
            // MP3 Page: Show MP3 Button ONLY
            if (audioUrl) {
                buttonsHtml += `
                    <button class="btn-download btn-audio" onclick="downloadFile('${audioUrl}', '${audioFileName}')">
                        <i class="fas fa-music"></i> Download MP3 Audio
                    </button>
                `;
            } else {
                buttonsHtml += `<p class="error-text">No audio found for this video.</p>`;
            }
        } else if (isStoryPage) {
            // Story Page: Show Video Button (optimized for story)
            if (videoUrl) {
                buttonsHtml += `
                     <button class="btn-download btn-video" onclick="downloadFile('${videoUrl}', '${videoFileName}')">
                        <i class="fas fa-images"></i> Download Story Video
                    </button>
                `;
            }
        } else {
            // Home Page (Default): Show All Options
            if (videoUrl) {
                buttonsHtml += `
                    <button class="btn-download btn-video" onclick="downloadFile('${videoUrl}', '${videoFileName}')">
                        <i class="fas fa-download"></i> Download
                        <span class="badge">No Watermark</span>
                    </button>
                `;
            }
            if (hdVideoUrl && hdVideoUrl !== videoUrl) {
                buttonsHtml += `
                    <button class="btn-download btn-hd" onclick="downloadFile('${hdVideoUrl}', '${hdVideoFileName}')">
                        <i class="fas fa-film"></i> Download HD
                        <span class="badge badge-hd">1080p</span>
                    </button>
                `;
            }
            if (audioUrl) {
                buttonsHtml += `
                    <button class="btn-download btn-audio" onclick="downloadFile('${audioUrl}', '${audioFileName}')">
                        <i class="fas fa-music"></i> Download MP3
                    </button>
                `;
            }
        }
    }

    // Build result HTML
    resultArea.innerHTML = `
        <div class="result-card">
            ${thumbnail && images.length === 0 ? `
                <div class="result-thumbnail">
                    <img src="${thumbnail}" alt="TikTok Thumbnail" loading="lazy">
                    <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
                </div>
            ` : ''}
            
            <div class="result-info" style="width: 100%;">
                <h3 class="result-author">
                    <i class="fab fa-tiktok"></i> @${sanitizeFileName(authorName)}
                </h3>
                ${description ? `<p class="result-desc">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>` : ''}
                
                <div class="result-buttons">
                    ${buttonsHtml}
                </div>
                
                <!-- Excellent Ad Strategy: High Visibility Result Ad -->
                <div class="result-ad-container" style="margin-top: 20px; text-align: center; min-height: 250px; background: rgba(0,0,0,0.05); border-radius: 8px; padding: 10px;">
                     <p style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px;">Advertisement</p>
                     <!-- Ad Code Placeholder -->
                     <script type="text/javascript">
                        atOptions = {
                            'key' : 'd767025cc7e5239dd2334794b7167308', // Using Smart Link Key or similar as placeholder
                            'format' : 'iframe',
                            'height' : 250,
                            'width' : 300,
                            'params' : {}
                        };
                     </script>
                     <!-- Social Bar / Native Ad Script can go here -->
                     <div id="result-native-ad"></div>
                </div>
                
                ${contentHtml} <!-- Slideshow loop -->
            </div>
        </div>
    `;
}

/**
 * Download file directly from the URL provided by the API
 * @param {string} url - Direct URL to the file (from TikWM)
 * @param {string} fileName - Viral filename to save as
 */
async function downloadFile(url, fileName) {
    // 1. فتح الإعلان (Smart Link)
    if (typeof SMART_LINK !== 'undefined' && SMART_LINK) {
        window.open(SMART_LINK, '_blank');
    }

    // 2. التحميل المباشر من الرابط
    try {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
        }, 1000);

        // إعادة تفعيل الزر إذا كان معطلاً
        const btn = document.querySelector(`[data-url="${url}"]`);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = fileName.endsWith('.mp3')
                ? '<i class="fas fa-music"></i> Download MP3'
                : '<i class="fas fa-video"></i> Download Video <span class="badge">No Watermark</span>';
        }

    } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please try again.');
    }
}

/**
 * Fetch video data from TikTok API
 * @param {string} url - TikTok video URL
 */
async function fetchVideoData(url) {
    showLoading();

    try {
        // New Cloudflare Worker API endpoint
        const apiUrl = `${WORKER_URL}/?url=${encodeURIComponent(url)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Extract result object from new API response
        const result = data.result || data;

        // Render the result
        renderResult(result);

    } catch (error) {
        console.error('Fetch error:', error);

        const errorText = typeof i18next !== 'undefined'
            ? i18next.t('downloader.error_busy')
            : 'Service is busy. Please try again later.';

        showError(errorText);
    }
}

/**
 * Handle download button click
 */
function handleDownload() {
    const url = urlInput.value.trim();

    if (!url) {
        urlInput.focus();
        urlInput.classList.add('shake');
        setTimeout(() => urlInput.classList.remove('shake'), 500);
        return;
    }

    if (!isValidTikTokUrl(url)) {
        showError('Please enter a valid TikTok video URL.');
        return;
    }

    fetchVideoData(url);
}

/**
 * Handle paste button click
 */
async function handlePaste() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            urlInput.value = text;
            urlInput.focus();

            // Auto-submit if valid URL
            if (isValidTikTokUrl(text)) {
                handleDownload();
            }
        }
    } catch (error) {
        console.error('Clipboard access denied:', error);
        // Fallback: Focus on input for manual paste
        urlInput.focus();
    }
}

// ==================== EVENT LISTENERS ====================

// Download button click
if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownload);
}

// Paste button click
if (pasteBtn) {
    pasteBtn.addEventListener('click', handlePaste);
}

// Enter key in input field
if (urlInput) {
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleDownload();
        }
    });

    // Clear error state on input
    urlInput.addEventListener('input', () => {
        urlInput.classList.remove('shake');
    });
}

// ==================== EXPORTS (for global access) ====================

// Make downloadFile globally accessible (used in onclick handlers)
window.downloadFile = downloadFile;

// Debug: Log initialization
console.log('SaveTikFast Logic v2.0 loaded successfully.');
