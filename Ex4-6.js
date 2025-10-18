// ===== Exercise 4.6: Scaling charts =========================================
// Reuse or extend your data from Exercise 4.5
const data = [
  { label: "OLED", count: 1005 },
  { label: "LCD",  count: 614 },
  { label: "QLED", count: 596 },
  { label: "MiniLED", count: 262 },
  { label: "Plasma", count: 260 },
  { label: "MicroLED", count: 151 },
  { label: "CRT", count: 96 },
  { label: "DLP", count: 94 },
  { label: "Laser", count: 91 },
  { label: "Other", count: 84 },
  { label: "NanoCell", count: 740 },
  { label: "AMOLED", count: 830 },
  { label: "QuantumDot", count: 920 },
  { label: "Projector", count: 390 },
  { label: "LED", count: 430 }
];

// === SVG setup ===
const SVG_W = 600;   // intentionally small to test scaling
const SVG_H = 500;

const svg = d3.select("#chart")
  .attr("viewBox", `0 0 ${SVG_W} ${SVG_H}`)
  .attr("preserveAspectRatio", "xMinYMin meet");

// === STEP 1: Linear scale for counts (x-axis widths) ===
const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.count)])   // domain = [min,max] of counts
  .range([0, SVG_W - 100]);                 // range = pixels inside svg

// === STEP 2: Band scale for categories (y-axis positions) ===
const yScale = d3.scaleBand()
  .domain(data.map(d => d.label))            // one band per label
  .range([0, SVG_H - 50])                   // leave space at bottom
  .padding(0.15);                           // space between bars

// === Bind & draw bars ===
svg.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("class", d => `bar bar-${d.count}`)
  .attr("x", 80)                            // fixed left margin for labels later
  .attr("y", d => yScale(d.label))          // y position from band scale
  .attr("width", d => xScale(d.count))      // scaled width
  .attr("height", yScale.bandwidth());      // automatic bar height

// === Optional axes (for testing) ===
const xAxis = d3.axisBottom(xScale).ticks(5);
svg.append("g")
  .attr("transform", `translate(80,${SVG_H - 40})`)
  .call(xAxis);
