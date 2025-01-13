import { ItemMetaJson } from "db://assets/Script/Item/ItemMetaJson";
import { SellableMeta } from "db://assets/Script/Sellable/SellableMeta";

/**
 * 玩家贩卖品元数据JSON
 */
export class SellableMetaJson extends ItemMetaJson {
    /**
     * 价格
     */
    readonly price: number;

    /**
     * 转换为SellableMeta
     *
     * @param id   ID
     * @param json SellableMetaJson
     * @return {SellableMeta} SellableMeta
     */
    static toSellableMeta(id: number, json: SellableMetaJson): SellableMeta {
        return new SellableMeta(ItemMetaJson.toItemMeta(id, json), json.price);
    }
}