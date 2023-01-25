import React, { useEffect, useRef } from "react";

type Props = {
  data: ParsedData;
};
export type ParsedData = {
  numbers: number[];
  title: string;
};
type BoxPlotData = {
  min: number;
  max: number;
  median: number;
  quartiles: [number, number];
};

export default function BoxPlot({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const margin = 10;
  const intervalWitdh = 25;

  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("BoxPlot useEffect canvasRef.current");
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
    console.log(data.title);
    drawBoxPlot(ctx, drawData, height, intervalWitdh, margin);
  }, [data]);

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

    console.log(data);
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

  return (
    <div className="box">
      {/* <div>{data.title}</div> */}
      <canvas
        ref={canvasRef}
        height={75}
        width={margin * 2 + 10 * intervalWitdh}></canvas>
    </div>
  );
}
