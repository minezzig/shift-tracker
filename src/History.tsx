import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, addDays, startOfISOWeek, endOfISOWeek } from "date-fns";
import { weekDays } from "./utilities/days-months";
import { Eclipse, Moon, Plus, Sun } from "lucide-react";
import { getWeek } from "./api/getWeek";
import { getShiftsByDate } from "./api/getShiftsByDate";
import { useNavigate } from "react-router";
import { useUser } from "./UserContext";

type Shift = {
  shift_date: string;
  enter: string;
  exit: string;
  regular_hours: number;
  night_hours: number;
  overnight_hours: number;
  total_hours: number;
  id: number;
};

export default function History() {
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [view, setView] = useState<"week" | "day" | "">("");
  const { user } = useUser();
  const navigate = useNavigate();

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
        const weekShifts = await getWeek(startDate, endDate, user);
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
    setView("day");
    const selectedDate = format(value, "yyyy-MM-dd") + "T00:00:00.000Z";

    try {
      const dayShifts = await getShiftsByDate(selectedDate, user);
      setFilteredShifts(dayShifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const handleWeek = async (weekNumber: number, date: Date) => {
    setView("week");
    const startDate = format(date, "yyyy-MM-dd");
    const endDate = format(addDays(date, 6), "yyyy-MM-dd");

    try {
      const weekShifts = await getWeek(startDate, endDate, user);
      if (weekShifts) {
        setFilteredShifts(weekShifts);
      }
    } catch (error) {
      console.error("error fetching shifts for the week: ", error);
    }
  };

  // get the day of week and date from data
  const getDayAndDate = (shiftDate: string) => {
    const day = weekDays[new Date(shiftDate).getDay()].slice(0, 3);
    const date = shiftDate.slice(8, 10);
    return { day, date };
  };

  const handleGoToDay = (id: number) => {
    navigate(`/history/${id}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1>History</h1>
      <button onClick={() => navigate("/history/all")} className="cursor-pointer transition hover:bg-green-400 p-2 rounded-xl bg-green-300" type="button">View All shifts</button>
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
        <span className="mr-3 text-xs">24h-8h</span>
      </div>
      <div className="overflow-x-auto m-3 flex items-center justify-center">
        {filteredShifts.length > 0 ? (
          <table className="text-xs md:text-base">
            <thead>
              <tr>
                <th className="font-bold bg-gray-500 text-white py-2"></th>
                {filteredShifts.map((item, i) => {
                  const { day, date } = getDayAndDate(item.shift_date);
                  return (
                    <th
                      key={i}
                      className="font-bold bg-gray-500 text-white w-[100px]"
                    >
                      <div
                        className="flex flex-col cursor-pointer hover:bg-green-400"
                        onClick={() => handleGoToDay(item.id)}
                      >
                        <div>{day}</div>
                        <div>{date}</div>
                      </div>
                    </th>
                  );
                })}
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
                  {filteredShifts.map((item, i) => {
                    let hours = 0;
                    if (category === "Regular") hours = item.regular_hours;
                    if (category === "Night") hours = item.night_hours;
                    if (category === "Overnight") hours = item.overnight_hours;
                    if (category === "Total") hours = item.total_hours;
                    return (
                      <td
                        key={i}
                        className={`text-center border border-green-300 ${
                          category === "Total" && "font-bold text-sm"
                        }
                    `}
                      >
                        {hours ? hours.toFixed(2) : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {view === "week" && (
                <tr className="font-bold  bg-green-400">
                  <td></td>
                  <td>
                    <div className="flex flex-col items-center justify-center">
                      <div>Día</div>
                      <div>
                        {filteredShifts
                          ?.reduce((sum, item) => sum + item.regular_hours, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col items-center justify-center">
                      <div>Noche</div>
                      <div>
                        {filteredShifts
                          ?.reduce((sum, item) => sum + item.night_hours, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col items-center justify-center">
                      <div>Transnoche</div>
                      <div>
                        {filteredShifts
                          ?.reduce((sum, item) => sum + item.overnight_hours, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td
                    className="flex flex-col items-center justify-center"
                  >
                   <div>Total</div>
                      <div>
                        {filteredShifts
                          ?.reduce((sum, item) => sum + item.total_hours, 0)
                          .toFixed(2)}
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div>No has trabajado hoy</div>
        )}
      </div>
    </div>
  );
}
