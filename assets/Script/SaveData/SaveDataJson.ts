import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";

/**
 * 存档数据JSON
 */
export class SaveDataJson {
    /**
     * 等级
     */
    level: number;

    /**
     * 经验
     */
    experience: number;

    /**
     * 装备槽
     */
    equipmentSlot: Array<ItemStackJson>;

    /**
     * 仓库数组
     */
    storehouse: Array<ItemStackJson>;

    /**
     * 章节名称
     */
    chapterName: string;

    /**
     * 区域名称
     */
    areaName: string;

    /**
     * 舞台名称
     */
    stageName: string;

    /**
     * 天赋 Map JSON
     */
    talents: string;

    constructor(level: number, experience: number, equipmentSlot: Array<ItemStackJson>, storehouse: Array<ItemStackJson>, chapterName: string, areaName: string, stageName: string, talents: string) {
        this.level = level;
        this.experience = experience;
        this.equipmentSlot = equipmentSlot;
        this.storehouse = storehouse;
        this.chapterName = chapterName;
        this.areaName = areaName;
        this.stageName = stageName;
        this.talents = talents;
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        return JSON.stringify(this);
    }
}
