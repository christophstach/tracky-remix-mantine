type UnArray<T> = T extends Array<infer U> ? U : T;
type InferDataFunction<T extends (...args: any) => any> = NonNullable<Required<Exclude<Awaited<ReturnType<T>>, Response>>>;
