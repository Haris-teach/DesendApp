import { LOGIN_REQUEST, LOGOUT_REQUEST } from "../Action/actionTypes";

const INITIAL_STATE = {
  id: 1,
  userName: "M.Haris",
  firstName: "Muhammad",
  lastName: "Haris",
  email: "muhammadharis4999@gmail.com",
  password: "123456",
  token: null,
  loading: false,
  isLogin: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLogin: true,
      };
      break;
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLogin: false,
      };
      break;

    default:
      return state;
  }
};
