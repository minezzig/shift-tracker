import CreateShfit from "./CreateShfit";
import { weekDays, months } from "./utilities/days-months";

function App() {
  // date variables
  const today = new Date();
  const day = today.getDay();
  const date = today.getDate();
  const month = today.getMonth();
  return (
    <div className="flex h-full items-center flex-col">
      <div className="text-2xl">
        {weekDays[day]}, {date} de {months[month]}
      </div>
      <CreateShfit />
    </div>
  );
}

export default App;
