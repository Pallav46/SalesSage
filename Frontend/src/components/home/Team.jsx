import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const TeamMember = ({ name, role, linkedin, twitter, github }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
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
      name: 'Pallav Kumar',
      role: 'Frontend Developer',
      linkedin: 'https://www.linkedin.com/in/pallav-kumar-990435258/',
      github: 'https://github.com/Pallav46',
    },
    {
      name: 'Ishaan Das',
      role: 'Backend Developer',
      linkedin: 'https://www.linkedin.com/in/ishaan-das-2813b6200/',
      github: 'https://github.com/ishaan19d',
    },
    {
      name: 'Ubaid Abbas',
      role: 'AI & ML Specialist',
      linkedin: 'https://www.linkedin.com/in/ubaid-abbas/',
      github: 'https://github.com/ubaid2751',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 fles justify-center align-middle text-center">
          {team.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
