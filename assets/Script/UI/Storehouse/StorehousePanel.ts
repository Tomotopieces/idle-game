import { _decorator, Animation, Component, SpriteFrame } from 'cc';
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Util/Constant";
import { ItemSlot, SlotType } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { ItemType } from "db://assets/Script/Item/Item";
import { EquipmentChangeEvent } from "db://assets/Script/Event/EquipmentChangeEvent";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";
import { ItemCard } from "db://assets/Script/UI/Storehouse/ItemCard";
import { EMPTY_FUNCTION } from "db://assets/Script/Util/Functions";

const { ccclass, property } = _decorator;

/**
 * 仓库面板UI
 */
@ccclass('StorehousePanel')
export class StorehousePanel extends Component {
    /**
     * 物品信息卡片
     */
    @property({ type: ItemCard, tooltip: '物品信息卡片' })
    itemCard: ItemCard;

    /**
     * 确认按钮图片
     */
    @property({ type: SpriteFrame, tooltip: '确认按钮图片' })
    confirmImage: SpriteFrame;

    /**
     * 取消按钮图片
     */
    @property({ type: SpriteFrame, tooltip: '取消按钮图片' })
    cancelImage: SpriteFrame;

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
        EventCenter.on(EventName.UI_CLICK_ITEM_SLOT, this.node.name, (itemSlot: ItemSlot) => this.onClickItemSlot(itemSlot));
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
            this.itemCard.hide();
        }
    }

    /**
     * 点击物品槽
     *
     * @param itemSlot 点击的物品槽
     */
    private onClickItemSlot(itemSlot: ItemSlot) {
        if (!itemSlot.stack) {
            this.itemCard.hide();
            return;
        }
        const position = itemSlot.node.getWorldPosition();
        const equip = itemSlot.slotType === SlotType.STOREHOUSE; // 装备还是卸下
        const buttonImage = equip ? this.confirmImage : this.cancelImage;
        const operation = itemSlot.stack.item?.itemType === ItemType.EQUIPMENT ?
            () => EventCenter.emit(EventName.EQUIPMENT_CHANGE, new EquipmentChangeEvent(itemSlot.stack.item as Equipment, equip)) :
            EMPTY_FUNCTION;
        this.itemCard.show(position,
            itemSlot.stack.item,
            operation,
            buttonImage);
    }
}


