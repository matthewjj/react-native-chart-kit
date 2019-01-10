import React, { Component } from 'react'

import {
  LinearGradient,
  Line,
  Text,
  Defs,
  Stop,
  G
} from 'react-native-svg'

class AbstractChart extends Component {

  minValue = 0;
  maxValue = 0;
  maximumRange = 0;
  negativeOffset = 0;

  calcYAxisRange = data => (Math.max(...data) - Math.min(...data)) || 1

  setStats = (data) => {
    let valueSet = [];

    data.map((dataset, index)=>{
      for(i = 0; i< dataset.data.length; i++) {
        
        valueSet.push(dataset.data[i])
      }

    });

    this.minValue = Math.min(...valueSet);
    this.maxValue = Math.max(...valueSet);
    this.maximumRange = this.maxValue - this.minValue;

    this.negativeOffset = this.negativeYAxisOffset(this.maximumRange, this.minValue);
    return true;
  }

  getMinValue = () => { 
    return this.minValue;
  }

  getMaximumRange = () => { 
    return this.maximumRange;
  }
  
  getNegativeOffset = () => {
    return this.negativeOffset;
  }

  yAxisLabels = (range, min) => { 
    if(this.minValue < 0) {
      if(range <= 200) {
        var yLabels = [-50, 0, 50, 100, 150];

      }
      else {
        var yLabels = [-100, 0, 100, 200, 300];

      }

    }
    else {
      if(range <= 200) {
        var yLabels = [0, 50, 100, 150, 200];

      }
      else if(range > 200) {
        var yLabels = [0, 100, 200, 300, 400];

      }

    } 

    return yLabels;

  }


  negativeYAxisOffset = (range, min) => { 
    let offset = 0;
    if(this.minValue < 0) {
      if(range <= 200) {
          offset = 50;

      }
      else {
          offset = 100;

      }
    }

    return offset;

  }

  renderHorizontalLines = config => {
    var { count, width, height, paddingTop, paddingRight, data } = config

    var decimalPlaces = (this.props.chartConfig.decimalPlaces !== undefined) ? this.props.chartConfig.decimalPlaces : 2;
    
    var range = this.getMaximumRange();
    var yAxisLabels = this.yAxisLabels(range, this.minValue);
    
    count = yAxisLabels.length;
    
    return [...new Array(count)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={(height / count * i) + paddingTop}
          x2={width}
          y2={(height / count * i) + paddingTop}
          stroke={this.props.chartConfig.color(0.2)}
          strokeDasharray="5, 10"
          strokeWidth={1}
        />
      )
    })
  }

  renderHorizontalLabels = config => {
    var { count, data, height, paddingTop, paddingRight, yLabelsOffset = 12 } = config
    var decimalPlaces = (this.props.chartConfig.decimalPlaces !== undefined) ? this.props.chartConfig.decimalPlaces : 2;
    
    let range = this.getMaximumRange();
    var yLabels = this.yAxisLabels(range, this.minValue);

    count = yLabels.length;

    return [...new Array(count)].map((_, i) => {

      return (
        <Text
          key={Math.random()}
          x={paddingRight - yLabelsOffset}
          textAnchor="end"
          y={(height / count * i) + paddingTop + 4}
          fontSize={12}
          fill={this.props.chartConfig.color(0.5)}
        >
        {(yLabels[count - i - 1])}
        </Text>
      )


    })
  }

  renderVerticalLines = config => {
    const { data, width, height, paddingTop, paddingRight } = config
    return [...new Array(data.length)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={Math.floor((width - paddingRight) / data.length * (i) + paddingRight)}
          y1={0}
          x2={Math.floor((width - paddingRight) / data.length * (i) + paddingRight)}
          y2={height - (height / 4) + paddingTop}
          stroke={this.props.chartConfig.color(0.2)}
          strokeDasharray="5, 10"
          strokeWidth={1}
        />
      )
    })
  }

  renderVerticalLabels = config => {
    var { count, data, labels = [], width, height, paddingRight, paddingTop, horizontalOffset = 0 } = config
    const fontSize = 12

    var decimalPlaces = (this.props.chartConfig.decimalPlaces !== undefined) ? this.props.chartConfig.decimalPlaces : 2;
    let min = Math.min(...data).toFixed(decimalPlaces);

    let range = this.getMaximumRange();
    var yLabels = this.yAxisLabels(range, min);
    count = yLabels.length;


    if(this.props.chartConfig.tiltXAxis) {
      
      return labels.map((label, i) => {
        
        return (
          <G
            key={Math.random()}
            x={((width - paddingRight) / labels.length * (i)) + paddingRight + horizontalOffset}
            y={(height * (count - 1) / count) + paddingTop + (fontSize * 2)}
          >
            <Text
              key={Math.random()}
              //x={((width - paddingRight) / labels.length * (i)) + paddingRight + horizontalOffset}
              //y={y}
              fontSize={fontSize}
              fill={this.props.chartConfig.color(0.5)}
              textAnchor="middle"
              transform="translate(-10, 0) rotate(-45)"
            >{label}
            </Text>
          </G>
        )

      })


    }


    return labels.map((label, i) => {
      return (
        <Text
          key={Math.random()}
          x={((width - paddingRight) / labels.length * (i)) + paddingRight + horizontalOffset}
          y={(height * (count - 1) / count) + paddingTop + (fontSize * 2)}
          fontSize={fontSize}
          fill={this.props.chartConfig.color(0.5)}
          textAnchor="middle"
        >{label}
        </Text>
      )
    })
  }

  renderDefs = config => {
    const { width, height, backgroundGradientFrom, backgroundGradientTo } = config
    return (
      <Defs>
        <LinearGradient id="backgroundGradient" x1="0" y1={height} x2={width} y2={0}>
          <Stop offset="0" stopColor={backgroundGradientFrom}/>
          <Stop offset="1" stopColor={backgroundGradientTo}/>
        </LinearGradient>
        <LinearGradient id="fillShadowGradient" x1={0} y1={0} x2={0} y2={height}>
          <Stop offset="0" stopColor={this.props.chartConfig.color()} stopOpacity="0.1"/>
          <Stop offset="1" stopColor={this.props.chartConfig.color()} stopOpacity="0"/>
        </LinearGradient>
      </Defs>
    )
  }
}

export default AbstractChart
