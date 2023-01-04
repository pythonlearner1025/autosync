const toString = (func) => {
    if (func.amp==undefined || func.offset_x==undefined || func.offset_y==undefined || func.omega==undefined) return ''
    var offset_x = parseFloat(func.offset_x).toFixed(4)
    var offset_y = parseFloat(func.offset_y).toFixed(4)
    var amp = parseFloat(func.amp).toFixed(4)
    var omega = parseFloat(func.omega).toFixed(4)
    offset_x = offset_x%1==0?Math.round(offset_x):offset_x
    offset_y = offset_y%1==0?Math.round(offset_y):offset_y
    amp = amp%1==0?Math.round(amp):amp
    omega = omega%1==0?Math.round(omega):omega

    if (!func.funcType || func.funcType=='sin'){
        if (offset_x==0) return `${amp}*sin(t*${omega})+${offset_y}`
        return `${amp}*sin((t-${offset_x})*${omega})+${offset_y}`
    } else if (func.funcType=='saw'){
        if (offset_x==0) return `${amp}*cos(t*${omega})**100+${offset_y}`
        return `${amp}*cos((t-${offset_x})*${omega})**100+${offset_y}`
    }
}
export default toString