import { StorehouseType } from "db://assets/Script/Storehouse/Storehouse";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { SaveDataJson } from "db://assets/Script/SaveData/SaveDataJson";
import { MapUtil } from "db://assets/Script/Util/MapUtil";
import { DefaultLevelName } from "db://assets/Script/Level/Level";
import { LedgerRecord } from "db://assets/Script/Shop/LedgerRecord";
import { ArrayUtil } from "db://assets/Script/Util/ArrayUtil";
import { ItemStackSerial } from "db://assets/Script/Item/ItemStackSerial";
import { Item } from "db://assets/Script/Item/Item";

/**
 * 存档数据
 */
export class SaveData {
    /**
     * 等级
     */
    level: number;

    /**
     * 经验
     */
    experience: number;

    /**
     * 仓库
     */
    storehouse: StorehouseType;

    /**
     * 装备
     */
    equipments: Item[];

    /**
     * 酒饮
     */
    drinks: Item[];

    /**
     * 舞台名称
     */
    stageName: string;

    /**
     * 天赋
     */
    talents: Map<string, number>;

    /**
     * 敌人记录
     */
    enemyRecord: Map<string, number>;

    /**
     * 账本
     */
    ledger: Map<string, LedgerRecord[]>;

    constructor(level: number, experience: number, storehouse: StorehouseType, equipments: Item[], drinks: Item[], stageName: string, talents: Map<string, number>, enemyRecord: Map<string, number>, ledger: Map<string, LedgerRecord[]>) {
        this.level = level ?? 0;
        this.experience = experience ?? 0;
        this.storehouse = storehouse ?? new Map<string, ItemStack>();
        this.equipments = equipments ?? [];
        this.drinks = drinks ?? [];
        this.stageName = stageName ?? DefaultLevelName.STAGE;
        this.talents = talents ?? new Map<string, number>();
        this.enemyRecord = enemyRecord ?? new Map<string, number>();
        this.ledger = ledger ?? new Map<string, LedgerRecord[]>();
    }

    /**
     * 从JSON创建存档数据
     *
     * @param json 存档数据JSON
     * @return 存档数据
     */
    static fromJson(json: string): SaveData {
        const dataJson = JSON.parse(json) as SaveDataJson;
        const equipments: Item[] = [];
        const drinks: Item[] = [];
        const storehouse = new Map<string, ItemStack>(dataJson.storehouse
            .map(stackSerial => {
                const stack = ItemStackSerial.deserialize(stackSerial);
                if (dataJson.equipmentUUIDs.find(uuid => uuid === stack.item.uuid)) {
                    equipments.push(stack.item);
                }
                if (dataJson.drinkUUIDs.find(uuid => uuid === stack.item.uuid)) {
                    drinks.push(stack.item);
                }
                return [stackSerial.itemSerial.name, stack];
            }));
        const talents = dataJson.talents ? MapUtil.parse(dataJson.talents) as Map<string, number> : null;
        const enemyRecord = dataJson.enemyRecord ? MapUtil.parse(dataJson.enemyRecord) as Map<string, number> : null;
        const ledger = ArrayUtil.groupBy(dataJson.ledger, record => record.shopScene);
        return new SaveData(dataJson.level, dataJson.experience, storehouse, equipments, drinks, dataJson.stageName, talents, enemyRecord, ledger);
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        const storehouseJson = Array.from(this.storehouse.values()).map(stack => stack.serialize());
        const equipmentUUIDs = this.equipments.filter(equipment => !!equipment).map(equipment => equipment.uuid);
        const drinksUUIDs = this.drinks.map(drink => drink.uuid);
        const talentsJson = MapUtil.stringify(this.talents);
        const enemyRecordJson = MapUtil.stringify(this.enemyRecord);
        const ledger = ArrayUtil.flat(Array.from(this.ledger.values()));
        return new SaveDataJson(this.level, this.experience, storehouseJson, equipmentUUIDs, drinksUUIDs, this.stageName, talentsJson, enemyRecordJson, ledger).toJson();
    }
}
