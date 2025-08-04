import React, { useState } from 'react';
import './App.css';
import WebGLBackground from './WebGLBackground';

function App() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Create mailto link
    const subject = `Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:info@hegemon.ltd?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    setShowContactModal(false);
  };

  return (
    <div className="app">
      <WebGLBackground />
      <div className="film-grain-overlay"></div>
      
      <div className="content-card">
        <div className="card-header">
          <h1>Hegemon</h1>
        </div>
        
        <div className="card-content">
          <div className="text-section">
            <p>
              Hegemon automates modular, high-throughput data infrastructure frameworks 
              engineered for deployment at both institutional and hyperscale enterprise levels, 
              streamlining computational intelligence pipelines and enabling endogenous 
              AI-native inference across heterogenous data environments.
            </p>
          </div>
          
          <div className="text-section">
            <p>
              Leveraging a systems-level understanding of data lifecycle topologies, 
              Hegemon automates the structural disaggregation of monolithic or entangled 
              legacy systems and the semantic rationalization of hybrid architectures, 
              reconstituted into cloud-agnostic, container-orchestrated microservice 
              ecosystems designed to support schema mutability, semantic versioning, 
              and dynamic composability.
            </p>
          </div>
          
          <div className="text-section">
            <p>
              Hegemon's approach facilitates multi-domain semantic interoperability, 
              enabling deep data entanglement and harmonization without compromising 
              the integrity of primary source constraints, governance frameworks, 
              or critical path dependencies.
            </p>
          </div>
        </div>
        
        <div className="card-footer">
          <div className="footer-info">
            <button 
              className="contact-button"
              onClick={() => setShowContactModal(true)}
            >
              CONTACT
            </button>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Hegemon</h2>
              <button 
                className="close-button"
                onClick={() => setShowContactModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6" 
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 