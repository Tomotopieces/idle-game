import { _decorator, Animation, CCFloat, Component, ProgressBar, Sprite, SpriteFrame } from 'cc';
import { DropItem } from "db://assets/Script/Drop/DropItem";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { ResourceManager, ResourceType } from "db://assets/Script/ResourceManager";
import { EnemyAttributeComponent } from "db://assets/Script/Entity/Enemy/EnemyAttributeComponent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { DamageUnit, DealDamageEvent } from "db://assets/Script/Event/Events/DealDamageEvent";
import { EventName } from "db://assets/Script/Event/EventName";

const { ccclass, property } = _decorator;

/**
 * 敌人控制器
 */
@ccclass('EnemyController')
export abstract class EnemyController extends Component {
    static ENEMY: EnemyController;

    /**
     * 攻击间隔（秒）
     */
    @property({ type: CCFloat, tooltip: '攻击间隔（秒）' })
    attackInterval: number = 1;

    /**
     * 血条
     */
    private _healthBar: ProgressBar;

    /**
     * 贴图
     */
    private _sprite: Sprite;

    /**
     * 动画机
     */
    private _anim: Animation;

    /**
     * 基本信息
     */
    private _info: EnemyInfo = null;

    /**
     * 自动攻击计时器
     */
    private _autoAttackTimer: number = 0;

    /**
     * 实体组件
     */
    private _attributes: EnemyAttributeComponent;

    onLoad() {
        EnemyController.ENEMY = this;
        this._healthBar = this.node.getChildByName('HealthBar').getComponent(ProgressBar);
        this._sprite = this.node.getChildByName('Sprite').getComponent(Sprite);
        this._anim = this.getComponent(Animation);
    }

    update(dt: number) {
        this.autoAttack(dt);
    }

    /**
     * 受伤
     *
     * @param damage 伤害值
     */
    hurt(damage: number) {
        this._attributes.getHurt(damage);
        this.updateHealthBar();

        if (this._attributes.health === 0) {
            this.onDie();
        }
    }

    /**
     * 造成伤害
     *
     * 动画帧事件触发
     */
    makeDamage() {
        EventCenter.emit(EventName.DEAL_DAMAGE, new DealDamageEvent(DamageUnit.ENEMY, DamageUnit.PLAYER, this._attributes.finalDamage()));
    }

    /**
     * 获取掉落奖励
     */
    get dropList(): DropItem[] {
        return this._info.dropList;
    }

    /**
     * 获取敌人信息
     */
    get info(): EnemyInfo {
        return this._info;
    }

    /**
     * 设置敌人信息
     *
     * @param value 敌人信息
     */
    set info(value: EnemyInfo) {
        this._info = value;
        this.init();
    }

    /**
     * 初始化基础数据
     */
    private init() {
        this._attributes = new EnemyAttributeComponent(this._info);
        ResourceManager.loadAsset(ResourceType.SPRITE_FRAME, this._info.icon, (spriteFrame: SpriteFrame) =>
            this._sprite.spriteFrame = spriteFrame);
        this.updateHealthBar();
    }

    /**
     * 自动攻击
     *
     * @param dt 时间间隔
     */
    private autoAttack(dt: number) {
        this._autoAttackTimer += dt;

        if (this._autoAttackTimer >= this.attackInterval) {
            this.attack();
            this._autoAttackTimer -= this.attackInterval;
        }
    }

    /**
     * 攻击
     */
    private attack() {
        this._anim.play('Attack');
    }

    /**
     * 更新血条显示
     */
    private updateHealthBar() {
        this._healthBar.progress = this._attributes.health / this._attributes.maxHealth;
    }

    /**
     * 死亡
     */
    private onDie() {
        this._anim.play('Die');
        this._autoAttackTimer = 0;
        this.init();
        EventCenter.emit(EventName.ENEMY_DIE, this);
    }

    get attributes(): EnemyAttributeComponent {
        return this._attributes;
    }
}
