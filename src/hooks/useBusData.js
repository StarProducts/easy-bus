import { useState, useEffect } from 'react';
import { fetchTimetableData } from '../services/timetableService';
import { getDayType, calculateNextBuses } from '../lib/utils.js';

export function useBusData(stopId = 'higashiohjima') {
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchTimetableData(stopId);
        setTimetableData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // 1分ごとに現在時刻を更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [stopId]);
  
  const dayType = getDayType(currentTime);
  const nextBuses = calculateNextBuses(timetableData, currentTime, dayType);
  
  return {
    timetableData,
    currentTime,
    dayType,
    nextBuses,
    loading,
    error,
    reload: () => {
      setCurrentTime(new Date());
    }
  };
}