import HelloWorldScene from "@/game/scenes/hello-world-scene";

export const useGameScenes = () => {
    return {
        HelloWorldScene
    }
}

export const useGameScenesArray = () => {
    return [
        HelloWorldScene
    ]
}