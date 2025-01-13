import { _decorator, Color, Component, Label, Sprite, SpriteFrame } from "cc";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { Product } from "db://assets/Script/Shop/Product";

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
     * 商品
     */
    private _product: Product;

    onLoad() {
        this._iconSprite = this.node.getChildByName("Icon").getComponent(Sprite);
        this._countLabel = this.node.getChildByName("Count").getComponent(Label);
    }

    get product(): Product {
        return this._product;
    }

    /**
     * 初始化
     *
     * @param product 商品
     */
    init(product: Product) {
        this._product = product;
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, this._product.itemMeta.icon, (spriteFrame: SpriteFrame) =>
            this._iconSprite.spriteFrame = spriteFrame);
        this.updateCountLabel();
    }

    updateCountLabel() {
        this._countLabel.string = `${this._product.count}`;
        this._countLabel.color = new Color(this._product.count > 0 ? StockCountColor.DEFAULT : StockCountColor.ZERO);
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