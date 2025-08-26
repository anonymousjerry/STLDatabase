import React, { useState } from 'react';
import { ScrapingAlarm } from '../../components/ScrapingAlarm';
import { NotificationProvider } from '../../context/NotificationContext';

export function ScrapingAlarmPlugin() {
  const [isAlarmVisible, setIsAlarmVisible] = useState(false);

  return (
    <NotificationProvider>
      <div className="fixed top-4 right-4 z-50">
        <ScrapingAlarm
          isVisible={isAlarmVisible}
          onToggle={() => setIsAlarmVisible(!isAlarmVisible)}
        />
      </div>
    </NotificationProvider>
  );
}

// Create a custom component that can be used in Sanity
export function ScrapingAlarmComponent() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Scraping Alarm System</h2>
      <p className="text-gray-600 mb-4">
        This component provides real-time notifications for scraping activities.
        The alarm bell in the top-right corner will show notifications when models are scraped.
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Real-time notifications when models are scraped</li>
          <li>Sound alerts for new notifications</li>
          <li>Visual indicators for unread notifications</li>
          <li>Persistent notification history</li>
          <li>WebSocket connection for live updates</li>
        </ul>
      </div>
    </div>
  );
}
