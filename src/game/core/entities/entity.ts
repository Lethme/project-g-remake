import Phaser from 'phaser';
import {useUtils} from "@/utils";
import type { IDestroyable } from "@/game/core/types/destroyable.interface";

abstract class GEntity<T = any> implements IDestroyable {
    protected readonly scene: Phaser.Scene;
    protected readonly utils = useUtils();

    protected constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    abstract preload(): void;
    abstract create(): void;
    abstract update(time: number, delta: number): void;
    abstract destroy(): void;

    abstract getPhaserInstance(): T;
}

export default GEntity;