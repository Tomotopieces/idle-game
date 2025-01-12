import { _decorator, Color, Component, Label, Sprite, SpriteFrame } from "cc";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { LedgerRecord } from "db://assets/Script/Trading/LedgerRecord";
import { ShopUtil } from "db://assets/Script/Trading/ShopUtil";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";

const { ccclass } = _decorator;

/**
 * 库存数量颜色
 */
enum StockCountColor {
    /**
     * 默认
     */
    DEFAULT = '#FFFFFF',

    /**
     * 无库存
     */
    ZERO = '#FF0000',
}

/**
 * 商品槽UI
 */
@ccclass('ProductSlot')
export class ProductSlot extends Component {
    /**
     * 商品图标 Sprite
     */
    private _iconSprite: Sprite;

    /**
     * 商品数量 Label
     */
    private _countLabel: Label;

    /**
     * 现有库存
     */
    private _stock: ItemStack = null;

    /**
     * 购买记录
     */
    private _ledgerRecord: LedgerRecord;

    onLoad() {
        this._iconSprite = this.node.getChildByName("Icon").getComponent(Sprite);
        this._countLabel = this.node.getChildByName("Count").getComponent(Label);
    }

    get stock(): ItemStack {
        return this._stock;
    }

    /**
     * 设置商品库存
     *
     * @param originalStock 原始库存
     */
    set stock(originalStock: ItemStack) {
        this._stock = ItemStack.copy(originalStock);

        // 图标
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, this._stock.item.icon, (spriteFrame: SpriteFrame) =>
            this._iconSprite.spriteFrame = spriteFrame);

        // 数量
        this._ledgerRecord = ShopUtil.ledgerRecord(originalStock.item.name);
        this._stock.count -= this._ledgerRecord.sellCount;
        this.updateCountLabel();
    }

    updateCountLabel() {
        this._countLabel.string = `${this._stock.count}`;
        this._countLabel.color = new Color(this._stock.count > 0 ? StockCountColor.DEFAULT : StockCountColor.ZERO);
    }

    /**
     * 点击展示物品信息卡片
     *
     * 点击触发
     */
    click() {
        EventCenter.emit(EventName.UI_CLICK_PRODUCT_SLOT, this);
    }
}