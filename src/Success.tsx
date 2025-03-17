import { Dispatch, SetStateAction } from "react";

interface SuccessProps {
  setSuccess: Dispatch<SetStateAction<boolean>>;
  total: number;
}

export default function Success({ setSuccess, total }: SuccessProps) {
  return (
    <div className="absolute inset-0 flex justify-center top-1/3">
      <div className="bg-white rounded-lg w-[250px] h-[200px] flex flex-col items-center justify-center gap-3">
        <div>Turno guardado</div>
        <div className="font-bold"> {total} horas </div>
        <button
          className="border rounded-3xl hover:bg-green-500 bg-green-400 text-white px-5 py-1"
          onClick={() => setSuccess(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
