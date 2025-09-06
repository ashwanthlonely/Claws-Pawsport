async function loadCafes() {
  const container = document.getElementById("cafes-container");

  try {
    const response = await fetch("data/cafes.csv"); // ✅ Correct path
    if (!response.ok) throw new Error("CSV file not found: " + response.status);

    const text = await response.text();

    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        if (!results.data.length) {
          container.innerHTML = "<p>No cafes found in the CSV file.</p>";
          return;
        }
        renderCafes(results.data);
      },
      error: function(err) {
        console.error("PapaParse error:", err);
        container.innerHTML = "<p>Error parsing the CSV file.</p>";
      }
    });
  } catch (e) {
    console.error("Fetch error:", e);
    container.innerHTML = "<p>Error loading cafes data.</p>";
  }
}

function renderCafes(data) {
  const container = document.getElementById("cafes-container");
  let html = "";

  data.forEach(row => {
    const cafeName = row["Cafe name"]?.trim() || "Unknown Cafe";
    const contact = row["Contact"]?.trim() || "-";
    const address = row["Address"]?.trim() || "-";
    const mapLink = row["Google Maps"]?.trim() || "#";

    html += `
      <div class="place-card">
        <h3>${cafeName}</h3>
        <p><b>Contact:</b> ${contact}</p>
        <p><b>Address:</b> ${address}</p>
        <a href="${mapLink}" target="_blank">📍 View on Google Maps</a>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Search functionality
document.addEventListener("input", function(e) {
  if (e.target.id === "searchInput") {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".place-card");
    cards.forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(query) ? "block" : "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", loadCafes);
