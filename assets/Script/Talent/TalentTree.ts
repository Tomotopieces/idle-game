import { ALWAYS_TRUE, Predicate } from "db://assets/Script/Util/Functions";
import { Talent } from "db://assets/Script/Talent/Talent";

/**
 * 天赋树
 */
export const TALENT_TREE = new Map<string, TalentTreeNode>();

/**
 * 天赋树节点
 *
 * 管理天赋解锁逻辑
 */
export class TalentTreeNode {
    /**
     * 天赋名称
     */
    readonly talent: Talent;

    /**
     * 前置天赋
     */
    readonly parents: Array<string>;

    /**
     * 前置条件
     */
    readonly prerequisite: Predicate<void>;

    /**
     * 后置天赋
     */
    readonly children: Array<string>;

    /**
     * 是否自动激活
     */
    readonly autoActivate: boolean;

    /**
     * 是否锁定
     */
    private _locked: boolean;

    constructor(talent: Talent, prerequisite: Predicate<void>, autoActivate: boolean) {
        this.talent = talent;
        this.parents = new Array<string>();
        this.prerequisite = prerequisite ?? ALWAYS_TRUE;
        this.children = new Array<string>();
        this.autoActivate = autoActivate;
        this._locked = true;
    }

    get locked(): boolean {
        return this._locked;
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
        if (this._locked || this.talent.level === level) {
            return;
        }

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
}