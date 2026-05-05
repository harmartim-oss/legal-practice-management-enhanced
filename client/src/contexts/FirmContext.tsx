import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FirmProfile {
  id: string;
  firmName: string;
  lawyerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  website?: string;
  licenseNumber?: string;
  logoUrl?: string;
  logoBase64?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FirmContextType {
  firmProfile: FirmProfile | null;
  isLoading: boolean;
  createFirmProfile: (profile: Omit<FirmProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFirmProfile: (profile: FirmProfile) => void;
  getFirmProfile: () => FirmProfile | null;
  clearFirmProfile: () => void;
}

const FirmContext = createContext<FirmContextType | undefined>(undefined);

const STORAGE_KEY = 'legal_firm_profile';

export function FirmProvider({ children }: { children: React.ReactNode }) {
  const [firmProfile, setFirmProfile] = useState<FirmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load firm profile from localStorage on mount
  useEffect(() => {
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setFirmProfile(parsed);
        }
      } catch (error) {
        console.error('Failed to load firm profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const createFirmProfile = (profile: Omit<FirmProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfile: FirmProfile = {
      ...profile,
      id: `firm-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setFirmProfile(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  const updateFirmProfile = (profile: FirmProfile) => {
    const updated: FirmProfile = {
      ...profile,
      updatedAt: new Date()
    };

    setFirmProfile(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getFirmProfile = (): FirmProfile | null => {
    return firmProfile;
  };

  const clearFirmProfile = () => {
    setFirmProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FirmContext.Provider
      value={{
        firmProfile,
        isLoading,
        createFirmProfile,
        updateFirmProfile,
        getFirmProfile,
        clearFirmProfile
      }}
    >
      {children}
    </FirmContext.Provider>
  );
}

export function useFirmProfile() {
  const context = useContext(FirmContext);
  if (context === undefined) {
    throw new Error('useFirmProfile must be used within a FirmProvider');
  }
  return context;
}
