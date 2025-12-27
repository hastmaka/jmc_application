export function throwError(err: string | Error, field: string = '', code = 400): never {
    if ((err as any)?.field || field) {
        const error = new Error((err as any)?.message || (err as string)) ;
        (error as any).code = code;
        (error as any).field = (err as any)?.field || field;
        throw error;
    }
    throw new Error(err as string);
}