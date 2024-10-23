// import io from "socket.io-client";

// const socket = io("http://localhost:8000", {
//   autoConnect: false,
// });

// export const generateResponseStream = (messages, onMessage) => {
//   socket.connect();

//   socket.on("connect", () => {
//     socket.emit("chat_message", messages);
//   });

//   socket.on("chat_response", (chunk) => {
//     onMessage(chunk);
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket.IO connection closed");
//   });

//   socket.on("connect_error", (error) => {
//     console.error("Socket.IO connection error: ", error);
//     window.location.href = "/error";
//   });

//   return {
//     close: () => {
//       socket.disconnect();
//     },
//   };
// };
