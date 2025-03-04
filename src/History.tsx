import { useEffect, useState } from "react";
import getShifts from "./api/getShifts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { weekDays } from "./utilities/days-months";

type Shift = {
  shift_date: string;
  enter: string; // Assuming ISO string format
  exit: string; // Assuming ISO string format
  regular_hours: number;
  night_hours: number;
  total_hours: number;
};

export default function History() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);

  useEffect(() => {
    async function fetchShifts() {
      const shiftsData = await getShifts();
      setShifts(shiftsData);
      setFilteredShifts(shiftsData)
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
    <div className="">
      <h1>History</h1>
      <div className="">
        <Calendar
          onChange={handleClickDay}
          showWeekNumbers={true}
          onClickWeekNumber={handleWeek}
        />
      </div>
      <table className="">
        <thead>
          <tr>
            <th className="font-bold bg-gray-500 text-white py-2">-</th>
            {filteredShifts.map((item, i) => (
              <th
                key={i}
                className="font-bold bg-gray-500 text-white py-2 w-[100px]"
              >
                {weekDays[new Date(item.shift_date).getDay()]}
                <br />
                {item.shift_date.slice(8)}{" "}
                {/* Slicing to get day part of the date */}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {["Regular", "Night", "Total"].map((category) => (
            <tr key={category}>
              <td className="font-bold bg-gray-500 text-white">{category}</td>
              {filteredShifts.map((item, i) => (
                <td
                  key={i}
                  className={`text-right ${
                    category === "Total" && "font-bold"
                  }`}
                >
                  {category === "Regular" && item.regular_hours}
                  {category === "Night" && item.night_hours}
                  {category === "Total" && item.total_hours}
                </td>
              ))}
            </tr>
          ))}
          <tr className="font-bold text-right">
            <td className="text-right bg-green-400" colSpan={shifts.length + 1}>
              Horas Semenales:{" "}
              {shifts
                ?.reduce((sum, item) => (sum += item.total_hours), 0)
                .toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
