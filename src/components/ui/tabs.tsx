"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  PropsWithChildren,
  HTMLAttributes,
} from "react";

import {
  Tabs as NextUITabs,
  Tab as NextUITab,
  TabItemProps,
  TabsProps,
} from "@nextui-org/tabs";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const TabsContext = createContext<TabsContextProps | undefined>(undefined);
export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
};

interface TabsProviderProps extends TabsProps {
  children: ReactNode;
  defaultTab: string;
}

export const TabsProvider: React.FC<TabsProviderProps> = ({
  children,
  defaultTab,
  onSelectionChange,
  selectedKey,
  ...rest
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  if (onSelectionChange && selectedKey) {
    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <NextUITabs
          selectedKey={selectedKey}
          onSelectionChange={(key) => onSelectionChange(key as string)}
        >
          {children}
        </NextUITabs>
      </TabsContext.Provider>
    );
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

interface TabsRootProps {
  children: ReactNode;
  className?: string;
  defaultTab: string;
}

const Root: React.FC<TabsRootProps> = ({ children, className, defaultTab }) => {
  return (
    <TabsProvider defaultTab={defaultTab}>
      <div className={className}>{children}</div>
    </TabsProvider>
  );
};

const List: React.FC<TabsProps> = (props) => {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <NextUITabs
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key as string)}
      {...props}
    >
      {props.children}
    </NextUITabs>
  );
};

export const Item = NextUITab;

interface TabBodyProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}
const Body: React.FC<TabBodyProps> = ({
  value,
  children,
  className,
  ...rest
}) => {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;
  if (!isActive) return null;

  return <div {...rest}>{children}</div>;
};

export { Root, List, Body };
