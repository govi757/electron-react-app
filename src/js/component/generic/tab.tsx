import React, { useEffect, useState } from "react";

export default function Tab({tabList, selectedTab,tabSelected}: {tabList: ITab[];selectedTab?: string;tabSelected?: (key: string) => void}) {

    const renderSelectedTab = () => {
        const index = tabList.findIndex(tab => tab.key === selectedTab)
        if(index !== -1) {
            return tabList[index].component
        } else {
            return <div>No Screen is configured for this</div>
        }
    }
  return (
    <>
      
        <div style={{position:"absolute",width:"100%"}} className="nav nav-tabs " id="nav-tab" role="tablist">
            {tabList.map(tab => {
                return(
                    <button
                    key={tab.key}
                    className={`  nav-link ${selectedTab=== tab.key?'active':''}`}
                    id="nav-home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-home"
                    type="button"
                    role="tab"
                    aria-controls="nav-home"
                    aria-selected="true"
                    onClick={() => tabSelected? tabSelected(tab.key): null}
                  >
                    {tab.name}
                  </button>
                )
            })}
        </div>
      <div style={{position:'relative', marginTop:'50px'}} className="tab-content" id="nav-tabContent">
        {
            renderSelectedTab()
        }
      </div>
    </>
  );
}


export interface ITab  {
    name: string;
    component: React.ReactElement;
    key: string;
}