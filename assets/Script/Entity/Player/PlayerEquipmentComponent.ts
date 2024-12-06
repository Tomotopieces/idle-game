import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment";
import { PlayerCombatComponent } from "db://assets/Script/Entity/Player/PlayerCombatComponent";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 玩家装备组件
 */
export class PlayerEquipmentComponent {
    /**
     * 武器栏
     */
    private _weapon: ItemStack;

    /**
     * 头冠栏
     */
    private _headgear: ItemStack;

    /**
     * 衣甲栏
     */
    private _chest: ItemStack;

    /**
     * 臂甲栏
     */
    private _arm: ItemStack;

    /**
     * 腿甲栏
     */
    private _leg: ItemStack;

    /**
     * 珍玩栏
     */
    private _curios: ItemStack;

    /**
     * 玩家
     */
    private _playerCombatComponent: PlayerCombatComponent;

    constructor(combatComponent: PlayerCombatComponent) {
        this._weapon = null;
        this._headgear = null;
        this._chest = null;
        this._arm = null;
        this._leg = null;
        this._curios = null;
        this._playerCombatComponent = combatComponent;
    }

    /**
     * 装备
     *
     * @param equipment 装备
     * @return 被卸下的装备
     */
    equip(equipment: Equipment): ItemStack {
        let unequipped: ItemStack = null;
        const itemStack = new ItemStack(equipment, 1);
        switch (equipment.equipmentType) {
            case EquipmentType.WEAPON:
                this._playerCombatComponent.dropAttributeFromEquipment(this._weapon.item as Equipment);
                unequipped = this._weapon;
                this._weapon = itemStack;
                break;
            case EquipmentType.HEADGEAR:
                this._playerCombatComponent.dropAttributeFromEquipment(this._headgear.item as Equipment);
                unequipped = this._headgear;
                this._headgear = itemStack;
                break;
            case EquipmentType.CHEST:
                this._playerCombatComponent.dropAttributeFromEquipment(this._chest.item as Equipment);
                unequipped = this._chest;
                this._chest = itemStack;
                break;
            case EquipmentType.ARM:
                this._playerCombatComponent.dropAttributeFromEquipment(this._arm.item as Equipment);
                unequipped = this._arm;
                this._arm = itemStack;
                break;
            case EquipmentType.LEG:
                this._playerCombatComponent.dropAttributeFromEquipment(this._leg.item as Equipment);
                unequipped = this._leg;
                this._leg = itemStack;
                break;
            case EquipmentType.CURIOS:
                this._playerCombatComponent.dropAttributeFromEquipment(this._curios.item as Equipment);
                unequipped = this._curios;
                this._curios = itemStack;
                break;
            default:
                break;
        }
        this._playerCombatComponent.getAttributeFromEquipment(equipment);
        return unequipped;
    }
}
