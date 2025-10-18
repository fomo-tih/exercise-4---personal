/* Exercise 4.2 — Manipulate and add elements with D3
   ---------------------------------------------------
   Step 2  : Apply style to an HTML element using D3
   Step 3  : Append an element using D3
   Step 4  : Append to an SVG using D3
*/

document.addEventListener("DOMContentLoaded", () => {
  // ===== Step 2: select an HTML element and change its style
  // Change only the title color to white
  d3.select("h1")
    .style("color", "#e6ecff")     // white title
    .style("letter-spacing", "0.3px");

  // ===== Step 3: append a new element and add text
  d3.select("#play")
    .append("p")
    .text("Purchasing a low energy consumption TV will help with your energy bills!");

  // ===== Step 4: append a rectangle to an SVG
  const svg = d3.select("#scene");

  svg.append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 120)
    .attr("height", 40)
    .style("fill", "green");

  svg.select("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .style("stroke", "#ffffff")
    .style("stroke-width", 2);

  svg.append("text")
    .attr("x", 50)
    .attr("y", 45)
    .attr("font-family", "ui-monospace, Menlo, Consolas")
    .attr("font-size", 12)
    .attr("fill", "#cfe1ff")
    .text('rect @ (x=50, y=50, w=120, h=40)');
});
