import { _decorator, CCInteger, Component, director, EventTarget, sys } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { PlayerController } from "db://assets/Script/Entity/PlayerController";
import { SaveData } from "db://assets/Script/Util/SaveData";
import {
    LING_YUN_NAME,
    ConfigName,
    EventName,
    GlobalStateName, DefaultStaffName,
} from "db://assets/Script/Util/Constant";
import { DropItem } from "db://assets/Script/Item/DropItem";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { StoreHouse, StoreHouseUtil } from "db://assets/Script/Util/StoreHouseUtil";
import { DropItemFactory } from "db://assets/Script/Item/DropItemFactory";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";

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
     * 区域
     */
    area: Area = null;

    /**
     * 舞台
     */
    stage: Stage = null;

    /**
     * 仓库
     */
    private _storeHouse: StoreHouse = new Map<string, ItemStack>();

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
        this._eventTarget.on(EventName.ENEMY_RESTORE_SAVE_DATA, () => this.restoreLevelAndEnemyData());
        this._eventTarget.on(EventName.CALCULATE_DROP_ITEM, (dropList: Array<DropItem>) => this.handleDropItem(dropList));
    }

    update(dt: number) {
        // 自动存档
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
        this._storeHouse = new Map<string, ItemStack>((JSON.parse(this._latestSaveData.storeHouse) as Array<Object>)
            .map(item => {
                const itemStack = ItemStack.fromObject(item);
                return [itemStack.itemName, itemStack];
            }));
        GlobalState.setState(GlobalStateName.STORE_HOUSE, this._storeHouse);
    }

    /**
     * 恢复关卡与敌人数据
     */
    restoreLevelAndEnemyData() {
        if (this._latestSaveData) {
            this.area = GlobalState.getState(GlobalStateName.AREA_TABLE).get(this._latestSaveData.areaName);
            this.stage = GlobalState.getState(GlobalStateName.STAGE_TABLE).get(this._latestSaveData.stageName);
            this.enemy.info = this.stage.enemyInfo;
        } else {
            this.area = GlobalState.getState(GlobalStateName.AREA_TABLE).get(DefaultStaffName.DEFAULT_AREA_NAME);
            this.stage = GlobalState.getState(GlobalStateName.STAGE_TABLE).get(DefaultStaffName.DEFAULT_STAGE_NAME);
            this.enemy.info = this.stage.enemyInfo;
        }
        this._eventTarget.emit(EventName.UPDATE_LEVEL, this.area, this.stage);
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
        this._latestSaveData = new SaveData(this.player.coin, storeHouseJson, this.area.name, this.stage.name);
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
        this.player.coin = this._storeHouse.get(LING_YUN_NAME)?.count ?? 0;
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


