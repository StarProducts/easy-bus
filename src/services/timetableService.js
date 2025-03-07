export const fetchTimetableData = async (stopId = 'higashiohjima') => {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/StarProducts/easy-bus/main/timetable/tokyoKotsu/${stopId}.json`);
      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }
      return await response.json();
    } catch (error) {
      console.error('時刻表データ取得エラー:', error);
      throw error;
    }
  };