import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { PlayerAttributeManager } from "db://assets/Script/Entity/Player/PlayerAttributeManager";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EquipEvent } from "db://assets/Script/Event/Events/EquipEvent";
import { SET_BONUS_TABLE, UNIQUE_UTILITY_TABLE } from "db://assets/Script/DataTable";
import { EventName } from "db://assets/Script/Event/EventName";
import { EquipmentType } from "db://assets/Script/Equipment/EquipmentType";

/**
 * 装备栏
 */
export class EquipmentSlot {
    stack: ItemStack;
}

/**
 * 玩家装备组件
 */
export class PlayerEquipmentManager {
    /**
     * 武器栏
     */
    private _weapon = new EquipmentSlot();

    /**
     * 头冠栏
     */
    private _head = new EquipmentSlot();

    /**
     * 衣甲栏
     */
    private _chest = new EquipmentSlot();

    /**
     * 臂甲栏
     */
    private _arm = new EquipmentSlot();

    /**
     * 腿甲栏
     */
    private _leg = new EquipmentSlot();

    /**
     * 珍玩栏
     */
    private _curios = new EquipmentSlot();

    /**
     * 玩家属性
     */
    private _attributes: PlayerAttributeManager;

    /**
     * 套装数量 Map
     *
     * 套装名 -> 装备数量
     */
    private _setCountMap: Map<string, number>;

    /**
     * 装备 Map
     *
     * 类型 -> 装备
     */
    readonly equipmentSlotMap: Map<EquipmentType, EquipmentSlot>;

    constructor(attributes: PlayerAttributeManager) {
        this._attributes = attributes;
        this._setCountMap = new Map<string, number>();

        this.equipmentSlotMap = new Map<EquipmentType, EquipmentSlot>([
            [EquipmentType.WEAPON, this._weapon],
            [EquipmentType.HEAD, this._head],
            [EquipmentType.CHEST, this._chest],
            [EquipmentType.ARM, this._arm],
            [EquipmentType.LEG, this._leg],
            [EquipmentType.CURIOS, this._curios]
        ]);
    }

    /**
     * 装备
     *
     * @param equipmentStack 装备
     * @return 被卸下的装备
     */
    equip(equipmentStack: ItemStack): ItemStack {
        const equipment = equipmentStack.item as Equipment;
        const slot = this.equipmentSlotMap.get(equipment.equipmentType);

        // 卸下旧装备
        const unequippedStack = slot.stack;
        const unequipped: Equipment = slot.stack?.item as Equipment;
        this._attributes.dropAttributeFromEquipment(unequipped); // 属性
        unequipped?.attributes.uniqueUtility.forEach(effectName => UNIQUE_UTILITY_TABLE.get(effectName).onDeactivate()); // 独门妙用
        if (unequipped?.attributes.setName) { // 套装等级
            const setCount = this._setCountMap.get(unequipped.attributes.setName);
            if (setCount === 1) {
                this._setCountMap.delete(unequipped.attributes.setName);
            } else {
                this._setCountMap.set(unequipped.attributes.setName, setCount - 1);
            }
        }

        // 装备新装备
        slot.stack = equipmentStack;
        this._attributes.getAttributeFromEquipment(equipment); // 属性
        equipment.attributes.uniqueUtility.forEach(effectName => UNIQUE_UTILITY_TABLE.get(effectName).onActivate()); // 独门妙用
        if (equipment.attributes.setName) { // 套装等级
            this._setCountMap.set(equipment.attributes.setName, (this._setCountMap.get(equipment.attributes.setName) ?? 0) + 1);
        }

        this.calculateSetBonus(equipment, unequipped); // 套装效果

        EventCenter.emit(EventName.UI_UPDATE_EQUIPMENT, new EquipEvent(equipmentStack, true));
        return unequippedStack;
    }

    /**
     * 卸下装备
     *
     * @param equipmentType 装备类型
     * @return 卸下的装备
     */
    unequip(equipmentType: EquipmentType): ItemStack {
        const slot = this.equipmentSlotMap.get(equipmentType);
        const stack = slot.stack;
        slot.stack = null;

        const unequipped: Equipment = stack.item as Equipment;
        this._attributes.dropAttributeFromEquipment(unequipped); // 属性
        unequipped.attributes.uniqueUtility.forEach(effectName => UNIQUE_UTILITY_TABLE.get(effectName).onDeactivate()); // 独门妙用
        if (unequipped.attributes.setName) { // 套装等级
            const setCount = this._setCountMap.get(unequipped.attributes.setName);
            if (setCount === 1) {
                this._setCountMap.delete(unequipped.attributes.setName);
            } else {
                this._setCountMap.set(unequipped.attributes.setName, setCount - 1);
            }
        }
        this.calculateSetBonus(null, unequipped);// 套装效果

        EventCenter.emit(EventName.UI_UPDATE_EQUIPMENT, new EquipEvent(stack, false));
        return stack;
    }

    /**
     * 升级装备
     *
     * @param equipment 装备
     */
    upgrade(equipment: Equipment) {
        this._attributes.upgradeAttributeOfEquipment(equipment);
    }

    /**
     * 计算套装效果
     *
     * @param equipment  新装备
     * @param unequipped 卸下的旧装备
     */
    private calculateSetBonus(equipment: Equipment, unequipped: Equipment) {
        if (equipment?.attributes.setName) {
            SET_BONUS_TABLE.get(equipment.attributes.setName).equip(equipment.name);
        }

        if (unequipped?.attributes.setName) {
            SET_BONUS_TABLE.get(unequipped.attributes.setName).unequip(unequipped.name);
        }
    }
}
