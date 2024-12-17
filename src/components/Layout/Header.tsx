import React from 'react';
import { format } from 'date-fns';

export const Header: React.FC = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return (
    <h1 className="text-3xl font-bold mb-8">Daily Development Plan - {today}</h1>
  );
};