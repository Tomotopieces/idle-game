import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { PlayerAttributeComponent } from "db://assets/Script/Entity/Player/PlayerAttributeComponent";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Item } from "db://assets/Script/Item/Item";

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
     * 类型 -> 装备 Map
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
        // 卸下旧装备
        const unequipped: Equipment = targetStack.item as Equipment;
        this._playerAttributeComponent.dropAttributeFromEquipment(unequipped);
        // 装备新装备
        targetStack.item = equipment;
        this._playerAttributeComponent.getAttributeFromEquipment(equipment);

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
        targetStack.item = null;

        return unequipped;
    }

    /**
     * 获取当前装备信息
     *
     * @param equipmentType 装备类型
     */
    get(equipmentType: EquipmentType): Item {
        return this.equipmentMap.get(equipmentType).item;
    }
}
