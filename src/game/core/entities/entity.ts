import Phaser from 'phaser';
import {useUtils} from "@/utils";
import type { IDestroyable } from "@/game/core/types/destroyable.interface";
import EventEmitter from "@/game/core/types/event-emitter";

abstract class GEntity<T = any> extends EventEmitter implements IDestroyable {
    protected readonly scene: Phaser.Scene;
    protected readonly utils = useUtils();

    protected constructor(scene: Phaser.Scene) {
        super();
        this.scene = scene;
    }

    abstract preload(): void;
    abstract create(): void;
    abstract update(time: number, delta: number): void;
    abstract destroy(): void;

    abstract getPhaserInstance(): T;
}

export default GEntity;