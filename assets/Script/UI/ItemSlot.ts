import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { Item } from "db://assets/Script/Item/Item";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

const { ccclass, property } = _decorator;

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
     * 物品
     */
    private _item: Item = null;

    /**
     * 物品堆叠
     */
    private _stack: ItemStack = null;

    /**
     * 点击事件
     *
     * 点击触发
     */
    click() {
        console.log(`click`);
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


