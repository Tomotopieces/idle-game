import { ItemStackSerial } from "db://assets/Script/Item/ItemStackSerial";
import { LedgerRecord } from "db://assets/Script/Shop/LedgerRecord";

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
     * 仓库数组
     */
    storehouse: ItemStackSerial[];

    /**
     * 装备槽
     */
    equipmentUUIDs: string[];

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

    constructor(level: number, experience: number, storehouse: ItemStackSerial[], equipmentUUIDs: string[], chapterName: string, areaName: string, stageName: string, talents: string, enemyRecord: string, ledger: LedgerRecord[]) {
        this.level = level;
        this.experience = experience;
        this.storehouse = storehouse;
        this.equipmentUUIDs = equipmentUUIDs;
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
