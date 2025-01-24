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
import { DrinkManager } from "db://assets/Script/Entity/Player/DrinkManager";
import { BuffManager } from "db://assets/Script/Buff/BuffManager";

const { ccclass } = _decorator;

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
    readonly drink: DrinkManager = new DrinkManager();

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
        this.skills.update(dt);
        this.buffs.update(dt);
        this.drink.update(dt);
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
        this.attributes.getHurt(damage);
        this.updateHealthBar();

        if (this.attributes.health === 0) {
            EventCenter.emit(EventName.PLAYER_DIE, this);
            // TODO 复活
        }
    }

    /**
     * 恢复血量
     *
     * @param value 恢复值，准确值(1, )或百分比值(0, 1]
     */
    recover(value: number) {
        this.attributes.health += (value > 1 ? value : value * this.attributes.finalHealth());
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
