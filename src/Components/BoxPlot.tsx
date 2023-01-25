import React, { useEffect, useRef } from "react";

type Props = {
  data: ParsedData;
  allData: ParsedData[];
  deleteBoxPlot: (index: number) => void;
  setNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  setDataEditingIndex: React.Dispatch<React.SetStateAction<number>>;
};
export type ParsedData = {
  numbers: number[];
  title: string;
  index: number;
};
type BoxPlotData = {
  min: number;
  max: number;
  median: number;
  quartiles: [number, number];
};

export default function BoxPlot({
  data,
  allData,
  deleteBoxPlot,
  setNumbers,
  setDataEditingIndex,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const margin = 10;
  const intervalWitdh = 25;

  useEffect(() => {
    console.log("data changed");
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const drawData = getData();
    const height = ctx.canvas.height - 40;

    // make background blue
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //draw the number line
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    for (let i = 0; i <= 10; i++) {
      ctx.textAlign = "center";
      ctx.fillText(
        i.toString(),
        i * intervalWitdh + margin,
        ctx.canvas.height - 5
      );
      ctx.fillRect(i * intervalWitdh + margin, ctx.canvas.height - 25, 1, 5);
    }
    ctx.fillRect(margin, ctx.canvas.height - 20, 10 * intervalWitdh + 1, 3);

    // draw the title
    // ctx.textAlign = "left";
    // make text bold
    ctx.font = "bold 15px Arial";
    ctx.fillText(data.title, ctx.canvas.width / 2, 20);

    drawBoxPlot(ctx, drawData, height, intervalWitdh, margin);
  }, [allData]);

  function drawBoxPlot(
    ctx: CanvasRenderingContext2D,
    data: BoxPlotData,
    height: number,
    intervalWitdh: number,
    margin: number
  ) {
    // draw main line
    ctx.fillRect(
      margin + data.min * intervalWitdh,
      height + 1,
      (data.max - data.min) * intervalWitdh,
      2.5
    );

    const whiskersHeight = 10;

    // draw quartiles
    // color blue
    ctx.fillStyle = "blue";
    ctx.fillRect(
      margin + data.quartiles[0] * intervalWitdh,
      height - whiskersHeight / 4,
      intervalWitdh * (data.median - data.quartiles[0]),
      whiskersHeight
    );

    // color red
    ctx.fillStyle = "red";
    // draw other quartile
    ctx.fillRect(
      margin + data.median * intervalWitdh,
      height - whiskersHeight / 4,
      intervalWitdh * (data.quartiles[1] - data.median),
      whiskersHeight
    );

    // color black
    ctx.fillStyle = "black";
    // draw median

    ctx.fillRect(
      margin + data.median * intervalWitdh,
      height - whiskersHeight / 4,
      3,
      whiskersHeight
    );

    // draw whiskers
    ctx.fillRect(
      margin + data.min * intervalWitdh,
      height - whiskersHeight / 4,
      2,
      whiskersHeight
    );
    ctx.fillRect(
      margin + data.max * intervalWitdh,
      height - whiskersHeight / 4,
      2,
      whiskersHeight
    );

    // create text above the median
    ctx.textAlign = "center";
    ctx.font = "10px Arial";
    ctx.fillText(
      data.median.toString(),
      margin + data.median * intervalWitdh,
      height - whiskersHeight / 2
    );
  }

  function getData(): BoxPlotData {
    // sort the data
    const sortedData = data.numbers.sort((a, b) => a - b);

    // find the center of the sorted data
    const center = (values: number[]) => (values.length - 1) / 2;
    // check if the data has an even number of values
    const isEven = (values: number[]) => values.length % 2 === 0;

    // find the median value
    const medianFunc = (values: number[]) => {
      // find the center index of the sorted data
      const centerIndex = center(values);
      // if the data has an even number of values, take the average of the
      // two center values
      if (isEven(values)) {
        return (
          (values[Math.floor(centerIndex)] + values[Math.ceil(centerIndex)]) / 2
        );
      }
      // if the data has an odd number of values, take the value at the center index
      return values[Math.floor(centerIndex)];
    };

    // get the median value
    const median = medianFunc(sortedData);

    // return the min, max, median, and quartiles
    return {
      min: Math.min(...sortedData),
      max: Math.max(...sortedData),
      median,

      quartiles: [
        medianFunc(sortedData.slice(0, Math.ceil(center(sortedData)))),
        medianFunc(
          sortedData.slice(
            Math.ceil(center(sortedData)) + (isEven(sortedData) ? 0 : 1)
          )
        ),
      ],
    };
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setDataEditingIndex(data.index);
    setNumbers(data.numbers);
  };

  return (
    <div className="box">
      {/* <div>{data.title}</div> */}
      <canvas
        onClick={handleClick}
        ref={canvasRef}
        height={75}
        width={margin * 2 + 10 * intervalWitdh}></canvas>
      {/* add button with trash icon */}
      <button
        className="deleteButton"
        onClick={deleteBoxPlot.bind(null, data.index)}>
        <svg
          fill="#fff"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 490.646 490.646">
          <g>
            <g>
              <path
                d="M399.179,67.285l-74.794,0.033L324.356,0L166.214,0.066l0.029,67.318l-74.802,0.033l0.025,62.914h307.739L399.179,67.285z
			 M198.28,32.11l94.03-0.041l0.017,35.262l-94.03,0.041L198.28,32.11z"
              />
              <path
                d="M91.465,490.646h307.739V146.359H91.465V490.646z M317.461,193.372h16.028v250.259h-16.028V193.372L317.461,193.372z
			 M237.321,193.372h16.028v250.259h-16.028V193.372L237.321,193.372z M157.18,193.372h16.028v250.259H157.18V193.372z"
              />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
