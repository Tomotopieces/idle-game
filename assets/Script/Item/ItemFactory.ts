import { Item } from "db://assets/Script/Item/Item";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { Sellable } from "db://assets/Script/Sellable/Sellable";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { EquipmentMeta } from "db://assets/Script/Equipment/EquipmentMeta";
import { SellableMeta } from "db://assets/Script/Sellable/SellableMeta";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";
import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { EquipmentSerial } from "db://assets/Script/Equipment/EquipmentSerial";
import { ItemStackSerial } from "db://assets/Script/Item/ItemStackSerial";
import { GourdMeta } from "db://assets/Script/Drink/Gourd/GourdMeta";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { LiquorMeta } from "db://assets/Script/Drink/Liquor/LiquorMeta";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";
import { InfusedIngredientMeta } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMeta";
import { GourdSerial } from "db://assets/Script/Drink/Gourd/GourdSerial";

/**
 * 根据Meta类型推断物品类型
 */
type ItemFromMeta<Meta extends ItemMeta> =
    Meta extends EquipmentMeta ? Equipment :
    Meta extends SellableMeta ? Sellable :
    Meta extends GourdMeta ? Gourd :
    Meta extends LiquorMeta ? Liquor :
    Meta extends InfusedIngredientMeta ? InfusedIngredient :
    Item;

/**
 * 根据物品类型推断序列化类型
 */
type SerialFromItem<T extends Item> =
    T extends Equipment ? EquipmentSerial :
    T extends GourdMeta ? GourdSerial :
    ItemSerial;

/**
 * 物品工厂
 */
export class ItemFactory {
    /**
     * 通过元数据生产新物品
     *
     * @param meta 元数据
     * @return {ItemFromMeta} 物品
     */
    static item<Meta extends ItemMeta>(meta: Meta): ItemFromMeta<Meta> {
        return meta instanceof EquipmentMeta ? new Equipment(meta) as ItemFromMeta<Meta> :
               meta instanceof SellableMeta ? new Sellable(meta) as ItemFromMeta<Meta> :
               meta instanceof GourdMeta ? new Gourd(meta) as ItemFromMeta<Meta> :
               meta instanceof LiquorMeta ? new Liquor(meta) as ItemFromMeta<Meta> :
               meta instanceof InfusedIngredientMeta ? new InfusedIngredient(meta) as ItemFromMeta<Meta> :
               new Item(meta) as ItemFromMeta<Meta>;
    }

    /**
     * 通过元数据生产新物品堆叠
     *
     * @param data  元数据 | 物品 | 名称
     * @param count 堆叠数量
     * @return {ItemStack} 物品堆叠
     */
    static itemStack<Meta extends ItemMeta>(data: Meta | Item | string, count: number): ItemStack {
        const item =
            data instanceof ItemMeta ? ItemFactory.item(data) :
            data instanceof Item ? data :
            this.item(ITEM_META_TABLE.get(data));
        return new ItemStack(item, count) as ItemStack;
    }

    /**
     * 序列化物品
     *
     * @param item 物品
     */
    static serialize<T extends Item>(item: T): SerialFromItem<T> {
        // 对带状态的物品子类进行特殊序列化处理
        return item instanceof Equipment ? new EquipmentSerial(item) as SerialFromItem<T> :
               item instanceof Gourd ? new GourdSerial(item) as SerialFromItem<T> :
               new ItemSerial(item) as SerialFromItem<T>;
    }

    /**
     * 反序列化物品堆叠
     *
     * 根据物品名称进行Meta类型判断，生成对应类型物品
     *
     * @param stackSerial 序列化物品堆叠
     * @return {ItemStack} 物品堆叠
     */
    static stackDeserialize(stackSerial: ItemStackSerial): ItemStack {
        const meta = ITEM_META_TABLE.get(stackSerial.itemSerial.name);
        // 对带状态的物品子类进行特殊反序列化处理
        return meta instanceof EquipmentMeta ? this.itemStack(new Equipment(meta, (stackSerial.itemSerial as EquipmentSerial).rank), stackSerial.count) :
               meta instanceof GourdMeta ? this.itemStack(new Gourd(meta, (stackSerial.itemSerial as GourdSerial).remain), stackSerial.count) :
               this.itemStack(meta, stackSerial.count);
    }
}
