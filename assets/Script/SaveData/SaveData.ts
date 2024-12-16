import { Storehouse } from "db://assets/Script/Util/StorehouseUtil";
import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { SaveDataJson } from "db://assets/Script/SaveData/SaveDataJson";

import { ITEM_TABLE } from "db://assets/Script/DataTable";
import { DefaultLevelName } from "db://assets/Script/Util/Constant";
import { MapUtil } from "db://assets/Script/Util/MapUtil";

/**
 * 存档数据
 */
export class SaveData {
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

    /**
     * 天赋
     */
    talents: Map<string, number>;

    constructor(level: number, experience: number, equipmentSlot: Map<EquipmentType, ItemStack>, storehouse: Storehouse, areaName: string, stageName: string, talents: Map<string, number>) {
        this.level = level ?? 0;
        this.experience = experience ?? 0;
        this.equipmentSlot = equipmentSlot ?? new Map<EquipmentType, ItemStack>();
        this.storehouse = storehouse ?? new Map<string, ItemStack>();
        this.areaName = areaName ?? DefaultLevelName.AREA;
        this.stageName = stageName ?? DefaultLevelName.STAGE;
        this.talents = talents ?? new Map<string, number>();
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
                const equipment = ITEM_TABLE.get(stackJson.itemName) as Equipment;
                return [equipment.equipmentType, new ItemStack(equipment, 1)];
            }));
        const storehouse = new Map<string, ItemStack>(dataJson.storehouse
            .map(itemStackJson => [itemStackJson.itemName, ItemStackJson.toItemStack(itemStackJson)]));
        const talents = dataJson.talents ? MapUtil.parse(dataJson.talents) as Map<string, number> : null;
        return new SaveData(dataJson.level, dataJson.experience, equipmentSlot, storehouse, dataJson.areaName, dataJson.stageName, talents);
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        const equipmentSlotJson = Array.from(this.equipmentSlot.values())
            .filter(stack => stack.item)
            .map(item => new ItemStackJson(item.item.name, item.count));
        const storehouseJson = Array.from(this.storehouse.values())
            .map(item => new ItemStackJson(item.item.name, item.count));
        const talentsJson = MapUtil.stringify(this.talents);
        return new SaveDataJson(this.level, this.experience, equipmentSlotJson, storehouseJson, this.areaName, this.stageName, talentsJson).toJson();
    }
}

