// Exercise 4.7 — Improved dynamic layout (auto height for large dataset)

const builtInData = [
  { label:"samsung", count:1005 },
  { label:"lg", count:614 },
  { label:"kogan", count:596 },
  { label:"other", count:262 },
  { label:"hisense", count:206 },
  { label:"philips", count:151 },
  { label:"sony", count:96 },
  { label:"eko", count:94 },
  { label:"tcl", count:91 }
];

const SVG_W = 750;
const BASE_HEIGHT = 480;
const MARGIN = { top: 30, right: 40, bottom: 40, left: 130 };

const svg = d3.select("#chart")
  .attr("width", SVG_W)
  .attr("height", BASE_HEIGHT)
  .attr("viewBox", `0 0 ${SVG_W} ${BASE_HEIGHT}`)
  .attr("preserveAspectRatio", "xMinYMin meet");

// Reusable renderer
function render(data) {
  svg.selectAll("*").remove();

  // Auto height — if many bars, extend container
  const barHeight = 24;      // height of each bar
  const barSpacing = 10;     // spacing between bars
  const innerH = data.length * (barHeight + barSpacing);
  const totalH = innerH + MARGIN.top + MARGIN.bottom;
  svg.attr("viewBox", `0 0 ${SVG_W} ${Math.max(totalH, BASE_HEIGHT)}`);

  const chart = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);
  const innerW = SVG_W - MARGIN.left - MARGIN.right;

  // scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([0, innerW]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerH])
    .padding(0.2);

  // group each bar + labels
  const barAndLabel = chart.selectAll(".bar-group")
    .data(data)
    .join("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(0,${yScale(d.label)})`);

  // bars
  barAndLabel.append("rect")
    .attr("class", "bar")
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "#29b76f")
    .attr("rx", 4);

  // brand text (left)
  barAndLabel.append("text")
    .text(d => d.label)
    .attr("x", -10)
    .attr("y", yScale.bandwidth() / 1.5)
    .attr("text-anchor", "end")
    .attr("fill", "#e8f0ff")
    .style("font-family", "sans-serif")
    .style("font-size", "13px");

  // count text (right)
  barAndLabel.append("text")
    .text(d => d3.format(".1f")(d.count))
    .attr("x", d => xScale(d.count) + 6)
    .attr("y", yScale.bandwidth() / 1.5)
    .attr("fill", "#fff")
    .style("font-family", "sans-serif")
    .style("font-size", "13px");
}

// Load Energy CSV
async function loadEx4() {
  const rows = await d3.csv("Ex4.7.csv");
  const data = rows
    .map(r => ({
      label: r.brand?.trim() ?? "Unknown",
      count: +r["Mean(energyConsumption)"]
    }))
    .filter(d => d.label && Number.isFinite(d.count))
    .sort((a,b) => d3.descending(a.count, b.count));
  return data;
}

// Buttons
document.getElementById("btn-built").addEventListener("click", () => render(builtInData));
document.getElementById("btn-ex4").addEventListener("click", async () => {
  try {
    const data = await loadEx4();
    render(data);
  } catch (e) {
    alert("Error loading ex4.csv");
    console.error(e);
  }
});

// Default view
render(builtInData);
