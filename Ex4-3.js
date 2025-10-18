/* Exercise 4.3 — D3 set up
   --------------------------------------------------------
   Step 2: Create a responsive SVG inside .responsive-svg-container
   Step 3: Add a test rectangle
*/

document.addEventListener("DOMContentLoaded", () => {
  // Select the responsive container (matches your HTML)
  const container = d3.select(".responsive-svg-container");

  // STEP 2: Append an SVG with a viewBox so it scales with the container
  // (The brief shows "0 0 1200 1600" — using that tall ratio so you can see resizing.)
  const svg = container
    .append("svg")
    .attr("viewBox", "0 0 1200 600");  // coordinate system
    // Border is handled in CSS; if you want it via JS instead, uncomment next line:
    // .style("border", "1px solid black")
    ;

  // Text label (handy to confirm coordinates)
  svg.append("text")
    .attr("x", 16)
    .attr("y", 48)
    .attr("fill", "#cfe1ff")
    .attr("font-family", "ui-monospace, Menlo, Consolas, monospace")
    .attr("font-size", 28)
    .text("Responsive SVG (viewBox 0 0 1200 1600)");

  // STEP 3: Add a test rectangle (as per brief values)
  svg.append("rect")
    .attr("x", 10)
    .attr("y", 80)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue"); // keep 'blue' to match the instruction sample
    // If you want it to match your accent instead, use: .attr("fill", "#7aa2ff");
});
