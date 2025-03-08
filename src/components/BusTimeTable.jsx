// src/components/BusTimeTable.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.tsx';
import { Button } from './ui/button.tsx';
import { useBusData } from '../hooks/useBusData.js';

const BusTimeTable = () => {
  const [selectedDay, setSelectedDay] = useState('平日');
  const { timetableData, currentTime, loading, error, reload } = useBusData();

  // 選択された曜日の全てのバス時刻を取得
  const getAllBuses = (dayType) => {
    if (!timetableData) return [];
    const schedule = timetableData.timetable[dayType];
    const allBuses = [];

    for (const [hour, minutes] of Object.entries(schedule)) {
      minutes.forEach((minute) => {
        allBuses.push({
          time: `${hour.replace('時', '').padStart(2, '0')}:${minute.padStart(2, '0')}`,
          date: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), parseInt(hour), parseInt(minute)),
        });
      });
    }

    // 時刻順にソート
    return allBuses.sort((a, b) => a.date - b.date);
  };

  // 次のバスを特定
  const getNextBusIndex = (buses) => {
    return buses.findIndex(bus => bus.date > currentTime);
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

  const allBuses = getAllBuses(selectedDay);
  const nextBusIndex = getNextBusIndex(allBuses);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>東大島駅前 バス時刻表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center mt-4 bus-map">
            <img
              src="https://raw.githubusercontent.com/StarProducts/easy-bus/refs/heads/main/public/images/higashiohjima.gif"
              alt="バス停マップ"
              className="mx-auto rounded-lg"
            />
          </div>
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
            <h3 className="text-lg font-semibold mb-2">バス時刻表</h3>
            {allBuses.length > 0 ? (
              <ul>
                {allBuses.map((bus, index) => (
                  <li
                    key={index}
                    className={`flex justify-between py-1 ${index === nextBusIndex ? 'bg-yellow-200 font-bold' : ''}`}
                  >
                    <span>{bus.time}</span>
                    {index === nextBusIndex && (
                      <span className="text-blue-600">次のバス</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>本日のバスは終了しました</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusTimeTable;
