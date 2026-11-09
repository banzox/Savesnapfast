import React, { useState } from "react";

export default function ContactForm({ messages = {} }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("Support Inquiry");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle");

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanSubject = encodeURIComponent(`[SaveTikFast] ${subject} - ${name}`);
        const cleanBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        window.location.href = `mailto:support@savetik-fast.xyz?subject=${cleanSubject}&body=${cleanBody}`;
        setStatus("success");
    };

    return (
        <div className="contact-form-container">
            <h3>{messages.formTitle || "Send a Direct Message"}</h3>
            {status === "success" ? (
                <div className="success-message" role="status">
                    <p>
                        {messages.success ||
                            "Your email client has been opened with your message addressed to support@savetik-fast.xyz."}
                    </p>
                    <button
                        type="button"
                        className="reset-btn"
                        onClick={() => setStatus("idle")}
                    >
                        {messages.sendAnother || "Write Another Message"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="contact-name">{messages.name || "Name"}</label>
                            <input
                                type="text"
                                id="contact-name"
                                name="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                                placeholder={messages.name || "Your Name"}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-email">{messages.email || "Email"}</label>
                            <input
                                type="email"
                                id="contact-email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact-subject">{messages.subject || "Category"}</label>
                        <select
                            id="contact-subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="form-input"
                        >
                            <option value="Technical Support">Technical Support</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="DMCA / Copyright Notice">DMCA / Copyright Notice</option>
                            <option value="Business & Advertising">Business &amp; Advertising</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact-message">{messages.message || "Message"}</label>
                        <textarea
                            id="contact-message"
                            name="message"
                            required
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="form-input"
                            placeholder={messages.placeholder || "How can we help you?"}
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn">
                        {messages.submit || "Compose Email to Support"}
                    </button>

                    <p className="fallback-email">
                        Direct Support Email:{" "}
                        <a href="mailto:support@savetik-fast.xyz">support@savetik-fast.xyz</a>
                    </p>
                </form>
            )}

            <style>{`
                .contact-form-container {
                    margin: 2.5rem 0 0.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1.75rem;
                    border-radius: 16px;
                    border: 1px solid var(--border);
                }
                [data-theme="light"] .contact-form-container {
                    background: #f8fafc;
                }
                .contact-form-container h3 {
                    margin: 0 0 1.25rem;
                    font-size: 1.3rem;
                    color: var(--text-main);
                }
                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 1rem;
                }
                .form-group {
                    margin-bottom: 1.15rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.45rem;
                    font-weight: 600;
                    font-size: 0.92rem;
                    color: var(--text-main);
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem 0.9rem;
                    border-radius: 10px;
                    border: 1px solid var(--border);
                    background: var(--bg);
                    color: var(--text-main);
                    font-size: 0.98rem;
                    font-family: inherit;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--secondary);
                }
                .submit-btn, .reset-btn {
                    width: 100%;
                    padding: 0.9rem 1.25rem;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    color: #ffffff;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: transform 0.2s ease, opacity 0.2s ease;
                }
                .submit-btn:hover, .reset-btn:hover {
                    opacity: 0.94;
                    transform: translateY(-1px);
                }
                .success-message {
                    text-align: center;
                    padding: 1.25rem;
                    border-radius: 12px;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }
                .fallback-email {
                    margin-top: 1.1rem;
                    margin-bottom: 0 !important;
                    text-align: center;
                    font-size: 0.92rem;
                    color: var(--text-dim);
                }
            `}</style>
        </div>
    );
}
