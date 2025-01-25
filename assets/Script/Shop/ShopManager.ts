import { SHOP_TABLE } from "db://assets/Script/DataTable";
import { Shop } from "db://assets/Script/Shop/Shop";
import { Level } from "db://assets/Script/Level/Level";
import { LedgerRecord } from "db://assets/Script/Shop/LedgerRecord";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
import { LING_YUN_NAME } from "db://assets/Script/Util/Constant";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { UIPostMessageEvent } from "db://assets/Script/Event/Events/UIPostMessageEvent";
import { MessageType } from "db://assets/Script/UI/Message/MessageFactory";
import { ProductPurchasedEvent } from "db://assets/Script/Event/Events/ProductPurchasedEvent";
import { Product } from "db://assets/Script/Shop/Product";
import { ProductMeta } from "db://assets/Script/Shop/ProductMeta";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

/**
 * 商店管理器
 */
export class ShopManager {
    static SHOP: Shop;

    /**
     * 账本
     *
     * 商店scene -> 售卖记录
     */
    static LEDGER = new Map<string, LedgerRecord[]>();

    /**
     * 更新并获取当前商店
     */
    static shop(): Shop {
        // 从小到大范围查询
        return this.SHOP = SHOP_TABLE.get(Level.STAGE.name) ||
            SHOP_TABLE.get(Level.AREA.name) ||
            SHOP_TABLE.get(Level.CHAPTER.name);
    }

    /**
     * 从商店购买物品
     *
     * 一次买一件
     *
     * @param product 库存
     */
    static buy(product: Product) {
        if (Storehouse.countOne(LING_YUN_NAME, false) < product.price) {
            // 灵韵不足
            EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.WARNING, `没钱别摸`));
            return;
        } else if (!product.count) {
            // 售罄
            EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.WARNING, `卖完了`));
            return;
        }

        // 购买
        if (Storehouse.takeOut([ItemStack.of(LING_YUN_NAME, product.price)])) {
            Storehouse.putIn([ItemStack.of(product.itemMeta, 1)]);
            product.count--;
        }

        // 记账
        const scene = this.SHOP.scene;
        if (!this.LEDGER.has(scene)) {
            this.LEDGER.set(scene, []);
        }
        const records = this.LEDGER.get(scene);
        const record = records.find(record => record.itemName === product.itemMeta.name);
        if (record) {
            record.sellCount++;
        } else {
            records.push(new LedgerRecord(scene, product.itemMeta.name, 1));
        }

        // 发送事件
        EventCenter.emit(EventName.PRODUCT_PURCHASED, new ProductPurchasedEvent(product.itemMeta.name));
    }

    /**
     * 获取商品
     *
     * @param meta 商品元数据
     * @return {Product} 商品
     */
    static product(meta: ProductMeta): Product {
        const product = new Product(meta);
        product.count = meta.initial - this.sellCount(meta.itemMeta.name);
        return product;
    }

    /**
     * 获取商品的售出次数
     *
     * @param itemName 商品名
     * @return {number} 售出次数
     */
    static sellCount(itemName: string): number {
        return this.LEDGER.get(this.SHOP.scene)?.find(record => record.itemName === itemName)?.sellCount ?? 0;
    }
}