import React from 'react'
import { View } from 'react-native'
import {
  Svg,
  Circle,
  Polygon,
  Polyline,
  Path,
  Rect,
  G,
  Text,
  Tspan
} from 'react-native-svg'
import AbstractChart from './abstract-chart'

class LineChart extends AbstractChart {

  dataRefinedCache = [];

  dataRefined = data => {

    let combinedArray = [];
    data.map((dataset,index)=>{
      
      let dataRefined = [];
      let nullGaps = {};
      let start = null;
      let end = null;

      let started = false;
      
      let nullStartVal = null;
      let nullEndVal = null;

      let nullStartPos = null;
      let nullEndPos = null;

      for(i = 0; i< dataset.data.length; i++) {

          if(dataset.data[i] === null && started && nullStartVal === null) {
            nullStartVal = dataset.data[i - 1];
            nullStartPos = i - 1;

          }
      
          if(dataset.data[i] !== null && started && nullStartVal !== null) {
            nullEndVal = dataset.data[i];
            nullEndPos = i;
            
          }

          if(dataset.data[dataset.data.length - i - 1] !== null && end === null) {
            end =  dataset.data.length - i;

          }

          if(dataset.data[i] !== null && start === null) {
            start = i;
            started = true;

          }
        
          dataRefined.push(dataset.data[i]);

          if(nullStartVal && nullEndVal) {

            for(var ii = nullStartPos + 1; ii < nullEndPos; ii++) {
              if(nullEndVal > nullStartVal) {
                dataRefined[ii] = nullStartVal + (((nullEndVal - nullStartVal) / ( nullEndPos - nullStartPos)) * (ii - nullStartPos));
              
              }
              else {
                dataRefined[ii] = nullStartVal - (((nullStartVal - nullEndVal) / ( nullEndPos - nullStartPos)) * (ii - nullStartPos));
              }
              
            }

            //nullGaps[nullStartPos] = {};
            nullGaps[nullStartPos] = {
                startVal : nullStartVal, 
                endVal: nullEndVal,
                startPos: nullStartPos,
                endPos: nullEndPos
            };
            
            nullStartVal = null;
            nullEndVal = null;

          }

      }

      combinedArray.push({
        nullGaps: nullGaps,
        start: start,
        end: end,
        data: dataRefined,
        color: dataset.color
      })

    });

    return combinedArray;

  }

  renderLine = config => {
    if (this.props.bezier) {
      return this.renderBezierLine(config)
    }
    const { width, height, paddingRight, paddingTop, data} = config
    let output = [];

    var dataRefined = this.dataRefined(data);
    this.dataRefinedCache = dataRefined;

    

    var min = this.getMinValue();
    var range = this.getMaximumRange();
    var yAxisLabels = this.yAxisLabels(range, min);
    var yAxisRange = this.calcYAxisRange(yAxisLabels);
    var offset = this.getNegativeOffset();
    
    var count = yAxisLabels.length;

    dataRefined.map((dataset, index) => {
      
      for (var i = 0; i < dataset.data.length; i++) {
        if(dataset.data[i+1] == undefined) {
          return;
        }

        let value1 = dataset.data[i];
        let value2 = dataset.data[i+1];

        let baseLine = (height / count * (count - 1)) + paddingTop;
        
        let x1 = baseLine - (height / count * ( ((count - 1) / yAxisRange) * (value1 + offset))) ;
        let y1 = paddingRight + (i * (width - paddingRight) / dataset.data.length);

        let x2 = baseLine - (height / count * ( ((count - 1) / yAxisRange) * (value2 + offset))) ;
        let y2 = paddingRight + ((i+1) * (width - paddingRight) / dataset.data.length);

        output.push (
          <Polyline
            key = {index+"-"+i}
            points={y1+","+x1+' '+y2+","+x2}
            fill="none"
            stroke={
              dataset.color ? 
                dataset.color(
                  i < dataRefined.start || i >= dataRefined.end - 1 ? 
                  0 : 0.2
                ) : 
                this.props.chartConfig.color(
                  i < dataRefined.start || i >= dataRefined.end - 1 ? 
                  0 : 0.2
                )
            }
            strokeWidth={3}
          />
        )

     }

    })

    return (
      output
    )
    
  }


