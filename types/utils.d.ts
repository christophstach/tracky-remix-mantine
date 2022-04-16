type SwapDatesWithStrings<T> = {
    [k in keyof (T)]: (T[k] extends Date ? string : T[k]);
};

type UnArray<T> = T extends Array<infer U> ? U : T;
type InferDataFunction<T extends (...args: any) => any> =
    SwapDatesWithStrings<NonNullable<Required<Exclude<Awaited<ReturnType<T>>, Response>>>>;
