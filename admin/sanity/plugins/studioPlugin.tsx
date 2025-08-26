import React from 'react';
import { ScrapingAlarm } from '../../components/ScrapingAlarm';
import { NotificationProvider } from '../../context/NotificationContext';

// This component will be injected into the Sanity studio
export function StudioPlugin() {
  return (
    <NotificationProvider>
      <div className="fixed top-4 right-4 z-[9999]">
        <ScrapingAlarm
          isVisible={false}
          onToggle={() => {}}
        />
      </div>
    </NotificationProvider>
  );
}

// Custom hook to manage alarm visibility
export function useAlarmVisibility() {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const toggle = React.useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);
  
  return { isVisible, toggle };
}
