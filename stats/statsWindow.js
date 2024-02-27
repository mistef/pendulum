var statsWindow = document.getElementById("statsWindow");

var showStats = document.getElementById("showStats");

var span = document.getElementsByClassName("close")[0];

showStats.onclick = function() {
    statsWindow.style.display = "block";
}

span.onclick = function() {
    statsWindow.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == statsWindow) {
        statsWindow.style.display = "none";
    }
}


var ctx = document.getElementById("histoChart").getContext('2d');
var dataValues = [12, 19, 3, 5];
var dataLabels = [0, 1, 2, 3, 4];
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
    labels: dataLabels,
    datasets: [{
        label: 'Group A',
        data: dataValues,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        xAxisID: "xA",
        barPercentage: 1,
        categoryPercentage: 1,
    }]
    },
    options: {
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            displayColors: false
        }
    },
    scales: {
        xA: {
          display: false,
          max: 3,
          position: 'bottom'
        },

        x: {
          display: true,
          offset: false,
          grid: {
              offset: false
          }
        },
    
        y: {
          ticks: {
            beginAtZero: true
          }
        }
    
      }
    },
    responsive: true,
    maintainAspectRatio: false
});
