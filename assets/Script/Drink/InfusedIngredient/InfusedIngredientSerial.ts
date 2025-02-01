import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";
import { InfusedIngredientMeta } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMeta";

/**
 * 泡酒物序列化
 */
export class InfusedIngredientSerial extends ItemSerial {
    static override deserialize(meta: InfusedIngredientMeta, serial: InfusedIngredientSerial): InfusedIngredient {
        return new InfusedIngredient(meta, serial.uuid);
    }
}