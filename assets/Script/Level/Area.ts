import { Stage } from "db://assets/Script/Level/Stage";

/**
 * 关卡区域
 */
export class Area {
    /**
     * ID
     */
    readonly id: number;

    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 舞台列表
     */
    readonly stages: Array<Stage>;

    constructor(id: number, displayName: string, name: string, stages: Array<Stage>) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.stages = stages;
    }
}