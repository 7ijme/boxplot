import React from "react";
import ReactDOM from "react-dom/client";
import Container from "./Components/Container";
import "./Styles/index.css";

window.addEventListener("load",function() {
  // Set a timeout...
  setTimeout(function(){
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);
}); 

var preventDefault = function(e) {
    e.preventDefault();
    return false;
};
document.addEventListener('touchmove',preventDefault,false);
document.body.addEventListener('touchmove',preventDefault,true);
window.addEventListener('touchmove',preventDefault,true);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Container />
  </React.StrictMode>
);
