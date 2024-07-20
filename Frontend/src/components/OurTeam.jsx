import { useTheme } from '../ThemeContext';

const OurTeam = () => {
  const { isDarkMode } = useTheme();

  // Sample team data (you can replace this with your actual team data)
  const teamMembers = [
    { id: 1, name: 'John Doe', position: 'CEO', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, name: 'Jane Smith', position: 'CTO', bio: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, name: 'Alice Johnson', position: 'Designer', bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
  ];

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
      <h1 className="text-3xl font-bold mb-4">{isDarkMode ? 'Our Team' : 'Our Team'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <div key={member.id} className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
            <h2 className="text-xl font-bold mb-2">{member.name}</h2>
            <p className="text-gray-399 mb-2">{member.position}</p>
            <p className="text-gray-499">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
