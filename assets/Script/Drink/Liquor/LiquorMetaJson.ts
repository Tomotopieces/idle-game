import { ItemMetaJson } from "db://assets/Script/Item/ItemMetaJson";
import { LiquorMeta } from "db://assets/Script/Drink/Liquor/LiquorMeta";
import { UNIQUE_UTILITY_TABLE } from "db://assets/Script/DataTable";

/**
 * 酒元数据JSON
 */
export class LiquorMetaJson extends ItemMetaJson {
    /**
     * 生命恢复量
     */
    readonly healthRecoverRatio: number;

    /**
     * 泡酒物容量
     */
    readonly ingredientCapacity: number;

    /**
     * 转换为 LiquorMeta
     *
     * @param id   ID
     * @param json LiquorMetaJson
     * @return {LiquorMeta} LiquorMeta
     */
    static toLiquorMeta(id: number, json: LiquorMetaJson): LiquorMeta {
        const drinkEffect = UNIQUE_UTILITY_TABLE.get(json.name);
        return new LiquorMeta(
            ItemMetaJson.toItemMeta(id, json),
            json.healthRecoverRatio,
            json.ingredientCapacity,
            drinkEffect
        );
    }
}