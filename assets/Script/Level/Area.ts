import { Stage } from "db://assets/Script/Level/Stage";

/**
 * 关卡区域
 */
export class Area {
    /**
     * ID
     */
    private readonly _id: number;

    /**
     * 名称
     */
    private readonly _name: string;

    /**
     * 舞台列表
     */
    private readonly _stages: Array<Stage>;

    constructor(id: number, name: string, stages: Array<Stage>) {
        this._id = id;
        this._name = name;
        this._stages = stages;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get stages(): Array<Stage> {
        return this._stages;
    }
}