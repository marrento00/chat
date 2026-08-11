// Variáveis globais de controle
let stompClient = null;
let currentUser = null;

// Elementos da tela
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

// 1. Iniciar conexão ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
    const name = prompt("Digite seu nome para entrar no chat:");
    if (name && name.trim() !== "") {
        connect(name.trim());
    } else {
        connect("Anônimo_" + Math.floor(Math.random() * 1000));
    }
});

// 2. Conectar ao WebSocket
function connect(username) {
    currentUser = username;

    const socket = new SockJS('/ws-chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
}

// 3. Callback de Conexão Bem-Sucedida
function onConnected() {
    // Inscreve no canal público de mensagens
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Envia aviso que o usuário entrou
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: currentUser, type: 'JOIN', content: '' })
    );
}

// 4. Tratar erro de conexão
function onError(error) {
    console.error('Erro de conexão WebSocket:', error);
}

// 5. Enviar Mensagem do Formulário
function sendMessage(event) {
    if (event) event.preventDefault();

    const messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        const chatMessage = {
            sender: currentUser,
            content: messageContent,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

// 6. Callback de Recebimento de Mensagem do Servidor
function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    showMessage(message);
}

// 7. Renderizar a bolha de mensagem no HTML
function showMessage(messageData) {
    const messageArea = document.getElementById("messageArea");
    if (!messageArea) return;

    if(!messageData.sender || messageData.sender.trim() === "") {return;}

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    if (messageData.type === 'JOIN' || messageData.type === 'LEAVE') {
        messageElement.classList.add("system");
        const textSpan = document.createElement("span");
        textSpan.textContent = messageData.type === 'JOIN'
            ? `${messageData.sender} entrou na sala.`
            : `${messageData.sender} saiu da sala.`;

        messageElement.appendChild(textSpan);
        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
        return;
    }
        const isMe = messageData.sender === currentUser;

        if (isMe) {
            messageElement.classList.add("sent");
        } else {
            messageElement.classList.add("received");
            const senderSpan = document.createElement("span");
            senderSpan.classList.add("sender-name");
            senderSpan.textContent = messageData.sender;
            messageElement.appendChild(senderSpan);
        }

        const bubble = document.createElement("div");
        bubble.classList.add("message-bubble");
        bubble.appendChild(document.createTextNode(messageData.content));

        const timeSpan = document.createElement("span");
        timeSpan.classList.add("message-time");
        const now = new Date();
        timeSpan.textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        bubble.appendChild(timeSpan);

        messageElement.appendChild(bubble);
        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;

}

// Event Listener do Formulário
if (messageForm) {
    messageForm.addEventListener('submit', sendMessage, true);
}