//================================ React Native Imported Files ======================================//

import React, { useEffect } from "react";
// import auth from '@react-native-firebase/auth';
import firestore, { firebase } from "@react-native-firebase/firestore";

//================================ Local Imported Files ====================================== //

// ---------------------------- Fetch Record On Login ---------------------------- //

export const fetchUserData = async (userId, callback) => {
  // firebase.initializeApp()
  await firestore()
    .collection("UserRecords")
    .doc(String(userId))
    .get()
    .then((resp) => {
      console.log("Callback", resp);
      callback(resp);
    });
};

export const createUserRecord = async (
  userId,
  name,
  url,
  fcmToken,
  callback
) => {
  await firestore()
    .collection("UserRecords")
    .doc(String(userId))
    .get()
    .then((documentSnapshot) => {
      console.log("User exists: ", documentSnapshot.exists);
      if (documentSnapshot.exists) {
        firestore()
          .collection("UserRecords")
          .doc(String(userId))
          .update({
            id: userId,
            name: name,
            profileImage: url,
            fcmToken: fcmToken,
            // groupThreads: [],
          })
          .then((resp) => {
            callback(resp);
          });
      } else {
        firestore()
          .collection("UserRecords")
          .doc(String(userId))
          .set({
            id: userId,
            name: name,
            profileImage: url,
            fcmToken: fcmToken,
            chatThreads: [],
            groupThreads: [],
          })
          .then((resp) => {
            callback(resp);
          });
      }
    });
};

export const deleteMessage = async (msgId, callback) => {
  const snapshot = await firestore()
    .collection("ChatMessages")
    .where("_id", "==", msgId)
    .get();
  snapshot.forEach(async (doc) => {
    await firestore().collection("ChatMessages").doc(doc.id).delete();
  });
};

// ---------------------------- Chat Firebase Functions Global ---------------------------- //

export const fetchChatMessageOfOneId = (userId, otherID, callback) => {
  console.log(" userId + /+ otherID", userId + "/" + otherID);
  let value = 0;
  let query1 = firestore()
    .collection("ChatMessages")
    .where("participants", "==", userId + "/" + otherID)
    .where("group", "==", false);

  console.log("Query111", query1);
  query1.onSnapshot((resp) => {
    if (resp)
      if (resp._docs.length > 0) {
        value = 1;
        // callback(1)
      }
  });
  let query2 = firestore()
    .collection("ChatMessages")
    .where("participants", "==", otherID + "/" + userId);
  query2.onSnapshot((res) => {
    if (res)
      if (res._docs.length > 0) {
        value = 2;
        // callback(2)
      }
  });
  setTimeout(() => {
    if (value === 1) {
      callback(1);
    } else if (value === 2) {
      callback(2);
    } else if (value === 0) {
      callback(3);
    }
  }, 1000);
};
export const fetchChatMessageOfOneIdAndDelete = async (
  userId,
  otherID,
  callback
) => {
  console.log("Working....", userId, otherID);
  let query1 = await firestore()
    .collection("ChatMessages")
    .where("participants", "==", userId + "/" + otherID)
    .get()
    .then((querySnapshot) => {
      console.log("Total users: ", querySnapshot.size);
      querySnapshot.forEach((documentSnapshot) => {
        console.log("User ID: ", documentSnapshot.id, documentSnapshot.data());

        let deleteList = [];
        if (documentSnapshot.data().deleteBy) {
          deleteList = documentSnapshot.data().deleteBy;
        }
        !deleteList.includes(userId) && deleteList.push(userId);

        firestore()
          .collection("ChatMessages")
          .doc(documentSnapshot.id)
          .update({ deleteBy: deleteList });
      });
    });
  let query2 = await firestore()
    .collection("ChatMessages")
    .where("participants", "==", otherID + "/" + userId)
    .get()
    .then((querySnapshot) => {
      console.log("Total users: ", querySnapshot.size);
      querySnapshot.forEach((documentSnapshot) => {
        console.log("User ID: ", documentSnapshot.id, documentSnapshot.data());

        let deleteList = [];
        if (documentSnapshot.data().deleteBy) {
          deleteList = documentSnapshot.data().deleteBy;
        }
        !deleteList.includes(userId) && deleteList.push(userId);
        firestore()
          .collection("ChatMessages")
          .doc(documentSnapshot.id)
          .update({ deleteBy: deleteList });
      });
    });
};

export const fetchChatMessageOfGroup = (groupId, callback) => {
  console.log("_________>>>>>>>", groupId);
  let value = 0;
  let query1 = firestore()
    .collection("ChatMessages")
    .where("groupId", "==", groupId);
  query1.onSnapshot((resp) => {
    if (resp._docs.length > 0) {
      value = 1;
      // callback(1)
    }
  });
  setTimeout(() => {
    if (value === 1) {
      callback(1);
    } else if (value === 2) {
      callback(2);
    } else if (value === 0) {
      callback(3);
    }
  }, 1000);
};
export const firebaseOnSendMessage = async (messageData, callback) => {
  console.log("Messagedata==>", messageData);
  await firestore()
    .collection("ChatMessages")
    .add(messageData)
    .then((resp) => {
      callback(resp);
    });
};

