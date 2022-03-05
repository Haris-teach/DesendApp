import { Dimensions, Platform } from "react-native";
import axios from "axios";

export const BASE_URL = "http://192.168.1.175:8000/";

import NetInfo from "@react-native-community/netinfo";
import { printLog } from "../utils/apputils";

export function doPost(urlAction, formData, bearerToken) {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + urlAction, {
      body: formData,
      method: "post",
      headers:
        bearerToken == undefined
          ? new Headers({
              "Content-Type": "multipart/form-data",
            })
          : new Headers({
              Authorization: "Bearer " + bearerToken,
              "Content-Type": "multipart/form-data",
            }),
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

// Axios Method Api function for(get ,post ,patch methods) but not for multiparts

const HitApi = (urlAction, apiMethod, params, token) => {
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
};

export default HitApi;
