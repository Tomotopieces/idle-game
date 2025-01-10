import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";
import { LedgerRecord } from "db://assets/Script/Trading/LedgerRecord";

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
    equipmentSlot: ItemStackJson[];

    /**
     * 仓库数组
     */
    storehouse: ItemStackJson[];

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

    /**
     * 敌人击杀记录 Map JSON
     */
    enemyRecord: string;

    /**
     * 账本
     */
    ledger: LedgerRecord[];

    constructor(level: number, experience: number, equipmentSlot: ItemStackJson[], storehouse: ItemStackJson[], chapterName: string, areaName: string, stageName: string, talents: string, enemyRecord: string, ledger: LedgerRecord[]) {
        this.level = level;
        this.experience = experience;
        this.equipmentSlot = equipmentSlot;
        this.storehouse = storehouse;
        this.chapterName = chapterName;
        this.areaName = areaName;
        this.stageName = stageName;
        this.talents = talents;
        this.enemyRecord = enemyRecord;
        this.ledger = ledger;
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        return JSON.stringify(this);
    }
}
