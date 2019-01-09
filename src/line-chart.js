import React from 'react'
import { View } from 'react-native'
import {
  Svg,
  Circle,
  Polygon,
  Polyline,
  Path,
  Rect,
  G
} from 'react-native-svg'
import AbstractChart from './abstract-chart'

class LineChart extends AbstractChart {

  dataRefinedCache = [];

  dataRefined = data => {

    let dataRefined = [];
    let nullGaps = {};
    let start = null;
    let end = null;
    
    data.map((dataset,index)=>{

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

            nullGaps[nullStartPos] = {};
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

    });

    return {
      nullGaps: nullGaps,
      start: start,
      end: end,
      dataRefined: dataRefined
    }

  }

  renderLine = config => {
    if (this.props.bezier) {
      return this.renderBezierLine(config)
    }
    const { width, height, paddingRight, paddingTop, data} = config
    let output = [];
    var dataRefined = this.dataRefined(data);

    this.dataRefinedCache = dataRefined;

    data.map((dataset,index) => {
      
      const points = dataRefined.dataRefined.map((x, i) =>
        (paddingRight + (i * (width - paddingRight) / dataset.data.length)) + ',' + 
        (((height / 4 * 3 * (1 - ((  x - Math.min(...dataset.data)) / this.calcScaler(dataset.data))))) + paddingTop)
      )

      
      for (var i = 0; i < dataRefined.dataRefined.length; i++) {
        if(points[i+1] == undefined) {
          return;
        }
        
        output.push (
          <Polyline
            key = {i}
            points={points[i]+' '+points[i+1]}
            fill="none"
            stroke={this.props.chartConfig.color(i < dataRefined.start || i >= dataRefined.end - 1  ? 0 : 0.2)}
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
    var { count, data, width, height, paddingTop, paddingRight } = config

  
    let output = [];
    
    data.map((dataset,index)=>{

      var dataRefined = this.dataRefinedCache;
      var offset = 0;
      var min = this.minValue(dataset.data);
      var max = this.minValue(dataset.data);
      var range = this.calcScaler(dataset.data);

      var yAxisLabels = this.yAxisLabels(range, min);
      var yAxisRange = Math.max(...yAxisLabels) - Math.min(...yAxisLabels);
     
      console.log(yAxisRange);

      if(min < 0) {
        count++;
        offset = this.offset(range);

      }

      if(range <= 200) {
        yAxisRange = 200

      }
      else if(range > 200) {
        yAxisRange = 400

      }

      var missStart = null;
      var missEnd = null;
      
      dataset.data.map((x, i) => {
        if(dataRefined.nullGaps[i] ) {
          missStart = dataRefined.nullGaps[i].startPos;
          missEnd = dataRefined.nullGaps[i].endPos;

        }
    
        let baseLine = (height / count * (count - 1)) + paddingTop;

        let y = baseLine - (height / count * ( ((count - 1) / yAxisRange) * (x + offset))) ;

        console.log(
          {
            value: x,
            count: count
          }
        );

        output.push (
          <Circle
            key={Math.random()}
            cx={paddingRight + (i * (width - paddingRight) / dataset.data.length)}
            cy={y}
            r="4"
            fill={
              this.props.chartConfig.color(
                (missStart && i > missStart && i < missEnd) || i < dataRefined.start || i >= dataRefined.end ? 0 : 0.7
              )
            }
          />)
      })

      console.log(" ");

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
           (((height / 4 * 3 * (1 - ((x - Math.min(...dataset.data)) / this.calcScaler(dataset.data)))) + paddingTop))
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
    const y = i => Math.floor(((height / 4 * 3 * (1 - ((dataset.data[i] - Math.min(...dataset.data)) / this.calcScaler(dataset.data)))) + paddingTop))
    
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
              fill="url(#backgroundGradient)"/>
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
