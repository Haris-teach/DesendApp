import {
  CLIPBOARD,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  SAVE_CONTACTS,
  SETTINGSUPDATE,
  SIGN_UP,
  UPDATEPROFILE,
} from "../actions/actionTypes";

const INITIAL_STATE = {
  id: 1,
  userName: "Dummy User",
  firstName: "Dummy",
  lastName: "User",
  email: "DummyUser@gmail.com",
  isPhone: "090078601",
  password: "1111",
  profilePic: { fileName: "", type: "", uri: "" },
  uri: "",
  token: null,
  isLogin: false,
  contactsList: [],
  status: "",
  userSetting: {},
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
        isPhone: action.payload.phone,
        uri: action.payload.profileimage,
        userName: `${action.payload.firstname} ${action.payload.lastname}`,
        status: "Don't stop improvement",
        userSetting: action.payload.usersetting,
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
    case SAVE_CONTACTS:
      return {
        ...state,
        contactsList: action.payload,
      };
      break;

    case UPDATEPROFILE:
      return {
        ...state,
        uri: action.payload.uri,
        userName: action.payload.name,
        status: action.payload.status,
      };
      break;

    case SETTINGSUPDATE:
      return {
        ...state,
        userSetting: action.payload,
      };

    case LOGOUT_REQUEST:
      return {
        ...state,
        id: 1,
        userName: "Dummy User",
        firstName: "Dummy",
        lastName: "User",
        email: "DummyUser@gmail.com",
        isPhone: "090078601",
        password: "1111",
        profilePic: { fileName: "", type: "", uri: "" },
        uri: "",
        token: null,
        isLogin: false,
        contactsList: [],
        status: "",
        userSetting: {},
      };
      break;

    default:
      return state;
  }
};
