import { _decorator, Animation, Component } from 'cc';
import { ItemOptionMenu } from "db://assets/Script/UI/ItemOptionMenu";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Util/Constant";
import { ItemSlot, SlotType } from "db://assets/Script/UI/ItemSlot";
import { ItemType } from "db://assets/Script/Item/Item";
import { EquipmentChangeEvent } from "db://assets/Script/Event/EquipmentChangeEvent";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";

const { ccclass, property } = _decorator;

/**
 * 仓库面板UI
 */
@ccclass('StorehousePanel')
export class StorehousePanel extends Component {
    /**
     * 物品选项菜单
     */
    @property({ type: ItemOptionMenu, tooltip: '物品选项菜单' })
    itemOptionMenu: ItemOptionMenu;

    /**
     * 动画机
     */
    private _anim: Animation;

    /**
     * 是否显示
     */
    private _show: boolean = false;

    onLoad() {
        this._anim = this.node.getComponent(Animation);
        EventCenter.on(EventName.UI_CLICK_ITEM_SLOT, (itemSlot: ItemSlot) => this.onClickItemSlot(itemSlot));
    }

    /**
     * 切换显示
     *
     * 按钮触发
     */
    toggle() {
        this._show = !this._show;
        this._anim.play(this._show ? 'Enter' : 'Exit');
        if (!this._show) {
            this.itemOptionMenu.hide();
        }
    }

    /**
     * 点击物品槽
     *
     * @param itemSlot 点击的物品槽
     */
    private onClickItemSlot(itemSlot: ItemSlot) {
        if (itemSlot.stack?.item.itemType === ItemType.EQUIPMENT) {
            const position = itemSlot.node.getWorldPosition();
            const equip = itemSlot.slotType === SlotType.STOREHOUSE;
            this.itemOptionMenu.showUp(position, equip, () => EventCenter.emit(EventName.EQUIPMENT_CHANGE, new EquipmentChangeEvent(itemSlot.stack.item as Equipment, equip)));
        } else {
            this.itemOptionMenu.hide();
        }
    }
}


