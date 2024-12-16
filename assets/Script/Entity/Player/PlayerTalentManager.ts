import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";

/**
 * 玩家天赋管理器
 */
export class PlayerTalentManager {
    /**
     * 天赋等级记录
     */
    private _talents = new Map<string, number>();

    /**
     * 灵光点数
     */
    private _sparks: number;

    /**
     * 消耗灵光点数
     *
     * @param cost 消耗数量
     */
    costSparks(cost: number): boolean {
        if (this._sparks < cost) {
            return false;
        }

        this._sparks -= cost;
        return true;
    }

    /**
     * 升级天赋
     *
     * @param talentTreeNode 天赋节点
     */
    upgradeTalent(talentTreeNode: TalentTreeNode) {
        if (talentTreeNode.locked || talentTreeNode.maxActivated()) {
            // 未解锁或已满级
            return;
        } else if (!this.costSparks(talentTreeNode.talent.requirement)) {
            // 灵光点不足
            return;
        }

        talentTreeNode.activate(talentTreeNode.talent.level + 1);
        this._talents.set(talentTreeNode.talent.name, talentTreeNode.talent.level);
    }

    /**
     * 天赋重修
     */
    rebuild() {
        // TODO 天赋重修

        this._talents = new Map<string, number>();
    }

    get talents(): Map<string, number> {
        return this._talents;
    }

    get sparks(): number {
        return this._sparks;
    }
}