import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, addDays, startOfISOWeek, endOfISOWeek } from "date-fns";
import { weekDays } from "./utilities/days-months";
import { Eclipse, Moon, Plus, Sun } from "lucide-react";
import { getWeek } from "./api/getWeek";
import { getShiftsByDate } from "./api/getShiftsByDate";

type Shift = {
  shift_date: string;
  enter: string;
  exit: string;
  regular_hours: number;
  night_hours: number;
  overnight_hours: number;
  total_hours: number;
};

export default function History() {
  // const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);

  useEffect(() => {
    // get mon/sun of week
    const currentDate = new Date();
    const startOfWeek = startOfISOWeek(currentDate);
    const endOfWeek = endOfISOWeek(currentDate);
    // format to make API call
    const startDate = format(startOfWeek, "yyyy-MM-dd");
    const endDate = format(endOfWeek, "yyyy-MM-dd");

    // Fetch shifts
    async function fetchShifts() {
      try {
        const weekShifts = await getWeek(startDate, endDate);
        if (weekShifts) {
          // setShifts(weekShifts);
          setFilteredShifts(weekShifts);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    }
    fetchShifts();
  }, []);

  const handleClickDay = async (value: any) => {
    const selectedDate = format(value, "yyyy-MM-dd");

    try {
      const dayShifts = await getShiftsByDate(selectedDate);
      setFilteredShifts(dayShifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const handleWeek = async (weekNumber: number, date: Date) => {
    const startDate = format(date, "yyyy-MM-dd");
    const endDate = format(addDays(date, 6), "yyyy-MM-dd");
    console.log(weekNumber);
    try {
      const weekShifts = await getWeek(startDate, endDate);
      if (weekShifts) {
        setFilteredShifts(weekShifts);
      }
    } catch (error) {
      console.error("error fetching shifts for the week: ", error);
    }
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
      <div className="flex gap-1 my-5 items-center">
        <Sun />
        <span className="mr-3 text-xs">8h-22h</span>
        <Eclipse />
        <span className="mr-3 text-xs">22h-24h</span>
        <Moon />
        <span className="mr-3 text-xs">24h-6h</span>
      </div>
      <div className="overflow-x-auto m-3 flex items-center justify-center">
        {filteredShifts.length > 0 ? (
          <table className="text-xs md:text-base">
            <thead>
              <tr>
                <th className="font-bold bg-gray-500 text-white py-2"></th>
                {filteredShifts.map((item, i) => (
                  <th
                    key={i}
                    className="font-bold bg-gray-500 text-white w-[100px]"
                  >
                    <div className="flex flex-col">
                      <div>
                        {weekDays[new Date(item.shift_date).getDay()].slice(
                          0,
                          3
                        )}
                      </div>
                      <div>{item.shift_date.slice(8)}</div>
                    </div>
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
                      className={`text-center border border-green-300 ${
                        category === "Total" && "font-bold text-sm"
                      }
                      ${(i === 5 || i === 6) && "bg-green-100"}`}
                    >
                      {category === "Regular" && item.regular_hours
                        ? item.regular_hours.toFixed(2)
                        : ""}
                      {category === "Night" && item.night_hours
                        ? item.night_hours.toFixed(2)
                        : ""}
                      {category === "Overnight" && item.overnight_hours
                        ? item.overnight_hours.toFixed(2)
                        : ""}
                      {category === "Total" && item.total_hours
                        ? item.total_hours.toFixed(2)
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="font-bold text-right">
                <td
                  className="text-right bg-green-400"
                  colSpan={filteredShifts.length + 1}
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
