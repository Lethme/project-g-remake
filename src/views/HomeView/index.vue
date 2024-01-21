<template>
    <!-- Game canvas should be mounted here -->
    <div id="canvas" />
</template>

<script setup lang="ts">
import {useGameEngineStore} from "@/stores/game-engine";
import {onMounted, onUnmounted} from "vue";
import {useUtils} from "@/utils";

const { env } = useUtils();
const game = useGameEngineStore();

onMounted(async () => {
    await game.mount();
});

onUnmounted(async () => {
    await game.unmount();
});
</script>

<style scoped lang="less">

</style>