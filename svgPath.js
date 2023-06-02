export default class SvgPath {
  instructions = [];

  add(...values) {
    this.instructions.push(values);
  }

  result() {
    return this.instructions.map((arr) => arr.join(" ")).join(",");
  }

  clone() {
    const newPath = new SvgPath();
    newPath.instructions = this.instructions;
    return newPath;
  }

  move(x, y) {
    this.add("M", x, y);
    // addDot(x, y);
  }
  line(x, y) {
    this.add("L", x, y);
    // addDot(x, y);
  }

  curve(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.add("C", cp1x, cp1y, cp2x, cp2y, x, y);
    // addDot(cp1x, cp1y, { color: "green" });
    // addDot(cp2x, cp2y, { color: "green" });
    // addDot(x, y);
  }

  scurve(cp2x, cp2y, x, y) {
    this.add("S", cp2x, cp2y, x, y);
    // addDot(cp2x, cp2y, { color: "green" });
    // addDot(x, y);
  }

  end() {
    this.add("Z");
  }
}
