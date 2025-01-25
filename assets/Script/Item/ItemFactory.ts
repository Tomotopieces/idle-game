import { Item } from "db://assets/Script/Item/Item";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { Sellable } from "db://assets/Script/Sellable/Sellable";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { EquipmentMeta } from "db://assets/Script/Equipment/EquipmentMeta";
import { SellableMeta } from "db://assets/Script/Sellable/SellableMeta";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";
import { ItemSerial } from "db://assets/Script/Item/ItemSerial";
import { EquipmentSerial } from "db://assets/Script/Equipment/EquipmentSerial";
import { GourdMeta } from "db://assets/Script/Drink/Gourd/GourdMeta";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { LiquorMeta } from "db://assets/Script/Drink/Liquor/LiquorMeta";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { InfusedIngredient } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredient";
import { InfusedIngredientMeta } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMeta";
import { GourdSerial } from "db://assets/Script/Drink/Gourd/GourdSerial";
import { Constructor } from "db://assets/Script/Util/Functions";

/**
 * 物品工厂
 */
export class ItemFactory {
    /**
     * 物品构造注册表
     */
    private static readonly itemRegistry = new Map<Constructor<ItemMeta>, Constructor<Item>>();

    /**
     * 序列化构造注册表
     */
    private static readonly serialRegistry = new Map<Constructor<Item>, Constructor<ItemSerial>>();

    /**
     * 反序列化方法注册表
     */
    private static readonly deserializeRegistry = new Map<Constructor<ItemMeta>, (meta: ItemMeta, serial: ItemSerial) => Item>();

    /**
     * 初始化
     */
    static init() {
        // 注册物品构造
        this.itemRegistry.set(ItemMeta, Item);
        this.itemRegistry.set(EquipmentMeta, Equipment);
        this.itemRegistry.set(SellableMeta, Sellable);
        this.itemRegistry.set(GourdMeta, Gourd);
        this.itemRegistry.set(LiquorMeta, Liquor);
        this.itemRegistry.set(InfusedIngredientMeta, InfusedIngredient);

        // 注册序列化构造
        this.serialRegistry.set(Item, ItemSerial);
        this.serialRegistry.set(Equipment, EquipmentSerial);
        this.serialRegistry.set(Sellable, ItemSerial);
        this.serialRegistry.set(Gourd, GourdSerial);
        this.serialRegistry.set(Liquor, ItemSerial);
        this.serialRegistry.set(InfusedIngredient, ItemSerial);

        // 注册反序列化方法（直接使用将Serial作为参数的Item构造函数将导致循环依赖）
        this.deserializeRegistry.set(ItemMeta, ItemSerial.deserialize);
        this.deserializeRegistry.set(EquipmentMeta, EquipmentSerial.deserialize);
        this.deserializeRegistry.set(SellableMeta, ItemSerial.deserialize);
        this.deserializeRegistry.set(GourdMeta, GourdSerial.deserialize);
        this.deserializeRegistry.set(LiquorMeta, ItemSerial.deserialize);
        this.deserializeRegistry.set(InfusedIngredientMeta, ItemSerial.deserialize);
    }

    /**
     * 通过元数据生产新物品
     *
     * @param meta 元数据
     * @return {Item} 物品
     */
    static create<Meta extends ItemMeta>(meta: Meta): Item {
        const constructor = this.itemRegistry.get(meta.constructor as Constructor<ItemMeta>) ?? Item;
        return new constructor(meta);
    }

    /**
     * 序列化物品
     *
     * @param item 物品
     * @return {ItemSerial} 序列化数据
     */
    static serialize<T extends Item>(item: T): ItemSerial {
        const constructor = this.serialRegistry.get(item.constructor as Constructor<T>) ?? ItemSerial;
        return new constructor(item);
    }

    /**
     * 反序列化物品
     *
     * @param serial 序列化数据
     * @return {Item} 物品
     */
    static deserialize(serial: ItemSerial): Item {
        const meta = ITEM_META_TABLE.get(serial.name);
        return (this.deserializeRegistry.get(meta.constructor as Constructor<ItemMeta>) ?? ItemSerial.deserialize)(meta, serial);
    }
}
