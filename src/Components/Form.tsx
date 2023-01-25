import React from "react";

type Props = {
  numbers: number[];
  setNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  dataEditingIndex: number;
  setDataEditingIndex: React.Dispatch<React.SetStateAction<number>>;
  createNewPlot: () => void;
};

export default function Form({
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
    console.log(e.currentTarget.dataset);
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
          <button onClick={createNewPlot}>
            {dataEditingIndex != -1 ? "Edit " + dataEditingIndex : "Create"}
          </button>
          <button
            onClick={() => {
              setDataEditingIndex(-1);
              setNumbers([]);
            }}>
            Unlink
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
