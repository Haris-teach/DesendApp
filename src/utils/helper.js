import firestore from "@react-native-firebase/firestore";

//this function use for existing chat message

export const sendMessage = async (message, users) => {
  const chatId = await createChatId(users);

  firestore()
    .collection("chats")
    .where("chatId", "==", chatId)
    .get()
    .then((res) => {
      let exists = false;
      console.log("---docs---", res.docs);
      res.docs.forEach((document) => {
        if (document.exists) {
          exists = true;
          firestore()
            .collection("chats")
            .doc(document.id)
            .collection("messages")
            .add(message)
            .then((res) => {
              console.log("message sent successfully");
            });
        }
      });
      if (!exists) {
        startNewChat(message, users, chatId);
      }
    });
};

//this function for new chat messages

export const startNewChat = (message, users, chatId) => {
  firestore()
    .collection("chats")
    .doc(chatId)
    .set({
      members: users,
      createdAt: new Date(),
      chatId: chatId,
      visibleTo: users,
    })
    .then((res) => {
      firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .add(message)
        .then((res) => {
          console.log("message sent successfully");
        });
    });
};

//this function use for join two email and convert into one email

export const createChatId = (users) => {
  let arr = [...new Set(users)];

  var val = "";
  for (var i = 0; i < arr.length; i++) {
    val = val + arr[i];
  }
  return val.split("").sort().join("");
};
