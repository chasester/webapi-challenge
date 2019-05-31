function validateObject(obj)
{
    let keys = Object.keys(obj);
    let flags = []
    keys.forEach((x,i)=> {if(obj[x] === undefined) flags.push(i);});
    let str = "" 
    if(flags.length > 0) flags.forEach((x,i)=> {
        str += flags.length > 1 && flags.length-1 == i ? ` and ${keys[x]}.` : ` ${keys[x]}${flags.length > 1 ? "," : "."}`
    })
    return str;
}


module.exports = validateObject;