import { SHOP_TABLE } from "db://assets/Script/DataTable";
import { Shop } from "db://assets/Script/Trading/Shop";
import { Level } from "db://assets/Script/Level/Level";
import { LedgerRecord } from "db://assets/Script/Trading/LedgerRecord";
import { TradingItem } from "db://assets/Script/Trading/TradingItem";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
import { LING_YUN_NAME } from "db://assets/Script/Util/Constant";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { UIPostMessageEvent } from "db://assets/Script/Event/Events/UIPostMessageEvent";
import { MessageType } from "db://assets/Script/UI/Message/MessageFactory";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { ProductPurchasedEvent } from "db://assets/Script/Event/Events/ProductPurchasedEvent";

/**
 * 商店工具
 */
export class ShopUtil {
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
     * @param shop  商店
     * @param stack 库存
     */
    static buy(shop: Shop, stack: ItemStack) {
        const product = stack.item as TradingItem;
        if (Storehouse.countOne(LING_YUN_NAME, false) < product.price) {
            // 灵韵不足
            EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.WARNING, `没钱别摸`));
            return;
        } else if (!stack.count) {
            // 售罄
            EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.WARNING, `卖完了`));
            return;
        }

        // 购买
        if (Storehouse.takeOut([ItemStack.of(LING_YUN_NAME, product.price)])) {
            Storehouse.putIn([new ItemStack(product, 1)]);
            stack.count--;
        }

        // 记账
        if (!this.LEDGER.has(shop.scene)) {
            this.LEDGER.set(shop.scene, []);
        }
        const records = this.LEDGER.get(shop.scene);
        const record = records.find(record => record.itemName === product.name);
        if (record) {
            record.sellCount++;
        } else {
            records.push(new LedgerRecord(shop.scene, product.name, 0));
        }

        // 发送事件
        EventCenter.emit(EventName.PRODUCT_PURCHASED, new ProductPurchasedEvent(product.name));
    }

    /**
     * 获取商品的账本记录
     *
     * @param itemName 商品名
     * @return 账本记录
     */
    static ledgerRecord(itemName: string): LedgerRecord {
        return this.LEDGER.get(this.SHOP.scene)?.find(record => record.itemName === itemName) ?? new LedgerRecord(this.SHOP.scene, itemName, 0);
    }
}