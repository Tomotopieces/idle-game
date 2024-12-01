/**
 * 存档数据
 */
export class SaveData {
    /**
     * 金币
     */
    coin: number;

    /**
     * 仓库
     */
    storeHouse: string;

    /**
     * 敌人ID
     *
     * TODO 改为关卡进度，从而选择敌人
     */
    enemyId: number;

    constructor(coin: number, storeHouse: string, enemyId: number) {
        this.coin = coin;
        this.storeHouse = storeHouse;
        this.enemyId = enemyId;
    }

    /**
     * 从JSON创建存档数据
     *
     * @param json JSON
     */
    static fromJson(json: string) {
        const obj = JSON.parse(json);
        return new SaveData(obj.coin, obj.storeHouse, obj.enemyId);
    }
}
