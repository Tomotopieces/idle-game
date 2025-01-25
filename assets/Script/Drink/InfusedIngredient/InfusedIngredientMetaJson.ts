import { ItemMetaJson } from "db://assets/Script/Item/ItemMetaJson";
import { InfusedIngredientMeta } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMeta";
import { PASSIVE_EFFECT_TABLE } from "db://assets/Script/DataTable";

/**
 * 泡酒物元数据JSON
 */
export class InfusedIngredientMetaJson extends ItemMetaJson {
    /**
     * 转换为 InfusedIngredientMeta
     *
     * @param id   ID
     * @param json InfusedIngredientMetaJson
     * @return {InfusedIngredientMeta} InfusedIngredientMeta
     */
    static toInfusedIngredientMeta(id: number, json: InfusedIngredientMetaJson): InfusedIngredientMeta {
        const drinkEffect = PASSIVE_EFFECT_TABLE.get(json.name);
        return new InfusedIngredientMeta(ItemMetaJson.toItemMeta(id, json), drinkEffect);
    };
}