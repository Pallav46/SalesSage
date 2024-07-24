import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import './SalesReport.scss'
import Welcome from "../dashboard/Welcome";
import FileUpload from "../dashboard/FileUpload";

const SalesReport = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("daily");
  const [graphType, setGraphType] = useState("bar");
  const [sortedData, setSortedData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [predictionType, setPredictionType] = useState("sales");
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

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
        setForecast(response.data);
        if (response.data && response.data.forecast) {
          setSelectedProducts(
            response.data.forecast.map((product) => product.product)
          );
        }
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
    if (forecast && forecast.forecast && forecast.forecast.length > 0) {
      const data = forecast.forecast[0].predictions[filter];
      if (data) {
        const sorted = Object.keys(data).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        setSortedData(sorted);
      } else {
        setSortedData([]);
      }
    }
  }, [forecast, filter]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilter = searchParams.get("filter") || "daily";
    const urlGraphType = searchParams.get("graphType") || "bar";
    const urlPredictionType = searchParams.get("predictionType") || "sales";

    if (["daily", "weekly", "monthly"].includes(urlFilter)) {
      setFilter(urlFilter);
    }

    if (["bar", "area", "line"].includes(urlGraphType)) {
      setGraphType(urlGraphType);
    }

    if (["sales", "quantity"].includes(urlPredictionType)) {
      setPredictionType(urlPredictionType);
    }
  }, [location.search]);

  useEffect(() => {
    updateURL(filter, graphType, predictionType);
  }, [filter, graphType, predictionType]);

  const updateURL = (newFilter, newGraphType, newPredictionType) => {
    navigate(
      `?filter=${newFilter}&graphType=${newGraphType}&predictionType=${newPredictionType}`,
      { replace: true }
    );
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleGraphTypeChange = (newGraphType) => {
    setGraphType(newGraphType);
  };

  const handlePredictionTypeChange = (newPredictionType) => {
    setPredictionType(newPredictionType);
  };

  const handleProductToggle = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const handleViewInDetails = () => {
    navigate("/myreport");
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/inventory/upload-sales-file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get("accessToken")}`
        }
      });
      toast.success(response.data.message);
      setFile(null);
      fileInputRef.current.value = '';
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      setFile(null);
      fileInputRef.current.value = '';
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const weekNames = [
    "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8",
    "Week 9", "Week 10", "Week 11", "Week 12", "Week 13", "Week 14", "Week 15", "Week 16",
    "Week 17", "Week 18", "Week 19", "Week 20", "Week 21", "Week 22", "Week 23", "Week 24",
    "Week 25", "Week 26", "Week 27", "Week 28", "Week 29", "Week 30", "Week 31", "Week 32",
    "Week 33", "Week 34", "Week 35", "Week 36", "Week 37", "Week 38", "Week 39", "Week 40",
    "Week 41", "Week 42", "Week 43", "Week 44", "Week 45", "Week 46", "Week 47", "Week 48",
    "Week 49", "Week 50", "Week 51", "Week 52",
  ];

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    switch (filter) {
      case "daily":
        return `${day}${getOrdinalSuffix(day)} ${monthNames[month]} ${year}`;
      case "weekly":
        const [weekYear, week] = dateString.split("-");
        if (weekYear && week) {
          const weekIndex = parseInt(week, 10) - 1;
          return weekIndex >= 0 && weekIndex < weekNames.length
            ? `${weekNames[weekIndex]} of ${weekYear}`
            : dateString;
        }
        return dateString;
      case "monthly":
        const [monthYear, monthNum] = dateString.split("-");
        if (monthYear && monthNum) {
          const monthIndex = parseInt(monthNum, 10) - 1;
          return monthIndex >= 0 && monthIndex < monthNames.length
            ? `${monthNames[monthIndex]} ${monthYear}`
            : dateString;
        }
        return dateString;
      case "yearly":
        return dateString;
      default:
        return dateString;
    }
  };

  const chartData = {
    options: {
      chart: {
        type: graphType,
        height: 350,
        zoom: { enabled: true },
        toolbar: { show: true ,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          autoSelected: 'zoom'
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: { 
        curve: "smooth", 
        width: 2,
        colors: [
          '#00D4FF', '#4d94ff', '#9966ff', '#ff66b3', '#ff9966',
          '#ffcc00', '#33cc33', '#ff3300', '#ff0066', '#cc00ff',
          '#00ccff', '#ff9900', '#66ff66', '#ff6699', '#99ccff'
        ],
      },
      xaxis: {
        type: "category",
        categories: sortedData || [],
        labels: {
          rotate: -45,
          rotateAlways: true,
          formatter: function (value) {
            return formatDate(value);
          },
          style: {
            colors: '#ffffff',
          },
        },
      },
      yaxis: {
        title: { text: predictionType === "sales" ? "Sales" : "Quantity" },
        labels: {
          formatter: (value) => value.toFixed(2),
          style: {
            colors: '#ffffff',
          },
        },
        tickAmount: 5,
      },
      tooltip: {
        x: {
          formatter: function (value) {
            return formatDate(value);
          },
        },
        y: {
          formatter: (value) => value.toFixed(2),
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      legend: {
        show: false,
      },
      theme: {
        mode: 'dark',
        palette: 'palette1',
      },
      colors: [
        '#00D4FF', '#4d94ff', '#9966ff', '#ff66b3', '#ff9966',
        '#ffcc00', '#33cc33', '#ff3300', '#ff0066', '#cc00ff',
        '#00ccff', '#ff9900', '#66ff66', '#ff6699', '#99ccff'
      ],
    },
    series:
      forecast?.forecast
        .filter((product) => selectedProducts.includes(product.product))
        .map((product) => ({
          name: product.product,
          data: (sortedData || []).map((date) =>
            product.predictions[filter] && product.predictions[filter][date]
              ? product.predictions[filter][date][predictionType === "sales" ? 0 : 1]
              : 0
          ),
        })) || [],
  };


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Error: {error.message}
      </div>
    );
  if (!forecast || !forecast.forecast)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No forecast data available.
      </div>
    );

   return (
    <div className="text-white mt-0">
      <div className="max-w-5xl max-h-[80vh] mx-auto backdrop-blur-sm rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Sales Forecast
        </h1>

        <div className="flex justify-between mb-4">
          <button
            onClick={handleViewInDetails}
            className="bg-[#00D4FF] text-[#020024] px-4 py-2 rounded hover:bg-[#00a0c0] transition"
          >
            View in Details
          </button>
          <div className="flex items-center">
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-[#00D4FF] text-[#020024] px-4 py-2 rounded hover:bg-[#00a0c0] transition cursor-pointer mr-2"
            >
              Choose File
            </label>
            <button
              onClick={handleUpload}
              className="bg-[#00D4FF] text-[#020024] px-4 py-2 rounded hover:bg-[#00a0c0] transition"
              disabled={!file || loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-auto overflow-y-auto">
          <div className="flex-grow bg-[#020024]/80 rounded-lg shadow p-3 max-h border-2 border-white">
            <ReactApexChart
              options={{
                ...chartData.options,
                chart: {
                  ...chartData.options.chart,
                  background: 'transparent',
                  foreColor: '#ffffff',
                  height: 350,
                },
                theme: {
                  mode: 'dark',
                  palette: 'palette1',
                },
                xaxis: {
                  ...chartData.options.xaxis,
                  labels: {
                    ...chartData.options.xaxis.labels,
                    style: {
                      colors: '#ffffff',
                    },
                  },
                },
                yaxis: {
                  ...chartData.options.yaxis,
                  labels: {
                    ...chartData.options.yaxis.labels,
                    style: {
                      colors: '#ffffff',
                    },
                  },
                },
                colors: [
                  '#00D4FF', '#4d94ff', '#9966ff', '#ff66b3', '#ff9966',
                  '#ffcc00', '#33cc33', '#ff3300', '#ff0066', '#cc00ff'
                ],
              }}
              series={chartData.series}
              type={graphType}
              height={400}
            />
          </div>

          <div className="w-full lg:w-64 bg-[#020024]/80 rounded-lg shadow p-3 border-2 border-white">
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#00D4FF] mb-2">
                  Time Filter
                </h2>
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="w-full p-2 rounded border border-[#00D4FF] bg-[#090979] text-white text-sm focus:outline-none focus:border-[#00D4FF] focus:ring focus:ring-[#00D4FF] transition"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#00D4FF] mb-2">
                  Graph Type
                </h2>
                <select
                  value={graphType}
                  onChange={(e) => handleGraphTypeChange(e.target.value)}
                  className="w-full p-2 rounded border border-[#00D4FF] bg-[#090979] text-white text-sm focus:outline-none focus:border-[#00D4FF] focus:ring focus:ring-[#00D4FF] transition"
                >
                  <option value="area">Area</option>
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#00D4FF] mb-2">
                  Prediction Type
                </h2>
                <select
                  value={predictionType}
                  onChange={(e) => handlePredictionTypeChange(e.target.value)}
                  className="w-full p-2 rounded border border-[#00D4FF] bg-[#090979] text-white text-sm focus:outline-none focus:border-[#00D4FF] focus:ring focus:ring-[#00D4FF] transition"
                >
                  <option value="sales">Sales</option>
                  <option value="quantity">Quantity</option>
                </select>
              </div>
            </div>

            <div className="h-[10%]">
              <h2 className="text-xl font-semibold text-[#00D4FF] mb-2">
                Select Products
              </h2>
              <div className="h-[35vh] overflow-y-auto pr-2">
                {forecast.forecast.map((product) => (
                  <button
                    key={product.product}
                    className={`w-full p-2 mb-2 rounded text-sm transition-all ${
                      selectedProducts.includes(product.product)
                        ? "bg-[#00D4FF] text-[#020024] hover:bg-[#00a0c0]"
                        : "text-white border border-[#00D4FF] line-through"
                    }`}
                    onClick={() => handleProductToggle(product.product)}
                  >
                    {product.product}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;