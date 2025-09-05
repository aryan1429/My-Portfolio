import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  videoLoadTime: number;
  networkType: string;
  deviceType: 'mobile' | 'desktop';
  connectionSpeed: string;
  dataUsage: number;
}

interface TrackingData {
  startTime: number;
  networkType: string;
  deviceType: 'mobile' | 'desktop';
  connectionSpeed: string;
}

export const useVideoPerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = (): TrackingData => {
    setIsTracking(true);
    const startTime = performance.now();
    
    // Get connection info
    const connection = (navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        downlink?: number;
      };
    }).connection;
    const networkType = connection?.effectiveType || 'unknown';
    const deviceType: 'mobile' | 'desktop' = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    
    return {
      startTime,
      networkType,
      deviceType,
      connectionSpeed: connection?.downlink ? `${connection.downlink} Mbps` : 'unknown'
    };
  };

  const endTracking = (trackingData: TrackingData, dataTransferred: number = 0) => {
    const endTime = performance.now();
    const loadTime = endTime - trackingData.startTime;
    
    setMetrics({
      videoLoadTime: loadTime,
      networkType: trackingData.networkType,
      deviceType: trackingData.deviceType,
      connectionSpeed: trackingData.connectionSpeed,
      dataUsage: dataTransferred
    });
    
    setIsTracking(false);
    
    // Log performance data for debugging
    console.log('Video Performance Metrics:', {
      loadTime: `${loadTime.toFixed(2)}ms`,
      networkType: trackingData.networkType,
      deviceType: trackingData.deviceType,
      connectionSpeed: trackingData.connectionSpeed,
      dataUsage: `${(dataTransferred / 1024 / 1024).toFixed(2)}MB`
    });
  };

  return {
    metrics,
    isTracking,
    startTracking,
    endTracking
  };
};

export const useConnectionMonitor = () => {
  const [connectionInfo, setConnectionInfo] = useState({
    effectiveType: 'unknown',
    downlink: 0,
    saveData: false,
    isOnline: navigator.onLine
  });

  useEffect(() => {
    const updateConnectionInfo = () => {
      const connection = (navigator as Navigator & {
        connection?: {
          effectiveType?: string;
          downlink?: number;
          saveData?: boolean;
          addEventListener?: (event: string, handler: () => void) => void;
          removeEventListener?: (event: string, handler: () => void) => void;
        };
      }).connection;
      if (connection) {
        setConnectionInfo({
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          saveData: connection.saveData || false,
          isOnline: navigator.onLine
        });
      }
    };

    const handleOnline = () => setConnectionInfo(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setConnectionInfo(prev => ({ ...prev, isOnline: false }));

    // Initial check
    updateConnectionInfo();

    // Listen for connection changes
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & {
        connection?: {
          addEventListener?: (event: string, handler: () => void) => void;
          removeEventListener?: (event: string, handler: () => void) => void;
        };
      }).connection;
      if (connection?.addEventListener) {
        connection.addEventListener('change', updateConnectionInfo);
      }
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & {
          connection?: {
            removeEventListener?: (event: string, handler: () => void) => void;
          };
        }).connection;
        if (connection?.removeEventListener) {
          connection.removeEventListener('change', updateConnectionInfo);
        }
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return connectionInfo;
};
