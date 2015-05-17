window.onload = function(){
  var socket = io.connect(document.origin);

  var data = [
    // Size of fuzzed packet
    {
      label: "Fuzzed Packet Sizes",
      values: [{ time: new Date().getTime(), y: 0}, { time: new Date().getTime(), y: 50}]
    },

  ];

    // populate history
    for(x=0;x<50; x++){
      data[0].values.push({time: new Date().getTime(), y:50+(x%2)})
    }


  var lineChart = $('#realtime').epoch({
      type: 'time.line',
      data: data,
      axes: ['right', 'bottom', 'left'],
      ticks: { time: 10, right: 5, left: 5 },
      fps: 60,
      windowSize:5
  });


  socket.on('packetSent', function (len, packets) {
    lineChart.push([{ time: new Date().getTime(), y: len}]);
    $('#packetsFuzzed').text(packets);
  });

  socket.on('fuzzDetails', function(fuzz){
    $('#host').text(fuzz.host);
    $('#port').text(fuzz.port);
    $('#delay').text(fuzz.delay);
  })


}
