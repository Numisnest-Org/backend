import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocketConnect = () => {
  const socket = io("https://numist-api-dry-flower-8236.fly.dev", {
    autoConnect: false,
  });

  useEffect(() => {
    socket.connect()

    
    const cleanup = () => {
      socket.disconnect();
    };

    return () => {
      cleanup();
    };
  }, []);

  return socket;
};

export default useSocketConnect;
