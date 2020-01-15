var samples = sampleData;

//-------------------------------------------------------------------
//  Initialize Function
//-------------------------------------------------------------------

function init() {

    samples.names.forEach(x => {
            d3.select("#selDataset").append("option")
            .attr("value", x)
            .text(x)
    });



    //  Horizontal Bar Chart
    //-------------------------------------------------------------------
    
    var topTenValues = samples.samples[0].sample_values.slice(0,10);
    var topTenOTUs = samples.samples[0].otu_ids.slice(0,10);
    
    hbarTrace1 = {
        type: "bar",
        x: topTenValues.reverse(),
        y: topTenOTUs.reverse().map(x => `OTU ${x}`),
        orientation: "h"
    };
    
    var hbarData = [hbarTrace1];
    
    hbarLayout = {
        title: `Top Ten OTUs for ${samples.samples[0].id}`,
        xaxis: {
            title: "Number of Colonies"
        },
        yaxis: {
            title: "OTU ID"
        }
    };
    
    Plotly.newPlot("hbar-plot", hbarData, hbarLayout);
    
    
    //  Bubble Chart
    //-------------------------------------------------------------------
    
    var bubbleTrace1 = {
        x: samples.samples[0].otu_ids,
        y: samples.samples[0].sample_values,
        mode: 'markers',
        marker: {
            size: samples.samples[0].sample_values,
            color: samples.samples[0].otu_ids,
            colorscale: 'Viridis'
        },
        text: samples.samples[0].otu_labels
    };
    
    var bubbleData = [bubbleTrace1];
    
    bubbleLayout = {
        title: `OTUs for ${samples.samples[0].id}`,
        xaxis: {
            title: "OTU ID"
        },
        yaxis: {
            title: "Number of Colonies"
        }
    };
    
    Plotly.newPlot("bubble-plot", bubbleData, bubbleLayout);

    //  Metadata Info Card
    //-------------------------------------------------------------------
    
    Object.entries(samples.metadata[0]).forEach(x => {
        d3.select(`#${x[0]}`).text(x[1])
    });
    
    
    //  Gauge Chart
    //-------------------------------------------------------------------
    
    var gaugeTrace = {
//        domain: { x: [0, 1], y: [0, 1]},
//        value: samples.metadata[0].wfreq,
//        title: {
//            text: "Weekly Hand Washing Frequency"
//        },
//        type: "indicator",
//        mode: "gauge+number",
//        gauge: {
//            axis: {
//                range: [null, 10]
//            },
//            bar: {
//                line: {
//                    width: 10
//                }
//            }
//        }
              type: 'pie',
      showlegend: false,
      hole: 0.4,
      rotation: 90,
      values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
      text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      direction: 'clockwise',
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['','','','','','','','','','white'],
        labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        hoverinfo: 'label'
      }
    };
    
    var gaugeData = [gaugeTrace];
    
    // needle
    var degrees = 50, radius = .5
    var radians = degrees * Math.PI / 180
    var x = -1 * radius * Math.cos(radians) * samples.metadata[0].wfreq
    var y = radius * Math.sin(radians)

    var gaugeLayout = {
      shapes: [{
        type: 'line',
        x0: 0.5,
        y0: 0.5,
        x1: 0.6,
        y1: 0.6,
        line: {
          color: 'black',
          width: 3
        }
      }],
      title: 'Chart',
      xaxis: {visible: false, range: [-1, 1]},
      yaxis: {visible: false, range: [-1, 1]}
    }
    
    Plotly.newPlot("gauge-plot", gaugeData, gaugeLayout);
}



//-------------------------------------------------------------------
//  Update Charts Function
//-------------------------------------------------------------------

d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {
    var sampleID = d3.select("#selDataset").property("value");

    //  Horizontal Bar Chart Update
    //-------------------------------------------------------------------

    var filteredData = samples.samples.filter(x => x.id == sampleID)[0];
    
    var hbarX = filteredData.sample_values.slice(0,10).reverse();
    var hbarY = filteredData.otu_ids.slice(0,10).reverse().map(x => `OTU ${x}`);
    var hbarUpdate = {
        title: `Top Ten OTUs for ${filteredData.id}`
    }
    
    Plotly.restyle("hbar-plot", "x", [hbarX]);
    Plotly.restyle("hbar-plot", "y", [hbarY]);
    Plotly.relayout("hbar-plot", hbarUpdate);
    
    
    //  Bubble Chart Update
    //-------------------------------------------------------------------
    
    var bubbleX = filteredData.otu_ids;
    var bubbleY = filteredData.sample_values;
    var bubbleUpdate = {
        title: `Top Ten OTUs for ${filteredData.id}`,
        size: filteredData.sample_values,
        color: filteredData.otu_ids
    };
    var bubbleText = filteredData.otu_labels;
    
    Plotly.restyle("bubble-plot", "x", [bubbleX]);
    Plotly.restyle("bubble-plot", "y", [bubbleY]);
    Plotly.restyle("bubble-plot", "text", bubbleText);
    Plotly.relayout("bubble-plot", bubbleUpdate);
    
    
    //  Metadata Info Card Update
    //-------------------------------------------------------------------
    
    Object.entries(samples.metadata.filter(x => x.id == sampleID)[0]).forEach(x => {
        d3.select(`#${x[0]}`).text(`${x[0]}:  ${x[1]}`)
    });
}

init()