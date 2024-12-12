import { GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 全局状态
 *
 * 存储部分运行时的动态数据
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
