import {randomInt} from "@/utils/random-int/random-int.util";
import {computed, ref} from "vue";

export const useRandomInt = (minValue: number, maxValue: number) => {
    const min = ref<number>(minValue);
    const max = ref<number>(maxValue);

    const resultValue = ref<number>(randomInt(min.value, max.value));

    const result = computed(() => resultValue.value);

    const generate = () => {
        resultValue.value = randomInt(min.value, max.value);
    }

    return {
        min,
        max,
        result,
        generate,
    }
}