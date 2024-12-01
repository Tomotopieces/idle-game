import { _decorator, CCInteger, Component, EventTarget, sys } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { PlayerController } from "db://assets/Script/Entity/PlayerController";
import { ItemStack } from "db://assets/Script/Item/Item";
import { SaveData } from "db://assets/Script/Util/SaveData";
import { COIN_ID, ConfigName, EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { DropItem, DropItemFactory } from "db://assets/Script/Item/DropItem";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { StoreHouse, StoreHouseUtil } from "db://assets/Script/Util/StoreHouseUtil";

const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 */
@ccclass('GameManager')
export class GameManager extends Component {
    /**
     * 玩家控制器
     */
    @property({ type: PlayerController, tooltip: '玩家控制器' })
    player: PlayerController = null;

    /**
     * 敌人信息
     */
    @property({ type: EnemyController, tooltip: '敌人' })
    enemy: EnemyController = null;

    /**
     * 自动保存间隔（秒）
     */
    @property({ type: CCInteger, tooltip: '自动保存间隔（秒）' })
    autoSaveDuration: number = 5 * 60;

    /**
     * 仓库
     */
    private _storeHouse: StoreHouse = new Map<number, ItemStack>();

    /**
     * 最新保存数据
     */
    private _latestSaveData: SaveData | null = null;

    /**
     * 自定义事件管理器
     */
    private _eventTarget: EventTarget = null;

    onLoad() {
        // 获取自定义事件管理器
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);

        // 读取存档
        this.loadSaveData();

        // 监听处理事件
        this._eventTarget.on(EventName.PLAYER_RESTORE_SAVE_DATA, () => this.restorePlayerData());
        this._eventTarget.on(EventName.ENEMY_RESTORE_SAVE_DATA, () => this.restoreEnemyData());
        this._eventTarget.on(EventName.CALCULATE_DROP_ITEM, (dropList: Array<DropItem>) => this.handleDropItem(dropList));
    }

    start() {
        // 每隔10秒保存数据
        setInterval(() => this.saveData(), this.autoSaveDuration * 1000);
    }

    /**
     * 恢复玩家数据
     */
    restorePlayerData() {
        if (!this._latestSaveData) {
            return;
        }
        this.player.coin = this._latestSaveData.coin;
        this._storeHouse = new Map<number, ItemStack>((JSON.parse(this._latestSaveData.storeHouse) as Array<Object>)
            .map(item => {
                const itemStack = ItemStack.fromObject(item);
                return [itemStack.itemId, itemStack];
            }));
        console.log(this._storeHouse);
    }

    /**
     * 恢复敌人数据
     */
    restoreEnemyData() {
        // TODO 从存档中读取
        this.enemy.info = GlobalState.getState(GlobalStateName.ENEMY_TABLE).get(1);
    }

    /**
     * 加载存档数据
     */
    loadSaveData() {
        const rawData = sys.localStorage.getItem(ConfigName.SAVE_DATA);
        if (!rawData) {
            return;
        }
        this._latestSaveData = SaveData.fromJson(rawData);
        console.log(`Load data: ${JSON.stringify(this._latestSaveData)}`)
    }

    /**
     * 保存存档
     */
    saveData() {
        const storeHouseJson = JSON.stringify(Array.from(this._storeHouse.values()));
        console.log(storeHouseJson);
        this._latestSaveData = new SaveData(this.player.coin, storeHouseJson, this.enemy.info.id);
        sys.localStorage.setItem(ConfigName.SAVE_DATA, JSON.stringify(this._latestSaveData));
        console.log(`Save data: ${JSON.stringify(this._latestSaveData)}`);
    }

    /**
     * 清空存档
     *
     * 按钮触发
     */
    clearSaveData() {
        sys.localStorage.clear();
    }

    /**
     * 处理道具掉落
     *
     * @param dropList 掉落道具列表
     */
    private handleDropItem(dropList: Array<DropItem>) {
        StoreHouseUtil.putIn(this._storeHouse, DropItemFactory.produce(dropList));
        this.player.coin = this._storeHouse.get(COIN_ID)?.count ?? 0;
    }
}


