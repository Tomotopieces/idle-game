import { Storehouse } from "db://assets/Script/Util/StorehouseUtil";
import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";
import { Item } from "db://assets/Script/Item/Item";
import { SaveDataJson } from "db://assets/Script/SaveData/SaveDataJson";

/**
 * 存档数据
 */
export class SaveData {
    /**
     * 金币
     */
    coin: number;

    /**
     * 装备槽
     */
    equipmentSlot: Map<EquipmentType, ItemStack>;

    /**
     * 仓库
     */
    storehouse: Storehouse;

    /**
     * 区域名称
     */
    areaName: string;

    /**
     * 舞台名称
     */
    stageName: string;

    constructor(coin: number, equipmentSlot: Map<EquipmentType, ItemStack>, storehouse: Storehouse, areaName: string, stageName: string) {
        this.coin = coin;
        this.equipmentSlot = equipmentSlot;
        this.storehouse = storehouse;
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
        const dataJson = JSON.parse(json) as SaveDataJson;
        const equipmentSlot = new Map<EquipmentType, ItemStack>(dataJson.equipmentSlot
            .map(stackJson => {
                const itemTable = GlobalState.getState(GlobalStateName.ITEM_TABLE) as Map<string, Item>;
                const equipment = itemTable.get(stackJson.itemName) as Equipment;
                return [equipment.equipmentType, new ItemStack(equipment, 1)];
            }));
        const storehouse = new Map<string, ItemStack>(dataJson.storehouse
            .map(itemStackJson => [itemStackJson.itemName, ItemStackJson.toItemStack(itemStackJson)]));
        return new SaveData(dataJson.coin, equipmentSlot, storehouse, dataJson.areaName, dataJson.stageName);
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        const equipmentSlotJson = Array.from(this.equipmentSlot.values())
            .map(item => new ItemStackJson(item.item.name, item.count));
        const storehouseJson = Array.from(this.storehouse.values())
            .map(item => new ItemStackJson(item.item.name, item.count));
        return new SaveDataJson(this.coin, equipmentSlotJson, storehouseJson, this.areaName, this.stageName).toJson();
    }
}

