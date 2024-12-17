import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { Runnable } from "db://assets/Script/Util/Functions";

/**
 * 技能
 */
export abstract class Skill {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 描述
     */
    readonly description: string;

    /**
     * 冷却时间（秒）
     */
    readonly cooldown: number;

    /**
     * 触发
     */
    protected abstract trigger(): void;

    /**
     * 消耗
     */
    protected abstract cost(): boolean;

    /**
     * 玩家角色
     */
    protected readonly player: PlayerController;

    /**
     * 计时器
     */
    protected timer: number;

    /**
     * 技能事件
     */
    protected events: Array<Runnable>;

    protected constructor(name: string, displayName: string, description: string, cooldown: number) {
        this.player = PlayerController.PLAYER;
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.cooldown = cooldown;
        this.timer = 0;
        this.events = new Array<Runnable>();
    }

    /**
     * 更新
     *
     * @param deltaTime 时间增量
     */
    update(deltaTime: number) {
        if (this.timer < this.cooldown) {
            this.timer += deltaTime;
        } else if (this.cost()) {
            this.timer = 0;
            this.trigger();
        }
    }

    /**
     * 触发事件
     *
     * @param eventIndex 事件索引
     */
    triggerEvent(eventIndex: number) {
        this.events[eventIndex]();
    }
}