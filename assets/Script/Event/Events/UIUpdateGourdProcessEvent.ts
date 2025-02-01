import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 更新葫芦进度UI事件
 */
export class UIUpdateGourdProcessEvent extends EventArgument {
    /**
     * 余量
     */
    readonly remain: number;

    /**
     * 进度
     */
    readonly process: number;

    constructor(remain: number, process: number) {
        super();
        this.remain = remain;
        this.process = process;
    }
}