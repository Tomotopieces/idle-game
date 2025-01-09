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

/**
 * 商店工具
 */
export class ShopUtil {
    /**
     * 账本
     *
     * 商店scene -> 售卖记录
     */
    static LEDGER = new Map<string, LedgerRecord[]>();

    /**
     * 获取当前商店
     */
    static shop(): Shop {
        return SHOP_TABLE.get(Level.STAGE.name) ?? SHOP_TABLE.get(Level.AREA.name) ?? SHOP_TABLE.get(Level.CHAPTER.name);
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
        const tradingItem = stack.item as TradingItem;
        if (Storehouse.countOne(LING_YUN_NAME, false) < tradingItem.price) {
            // 灵韵不足
            EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.WARNING, `没钱别摸`));
            return;
        } else if (stack.count === 0) {
            // 售罄
            EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.WARNING, `卖完了`));
            return;
        }

        // 购买
        if (Storehouse.takeOut([ItemStack.of(LING_YUN_NAME, tradingItem.price)])) {
            Storehouse.putIn([new ItemStack(tradingItem, 1)]);
            stack.count--;
        }

        // 记账
        if (!this.LEDGER.has(shop.scene)) {
            this.LEDGER.set(shop.scene, []);
        }
        const records = this.LEDGER.get(shop.scene);
        const record = records.find(record => record.itemName === tradingItem.name);
        if (record) {
            record.sellCount++;
        } else {
            records.push(new LedgerRecord(tradingItem.name, 0));
        }
    }
}