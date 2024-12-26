import { StorehouseType } from "db://assets/Script/Storehouse/Storehouse";
import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { SaveDataJson } from "db://assets/Script/SaveData/SaveDataJson";

import { ITEM_TABLE } from "db://assets/Script/DataTable";
import { MapUtil } from "db://assets/Script/Util/MapUtil";
import { DefaultLevelName } from "db://assets/Script/Level/Level";

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
    storehouse: StorehouseType;

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
     * 天赋
     */
    talents: Map<string, number>;

    /**
     * 敌人记录
     */
    enemyRecord: Map<string, number>;

    constructor(level: number, experience: number, equipmentSlot: Map<EquipmentType, ItemStack>, storehouse: StorehouseType, chapterName: string, areaName: string, stageName: string, talents: Map<string, number>, enemyRecord: Map<string, number>) {
        this.level = level ?? 0;
        this.experience = experience ?? 0;
        this.equipmentSlot = equipmentSlot ?? new Map<EquipmentType, ItemStack>();
        this.storehouse = storehouse ?? new Map<string, ItemStack>();
        this.chapterName = chapterName ?? DefaultLevelName.CHAPTER;
        this.areaName = areaName ?? DefaultLevelName.AREA;
        this.stageName = stageName ?? DefaultLevelName.STAGE;
        this.talents = talents ?? new Map<string, number>();
        this.enemyRecord = enemyRecord ?? new Map<string, number>();
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
                equipment.attributes.upgrade(stackJson.rank);
                return [equipment.equipmentType, new ItemStack(equipment, 1)];
            }));
        const storehouse = new Map<string, ItemStack>(dataJson.storehouse
            .map(itemStackJson => [itemStackJson.itemName, ItemStackJson.toItemStack(itemStackJson)]));
        const talents = dataJson.talents ? MapUtil.parse(dataJson.talents) as Map<string, number> : null;
        const enemyRecord = dataJson.enemyRecord ? MapUtil.parse(dataJson.enemyRecord) as Map<string, number> : null;
        return new SaveData(dataJson.level, dataJson.experience, equipmentSlot, storehouse, dataJson.chapterName, dataJson.areaName, dataJson.stageName, talents, enemyRecord);
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        const equipmentSlotJson = Array.from(this.equipmentSlot.values())
            .filter(stack => stack.item)
            .map(stack =>
                new ItemStackJson(stack.item.name, (stack.item as Equipment).attributes.rank, stack.count));
        const storehouseJson = Array.from(this.storehouse.values())
            .map(stack =>
                new ItemStackJson(stack.item.name, stack.item instanceof Equipment ? stack.item.attributes.rank : 0, stack.count));
        const talentsJson = MapUtil.stringify(this.talents);
        const enemyRecordJson = MapUtil.stringify(this.enemyRecord);
        return new SaveDataJson(this.level, this.experience, equipmentSlotJson, storehouseJson, this.chapterName, this.areaName, this.stageName, talentsJson, enemyRecordJson).toJson();
    }
}

