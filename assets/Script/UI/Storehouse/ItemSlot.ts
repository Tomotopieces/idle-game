import { _decorator, Component, Enum, Label, Sprite, SpriteFrame } from 'cc';
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";

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
     * 葫芦槽
     */
    GOURD = 'GOURD',

    /**
     * 酒槽
     */
    LIQUOR = 'LIQUOR',

    /**
     * 泡酒物槽
     */
    INGREDIENT = 'INGREDIENT',

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
     * 物品槽类型
     */
    @property({ type: Enum(SlotType), displayName: '物品槽类型' })
    slotType: SlotType = SlotType.STOREHOUSE;

    /**
     * 物品图标Sprite
     */
    private _iconSprite: Sprite = null;

    /**
     * 数量Label
     */
    private _countLabel: Label = null;

    /**
     * 物品堆叠
     */
    private _stack: ItemStack = null;

    onLoad() {
        this._iconSprite = this.node.getChildByName('Icon').getComponent(Sprite);
        this._countLabel = this.node.getChildByName('Count').getComponent(Label);
    }

    /**
     * 点击展示物品信息卡片
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
        this._stack = value;
        if (value) {
            ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, this._stack.item.icon, (spriteFrame: SpriteFrame) =>
                this._iconSprite.spriteFrame = spriteFrame);
            this._countLabel.string = this._stack.item.unique ? `` : `${value.count}`;
        } else {
            this._iconSprite.spriteFrame = null;
            this._countLabel.string = '';
        }
    }

    /**
     * 设置数量
     *
     * @param value 新数量
     */
    set count(value: number) {
        if (!this._stack) {
            console.error(`No ItemStack in slot`);
            return;
        }

        this._stack.count = value;
        this._countLabel.string = this._stack.item.unique ? `` : `${value}`;
    }
}
