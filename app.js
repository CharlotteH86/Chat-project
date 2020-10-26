//Get hash from url
const myPeerId = location.hash.slice(1);
const peersDiv = document.querySelector(".peers");

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

//Event listenet för click 'refresh list'
const listPeersButtonEl = document.querySelector(".list-all-peers-button");

listPeersButtonEl.addEventListener("click", () => {
  peer.listAllPeers((peers) => {
    //console.log(peers);
    const peersList = peers
      .map((peer) => {
        return `<li><button>${peer}</button></li>`;
      })
      .join("");

      //connect-button peerId-${peer}

    peersDiv.innerHTML = peersList;

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
