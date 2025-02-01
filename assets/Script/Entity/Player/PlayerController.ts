import { _decorator, Animation, Component, ProgressBar } from 'cc';
import { PlayerAttributeManager } from "db://assets/Script/Entity/Player/PlayerAttributeManager";
import { PlayerLevelManager } from "db://assets/Script/Entity/Player/PlayerLevelManager";
import { PlayerEquipmentManager } from "db://assets/Script/Entity/Player/PlayerEquipmentManager";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { PlayerSkillManager } from "db://assets/Script/Entity/Player/PlayerSkillManager";
import { SkillLightAttack } from "db://assets/Script/Skill/Skills/SkillLightAttack";
import { PlayerTalentManager } from "db://assets/Script/Entity/Player/PlayerTalentManager";
import { EventName } from "db://assets/Script/Event/EventName";
import { SkillHeavyAttack } from "db://assets/Script/Skill/Skills/SkillHeavyAttack";
import { BuffManager } from "db://assets/Script/Buff/BuffManager";
import { PlayerDrinkManager } from "db://assets/Script/Entity/Player/PlayerDrinkManager";
import { Level } from "db://assets/Script/Level/Level";
import { UpdateGameLevelEvent } from "db://assets/Script/Event/Events/UpdateGameLevelEvent";

const { ccclass } = _decorator;

/**
 * 玩家状态
 */
export enum PlayerState {
    /**
     * 存活
     */
    ALIVE,

    /**
     * 死亡
     */
    DEAD,
}

/**
 * 玩家控制器
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    static PLAYER: PlayerController;

    /**
     * 属性信息
     */
    readonly attributes: PlayerAttributeManager = new PlayerAttributeManager();

    /**
     * 等级信息
     */
    readonly levelInfo: PlayerLevelManager = new PlayerLevelManager();

    /**
     * 装备信息
     */
    readonly equipments: PlayerEquipmentManager = new PlayerEquipmentManager(this.attributes);

    /**
     * 葫芦管理
     */
    readonly drink: PlayerDrinkManager = new PlayerDrinkManager();

    /**
     * 技能管理器
     */
    readonly skills: PlayerSkillManager = new PlayerSkillManager();

    /**
     * 天赋管理器
     */
    readonly talents: PlayerTalentManager = new PlayerTalentManager();

    /**
     * buff管理器
     */
    readonly buffs: BuffManager = new BuffManager();

    /**
     * 状态
     */
    private _state: PlayerState = PlayerState.ALIVE;

    /**
     * 血条UI
     */
    private _healthBar: ProgressBar;

    /**
     * 动画机
     */
    private _anim: Animation;

    onLoad() {
        PlayerController.PLAYER = this;
        this._healthBar = this.node.getChildByName('HealthBar').getComponent(ProgressBar);
        this._anim = this.getComponent(Animation);
        this.init();
    }

    update(dt: number) {
        switch (this._state) {
            case PlayerState.ALIVE:
                this.skills.update(dt);
                this.buffs.update(dt);
                this.drink.update(dt);
                break;
            case PlayerState.DEAD:
                break;
        }
    }

    /**
     * 初始化基础数据
     */
    init() {
        this.updateHealthBar();
        this.skills.addSkill(new SkillLightAttack());
        this.skills.addSkill(new SkillHeavyAttack());
        this.talents.init();
    }

    /**
     * 受伤
     *
     * @param damage 伤害值
     */
    hurt(damage: number) {
        if (this._state === PlayerState.DEAD) {
            return; // 死亡后不计算伤害
        }

        this.attributes.getHurt(damage);
        this.updateHealthBar();

        if (this.attributes.health === 0) {
            this.die();
        }
    }

    /**
     * 死亡
     */
    die() {
        this._state = PlayerState.DEAD; // 设置状态

        // 切换stage到当前character的第一个stage
        const stage = Level.firstStageOf(Level.firstAreaOf(Level.CHAPTER));
        EventCenter.emit(EventName.UPDATE_GAME_LEVEL, new UpdateGameLevelEvent(stage));

        this._anim.play('Die'); // 播放动画

        EventCenter.emit(EventName.PLAYER_DIE, this);
    }

    /**
     * 点击
     *
     * 存活时：无效果
     * 死亡时：每次点击时恢复35%血量，恢复满后复活
     *
     * 按钮触发
     */
    click() {
        switch (this._state) {
            case PlayerState.ALIVE:
                break;
            case PlayerState.DEAD:
                this.recover(0.35);
                if (this.attributes.health === this.attributes.finalHealth()) {
                    this._anim.play('Idle'); // 恢复贴图姿态
                    this._state = PlayerState.ALIVE;
                }
                break;
        }
    }

    /**
     * 恢复血量
     *
     * @param value 恢复值，准确值(1, +∞)或百分比值(0, 1]
     */
    recover(value: number) {
        this.attributes.health += (value > 1 ? value : value * this.attributes.finalHealth());
        this.updateHealthBar();
    }

    /**
     * 更新血条显示
     */
    updateHealthBar() {
        this._healthBar.progress = this.attributes.health / this.attributes.finalHealth();
    }

    /**
     * 技能动画事件
     *
     * 动画帧触发
     *
     * @param skillName  技能名称名称
     * @param eventIndex 事件索引
     */
    skillAnimEvent(skillName: string, eventIndex: number) {
        this.skills.triggerEvent(skillName, eventIndex);
    }

    get anim(): Animation {
        return this._anim;
    }
}
