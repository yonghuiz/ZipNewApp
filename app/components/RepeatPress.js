import React from 'react'
export function repeatPress(component,timeout=1000){
    if(component===undefined||component===null)
        return false;
    if(component.repeatPressFlagForZippora===true)
        return true;
    component.repeatPressFlagForZippora = true;
    setTimeout(()=>{
        if(component!=undefined)
            component.repeatPressFlagForZippora = false;
    },timeout);
    return false;
}