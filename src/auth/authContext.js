import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { getUserProfile } from "src/api/auth";

const HANDLERS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  INITIALIZE: "INITIALIZE",
  IS_LOADING: "IS_LOADING",
  PROFILE: "PROFILE",
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
  [HANDLERS.INITIALIZE]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      authToken: action.payload.authToken || null,
      isAuthenticated: action.payload.authToken ? true : false,
      user: action.payload.user,
    };
  },
  [HANDLERS.IS_LOADING]: (state, action) => {
    return {
      ...state,
      isLoading: action.payload,
    };
  },
  [HANDLERS.PROFILE]: (state, action) => {
    return {
      ...state,
      user: action.payload.user,
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

  const initialize = () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let jwt = window.localStorage.getItem("auth-token");
    if (!jwt) {
      jwt = window.sessionStorage.getItem("token");
    }

    // Get user profile here

    if (jwt) {
      try {
        getUserProfile(jwt).then((res) => {
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: {
              authToken: jwt,
              isAuthenticated: true,
              user: res.data,
            },
          });
        });
      } catch {
        window.localStorage.clear();
        window.sessionStorage.clear();
        dispatch({
          type: HANDLERS.IS_LOADING,
          payload: false,
        });
      }
    } else {
      window.localStorage.clear();
      window.sessionStorage.clear();
      router.push("/auth/login");
      dispatch({
        type: HANDLERS.IS_LOADING,
        payload: false,
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

  const setUserProfile = (user) => {
    dispatch({
      type: HANDLERS.PROFILE,
      payload: {
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
        setUserProfile,
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
