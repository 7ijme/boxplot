import React, { useEffect } from "react";
import BoxPlot, { ParsedData } from "./BoxPlot";
import Form from "./Form";
import "../Styles/Container.css";

type Props = {};

export default function Container({}: Props) {
  // use state for data
  const [data, setData] = React.useState<ParsedData[]>([
    {
      title: "Wiskunde",
      numbers: [10, 10, 10, 9.6, 9.1, 8.7],
      index: 0,
    },
    {
      title: "Scheikunde",
      numbers: [8.6, 9.1, 10, 10],
      index: 1,
    },
    {
      title: "Natuurkunde",
      numbers: [6.8, 8.2, 10, 10],
      index: 2,
    },
    {
      title: "Aardrijkskunde",
      numbers: [9, 8.9, 10],
      index: 3,
    },
    {
      title: "Engels",
      numbers: [9.6, 8.4, 9.5, 8.1],
      index: 4,
    },
    {
      title: "Nederlands",
      numbers: [7.5, 7.5, 8.5],
      index: 5,
    },
    {
      title: "Frans",
      numbers: [6.6, 9.1],
      index: 6,
    },
  ]);
  const [numbers, setNumbers] = React.useState<number[]>([]);
  const [hasGottenData, setHasGottenData] = React.useState(false);
  const [dataEditingIndex, setDataEditingIndex] = React.useState<number>(-1);

  useEffect(() => {
    // get data from local storage
    const data = localStorage.getItem("data");
    if (data) {
      setData(JSON.parse(data));
    }
    setHasGottenData(true);
  }, []);

  useEffect(() => {
    // set data to local storage

    if (!hasGottenData) return;
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  const createNewPlot = () => {
    if (dataEditingIndex === -1) {
      const title = prompt("Enter a title for the new plot");
      if (title === null) {
        return;
      }
      const newData: ParsedData = {
        title,
        numbers,
        index: Math.max(...Object.values(data).map((d) => d.index)) + 1,
      };
      setData([...data, newData]);
      setNumbers([]);
    } else {
      const title = prompt(
        "Enter a title for the new plot",
        data[dataEditingIndex].title
      );

      const newData = [...data].map((d) => {
        if (d.index === dataEditingIndex) {
          d.numbers = numbers;
          d.title = title ?? d.title;
        }
        return d;
      });

      setData(newData);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Boxplots van cijfers</h1>
      </header>
      <Form
        data={data}
        numbers={numbers}
        setNumbers={setNumbers}
        createNewPlot={createNewPlot}
        dataEditingIndex={dataEditingIndex}
        setDataEditingIndex={setDataEditingIndex}
      />
      <div className="box-plots">
        {data.map((d, i) => (
          <BoxPlot
            setNumbers={setNumbers}
            key={i}
            data-index={i}
            data={d}
            allData={data}
            setDataEditingIndex={setDataEditingIndex}
            deleteBoxPlot={(index: number) => {
              const newData: ParsedData[] = Object.values(data).filter(
                (d) => d.index !== index
              );
              setData(newData);
              setDataEditingIndex(-1);
              setNumbers([]);
            }}
          />
        ))}
      </div>
      <div className="aditional-features">
        <a
          href={
            (
              document.querySelector(
                `canvas[data-index="${dataEditingIndex}"]`
              ) as HTMLCanvasElement
            )?.toDataURL("image/png") || ""
          }
          className="button"
          download={
            dataEditingIndex !== -1
              ? `${data.find((i) => i.index === dataEditingIndex)?.title}.png`
              : "boxplot.png"
          }
          onClick={(e) => {
            if (dataEditingIndex === -1) e.preventDefault();
          }}>
          Save as image
        </a>
        <button
          onClick={() => {
            localStorage.clear();
            // reload page
            window.location.reload();
          }}>
          Clear data
        </button>
      </div>

      <footer>
        <code>
          Created with vite + React + TypeScript <br />
          <a
            href="https://github.com/7ijme/boxplot"
            target="_blank">
            Source
          </a>
          {" • "}
          By Tijme
        </code>
      </footer>
    </div>
  );
}
