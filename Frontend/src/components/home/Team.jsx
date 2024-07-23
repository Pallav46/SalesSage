import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const TeamMember = ({ name, role, image, linkedin, twitter, github }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="relative mb-4">
      <img
        src={image}
        alt={name}
        className="w-full h-60 object-cover rounded-lg shadow-md"
      />
    </div>
    <h3 className="text-2xl font-bold text-[#020024] mb-2">{name}</h3>
    <p className="text-[#090979] font-semibold mb-4">{role}</p>
    <div className="flex justify-center space-x-4">
      {linkedin && (
        <a href={linkedin} className="text-[#00D4FF] hover:text-[#090979]">
          <FaLinkedin size={24} />
        </a>
      )}
      {twitter && (
        <a href={twitter} className="text-[#00D4FF] hover:text-[#090979]">
          <FaTwitter size={24} />
        </a>
      )}
      {github && (
        <a href={github} className="text-[#00D4FF] hover:text-[#090979]">
          <FaGithub size={24} />
        </a>
      )}
    </div>
  </div>
);

const Team = () => {
  const team = [
    {
      name: 'Pallav',
      role: 'Frontend Developer',
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      linkedin: 'https://www.linkedin.com/in/pallav',
      twitter: 'https://twitter.com/pallav',
      github: 'https://github.com/pallav',
    },
    {
      name: 'Ishaan',
      role: 'Backend Developer',
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      linkedin: 'https://www.linkedin.com/in/ishaan',
      twitter: 'https://twitter.com/ishaan',
      github: 'https://github.com/ishaan',
    },
    {
      name: 'Ubaid',
      role: 'AI & ML Specialist',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      linkedin: 'https://www.linkedin.com/in/ubaid',
      twitter: 'https://twitter.com/ubaid',
      github: 'https://github.com/ubaid',
    },
  ];

  return (
    <section
      id="team"
      className="py-20 px-4 bg-gradient-to-br from-[#020024] via-[#090979] to-[#00D4FF]"
    >
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold mb-16 text-center text-white">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
