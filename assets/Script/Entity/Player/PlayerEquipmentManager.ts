import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { PlayerAttributeManager } from "db://assets/Script/Entity/Player/PlayerAttributeManager";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { UpdateEquipmentEvent } from "db://assets/Script/Event/Events/UpdateEquipmentEvent";
import { EventName } from "db://assets/Script/Event/EventName";
import { EquipmentType } from "db://assets/Script/Equipment/EquipmentType";

/**
 * 玩家装备组件
 */
export class PlayerEquipmentManager {
    /**
     * 武器栏
     */
    private _weapon: Equipment;

    /**
     * 头冠栏
     */
    private _head: Equipment;

    /**
     * 衣甲栏
     */
    private _chest: Equipment;

    /**
     * 臂甲栏
     */
    private _arm: Equipment;

    /**
     * 腿甲栏
     */
    private _leg: Equipment;

    /**
     * 珍玩栏
     */
    private _curios: Equipment;

    /**
     * 玩家属性
     */
    private _attributes: PlayerAttributeManager;

    constructor(attributes: PlayerAttributeManager) {
        this._attributes = attributes;
    }

    /**
     * 装备
     *
     * @param equipment 装备
     */
    equip(equipment: Equipment) {
        if (equipment === this.get(equipment.equipmentType)) {
            return;
        }

        // 卸下旧装备
        const unequipped = this.get(equipment.equipmentType);
        this._attributes.dropAttributeFromEquipment(unequipped); // 属性
        unequipped?.uniqueEffect?.deactivate(); // 独门妙用
        unequipped?.setBonus?.levelDown(); // 套装效果

        // 装备新装备
        this.set(equipment)
        this._attributes.getAttributeFromEquipment(equipment); // 属性
        equipment.uniqueEffect?.activate() // 独门妙用
        equipment.setBonus?.levelUp();

        EventCenter.emit(EventName.UI_UPDATE_EQUIPMENT, new UpdateEquipmentEvent(equipment, true));
    }

    /**
     * 卸下装备
     *
     * @param unequipped 装备类型
     */
    unequip(unequipped: Equipment) {
        this._attributes.dropAttributeFromEquipment(unequipped); // 属性
        unequipped?.uniqueEffect?.deactivate(); // 独门妙用
        unequipped?.setBonus?.levelDown();
        this.set(null, unequipped.equipmentType);

        EventCenter.emit(EventName.UI_UPDATE_EQUIPMENT, new UpdateEquipmentEvent(unequipped, false));
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
     * 获取指定类型栏位的装备
     *
     * @param equipmentType 装备类型
     */
    get(equipmentType: EquipmentType): Equipment {
        switch (equipmentType) {
            case EquipmentType.WEAPON:
                return this._weapon;
            case EquipmentType.HEAD:
                return this._head;
            case EquipmentType.CHEST:
                return this._chest;
            case EquipmentType.ARM:
                return this._arm;
            case EquipmentType.LEG:
                return this._leg;
            case EquipmentType.CURIOS:
                return this._curios;
            default:
                return null;
        }
    }

    /**
     * 设置装备
     *
     * @param equipment     装备
     * @param equipmentType 装备类型
     */
    set(equipment: Equipment, equipmentType: EquipmentType = equipment.equipmentType) {
        if (!!equipment && equipmentType !== equipment.equipmentType) {
            equipmentType = equipment.equipmentType;
        }
        switch (equipmentType) {
            case EquipmentType.WEAPON:
                this._weapon = equipment;
                break;
            case EquipmentType.HEAD:
                this._head = equipment;
                break;
            case EquipmentType.CHEST:
                this._chest = equipment;
                break;
            case EquipmentType.ARM:
                this._arm = equipment;
                break;
            case EquipmentType.LEG:
                this._leg = equipment;
                break;
            case EquipmentType.CURIOS:
                this._curios = equipment;
                break;
        }
    }

    getAll(): Equipment[] {
        return [this._weapon, this._head, this._chest, this._arm, this._leg, this._curios];
    }
}
