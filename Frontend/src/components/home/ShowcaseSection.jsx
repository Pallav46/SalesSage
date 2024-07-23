import React from 'react';
// import screenshot1 from '../../../../screenshots/SalesSage.png';
// import screenshot2 from 'path/to/screenshot2.png';

const ShowcaseSection = () => (
  <div className="showcase bg-gray-100 py-16 text-gray-800">
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold">Explore SalesAge</h2>
      <div className="mt-8 flex flex-wrap justify-center">
        <div className="showcase-item w-full sm:w-1/2 p-4">
          <img src={''} alt="SalesAge Screenshot 1" className="rounded shadow-lg mx-auto" />
          <p className="mt-4">Our intuitive dashboard gives you a comprehensive overview of your sales data.</p>
        </div>
        <div className="showcase-item w-full sm:w-1/2 p-4">
          <img src={''} alt="SalesAge Screenshot 2" className="rounded shadow-lg mx-auto" />
          <p className="mt-4">Easily navigate through your sales reports and predictions.</p>
        </div>
      </div>
    </div>
  </div>
);

export default ShowcaseSection;
