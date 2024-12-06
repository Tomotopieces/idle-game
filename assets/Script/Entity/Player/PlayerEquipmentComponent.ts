import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment";
import { PlayerCombatComponent } from "db://assets/Script/Entity/Player/PlayerCombatComponent";

/**
 * 玩家装备组件
 */
export class PlayerEquipmentComponent {
    /**
     * 武器栏
     */
    private _weapon: Equipment; // TODO 修改ItemStack结构，此处改为ItemStack

    /**
     * 头冠栏
     */
    private _headgear: Equipment;

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
    equip(equipment: Equipment): Equipment {
        let unequipped = null;
        switch (equipment.equipmentType) {
            case EquipmentType.WEAPON:
                this._playerCombatComponent.dropAttributeFromEquipment(this._weapon);
                unequipped = this._weapon;
                this._weapon = equipment;
                break;
            case EquipmentType.HEADGEAR:
                this._playerCombatComponent.dropAttributeFromEquipment(this._headgear);
                unequipped = this._headgear;
                this._headgear = equipment;
                break;
            case EquipmentType.CHEST:
                this._playerCombatComponent.dropAttributeFromEquipment(this._chest);
                unequipped = this._chest;
                this._chest = equipment;
                break;
            case EquipmentType.ARM:
                this._playerCombatComponent.dropAttributeFromEquipment(this._arm);
                unequipped = this._arm;
                this._arm = equipment;
                break;
            case EquipmentType.LEG:
                this._playerCombatComponent.dropAttributeFromEquipment(this._leg);
                unequipped = this._leg;
                this._leg = equipment;
                break;
            case EquipmentType.CURIOS:
                this._playerCombatComponent.dropAttributeFromEquipment(this._curios);
                unequipped = this._curios;
                this._curios = equipment;
                break;
            default:
                break;
        }
        this._playerCombatComponent.getAttributeFromEquipment(equipment);
        return unequipped;
    }
}