  renderDots = config => {
    
    var { count, data, labels, width, height, paddingTop, paddingRight } = config
    const wordLengthEstimate = 8.75;
    let output = [];
    var dataRefined = this.dataRefinedCache;

    var min = this.getMinValue();
    var offset = this.getNegativeOffset();
    var range = this.getMaximumRange();

    var yAxisLabels = this.yAxisLabels(range, min);
    var yAxisRange = this.calcYAxisRange(yAxisLabels);

    count = yAxisLabels.length;

    dataRefined.map((dataset, index)=>{
       
      var missStart = null;
      var missEnd = null;
      
      dataset.data.map((x, i) => {
        if(dataset.nullGaps[i] ) {
          missStart = dataset.nullGaps[i].startPos;
          missEnd = dataset.nullGaps[i].endPos;

        }
    
        let baseLine = (height / count * (count - 1)) + paddingTop;
        let y = baseLine - (height / count * ( ((count - 1) / yAxisRange) * (x + offset))) ;
        
      
        output.push (
          <G 
            key ={Math.random()}
            
          >
            {this.state && this.state.selectedIndex == (index+":"+ i) && 
            <G 
            key ={Math.random()}
            
          >
            <Rect
              x={paddingRight + (i * (width - paddingRight) / dataset.data.length) - 30 - (labels[i] && labels[i].length > 8 ? (labels[i].length * wordLengthEstimate) / 3.4 : 0)}
              y={y - 46}
              rx="3"
              ry="3"
              width={(labels[i] ? labels[i].length * wordLengthEstimate : 70 )}
              height="40"
              strokeWidth={2}
              stroke={
                  dataset.color ? 
                    dataset.color(
                      i < dataRefined.start || i >= dataRefined.end - 1 ? 
                      0 : 0.2
                    ) : 
                    this.props.chartConfig.color(
                      i < dataRefined.start || i >= dataRefined.end - 1 ? 
                      0 : 0.2
                    )
                }
              fill="white"
             
            />
              <Text
                key={Math.random()}
                x={paddingRight + (i * (width - paddingRight) / dataset.data.length) + 4}
                y={y - 30}
                textAnchor="middle"
                fontSize={12}
                fill="black"
              >
                {(labels[i] ? labels[i] : "")}
                
              </Text>
              <Text
                key={Math.random()}
                x={paddingRight + (i * (width - paddingRight) / dataset.data.length) + 4}
                y={y - 16}
                textAnchor="middle"
                fontSize={12}
                fill="black"
              >
                {x}
                
              </Text>

              </G>
            
            }


            <Rect
              x={paddingRight + (i * (width - paddingRight) / dataset.data.length) - 20}
              y={y - 15}
              width="40"
              height="40"
              fill={this.props.chartConfig.color(0)}
              onPress={() => this.setState({selectedIndex: index+":"+ i })}
              
             
            />
              <Circle
                key={index+"-"+i}
                
                cx={paddingRight + (i * (width - paddingRight) / dataset.data.length)}
                cy={y}
                r="4"
                stroke={
                  dataset.color ? 
                    dataset.color(
                      i < dataRefined.start || i >= dataRefined.end - 1 ? 
                      0 : 0.2
                    ) : 
                    this.props.chartConfig.color(
                      i < dataRefined.start || i >= dataRefined.end - 1 ? 
                      0 : 0.2
                    )
                }
                strokeWidth={1}
                fill={
                  this.props.chartConfig.color(
                    (missStart && i > missStart && i < missEnd) || i < dataset.start || i >= dataset.end ? 0 : 0.7
                  )
                }


              />
            
          </G>
          )
      })



    })
    return (
      output
    )

  }

  renderShadow = config => {
    if (this.props.bezier) {
      return this.renderBezierShadow(config)
    }
    const { data, width, height, paddingRight, paddingTop } = config
    let output = [];
    config.data.map((dataset,index)=>{
      output.push (
        <Polygon
          key={index}
          points={dataset.data.map((x, i) =>
            (paddingRight + (i * (width - paddingRight) / dataset.data.length)) +
          ',' +
           (((height / 4 * 3 * (1 - ((x - Math.min(...dataset.data)) / this.getMaximumRange()))) + paddingTop))
          ).join(' ') + ` ${paddingRight + ((width - paddingRight) / dataset.data.length * (dataset.data.length - 1))},${(height / 4 * 3) + paddingTop} ${paddingRight},${(height / 4 * 3) + paddingTop}`}
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />)
    })
    return (
      output
    )
    
    
  }

