import { _decorator, Component, instantiate, Prefab } from 'cc';
import { Message } from "db://assets/Script/UI/Message/Message";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Util/Constant";

const { ccclass, property } = _decorator;

/**
 * 消息队列
 */
export const MESSAGE_QUEUE = new Array<Message>();

/**
 * 最大消息数量
 */
export const MAX_MESSAGE_COUNT = 5;

/**
 * 消息中心
 */
@ccclass('MessageCenter')
export class MessageCenter extends Component {
    /**
     * 消息预制件
     */
    @property({ type: Prefab, tooltip: '消息预制件' })
    messagePrefab: Prefab;

    onLoad() {
        EventCenter.on(EventName.UI_POST_MESSAGE, this.node.name, (message: string) => this.post(message));
    }

    /**
     * 发送消息
     *
     * @param message 消息内容
     */
    post(message: string) {
        const messageNode = instantiate(this.messagePrefab);
        this.node.addChild(messageNode);
        const messageObject = messageNode.getComponent(Message);
        messageObject.message = message;

        MESSAGE_QUEUE.push(messageObject);
        if (MESSAGE_QUEUE.length > MAX_MESSAGE_COUNT) {
            // 移除超出数量限制的消息
            const removed = MESSAGE_QUEUE.splice(0, MESSAGE_QUEUE.length - MAX_MESSAGE_COUNT);
            removed.forEach(message => message.fadeOut());
        }
    }
}


