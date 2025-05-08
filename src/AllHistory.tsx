import { useEffect, useState } from "react";
import getShifts from "./api/getShifts";
import { formatTime } from "./utilities/formatTime";
import { Edit, Edit2, Sun, Trash2 } from "lucide-react";

interface Shift {
  shift_date: string;
  enter: string;
  exit: string;
  regular_hours: number;
  night_hours: number;
  overnight_hours: number;
  total_hours: number;
}

export default function AllHistory() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  console.log(shifts);
  useEffect(() => {
    async function fetchShifts() {
      try {
        const data = await getShifts();
        setShifts(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchShifts();
  }, []);

  return (
    <div>
      <h1>AllHistory</h1>
      <div className="border border-black  m-3 text-[10px]">
        <div className="grid grid-cols-7 text-center font-bold bg-gray-100 p-2">
          <div>Fecha</div>
          <div>Entrada</div>
          <div>Salida</div>
          <div>Normales</div>
          <div>Noctorunas</div>
          <div>Transnoche</div>
          <div>Totales</div>
        </div>

        {shifts.map((shift, index) => (
          <div
            key={index}
            className="grid grid-cols-7 text-right odd:bg-green-100 hover:bg-green-300 cursor-pointer"
          >
            <div className="border p-1 text-left">
              {new Date(shift.shift_date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="border p-1">{formatTime(shift.enter)}</div>
            <div className="border p-1">{formatTime(shift.exit)}</div>
            <div className="border p-1">{shift.regular_hours}</div>
            <div className="border p-1">{shift.night_hours}</div>
            <div className="border p-1">{shift.overnight_hours}</div>
            <div className="border p-1">{shift.total_hours}</div>
          </div>
        ))}
        <div className="grid grid-cols-7 text-right font-bold bg-gray-100">
          <div className="border p-1 col-span-4">
            {shifts
              .reduce((sum, shift) => sum + shift.regular_hours, 0)
              .toFixed(2)}
          </div>
          <div className="border p-1">
            {shifts
              .reduce((sum, shift) => sum + shift.night_hours, 0)
              .toFixed(2)}
          </div>
          <div className="border p-1">
            {shifts
              .reduce((sum, shift) => sum + shift.overnight_hours, 0)
              .toFixed(2)}
          </div>
          <div className="border p-1">
            {shifts
              .reduce((sum, shift) => sum + shift.total_hours, 0)
              .toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
