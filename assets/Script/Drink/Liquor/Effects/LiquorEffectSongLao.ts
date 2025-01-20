import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";
import { PlayerController } from "db://assets/Script/Entity/Player/PlayerController";

/**
 * 松醪效果
 *
 * 每饮一口，恢复当前上限三成半的生命；生命过半时饮酒，还会获得75棍势
 */
export class LiquorEffectSongLao extends UniqueUtility {
    static readonly NAME: string = `song_lao`;
    static readonly DESCRIPTION: string = `每饮一口，恢复当前上限三成半的生命；生命过半时饮酒，还会获得一定棍势`;

    constructor() {
        super(LiquorEffectSongLao.NAME, LiquorEffectSongLao.DESCRIPTION);
    }

    onActivate(): void {
        const player = PlayerController.PLAYER;
        if (player.attributes.health >= player.attributes.finalHealth() / 2) {
            player.skills.resources.stance += 75;
        }
    }

    onDeactivate(): void {
    }
}
