import { Talent } from "db://assets/Script/Talent/Talent";

/**
 * 天赋.本事.棍法.识破
 *
 * 若敌人攻击命中时，玩家正在进行轻棍攻击，且重棍已就绪，则打出重棍。识破后，本次重棍期间玩家无敌。
 *
 * TODO 完善
 */
export class TalentShiPo extends Talent {
    static readonly NAME = "shi_po";
    static readonly DISPLAY_NAME = "识破";
    static readonly DESCRIPTION = "识破";
    static readonly REQUIREMENT = 1;
    static readonly MAX_LEVEL = 1;

    constructor() {
        super(TalentShiPo.NAME, TalentShiPo.DISPLAY_NAME, TalentShiPo.DESCRIPTION, TalentShiPo.REQUIREMENT, TalentShiPo.MAX_LEVEL);
    }

    protected activateEffect(): void {
        throw new Error("Method not implemented.");
    }

    protected deactivateEffect(): void {
        throw new Error("Method not implemented.");
    }

}