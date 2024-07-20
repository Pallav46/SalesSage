
const Navbar = () => {
  return (
    <nav className="bg-blue-400 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">SalesSage</h1>
      <button className="text-white text-2xl hover:bg-blue-500 p-2 rounded-full transition-colors">👤</button>
    </nav>
  );
};

export default Navbar;