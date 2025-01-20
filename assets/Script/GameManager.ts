import { _decorator, CCInteger, Component, director, sys } from 'cc';
import { SaveData } from "db://assets/Script/SaveData/SaveData";
import { LING_YUN_NAME, LocalStorageDataName, } from "db://assets/Script/Util/Constant";
import { EnemyController } from "db://assets/Script/Entity/Enemy/EnemyController";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
import { UpdateGameLevelEvent } from "db://assets/Script/Event/Events/UpdateGameLevelEvent";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { EquipEvent } from "db://assets/Script/Event/Events/EquipEvent";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { Unit, DealDamageEvent } from "db://assets/Script/Event/Events/DealDamageEvent";
import { AREA_TABLE, CHAPTER_TABLE, ITEM_META_TABLE, STAGE_TABLE } from "db://assets/Script/DataTable";
import { DropItemFactory } from "db://assets/Script/Drop/DropItemFactory";
import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { DefaultLevelName, Level } from "db://assets/Script/Level/Level";
import { EventName } from "db://assets/Script/Event/EventName";
import { ENEMY_RECORD } from "db://assets/Script/EnemyRecord/EnemyRecord";
import { UIPostMessageEvent } from "db://assets/Script/Event/Events/UIPostMessageEvent";
import { MessageType } from "db://assets/Script/UI/Message/MessageFactory";
import { Sellable } from "db://assets/Script/Sellable/Sellable";
import { ShopManager } from "db://assets/Script/Shop/ShopManager";
import { GameLevelUpdatedEvent } from "db://assets/Script/Event/Events/GameLevelUpdatedEvent";
import { ItemFactory } from "db://assets/Script/Item/ItemFactory";
import { PlayerDrinkEvent } from "db://assets/Script/Event/Events/PlayerDrinkEvent";

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
     * 自动保存间隔（秒）
     */
    @property({ type: CCInteger, displayName: '自动保存间隔（秒）' })
    autoSaveInterval: number = 5 * 60;

    /**
     * 自动存档回调
     */
    private _autoSaveCallback = () => this.saveData();

    onLoad() {
        // 监听处理事件
        EventCenter.on(EventName.DEAL_DAMAGE, this.node.name, (event: DealDamageEvent) => this.handleDealDamage(event));
        EventCenter.on(EventName.UPDATE_GAME_LEVEL, this.node.name, (event: UpdateGameLevelEvent) => this.handleUpdateGameLevel(event));
        EventCenter.on(EventName.EQUIP, this.node.name, (event: EquipEvent) => this.handleEquip(event));
        EventCenter.on(EventName.ENEMY_DIE, this.node.name, (enemy: EnemyController) => this.handleEnemyDie(enemy));
        EventCenter.on(EventName.GET_DROPS, this.node.name, (dropStackList: ItemStack[]) => this.handleGetDrops(dropStackList));
        EventCenter.on(EventName.GET_EXPERIENCE, this.node.name, (experience: number) => this.handleGetExperience(experience));
        EventCenter.on(EventName.PLAYER_LEVEL_UP, this.node.name, (level: number) => this.handlePlayerLevelUp(level));
        EventCenter.on(EventName.GAIN_STANCE, this.node.name, (stance: number) => this.handleGainStance(stance));
        EventCenter.on(EventName.TALENT_UPGRADE, this.node.name, (talentTreeNode: TalentTreeNode) => this.handleTalentUpgrade(talentTreeNode));
        EventCenter.on(EventName.SELL_ITEM, this.node.name, (stack: ItemStack) => this.handleSellItem(stack));
        EventCenter.on(EventName.PLAYER_DRINK, this.node.name, (event: PlayerDrinkEvent) => this.handlePlayerDrink(event));
    }

    start() {
        // 读取存档
        const saveData = this.loadSaveData();
        this.restorePlayerAndStorehouseData(saveData);
        this.restoreLevelAndEnemyData(saveData);
        this.restoreLedger(saveData);

        // 自动存档
        this.schedule(this._autoSaveCallback, this.autoSaveInterval);
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
        this.unschedule(this._autoSaveCallback);
    }

    /**
     * 恢复玩家与仓库数据
     *
     * @param saveData 存档数据
     */
    private restorePlayerAndStorehouseData(saveData: SaveData) {
        if (!saveData) {
            this.equipStarterSet();
            return;
        }

        this.player.levelInfo.restore(saveData.level, saveData.experience);
        saveData.equipmentSlot.forEach(slot => {
            this.player.equipments.equip(slot.stack);
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
     *
     * @param saveData 存档数据
     */
    private restoreLevelAndEnemyData(saveData: SaveData) {
        if (saveData) {
            Level.AREA = AREA_TABLE.get(saveData.areaName);
            Level.STAGE = STAGE_TABLE.get(saveData.stageName);
            Level.CHAPTER = CHAPTER_TABLE.get(saveData.chapterName);
            saveData.enemyRecord.forEach((value, key) => ENEMY_RECORD.set(key, value));
        } else {
            Level.CHAPTER = CHAPTER_TABLE.get(DefaultLevelName.CHAPTER);
            Level.AREA = AREA_TABLE.get(DefaultLevelName.AREA);
            Level.STAGE = STAGE_TABLE.get(DefaultLevelName.STAGE);
        }
        this.enemy.info = Level.STAGE.enemyInfo;

        EventCenter.emit(EventName.GAME_LEVEL_UPDATED, new GameLevelUpdatedEvent());
    }

    /**
     * 恢复账本数据
     *
     * @param saveData 存档数据
     */
    private restoreLedger(saveData: SaveData) {
        if (saveData) {
            ShopManager.LEDGER = saveData.ledger;
        }
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
        const saveData = new SaveData(this.player.levelInfo.level, this.player.levelInfo.experience, this.player.equipments.equipmentSlotMap, Storehouse.STOREHOUSE, Level.CHAPTER.name, Level.AREA.name, Level.STAGE.name, this.player.talents.talents, ENEMY_RECORD, ShopManager.LEDGER);
        sys.localStorage.setItem(LocalStorageDataName.SAVE_DATA, saveData.toJson());
        EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.DEFAULT, `保存成功`));
    }

    /**
     * 处理更新游戏关卡事件
     *
     * @param event 事件参数
     */
    private handleUpdateGameLevel(event: UpdateGameLevelEvent) {
        if (Level.CHAPTER === event.chapter && Level.AREA === event.area && Level.STAGE === event.stage) {
            return;
        }

        Level.CHAPTER = event.chapter;
        Level.AREA = event.area;
        Level.STAGE = event.stage;
        this.enemy.info = event.stage.enemyInfo;

        EventCenter.emit(EventName.GAME_LEVEL_UPDATED, new GameLevelUpdatedEvent());
    }

    /**
     * 处理伤害事件
     *
     * @param event 事件参数
     */
    private handleDealDamage(event: DealDamageEvent) {
        switch (event.source) {
            case Unit.ENEMY:
                this.player.hurt(event.damage);
                break;
            case Unit.PLAYER:
                this.enemy.hurt(event.damage);
                break;
        }
    }

    /**
     * 处理敌人死亡时间
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
        const drops = DropItemFactory.drop(dropList);
        EventCenter.emit(EventName.GET_DROPS, drops);

        // 结算经验
        EventCenter.emit(EventName.GET_EXPERIENCE, enemy.info.experience);

        // 增加击杀次数
        ENEMY_RECORD.set(enemy.info.name, (ENEMY_RECORD.get(enemy.info.name) ?? 0) + 1);
    }

    /**
     * 处理获取掉落物事件
     *
     * @param dropStackList 掉落道具列表
     */
    private handleGetDrops(dropStackList: ItemStack[]) {
        Storehouse.putIn(dropStackList);
    }

    /**
     *  处理获取经验值事件
     *
     * @param experience 经验值
     */
    private handleGetExperience(experience: number) {
        this.player.levelInfo.gainExperience(experience);
    }

    /**
     * 处理装备变更
     *
     * @param event 事件参数
     */
    private handleEquip(event: EquipEvent) {
        const equipment = event.equipmentStack.item as Equipment;
        if (event.equip) {
            if (!Storehouse.takeOutOne(equipment.name)) {
                return;
            }
            const unequipped = this.player.equipments.equip(ItemFactory.itemStack(equipment, 1));
            EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
            if (unequipped) {
                Storehouse.putIn([unequipped], false, false);
            }
        } else {
            if (!this.player.equipments.unequip(equipment.equipmentType)) {
                return;
            }
            EventCenter.emit(EventName.UI_UPDATE_ATTRIBUTE_PANEL, this.player.attributes);
            Storehouse.putIn([event.equipmentStack], false, false);
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
        EventCenter.emit(EventName.UI_POST_MESSAGE, new UIPostMessageEvent(MessageType.LEVEL_UP, level));
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
     * 处理出售物品事件
     *
     * @param stack 物品堆叠
     */
    private handleSellItem(stack: ItemStack) {
        const sellable = stack.item as Sellable;
        const price = sellable.price * stack.count;
        Storehouse.takeOut([stack]);
        Storehouse.putIn([ItemFactory.itemStack(LING_YUN_NAME, price)], false);
    }

    /**
     * 处理玩家饮酒事件
     *
     * @param event 事件参数
     */
    private handlePlayerDrink(event: PlayerDrinkEvent) {
        this.player.recover(event.healthRecoverRatio);
    }

    /**
     * 装备初始套装
     */
    private equipStarterSet() {
        this.player.equipments.equip(ItemFactory.itemStack('liu_mu_gun', 1));
        this.player.equipments.equip(ItemFactory.itemStack('mian_bu_zha_wan', 1));
        this.player.equipments.equip(ItemFactory.itemStack('hu_pi_qun', 1));
        this.player.equipments.equip(ItemFactory.itemStack('mian_bu_tui_beng', 1));
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
            ItemFactory.itemStack(ITEM_META_TABLE.get('tong_yun_bang'), 1),
            ItemFactory.itemStack(ITEM_META_TABLE.get('bai_xi_nuo_mian'), 1),
            ItemFactory.itemStack(ITEM_META_TABLE.get('bai_xi_chen_qian_yi'), 1),
            ItemFactory.itemStack(ITEM_META_TABLE.get('bai_xi_hu_shou'), 1),
            ItemFactory.itemStack(ITEM_META_TABLE.get('bai_xi_diao_tui'), 1),
            ItemFactory.itemStack(ITEM_META_TABLE.get('ru_yi_jin_gu_bang'), 1)
        ]);
    }
}
