
import { createContext, useContext, ReactNode } from "react";
import { Socket } from "socket.io-client"; 

interface SocketContextProps {
  socket: Socket;
  children?: ReactNode;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC<SocketContextProps> = ({
  socket,
  children,
}) => (
  <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};
