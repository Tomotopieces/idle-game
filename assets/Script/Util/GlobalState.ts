/**
 * 全局状态名称枚举
 *
 * 避免使用魔法值
 */
export enum GlobalStateName {
    EVENT_TARGET = 'EventTarget',
    PLAYER = 'Player',
    ENEMY = 'Enemy',
}

/**
 * 全局状态
 */
export class GlobalState {
    /**
     * 获取状态
     *
     * @param state 状态
     */
    public static getState(state: GlobalStateName): any {
        return globalThis[state];
    }

    /**
     * 设置状态
     *
     * @param state 状态
     * @param value 状态值
     */
    public static setState(state: GlobalStateName, value: any) {
        globalThis[state] = value;
    }
}
