import { _decorator, CCInteger, Component, director, EventTarget, sys } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { SaveData } from "db://assets/Script/Util/SaveData";
import {
    ConfigName,
    DefaultStaffName,
    EventName,
    GlobalStateName,
    LING_YUN_NAME,
} from "db://assets/Script/Util/Constant";
import { DropItem } from "db://assets/Script/Item/DropItem";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { StoreHouse, StoreHouseUtil } from "db://assets/Script/Util/StoreHouseUtil";
import { DropItemFactory } from "db://assets/Script/Item/DropItemFactory";
import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { LevelNameBar } from "db://assets/Script/UI/LevelNameBar";
import { UpdateLevelEvent } from "db://assets/Script/Event/UpdateLevelEvent";
import { StageLine } from "db://assets/Script/UI/StageLine";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
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
     * 关卡名称条
     */
    @property({ type: LevelNameBar, tooltip: '关卡名称条' })
    levelNameBar: LevelNameBar = null;

    /**
     * 关卡选择条
     */
    @property({ type: StageLine, tooltip: '关卡选择条' })
    stageLine: StageLine = null;

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
     * 事件中心
     */
    private _eventTarget: EventTarget = null;

    /**
     * 自动保存计时器
     */
    private _autoSaveTimer: number = 0;

    onLoad() {
        this._eventTarget = GlobalState.getState(GlobalStateName.EVENT_TARGET);

        // 读取存档
        this.loadSaveData();
        GlobalState.setState(GlobalStateName.STORE_HOUSE, this._storeHouse);

        // 监听处理事件
        this._eventTarget.on(EventName.PLAYER_RESTORE_SAVE_DATA, () => this.restorePlayerData());
        this._eventTarget.on(EventName.ENEMY_RESTORE_SAVE_DATA, () => this.restoreLevelAndEnemyData());
        this._eventTarget.on(EventName.CALCULATE_DROP_ITEM, (dropList: Array<DropItem>) => this.handleDropItem(dropList));
        this._eventTarget.on(EventName.UPDATE_LEVEL, (event: UpdateLevelEvent) => this.updateLevel(event.area, event.stage));
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
        this._storeHouse = this._latestSaveData.storeHouse;
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

        GlobalState.setState(GlobalStateName.AREA, this.area);
        GlobalState.setState(GlobalStateName.STAGE, this.stage);
        this.levelNameBar.updateLevelName(this.area, this.stage);
        this.stageLine.updateCurrentLevel(this.area, this.stage);
    }

    /**
     * 更新关卡
     *
     * @param area 区域
     * @param stage 舞台
     */
    private updateLevel(area: Area, stage: Stage) {
        if (this.area === area && this.stage === stage) {
            return;
        }

        this.area = area;
        this.stage = stage;
        this.enemy.info = stage.enemyInfo;

        GlobalState.setState(GlobalStateName.AREA, this.area);
        GlobalState.setState(GlobalStateName.STAGE, this.stage);
        this.levelNameBar.updateLevelName(this.area, this.stage);
        this.stageLine.updateCurrentLevel(this.area, this.stage);
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
        this._latestSaveData = new SaveData(this.player.coin, this._storeHouse, this.area.name, this.stage.name);
        sys.localStorage.setItem(ConfigName.SAVE_DATA, this._latestSaveData.toJson());
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


