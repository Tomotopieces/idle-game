import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { PlayerAttributeComponent } from "db://assets/Script/Entity/Player/PlayerAttributeComponent";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Item } from "db://assets/Script/Item/Item";

import { UNIQUE_EFFECT_MAP } from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffectMap";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Util/Constant";
import { EquipmentChangeEvent } from "db://assets/Script/Event/EquipmentChangeEvent";
import { SET_EFFECT_MAP } from "db://assets/Script/Item/Equipment/SetEffect/SetEffectMap";

/**
 * 玩家装备组件
 */
export class PlayerEquipmentComponent {
    /**
     * 武器栏
     */
    private readonly _weapon: ItemStack;

    /**
     * 头冠栏
     */
    private readonly _head: ItemStack;

    /**
     * 衣甲栏
     */
    private readonly _chest: ItemStack;

    /**
     * 臂甲栏
     */
    private readonly _arm: ItemStack;

    /**
     * 腿甲栏
     */
    private readonly _leg: ItemStack;

    /**
     * 珍玩栏
     */
    private readonly _curios: ItemStack;

    /**
     * 玩家战斗数值组件
     */
    private readonly _playerAttributeComponent: PlayerAttributeComponent;

    /**
     * 套装数量 Map
     *
     * 套装名 -> 装备数量
     */
    private readonly _setCountMap: Map<string, number>;

    /**
     * 装备 Map
     *
     * 类型 -> 装备
     */
    readonly equipmentMap: Map<EquipmentType, ItemStack>;

    constructor(attribute: PlayerAttributeComponent) {
        this._weapon = new ItemStack(null, 1);
        this._head = new ItemStack(null, 1);
        this._chest = new ItemStack(null, 1);
        this._arm = new ItemStack(null, 1);
        this._leg = new ItemStack(null, 1);
        this._curios = new ItemStack(null, 1);
        this._playerAttributeComponent = attribute;
        this._setCountMap = new Map<string, number>();

        this.equipmentMap = new Map<EquipmentType, ItemStack>([
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
     * @param equipment 装备
     * @return 被卸下的装备
     */
    equip(equipment: Equipment): Equipment {
        const targetStack = this.equipmentMap.get(equipment.equipmentType);
        // 保存当前套装数量
        // 卸下旧装备
        const unequipped: Equipment = targetStack.item as Equipment;
        this._playerAttributeComponent.dropAttributeFromEquipment(unequipped);
        // 取消旧装备的独门妙用
        unequipped?.attributes.effects.forEach(effectName => UNIQUE_EFFECT_MAP.get(effectName).onDeactivate());
        // 减去旧装备的套装数
        if (unequipped?.attributes.setName) {
            const setCount = this._setCountMap.get(unequipped.attributes.setName);
            if (setCount === 1) {
                this._setCountMap.delete(unequipped.attributes.setName);
            } else {
                this._setCountMap.set(unequipped.attributes.setName, setCount - 1);
            }
        }

        // 装备新装备
        targetStack.item = equipment;
        this._playerAttributeComponent.getAttributeFromEquipment(equipment);
        // 启用新装备的独门妙用
        equipment.attributes.effects.forEach(effectName => UNIQUE_EFFECT_MAP.get(effectName).onActivate());
        // 增加新装备的套装数
        if (equipment.attributes.setName) {
            this._setCountMap.set(equipment.attributes.setName, (this._setCountMap.get(equipment.attributes.setName) ?? 0) + 1);
        }

        // 计算新的套装效果
        this.calculateSetEffect(equipment, unequipped);

        EventCenter.emit(EventName.UI_UPDATE_EQUIPMENT, new EquipmentChangeEvent(equipment, true));
        return unequipped;
    }

    /**
     * 卸下装备
     *
     * @param equipmentType 装备类型
     * @return 卸下的装备
     */
    unequip(equipmentType: EquipmentType): Equipment {
        const targetStack = this.equipmentMap.get(equipmentType);
        const unequipped: Equipment = targetStack.item as Equipment;
        this._playerAttributeComponent.dropAttributeFromEquipment(unequipped);
        unequipped.attributes.effects.forEach(effectName => UNIQUE_EFFECT_MAP.get(effectName).onDeactivate());
        targetStack.item = null;
        if (unequipped.attributes.setName) {
            const setCount = this._setCountMap.get(unequipped.attributes.setName);
            if (setCount === 1) {
                this._setCountMap.delete(unequipped.attributes.setName);
            } else {
                this._setCountMap.set(unequipped.attributes.setName, setCount - 1);
            }
        }

        this.calculateSetEffect(null, unequipped);

        EventCenter.emit(EventName.UI_UPDATE_EQUIPMENT, new EquipmentChangeEvent(unequipped, false));
        return unequipped;
    }

    /**
     * 获取当前装备信息
     *
     * @param equipmentType 装备类型
     */
    getEquipment(equipmentType: EquipmentType): Item {
        return this.equipmentMap.get(equipmentType).item;
    }

    /**
     * 计算套装效果
     *
     * @param equipment  新装备
     * @param unequipped 卸下的旧装备
     */
    private calculateSetEffect(equipment: Equipment, unequipped: Equipment) {
        if (equipment?.attributes.setName === unequipped?.attributes.setName) {
            // 新旧套装相同，无需计算
            return;
        }

        // 计算需要激活的套装效果
        if (equipment) {
            const count = this._setCountMap.get(equipment.attributes.setName);
            const map = SET_EFFECT_MAP.get(equipment.attributes.setName);
            if (map && map.has(count)) {
                map.get(count).onActivate();
            }
        }

        // 计算需要取消激活的套装效果
        if (unequipped) {
            const count = (this._setCountMap.get(unequipped.attributes.setName) ?? 0) + 1;
            const map = SET_EFFECT_MAP.get(unequipped.attributes.setName);
            if (map && map.has(count)) {
                map.get(count).onDeactivate();
            }
        }
    }
}
