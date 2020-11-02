//Get hash from url
//wrappa varje app.js med (function(){})
(function () {
  let dataConnection = null;
  const myPeerId = location.hash.slice(1);
  const peersEl = document.querySelector(".peers");

  //connect to to peer server
  peer = new Peer(myPeerId, {
    host: "glajan.com",
    port: 8443,
    path: "/myapp",
    secure: true,
  });

  //Print peer id on connection 'open' event.
  peer.on("open", (id) => {
    //console.log(id);
    const myPeerIdEl = document.querySelector(".my-peer-id");
    myPeerIdEl.innerText = id;
  });
  peer.on("error", (errorMessage) => {
    console.error(errorMessage);
  });

  //Event listenet för click 'refresh list'
  const listPeersButtonEl = document.querySelector(".list-all-peers-button");

  listPeersButtonEl.addEventListener("click", () => {
    peer.listAllPeers((peers) => {
      //console.log(peers);
      /* const listItems = peers.filter((peerId)=>{
      if(peerId === peer._id) return false;
      return true;
    })*/

      const peersList = peers
        .filter((peerId) => {
          if (peerId === peer._id) return false;
          return true;
        })
        .map((peer) => {
          return `<li><button class="connect-button peerId-${peer}">${peer}</button></li>`;
        })
        .join("");

      //connect-button peerId-${peer}

      peersEl.innerHTML = peersList;

      //Event listener for click on peer button
      peersEl.addEventListener("click", (e) => {
        if (!e.target.classList.contains("connect-button")) return;

        console.log(e.target.innerText);
        const theirPeerId = e.target.innerHTML;

        //close existing connection
        dataConnection && dataConnection.close();
        
        //connect to peer
        //const dataConnection = peer.connect(theirPeerId);
        dataConnection = peer.connect(theirPeerId);

        dataConnection.on("open", () => {
          //dispatch custome event with peer id.
          const event = new CustomEvent("peer-changed", {
            detail: theirPeerId,
          });
          document.dispatchEvent(event);
        });
      });
      //const ul =`<ul>"peersList"</ul>`;

      //Add peers to html document
      //connect-button peerId-${peer}
      // <ul>
      //  <li>
      //      <button> "Peer id 1"</button>
      //      <button> "Peer id 1"</button>
      //  </li>
      //</ul>
    });
  });
  document.addEventListener("peer-changed", (e) => {
    console.log(e);
    const peerId = e.detail;

    const connectButtonEl = document.querySelector(
      `.connect-button.peerId-${peerId}`
    );

    document.querySelectorAll(".connect-button.connected").forEach((button) => {
      button.classList.remove("connected");
    });

    //add class 'connected' to click button.
    connectButtonEl.classList.add("connected");
  });
})();
