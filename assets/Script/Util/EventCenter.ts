import { EventTarget } from 'cc';
import { EventName } from "db://assets/Script/Util/Constant";

/**
 * 事件中心
 */
export class EventCenter {
    private static EVENT_TARGET: EventTarget;

    /**
     * 初始化
     */
    static init() {
        this.EVENT_TARGET = new EventTarget();
    }

    /**
     * 发送事件
     *
     * @param eventName 事件名
     * @param args 参数
     */
    static emit(eventName: EventName, ...args: any[]) {
        this.EVENT_TARGET.emit(eventName, ...args);
    }

    /**
     * 监听事件
     *
     * @param eventName 事件名
     * @param callback 回调
     */
    static on(eventName: EventName, callback: (...args: any[]) => void) {
        this.EVENT_TARGET.on(eventName, callback);
    }
}