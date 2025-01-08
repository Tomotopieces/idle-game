import { SHOP_TABLE } from "db://assets/Script/DataTable";
import { Shop } from "db://assets/Script/Trading/Shop";
import { Level } from "db://assets/Script/Level/Level";
import { LedgerRecord } from "db://assets/Script/Trading/LedgerRecord";
import { TradingItem } from "db://assets/Script/Trading/TradingItem";

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
     * @param shop        商店
     * @param tradingItem 商品
     */
    static buy(shop: Shop, tradingItem: TradingItem) {
        // TODO 好困，先睡了
    }
}