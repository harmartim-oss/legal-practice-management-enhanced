import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Timekeeper {
  id: string;
  name: string;
  role: 'lawyer' | 'paralegal' | 'legal-assistant' | 'articling-student' | 'other';
  hourlyRate: number;
  email?: string;
  licenseNumber?: string;
  active: boolean;
  createdAt: Date;
}

interface TimekeeperContextType {
  timekeepers: Timekeeper[];
  addTimekeeper: (timekeeper: Omit<Timekeeper, 'id' | 'createdAt'>) => void;
  updateTimekeeper: (id: string, updates: Partial<Timekeeper>) => void;
  deleteTimekeeper: (id: string) => void;
  getTimekeeper: (id: string) => Timekeeper | undefined;
}

const TimekeeperContext = createContext<TimekeeperContextType | undefined>(undefined);

export function TimekeeperProvider({ children }: { children: React.ReactNode }) {
  const [timekeepers, setTimekeepers] = useState<Timekeeper[]>([]);

  // Load timekeepers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('timekeepers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimekeepers(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt)
        })));
      } catch (error) {
        console.error('Failed to load timekeepers:', error);
      }
    } else {
      // Initialize with default timekeepers
      const defaults: Timekeeper[] = [
        {
          id: 'tk-1',
          name: 'Senior Lawyer',
          role: 'lawyer',
          hourlyRate: 400,
          active: true,
          createdAt: new Date()
        },
        {
          id: 'tk-2',
          name: 'Paralegal',
          role: 'paralegal',
          hourlyRate: 200,
          active: true,
          createdAt: new Date()
        }
      ];
      setTimekeepers(defaults);
      localStorage.setItem('timekeepers', JSON.stringify(defaults));
    }
  }, []);

  // Save timekeepers to localStorage whenever they change
  useEffect(() => {
    if (timekeepers.length > 0) {
      localStorage.setItem('timekeepers', JSON.stringify(timekeepers));
    }
  }, [timekeepers]);

  const addTimekeeper = (timekeeper: Omit<Timekeeper, 'id' | 'createdAt'>) => {
    const newTimekeeper: Timekeeper = {
      ...timekeeper,
      id: `tk-${Date.now()}`,
      createdAt: new Date()
    };
    setTimekeepers([...timekeepers, newTimekeeper]);
  };

  const updateTimekeeper = (id: string, updates: Partial<Timekeeper>) => {
    setTimekeepers(timekeepers.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const deleteTimekeeper = (id: string) => {
    setTimekeepers(timekeepers.filter(t => t.id !== id));
  };

  const getTimekeeper = (id: string) => {
    return timekeepers.find(t => t.id === id);
  };

  return (
    <TimekeeperContext.Provider value={{
      timekeepers,
      addTimekeeper,
      updateTimekeeper,
      deleteTimekeeper,
      getTimekeeper
    }}>
      {children}
    </TimekeeperContext.Provider>
  );
}

export function useTimekeeper() {
  const context = useContext(TimekeeperContext);
  if (!context) {
    throw new Error('useTimekeeper must be used within TimekeeperProvider');
  }
  return context;
}
