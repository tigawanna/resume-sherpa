export function numberToArray(num:number){
    return Array.from({ length:num }, (_, index) => index + 1)
}
