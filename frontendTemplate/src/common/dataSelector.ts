export const selectValue = (value: any, dataSelectorKey: string) =>  {
    if(!dataSelectorKey) {
        return value
      } else {
        const arr = dataSelectorKey.split(".")
        let ret = value;
        arr.forEach(elem => { 
          ret = ret?ret[elem]:ret
        })
  
        return ret
      }
}