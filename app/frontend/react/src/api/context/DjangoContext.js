import React, { createContext } from "react";
import useAsyncReducer from "../reducers/AsyncReducer";
import reducer from "../reducers/DjangoReducer";
import axios from "axios";

const REACT_PORT = 3000;
const DJANGO_PORT = 8000;

const url = () => {
  let origin = window.location.origin;
  if (
    origin.indexOf("localhost:" + REACT_PORT) !== -1 ||
    origin.indexOf("127.0.0.1:" + REACT_PORT) !== -1
  ) {
    return origin.slice(0, origin.lastIndexOf(":") + 1) + DJANGO_PORT + "/api/";
  }
  return origin + "/api/";
};

let DjangoContext = createContext();

const initialState = {
  api: axios.create({ baseURL: url() }),
  token: null,
  refresh: null,
  response: null,
};

const createActions = (dispatch) => {
  return {
    checkLogged: () => dispatch({ type: "checkLogged" }),
    login: (payload) => dispatch({ type: "login", payload }),
    signup: (payload) => dispatch({ type: "signup", payload }),
    logout: () => dispatch({ type: "logout" }),
  };
};

function DjangoContextProvider(props) {
  const [state, dispatch] = useAsyncReducer(reducer, initialState);
  const actions = createActions(dispatch);

  return (
    <DjangoContext.Provider value={{ state, actions }}>
      {props.children}
    </DjangoContext.Provider>
  );
}

export { DjangoContext, DjangoContextProvider };
