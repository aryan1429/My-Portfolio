import { useEffect, useState } from 'react';

interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  saveData?: boolean;
  rtt?: number;
}

export const useNetworkStatus = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInformation | null>(null);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check if the device has a slow connection
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          saveData: connection.saveData,
          rtt: connection.rtt
        });

        // Determine if connection is slow
        const isSlow = 
          connection.effectiveType === '2g' || 
          connection.effectiveType === 'slow-2g' ||
          connection.saveData === true ||
          (connection.downlink && connection.downlink < 1);
        
        setIsSlowConnection(isSlow);
      }
    };

    checkConnection();

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', checkConnection);
      
      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }
  }, []);

  return {
    networkInfo,
    isSlowConnection,
    shouldUseDataSaver: networkInfo?.saveData || isSlowConnection
  };
};

export const getMobileVideoSettings = (networkInfo: NetworkInformation | null) => {
  if (!networkInfo) {
    return {
      preload: 'none' as const,
      quality: 'low' as const,
      autoplay: false
    };
  }

  switch (networkInfo.effectiveType) {
    case '4g':
      return {
        preload: 'metadata' as const,
        quality: 'medium' as const,
        autoplay: false
      };
    case '3g':
      return {
        preload: 'none' as const,
        quality: 'low' as const,
        autoplay: false
      };
    case '2g':
    case 'slow-2g':
    default:
      return {
        preload: 'none' as const,
        quality: 'low' as const,
        autoplay: false
      };
  }
};

export const formatBytesToMB = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const detectMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
