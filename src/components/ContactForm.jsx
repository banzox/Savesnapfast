import React, { useState } from 'react';

export default function ContactForm({ lang, messages }) {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulating form submission
        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="contact-form-container">
            {status === 'success' ? (
                <div className="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p>{messages.success || "Message sent successfully!"}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">{messages.name || "Name"}</label>
                        <input type="text" id="name" name="name" required className="form-input" placeholder={messages.name} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">{messages.email || "Email"}</label>
                        <input type="email" id="email" name="email" required className="form-input" placeholder={messages.email} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">{messages.message || "Message"}</label>
                        <textarea id="message" name="message" required rows="5" className="form-input" placeholder={messages.message}></textarea>
                    </div>

                    <button type="submit" className={`submit-btn ${status === 'submitting' ? 'loading' : ''}`} disabled={status === 'submitting'}>
                        {status === 'submitting' ? (
                            <span className="loader"></span>
                        ) : (
                            messages.submit || "Send Message"
                        )}
                    </button>

                    <p className="fallback-email">
                        Or email us directly at <a href="mailto:contact@savetik-fast.xyz">contact@savetik-fast.xyz</a>
                    </p>
                </form>
            )}

            <style>{`
                .contact-form-container {
                    max-width: 600px;
                    margin: 2rem auto;
                    background: var(--surface);
                    padding: 2rem;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--text-main);
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    border: 1px solid var(--border);
                    background: var(--bg-main);
                    color: var(--text-main);
                    font-size: 1rem;
                    transition: all 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-light);
                }
                .submit-btn {
                    width: 100%;
                    padding: 1rem;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: opacity 0.2s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .submit-btn:hover {
                    opacity: 0.9;
                }
                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .success-message {
                    text-align: center;
                    color: #10B981;
                    padding: 2rem;
                }
                .icon {
                    width: 3rem;
                    height: 3rem;
                    margin: 0 auto 1rem;
                }
                .fallback-email {
                    margin-top: 1.5rem;
                    text-align: center;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
                .fallback-email a {
                    color: var(--primary);
                    text-decoration: none;
                }
                .loader {
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid white;
                    border-radius: 50%;
                    width: 1.2rem;
                    height: 1.2rem;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
