import RoyceHall from "@/app/assets/royce-hall.png";
import { useEffect, useRef, useState } from "react";

interface PaintByNumbersProps {}

export default function PaintByNumbers(props: PaintByNumbersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [scale, setScale] = useState(1);
    const [loaded, setLoaded] = useState(false);

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

            // Identify unique colors and map to numbers
            const colorMap = {};
            const nameMap = {};
            let colorNumber = 1;
            pixelArray.forEach((row) => {
                row.forEach((color) => {
                    if (!colorMap[color]) {
                        colorMap[color] = colorNumber++;
                        nameMap[colorMap[color]] = color;
                    }
                });
            });

            const pxs = [];
            pixelArray.forEach((row) => {
                const px = [];
                row.forEach((color) => {
                    px.push(colorMap[color]);
                });
                pxs.push(px);
            });

            // Loop through pxs, flood fill until all pxs are filled
            const visited = [];
            const toWrite = []; // [x, y, number]
            for (let y = 0; y < pxs.length; y++) {
                visited.push([]);
                for (let x = 0; x < pxs[y].length; x++) {
                    visited[y].push(false);
                }
            }
            for (let y = 0; y < pxs.length; y++) {
                for (let x = 0; x < pxs[y].length; x++) {
                    if (visited[y][x]) continue;
                    const target = pxs[y][x];
                    const queue = [[x, y]];
                    const v = [];
                    let minX = x;
                    let minY = y;
                    let maxX = x;
                    let maxY = y;
                    while (queue.length > 0) {
                        const [x, y] = queue.shift();
                        if (
                            y < 0 ||
                            y >= pxs.length ||
                            x < 0 ||
                            x >= pxs[y].length ||
                            visited[y][x] ||
                            pxs[y][x] !== target
                        ) {
                            continue;
                        }
                        visited[y][x] = true;
                        v.push([x, y]);
                        queue.push([x - 1, y]);
                        queue.push([x + 1, y]);
                        queue.push([x, y - 1]);
                        queue.push([x, y + 1]);
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                    const midX = Math.floor((minX + maxX) / 2);
                    const midY = Math.floor((minY + maxY) / 2);
                    // if (v.indexOf([midX, midY]) !== -1) {
                    //     toWrite.push([midX, midY, target]);
                    //     continue;
                    // }

                    // Pick 10 random points, find closest to center point, and use that
                    const points = [
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                        v[Math.floor(Math.random() * v.length)],
                    ];
                    const distances = points.map(([x, y]) => {
                        return Math.sqrt(
                            (midX - x) * (midX - x) + (midY - y) * (midY - y)
                        );
                    });
                    const closest =
                        points[distances.indexOf(Math.min(...distances))];
                    toWrite.push([closest[0], closest[1], target]);
                }
            }

            // Redraw canvas with borders and numbers
            canvas.height = img.height * scale;
            canvas.width = img.width * scale;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pixelArray.forEach((row, y) => {
                row.forEach((color, x) => {
                    // If any of the 4 directions is a different color, draw a border
                    const neighbors = [
                        pixelArray[y - 1]?.[x],
                        pixelArray[y + 1]?.[x],
                        pixelArray[y]?.[x - 1],
                        pixelArray[y]?.[x + 1],
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

            canvas.addEventListener("click", (event) => {
                // Get canvas position
                const rect = canvas.getBoundingClientRect();

                // Calculate x and y relative to the canvas
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                console.log(`Clicked at: (${x}, ${y})`);
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "red";
                ctx.fillRect(x / 0.5, y / 0.5, 10, 10);
            });

            setLoaded(true);
        };
    });

    return (
        <div className="aspect-video bg-white shadow-lg rounded-lg h-2/3 w-full overflow-scroll">
            {!loaded && (
                <div className="flex flex-row items-center justify-center w-screen pt-32">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            )}
            <div
                className={`inline-block overflow-hidden w-[${width}px] h-[${height}px] ${loaded ? "" : "hidden"}`}
            >
                <canvas id="canvas" ref={canvasRef}></canvas>
            </div>
        </div>
    );
}
