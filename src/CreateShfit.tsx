import React, { useState } from "react";
import { hmFormat } from "./utilities/hmFormat";
import addShift from "./api/addShift";
import Success from "./Success";

interface CalcShiftProps {
  enter: string;
  exit: string;
}
const FULL_DAY = 1440; // Total mins in a day (24 * 60)
const NIGHT_START = 22 * 60; // 22:00 in minutes (1320)
const OVERNIGHT_START = 1440; // 24:00 in minutes (1440)
const OVERNIGHT_END = 8 * 60; // 08:00 in minutes (480)

export default function CreateShfit() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    enter: "",
    exit: "",
  });
  const [errors, setErrors] = useState({
    enter: false,
    exit: false,
  });
  const [total, setTotal] = useState({
    regular: 0,
    night: 0,
    overnight: 0,
    total: 0,
  });
  const [success, setSuccess] = useState(false);

  // onChange, update formData stAte
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors({
      enter: false,
      exit: false,
    });
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      if (updatedFormData.enter && updatedFormData.exit)
        calcShift(updatedFormData);

      return updatedFormData;
    });
  };

  const calcShift = ({ enter, exit }: CalcShiftProps) => {
    // turn string into hours and numbers with type number;
    const [enterHours, enterMinutes] = enter.split(":").map(Number);
    const [exitHours, exitMinutes] = exit.split(":").map(Number);

    // convert to minutes
    const enterTotalMinutes = enterHours * 60 + enterMinutes;
    let exitTotalMinutes = exitHours * 60 + exitMinutes;
    // if the shift goes over midnight, add 24 hours
    if (exitTotalMinutes < enterTotalMinutes) exitTotalMinutes += FULL_DAY;

    // calc general total minutes worked and set counters,
    let dayMins = 0;
    let nightMins = 0;
    let overnightMins = 0;

    // loop through minutes worked from start to finish, add to category if time falls within restraints
    for (let time = enterTotalMinutes; time <= exitTotalMinutes; time++) {
      if (time > 0 && time < OVERNIGHT_END) overnightMins += 1;
      else if (time > OVERNIGHT_END && time < NIGHT_START) dayMins += 1;
      else if (time >= NIGHT_START && time < OVERNIGHT_START) nightMins += 1;
      else if (time > OVERNIGHT_START) overnightMins += 1;
    }

    // calc decimal hours worked for each type, round to two decimals
    const regularHoursWorked = Math.round((dayMins / 60) * 100) / 100;
    const nightHoursWorked = Math.round((nightMins / 60) * 100) / 100;
    const overnightHoursWorked = Math.round((overnightMins / 60) * 100) / 100;
    const hoursWorked = Math.round((regularHoursWorked + nightHoursWorked + overnightHoursWorked) * 100) / 100;


    // set state with each category of horus worked
    setTotal((prev) => ({
      ...prev,
      regular: regularHoursWorked,
      night: nightHoursWorked,
      overnight: overnightHoursWorked,
      total: hoursWorked,
    }));
  };

  const validate = () => {
    if (!formData.enter) {
      setErrors((prev) => ({ ...prev, enter: true }));
    }
    if (!formData.exit) {
      setErrors((prev) => ({ ...prev, exit: true }));
    }
    // will return true if there is any error
    return errors.enter || errors.exit;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if there any validation errors, will not submit
    if (validate()) return;

    const enterTimestamp = new Date(
      `${formData.date}T${formData.enter}:00`
    ).toISOString();
    let exitTimestamp = new Date(
      `${formData.date}T${formData.exit}:00`
    ).toISOString();
    // adjust date/time stamp to next day if passes midnight
    if (formData.exit < formData.enter) {
      const exitDateObject = new Date(exitTimestamp);
      exitDateObject.setDate(exitDateObject.getDate() + 1);
      exitTimestamp = exitDateObject.toISOString();
    }

    // create an newShift object to update database
    const newShift = {
      shift_date: formData.date,
      enter: enterTimestamp,
      exit: exitTimestamp,
      regular_hours: total.regular,
      night_hours: total.night,
      overnight_hours: total.overnight,
      total_hours: total.total,
    };

    // add shift to database
    addShift(newShift);
    // open modal
    setSuccess(true);
    // reset form data
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      enter: "",
      exit: "",
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div className="flex flex-col relative">
          <label htmlFor="enter">Entrar</label>
          <input
            type="time"
            name="enter"
            value={formData.enter}
            onChange={handleChange}
          />
          <div className="-bottom-5 right-0 text-xs text-red-500 mt-1 absolute">
            {errors.enter && "Hora de entrada requerida"}
          </div>
        </div>
        <div className="flex flex-col relative">
          <label htmlFor="exit">Salir:</label>
          <input
            type="time"
            name="exit"
            value={formData.exit}
            onChange={handleChange}
          />
          <div className="-bottom-5 right-0 text-xs text-red-500 mt-1 absolute">
            {errors.exit && "Hora de salida requerida"}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            value={formData.date}
            onChange={handleChange}
            name="date"
          />
        </div>
        <button
          type="submit"
          className="submit border border-black p-3 mt-3 w-full cursor-pointer"
        >
          Ingresar turno
        </button>
      </form>
      {success && <Success setSuccess={setSuccess} total={total.total} />}
    </div>
  );
}
