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
    },
    {
      title: "Scheikunde",
      numbers: [8.6, 9.1, 10, 10],
    },
    {
      title: "Natuurkunde",
      numbers: [6.8, 8.2, 10, 10],
    },
    {
      title: "Aardrijkskunde",
      numbers: [9, 8.9, 10],
    },
    {
      title: "Frans",
      numbers: [6.6, 9.1],
    },
  ]);

  useEffect(() => {
    console.log("Container useEffect");
  }, []);

  return (
    <div className="container">
      <h1>Boxplots van cijfers profielkeuze Tijme</h1>
      {/* <Form /> */}
      <div className="box-plots">
        {data.map((d, i) => (
          <BoxPlot
            key={i}
            data={d}
            deleteBoxPlot={(title: string) => {
              const newData: ParsedData[] = Object.values(data).filter(
                (d) => d.title !== title
              );
              setData(newData);
            }}
          />
        ))}
      </div>
    </div>
  );
}
