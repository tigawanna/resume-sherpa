export function stringOrURLToString(url:string|URL){
if(typeof url === 'string'){
    return url;
}else{
    return url.toString();
}
}
