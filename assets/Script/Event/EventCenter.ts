import { EventTarget } from 'cc';
import { EventArgument } from "db://assets/Script/Event/EventArgument";
import { EventName } from "db://assets/Script/Event/EventName";

/**
 * 事件监听处理函数类型
 */
export type Listener = (eventArgs: EventArgument) => void;

/**
 * 事件中心
 *
 * - `on`方法对事件进行基本的处理，顺序触发
 * - `register`方法对事件进行额外的提前监听。事件emit时，一个或者多个on响应，每个on处理前都会先处理该事件所有register方法注册的监听函数
 * - 示例：
 * 若已进行：
 * ```
 * on(eat, handleEat1)
 * on(eat, handleEat2)
 * register(eat, listenEat1)
 * register(eat, listenEat2)
 * ```
 * 则会有触发顺序：
 * ```
 * emit(eat) -> listenEat1 -> listenEat2 -> handleEat1 -> listenEat1 -> listenEat2 -> handleEat2
 * ```
 * 按顺序发生
 *
 * **注意：若事件参数对象的内容在过程中被变化，可能会将变化传递给下一个处理/监听函数**
 */
export class EventCenter {
    private static EVENT_TARGET: EventTarget;

    /**
     * 事件处理 Map
     *
     * 事件名 -> 监听ID -> 处理函数
     */
    private static readonly HANDLER_MAP: Map<EventName, Map<string, Listener>> = new Map<EventName, Map<string, Listener>>();

    /**
     * 事件监听 Map
     *
     * 事件名 -> 监听ID -> 监听函数
     */
    private static readonly LISTENER_MAP: Map<EventName, Map<string, Listener>> = new Map<EventName, Map<string, Listener>>();

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
     * @param eventArgs 事件参数
     */
    static emit(eventName: EventName, eventArgs: EventArgument) {
        this.EVENT_TARGET.emit(eventName, eventArgs);
    }

    /**
     * 处理事件
     *
     * @param eventName 事件名
     * @param id        监听ID
     * @param listener  监听器
     */
    static on(eventName: EventName, id: string, listener: Listener) {
        const handler = (eventArgs: EventArgument) => {
            let listeners: Array<Listener>;
            if (this.LISTENER_MAP.has(eventName)) {
                listeners = Array.from(this.LISTENER_MAP.get(eventName).values());
            } else {
                listeners = new Array<Listener>();
            }
            listeners.forEach(listener => listener(eventArgs));
            listener(eventArgs);
        };
        if (!this.HANDLER_MAP.has(eventName)) {
            this.HANDLER_MAP.set(eventName, new Map<string, Listener>());
        }

        this.EVENT_TARGET.on(eventName, handler);
        this.HANDLER_MAP.get(eventName).set(id, handler);
    }

    /**
     * 一次性处理事件
     *
     * @param eventName 事件名
     * @param id        ID
     * @param listener  监听器
     */
    static once(eventName: EventName, id: string, listener: Listener) {
        const handler = (eventArgs: EventArgument) => {
            let listeners: Array<Listener>;
            if (this.LISTENER_MAP.has(eventName)) {
                listeners = Array.from(this.LISTENER_MAP.get(eventName).values());
            } else {
                listeners = new Array<Listener>();
            }
            listeners.forEach(listener => listener(eventArgs));
            listener(eventArgs);
            this.HANDLER_MAP.get(eventName).delete(id);
        }
        if (!this.HANDLER_MAP.has(eventName)) {
            this.HANDLER_MAP.set(eventName, new Map<string, Listener>());
        }

        this.EVENT_TARGET.once(eventName, handler);
        this.HANDLER_MAP.get(eventName).set(id, handler);
    }

    /**
     * 取消处理
     *
     * @param eventName 事件名
     * @param id        监听ID
     */
    static off(eventName: EventName, id: string) {
        const listener = this.HANDLER_MAP.get(eventName)?.get(id);
        if (listener) {
            this.EVENT_TARGET.off(eventName, listener);
        }
    }

    /**
     * 注册事件监听函数
     *
     * @param eventName 事件名
     * @param id        监听ID
     * @param callback  监听函数
     */
    static register(eventName: EventName, id: string, callback: Listener) {
        if (!this.LISTENER_MAP.has(eventName)) {
            this.LISTENER_MAP.set(eventName, new Map<string, Listener>());
        }

        this.LISTENER_MAP.get(eventName).set(id, callback);
    }

    /**
     * 注销事件监听函数
     *
     * @param eventName 事件名
     * @param id        监听ID
     */
    static unregister(eventName: EventName, id: string) {
        if (this.LISTENER_MAP.has(eventName)) {
            this.LISTENER_MAP.get(eventName).delete(id);
        }
    }
}