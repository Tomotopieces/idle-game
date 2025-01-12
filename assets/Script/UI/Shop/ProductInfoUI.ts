import { _decorator, Color, Component, Label } from "cc";
import { ProductSlot } from "db://assets/Script/UI/Shop/ProductSlot";
import { ItemInfoUI } from "db://assets/Script/Prefab/ItemInfoUI";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { LING_YUN_NAME } from "db://assets/Script/Util/Constant";
import { TradingItem } from "db://assets/Script/Trading/TradingItem";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";

const { ccclass } = _decorator;

/**
 * 商品信息UI
 */
@ccclass("ProductInfoUI")
export class ProductInfoUI extends Component {
    /**
     * 物品信息
     */
    private _itemInfo: ItemInfoUI;

    /**
     * 价格 Label
     */
    private _priceLabel: Label;

    /**
     * 商品
     */
    private _product: ProductSlot;

    onLoad() {
        this._itemInfo = this.node.getChildByName('ItemInfo').getComponent(ItemInfoUI);
        this._priceLabel = this.node.getChildByName('Price').getChildByName('Label').getComponent(Label);

        EventCenter.on(EventName.UI_UPDATE_STOREHOUSE, this.node.name, (stackList: ItemStack[]) => this.handleStorehouseUpdate(stackList));
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 显示
     *
     * @param product 商品槽
     */
    show(product: ProductSlot) {
        this.node.active = true;
        this._product = product;
        this._itemInfo.show(this._product.stock.item);

        this.updatePriceLabel();
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.active = false;
    }

    /**
     * 处理仓库更新事件
     *
     * 更新灵韵数量
     *
     * @param stackList 更新物品列表
     */
    private handleStorehouseUpdate(stackList: ItemStack[]) {
        if (!this.node.active || !this._product) {
            return;
        }

        const lingYunStack = stackList.find(stack => stack.item.name === LING_YUN_NAME);
        !!lingYunStack && this.updatePriceLabel(lingYunStack.count);
    }

    /**
     * 更新价格 Label
     *
     * @param lingYun 持有灵韵数量
     */
    private updatePriceLabel(lingYun?: number) {
        lingYun = lingYun ?? Storehouse.countOne(LING_YUN_NAME);
        const price = (this._product.stock.item as TradingItem).price;
        this._priceLabel.string = `${lingYun} / ${price}`;
        this._priceLabel.color = lingYun >= price ? Color.WHITE : Color.RED;
    }
}