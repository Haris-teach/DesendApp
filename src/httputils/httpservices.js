import { Dimensions, Platform } from "react-native";
import axios from "axios";

export const BASE_URL = "http://ec2-54-160-218-3.compute-1.amazonaws.com/";
//export const BASE_URL = "http://192.168.0.151:3000/";

import NetInfo from "@react-native-community/netinfo";
import { printLog } from "../utils/apputils";

export function doPost(urlAction, formData, token) {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + urlAction, {
      body: formData,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        authToken: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        printLog("responseJson", responseJson);
        resolve(responseJson);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

export function doGetAPICall(urlAction, bearerToken) {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + urlAction, {
      method: "get",
      headers: new Headers({
        Authorization: "Bearer " + bearerToken,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

////////Check Internet Connectivity start
export function checkConnectivity() {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then((state) => {
      resolve(state.isConnected);
      // actions.isNetConnected(state.isConnected)
      printLog("Connection type", state.type);
      printLog("Is connected?", state.isConnected);
    });
  });
}
// Check Internet connectivity end

export function formDataAPi(urlAction, params) {
  let url = BASE_URL + urlAction;

  var options = {
    url,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: params,
  };
  try {
    return axios(options)
      .then((response) => {
        console.log("API respones", response.data);
        return response.data;
      })

      .catch((e) => {
        console.log("Error is=====: ", e.response.data);
        return e.response.data;
      });
  } catch (e) {
    console.log("Error is: ", e);
  }
}

// Axios Method Api function for(get ,post ,patch methods) but not for multiparts

const HitApi = (urlAction, apiMethod, params, token) => {
  try {
    let url = BASE_URL + urlAction;
    var options = {
      url,
      method: apiMethod,
      headers: {
        Accept: "application/json",
        "Content-Type": params == "" ? null : "application/json",
        authToken: token,
      },
      data: params,
    };

    return axios(options)
      .then((response) => {
        console.log("API respones", response.data);
        return response.data;
      })

      .catch((e) => {
        console.log("Error is=====: ", e.response.data);
        return e.response.data;
      });
  } catch (e) {
    console.log("Error is: ", e);
    return e;
  }
};

export default HitApi;
