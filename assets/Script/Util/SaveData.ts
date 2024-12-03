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
     */
    areaName: string;

    stageName: string;

    constructor(coin: number, storeHouse: string, areaName: string, stageName: string) {
        this.coin = coin;
        this.storeHouse = storeHouse;
        this.areaName = areaName;
        this.stageName = stageName;
    }

    /**
     * 从JSON创建存档数据
     *
     * @param json JSON
     */
    static fromJson(json: string) {
        const obj = JSON.parse(json);
        return new SaveData(obj.coin, obj.storeHouse, obj.areaName, obj.stageName);
    }
}
