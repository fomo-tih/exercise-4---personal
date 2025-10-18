/* Exercise 4.4 — One JS file that loads either EX4.csv (TV Brands) or Task_2.4_data.csv (Wombats)
   Folder structure:
   /Exercise4/
     Exercise-4.4.html
     Exercise-4.4.js   <-- this file
     exercise4-4.css
     style.css
     /data/
       EX4.csv
       Task_2.4_data.csv
*/

(function(){
  // --- Register datasets here ---
  const DATASETS = {
    tv: {
      name: "TV Brands (ex4.7.csv)",
      path: "Ex4.7.csv",
      preferredCategorical: ["brand","technology","name","model"], // try these first as categorical
    },
    wombats: {
      name: "Wombats (Ex4.4_Data.csv)",
      path: "Ex4.4_Data.csv",
      preferredCategorical: [], // single numeric column dataset
    }
  };

  // Cache UI
  const previewEl = d3.select("#preview");
  const statsEl   = d3.select("#stats");
  const badgeEl   = d3.select("#current-ds");

  // Dataset toggle buttons
  d3.selectAll(".ds-btn").on("click", function(){
    const key = this.getAttribute("data-key");
    // a11y pressed states
    d3.selectAll(".ds-btn").attr("aria-pressed", "false").classed("is-active", false);
    d3.select(this).attr("aria-pressed", "true").classed("is-active", true);

    loadDataset(key);
  });

  // Load default dataset (TV)
  loadDataset("tv");

  // ---------- Core loader ----------
  function loadDataset(key){
    const cfg = DATASETS[key];
    if(!cfg){ 
      console.warn("Unknown dataset key:", key); 
      return; 
    }

    badgeEl.text(`Current: ${cfg.name}`);
    previewEl.html(""); 
    statsEl.html("");

    d3.csv(cfg.path).then(raw => {
      if(!raw.length){ 
        previewEl.html(`<p class="note">No rows in <code>${cfg.path}</code>.</p>`); 
        return; 
      }

      // Columns; d3.csv attaches .columns in most cases
      const cols = raw.columns ?? Object.keys(raw[0]);

      // Coerce numeric-like fields to numbers (conservatively)
      const data = raw.map(row => coerceRow(row, cols));

      console.group(`✅ Loaded ${cfg.name}`);
      console.log("Columns:", cols);
      console.log("Sample row:", data[0]);
      console.log("All data:", data);
      console.groupEnd();

      // Pick likely categorical column (stringy). Prefer known names.
      const catCol  = pickCategoryColumn(data, cols, cfg.preferredCategorical);
      const numCols = cols.filter(c => isMostlyNumeric(data, c));

      console.log("Inferred categorical column:", catCol ?? "(none)");
      console.log("Inferred numeric columns:", numCols);

      // Render small on-page preview and stats
      renderPreview(data.slice(0, 10), cols);
      renderStats(data, cols, catCol, numCols);
    }).catch(err => {
      console.error("CSV load error:", err);
      previewEl.html(
        `<p class="note">⚠️ Could not load <code>${cfg.path}</code>. Ensure Live Server is running and the path is correct.</p>`
      );
    });
  }

  // ---------- Helpers ----------
  function coerceRow(row, columns){
    const out = {};
    columns.forEach(col => {
      const v = row[col];
      // keep null/empty as-is
      if(v === "" || v === null || v === undefined){
        out[col] = v;
        return;
      }
      const parsed = +v;
      // If it's safely numeric (no trailing letters etc.), use number; else keep original string
      out[col] = Number.isFinite(parsed) && String(v).trim() !== "" ? parsed : v;
    });
    return out;
  }

  function isMostlyNumeric(data, col){
    let total = 0, numeric = 0;
    for(const d of data){
      const v = d[col];
      if(v !== "" && v !== null && v !== undefined){
        total++;
        if(Number.isFinite(+v)) numeric++;
      }
    }
    return total > 0 && (numeric/total) > 0.65; // 65%+ numeric → treat as number
  }

  function pickCategoryColumn(data, cols, preferredList){
    // preferred names first
    for(const name of preferredList){
      if(cols.includes(name) && !isMostlyNumeric(data, name)) return name;
    }
    // otherwise the first clearly non-numeric column
    return cols.find(c => !isMostlyNumeric(data, c)) || null;
  }

  function renderPreview(rows, columns){
    if(!rows.length){
      previewEl.html(`<p class="note">No rows to preview.</p>`);
      return;
    }
    const table = previewEl.append("table");
    const thead = table.append("thead").append("tr");
    thead.selectAll("th").data(columns).enter().append("th").text(d => d);

    const tbody = table.append("tbody");
    const tr = tbody.selectAll("tr").data(rows).enter().append("tr");
    tr.selectAll("td")
      .data(r => columns.map(c => r[c]))
      .enter().append("td")
      .text(d => d);
  }

  function renderStats(data, cols, catCol, numCols){
    const lines = [];
    lines.push(`rows: ${data.length}`);
    lines.push(`columns: ${cols.length}`);

    if(catCol){
      const uniq = new Set(
        data.map(d => d[catCol]).filter(v => v !== "" && v !== null && v !== undefined)
      );
      lines.push(`unique ${catCol}: ${uniq.size}`);
    }

    // show quick min / max for up to 2 numeric cols
    numCols.slice(0,2).forEach(c => {
      const vals = data.map(d => +d[c]).filter(Number.isFinite);
      if(vals.length){
        lines.push(`${c} → min: ${d3.min(vals)}, max: ${d3.max(vals)}, extent: [${d3.extent(vals)}]`);
      }
    });

    statsEl.html(lines.map(s => `• ${s}`).join("<br>"));
  }
})();
