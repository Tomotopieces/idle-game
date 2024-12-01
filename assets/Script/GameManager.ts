import { _decorator, CCInteger, Component, director, EventTarget, sys } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { PlayerController } from "db://assets/Script/Entity/PlayerController";
import { SaveData } from "db://assets/Script/Util/SaveData";
import { COIN_ID, ConfigName, EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { DropItem } from "db://assets/Script/Item/DropItem";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { StoreHouse, StoreHouseUtil } from "db://assets/Script/Util/StoreHouseUtil";
import { DropItemFactory } from "db://assets/Script/Item/DropItemFactory";
import { ItemStack } from "db://assets/Script/Item/ItemStack";

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
    autoSaveInterval: number = 5 * 60;

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

    /**
     * 自动保存计时器
     */
    private _autoSaveTimer: number = 0;

    onLoad() {
        // 获取自定义事件管理器
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);

        // 读取存档
        this.loadSaveData();
        GlobalState.setState(GlobalStateName.STORE_HOUSE, this._storeHouse);

        // 监听处理事件
        this._eventTarget.on(EventName.PLAYER_RESTORE_SAVE_DATA, () => this.restorePlayerData());
        this._eventTarget.on(EventName.ENEMY_RESTORE_SAVE_DATA, () => this.restoreEnemyData());
        this._eventTarget.on(EventName.CALCULATE_DROP_ITEM, (dropList: Array<DropItem>) => this.handleDropItem(dropList));
    }

    update(dt: number) {
        this._autoSaveTimer += dt;

        if (this._autoSaveTimer >= this.autoSaveInterval) {
            this.saveData();
            this._autoSaveTimer -= this.autoSaveInterval;
        }
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
        GlobalState.setState(GlobalStateName.STORE_HOUSE, this._storeHouse);
    }

    /**
     * 恢复敌人数据
     */
    restoreEnemyData() {
        if (this._latestSaveData) {
            this.enemy.info = GlobalState.getState(GlobalStateName.ENEMY_TABLE).get(this._latestSaveData.enemyId);
        } else {
            this.enemy.info = GlobalState.getState(GlobalStateName.ENEMY_TABLE).get(1);
        }
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
    }

    /**
     * 保存存档
     */
    saveData() {
        const storeHouseJson = JSON.stringify(Array.from(this._storeHouse.values()));
        this._latestSaveData = new SaveData(this.player.coin, storeHouseJson, this.enemy.info.id);
        sys.localStorage.setItem(ConfigName.SAVE_DATA, JSON.stringify(this._latestSaveData));
        console.log(`Auto Save`);
    }

    /**
     * 处理道具掉落
     *
     * @param dropList 掉落道具列表
     */
    private handleDropItem(dropList: Array<DropItem>) {
        StoreHouseUtil.putIn(DropItemFactory.produce(dropList));
        this.player.coin = this._storeHouse.get(COIN_ID)?.count ?? 0;
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
     * 暂停游戏
     *
     * 按钮触发
     */
    pause() {
        director.isPaused() ? director.resume() : director.pause();
    }
}


