import { useEffect, useState } from "react";
import getShifts from "./api/getShifts";

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

  useEffect(() => {
    async function fetchShifts() {
      const shiftsData = await getShifts();
      setShifts(shiftsData);
    }

    fetchShifts();
  }, []);

  return (
    <div>
      <h1>History</h1>
      <ol>
        {shifts.map((item, i) => (
          <li>
            {i+1}.  {item.shift_date} - {item.total_hours}
          </li>
        ))}
      </ol>
      {
        <div className="font-bold">
          Total:{" "}
          {shifts?.reduce((sum, item) => (sum += item.total_hours), 0).toFixed(2)} hours
        </div>
      }
    </div>
  );
}
