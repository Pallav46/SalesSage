import React from 'react';

const About = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">About Us</h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
          We are a team of passionate professionals dedicated to providing high-quality services to meet your needs. Our expertise and commitment to excellence ensure that we deliver exceptional results for every project.
        </p>
        <div className="flex flex-col md:flex-row md:justify-center gap-8">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our mission is to offer innovative solutions and outstanding service to help our clients achieve their goals.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We envision a future where our solutions drive success and create value for our clients and community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
