import { Item, ItemType } from "db://assets/Script/Item/Item";
import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { SET_EFFECT_TABLE, UNIQUE_EFFECT_TABLE } from "db://assets/Script/DataTable";

export class EquipmentInfoUIUtil {
    /**
     * 设置物品属性信息
     *
     * @param item 物品
     */
    static setAttributes(item: Item): string {
        if (!(item instanceof Equipment)) {
            return ``;
        }

        const equipment = item as Equipment;
        let displayResult = ``;
        displayResult += equipment.attributes.additionalHealth ? `+${equipment.attributes.additionalHealth} 最大生命\n` : ``;
        displayResult += equipment.attributes.healthBoost ? `+${equipment.attributes.healthBoost * 100}% 生命加成\n` : ``;
        displayResult += equipment.attributes.extraHealth ? `+${equipment.attributes.extraHealth} 额外生命\n` : ``;
        displayResult += equipment.attributes.additionalDamage ? `+${equipment.attributes.additionalDamage} 伤害\n` : ``;
        displayResult += equipment.attributes.damageBoost ? `+${equipment.attributes.damageBoost * 100}% 伤害加成\n` : ``;
        displayResult += equipment.attributes.additionalDefense ? `+${equipment.attributes.additionalDefense} 防御\n` : ``;
        displayResult += equipment.attributes.defenseBoost ? `+${equipment.attributes.defenseBoost * 100}% 防御加成\n` : ``;
        displayResult += equipment.attributes.criticalRate ? `+${equipment.attributes.criticalRate * 100}% 暴击率\n` : ``;
        displayResult += equipment.attributes.criticalBoost ? `+${equipment.attributes.criticalBoost}% 暴击伤害加成\n` : ``;
        if (displayResult.endsWith('\n')) {
            displayResult = displayResult.slice(0, -1);
        }

        return displayResult;
    }

    /**
     * 设置独门妙用信息
     *
     * @param item 物品
     */
    static setUniqueEffect(item: Item): string {
        if (!(item instanceof Equipment)) {
            return ``;
        }

        const equipment = item as Equipment;
        const description = UNIQUE_EFFECT_TABLE.get(equipment.name)?.description;

        return description ? `独门妙用：\n${description}` : ``;
    }

    /**
     * 设置套装效果信息
     *
     * @param item 物品
     * @param showActivated 是否显示是否已激活
     */
    static setSetEffect(item: Item, showActivated: boolean = true): string {
        if (!(item instanceof Equipment) || !(item as Equipment).attributes.setName) {
            return ``;
        }

        const equipment = item as Equipment;
        const setEffect = SET_EFFECT_TABLE.get(equipment.attributes.setName);
        let displayResult = `套装效果：`;
        setEffect.levelEffectMap.forEach((effect, level) =>
            displayResult += `\nLv.${level}：${effect.description} ${showActivated ? effect.active ? '✔' : '❌' : ''}`);
        return displayResult;
    }

    /**
     * 获取物品类型标签
     *
     * @param item 物品
     */
    static getItemTypeLabel(item: Item): string {
        switch (item.itemType) {
            default:
            case ItemType.COMMON:
                return '普通';
            case ItemType.CONSUMABLE:
                return '消耗品';
            case ItemType.EQUIPMENT:
                const equipment = item as Equipment;
                switch (equipment.equipmentType) {
                    default:
                    case EquipmentType.WEAPON:
                        return '披挂 - 武器';
                    case EquipmentType.HEAD:
                        return '披挂 - 头冠';
                    case EquipmentType.CHEST:
                        return '披挂 - 衣甲';
                    case EquipmentType.ARM:
                        return '披挂 - 臂甲';
                    case EquipmentType.LEG:
                        return '披挂 - 腿甲';
                    case EquipmentType.CURIOS:
                        return '披挂 - 珍玩';
                }
        }
    }
}