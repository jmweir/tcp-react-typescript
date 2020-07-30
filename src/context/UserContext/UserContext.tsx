import React from "react";
import { useAuth } from "../AuthContext/AuthContext";

export type LoginInfo = { username: string; password: string };
type UserAction = { type: "login" | "logout"; payload?: LoginInfo };
type UserDispatch = (action: UserAction) => void;
type UserState = { loggedIn: boolean; error: string };
type UserProviderProps = { children: React.ReactNode };

const UserStateContext = React.createContext<UserState | undefined>(undefined);
const UserDispatchContext = React.createContext<UserDispatch | undefined>(
  undefined
);

function userReducer(state: UserState, action: UserAction) {
  switch (action.type) {
    case "login": {
      return {
        loggedIn: true,
        error: "",
      };
    }
    case "logout": {
      return { ...state, loggedIn: false };
    }
  }
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { status } = useAuth();

  const defaultState = {
    loggedIn: status === "authenticated",
    error: "",
  };

  const [state, dispatch]: [
    UserState,
    UserDispatch
  ] = React.useReducer(userReducer, { ...defaultState });

  React.useEffect(() => {
    if (status === "authenticated") dispatch({ type: "login" });
  }, [status]);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

function useUserState(): UserState {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a CountProvider");
  }

  return context;
}

function useUserDispatch(): UserDispatch {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a CountProvider");
  }

  return context;
}

export { UserProvider, useUserState, useUserDispatch };
