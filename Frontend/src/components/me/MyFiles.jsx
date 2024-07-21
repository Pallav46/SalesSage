import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const response = await axios.get(
          "http://localhost:8000/inventory/view-files/",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setFiles(response.data);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this file!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1D4ED8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const accessToken = Cookies.get("accessToken");
        await axios.delete(
          `http://localhost:8000/inventory/delete-file/${fileId}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setFiles(files.filter((file) => file.file_id !== fileId));
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      Swal.fire('Error!', 'Failed to delete file.', 'error');
    }
  };

  return (
    <div className="p-6 h-[62vh] rounded-lg shadow-lg max-w-full mx-auto scrollbar-container">
      {loading ? 
        <div className="flex items-center justify-center h-full rounded-lg shadow-lg">
          <div className="text-center text-blue-700 font-semibold text-lg">Loading...</div>
        </div>
      : error ? 
        <div className="flex items-center justify-center h-full bg-gradient-to-r from-red-200 via-red-300 to-red-400 p-6 rounded-lg shadow-lg">
          <div className="text-center text-red-700 font-semibold text-lg">{error}</div>
        </div>
      : files.length === 0 ?
        <p className="text-center text-gray-700 text-lg font-medium">No files found.</p>
      :
        files.map((file) => (
          <div
            key={file.file_id}
            className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-opacity-80 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4"
          >
            <div className="flex-1 mb-4 sm:mb-0">
              <p className="font-semibold text-lg text-gray-800">{file.filename}</p>
              <p className="text-sm text-gray-600">
                Uploaded: {new Date(file.uploaded_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(file.file_id)}
              className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))
      }
    </div>
  );
};

export default MyFiles;
