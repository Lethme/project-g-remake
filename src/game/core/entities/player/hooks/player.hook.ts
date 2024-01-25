import {GPlayerSpritesheet} from "@/game/core/entities/player/types";
import Phaser from "phaser";
import {usePlayerAnimations} from "@/game/core/entities/player/hooks/animations.hook";
import {usePlayerControls} from "@/game/core/entities/player/hooks/controls.hook";

type HookReturnType = ReturnType<typeof usePlayer>;

export function usePlayer(scene: Phaser.Scene, callback?: (result: HookReturnType) => void) {
    const animations = usePlayerAnimations(scene);
    const controls = usePlayerControls(scene);

    const player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = scene.physics.add.sprite(100, 1000, GPlayerSpritesheet.MOVING_RIGHT).setScale(2, 2).play(GPlayerSpritesheet.MOVING_RIGHT);
    player.body.setGravityY(2000);
    player.body.setCollideWorldBounds(true);

    const result = {
        player,
        animations,
        controls,
    }

    callback && callback.call(null, result);

    return result;
}