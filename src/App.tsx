import React, { useState } from "react";
import { hmFormat } from "./utilities/hmFormat";
import { weekDays, months } from "./utilities/days-months";
import addShift from "./api/addShift";

interface CalcShiftProps {
  enter: string;
  exit: string;
}
const FULL_DAY = 1440; // Total mins in a day (24 * 60)
const NIGHT_START = 22 * 60; // 22:00 in minutes (1320)
const OVERNIGHT_START = 1440; // 24:00 in minutes (1440)
const OVERNIGHT_END = 8 * 60; // 08:00 in minutes (480)

function App() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    enter: "",
    exit: "",
  });
  const [total, setTotal] = useState({ regular: 0, night: 0, overnight: 0, total: 0 });

  // date variables
  const today = new Date();
  const day = today.getDay();
  const date = today.getDate();
  const month = today.getMonth();

  // onChange, update formData stAte
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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
    let totalMinutesWorked = exitTotalMinutes - enterTotalMinutes;
    let dayMins = 0;
    let nightMins = 0;
    let overnightMins = 0;

    // loop through minutes worked from start to finish, add to category if time falls within restraints
    for(let time = enterTotalMinutes; time <= exitTotalMinutes; time++){
      if(time > 0 && time < OVERNIGHT_END) overnightMins += 1
      else if(time > OVERNIGHT_END && time < NIGHT_START) dayMins += 1
      else if(time >= NIGHT_START && time < OVERNIGHT_START) nightMins += 1
      else if(time > OVERNIGHT_START) overnightMins += 1
    }

    // calc decimal hours worked for each type, round to two decimals
    const regularHoursWorked = Math.round((dayMins / 60) * 100) / 100;
    const nightHoursWorked = Math.round((nightMins / 60) * 100) / 100;
    const overnightHoursWorked = Math.round((overnightMins / 60) * 100) / 100;
    const hoursWorked = Math.round((totalMinutesWorked / 60) * 100) / 100;

    // set state with each category of horus worked
    setTotal((prev) => ({
      ...prev,
      regular: regularHoursWorked,
      night: nightHoursWorked,
      overnight: overnightHoursWorked,
      total: hoursWorked,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const enterTimestamp = new Date(`${formData.date}T${formData.enter}:00`).toISOString();
    let exitTimestamp = new Date(`${formData.date}T${formData.exit}:00`).toISOString();
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

    addShift(newShift)
  };

  return (
    
      <div className="flex justify-center h-full">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-2xl">
            {weekDays[day]}, {date} de {months[month + 1]}
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
          <div className="flex flex-col">
            <label htmlFor="enter">Entrar</label>
            <input
              type="time"
              name="enter"
              value={formData.enter}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="exit">Salir:</label>
            <input
              type="time"
              name="exit"
              value={formData.exit}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit border border-black p-3 w-full cursor-pointer">
            Ingresar turno
          </button>
          {total.total > 0 && (
            <div>
              <h1>{hmFormat(total.regular)}</h1>
              <h1>{hmFormat(total.night)}</h1>
              <h1>{hmFormat(total.overnight)}</h1>
              <h1 className="font-bold">{total.total}</h1>
            </div>
          )}
        </form>
      </div>
  
  );
}

export default App;

// import { useState } from "react";
// import NewTest from "./NewTest";

// const FULL_DAY = 1440; // Total minutes in a day (24 * 60)
// const NIGHT_START = 22 * 60; // 22:00 in minutes (1320)
// const NIGHT_END = 6 * 60; // 06:00 in minutes (360)

// function App() {
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().slice(0, 10),
//     enter: "",
//     exit: "",
//   });
//   const [total, setTotal] = useState({ regular: "", night: "", total: "" });

//   // date variables
//   const today = new Date();
//   const day = today.getDay();
//   const date = today.getDate();
//   const month = today.getMonth();
//   const year = today.getFullYear();

//   // days of week array
//   const weekDays = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   // onChange, update formData stAte
//   const handleChange = (e) => {
//     setFormData((prev) => {
//       const updatedFormData = { ...prev, [e.target.name]: e.target.value };

//       if (updatedFormData.enter && updatedFormData.exit)
//         calcShift(updatedFormData);

//       return updatedFormData;
//     });
//   };

//   const calcShift = ({ enter, exit }) => {

//     // if data missing
//     if (!enter || !exit) return;
//     // turn string into hours and numbers with type number;
//     const [enterHours, enterMinutes] = enter.split(":").map(Number);
//     const [exitHours, exitMinutes] = exit.split(":").map(Number);

//     // convert to minutes
//     const enterTotalMinutes = enterHours * 60 + enterMinutes;
//     let exitTotalMinutes = exitHours * 60 + exitMinutes;

//     // if the shift goes over midnight, add 24 hours
//     if (exitTotalMinutes < enterTotalMinutes) exitTotalMinutes += FULL_DAY;

//     // calc general total minutes worked,
//     let totalMinutesWorked = exitTotalMinutes - enterTotalMinutes;
//     let nightMinutes = 0;
//     let regularMinutes = 0;

//     // all regular hours
//     if (enterTotalMinutes >= NIGHT_END && exitTotalMinutes <= NIGHT_START) {
//       regularMinutes = totalMinutesWorked;

//     }
//     // all night hours
//     else if (
//       enterTotalMinutes >= NIGHT_START &&
//       (exitTotalMinutes <= NIGHT_END || exitTotalMinutes <= NIGHT_END + FULL_DAY)) {
//         nightMinutes = totalMinutesWorked;
//     }
//     // both regular and night hours
//     else {
//       // regular hours
//       if (enterTotalMinutes < NIGHT_START) {
//         let regularEnd = Math.min(exitTotalMinutes, NIGHT_START);
//         regularMinutes = regularEnd - enterTotalMinutes;
//       }

//       // night hours
//       if (exitTotalMinutes > NIGHT_START) {
//         let nightStart = Math.max(enterTotalMinutes, NIGHT_START);
//         let nightEnd = Math.min(exitTotalMinutes, NIGHT_END + FULL_DAY);
//         nightMinutes = nightEnd - nightStart;
//         // add remainer wee morning hours to regular hours count
//         if (exitTotalMinutes > nightEnd) regularMinutes += exitTotalMinutes - FULL_DAY - NIGHT_END;
//       }

//       // Night portion before 06:00
//       if (enterTotalMinutes < NIGHT_END) {
//         let nightStart = enterTotalMinutes;
//         let nightEnd = Math.min(exitTotalMinutes, NIGHT_END);
//         nightMinutes += nightEnd - nightStart;
//       }
//     }

//     const regularHoursWorked = Math.floor(regularMinutes / 60);
//     const regularMinutesWorked = regularMinutes % 60;
//     const nightHoursWorked = Math.floor(nightMinutes / 60);
//     const nightMinutesWorked = nightMinutes % 60;
//     const hoursWorked = Math.floor(totalMinutesWorked / 60);
//     const minutesWorked = totalMinutesWorked % 60;

//     setTotal((prev) => ({
//       ...prev,
//       regular: `${regularHoursWorked}h ${regularMinutesWorked}m`,
//       night: `${nightHoursWorked}h ${nightMinutesWorked}m`,
//       total: `${hoursWorked}h ${minutesWorked}m`,
//     }));
//     console.log(new Date(year, month, date, ...formData.enter.split(":").map(Number)));
//   };

//   return (
//     <>
//       <div className="text-blue-500">Select your hours worked today</div>
//       <form>
//         <div>
//           {weekDays[day]}, {date}-{month + 1}-{year}
//         </div>
//         <input
//           type="date"
//           value={formData.date}
//           onChange={handleChange}
//           name="date"
//         />
//         <div>
//           Entrar:{" "}
//           <input
//             type="time"
//             name="enter"
//             value={formData.enter}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           Salir:{" "}
//           <input
//             type="time"
//             name="exit"
//             value={formData.exit}
//             onChange={handleChange}
//           />
//         </div>
//         {/* <button type="submit">Calc shfit</button> */}
//         <h1>{total.regular}</h1>
//         <h1>{total.night}</h1>
//         <h1 className="font-bold">{total.total}</h1>
//       </form>
//       <NewTest />
//     </>
//   );
// }

// export default App;
