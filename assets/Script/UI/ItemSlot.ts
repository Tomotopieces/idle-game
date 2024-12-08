import { _decorator, Component, Enum, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EventName } from "db://assets/Script/Util/Constant";
import { EventCenter } from "db://assets/Script/Util/EventCenter";

const { ccclass, property } = _decorator;

/**
 * 物品槽类型
 */
export enum SlotType {
    /**
     * 装备槽
     */
    EQUIPMENT = 'EQUIPMENT',

    /**
     * 仓库槽
     */
    STOREHOUSE = 'STOREHOUSE',
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
     * 物品图标Sprite
     */
    @property({ type: Sprite, tooltip: '物品图标Sprite' })
    stackSprite: Sprite = null;

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
        EventCenter.emit(EventName.UI_CLICK_ITEM_SLOT, this);
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
        if (value) {
            this._stack = value;
            ResourceManager.getAsset(ResourceType.SPRITE_FRAME, this._stack.item.icon, (spriteFrame: SpriteFrame) => {
                this.stackSprite.spriteFrame = spriteFrame;
            });
            this.countLabel.string = `${value.count}`;
        } else {
            this._stack = value;
            this.stackSprite.spriteFrame = null;
            this.countLabel.string = '';
        }
    }
}


