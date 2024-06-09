
import { object, parameters, switchAutoMeasurement} from './main.js'

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

let isRecording = false;
document.getElementById("startHistogramRec").onclick = function() {
    if((parameters.time != 0 || Math.abs(object.x)<0.02)&&(!isRecording)){
        Swal.fire({
            html: `
            Για να εκκινήσει η μέτρηση πρέπει:<br> <br>
            1. Nα είναι σταμματημένος ο χρόνος <br> <br>
            2. Nα έχει τοποθετηθει το εκκρεμές σε μια κατάσταση με αρχικές συνθήκες.
          `});
    }
    else if (!isRecording){
        //document.getElementById("osc1").click(); //set one oscilation
        document.getElementById("resetButton").click();
        switchAutoMeasurement();
        document.getElementById("startHistogramRec").textContent = "Σταμάτημα Μέτρησης"
        isRecording = true;
    }
    else if (isRecording){
        switchAutoMeasurement();
        document.getElementById("startHistogramRec").textContent = "Εκκίνηση Μετρήσεων"
        isRecording = false;
    }

}

var ctx = document.getElementById("histoChart").getContext('2d');
var dataValues = [12, 19, 3, 5];
var dataLabels = [1.7, 1.8, 1.9, 2, 2.1, 2.2];
let chartLimits = {
    min:1,
    max:2,
    bins:10
}
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
    labels: dataLabels,
    datasets: [{
        //label: 'Group A',
        data: dataValues,
        backgroundColor: 'rgba(50, 50, 255, 1)',
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
            displayColors: false,
            callbacks: {
                label: function(context) {
                    const label = '';
                    return "";
                },
                title: function(context){
                    //console.log(context)
                    return context[0].parsed.y;
                }
            }
        }
    },
    scales: {
        xA: {
          display: false,
          max: 4, //dataLabels length - 2
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



let table = new DataTable('#measurementsTable', {
    info: false,
    locale: 'gr',
    paging: false,
    searching: false,
    ordering: false,
    order : [],
    language: {
        decimal: ',',
        thousands: '.',
        emptyTable: "Δεν έχουν καταγραφεί μετρήσεις"
    },
    select: true,
    stateSave: true,
    stateSaveParams : function (settings, data) {
        data.search.search = "";
      }
});

export function addNewMeasurement(x, alsoTable=true) {
    let num;
    if(alsoTable){
        table.row
        .add([x])
        .draw(true);
        num = Number(x.replace(",","."));
        data.push(num);
        myChart.data.datasets[0].data[findIndexOfLabel(num, labels)]++;
        myChart.update();
    }
    else{
        data.push(x);
        myChart.data.datasets[0].data[findIndexOfLabel(x, labels)]++;
        myChart.update();
    }
    

}

//on del key press remove rows
$(document).on('keyup', function ( e ) {
    if ( e.keyCode === 46  && table.rows( { selected: true } ).any() ) { // 46 == delete key
        table.rows('.selected').remove().draw(false);
        //clearAndUpdateChart();
    }
  } );


let labels;
let data = [];
dataValues = [];

function setChartLabels(from, to, bins){
    labels = Array.from({length: bins + 1}, (x, i) => i); //from 0 to bins
    dataValues = []
    for (let i = 0; i<labels.length; i++){
        labels[i] = Math.round((from + i*(to-from)/bins)*100)/100;
        dataValues.push(0);
    }
    dataValues.pop();
    myChart.data.labels = labels;
    myChart.options.scales['xA'].max = bins-1;
    myChart.data.datasets[0].data = dataValues;
    // zeroChart();
    // dataLabels = [1.7, 1.8, 1.9, 2, 2.1, 2.3];
    // dataValues = [20, 20, 20, 20];
    // myChart.data.labels = dataLabels;
    // //console.log(myChart.data.datasets[0].data[0]);
    // myChart.data.datasets[0].data[0]++;
    myChart.update();
}


function addData(label, newData) {
    myChart.data.labels.push(label);
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    myChart.update();
}


function removeData() {
    myChart.data.labels.pop();
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    myChart.update();
}

function findIndexOfLabel(value, labels){
    if (value < labels[0]){
        return -1;
    }
    for (let i = 1; i < labels.length; i++){
        if (value < labels[i]){
            return (i-1);
        }
    }
    return -1;
}
// function zeroChart(){
//     for (let i = 0; i < myChart.data.datasets[0].data.length; i++){
//         myChart.data.datasets[0].data[i] = 0;
//     }
// }
//removeData();
setChartLabels(1, 2, 10);

//setChartLabels(0.3, 1.3, 20);
// addData(myChart, 3, 14) ;


$(document).on('keyup', function ( e ) { //when pressing del delete row
    if ( e.keyCode === 46  && table.rows( { selected: true } ).any() ) { // 46 == delete key
        table.rows('.selected').remove().draw(false);
        clearAndUpdateChart();
    }
  } );

  const deleteSelected = document.getElementById("deleteSelected");

deleteSelected.addEventListener('click', function() {
    table.rows('.selected').remove().draw(false);
    clearAndUpdateChart();
});

const deleteEverything = document.getElementById("deleteEverything");

deleteEverything.addEventListener('click', function() {
    table.rows().remove().draw(false);
    clearAndUpdateChart();
});

function clearAndUpdateChart(){
    data.length = 0;
    let bars = myChart.data.datasets[0].data.length;
    for(let i = 0; i < bars; i++){
        myChart.data.datasets[0].data[i]=0;
    }
    
    let data2 = table.rows().data();

    for(let i = 0; i < data2.length; i++){
        addNewMeasurement(parseNum(data2[i][0]), false);
    }
}

function addData2(chart, x, values) {

    values.push(x);
    sessionStorage.setItem("chartData", values);
    chart.update();
}

function parseNum (string){
    return parseFloat(string.replace(".", "").replace(",", "."));
}

document.getElementById("binSlider").addEventListener("input", function(){
    chartLimits.bins = Number(this.value);
    document.getElementById("binNumberText").textContent = this.value;
    
    setChartLabels(chartLimits.min, chartLimits.max, chartLimits.bins);
    clearAndUpdateChart();
});

document.getElementById("fromHisto").addEventListener("change", function(){
    chartLimits.min = Number(this.value)
    setChartLabels(chartLimits.min, chartLimits.max, chartLimits.bins);
    clearAndUpdateChart();
});

document.getElementById("untilHisto").addEventListener("change", function(){
    chartLimits.max = Number(this.value)
    setChartLabels(chartLimits.min, chartLimits.max, chartLimits.bins);
    clearAndUpdateChart();
});