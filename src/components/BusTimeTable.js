import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BusTimeTable = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timetableData, setTimetableData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('平日');

  useEffect(() => {
    // GitHubからJSONデータを取得
    const fetchTimetable = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/StarProducts/easy-bus/blob/main/timetable/tokyoKotsu/higashiohjima.json');
        const data = await response.json();
        setTimetableData(data);
      } catch (error) {
        console.error('データ取得エラー:', error);
      }
    };

    fetchTimetable();
    
    // 1分ごとに現在時刻を更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  const getDayType = () => {
    const day = currentTime.getDay();
    const isWeekend = day === 0 || day === 6;
    return isWeekend ? '休日' : '平日';
  };

  const getNextBusTimes = () => {
    if (!timetableData) return [];

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const dayType = getDayType();

    const schedule = timetableData.timetable[dayType];
    const nextBuses = [];

    for (let hour = currentHour; hour < 24; hour++) {
      const timeKey = `${hour}時`;
      const hourSchedule = schedule[timeKey] || [];

      hourSchedule.forEach(minute => {
        const busTime = new Date(currentTime);
        busTime.setHours(hour, parseInt(minute), 0);

        if (busTime > currentTime) {
          const minutesUntilBus = Math.floor((busTime - currentTime) / 60000);
          nextBuses.push({
            time: `${formatTime(hour)}:${minute}`,
            minutesLeft: minutesUntilBus
          });
        }
      });

      if (nextBuses.length >= 5) break;
    }

    return nextBuses.slice(0, 5);
  };

  const nextBusTimes = getNextBusTimes();

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
            <h3 className="text-lg font-semibold mb-2">次のバス</h3>
            {nextBusTimes.length > 0 ? (
              <ul>
                {nextBusTimes.map((bus, index) => (
                  <li key={index} className="flex justify-between py-1">
                    <span>{bus.time}</span>
                    <span className="text-blue-600">{bus.minutesLeft}分後</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>本日のバスは終了しました</p>
            )}
          </div>

          <div className="text-center mt-4">
            <img 
              src="/api/placeholder/300/200" 
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