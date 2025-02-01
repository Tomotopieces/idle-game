import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 更新棍势进度UI事件
 */
export class UIUpdateStanceProcessEvent extends EventArgument {
    /**
     * 等级
     */
    level: number;

    /**
     * 进度
     */
    process: number;

    constructor(level: number, process: number) {
        super();
        this.level = level;
        this.process = process;
    }
}