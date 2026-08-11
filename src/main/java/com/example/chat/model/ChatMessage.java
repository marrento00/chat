package com.example.chat.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatMessage {
    private String sender;
    private String content;
    private MessageType messageType;

    public enum MessageType{
        CHAT, JOIN, LEAVE
    }
}
