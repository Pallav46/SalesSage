import React from 'react';

const TeamSection = () => (
  <div className="team bg-white py-16 text-gray-800">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold">Meet Our Team</h2>
      <div className="mt-8 flex flex-wrap justify-center">
        <div className="team-member w-full sm:w-1/3 p-4">
          <img src="path/to/pallav.jpg" alt="Pallav" className="rounded-full mx-auto w-32 h-32 object-cover" />
          <h3 className="text-xl font-bold mt-4">Pallav</h3>
          <p className="mt-2">Frontend Developer</p>
        </div>
        <div className="team-member w-full sm:w-1/3 p-4">
          <img src="path/to/ishaan.jpg" alt="Ishaan" className="rounded-full mx-auto w-32 h-32 object-cover" />
          <h3 className="text-xl font-bold mt-4">Ishaan</h3>
          <p className="mt-2">Backend Developer</p>
        </div>
        <div className="team-member w-full sm:w-1/3 p-4">
          <img src="path/to/ubaid.jpg" alt="Ubaid" className="rounded-full mx-auto w-32 h-32 object-cover" />
          <h3 className="text-xl font-bold mt-4">Ubaid</h3>
          <p className="mt-2">AI & ML Specialist</p>
        </div>
      </div>
    </div>
  </div>
);

export default TeamSection;
