//TODO: make sure no strings enter here at some point

const parser = (fps, s, func) => {
    if (func.amp==undefined || func.offset_x==undefined || func.offset_y==undefined || func.omega==undefined) return ''

    const offset_x = parseFloat(func.offset_x)
    const offset_y = parseFloat(func.offset_y)
    const amp = parseFloat(func.amp)
    const omega = parseFloat(func.omega)

    const saw = (t) => {
        return amp * (Math.cos((t-offset_x)*omega))**100 + offset_y
    }
    const sin = (t) => {
        return amp * Math.sin((t-offset_x)*omega) + offset_y
    }

    var res = ''
    for (let i=0; i<fps*s; i++) {
        const val = !func.funcType || func.funcType=='sin'?sin(i/fps):saw(i/fps)
        res += `${i}:(${val.toFixed(4)})`
        if (i!=fps*s-1) res += ','
    } 
    return res
}

export default parser