document.addEventListener("DOMContentLoaded", function() {
    const analyzeBtn = document.getElementById("analyzeBtn2");
    const symbolInput = document.getElementById("symbolInput2");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const currentPrice = document.getElementById("currentPrice2");
    const volume = document.getElementById("volume2");

    let priceChart = null;
    let volumeChart = null;

    analyzeBtn.addEventListener("click", () => {
        const symbol = symbolInput.value;
        if (!symbol) {
            alert("Please enter a stock symbol.");
            return;
        }

        loadingIndicator.style.display = "block";

        const apiKey = "";
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                loadingIndicator.style.display = "none";

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
    });

    function updateChart(chart, canvasId, labels, data, label) {
        if (chart) {
            chart.destroy(); 
        }

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
