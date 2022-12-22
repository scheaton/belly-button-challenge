// Use the D3 library to read in samples.json from the URL
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Display the default plot
function init() {
    d3.json(url).then(function (allData) {
        let names = allData.names
        let metaData = Object.entries(allData.metadata[0]);
        let samples = Object.values(allData.samples[0]).slice(1, 4);
        console.log(samples);
        samplesFormatted = [];
        for (let i = 0; i < samples[0].length; i++) {
            samplesFormatted.push([]);
            samplesFormatted[i].push(samples[1][i]);   // .sample_values
            samplesFormatted[i].push(`OTU ${samples[0][i]}`);// .otu_ids
            samplesFormatted[i].push(samples[2][i]);      // .otu_labels
        };

        let dropDown = d3.select('#selDataset');
        for (let i = 0; i < names.length; i++) {
            dropDown.append("option").text(names[i]);
        };

        // Display the sample metadata, i.e., an individual's demographic information.
        let demoInfo = d3.select('#sample-metadata');
        for (let i = 0; i < metaData.length; i++) {
            demoInfo.append("p").text(metaData[i][0] + ": " + metaData[i][1]);
        };

        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
        // Use sample_values as the values for the bar chart.
        // Use otu_ids as the labels for the bar chart.
        // Use otu_labels as the hovertext for the chart.

        let sortedTopTen = samplesFormatted.sort((a, b) => b[0] - a[0]).slice(0, 10).reverse();

        let traceBar = [{
            x: sortedTopTen.map(object => object[0]),// .sample_values
            y: sortedTopTen.map(object => object[1]),      // .otu_ids
            text: sortedTopTen.map(object => object[2]),// .otu_labels
            type: "bar",
            orientation: "h"
        }];

        let layoutBar = {
            height: 600,
            width: 800
        };

        Plotly.newPlot("barh", traceBar, layoutBar);

        // Create a bubble chart that displays each sample.
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.

        let traceBubble = {
            x: samples[0],
            y: samples[1],
            text: samples[2],
            mode: 'markers',
            marker: {
                color: samples[0],
                size: samples[1]
            }
        };

        let layoutBubble = {
            showlegend: false,
            height: 400,
            width: 800
        };

        Plotly.newPlot('bubble', [traceBubble], layoutBubble);
    });
};

// Update all the plots when a new sample is selected.
// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", optionChanged);

// Function called by DOM changes
function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a letiable
    let selectedId = dropdownMenu.property("value");
    // Update to new selected individual data
    d3.json(url).then(function (allData) {
        let names = allData.names
        let selectedIdIndex = names.indexOf(selectedId);
        let metaData = Object.entries(allData.metadata[selectedIdIndex]);
        let samples = Object.values(allData.samples[selectedIdIndex]).slice(1, 4);
        console.log(samples);
        samplesFormatted = [];
        for (let i = 0; i < samples[0].length; i++) {
            samplesFormatted.push([]);
            samplesFormatted[i].push(samples[1][i]);   // .sample_values
            samplesFormatted[i].push(`OTU ${samples[0][i]}`);// .otu_ids
            samplesFormatted[i].push(samples[2][i]);      // .otu_labels
        };
        let sortedTopTen = samplesFormatted.sort((a, b) => b[0] - a[0]).slice(0, 10).reverse();

        // Refresh the sample metadata, i.e., an individual's demographic information.
        d3.selectAll("p").remove();
        let demoInfo = d3.select('#sample-metadata');
        for (let i = 0; i < metaData.length; i++) {
            demoInfo.append("p").text(metaData[i][0] + ": " + metaData[i][1]);
        };

        // Update the bar chart and bubble chart
        let traceBar = {
            x: [sortedTopTen.map(object => object[0])],// .sample_values
            y: [sortedTopTen.map(object => object[1])],      // .otu_ids
            text: [sortedTopTen.map(object => object[2])],// .otu_labels
            // type: "bar",
            // orientation: "h"
        };

        let traceBubble = {
            x: [samples[0]],
            y: [samples[1]],
            text: [samples[2]],
            // mode: 'markers',
            // marker: {
            //     color: samples[0],
            //     size: samples[1]
            // }
        };
        updatePlotly(traceBar, traceBubble);
    });
};

// Function to update the plot's values
function updatePlotly(newTraceBar, newTraceBubble) {
    Plotly.restyle('barh', newTraceBar, [0]);
    Plotly.restyle("bubble", newTraceBubble, [0]);
};


init();