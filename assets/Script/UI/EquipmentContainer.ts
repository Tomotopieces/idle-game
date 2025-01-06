import { _decorator, Component } from 'cc';
import { ItemSlot } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EquipmentChangeEvent } from "db://assets/Script/Event/Events/EquipmentChangeEvent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";

const { ccclass } = _decorator;

/**
 * 装备栏
 */
@ccclass('EquipmentContainer')
export class EquipmentContainer extends Component {
    /**
     * 武器槽
     */
    private _weaponSlot: ItemSlot;

    /**
     * 头冠槽
     */
    private _headSlot: ItemSlot;

    /**
     * 衣甲槽
     */
    private _chestSlot: ItemSlot;

    /**
     * 臂甲槽
     */
    private _armSlot: ItemSlot;

    /**
     * 腿甲槽
     */
    private _legSlot: ItemSlot;

    /**
     * 珍玩槽
     */
    private _curiosSlot: ItemSlot;

    /**
     * 类型 -> 装备槽 Map
     */
    private _typeMap: Map<EquipmentType, ItemSlot>;

    onLoad() {
        this._weaponSlot = this.node.getChildByName("WeaponSlot").getComponent(ItemSlot);
        this._headSlot = this.node.getChildByName("HeadSlot").getComponent(ItemSlot);
        this._chestSlot = this.node.getChildByName("ChestSlot").getComponent(ItemSlot);
        this._armSlot = this.node.getChildByName("ArmSlot").getComponent(ItemSlot);
        this._legSlot = this.node.getChildByName("LegSlot").getComponent(ItemSlot);
        this._curiosSlot = this.node.getChildByName("CuriosSlot").getComponent(ItemSlot);

        this._typeMap = new Map<EquipmentType, ItemSlot>([
            [EquipmentType.WEAPON, this._weaponSlot],
            [EquipmentType.HEAD, this._headSlot],
            [EquipmentType.CHEST, this._chestSlot],
            [EquipmentType.ARM, this._armSlot],
            [EquipmentType.LEG, this._legSlot],
            [EquipmentType.CURIOS, this._curiosSlot]
        ]);

        EventCenter.on(EventName.UI_UPDATE_EQUIPMENT, this.node.name, (event: EquipmentChangeEvent) => this.updateEquipmentUI(event));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 更新装备UI
     *
     * @param event 事件参数
     */
    private updateEquipmentUI(event: EquipmentChangeEvent) {
        if (event.equip) {
            this._typeMap.get(event.equipment.equipmentType).stack = new ItemStack(event.equipment, 1);
        } else {
            this._typeMap.get(event.equipment.equipmentType).stack = null;
        }
    }
}


