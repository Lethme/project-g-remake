export type ReturnTypeOf<T, TKey extends keyof T> = TKey extends string
    ? T[TKey] extends (...args: any) => any
        ? ReturnType<T[TKey]>
        : never
    : never;