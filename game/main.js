const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const cntTextEl = document.querySelector(".counter");

let cnt = 0;

const deltaArr = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
];

const dict = {
    0: "#e81416",
    1: "#ff7f50",
    2: "#faeb36",
    3: "#79c314",
    4: "#487de7",
    5: "#70369d",
};

const field = Array.from({ length: 10 }, () => Array(10).fill(null));

for (let row = 0; row < 10; row += 1) {
    for (let col = 0; col < 10; col += 1) {
        field[row][col] = {
            row: row,
            col: col,
            type: Math.floor(Math.random() * Object.keys(dict).length),
        };
    }
}

console.log("field=", field);

function draw() {
    ctx.fillStyle = "#333";
    ctx.strokeStyle = "#696969";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    field.forEach((row) =>
        row.forEach((cell) => {
            ctx.beginPath();
            ctx.fillStyle = dict[cell.type];
            ctx.rect(
                (cell.col * canvas.width) / 10,
                (cell.row * canvas.width) / 10,
                canvas.width / 10,
                canvas.height / 10
            );
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        })
    );

    if (cnt) cntTextEl.textContent = `Moves: ${cnt}`;

    requestAnimationFrame(draw);
}
draw();

console.log("canvas=", canvas);

function onColorSelect(event) {
    const target = event.target;
    cnt += 1;
    
    if (target.dataset.color) {
        const selectedType = Number(target.dataset.color);

        const firstCellType = field[0][0].type;
        const visited = new Set();
        const queue = [{ row: 0, col: 0 }];

        while (queue.length) {
            const cell = queue.shift();

            if (!visited.has(JSON.stringify({ row: cell.row, col: cell.col }))) {
                visited.add(JSON.stringify({ row: cell.row, col: cell.col }));

                for (let delta of deltaArr) {
                    const newRow = cell.row + delta.row;
                    const newCol = cell.col + delta.col;

                    if (
                        field[newRow] &&
                        field[newRow][newCol] &&
                        field[newRow][newCol].type === firstCellType
                    ) {
                        queue.push({ row: newRow, col: newCol });
                    }
                }
            }
        }

        Array.from(visited)
            .map((cell) => JSON.parse(cell))
            .forEach((pos) => (field[pos.row][pos.col].type = selectedType));

        if (!field.flat().filter((cell) => cell.type !== selectedType).length)
            alert(`You won in ${cnt} moves!`);
    }
}

document.querySelectorAll(".color").forEach((element) => {
    element.addEventListener("click", onColorSelect);
});
