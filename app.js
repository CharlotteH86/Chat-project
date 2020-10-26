//Get hash from url
const myPeerId = location.hash.slice(1);

//

//connect to to peer server
peer = new Peer(myPeerId, {
  host: "glajan.com",
  port: 8443,
  path: "/myapp",
  secure: true,
});

//Print peer id on connection 'open' event.
peer.on("open", (id) => {
  console.log(id);
  const myPeerIdEl = document.querySelector(".my-peer-id");
  myPeerIdEl.innerText = id;
});

console.log(peer);

//5501