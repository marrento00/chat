let stompClient = null;
const username = "Usuario" + Math.floor(1000 + Math.random()*9000);
function connect() {
    const socket = new SockJS('/ws-chat');
    stompClient = Stomp.over(socket);
    stompClient.debug=null;

    stompClient.connect({}, function (frame){
        console.log('Connected to Stomp');
        stompClient.subscribe('/topic/messages', function (chatMessage) {
            showMessage(JSON.parse(chatMessage.body));
        });
    }, function (error) {
        console.log("Erro de conexão", error);
    });
}
function sendMessage() {
    const messageInput = document.getElementById('message');
    // Evita o erro se o campo nao for encontrado no HTML
    if (!messageInput) {
        console.error("Campo 'message' não foi encontrado no HTML!");
        return;
    }
    const content = messageInput.value.trim();
    if (content && stompClient) {
        const chatMessage = {
            sender: username,
            content: content
        };
        stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}
function showMessage(message) {
    const messagesList = document.getElementById('messages-list');
    if (!messagesList) return;

    const sender = message && message.sender ? message.sender : 'Anônimo';
    const content = message && message.content ? message.content : '';

    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(sender)}:</strong> ${escapeHtml(content)}`;
    messagesList.appendChild(li);

    messagesList.scrollTop = messagesList.scrollHeight;
}
function handleKeyPress(event){
    if(event.key === 'Enter'){
        sendMessage();
    }
}
function escapeHtml(text){
    if(text === null || text === undefined){return ''}
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
connect();