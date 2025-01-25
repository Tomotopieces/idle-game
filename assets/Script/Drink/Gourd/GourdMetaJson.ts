import { GourdMeta } from "db://assets/Script/Drink/Gourd/GourdMeta";
import { ItemMetaJson } from "db://assets/Script/Item/ItemMetaJson";
import { PASSIVE_EFFECT_TABLE } from "db://assets/Script/DataTable";

/**
 * 葫芦元数据JSON
 */
export class GourdMetaJson extends ItemMetaJson {
    /**
     * 容量
     */
    readonly capacity: number;

    /**
     * 自动恢复酒量的时间间隔
     */
    readonly autoRecoverInterval: number;

    /**
     * 自动饮用的时间间隔
     */
    readonly autoDrinkInterval: number;

    /**
     * 转换为GourdMeta
     *
     * @param id ID
     * @param json GourdMetaJson
     * @return {GourdMeta} GourdMeta
     */
    static toGourdMeta(id: number, json: GourdMetaJson): GourdMeta {
        const drinkEffect = PASSIVE_EFFECT_TABLE.get(json.name);
        return new GourdMeta(ItemMetaJson.toItemMeta(id, json), json.capacity, json.autoRecoverInterval, json.autoDrinkInterval, drinkEffect);
    }
}