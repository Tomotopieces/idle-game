import { Talent } from "db://assets/Script/Talent/Talent";

/**
 * 天赋.本事.根基.体健
 *
 * 每级少许增加普通攻击的攻击速度
 */
export class TalentTiJian extends Talent {
    static readonly NAME = 'ti_jian';
    static readonly DISPLAY_NAME = '体健';
    static readonly REQUIREMENT = 1;
    static readonly MAX_LEVEL = 2;

    constructor() {
        super(TalentTiJian.NAME, TalentTiJian.DISPLAY_NAME, TalentTiJian.REQUIREMENT, TalentTiJian.MAX_LEVEL);
    }

    protected activateEffect(): void {
        // TODO 实现效果
    }

    protected deactivateEffect(): void {
        // TODO 实现效果
    }
}