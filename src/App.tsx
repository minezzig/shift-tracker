import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    enter: "",
    exit: "",
  });
  const [total, setTotal] = useState({regular: "", night: "", total: ""});

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

      if (updatedFormData.enter && updatedFormData.exit) calcShift(updatedFormData)
    
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

    
    const HORAS_NOCTURNAS = 22
    
    // calc regular hours worked 
    const totalRegularMinutesWorked = HORAS_NOCTURNAS * 60 - enterTotalMinutes;
    const regularHoursWorked = Math.floor(totalRegularMinutesWorked / 60)
    const regularMinutesWorked = Math.floor(totalRegularMinutesWorked % 60)
    
    // calc hora nocturnas worked 
    let totalNightMinutesWorked = exitTotalMinutes - HORAS_NOCTURNAS * 60
    if (totalNightMinutesWorked < 0) totalNightMinutesWorked += 24 * 60;
    const nightHoursWorked = Math.floor(totalNightMinutesWorked / 60);
    const nightMinutesWorked = Math.floor(totalNightMinutesWorked % 60);


    // calc general total hours
    let totalMinutesWorked = exitTotalMinutes - enterTotalMinutes;
    if (totalMinutesWorked < 0) totalMinutesWorked += 24 * 60;
    const hoursWorked = Math.floor(totalMinutesWorked / 60);
    const minutesWorked = Math.floor(totalMinutesWorked % 60);

    setTotal((prev) => ({
      ...prev, 
      regular: `${regularHoursWorked}h ${regularMinutesWorked}m`,
      night: `${nightHoursWorked}h ${nightMinutesWorked}m`,
      total: `${hoursWorked}h ${minutesWorked}m`
    }));    
    // setTotal(`regular hours: ${regularHoursWorked}h ${regularMinutesWorked}m, night hours: ${nightHoursWorked}h ${nightMinutesWorked}m`);

  }
  console.log(formData)
  return (
    <>
      <div className="text-blue-500">Select your hours worked today</div>
      <form>
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
        <h1>{total.regular}</h1>
        <h1>{total.night}</h1>
        <h1 className="font-bold">{total.total}</h1>
      </form>
    </>
  );
}

export default App;
