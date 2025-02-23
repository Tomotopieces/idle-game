import { ALWAYS_TRUE, Predicate } from "db://assets/Script/Util/Functions";
import { Talent } from "db://assets/Script/Talent/Talent";
import { TALENT_TREE } from "db://assets/Script/DataTable";

/**
 * 天赋树节点
 *
 * 管理天赋解锁逻辑
 */
export class TalentTreeNode {
    /**
     * 天赋
     */
    readonly talent: Talent;

    /**
     * 前置条件
     */
    readonly prerequisite: Predicate<void>;

    /**
     * 前置天赋
     */
    readonly parents: string[];

    /**
     * 后置天赋
     */
    readonly children: string[];

    /**
     * 是否自动解锁
     */
    readonly autoUnlock: boolean;

    /**
     * 是否自动激活
     */
    readonly autoActivate: boolean;

    /**
     * 是否锁定
     */
    private _locked: boolean;

    /**
     * 构造函数
     *
     * @param talent       天赋
     * @param prerequisite 前置条件
     * @param parents      前置天赋
     * @param autoActivate 自动激活
     * @param autoUnlock   自动解锁
     */
    constructor(talent: Talent, prerequisite: Predicate<void>, parents: string[], autoActivate: boolean, autoUnlock: boolean) {
        this.talent = talent;
        this.prerequisite = prerequisite ?? ALWAYS_TRUE;
        this.parents = parents ?? [];
        this.children = [];
        this.autoActivate = autoActivate;
        this.autoUnlock = autoUnlock;
        this._locked = !autoUnlock;
    }

    /**
     * 锁定
     */
    lock(): void {
        if (this._locked || (this.allParentsActivated() && this.prerequisite())) {
            return;
        }
        this._locked = true;
    }

    /**
     * 解锁
     */
    unlock(): void {
        if (!this._locked || !this.allParentsActivated() || !this.prerequisite()) {
            return;
        }

        this._locked = false;
        if (this.autoActivate) {
            this.activate(this.talent.maxLevel);
        }
    }

    /**
     * 激活
     *
     * @param level 激活等级
     */
    activate(level: number): void {
        level = Math.min(level, this.talent.maxLevel);

        if (!level) {
            if (this.hasChildActivated()) {
                // 有激活的子天赋的情况下无法取消当前天赋
                return;
            }
            this.children.forEach(child => TALENT_TREE.get(child).lock());
        }

        const lastLevel = this.talent.level;
        const success = this.talent.activate(level);
        if (!lastLevel && success) {
            // 激活后尝试解锁子天赋
            this.children.forEach(child => TALENT_TREE.get(child).unlock());
        }
    }

    /**
     * 是否已激活
     *
     * @return 是否已激活
     */
    activated(): boolean {
        return this.talent.level > 0;
    }

    /**
     * 是否已达到最大激活等级
     */
    maxActivated(): boolean {
        return this.talent.level === this.talent.maxLevel;
    }

    /**
     * 强制锁定天赋
     *
     * 天赋重修用
     */
    forceLock(): void {
        this.talent.activate(0);
        this._locked = !this.autoUnlock;
    }

    /**
     * 检测前置天赋是否已全部激活
     *
     * @return 是否已全部激活
     */
    private allParentsActivated(): boolean {
        return this.parents.length ? this.parents.every(parent => TALENT_TREE.get(parent).activated()) : true;
    }

    /**
     * 是否有子天赋已激活
     *
     * @return 是否有子天赋已激活
     */
    private hasChildActivated(): boolean {
        return this.children.some(child => TALENT_TREE.get(child).activated());
    }

    get locked(): boolean {
        return this._locked;
    }
}