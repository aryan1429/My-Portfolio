import React, { useState } from 'react';
import { useConnectionMonitor } from '@/hooks/useVideoPerformance';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Smartphone, Wifi, WifiOff, Info } from 'lucide-react';

interface MobileDebugPanelProps {
  show?: boolean;
}

export const MobileDebugPanel: React.FC<MobileDebugPanelProps> = ({ show = false }) => {
  const [isVisible, setIsVisible] = useState(show);
  const connectionInfo = useConnectionMonitor();
  const isMobile = useIsMobile();

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Info className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-lg border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Device Info</span>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* Device Type */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
            Device
          </span>
          <span className="font-mono">{isMobile ? 'Mobile' : 'Desktop'}</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {connectionInfo.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            Connection
          </span>
          <span className="font-mono">{connectionInfo.isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Network Type */}
        <div className="flex items-center justify-between">
          <span>Network Type</span>
          <span className="font-mono">{connectionInfo.effectiveType.toUpperCase()}</span>
        </div>

        {/* Download Speed */}
        <div className="flex items-center justify-between">
          <span>Download Speed</span>
          <span className="font-mono">{connectionInfo.downlink || 'Unknown'} Mbps</span>
        </div>

        {/* Data Saver */}
        <div className="flex items-center justify-between">
          <span>Data Saver</span>
          <span className="font-mono">{connectionInfo.saveData ? 'Enabled' : 'Disabled'}</span>
        </div>

        {/* Screen Size */}
        <div className="flex items-center justify-between">
          <span>Screen Size</span>
          <span className="font-mono">{window.innerWidth}×{window.innerHeight}</span>
        </div>

        {/* User Agent (Mobile Detection) */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-1">User Agent</div>
          <div className="font-mono text-xs break-all max-h-16 overflow-y-auto">
            {navigator.userAgent}
          </div>
        </div>

        {/* Video Support Check */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-1">Video Support</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>MP4</span>
              <span className="font-mono">
                {document.createElement('video').canPlayType('video/mp4') ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>WebM</span>
              <span className="font-mono">
                {document.createElement('video').canPlayType('video/webm') ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>playsInline</span>
              <span className="font-mono">
                {'playsInline' in document.createElement('video') ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-1">Recommendations</div>
          <div className="space-y-1 text-xs">
            {connectionInfo.effectiveType === '2g' && (
              <div className="text-yellow-600">• Use image previews instead of videos</div>
            )}
            {connectionInfo.saveData && (
              <div className="text-orange-600">• Data saver mode detected</div>
            )}
            {isMobile && (
              <div className="text-blue-600">• Using mobile optimizations</div>
            )}
            {!connectionInfo.isOnline && (
              <div className="text-red-600">• Offline mode - cached content only</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileDebugPanel;
