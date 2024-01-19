import {ref, computed} from 'vue'
import type { ComputedRef, Ref } from "@vue/reactivity";
import { defineStore } from 'pinia'
import Phaser from "phaser";
import {useGameScenesArray} from "@/game/scenes";

type MountHook = () => any;
type MountEngineHook = (engine: Phaser.Game) => any;

export const useGameEngineStore = defineStore('game', () => {
    const gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        fps: {
            min: 30,
            target: 60,
            limit: 120,
        },
        mode: Phaser.Scale.RESIZE,
        parent: 'canvas',
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
            },
        },
        scene: useGameScenesArray(),
    }

    const onMountedHooks = ref<Array<MountEngineHook>>([]);
    const onBeforeMountedHooks = ref<Array<MountHook>>([]);
    const onUnmountedHooks = ref<Array<MountHook>>([]);
    const onBeforeUnmountedHooks = ref<Array<MountEngineHook>>([]);

    const _engine = ref<Phaser.Game>();
    const isMounted = computed(() => _engine.value !== undefined);

    const mount = async () => {
        if (!isMounted.value) {
            for (const hook of onBeforeMountedHooks.value) {
                await hook.apply(undefined);
            }

            _engine.value = new Phaser.Game(gameConfig);

            for (const hook of onMountedHooks.value) {
                await hook.apply(undefined, [_engine.value]);
            }
        }
    }

    const unmount = async () => {
        if (isMounted.value) {
            for (const hook of onBeforeUnmountedHooks.value) {
                await hook.apply(undefined, [_engine.value!]);
            }

            _engine.value?.destroy(true, false);
            _engine.value = undefined;

            for (const hook of onUnmountedHooks.value) {
                await hook.apply(undefined);
            }
        }
    }

    const resize = () => {
        if (typeof gameConfig?.parent === "string") {
            const canvas = document.querySelector(`#${gameConfig?.parent} canvas`) as HTMLCanvasElement;

            // canvas.width = window.innerWidth;
            // canvas.height = window.innerHeight;

            //_engine.value?.scale.resize(window.innerWidth, window.innerHeight);
            _engine.value?.scale.setGameSize(window.innerWidth, window.innerHeight);
        }
    }

    const onMounted = (hook: MountEngineHook) => {
        onMountedHooks.value.push(hook);
    }

    const onUnmounted = (hook: MountHook) => {
        onUnmountedHooks.value.push(hook);
    }

    const onBeforeMounted = (hook: MountHook) => {
        onBeforeMountedHooks.value.push(hook);
    }

    const onBeforeUnmounted = (hook: MountEngineHook) => {
        onBeforeUnmountedHooks.value.push(hook);
    }

    return {
        gameConfig,
        isMounted,
        mount,
        unmount,
        resize,
        onMounted,
        onUnmounted,
        onBeforeMounted,
        onBeforeUnmounted,
        engine: computed(() => _engine.value) as ComputedRef<Phaser.Game>,
    };
});