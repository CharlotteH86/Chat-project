//Get hash from url
//wrappa varje app.js med (function(){})
(function () {
  let dataConnection = null;
  const peersEl = document.querySelector(".peers");
  const sendButtonEl = document.querySelector(".send-new-message-button");
  const newMessageEl = document.querySelector(".new-message");
  const messagesEl = document.querySelector(".messages");
  const listPeersButtonEl = document.querySelector(".list-all-peers-button");
  const time = new Date();
  const theirVideoContainer = document.querySelector(".video-container.them");

  const printMessage = (text, who) => {
    const messageEl = document.createElement("div");
    messageEl.classList.add("message", who);
    messageEl.innerHTML = `<div>${time.toLocaleString()} ${text}</div>`;
    messagesEl.append(messageEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const myPeerId = location.hash.slice(1);
  //connect to to peer server
  peer = new Peer(myPeerId, {
    host: "glajan.com",
    port: 8443,
    path: "/myapp",
    secure: true,
    config: {
      iceServers: [
        { urls: ["stun:eu-turn7.xirsys.com"] },
        {
          username:
            "1FOoA8xKVaXLjpEXov-qcWt37kFZol89r0FA_7Uu_bX89psvi8IjK3tmEPAHf8EeAAAAAF9NXWZnbGFqYW4=",
          credential: "83d7389e-ebc8-11ea-a8ee-0242ac140004",
          urls: [
            "turn:eu-turn7.xirsys.com:80?transport=udp",
            "turn:eu-turn7.xirsys.com:3478?transport=udp",
            "turn:eu-turn7.xirsys.com:80?transport=tcp",
            "turn:eu-turn7.xirsys.com:3478?transport=tcp",
            "turns:eu-turn7.xirsys.com:443?transport=tcp",
            "turns:eu-turn7.xirsys.com:5349?transport=tcp",
          ],
        },
      ],
    },
  });

  //Print peer id on connection 'open' event.
  peer.on("open", (id) => {
    const myPeerIdEl = document.querySelector(".my-peer-id");
    myPeerIdEl.innerText = id;
  });
  peer.on("error", (errorMessage) => {
    console.error(errorMessage);
  });
  //On incoming connection
  peer.on("connection", (connection) => {
    //close existing connection and set new connection
    dataConnection && dataConnection.close();

    //set new connection
    dataConnection = connection;

    const event = new CustomEvent("peer-changed", { detail: connection.peer });
    document.dispatchEvent(event);
  });
  //Event listenet för click 'refresh list'

  listPeersButtonEl.addEventListener("click", () => {
    peer.listAllPeers((peers) => {
      const peersList = peers
        .filter((peerId) => {
          if (peerId === peer._id) return false;
          return true;
        })
        .map((peer) => {
          return `<li><button class="connect-button peerId-${peer}">${peer}</button></li>`;
        })
        .join("");

      peersEl.innerHTML = `<ul> ${peersList}</ul>`;

      //Event listener for click on peer button
      peersEl.addEventListener("click", (e) => {
        if (!e.target.classList.contains("connect-button")) return;
        const theirPeerId = e.target.innerHTML;

        //close existing connection
        dataConnection && dataConnection.close();

        //connect to peer
        dataConnection = peer.connect(theirPeerId);
        dataConnection.on("open", () => {
          //dispatch custome event with peer id.
          const event = new CustomEvent("peer-changed", {
            detail: theirPeerId,
          });
          document.dispatchEvent(event);
        });
      });
    });
  });
  document.addEventListener("peer-changed", (e) => {
    const peerId = e.detail;

    const connectButtonEl = document.querySelector(
      `.connect-button.peerId-${peerId}`
    );

    document.querySelectorAll(".connect-button.connected").forEach((button) => {
      button.classList.remove("connected");
    });

    //add class 'connected' to click button.
    connectButtonEl.classList.add("connected");

    connectButtonEl && connectButtonEl.classList.add("connected");

    dataConnection.on("data", (textMessage) => {
      printMessage(textMessage, "them");
    });
    newMessageEl.focus();

    theirVideoContainer.querySelector(".name").innerText = peerId;
    theirVideoContainer.classList.add("connected");
    theirVideoContainer.querySelector(".start").classList.add("active");
    theirVideoContainer.querySelector(".stop").classList.remove("active");
  });

  //send message to peer.
  const sendMessage = (e) => {
    if (!dataConnection) return;
    if (newMessageEl.value === "") return;

    if (e.type === "click" || e.keyCode === 13) {
      dataConnection.send(newMessageEl.value);
      printMessage(newMessageEl.value, "me");

      //clear text input field.
      newMessageEl.value = "";
    }
    //Set focus on text input field.
    newMessageEl.focus();
  };

  //Event listener for click on "send".
  sendButtonEl.addEventListener("click", sendMessage);

  newMessageEl.addEventListener("keyup", sendMessage);

  //Even listenet for click 'Start video' chat.
  const startVideoButton = theirVideoContainer.querySelector(".start");
  const stopVideoButton = theirVideoContainer.querySelector(".stop");
  startVideoButton.addEventListener("click", () => {
    startVideoButton.classList.remove("active");
    stopVideoButton.classList.add("active");

    navigator.mediaDevices
    .getUserMedia({ audio: false, video: true })
    .then((stream) => {
      const video = document.querySelector(".video-container.me video");
      video.muted = true;
      video.srcObject = stream;
    });
    
  });
})();
