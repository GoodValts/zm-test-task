class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Ivan: add method
  get stringify() {
    return JSON.stringify(this);
  }
}

class Thing {
  constructor(position, number) {
    this.x = position.x;
    this.y = position.y;
    this.number = number;
  }

  get position() {
    return new Position(this.x, this.y);
  }
}

class LevelMap {
  constructor(things) {
    this._columns = Math.max(...things.map((thing) => thing.x)) + 1;
    this._rows = Math.max(...things.map((thing) => thing.y)) + 1;
    
    this.field = Array.from({length: this._columns}, () => Array(this._rows).fill(null));

    things.forEach(
      (el) =>
        (this.field[el.y][el.x] = new Thing({ x: el.x, y: el.y }, el.number))
    );
  }

  canConnect(thing1, thing2) {
    if (thing1 === null || thing2 === null) return false;

    const neighbors = new Set();
    const visited = new Set();

    const deltaArr = [
      { y: -1, x: 0 },
      { y: 1, x: 0 },
      { y: 0, x: -1 },
      { y: 0, x: 1 },
    ];

    const queue = [thing1.position];

    while (queue.length) {
      const nodePosition = queue.shift();

      if (!visited.has(nodePosition.stringify)) {
        visited.add(nodePosition.stringify);

        for (let delta of deltaArr) {
          const newY = nodePosition.y + delta.y;
          const newX = nodePosition.x + delta.x;
          
          if (this.field[newY] && this.field[newY][newX] !== undefined) {
            if (this.field[newY][newX]) {
              neighbors.add(this.field[newY][newX].position.stringify);

              if (neighbors.has(thing2.position.stringify)) {
                return true;
              }
            } else {
              queue.push(new Position(newX, newY));
            }
          }
        }
      }
    }

    return false;
  }

  print() {
    let s = "";
    for (let y = this._rows - 1; y >= 0; --y) {
      for (let x = 0; x < this._columns; ++x) {
        s += null === this.field[y][x] ? "■" : this.field[y][x].number;
      }
      s += "\n";
    }

    console.log(s);
  }
}

const levelMap = new LevelMap([
  { x: 4, y: 4, number: 9 },
  { x: 4, y: 6, number: 9 },
  { x: 2, y: 2, number: 1 },
  { x: 3, y: 2, number: 2 },
  { x: 2, y: 3, number: 2 },
  { x: 3, y: 3, number: 3 },
  { x: 6, y: 3, number: 4 },
  { x: 2, y: 4, number: 5 },
  { x: 3, y: 4, number: 6 },
  { x: 5, y: 4, number: 6 },
  { x: 6, y: 4, number: 7 },
  { x: 3, y: 5, number: 4 },
  { x: 4, y: 5, number: 8 },
  { x: 5, y: 5, number: 7 },
  { x: 6, y: 5, number: 1 },
  { x: 3, y: 6, number: 3 },
  { x: 5, y: 6, number: 8 },
  { x: 6, y: 6, number: 5 },
]);

levelMap.print();

console.log(levelMap.canConnect(levelMap.field[6][4], levelMap.field[3][6]));