import { _decorator, Component, Enum, Label, Node, Sprite, SpriteFrame, EventTarget } from 'cc';
import { Item } from "db://assets/Script/Item/Item";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";

const { ccclass, property } = _decorator;

/**
 * 物品槽类型
 */
export enum SlotType {
    /**
     * 装备槽
     */
    EQUIPMENT,

    /**
     * 仓库槽
     */
    STOREHOUSE
}

/**
 * 物品槽
 */
@ccclass('ItemSlot')
export class ItemSlot extends Component {
    /**
     * 物品堆叠Node
     */
    @property({ type: Node, tooltip: '物品堆叠Node' })
    stackNode: Node = null;

    /**
     * 数量Label
     */
    @property({ type: Label, tooltip: '数量Label' })
    countLabel: Label = null;

    /**
     * 物品槽类型
     */
    @property({ type: Enum(SlotType), tooltip: '物品槽类型' })
    slotType: SlotType = SlotType.STOREHOUSE;

    /**
     * 物品
     */
    private _item: Item = null;

    /**
     * 物品堆叠
     */
    private _stack: ItemStack = null;

    /**
     * 事件中心
     */
    private _eventTarget: EventTarget = null;

    start() {
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);
    }

    /**
     * 点击事件
     *
     * 点击触发
     */
    click() {
        this._eventTarget.emit(EventName.CLICK_ITEM_SLOT, this);
    }

    /**
     * 交换
     *
     * @param slot 交换目标
     */
    swap(slot: ItemSlot) {
        const targetItem = slot._item;
        const targetItemStack = slot._stack;
        slot._item = this._item;
        slot._stack = this._stack;
        this._item = targetItem;
        this._stack = targetItemStack;
    }

    get stack(): ItemStack {
        return this._stack;
    }

    /**
     * 更新物品堆叠后更新相关其他数据
     *
     * @param value 新物品堆叠
     */
    set stack(value: ItemStack) {
        this._stack = value;
        this._item = value.item;
        ResourceManager.getAsset(ResourceType.SPRITE_FRAME, this._item.icon, (spriteFrame: SpriteFrame) => {
            this.stackNode.getComponent(Sprite).spriteFrame = spriteFrame;
        });
        this.countLabel.string = `${value.count}`;
    }
}


