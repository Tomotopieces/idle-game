import { _decorator, CCInteger, Component, director, sys } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { SaveData } from "db://assets/Script/SaveData/SaveData";
import {
    ConfigName,
    DefaultLevelName,
    EventName,
    GlobalStateName,
    LING_YUN_NAME,
} from "db://assets/Script/Util/Constant";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { Storehouse, StorehouseUtil } from "db://assets/Script/Util/StorehouseUtil";
import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { LevelNameBar } from "db://assets/Script/UI/LevelNameBar";
import { UpdateLevelEvent } from "db://assets/Script/Event/UpdateLevelEvent";
import { StageLine } from "db://assets/Script/UI/StageLine";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EquipmentChangeEvent } from "db://assets/Script/Event/EquipmentChangeEvent";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { MakeDamageEvent } from "db://assets/Script/Event/MakeDamageEvent";
import { AREA_TABLE, ITEM_TABLE, STAGE_TABLE } from "db://assets/Script/DataTable";

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
    private _area: Area = null;

    /**
     * 舞台
     */
    private _stage: Stage = null;

    /**
     * 仓库
     */
    private _storehouse: Storehouse = new Map<string, ItemStack>();

    /**
     * 最新保存数据
     */
    private _latestSaveData: SaveData | null = null;

    /**
     * 自动保存计时器
     */
    private _autoSaveTimer: number = 0;

    onLoad() {
        // 玩家对象放入全局状态
        GlobalState.setState(GlobalStateName.PLAYER, this.player);
        GlobalState.setState(GlobalStateName.ENEMY, this.enemy);

        // 读取存档
        this.loadSaveData();
        this.restorePlayerAndStorehouseData();
        this.restoreLevelAndEnemyData();

        // 监听处理事件
        EventCenter.on(EventName.MAKE_DAMAGE, this.node.name, (event: MakeDamageEvent) => this.handleDamage(event));
        EventCenter.on(EventName.GET_DROPS, this.node.name, (dropStackList: Array<ItemStack>) => this.getDrops(dropStackList));
        EventCenter.on(EventName.UPDATE_LEVEL, this.node.name, (event: UpdateLevelEvent) => this.updateLevel(event.area, event.stage));
        EventCenter.on(EventName.EQUIPMENT_CHANGE, this.node.name, (event: EquipmentChangeEvent) => this.handleEquipmentChange(event));
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
     * 恢复玩家与仓库数据
     */
    private restorePlayerAndStorehouseData() {
        if (!this._latestSaveData) {
            this.player.init();
            GlobalState.setState(GlobalStateName.STOREHOUSE, this._storehouse);
            return;
        }

        this.player.coin = this._latestSaveData.coin;

        this._latestSaveData.equipmentSlot.forEach(stack => {
            this.player.equipments.equip(stack.item as Equipment);
        });
        EventCenter.emit(EventName.UI_UPDATE_COIN, this.player.coin);
        EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
        this.player.init();

        this._storehouse = this._latestSaveData.storehouse;
        GlobalState.setState(GlobalStateName.STOREHOUSE, this._storehouse);
    }

    /**
     * 恢复关卡与敌人数据
     */
    private restoreLevelAndEnemyData() {
        if (this._latestSaveData) {
            this._area = AREA_TABLE.get(this._latestSaveData.areaName);
            this._stage = STAGE_TABLE.get(this._latestSaveData.stageName);
            this.enemy.info = this._stage.enemyInfo;
        } else {
            this._area = AREA_TABLE.get(DefaultLevelName.AREA);
            this._stage = STAGE_TABLE.get(DefaultLevelName.STAGE);
            this.enemy.info = this._stage.enemyInfo;
        }

        GlobalState.setState(GlobalStateName.AREA, this._area);
        GlobalState.setState(GlobalStateName.STAGE, this._stage);
        this.levelNameBar.updateLevelName(this._area, this._stage);
        this.stageLine.updateCurrentLevel(this._area, this._stage);
    }

    /**
     * 更新关卡
     *
     * @param area 区域
     * @param stage 舞台
     */
    private updateLevel(area: Area, stage: Stage) {
        if (this._area === area && this._stage === stage) {
            return;
        }

        this._area = area;
        this._stage = stage;
        this.enemy.info = stage.enemyInfo;

        GlobalState.setState(GlobalStateName.AREA, this._area);
        GlobalState.setState(GlobalStateName.STAGE, this._stage);
        this.levelNameBar.updateLevelName(this._area, this._stage);
        this.stageLine.updateCurrentLevel(this._area, this._stage);
    }

    /**
     * 加载存档数据
     */
    private loadSaveData() {
        const rawData = sys.localStorage.getItem(ConfigName.SAVE_DATA);
        if (!rawData) {
            return;
        }
        this._latestSaveData = SaveData.fromJson(rawData);
    }

    /**
     * 保存存档
     */
    private saveData() {
        this.player.equipments
        this._latestSaveData = new SaveData(this.player.coin, this.player.equipments.equipmentMap, this._storehouse, this._area.name, this._stage.name);
        sys.localStorage.setItem(ConfigName.SAVE_DATA, this._latestSaveData.toJson());
    }

    /**
     * 处理伤害事件
     *
     * @param event 事件参数
     */
    private handleDamage(event: MakeDamageEvent) {
        switch (event.source) {
            case GlobalStateName.ENEMY:
                this.player.hurt(event.damage);
                break;
            case GlobalStateName.PLAYER:
                this.enemy.hurt(event.damage);
                break;
        }
    }

    /**
     * 获取掉落物
     *
     * @param dropStackList 掉落道具列表
     */
    private getDrops(dropStackList: Array<ItemStack>) {
        StorehouseUtil.putIn(dropStackList);
        this.player.coin = this._storehouse.get(LING_YUN_NAME)?.count ?? 0;
    }

    /**
     * 处理装备变更
     *
     * @param event 事件参数
     */
    private handleEquipmentChange(event: EquipmentChangeEvent) {
        if (event.equip) {
            if (!StorehouseUtil.tackOutOne(event.equipment.name)) {
                return;
            }
            const unequipped = this.player.equipments.equip(event.equipment);
            EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
            if (unequipped) {
                StorehouseUtil.putIn([new ItemStack(unequipped, 1)]);
            }
        } else {
            if (!this.player.equipments.unequip(event.equipment.equipmentType)) {
                return;
            }
            EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
            StorehouseUtil.putIn([new ItemStack(event.equipment, 1)], false);
        }
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

    /**
     * 手动保存游戏数据
     */
    save() {
        this._autoSaveTimer = 0;
        this.saveData();
    }

    /**
     * 获取百戏套装与铜云棒
     */
    gift() {
        const stackList: Array<ItemStack> = [
            new ItemStack(ITEM_TABLE.get('tong_yun_bang'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_nuo_mian'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_chen_qian_yi'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_hu_shou'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_diao_tui'), 1)
        ];
        StorehouseUtil.putIn(stackList);
    }
}
