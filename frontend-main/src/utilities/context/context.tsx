import { useReducer, createContext } from "react";
import { ContextDataType } from "../types";

export enum ActionType {
  setLogin = "SetLogin",
  setLogout = "SetLogout",
  setUserType = "SetUsertype",
  setUser = "SetUser",
  setForgotPass = "SetForgotPass",
  setAvailableLocation = "SetAvailableLocation",
  setOnlineUsers = "SetOnlineUsers",
  SetNavigateToUrl = "SetNavigateToUrl",
  setAdminLogindetails= "SetAdminLoginDetails",
  setMessageid ="SetMessageId",
  setAddItemsValues = "setAddItemsValues"
}
interface Action {
  type: ActionType;
  payload?: any;
}

interface Props {
  children: React.ReactNode;
}

const initialState: ContextDataType = {
  token: null,
  user: null,
  userType: null,
  forgotEmail: null,
  pin: null,
  availableLocation: null,
  onlineUsers: null,
  navigateToUrl:"",
  adminloginDetails:null,
  Messageid :"",
  addItemsval:null
};
const reducer = (state: ContextDataType, action: Action) => {
  const { type } = action;
  switch (type) {
    case ActionType.setLogin:
      return {
        ...state,
        token: action.payload.token,
      };
    case ActionType.setLogout:
      return {
        ...state,
        token: null,
        user: null,
      };
    case ActionType.setUser:
      return {
        ...state,
        user: action.payload,
      };
    case ActionType.setUserType:
      return {
        ...state,
        userType: action.payload,
      };
    case ActionType.setForgotPass:
      return {
        ...state,
        forgotEmail: action.payload.email,
        pin: action.payload.pin,
      };
    case ActionType.setAvailableLocation:
      return {
        ...state,
        availableLocation: action.payload,
      };
    case ActionType.setOnlineUsers:
      return {
        ...state,
        onlineUsers: action.payload,
      };
    case ActionType.SetNavigateToUrl:
      return {
        ...state,
        navigateToUrl: action.payload,
      };
    case ActionType.setAdminLogindetails:
      return {
        ...state,
        adminloginDetails: action.payload,
      };
    case ActionType.setMessageid:
      return {
        ...state,
        Messageid: action.payload,
      };
    case ActionType.setAddItemsValues:
      return {
        ...state,
        addItemsval: action.payload,
      };

    default:
      return state;
  }
};

const DataValueContext = createContext<{
  state: ContextDataType;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => {} });

const DataValueProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataValueContext.Provider value={{ state, dispatch }}>
      {children}
    </DataValueContext.Provider>
  );
};

export { DataValueContext, DataValueProvider };
