import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";

/**
 * 存档数据JSON
 */
export class SaveDataJson {
    /**
     * 金币
     */
    coin: number;

    /**
     * 装备槽
     */
    equipmentSlot: Array<ItemStackJson>;

    /**
     * 仓库数组
     */
    storehouse: Array<ItemStackJson>;

    /**
     * 区域名称
     */
    areaName: string;

    /**
     * 舞台名称
     */
    stageName: string;

    constructor(coin: number, equipmentSlot: Array<ItemStackJson>, storehouse: Array<ItemStackJson>, areaName: string, stageName: string) {
        this.coin = coin;
        this.equipmentSlot = equipmentSlot;
        this.storehouse = storehouse;
        this.areaName = areaName;
        this.stageName = stageName;
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        return JSON.stringify(this);
    }
}
