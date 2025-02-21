document.getElementById("chat-toggle").addEventListener("click", function() {
    let chatFrame = document.getElementById("chat-frame");
    chatFrame.style.display = (chatFrame.style.display === "block") ? "none" : "block";
});