"use client";

import { GridViewIcon, ListViewIcon } from "@/components/icons";
import { Item, List } from "@/components/ui/tabs";

const AppointmentsViewSwitch = () => {
  return (
    <>
      <List variant="bordered" defaultSelectedKey={"table"} size="sm">
        <Item
          key={"table"}
          title={
            <div className="flex items-center gap-1.5 text-sm text-default-600">
              <ListViewIcon className="h-4 w-4" />
              <span className="hidden opacity-0 transition-opacity duration-200 group-data-[selected=true]:inline-block group-data-[selected=true]:opacity-100 max-md:hidden">
                Vue quotidienne
              </span>
            </div>
          }
        />
        <Item
          key={"calendar"}
          title={
            <div className="flex items-center gap-1.5 text-sm text-default-600">
              <GridViewIcon className="h-4 w-4" />
              <span className="hidden opacity-0 transition-opacity duration-200 group-data-[selected=true]:inline-block group-data-[selected=true]:opacity-100 max-md:hidden">
                Vue mensuelle
              </span>
            </div>
          }
        />
      </List>

      {/* <TabsProvider>
           <Tab
             key="month"
             title={
               <div className="flex items-center gap-1.5 text-sm">
                 <GridViewIcon className="h-4 w-4" />
                 <span className="hidden opacity-0 transition-opacity duration-200 group-data-[selected=true]:inline-block group-data-[selected=true]:opacity-100">
                   Vue mensuelle
                 </span>
               </div>
             }
           />
           <Tab
             key="week"
             title={
               <div className="flex items-center gap-1.5 text-sm">
                 <ListViewIcon className="h-4 w-4" />
                 <span className="hidden opacity-0 transition-opacity duration-200 group-data-[selected=true]:inline-block group-data-[selected=true]:opacity-100">
                   Vue quotidienne
                 </span>
               </div>
             }
           />
         </Tabs>
         </TabsProvider> */}
    </>
  );
};

export default AppointmentsViewSwitch;
