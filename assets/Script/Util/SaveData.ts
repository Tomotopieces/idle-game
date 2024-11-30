import { ItemStack } from "db://assets/Script/Util/Item";

/**
 * 存档数据
 */
export class SaveData {
    /**
     * 金币
     */
    private _coin: number;

    /**
     * 仓库
     */
    private _storeHouse: Array<ItemStack>;
}
