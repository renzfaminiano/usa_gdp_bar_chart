let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req = new XMLHttpRequest()

let width = window.innerWidth/1.5
let height = window.innerHeight/1.5
let padding = window.innerWidth/20

let svg = d3.select('svg')

let dataset
let data

let yScale
let xScale
let xAxisScale
let yAxisScale

var us = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD"
  });

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
    document.getElementById("title").setAttribute("x", padding);
    document.getElementById("title").setAttribute("y", padding/2);
}

let generateScales = () => {

    yScale = d3.scaleLinear()
                    .domain([0, d3.max(data,(d)=>{return d[1]})])
                    .range([0, height - (padding*2)])

    xScale = d3.scaleLinear()
               .domain([0,data.length -1])
               .range([padding,width - padding])
    
    let dataDates = data.map((d) => {return new Date(d[0])})

    console.log(dataDates)

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(dataDates),d3.max(dataDates)])
                   .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                   .domain([0,d3.max(data,(d)=>{return d[1]})])
                   .range([height- padding, padding])

}

let drawBars = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('position','absolute')

    svg.selectAll('rect')
       .data(data)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr("width", (width-(padding*2))/data.length)
       .attr('data-date', (d)=>{return d[0]})
       .attr('data-gdp', (d)=>{return d[1]})
       .attr('height', (d)=>{return yScale(d[1])})
       .attr('x', (d,i)=> {return xScale(i)})
       .attr('y',(d)=>{return (height-padding)-yScale(d[1])})
       .on('mouseover', (d,i)=>{
            tooltip.transition()
                .style('visibility','visible')
                .style('left',(d.clientX+15)+'px')
                .style('top',(d.clientY-15)+'px')
            tooltip.text(i[0].slice(0,7) + " - "+ us.format(i[1])+" B")
            
            document.querySelector('#tooltip').setAttribute('data-date',i[0])
        })
       .on('mouseout', ()=>{
            tooltip.transition()
                .style('visibility','hidden')
        })

}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)
    
    svg.append('g')
       .call(xAxis)
       .attr("id", "x-axis")
       .attr("transform",'translate(0,'+ (height-padding) + ')')

    svg.append('g')
       .call(yAxis)
       .attr("id", "y-axis")
       .attr("transform",'translate('+ padding + ', 0)')

}

req.open('GET', url, true)
req.onload = () => {
    dataset = JSON.parse(req.responseText)
    data = dataset.data
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
    
}
req.send()

window.onresize = function(){ location.reload() }