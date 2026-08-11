// Variável com o nome do usuário logado (defina quando o usuário entrar)
let currentUser = "SeuNome";

function showMessage(messageData) {
    const messageArea = document.getElementById("messageArea");

    // 1. Criar o container principal da mensagem
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // 2. Verificar o tipo de mensagem
    if (messageData.type === 'JOIN' || messageData.type === 'LEAVE') {
        // --- MENSAGEM DE SISTEMA ---
        messageElement.classList.add("system");

        const textSpan = document.createElement("span");
        textSpan.textContent = messageData.type === 'JOIN'
            ? `${messageData.sender} entrou na sala.`
            : `${messageData.sender} saiu da sala.`;

        messageElement.appendChild(textSpan);

    } else {
        // --- MENSAGEM REGULAR (CHAT) ---
        const isMe = messageData.sender === currentUser;

        if (isMe) {
            messageElement.classList.add("sent");
        } else {
            messageElement.classList.add("received");

            // Adiciona o nome do remetente apenas para mensagens de terceiros
            const senderSpan = document.createElement("span");
            senderSpan.classList.add("sender-name");
            senderSpan.textContent = messageData.sender;
            messageElement.appendChild(senderSpan);
        }

        // Criar a bolha de texto
        const bubble = document.createElement("div");
        bubble.classList.add("message-bubble");

        // Conteúdo da mensagem
        const messageContent = document.createTextNode(messageData.content);
        bubble.appendChild(messageContent);

        // Horário formatado (HH:mm)
        const timeSpan = document.createElement("span");
        timeSpan.classList.add("message-time");
        timeSpan.textContent = getCurrentTime();
        bubble.appendChild(timeSpan);

        messageElement.appendChild(bubble);
    }

    // 3. Adicionar a mensagem na tela e rolar automaticamente para o final
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Função auxiliar para formatar a hora atual
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}