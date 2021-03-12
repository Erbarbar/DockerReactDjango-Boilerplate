import { useState } from "react";

const useAsyncReducer = (reducer, initialState = null, django) => {
  const [state, setState] = useState(initialState);
  const dispatch = async (action) => {
    const result = reducer(state, action, django);
    if (typeof result.then === "function") {
      try {
        const newState = await result;
        setState(newState);
      } catch (error) {
        setState({ ...state, error });
      }
    } else {
      setState(result);
    }
  };
  return [state, dispatch];
};
export default useAsyncReducer;
