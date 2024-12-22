import { _decorator, CCInteger, Component, director, sys } from 'cc';
import { SaveData } from "db://assets/Script/SaveData/SaveData";
import { LocalStorageDataName, } from "db://assets/Script/Util/Constant";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
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
import { DamageUnit, DealDamageEvent } from "db://assets/Script/Event/DealDamageEvent";
import { AREA_TABLE, CHAPTER_TABLE, ITEM_TABLE, STAGE_TABLE } from "db://assets/Script/DataTable";
import { DropItemFactory } from "db://assets/Script/Item/DropItemFactory";
import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { DefaultLevelName, Level } from "db://assets/Script/Level/Level";
import { EventName } from "db://assets/Script/Event/EventName";
import { ENEMY_RECORD } from "db://assets/Script/EnemyRecord/EnemyRecord";

const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 *
 * 初始化游戏，读取存档恢复数据，监听处理基本事件，自动存档
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
     * 自动存档回调
     */
    private _autoSaveCallback = () => this.saveData();

    onLoad() {
        // 监听处理事件
        EventCenter.on(EventName.DEAL_DAMAGE, this.node.name, (event: DealDamageEvent) => this.handleDamage(event));
        EventCenter.on(EventName.UPDATE_LEVEL, this.node.name, (event: UpdateLevelEvent) => this.updateLevel(event.area, event.stage));
        EventCenter.on(EventName.EQUIPMENT_CHANGE, this.node.name, (event: EquipmentChangeEvent) => this.handleEquipmentChange(event));
        EventCenter.on(EventName.ENEMY_DIE, this.node.name, (enemy: EnemyController) => this.handleEnemyDie(enemy));
        EventCenter.on(EventName.GET_DROPS, this.node.name, (dropStackList: Array<ItemStack>) => this.getDrops(dropStackList));
        EventCenter.on(EventName.GET_EXPERIENCE, this.node.name, (experience: number) => this.getExperience(experience));
        EventCenter.on(EventName.PLAYER_LEVEL_UP, this.node.name, (level: number) => this.handlePlayerLevelUp(level));
        EventCenter.on(EventName.GAIN_STANCE, this.node.name, (stance: number) => this.handleGainStance(stance));
        EventCenter.on(EventName.TALENT_UPGRADE, this.node.name, (talentTreeNode: TalentTreeNode) => this.handleTalentUpgrade(talentTreeNode));
    }

    start() {
        // 读取存档
        const saveData = this.loadSaveData();
        this.restorePlayerAndStorehouseData(saveData);
        this.restoreLevelAndEnemyData(saveData);

        // 自动存档
        this.schedule(this._autoSaveCallback, this.autoSaveInterval);
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
        this.unschedule(this._autoSaveCallback);
    }

    /**
     * 恢复玩家与仓库数据
     */
    private restorePlayerAndStorehouseData(saveData: SaveData) {
        this.player.init();
        if (!saveData) {
            this.equipStarterSet();
            return;
        }

        this.player.levelInfo.restore(saveData.level, saveData.experience);
        saveData.equipmentSlot.forEach(stack => {
            this.player.equipments.equip(stack.item as Equipment);
        });
        this.player.attributes.levelUp(saveData.level);
        this.player.talents.restore(saveData.talents);

        EventCenter.emit(EventName.UI_UPDATE_PLAYER_LEVEL_INFO, this.player.levelInfo);
        EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);

        Storehouse.STOREHOUSE = saveData.storehouse;
        EventCenter.emit(EventName.UI_UPDATE_STOREHOUSE, Array.from(Storehouse.STOREHOUSE.values()));
    }

    /**
     * 恢复关卡与敌人数据
     */
    private restoreLevelAndEnemyData(saveData: SaveData) {
        if (saveData) {
            Level.AREA = AREA_TABLE.get(saveData.areaName);
            Level.STAGE = STAGE_TABLE.get(saveData.stageName);
            Level.CHAPTER = CHAPTER_TABLE.get(saveData.chapterName);
        } else {
            Level.CHAPTER = CHAPTER_TABLE.get(DefaultLevelName.CHAPTER);
            Level.AREA = AREA_TABLE.get(DefaultLevelName.AREA);
            Level.STAGE = STAGE_TABLE.get(DefaultLevelName.STAGE);
        }
        this.enemy.info = Level.STAGE.enemyInfo;
        saveData.enemyRecord.forEach((value, key) => ENEMY_RECORD.set(key, value));

        this.levelNameBar.updateLevelName(Level.CHAPTER, Level.AREA, Level.STAGE);
        this.stageLine.updateCurrentLevel(Level.AREA, Level.STAGE);
    }

    /**
     * 更新关卡
     *
     * @param area 区域
     * @param stage 舞台
     */
    private updateLevel(area: Area, stage: Stage) {
        if (Level.AREA === area && Level.STAGE === stage) {
            return;
        }

        Level.AREA = area;
        Level.STAGE = stage;
        this.enemy.info = stage.enemyInfo;

        this.levelNameBar.updateLevelName(Level.CHAPTER, Level.AREA, Level.STAGE);
        this.stageLine.updateCurrentLevel(Level.AREA, Level.STAGE);
    }

    /**
     * 加载存档数据
     */
    private loadSaveData(): SaveData {
        const rawData = sys.localStorage.getItem(LocalStorageDataName.SAVE_DATA);
        if (!rawData) {
            return;
        }
        return SaveData.fromJson(rawData);
    }

    /**
     * 保存存档
     */
    private saveData() {
        const saveData = new SaveData(this.player.levelInfo.level, this.player.levelInfo.experience, this.player.equipments.equipmentMap, Storehouse.STOREHOUSE, Level.CHAPTER.name, Level.AREA.name, Level.STAGE.name, this.player.talents.talents, ENEMY_RECORD);
        sys.localStorage.setItem(LocalStorageDataName.SAVE_DATA, saveData.toJson());
        EventCenter.emit(EventName.UI_POST_MESSAGE, `保存成功`);
    }

    /**
     * 处理伤害事件
     *
     * @param event 事件参数
     */
    private handleDamage(event: DealDamageEvent) {
        switch (event.source) {
            case DamageUnit.ENEMY:
                this.player.hurt(event.damage);
                break;
            case DamageUnit.PLAYER:
                this.enemy.hurt(event.damage);
                break;
        }
    }

    /**
     * 敌人死亡
     *
     * @param enemy 敌人
     */
    private handleEnemyDie(enemy: EnemyController) {
        // 结算掉落物
        let dropList = enemy.dropList;
        if (ENEMY_RECORD.get(enemy.info.name)) {
            // 排除只掉落一次的掉落物
            dropList = dropList.filter(drop => !drop.once);
        }
        console.log(`drop list: ${JSON.stringify(dropList.map(drop => drop.item.name))}`);
        const productions = DropItemFactory.produce(dropList);
        EventCenter.emit(EventName.GET_DROPS, productions);

        // 结算经验
        EventCenter.emit(EventName.GET_EXPERIENCE, enemy.info.experience);

        // 增加击杀次数
        ENEMY_RECORD.set(enemy.info.name, (ENEMY_RECORD.get(enemy.info.name) ?? 0) + 1);
    }

    /**
     * 获取掉落物
     *
     * @param dropStackList 掉落道具列表
     */
    private getDrops(dropStackList: Array<ItemStack>) {
        Storehouse.putIn(dropStackList);
    }

    /**
     * 获取经验值
     *
     * @param experience 经验值
     */
    private getExperience(experience: number) {
        this.player.levelInfo.gainExperience(experience);
    }

    /**
     * 处理装备变更
     *
     * @param event 事件参数
     */
    private handleEquipmentChange(event: EquipmentChangeEvent) {
        if (event.equip) {
            if (!Storehouse.tackOutOne(event.equipment.name)) {
                return;
            }
            const unequipped = this.player.equipments.equip(event.equipment);
            EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
            if (unequipped) {
                Storehouse.putIn([new ItemStack(unequipped, 1)], false, false);
            }
        } else {
            if (!this.player.equipments.unequip(event.equipment.equipmentType)) {
                return;
            }
            EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
            Storehouse.putIn([new ItemStack(event.equipment, 1)], false, false);
        }
    }

    /**
     * 处理玩家升级事件
     *
     * @param level 新等级
     */
    private handlePlayerLevelUp(level: number) {
        this.player.attributes.levelUp(level);
        this.player.updateHealthBar();
        this.player.talents.levelUp(level);
        EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
        EventCenter.emit(EventName.UI_POST_MESSAGE, `等级提升：${level - 1} → ${level}`);
    }

    /**
     * 处理获得棍势事件
     *
     * @param stance 棍势值
     */
    private handleGainStance(stance: number) {
        this.player.skills.resources.stance += stance;
    }

    /**
     * 处理天赋升级事件
     *
     * @param talentTreeNode 天赋树节点
     */
    private handleTalentUpgrade(talentTreeNode: TalentTreeNode) {
        this.player.talents.upgradeTalent(talentTreeNode);
    }

    /**
     * 装备初始套装
     */
    private equipStarterSet() {
        this.player.equipments.equip(ITEM_TABLE.get('liu_mu_gun') as Equipment);
        this.player.equipments.equip(ITEM_TABLE.get('mian_bu_zha_wan') as Equipment);
        this.player.equipments.equip(ITEM_TABLE.get('hu_pi_qun') as Equipment);
        this.player.equipments.equip(ITEM_TABLE.get('mian_bu_tui_beng') as Equipment);
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
     *
     * 按钮触发
     */
    save() {
        this.saveData();
    }

    /**
     * 获取百戏套装与铜云棒
     *
     * 按钮触发
     */
    gift() {
        Storehouse.putIn([
            new ItemStack(ITEM_TABLE.get('tong_yun_bang'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_nuo_mian'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_chen_qian_yi'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_hu_shou'), 1),
            new ItemStack(ITEM_TABLE.get('bai_xi_diao_tui'), 1),
            new ItemStack(ITEM_TABLE.get('ru_yi_jin_gu_bang'), 1)
        ]);
    }
}
