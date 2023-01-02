//TODO: make sure no strings enter here at some point

const parser = (fps, s, func) => {
    if (func.amp==undefined || func.offset_x==undefined || func.offset_y==undefined || func.omega==undefined) return '0:(0)'

    func.offset_y = parseFloat(func.offset_y)
    func.amp = parseFloat(func.amp)
    func.omega = parseFloat(func.omega)

    const saw = (t) => {
        return func.amp * (Math.cos((t-func.offset_x)*func.omega))**100 + func.offset_y
    }
    const sin = (t) => {
        return func.amp * Math.sin((t-func.offset_x)*func.omega) + func.offset_y
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