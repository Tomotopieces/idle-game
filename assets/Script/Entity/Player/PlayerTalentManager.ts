import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";
import { TALENT_TREE } from "db://assets/Script/DataTable";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";

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
     * 记录等级，用于计算灵光点数
     */
    private _recordLevel: number;

    /**
     * 初始化
     */
    init() {
        this._recordLevel = this._sparks = PlayerController.PLAYER.levelInfo.level;
    }

    /**
     * 消耗灵光点数
     *
     * @param cost 消耗数量
     */
    costSparks(cost: number): boolean {
        if (this._sparks < cost) {
            return false;
        }

        this.sparks -= cost;
        return true;
    }

    /**
     * 升级获得灵光点数
     *
     * @param level 新等级
     */
    levelUp(level: number) {
        this.sparks += (level - this._recordLevel);
        this._recordLevel = level;
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
        }

        talentTreeNode.activate(talentTreeNode.talent.level + 1);
        this._talents.set(talentTreeNode.talent.name, talentTreeNode.talent.level);
    }

    /**
     * 天赋重修
     */
    rebuild() {
        this._talents = new Map<string, number>();
        this._sparks = PlayerController.PLAYER.levelInfo.level;

        Array.from(TALENT_TREE.values()).reverse().forEach(node => {
            node.forceLock();
            EventCenter.emit(EventName.UI_UPDATE_TALENT_SLOT, node);
        });
        EventCenter.emit(EventName.UI_UPDATE_SPARKS, this._sparks);
    }

    get talents(): Map<string, number> {
        return this._talents;
    }

    get sparks(): number {
        return this._sparks;
    }

    set sparks(value: number) {
        this._sparks = value;
        EventCenter.emit(EventName.UI_UPDATE_SPARKS, this._sparks);
    }

    /**
     * 恢复天赋加点
     *
     * @param talents 天赋加点
     */
    restore(talents: Map<string, number>) {
        this._recordLevel = this._sparks = PlayerController.PLAYER.levelInfo.level;
        EventCenter.emit(EventName.UI_UPDATE_SPARKS, this._sparks);

        if (!talents.size) {
            return;
        }
        this._talents = talents;

        talents.forEach((level, name) => {
            const talentTreeNode = TALENT_TREE.get(name);
            talentTreeNode.activate(level);
            EventCenter.emit(EventName.UI_UPDATE_TALENT_SLOT, talentTreeNode);
        });
    }
}