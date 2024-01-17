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
        parent: 'canvas',
        width: 1920,
        height: 1000,
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
                hook.apply(undefined);
            }

            _engine.value = new Phaser.Game(gameConfig);

            for (const hook of onMountedHooks.value) {
                hook.apply(undefined, [_engine.value]);
            }
        }
    }

    const unmount = async () => {
        if (isMounted.value) {
            for (const hook of onBeforeUnmountedHooks.value) {
                hook.apply(undefined, [_engine.value!]);
            }

            _engine.value?.destroy(true, false);
            _engine.value = undefined;

            for (const hook of onUnmountedHooks.value) {
                hook.apply(undefined);
            }
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
        onMounted,
        onUnmounted,
        onBeforeMounted,
        onBeforeUnmounted,
        engine: computed(() => _engine.value) as ComputedRef<Phaser.Game>,
    };
});