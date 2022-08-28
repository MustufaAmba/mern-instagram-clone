const generateDayArray = ()=>{
    let array = []
    for(let i=1;i<=31;i++)
    {
        array.push(i)
    }
    return array
}
const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const generateYearArray = ()=>{
    let array = []
    for(let i=2022;i>=1919;i--)
    {
        array.push(i)
    }
    return array
}
export {generateDayArray,monthArray,generateYearArray}