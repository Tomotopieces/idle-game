import { _decorator, Animation, Component, SpriteFrame } from 'cc';
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { ItemSlot, SlotType } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { EquipEvent } from "db://assets/Script/Event/Events/EquipEvent";
import { ItemCard } from "db://assets/Script/UI/Storehouse/ItemCard";
import { EMPTY_FUNCTION } from "db://assets/Script/Util/Functions";
import { EventName } from "db://assets/Script/Event/EventName";
import { ItemType } from "db://assets/Script/Item/ItemType";

const { ccclass, property } = _decorator;

/**
 * 仓库面板UI
 */
@ccclass('StorehousePanel')
export class StorehousePanel extends Component {
    /**
     * 物品信息卡片
     */
    @property({ type: ItemCard, displayName: '物品信息卡片' })
    itemCard: ItemCard;

    /**
     * 确认按钮图片
     */
    @property({ type: SpriteFrame, displayName: '确认按钮图片' })
    confirmImage: SpriteFrame;

    /**
     * 取消按钮图片
     */
    @property({ type: SpriteFrame, displayName: '取消按钮图片' })
    cancelImage: SpriteFrame;

    /**
     * 钱袋图片
     */
    @property({ type: SpriteFrame, displayName: '钱袋图片' })
    moneyBagImage: SpriteFrame;

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
        EventCenter.on(EventName.UI_CLICK_ITEM_SLOT, this.node.name, (itemSlot: ItemSlot) => this.handleClickItemSlot(itemSlot));
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
    private handleClickItemSlot(itemSlot: ItemSlot) {
        if (!itemSlot.stack) {
            this.itemCard.hide();
            return;
        }
        const position = itemSlot.node.getWorldPosition();
        let buttonImage: SpriteFrame;
        let operation: () => void;
        switch (itemSlot.stack.item?.itemType) {
            case ItemType.EQUIPMENT:
                const equip = itemSlot.slotType === SlotType.STOREHOUSE; // 装备还是卸下
                buttonImage = equip ? this.confirmImage : this.cancelImage;
                operation = () => EventCenter.emit(EventName.EQUIP, new EquipEvent(itemSlot.stack, equip));
                break;
            case ItemType.SELLABLE:
                buttonImage = this.moneyBagImage;
                operation = () => {
                    EventCenter.emit(EventName.SELL_ITEM, itemSlot.stack);
                }
                break;
            default:
                operation = EMPTY_FUNCTION;
                break;
        }
        this.itemCard.show(position,
            itemSlot.stack.item,
            operation,
            buttonImage);
    }
}
