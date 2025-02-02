import RoyceHall from "@/app/assets/royce-hall.png";
import { useEffect, useRef, useState } from "react";

interface PaintByNumbersProps {}

export default function PaintByNumbers(props: PaintByNumbersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasFrameRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [scale, setScale] = useState(1);
    const [loaded, setLoaded] = useState(false);
    const [currentColor, setCurrentColor] = useState<number>(0);
    const [painted, setPainted] = useState<boolean[][]>([]);
    const [pxs, setPxs] = useState<number[][]>([]);
    const [nameMap, setNameMap] = useState<{ [key: number]: string }>({}); // number -> color
    const [colorList, setColorList] = useState<string[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = RoyceHall.src;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            setWidth(img.width);
            setHeight(img.height);
            ctx.drawImage(img, 0, 0);

            // Get image data
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            // Create 2D array of pixel values
            const pixelArray = [];
            for (let y = 0; y < img.height; y++) {
                const row = [];
                for (let x = 0; x < img.width; x++) {
                    const index = (y * img.width + x) * 4;
                    const color = `${data[index]},${data[index + 1]},${
                        data[index + 2]
                    }`;
                    row.push(color);
                }
                pixelArray.push(row);
            }
            console.log(pixelArray);

            // Identify unique colors and map to numbers
            const colorMap = {};
            const colorList = [];
            const nameMap = {};
            let colorNumber = 1;
            pixelArray.forEach((row) => {
                row.forEach((color) => {
                    if (!colorMap[color]) {
                        colorMap[color] = colorNumber++;
                        colorList.push(color);
                        nameMap[colorMap[color]] = color;
                    }
                });
            });

            const pixels = [];
            pixelArray.forEach((row) => {
                const px = [];
                row.forEach((color) => {
                    px.push(colorMap[color]);
                });
                pixels.push(px);
            });

            // Loop through pxs, flood fill until all pxs are filled
            const visited = [];
            const toWrite = []; // [x, y, number]
            for (let y = 0; y < pixels.length; y++) {
                visited.push([]);
                for (let x = 0; x < pixels[y].length; x++) {
                    visited[y].push(false);
                }
            }
            // console.log('hi');
            for (let y = 0; y < pixels.length; y++) {
                for (let x = 0; x < pixels[y].length; x++) {
                    if (visited[y][x]) continue;
                    const target = pixels[y][x];
                    const queue = [[x, y]];
                    const v = [];
                    while (queue.length > 0) {
                        // console.log(queue.length);
                        const [x, y] = queue.shift();
                        if (
                            y < 0 ||
                            y >= pixels.length ||
                            x < 0 ||
                            x >= pixels[y].length ||
                            visited[y][x] ||
                            pixels[y][x] !== target
                        ) {
                            continue;
                        }
                        visited[y][x] = true;
                        v.push([x, y]);
                        queue.push([x - 1, y]);
                        queue.push([x + 1, y]);
                        queue.push([x, y - 1]);
                        queue.push([x, y + 1]);
                    }

                    // Find the median point in v, where v is an array of [x, y]
                    const sortedX = [...v].sort((a, b) => a[0] - b[0]);
                    const sortedY = [...v].sort((a, b) => a[1] - b[1]);

                    // Compute the median x and y
                    const medianX = sortedX[Math.floor(sortedX.length / 2)][0];
                    const medianY = sortedY[Math.floor(sortedY.length / 2)][1];

                    // console.log(medianX, medianY, target);

                    toWrite.push([medianX, medianY, target]);
                }
            }
            // console.log('bye');

            // Redraw canvas with borders and numbers
            canvas.height = img.height * scale;
            canvas.width = img.width * scale;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pixels.forEach((row, y) => {
                row.forEach((color, x) => {
                    // If any of the 4 directions is a different color, draw a border
                    const neighbors = [
                        pixels[y - 1]?.[x],
                        pixels[y + 1]?.[x],
                        pixels[y]?.[x - 1],
                        pixels[y]?.[x + 1],
                    ];
                    if (neighbors.some((neighbor) => neighbor !== color)) {
                        ctx.fillStyle = "black";
                        ctx.fillRect(
                            x * scale,
                            y * scale,
                            1 * scale,
                            1 * scale
                        );
                    }
                });
            });

            // Draw numbers
            ctx.font = `10px Arial`;
            toWrite.forEach(([x, y, number]) => {
                ctx.fillStyle = "black";
                ctx.fillText(number, x - 5, y + 5);
            });

            canvasRef.current?.style.setProperty(
                "transform",
                `scale(${scale})`
            );
            canvasFrameRef.current?.style.setProperty(
                "width",
                `${imageData.width * scale}px`
            );
            canvasFrameRef.current?.style.setProperty(
                "height",
                `${imageData.height * scale}px`
            );

            const vis = [];
            for (let y = 0; y < pixels.length; y++) {
                vis.push([]);
                for (let x = 0; x < pixels[y].length; x++) {
                    vis[y].push(false);
                }
            }

            setPxs(pixels);
            setPainted(vis);
            setNameMap(nameMap);
            setColorList(colorList);
            // console.log('???');

            setLoaded(true);
        };
    }, []);

    useEffect(() => {
        canvasRef.current?.style.setProperty("transform", `scale(${scale})`);
        canvasFrameRef.current?.style.setProperty(
            "width",
            `${width * scale}px`
        );
        canvasFrameRef.current?.style.setProperty(
            "height",
            `${height * scale}px`
        );
    }, [scale]);

    const detectClick = (
        event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
        console.log("Clicked!");
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get canvas position
        const rect = canvas.getBoundingClientRect();

        // Calculate x and y relative to the canvas
        const rx = event.clientX - rect.left;
        const ry = event.clientY - rect.top;

        // Scale x and y to the original image size
        const x = Math.floor(rx / scale);
        const y = Math.floor(ry / scale);

        // Check if x and y has been visited or is the wrong color
        // console.log(painted[y][x], pxs[y][x], currentColor+1);
        if (painted[y][x] || pxs[y][x] !== currentColor + 1) return;

        // Perform flood fill
        const queue = [[x, y]];
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (
                y < 0 ||
                y >= pxs.length ||
                x < 0 ||
                x >= pxs[y].length ||
                painted[y][x] ||
                pxs[y][x] !== currentColor + 1
            ) {
                continue;
            }
            painted[y][x] = true;
            queue.push([x - 1, y]);
            queue.push([x + 1, y]);
            queue.push([x, y - 1]);
            queue.push([x, y + 1]);
        }
        setPainted(painted);
        repaintCanvas(pxs, painted);
    };

    const repaintCanvas = (pxs: number[][], painted: boolean[][]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Loop through canvas
        pxs.forEach((row, y) => {
            row.forEach((color, x) => {
                if (painted[y][x]) {
                    ctx.fillStyle = `rgb(${nameMap[color]})`;
                    ctx.fillRect(x, y, 1, 1);
                    // ctx.fillRect(x * scale, y * scale, 1 * scale, 1 * scale);
                }
            });
        });
    };

    return (
        <div className="flex flex-col items-center h-full">
            <div className="aspect-video bg-white shadow-lg rounded-lg max-h-[60vh] h-fit w-fit overflow-scroll">
                {!loaded && (
                    <div className="flex flex-row items-center justify-center w-screen pt-32">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    </div>
                )}
                <div
                    ref={canvasFrameRef}
                    className={`inline-block overflow-hidden w-[800px] h-[600px] ${
                        loaded ? "" : "hidden"
                    }`}
                >
                    <canvas
                        id="canvas"
                        ref={canvasRef}
                        className={`block origin-top-left`}
                        onClick={detectClick}
                    ></canvas>
                </div>
            </div>
            <div className="flex flex-col w-full mt-4 bg-slate-200 rounded-t-lg grow">
                <div className="flex flex-row items-center w-full justify-center space-y-2 my-4">
                    <p className="text-xl font-semibold text-black pr-10 w-[15rem]">
                        Zoom: {(scale * 100).toFixed(2)}%
                    </p>
                    <input
                        type="range"
                        min="25"
                        max="400"
                        value={scale * 100}
                        onChange={(e) => setScale(Number(e.target.value) / 100)}
                        className="w-64 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500 transition duration-200"
                    />
                </div>

                <div className="w-full h-16 overflow-scroll pt-1 px-2 grow">
                    <div className="grid grid-cols-5 gap-y-2 gap-x-4 w-full">
                        {colorList.map((color, i) => (
                            <div
                                key={color}
                                className="flex flex-col items-center space-y-2"
                            >
                                <button
                                    onClick={() => setCurrentColor(i)}
                                    className={`w-full h-8 rounded-lg ${
                                        currentColor === i
                                            ? "ring-4 ring-blue-500"
                                            : ""
                                    }`}
                                    style={{ backgroundColor: `rgb(${color})` }}
                                />
                                <span className="text-black font-medium">
                                    {i + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
