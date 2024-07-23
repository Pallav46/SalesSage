import React, { useState } from 'react';

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-4xl font-bold mb-12 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 p-8 rounded-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-transparent border border-[#00D4FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-transparent border border-[#00D4FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 bg-transparent border border-[#00D4FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-[#00D4FF] text-[#090979] py-2 rounded-full font-semibold hover:bg-blue-400 transition duration-300">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUsSection;