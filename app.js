const elements = [
  'btnFetch',
  'country',
  'start',
  'end',
  'container',
  'error',
];

const [btnFetch, country, start, end, container, error] = elements.map(element => document.getElementById(element));

const options = {
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },
  title: {
    text: 'COVID cases chart'
  },
  subtitle: {
    text: ''
  },
  yAxis: {
    title: {
      text: 'Number of cases'
    }
  },
  xAxis: {
    type: 'datetime',
  },
  plotOptions: {
    series: {
        pointStart: Date.UTC(2020, 2, 1),
        pointInterval: 24 * 3600 * 1000,
    }
  },
  series: [{
    data: []
  }],
};

const chart = Highcharts.chart('container', options);

const fetchData = (event) => {
  error.innerText = "";
  event.preventDefault();
  const countryVal = country.value ? country.value : 'Poland';
  const startVal = start.value;
  const endVal = end.value;
  if (!startVal && !endVal) {
    error.innerText = 'Start/End Dates required';
    return
  }
  let myChart = document.getElementById('myChart');
  myChart.remove();


  const url = `https://api.covid19api.com/country/${countryVal}/status/confirmed/live?from=${startVal}&to=${endVal}`;
  fetch(url)
    .then(response => response.json())
    .then(result => {
      const cases = result.map(item => item.Cases);
      const startDate = startVal.split('-');
      const pointStart = Date.UTC(Number(startDate[0]), Number(startDate[1] - 1), Number(startDate[2]));
      const newOptions = {
          subtitle: {
            text: `Cases in ${countryVal}`
          },
          plotOptions: {
            series: {
                pointStart,
                pointInterval: 24 * 3600 * 1000,
            }
          },
          series: [{
            type: 'line',
            yAxiis: 0,
            name: 'Cases',
            data: cases,
          }]
        };
      chart.update(newOptions, true, true);
      
      const labels = result.map(item => item.Date);

      const data = {
        labels: labels,
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: cases,
        }]
      };

      const config = {
        type: 'line',
        data: data,
        options: {}
      };

      const body = document.getElementById('body');
      const canvas = document.createElement('canvas')
      myChart = body.appendChild(canvas);
      myChart.setAttribute('id', 'myChart');

      new Chart(myChart, config);

    }).catch(error => {
      console.log(error);
    });
};


btnFetch.addEventListener('click', fetchData);

