import { useEffect, useState } from "react";
import getShifts from "./api/getShifts";
import { formatTime } from "./utilities/formatTime";
import { Eclipse, Edit, Edit2, Moon, Sun, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

interface Shift {
  shift_date: string;
  enter: string;
  exit: string;
  regular_hours: number;
  night_hours: number;
  overnight_hours: number;
  total_hours: number;
  id: number;
}

export default function AllHistory() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchShifts() {
      try {
        const data = await getShifts();
        setShifts(data ?? []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchShifts();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1>AllHistory</h1>
      <div className="border border-black  m-5 text-[10px]">
        <div className="grid grid-cols-7 text-center font-bold bg-gray-100 p-2">
          <div>Fecha</div>
          <div>Entrada</div>
          <div>Salida</div>
          <div className="m-auto">
            <Sun className="size-4"/>
          </div>
          <div className="m-auto"><Eclipse className="size-4"/></div>
          <div className="m-auto"><Moon className="size-4" /></div>
          <div>Totales</div>
        </div>

        {shifts.map((shift, index) => (
          <div
            key={index}
            className="grid grid-cols-7 text-right odd:bg-green-100 hover:bg-green-300 cursor-pointer"
            onClick={() => navigate(`/history/${shift.id}`)}
          >
            <div className="border p-1 text-left">
              {new Date(shift.shift_date).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
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
      <div className="flex gap-1 my-5 items-center">
        <Sun />
        <span className="mr-3 text-xs">8h-22h</span>
        <Eclipse />
        <span className="mr-3 text-xs">22h-24h</span>
        <Moon />
        <span className="mr-3 text-xs">24h-8h</span>
      </div>
    </div>
  );
}
