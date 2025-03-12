import { useEffect, useState } from "react";
import getShifts from "./api/getShifts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { weekDays } from "./utilities/days-months";
import { Eclipse, Moon, Plus, Sun } from "lucide-react";

type Shift = {
  shift_date: string;
  enter: string; // Assuming ISO string format
  exit: string; // Assuming ISO string format
  regular_hours: number;
  night_hours: number;
  overnight_hours: number;
  total_hours: number;
};

export default function History() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);

  useEffect(() => {
    async function fetchShifts() {
      const shiftsData = await getShifts();
      setShifts(shiftsData);
      setFilteredShifts(shiftsData);
    }

    fetchShifts();
  }, []);

  const handleClickDay = (e) => {
    const selectedDate = format(e, "yyyy-MM-dd");
    const sorted = shifts.filter((shift) => shift.shift_date === selectedDate);
    console.log(sorted);
    setFilteredShifts(sorted);
  };

  const handleWeek = (weekNumber, date, e) => {
    console.log("Clicked week: ", weekNumber, "that starts on: ", date);
  };

  return (
    <div className="flex flex-col items-center">
      <h1>History</h1>
      <div className="">
        <Calendar
          onChange={handleClickDay}
          showWeekNumbers={true}
          onClickWeekNumber={handleWeek}
        />
      </div>
      <div className="flex gap-1 my-5">
        <Sun />
        <span className="mr-3">8h-22h</span>
        <Eclipse />
        <span className="mr-3">22h-24h</span>
        <Moon />
        <span className="mr-3">24h-6h</span>
      </div>
      <div className="overflow-x-auto w-full">
        {filteredShifts.length > 0 ? (
          <table className="text-xs md:text-base">
            <thead>
              <tr>
                <th className="font-bold bg-gray-500 text-white py-2"></th>
                {filteredShifts.map((item, i) => (
                  <th
                    key={i}
                    className="font-bold bg-gray-500 text-white w-[100px] text-right pr-5"
                  >
                    {weekDays[new Date(item.shift_date).getDay()].slice(0, 3)}
                    <br />
                    {item.shift_date.slice(8)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Regular", "Night", "Overnight", "Total"].map((category) => (
                <tr key={category}>
                  <td className="font-bold bg-gray-500 text-white p-2">
                    {category === "Regular" ? (
                      <Sun />
                    ) : category === "Night" ? (
                      <Eclipse />
                    ) : category === "Overnight" ? (
                      <Moon />
                    ) : (
                      <Plus />
                    )}
                  </td>
                  {filteredShifts.map((item, i) => (
                    <td
                      key={i}
                      className={`py-2 text-right pr-5 ${
                        category === "Total" && "font-bold"
                      }`}
                    >
                      {category === "Regular" && item.regular_hours.toFixed(2)}
                      {category === "Night" && item.night_hours.toFixed(2)}
                      {category === "Overnight" &&
                        item.overnight_hours.toFixed(2)}
                      {category === "Total" && item.total_hours.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="font-bold text-right">
                <td
                  className="text-right bg-green-400"
                  colSpan={shifts.length + 1}
                >
                  Horas Semenales:{" "}
                  {filteredShifts
                    ?.reduce((sum, item) => sum + item.total_hours, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div>No has trabajado hoy</div>
        )}
      </div>
    </div>
  );
}
