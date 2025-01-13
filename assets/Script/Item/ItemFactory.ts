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

/**
 * 根据Meta类型推断物品类型
 */
type ItemFromMeta<Meta extends ItemMeta> = Meta extends EquipmentMeta ? Equipment : Meta extends SellableMeta ? Sellable : Item;

/**
 * 根据物品类型推断序列化类型
 */
type SerialFromItem<T extends Item> = T extends Equipment ? EquipmentSerial : ItemSerial;

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
        if (meta instanceof EquipmentMeta) {
            return new Equipment(meta) as ItemFromMeta<Meta>;
        } else if (meta instanceof SellableMeta) {
            return new Sellable(meta) as ItemFromMeta<Meta>;
        } else {
            return new Item(meta) as ItemFromMeta<Meta>;
        }
    }

    /**
     * 通过元数据生产新物品堆叠
     *
     * @param meta  元数据 | 物品 | 名称
     * @param count 堆叠数量
     * @return {ItemStack} 物品堆叠
     */
    static itemStack<Meta extends ItemMeta>(meta: Meta | Item | string, count: number): ItemStack {
        const item =
            meta instanceof ItemMeta ? ItemFactory.item(meta) :
            meta instanceof Item ? meta :
            ItemFactory.item(ITEM_META_TABLE.get(meta));
        return new ItemStack(item, count) as ItemStack;
    }

    /**
     * 序列化物品
     *
     * @param item 物品
     */
    static serialize<T extends Item>(item: T): SerialFromItem<T> {
        // 对带有状态的物品子类进行特殊序列化处理
        if (item instanceof Equipment) {
            return new EquipmentSerial(item) as SerialFromItem<T>;
        } else {
            return new ItemSerial(item) as SerialFromItem<T>;
        }
    }

    /**
     * 反序列化物品堆叠
     *
     * @param stackSerial 序列化物品堆叠
     * @return {ItemStack} 物品堆叠
     */
    static stackDeserialize(stackSerial: ItemStackSerial): ItemStack {
        const meta = ITEM_META_TABLE.get(stackSerial.itemSerial.name);
        // 对带有状态的物品子类进行特殊反序列化处理
        if (meta instanceof EquipmentMeta) {
            const equipmentSerial = stackSerial.itemSerial as EquipmentSerial;
            return this.itemStack(new Equipment(meta, equipmentSerial.rank), stackSerial.count);
        } else {
            return this.itemStack(meta, stackSerial.count);
        }
    }
}
