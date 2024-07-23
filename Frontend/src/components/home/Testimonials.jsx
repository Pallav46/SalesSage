import React from 'react';

const TestimonialCard = ({ quote, author, company }) => (
  <div className="bg-white bg-opacity-10 p-6 rounded-lg">
    <p className="mb-4 italic">"{quote}"</p>
    <p className="font-semibold">{author}</p>
    <p className="text-sm text-gray-300">{company}</p>
  </div>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote: "SalesSage revolutionized our sales strategy. The AI predictions are spot-on!",
      author: "Jane Doe",
      company: "Tech Innovators Inc."
    },
    {
      quote: "The real-time chat feature saved us countless hours in data analysis.",
      author: "John Smith",
      company: "Global Sales Co."
    },
    {
      quote: "SalesSage's insights helped us increase our revenue by 30% in just three months.",
      author: "Alice Johnson",
      company: "StartUp Masters"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;