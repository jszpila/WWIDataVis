(function() {
  $(function() {
    var $country = $('#display-country'),
      $type = $('#display-type'),
      w = $('#chart-container').width(),
      data = null;

    $country.on('change', updateChart);
    $type.on('change', updateChart);

    function updateChart() {
      d3.select('svg').remove();

      var country = $country.val(),
        type = $type.val(),
        subset = null,
        categories = ['Country'],
        plot = dimple.plot.bar,
        total = 0,
        notOk = 0;

      if (country !== 'all') {
        subset = $.grep(data, function(v) {
          if (v.Country === country) {
            if (v.Type !== 'Deployed') {
              notOk += parseInt(v.People);
              return true;
            } else {
              total = parseInt(v.People);
              return false;
            }
          } else {
            return false;
          }
        });

        subset.push({Country: country, Type: 'OK', People: total - notOk});

        plot = dimple.plot.pie;
        $type.attr('disabled','disabled');
      } else {
        subset = data;
        $type.val('all');
        $type.removeAttr('disabled');
      }

      if (type !== 'all') {
        subset = $.grep(subset, function(v) {
          return v.Type === type;
        });
      } else {
        categories.push('Type');
      }

      var svg = dimple.newSvg('#chart-container', w, 500),
        myChart = new dimple.chart(svg, subset);

      if (plot === dimple.plot.bar) {
        myChart.addCategoryAxis('x', categories);
        myChart.addMeasureAxis('y', 'People');
        myChart.addLegend(0, 10, 325, 20, 'center');
      } else {
        myChart.addMeasureAxis('p', 'People');
        myChart.addLegend(0, 10, 100, 100, 'center');
      }

      myChart.addSeries('Type', plot);
      myChart.setBounds(50, 30, w, 340);
      myChart.draw();
    };

    d3.csv('data/data.csv', function(d) {
      data = d;
      updateChart();
    });
  });
}).call(this);