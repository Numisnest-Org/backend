import { useContext } from "react";
import { DataValueContext } from "src/utilities/context/context";
const useAppContext = () => {
   return useContext(DataValueContext);
};

export default useAppContext;
