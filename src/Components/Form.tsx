import React from "react";
import { ParsedData } from "./BoxPlot";

type Props = {
  numbers: number[];
  setNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  dataEditingIndex: number;
  setDataEditingIndex: React.Dispatch<React.SetStateAction<number>>;
  data: ParsedData[];
  createNewPlot: () => void;
};

export default function Form({
  data,
  numbers,
  setNumbers,
  createNewPlot,
  dataEditingIndex,
  setDataEditingIndex,
}: Props) {
  const [currentNumber, setCurrentNumber] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // send the numbers to the parent component or use them in the component

    if (currentNumber === "") {
      return;
    }

    setNumbers([...numbers, +currentNumber]);
    // set value to empty string
    setCurrentNumber("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      isNaN(+e.target.value) ||
      ((+e.target.value > 10 || +e.target.value < 0) && e.target.value !== "")
    ) {
      return;
    }
    setCurrentNumber(e.target.value);
    // setNumbers([...numbers, +e.target.value]);
  };

  const removeItemFromNumbers = (e: React.MouseEvent<HTMLSpanElement>) => {
    const index = +(e.currentTarget.dataset.i || 0);
    const newNumbers = [...numbers];
    newNumbers.splice(index, 1);
    setNumbers(newNumbers);
  };

  return (
    <>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label>
            Input numbers:
            <input
              type="text"
              value={currentNumber}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Add number</button>
          <button
            onClick={() => {
              setNumbers([]);
            }}>
            Clear
          </button>
          <button onClick={createNewPlot}>
            {dataEditingIndex != -1
              ? "Edit " + data.find((i) => i.index === dataEditingIndex)?.title
              : "Create new"}
          </button>
          <button
            onClick={() => {
              if (dataEditingIndex === -1) return;
              setDataEditingIndex(-1);
              setNumbers([]);
            }}>
            Stop editing
          </button>
        </form>
        <div className="numberList">
          {numbers.length > 0
            ? numbers.map((n, i) => (
                <>
                  <span
                    className="number"
                    onClick={removeItemFromNumbers}
                    data-i={i}>
                    {n}
                  </span>
                  {i === numbers.length - 1 ? "" : ", "}
                </>
              ))
            : "No numbers"}
        </div>
      </div>
    </>
  );
}
