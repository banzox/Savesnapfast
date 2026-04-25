const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/locales/locales/en.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// === PRIVACY POLICY ===
data.pages.privacy.content = `
<h2>Privacy Policy</h2>
<p>Last updated: April 25, 2026</p>
<p>At SaveTikFast ("we", "our", or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website <strong>savetik-fast.xyz</strong>.</p>

<h2>1. Information We Collect</h2>
<p>We collect minimal information to operate our service effectively:</p>
<ul>
  <li><strong>Automatically Collected Data:</strong> IP address (anonymized), browser type, operating system, pages visited, and session duration — collected via Google Analytics.</li>
  <li><strong>TikTok Video URLs:</strong> When you paste a URL to download a video, we process it temporarily. We do not store URLs after processing is complete.</li>
  <li><strong>Cookies:</strong> We use cookies for analytics and to improve your experience. You may disable cookies in your browser settings.</li>
</ul>

<h2>2. How We Use Your Information</h2>
<ul>
  <li>To provide and improve our download service</li>
  <li>To analyze website traffic and usage patterns (via Google Analytics)</li>
  <li>To serve relevant advertisements (via Google AdSense)</li>
  <li>To detect and prevent abuse or misuse of our service</li>
</ul>

<h2>3. Google AdSense &amp; Advertising</h2>
<p>We use Google AdSense to display advertisements on our website. Google may use cookies and similar technologies to serve ads based on your prior visits to our website or other websites on the internet. You can opt out of personalized advertising by visiting <strong>Google Ads Settings</strong> at <em>adssettings.google.com</em>. For more information about how Google uses data, please see <strong>Google's Privacy &amp; Terms</strong> at <em>policies.google.com</em>.</p>

<h2>4. No Video Storage</h2>
<p>SaveTikFast does not host, store, or retain any TikTok videos on our servers. All video processing is performed in real-time and no copy is kept after the download link is generated. Videos are streamed directly from TikTok's own servers.</p>

<h2>5. Third-Party Services</h2>
<p>We may use the following third-party services:</p>
<ul>
  <li><strong>Google Analytics:</strong> For anonymous traffic analysis and website improvement.</li>
  <li><strong>Google AdSense:</strong> For displaying relevant advertisements to support our free service.</li>
  <li><strong>Cloudflare:</strong> For website security, performance, and content delivery.</li>
</ul>
<p>Each of these services has its own privacy policy governing the data they collect.</p>

<h2>6. Cookies Policy</h2>
<p>We use the following types of cookies:</p>
<ul>
  <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
  <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with our website (Google Analytics).</li>
  <li><strong>Advertising Cookies:</strong> Used by Google AdSense to show relevant ads.</li>
</ul>
<p>You can control cookies through your browser settings. Disabling cookies may affect some functionality of the website.</p>

<h2>7. Children's Privacy</h2>
<p>Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it immediately.</p>

<h2>8. Data Security</h2>
<p>We implement SSL/TLS encryption across our entire website to protect data in transit. We host our service on Cloudflare's secure infrastructure and regularly review our security practices to ensure your data remains safe.</p>

<h2>9. Your Rights</h2>
<p>Depending on your location, you may have the following rights:</p>
<ul>
  <li>Right to access personal data we hold about you</li>
  <li>Right to correct inaccurate data</li>
  <li>Right to request deletion of your data</li>
  <li>Right to opt out of data collection for advertising purposes</li>
</ul>
<p>To exercise any of these rights, contact us at <strong>support@savetik-fast.xyz</strong>.</p>

<h2>10. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. The updated date will always be reflected at the top of this page. Continued use of our service after changes constitutes acceptance of the revised policy.</p>

<h2>11. Contact Us</h2>
<p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at: <strong>support@savetik-fast.xyz</strong></p>
`.trim();

