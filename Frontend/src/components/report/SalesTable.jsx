import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SalesTable = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("daily");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get(
          "http://localhost:8000/inventory/get-forecast/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setForecast(response.data.forecast || []);
      } catch (error) {
        setError(error);
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilter(params.get('filter') || "daily");
    setSortColumn(params.get('sortColumn') || "date");
    setSortOrder(params.get('sortOrder') || "asc");
    setPage(parseInt(params.get('page')) || 1);
    setRowsPerPage(parseInt(params.get('rowsPerPage')) || 10);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams({
      filter,
      sortColumn,
      sortOrder,
      page: page.toString(),
      rowsPerPage: rowsPerPage.toString(),
    });
    navigate(`?${params.toString()}`, { replace: true });
  }, [filter, sortColumn, sortOrder, page, rowsPerPage, navigate]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handleSortChange = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setPage(1);
  };

  // Flatten and sort data
  const filteredData = forecast.flatMap((item) => {
    const filterData = item.predictions[filter] || [];
    return Object.entries(filterData).map(([date, [sales, quantity]]) => ({
      date,
      sales,
      quantity,
      productName: item.product,
    }));
  });

  const sortedData = filteredData.sort((a, b) => {
    const compareValue = sortOrder === "asc" ? 1 : -1;
    if (sortColumn === "date") {
      return (new Date(a.date) - new Date(b.date)) * compareValue;
    }
    if (sortColumn === "productname") {
      return a.productName.localeCompare(b.productName) * compareValue;
    }
    return (a[sortColumn] - b[sortColumn]) * compareValue;
  });

  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  if (loading) return <div className="text-center py-4 text-white">Loading...</div>;
  if (error) return <div className="text-center py-4 text-[#00D4FF]">Error: {error.message}</div>;

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <FaSort className="ml-1" />;
    return sortOrder === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  return (
    <div className="text-white p-6 rounded-lg shadow-xl max-w-6xl mx-auto border-2 bg-[#08081d] bg-opacity-80 backdrop-blur-0 border-[#fff] border-2">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 text-sm">
        <div className="mb-4 sm:mb-0">
          <label htmlFor="filter" className="mr-2 text-[#00D4FF] font-semibold">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="bg-[#090979] text-white p-2 rounded-md border border-[#00D4FF] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label htmlFor="rowsPerPage" className="mr-2 text-[#00D4FF] font-semibold">Rows:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="bg-[#090979] text-white p-2 rounded-md border border-[#00D4FF] focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full rounded-lg text-sm">
          <thead className="bg-[#263ba6]">
            <tr>
              {["Date", "Product Name", "Sales", "Quantity"].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-[#fff] uppercase tracking-wider cursor-pointer hover:bg-[#0c0c4d] transition-colors duration-200"
                  onClick={() => handleSortChange(header.toLowerCase().replace(' ', ''))}
                >
                  <div className="flex justify-between items-center">
                    <span>{header}</span>
                    <SortIcon column={header.toLowerCase().replace(' ', '')} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#020024]">
            {paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-[#0c0c4d] transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">${item.sales.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="mb-4 sm:mb-0 text-[#00D4FF]">
          Showing {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, sortedData.length)} of {sortedData.length}
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="mr-2 px-3 py-2 bg-[#090979] rounded-md disabled:opacity-50 hover:bg-[#0c0c4d] transition-colors duration-200"
          >
            <FaChevronLeft />
          </button>
          <span className="mr-2 text-[#00D4FF]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-2 bg-[#090979] rounded-md disabled:opacity-50 hover:bg-[#0c0c4d] transition-colors duration-200"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;