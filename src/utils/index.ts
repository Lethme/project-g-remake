import { env } from "@/utils/env";
import { randomInt } from "@/utils/random-int";

export const useUtils = () => {
    return {
        env,
        randomInt,
    }
}