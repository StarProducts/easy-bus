const BusTimeTable = () => {
  const [selectedDay, setSelectedDay] = useState('平日');
  const { timetableData, currentTime, loading, error, reload } = useBusData();

  import React, { useState, useEffect } from 'react';
  import { Card, CardHeader, CardTitle, CardContent } from './ui/card.tsx';
  import { Button } from './ui/button.tsx';
  import { useBusData } from '../hooks/useBusData.js';
  
  const BusTimeTable = () => {
    const { timetableData, currentTime, loading, error, reload } = useBusData();
    const [selectedDay, setSelectedDay] = useState('');
  
    useEffect(() => {
      // 現在の曜日に基づいてデフォルトの表示を設定
      const dayOfWeek = currentTime.getDay();
      if (dayOfWeek === 0) {
        setSelectedDay('休日');
      } else if (dayOfWeek === 6) {
        setSelectedDay('土曜日');
      } else {
        setSelectedDay('平日');
      }
    }, [currentTime]);
  
    // 選択された曜日の全てのバス時刻を取得
    const getUpcomingBuses = (dayType) => {
      if (!timetableData) return [];
      const schedule = timetableData.timetable[dayType];
      const upcomingBuses = [];
  
      for (const [hour, minutes] of Object.entries(schedule)) {
        minutes.forEach((minute) => {
          const busTime = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            parseInt(hour),
            parseInt(minute)
          );
          if (busTime > currentTime) {
            upcomingBuses.push({
              time: `${hour.replace('時', '').padStart(2, '0')}:${minute.padStart(2, '0')}`,
              date: busTime,
            });
          }
        });
      }
  
      // 時刻順にソート
      return upcomingBuses.sort((a, b) => a.date - b.date);
    };
  
    if (loading) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <p>データを読み込み中...</p>
          </CardContent>
        </Card>
      );
    }
  
    if (error) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={reload} className="mt-4">再読み込み</Button>
          </CardContent>
        </Card>
      );
    }
  
    const upcomingBuses = getUpcomingBuses(selectedDay);
  
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>東大島駅前 バス時刻表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-600">
                路線: {timetableData?.route} ({timetableData?.destination})
              </p>
            </div>
  
            <div className="flex justify-center space-x-2 mb-4">
              {['平日', '土曜日', '休日'].map(day => (
                <Button
                  key={day}
                  variant={selectedDay === day ? 'default' : 'outline'}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
  
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">次のバス時刻</h3>
              {upcomingBuses.length > 0 ? (
                <ul>
                  {upcomingBuses.map((bus, index) => (
                    <li
                      key={index}
                      className={`flex justify-between py-1 ${index === 0 ? 'bg-yellow-200 font-bold' : ''}`}
                    >
                      <span>{bus.time}</span>
                      {index === 0 && (
                        <span className="text-blue-600">次のバス</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>本日のバスは終了しました</p>
              )}
            </div>
  
            <div className="text-center mt-4 bus-map">
              <img
                src="https://raw.githubusercontent.com/StarProducts/easy-bus/refs/heads/main/public/images/higashiohjima.gif"
                alt="バス停マップ"
                className="mx-auto rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default BusTimeTable;
  