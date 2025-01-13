import { Color } from "cc";

/**
 * 物品品质
 */
export class ItemRarity {
    /**
     * 凡品
     */
    static COMMON = new ItemRarity(`common`, `凡品`, Color.WHITE, 0);

    /**
     * 良品
     */
    static UNCOMMON = new ItemRarity(`uncommon`, `良品`, new Color(128, 255, 128), 1);

    /**
     * 上品
     */
    static RARE = new ItemRarity(`rare`, `上品`, new Color(64, 128, 255), 2);

    /**
     * 特品
     */
    static EPIC = new ItemRarity(`epic`, `特品`, new Color(255, 64, 255), 3);

    /**
     * 仙品
     */
    static LEGENDARY = new ItemRarity(`legendary`, `仙品`, new Color(255, 255, 128), 4);

    /**
     * 神珍
     */
    static MYTHICAL = new ItemRarity(`mythical`, `神珍`, new Color(255, 64, 64), 5);

    /**
     * 品质顺序
     */
    static RARITIES = [
        ItemRarity.COMMON,
        ItemRarity.UNCOMMON,
        ItemRarity.RARE,
        ItemRarity.EPIC,
        ItemRarity.LEGENDARY,
        ItemRarity.MYTHICAL
    ];

    /**
     * 根据名称获取品质
     *
     * @param name 名称
     * @return 品质
     */
    static of(name: string): ItemRarity {
        return this.RARITIES.find(rarity => rarity.name === name);
    }

    /**
     * 根据值获取品质
     *
     * @param value 数字值
     */
    static ofValue(value: number): ItemRarity {
        return this.RARITIES[value];
    }

    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 颜色
     */
    readonly color: Color;

    /**
     * 数字值
     */
    readonly value: number;

    private constructor(name: string, displayName: string, color: Color, value: number) {
        this.name = name;
        this.displayName = displayName;
        this.color = color;
        this.value = value;
    }
}

/**
 * 物品品质顺序表
 */
export const RARITIES = ItemRarity.RARITIES;
