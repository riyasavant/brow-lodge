import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { doLogin } from "src/api/lib/auth";
import { useRouter } from "next/router";

const HANDLERS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  INITIALIZE: "INITIALIZE",
};

const initialState = {
  authToken: null,
  isLoading: true,
  user: null,
  isAuthenticated: false,
};

const handlers = {
  [HANDLERS.LOGIN]: (state, action) => {
    return {
      ...state,
      authToken: action.payload.authToken,
      isAuthenticated: true,
      user: action.payload.user,
    };
  },
  [HANDLERS.LOGOUT]: (state) => {
    return {
      ...state,
      authToken: null,
      user: null,
      isAuthenticated: false,
    };
  },
  [HANDLERS.INITIALIZE]: (state) => {
    return {
      ...state,
      isLoading: false,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const router = useRouter();

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let jwt = window.localStorage.getItem("auth-token");
    if (!jwt) {
      jwt = window.sessionStorage.getItem("token");
    }

    if (jwt) {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    } else {
      router.push("/auth/login");
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const setLogin = (jwt, user) => {
    dispatch({
      type: HANDLERS.LOGIN,
      payload: {
        authToken: jwt,
        user,
      },
    });
  };

  const logout = () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