// === TERMS OF SERVICE ===
data.pages.terms.content = `
<h2>Terms of Service</h2>
<p>Last updated: April 25, 2026</p>
<p>Welcome to SaveTikFast. By accessing or using our website at <strong>savetik-fast.xyz</strong>, you agree to be bound by these Terms of Service. Please read them carefully before using our service.</p>

<h2>1. Acceptance of Terms</h2>
<p>By using SaveTikFast, you confirm that you are at least 13 years of age, that you have read and understood these Terms of Service, and that you agree to be legally bound by them. If you do not agree, please do not use our service.</p>

<h2>2. Description of Service</h2>
<p>SaveTikFast provides a free online tool that allows users to download publicly available TikTok videos without watermarks, convert TikTok audio to MP3, and save TikTok stories and slideshows. We do not host any video content — all videos are served directly from TikTok's servers.</p>

<h2>3. Permitted Use</h2>
<p>You may use SaveTikFast for the following purposes:</p>
<ul>
  <li>Downloading videos for <strong>personal, non-commercial</strong> use only</li>
  <li>Saving videos for private offline viewing</li>
  <li>Archiving content you own or have explicit written permission to save</li>
  <li>Educational or research purposes (fair use)</li>
</ul>

<h2>4. Prohibited Use</h2>
<p>You agree NOT to use SaveTikFast to:</p>
<ul>
  <li>Download and redistribute copyrighted content without authorization from the rights holder</li>
  <li>Use downloaded content for commercial purposes without proper licensing</li>
  <li>Re-upload downloaded content to other platforms without the creator's permission</li>
  <li>Engage in any activity that violates TikTok's Terms of Service or Community Guidelines</li>
  <li>Attempt to access private, restricted, or unlisted videos</li>
  <li>Use automated bots, scrapers, or crawlers on our platform</li>
  <li>Engage in any illegal or harmful activities using our service</li>
</ul>

<h2>5. Intellectual Property</h2>
<p>All TikTok videos remain the exclusive property of their original creators or respective rights holders. SaveTikFast does not claim any ownership over downloaded content. The SaveTikFast name, logo, and website design are our intellectual property. Users are solely responsible for ensuring their use of downloaded content complies with applicable copyright laws in their jurisdiction.</p>

<h2>6. Disclaimer of Warranties</h2>
<p>SaveTikFast is provided "as is" and "as available" without any warranty of any kind, express or implied. We do not guarantee that:</p>
<ul>
  <li>The service will be uninterrupted, error-free, or always available</li>
  <li>All TikTok videos will be downloadable (availability depends on TikTok's API)</li>
  <li>The download quality will always match the original video quality</li>
</ul>

<h2>7. Limitation of Liability</h2>
<p>To the maximum extent permitted by applicable law, SaveTikFast and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, revenue, or profits, resulting from your use of (or inability to use) our service.</p>

<h2>8. User Responsibility</h2>
<p>You acknowledge that you are solely responsible for:</p>
<ul>
  <li>Complying with all applicable laws regarding downloaded content</li>
  <li>Obtaining proper permissions before downloading content created by others</li>
  <li>Any consequences arising from misuse of our service</li>
</ul>

<h2>9. Privacy</h2>
<p>Your use of SaveTikFast is also governed by our <strong>Privacy Policy</strong>, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our data practices.</p>

<h2>10. Advertising</h2>
<p>SaveTikFast may display advertisements served by Google AdSense and other third-party advertising networks. We are not responsible for the content of third-party advertisements. By using the service, you consent to the display of such advertisements.</p>

<h2>11. Changes to Terms</h2>
<p>We reserve the right to modify these Terms at any time without prior notice. We will notify users of significant changes by updating the date at the top of this page. Your continued use of the service after changes are posted constitutes your acceptance of the revised Terms.</p>

<h2>12. Termination</h2>
<p>We reserve the right to deny access to our service to any user who violates these Terms, without prior notice or liability.</p>

<h2>13. Governing Law</h2>
<p>These Terms shall be governed by and construed in accordance with applicable international laws. Any disputes arising from the use of our service will first be attempted to be resolved through good-faith negotiation.</p>

<h2>14. Contact</h2>
<p>For questions or concerns about these Terms of Service, please contact us at: <strong>support@savetik-fast.xyz</strong></p>
`.trim();

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ Privacy Policy and Terms of Service updated successfully!');
