import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    enter: "",
    exit: "",
  });
  const [total, setTotal] = useState("...hours");

  // date variables
  const today = new Date();
  const day = today.getDay();
  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  // days of week array
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // onChange, update formData stAte
  const handleChange = (e) => {
    setFormData((prev) => { 
      const updatedFormData = {...prev, [e.target.name]: e.target.value }

      if (e.target.name === "exit" && updatedFormData.enter) calcShift(updatedFormData)
    
        return updatedFormData
    });
   
  };


  const calcShift = ({enter, exit}) => {
    // if data missing
    if (!enter || !exit) return;
    // turn string into hours and numbers with type number;
    const [enterHours, enterMinutes] = enter.split(":").map(Number);
    const [exitHours, exitMinutes] = exit.split(":").map(Number);

    // convert to minutes
    const enterTotalMinutes = enterHours * 60 + enterMinutes;
    const exitTotalMinutes = exitHours * 60 + exitMinutes;

    let totalMinutesWorked = exitTotalMinutes - enterTotalMinutes;

    // account for working an overnight shift
    if (totalMinutesWorked < 0) totalMinutesWorked += 24 * 60;

    const hoursWorked = Math.floor(totalMinutesWorked / 60);
    const minutesWorked = totalMinutesWorked % 60;

    setTotal(`${hoursWorked} hours and ${minutesWorked} minutes`);

  }
  console.log(formData)
  return (
    <>
      <div className="text-blue-500">Select your hours worked today</div>
      <form onSubmit={calcShift}>
        <div>
          {weekDays[day]}, {date}-{month}-{year}
        </div>
        <input
          type="date"
          value={formData.date}
          onChange={handleChange}
          name="date"
        />
        <div>
          Entrar:{" "}
          <input
            type="time"
            name="enter"
            value={formData.enter}
            onChange={handleChange}
          />
        </div>
        <div>
          Salir:{" "}
          <input
            type="time"
            name="exit"
            value={formData.exit}
            onChange={handleChange}
          />
        </div>
        {/* <button type="submit">Calc shfit</button> */}
        <h1>{total}</h1>
      </form>
    </>
  );
}

export default App;
