import React, { useState, useEffect } from "react";
import axios from "axios";

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<"checking" | "online" | "offline" | "error">("checking");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    checkBackendStatus();
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    // If we're in mock mode, don't check backend
    if (localStorage.getItem("API_MOCK_MODE") === "true") {
      setStatus("online");
      return;
    }
    try {
      setStatus("checking");
      // Используем HEAD запрос к корню API для проверки доступности
      const response = await axios.head("/", {
        timeout: 3000,
        validateStatus: (status) => status < 500
      });
      setStatus("online");
      console.log("Backend connection successful", response.status);
    } catch (error) {
      console.error("Backend connection error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      setStatus("error");
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Не показываем ничего, если offline
  if (status === "offline" || status === "error") {
    if (status === "error" && errorDetails) {
      return (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Backend Error: {errorDetails}
          </div>
        </div>
      );
    }
    return null;
  }

  // Можно оставить индикатор только для online/checking
  if (status === "online") {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg text-sm z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Backend Online
        </div>
      </div>
    );
  }

  // Пока проверяем — можно показывать индикатор
  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg text-sm z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        Checking Backend...
      </div>
    </div>
  );
};

export default BackendStatus;