export const updateProfileForUser = async (userId, profileData, callback) => {
  console.log("updateProfileForUser", userId, profileData);
  await firestore()
    .collection("UserRecords")
    .doc(String(userId))
    .update(profileData)
    .then((response) => {
      callback({
        isSuccess: true,
        response: response,
        message: "Profile Thread Updated successfully",
      });
    })
    .catch((error) => {
      callback({ isSuccess: false, response: null, message: error });
    });
};

export const fetchLiveChatMessages = (userId, otherID, callback) => {
  console.log("LIVE MSG", userId, otherID);
  let firebaseCollection = firestore().collection("ChatMessages");
  firebaseCollection = firebaseCollection
    .where("participants", "==", userId + "/" + otherID)
    .where("group", "==", false);
  let unsubscribe = firebaseLiveFetch(firebaseCollection, (liveCallback) => {
    callback(liveCallback);
  });
  return unsubscribe;
};
export const fetchLiveGroupChatMessages = (groupId, callback) => {
  let firebaseCollection = firestore().collection("ChatMessages");
  firebaseCollection = firebaseCollection.where("groupId", "==", groupId);
  let unsubscribe = firebaseLiveFetch(firebaseCollection, (liveCallback) => {
    callback(liveCallback);
  });
  return unsubscribe;
};
export const getMsgThreads = async (userId, callback) => {
  console.log("Thread=>");
  firestore()
    .collection("UserRecords")
    .doc(String(userId))
    .onSnapshot((documentSnapshot) => {
      // console.log('getMsgThreads: ', documentSnapshot.data());
      if (documentSnapshot && documentSnapshot.data())
        callback(documentSnapshot.data());
      else callback([]);
      // callback(documentSnapshot.data());
    });
};
export const firebaseLiveFetch = (collection, callback) => {
  let unsubscribe = collection.onSnapshot((snapshot) => {
    if (snapshot) {
      callback({
        isSuccess: true,
        response: snapshot,
        reference: unsubscribe,
        message: "Live Data fetched successfully",
      });
    } else {
      callback({
        isSuccess: false,
        response: snapshot,
        reference: unsubscribe,
        message: "Live Data Not found",
      });
    }
  });
  return unsubscribe;
};
// ---------------------------- Notification ---------------------------- //

export const onSendNotifications = (tokens, title, body, callback) => {
  let url =
    "https://fcm.googleapis.com/v1/projects/itl-app-335305/messages:send";
  console.log("body", body, tokens, title);

  // let notificationBody = {
  //   to: tokens,
  //   notification: {
  //     priority: 'high',
  //     title: title,
  //     body: body,
  //     content_available: true,
  //     OrganizationId: '2',
  //     // subtitle: 'New Message Received',
  //   },
  //   data: {
  //     priority: 'high',
  //     sound: 'default',
  //     contentAvailable: true,
  //     // bodyText: 'New Message',
  //   },
  // };
  let data = JSON.stringify({
    message: {
      token:
        "dNzP9fCKS6OSdf_hT0kzSw:APA91bHCQoXQkl7jfZb_MvLNRgMy8ltKnaCGOhfn9CjGcFJeNuTfoFMisZcOY2FLHNoWHhuABVijT43tFeMIrhRk62cRLcmEuy6pIYXnIMNRa2C7DQwDjX8H3ow-9PXCouqLz8SJ1q4w",
      notification: {
        body: "This is an FCM notification message!",
        title: "From mobile Message",
      },
    },
  });
  let fetchProperties = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer ya29.A0ARrdaM8ug0pt59fSLiSvbZc21BEpSAmQIny9XsQ1LWedhJ8fkADxFKG18nPJUFgTeYRZ6bRwXKmxNwHA6YAYbEDvPNTM9hD1B2Q9KX4bWUAbuhEBEaPZxjKpFJoHJkxiPPiIhsl4oM-trAvh85OFWnYKI4NE",
    },
    body: data,
  };
  fetch(url, fetchProperties)
    .then((res) => {
      console.log("Fetch Response ====>>> ", res);
      // callback(true);
    })
    .catch((error) => {
      console.log("error:  ", error);
    });
};

export const addBanUser = async (userId, data) => {
  await firestore().collection("UserRecords").doc(String(userId)).update({
    blockUsers: data,
  });
};

export const addBanUserToOtherUserProfile = async (userId, data) => {
  await firestore().collection("UserRecords").doc(String(userId)).update({
    blockUsers: data,
  });
};