  getBezierLinePoints = (dataset, config) => {

    const { width, height, paddingRight, paddingTop, data } = config
    let output = []; 
    if (dataset.data.length === 0) {
      return 'M0,0'
    }
    const x = i => Math.floor(paddingRight + i * (width - paddingRight) / dataset.data.length)
    const y = i => Math.floor(((height / 4 * 3 * (1 - ((dataset.data[i] - Math.min(...dataset.data)) / this.getMaximumRange()))) + paddingTop))
    
    return [`M${x(0)},${y(0)}`].concat(dataset.data.slice(0, -1).map((_, i) => {
      const x_mid = (x(i) + x(i + 1)) / 2
      const y_mid = (y(i) + y(i + 1)) / 2
      const cp_x1 = (x_mid + x(i)) / 2
      const cp_x2 = (x_mid + x(i + 1)) / 2
      return `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
      ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
    })).join(' ')

    
  }

  renderBezierLine = config => {
    let output = [];
    config.data.map((dataset,index)=>{
      let result = this.getBezierLinePoints(dataset,config);
      output.push (
          <Path
            key = {index}
            d={result}
            fill="none"
            stroke={this.props.chartConfig.color(0.2)}
            strokeWidth={3}
          />
        )
      });
    return (
      output
    )

    
  }

  renderBezierShadow = config => {
    const { width, height, paddingRight, paddingTop, data } = config
    let output = [];
    data.map((dataset,index)=>{
      let d = this.getBezierLinePoints(dataset,config) +
      ` L${paddingRight + ((width - paddingRight) / dataset.data.length * (dataset.data.length - 1))},${(height / 4 * 3) + paddingTop} L${paddingRight},${(height / 4 * 3) + paddingTop} Z`
      output.push (
        <Path
          key={index}
          d={d}
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />)
    })
    return (
      output
    )
    
  }

  render() {
    const paddingTop = 16
    const paddingRight = 64
    const { width, height, data, withShadow = true, withDots = true, style = {} } = this.props
    const { labels = [] } = data
    const { borderRadius = 0 } = style
    const config = {
      width,
      height
    }
    this.setStats(data.datasets);
    const range = this.getMaximumRange();
    const min = this.getMinValue();
    

    return (
      <View style={style}>
        <Svg
          height={height}
          width={width}
        >
          <G>
            {this.renderDefs({
              ...config,
              ...this.props.chartConfig
            })}
            <Rect
              width="100%"
              height={height}
              rx={borderRadius}
              ry={borderRadius}
              fill="url(#backgroundGradient)"
              onPress={() => this.setState({selectedIndex: false})}
            />
            {this.renderHorizontalLines({
              ...config,
              count: 4,
              paddingTop,
              paddingRight,
              data: data.datasets[0].data,
            })}
            {this.renderHorizontalLabels({
              ...config,
              count: (Math.min(...data.datasets[0].data) === Math.max(...data.datasets[0].data)) ?
                1 : 4,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
            {this.renderVerticalLines({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
            {this.renderVerticalLabels({
              ...config,
              count: 4,
              data: data.datasets[0].data,
              labels,
              paddingRight,
              paddingTop
            })}
            {this.renderLine({
              ...config,
              paddingRight,
              paddingTop,
              // data: data.datasets[0].data
              data: data.datasets

            })}
            {withShadow && this.renderShadow({
              ...config,
              data: data.datasets,
              paddingRight,
              paddingTop
            })}
            {withDots && this.renderDots({
              ...config,
              count: 4,
              data: data.datasets,
              labels,
              paddingTop,
              paddingRight
            })}
            {this.renderLegend({
              ...config,
              count: 4,
              data: data.datasets,
              paddingTop,
              paddingRight
            })}
          </G>
        </Svg>
      </View>
    )
  }
}

export default LineChart
