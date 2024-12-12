import { GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 全局状态
 *
 * FIXME 使用 globalThis 还是类似 SET_EFFECT_MAP 直接声明的模式？区别？优劣？
 */
export class GlobalState {
    /**
     * 获取状态
     *
     * @param state 状态
     */
    static getState(state: GlobalStateName): any {
        return globalThis[state];
    }

    /**
     * 设置状态
     *
     * @param state 状态
     * @param value 状态值
     */
    static setState(state: GlobalStateName, value: any) {
        globalThis[state] = value;
    }
}
