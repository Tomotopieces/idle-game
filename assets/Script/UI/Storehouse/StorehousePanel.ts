import { _decorator, Animation, Component, SpriteFrame } from 'cc';
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { ItemSlot, SlotType } from "db://assets/Script/UI/Storehouse/ItemSlot";
import { UpdateEquipmentEvent } from "db://assets/Script/Event/Events/UpdateEquipmentEvent";
import { ItemCard } from "db://assets/Script/UI/Storehouse/ItemCard";
import { EMPTY_FUNCTION } from "db://assets/Script/Util/Functions";
import { EventName } from "db://assets/Script/Event/EventName";
import { ItemType } from "db://assets/Script/Item/ItemType";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { UpdateDrinkEvent } from "db://assets/Script/Event/Events/UpdateDrinkEvent";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";

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
                operation = () => EventCenter.emit(EventName.UPDATE_EQUIPMENT, new UpdateEquipmentEvent(itemSlot.stack.item as Equipment, equip));
                break;
            case ItemType.SELLABLE:
                buttonImage = this.moneyBagImage;
                operation = () => EventCenter.emit(EventName.SELL_ITEM, itemSlot.stack);
                break;
            case ItemType.GOURD:
                if (itemSlot.slotType === SlotType.GOURD) {
                    operation = EMPTY_FUNCTION;
                } else {
                    operation = () => EventCenter.emit(EventName.UPDATE_DRINK, new UpdateDrinkEvent(itemSlot.stack.item as Gourd));
                    buttonImage = this.confirmImage;
                }
                break;
            case ItemType.LIQUOR:
                if (itemSlot.slotType === SlotType.LIQUOR) {
                    operation = EMPTY_FUNCTION;
                } else {
                    operation = () => EventCenter.emit(EventName.UPDATE_DRINK, new UpdateDrinkEvent(itemSlot.stack.item as Liquor));
                    buttonImage = this.confirmImage;
                }
                break;
            case ItemType.INGREDIENT:
                if (itemSlot.slotType === SlotType.INGREDIENT) {
                    operation = () => EventCenter.emit(EventName.UPDATE_DRINK, new UpdateDrinkEvent(itemSlot.stack.item as InfusedIngredient, false));
                    buttonImage = this.cancelImage;
                } else {
                    operation = () => EventCenter.emit(EventName.UPDATE_DRINK, new UpdateDrinkEvent(itemSlot.stack.item as InfusedIngredient));
                    buttonImage = this.confirmImage;
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
