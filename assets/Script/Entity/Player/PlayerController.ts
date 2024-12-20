import { _decorator, Component, ProgressBar } from 'cc';
import { PlayerAttributeComponent } from "db://assets/Script/Entity/Player/PlayerAttributeComponent";
import { PlayerLevelComponent } from "db://assets/Script/Entity/Player/PlayerLevelComponent";
import { PlayerEquipmentComponent } from "db://assets/Script/Entity/Player/PlayerEquipmentComponent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { PlayerSkillManager } from "db://assets/Script/Entity/Player/PlayerSkillManager";
import { SkillLightAttack } from "db://assets/Script/Skill/Skills/SkillLightAttack";
import { PlayerTalentManager } from "db://assets/Script/Entity/Player/PlayerTalentManager";
import { EventName } from "db://assets/Script/Event/EventName";
import { SkillHeavyAttack } from "db://assets/Script/Skill/Skills/SkillHeavyAttack";

const { ccclass, property } = _decorator;

/**
 * 玩家控制器
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    static PLAYER: PlayerController;

    /**
     * 血条
     */
    @property({ type: ProgressBar, tooltip: '血条' })
    healthBar!: ProgressBar;

    /**
     * 属性信息
     */
    readonly attributes: PlayerAttributeComponent = new PlayerAttributeComponent();

    /**
     * 等级信息
     */
    readonly levelInfo: PlayerLevelComponent = new PlayerLevelComponent();

    /**
     * 装备信息
     */
    readonly equipments: PlayerEquipmentComponent = new PlayerEquipmentComponent(this.attributes);

    /**
     * 技能管理器
     */
    readonly skills: PlayerSkillManager = new PlayerSkillManager();

    /**
     * 天赋管理器
     */
    readonly talents: PlayerTalentManager = new PlayerTalentManager();

    onLoad() {
        PlayerController.PLAYER = this;
    }

    update(dt: number) {
        this.skills.update(dt);
    }

    /**
     * 初始化基础数据
     */
    init() {
        this.updateHealthBar();
        this.skills.addSkill(new SkillLightAttack());
        this.skills.addSkill(new SkillHeavyAttack());
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
     * 更新血条显示
     */
    updateHealthBar() {
        this.healthBar.progress = this.attributes.health / this.attributes.finalHealth();
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
}
