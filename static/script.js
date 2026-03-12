document.addEventListener("DOMContentLoaded", function() {
    const analyzeBtn = document.getElementById("analyzeBtn2");
    const symbolInput = document.getElementById("symbolInput2");
    const timeframeDropdown = document.getElementById("timeframeSelect2");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const currentPrice = document.getElementById("currentPrice2");
    const volume = document.getElementById("volume2");

    let priceChart = null;
    let volumeChart = null;

    function fetchAndUpdate(symbol, timeframe) {
        if (!symbol) {
            alert("Please enter a stock symbol.");
            return;
        }

        loadingIndicator.style.display = "block";

        fetch(`/stock?symbol=${symbol}`)
            .then(response => response.json())
            .then(data => {
                loadingIndicator.style.display = "none";

                if (!data["Time Series (Daily)"]) {
                    alert("Failed to fetch stock data. Check symbol or API limit.");
                    return;
                }

                const timeSeries = data["Time Series (Daily)"];
                let dates = Object.keys(timeSeries).sort((a,b) => new Date(a) - new Date(b));
                let prices = dates.map(d => parseFloat(timeSeries[d]["4. close"]));
                let volumes = dates.map(d => parseFloat(timeSeries[d]["5. volume"]));

                // Slice based on timeframe
                let points = { "1D": 1, "1W": 7, "1M": 30, "3M": 90 }[timeframe];
                dates = dates.slice(-points);
                prices = prices.slice(-points);
                volumes = volumes.slice(-points);

                currentPrice.innerText = `$${prices[prices.length - 1]}`;
                volume.innerText = volumes[volumes.length - 1];

                priceChart = updateChart(priceChart, "priceChart2", dates, prices, "Price ($)");
                volumeChart = updateChart(volumeChart, "volumeChart2", dates, volumes, "Volume");
            })
            .catch(err => {
                loadingIndicator.style.display = "none";
                alert("Failed to fetch stock data. Please try again.");
                console.error(err);
            });
    }

    analyzeBtn.addEventListener("click", () => {
        const symbol = symbolInput.value.trim().toUpperCase();
        const timeframe = timeframeDropdown.value;
        fetchAndUpdate(symbol, timeframe);
    });

    timeframeDropdown.addEventListener("change", () => {
        const symbol = symbolInput.value.trim().toUpperCase();
        const timeframe = timeframeDropdown.value;
        fetchAndUpdate(symbol, timeframe);
    });

    function updateChart(chart, canvasId, labels, data, label) {
        if (chart) chart.destroy();
        const ctx = document.getElementById(canvasId).getContext("2d");
        return new Chart(ctx, {
            type: "line",
            data: { labels, datasets: [{ label, data, borderColor: "blue", backgroundColor: "rgba(0,123,255,0.2)", fill: true }] },
            options: { responsive: true, scales: { x: { display:true, title:{display:true, text:"Date"} }, y:{display:true, title:{display:true,text:label}} } }
        });
    }
});