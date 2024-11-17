import React, { useState } from 'react';

type TabsProps = {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
};

const Tabs: React.FC<TabsProps> = ({ children, value, onValueChange }) => {
  return <div>{children}</div>;
};

type TabsListProps = {
  children: React.ReactNode;
};

const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return <div className="flex space-x-4">{children}</div>;
};

type TabsTriggerProps = {
  children: React.ReactNode;
  value: string;
  onClick: () => void;
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, onClick }) => {
  return (
    <button onClick={onClick} className="p-2 border-b-2">
      {children}
    </button>
  );
};

type TabsContentProps = {
  children: React.ReactNode;
  value: string;
  activeValue: string;
};

const TabsContent: React.FC<TabsContentProps> = ({ children, value, activeValue }) => {
  return activeValue === value ? <div>{children}</div> : null;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };