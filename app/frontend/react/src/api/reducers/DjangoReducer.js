const reducer = (state, action) => {
  return new Promise((resolve) => {
    switch (action.type) {
      case 'checkLogged':
        checkLogged(resolve, state);
        break;
      case 'signup':
        signup(resolve, state, action);
        break;
      case 'login':
        login(resolve, state, action);
        break;
      case 'logout':
        logout(resolve, state);
        break;
      default:
        console.error('Django action not defined');
        return resolve(state);
    }
  });
};

const clearState = (state) => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
  let clearState = {
    ...state,
    token: null,
    refresh: null,
    response: null,
  };
  clearState.api.defaults.headers.common = {
    Accept: clearState.api.defaults.headers.common.Accept,
  };
  return clearState;
};

const checkLogged = (resolve, state) => {
  const token = localStorage.getItem('token');
  const refresh = localStorage.getItem('refresh');
  if (!token || !refresh) return resolve(state);
  state.token = token;
  state.refresh = refresh;
  state.api.defaults.headers.common.Authorization = `JWT ${token}`;
  state.api
    .post('auth/jwt/verify', { token })
    .then(() => resolve(state))
    .catch(() => state.api.post('auth/jwt/refresh/', { refresh }))
    .then((res) => {
      if (res) {
        localStorage.setItem('token', res.data.access);
        state.token = res.data.access;
        state.api.defaults.headers.common.Authorization = `JWT ${state.token}`;
      }
    })
    .catch(() => (state = clearState(state)))
    .finally(() => resolve(state));
};

const signup = (resolve, state, action) => {
  console.log(action.payload);
  state.api
    .post('auth/users/', action.payload)
    .then((response) => {
      let token = response.data.access;
      let refresh = response.data.refresh;
      localStorage.setItem('token', token);
      localStorage.setItem('refresh', refresh);
      state.api.defaults.headers.common.Authorization = `JWT ${token}`;
      state.token = token;
      state.refresh = refresh;
      state.response = response;
    })
    .catch((error) => {
      state = clearState(state);
      state.response = error.response;
    })
    .finally(() => resolve(state));
};

const login = (resolve, state, action) => {
  state.api
    .post('auth/jwt/create/', action.payload)
    .then((response) => {
      let token = response.data.access;
      let refresh = response.data.refresh;
      localStorage.setItem('token', token);
      localStorage.setItem('refresh', refresh);
      state.api.defaults.headers.common.Authorization = `JWT ${token}`;
      state.token = token;
      state.refresh = refresh;
      state.response = response;
    })
    .catch((error) => {
      state = clearState(state);
      state.response = error.response;
    })
    .finally(() => resolve(state));
};

const logout = (resolve, state) => {
  state = clearState(state);
  return resolve(state);
};

export default reducer;
