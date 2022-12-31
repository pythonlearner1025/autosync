const parser = (fps, s, func) => {
    console.log(func)
    if (func.amp==undefined || func.offset==undefined || func.omega==undefined) return '0:(0)'
    const saw = (t) => {
        return func.amp * (Math.cos((t-func.offset)*func.omega))**100
    }
    const sin = (t) => {
        return func.amp * Math.sin((t-func.offset)*func.omega)
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