import Phaser from "phaser";
import {GPlayerControls} from "@/game/core/entities/player/types";

type HookReturnType = ReturnType<typeof usePlayerControls>;

export type Controls = {
    [key in keyof typeof GPlayerControls]: Phaser.Input.Keyboard.Key
};

export function usePlayerControls(scene: Phaser.Scene, callback?: (result: HookReturnType) => void) {
    const cursors = scene.input.keyboard?.createCursorKeys()!;

    const controlsKeys: Controls = scene.input.keyboard?.addKeys({
        W: "W",
        D: "D",
        S: "S",
        A: "A",
        SPACE: "Space",
    }) as any;

    const result = {
        cursors,
        controlsKeys,
    }

    callback && callback.call(null, result);

    return result;
}