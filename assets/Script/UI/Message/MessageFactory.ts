import { UIPostMessageEvent } from "db://assets/Script/Event/Events/UIPostMessageEvent";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { ITEM_RARITY_COLOR_MAP } from "db://assets/Script/Item/Item";
import { Color } from "cc";

/**
 * 消息类型
 */
export enum MessageType {
    /**
     * 默认
     */
    DEFAULT,

    /**
     * 警告
     */
    WARNING,

    /**
     * 获得物品
     */
    GAIN_ITEM,

    /**
     * 升级
     */
    LEVEL_UP,
}

/**
 * 消息工厂
 */
export class MessageFactory {
    /**
     * 红色
     */
    private static readonly red = Color.RED.toHEX();

    /**
     * 消息工厂
     *
     * @param postEvent 消息推送事件
     * @return 消息富文本内容
     */
    static produce(postEvent: UIPostMessageEvent): string {
        switch (postEvent.type) {
            default:
            case MessageType.DEFAULT:
                return postEvent.messageObject as string;
            case MessageType.WARNING:
                return `<color=${this.red}>${postEvent.messageObject as string}</color>`;
            case MessageType.GAIN_ITEM:
                const stack = postEvent.messageObject as ItemStack;
                const colorCode = ITEM_RARITY_COLOR_MAP.get(stack.item.rarity).toHEX(`#rrggbb`);
                return `获得 <color=${colorCode}>【${stack.item.displayName}】</color> * ${stack.count}`;
            case MessageType.LEVEL_UP:
                const level = postEvent.messageObject as number;
                return `等级提升：${level - 1} → ${level}`;
        }
    }
}