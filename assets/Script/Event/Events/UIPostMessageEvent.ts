import { MessageType } from "db://assets/Script/UI/Message/MessageFactory";

/**
 * UI推送消息事件
 */
export class UIPostMessageEvent {
    /**
     * 消息类型
     */
    type: MessageType;

    /**
     * 消息内容
     */
    messageObject: any;

    constructor(type: MessageType, messageObject: any) {
        this.type = type;
        this.messageObject = messageObject;
    }
}