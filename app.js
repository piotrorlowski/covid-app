const elements = [
  'btnFetch',
  'start',
  'end',
  'container',
];

const [btnFetch, start, end, container] = elements.map(element => document.getElementById(element));

const options = {
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },
  title: {
    text: 'COVID'
  },
  subtitle: {
    text: 'Cases in Poland'
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

const fetchData = () => {
  const startVal = start.value;
  const endVal = end.value;
  const url = `https://api.covid19api.com/country/poland/status/confirmed/live?from=${startVal}&to=${endVal}`;
  fetch(url)
    .then(response => response.json())
    .then(result => {
        const cases = result.map(item => item.Cases);
        const startDate = startVal.split('-');
        const pointStart = startVal && endVal ? Date.UTC(Number(startDate[0]), Number(startDate[1] - 1), Number(startDate[2])) : Date.UTC(2020, 2, 1);
        const newOptions = {
          plotOptions: {
            series: {
                pointStart,
                pointInterval: 24 * 3600 * 1000,
            }
          },
          series: [{
            type: 'column',
            yAxiis: 0,
            name: 'Cases',
            data: cases,
          }]
        };
        chart.update(newOptions);
    }).catch(error => {
      console.log(error);
    });
};


btnFetch.addEventListener('click', fetchData);

