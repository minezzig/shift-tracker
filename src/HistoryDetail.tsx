import { useParams } from "react-router";
import getShiftById from "./api/getShift";
import { useEffect, useState } from "react";
import { formatTime } from "./utilities/formatTime";
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

export default function HistoryDetail() {
  const { id } = useParams();
  const [shift, setShift] = useState<Shift | undefined>();
  const [error, setError] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    if (user && id) {
      async function getShift() {
        const shiftData = await getShiftById(id as string, user);
        if (shiftData) {
          setShift(shiftData);
        } else {
          setError("Shift not found");
        }
      }
      getShift();
    }
  }, [id, user]);

  return (
    <div>
      <h1>Shift Details</h1>
      {shift ? (
        <div>
          <p>shift_date: {shift.shift_date.split("T")[0]}</p>
          <p>enter: {formatTime(shift.enter)}</p>
          <p>exit: {formatTime(shift.exit)}</p>
          <p>regular_hours: {shift.regular_hours}</p>
          <p>night_hours: {shift.night_hours} </p>
          <p>overnight_hours: {shift.overnight_hours}</p>
          <p>total_hours: {shift.total_hours}</p>
        </div>
      ) : (
        <div>{error}</div>
      )}
    </div>
  );
}
