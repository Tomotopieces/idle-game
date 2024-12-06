import { StoreHouse } from "db://assets/Script/Util/StoreHouseUtil";
import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 存档数据
 */
export class SaveData {
    /**
     * 金币
     */
    coin: number;

    /**
     * 仓库
     */
    storeHouse: StoreHouse;

    /**
     * 区域名称
     */
    areaName: string;

    /**
     * 舞台名称
     */
    stageName: string;

    constructor(coin: number, storeHouse: StoreHouse, areaName: string, stageName: string) {
        this.coin = coin;
        this.storeHouse = storeHouse;
        this.areaName = areaName;
        this.stageName = stageName;
    }

    /**
     * 从JSON创建存档数据
     *
     * @param json 存档数据JSON
     * @return 存档数据
     */
    static fromJson(json: string): SaveData {
        const obj = JSON.parse(json) as SaveDataJson;
        const storeHouse = new Map<string, ItemStack>(obj.storeHouse
            .map(itemStackJson => [itemStackJson.itemName, ItemStackJson.toItemStack(itemStackJson)]));
        return new SaveData(obj.coin, storeHouse, obj.areaName, obj.stageName);
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        const storeHouseJson = Array.from(this.storeHouse.values())
            .map(item => new ItemStackJson(item.item.name, item.count));
        return JSON.stringify({
            coin: this.coin,
            storeHouse: storeHouseJson,
            areaName: this.areaName,
            stageName: this.stageName
        } as SaveDataJson);
    }
}

/**
 * 存档数据JSON
 */
class SaveDataJson {
    /**
     * 金币
     */
    coin: number;

    /**
     * 仓库数组
     */
    storeHouse: Array<ItemStackJson>;

    /**
     * 区域名称
     */
    areaName: string;

    /**
     * 舞台名称
     */
    stageName: string;
}
