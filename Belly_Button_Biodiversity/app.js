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
        title: {
            text: `<b>Top Ten OTUs for ${samples.samples[0].id}</b>`,
            y: .95
        },
        margin: {
            t: 50
        },
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
        title: `<b>OTUs for ${samples.samples[0].id}</b>`,
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
        domain: { x: [0, 1], y: [0, 1]},
        value: samples.metadata[0].wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {
                range: [null, 10],
                tickfont: {
                    size: 15
                }
            },
            steps: [
                { range: [0,1], color: "#ff0000" },
                { range: [1,2], color: "#ff4000" },
                { range: [2,3], color: "#ff8000" },
                { range: [3,4], color: "#ffc000" },
                { range: [4,5], color: "#fff000" },
                { range: [5,6], color: "#ffff00" },
                { range: [6,7], color: "#ddff00" },
                { range: [7,8], color: "#99ff00" },
                { range: [8,9], color: "#66ff00" },
                { range: [9,10], color: "#00ff00" },
            ]
        }
    };

    var angle = 180 - samples.metadata[0].wfreq * 18;
    
    var dialTrace = {
        type: "scatterpolar",
        mode: "lines",
        r: [-1, 7, 0.5],
        theta: [0, angle, 0],
        fill: "toself",
        fillcolor: "red",
        line: {
            color: 'red',
            width: 5
        }
    };

    var gaugeData = [gaugeTrace, dialTrace];

    var gaugeLayout = {
        showlegend: false,
        title: {
            text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            y: .9,
            x: .44
        },
        margin: {
            l: 40,
            t: 40,
            b: 0
        },
        width: 450,
        height: 300,
        polar: {
            sector: [0,180],
            radialaxis: {
                visible: false,
                range: [0,10]
            },
            angularaxis: {
                visible: false
            }
        }
    };

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
        d3.select(`#${x[0]}`).text(`${x[1]}`)
    });
    
    
    //  Gauge Update
    //-------------------------------------------------------------------

    var gaugeValue = samples.metadata.filter(x => x.id == sampleID)[0].wfreq;
    var angle = 180 - samples.metadata.filter(x => x.id == sampleID)[0].wfreq * 18;
    
    Plotly.restyle("gauge-plot", "value", [gaugeValue]);
    Plotly.restyle("gauge-plot", "theta", [[0, angle, 0]]);
}

init()