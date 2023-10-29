export function numberToArray(num:number){
    return Array.from({ length:num }, (_, index) => index + 1)
}

export const dateToString = (date?: Date | string) => {
    if(!date){
        return new Date().toISOString().slice(0, 10)
    }
    if (date instanceof Date) {
        return date.toISOString().slice(0, 10);
        // return date.toDateString();
    }
    return new Date(date).toISOString().slice(0, 10)
};
