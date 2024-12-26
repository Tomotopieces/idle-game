import { Area } from "db://assets/Script/Level/Area";

/**
 * 关卡章节
 */
export class Chapter {
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
     * 区域列表
     */
    readonly areas: Area[];

    constructor(id: number, name: string, displayName: string, areas: Area[]) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.areas = areas;
    }
}