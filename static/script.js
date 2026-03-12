document.addEventListener("DOMContentLoaded", function() {
    const analyzeBtn = document.getElementById("analyzeBtn2");
    const symbolInput = document.getElementById("symbolInput2");
    const dropdown = document.getElementById("symbolDropdown");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const currentPrice = document.getElementById("currentPrice2");
    const volume = document.getElementById("volume2");

    let priceChart = null;
    let volumeChart = null;

    function fetchAndUpdate(symbol) {
        if (!symbol) {
            alert("Please select a stock symbol.");
            return;
        }

        loadingIndicator.style.display = "block";

        fetch(`/stock?symbol=${symbol}`)
            .then(response => response.json())
            .then(data => {
                loadingIndicator.style.display = "none";

                if (!data["Time Series (Daily)"]) {
                    alert("Failed to fetch stock data. Check the symbol.");
                    return;
                }

                const timeSeries = data["Time Series (Daily)"];
                const dates = Object.keys(timeSeries).reverse();
                const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));
                const volumes = dates.map(date => parseFloat(timeSeries[date]["5. volume"]));

                currentPrice.innerText = `$${prices[prices.length - 1]}`;
                volume.innerText = volumes[volumes.length - 1];

                priceChart = updateChart(priceChart, "priceChart2", dates, prices, "Price ($)");
                volumeChart = updateChart(volumeChart, "volumeChart2", dates, volumes, "Volume");
            })
            .catch(error => {
                loadingIndicator.style.display = "none";
                alert("Failed to fetch stock data. Please try again.");
                console.error("Error fetching stock data:", error);
            });
    }

    // Button click
    analyzeBtn.addEventListener("click", () => {
        fetchAndUpdate(symbolInput.value);
    });

    // Dropdown change
    dropdown.addEventListener("change", () => {
        symbolInput.value = dropdown.value;  // optional: sync input with dropdown
        fetchAndUpdate(dropdown.value);
    });

    function updateChart(chart, canvasId, labels, data, label) {
        if (chart) chart.destroy();

        const ctx = document.getElementById(canvasId).getContext("2d");
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: "blue",
                    backgroundColor: "rgba(0, 123, 255, 0.2)",
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: true, title: { display: true, text: "Date" }},
                    y: { display: true, title: { display: true, text: label }}
                }
            }
        });
    }
});