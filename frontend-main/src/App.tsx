import {Router} from "./router/routes";
import MuiThemeProvider from "./utilities/theme/MuiThemeProviders";
import './App.css'
import { DataValueProvider } from './utilities/context/context';
import {ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { io, Socket } from "socket.io-client";
import { SocketProvider } from "./utilities/context/socketContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import useScrollToTop from "./hooks/useScrolllToTop";
function App() {
  const socketUrl = import.meta.env.VITE_SOCKET_BASE_URL;

  const socket: Socket = io("https://numisnest-api.fly.dev");
  return (
    <>
      {" "}
      <SocketProvider socket={socket}>
        <DndProvider backend={HTML5Backend}>
          <DataValueProvider>
            <MuiThemeProvider>
              <Router />
              <ToastContainer />
            </MuiThemeProvider>
          </DataValueProvider>
        </DndProvider>
      </SocketProvider>
    </>
  );
}

export default App
