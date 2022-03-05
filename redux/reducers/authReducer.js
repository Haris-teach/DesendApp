import { LOGIN_REQUEST, LOGOUT_REQUEST, SIGN_UP } from "../actions/actionTypes";

const INITIAL_STATE = {
  id: 1,
  userName: "M.Haris",
  firstName: "Muhammad",
  lastName: "Haris",
  email: "muhammadharis4999@gmail.com",
  isPhone: "09007861",
  password: "123456",
  profilePic: { fileName: "", type: "", uri: "" },
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
        token: action.payload.token,
        firstName: action.payload.firstname,
        lastName: action.payload.lastname,
        id: action.payload.id,
        phone: action.payload.phone,
        uri: action.payload.uri,
      };
      break;
    case SIGN_UP:
      return {
        ...state,
        firstName: action.payload.firstname,
        lastName: action.payload.lastname,
        isPhone: action.payload.phone,
        profilePic: {
          name: action.payload.picname,
          type: action.payload.pictype,
          uri: action.payload.picuri,
        },
      };
      break;
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLogin: false,
        // token: null,
        // userName: 'M.Haris',
        // firstName: 'Muhammad',
        // lastName: 'Haris',
        // id: 1,
        // email: 'muhammadharis4999@gmail.com',
      };
      break;

    default:
      return state;
  }
};