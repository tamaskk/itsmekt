import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/add-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br text-black from-blue-50 via-indigo-50 to-slate-100 flex flex-col items-center justify-center relative overflow-y-auto">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl font-bold"
          style={{
              fontFamily: "Caprasimo",
              fontWeight: 400,
              fontStyle: "normal",
          }}
          >Contact</h1>
          <p className="text-gray-600 mb-6">
            Don&apos;t hesitate to reach out if you have any questions or would like to discuss your event.
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <p className="text-center">Message sent successfully! I'll get back to you soon.</p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="text-center">{errorMessage}</p>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center justify-center max-w-md mx-auto">
          <div className="flex flex-col gap-2 w-full">   
            <p>Name</p>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Stevan Adam" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              required
            />
          </div>
          <div className="flex flex-col gap-2 w-full">   
            <p>Email</p>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              required
            />
          </div>
          <div className="flex flex-col gap-2 w-full">   
            <p>Message</p>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell me about your event or project..." 
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md resize-none" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
