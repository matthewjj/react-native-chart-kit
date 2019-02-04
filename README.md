# React Native Chart X Documentation

## Import components
1. `npm install react-native-chart-x`
2. Use with ES6 syntax to import components

```js
import {
  LineChart
} from 'react-native-chart-x'

```

## Quick Example
```js
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
}
```

```jsx
<LineChart
    data={{
        labels: ['a', 'b', 'c', 'd', 'e', 'f'],
        datasets: [1, 5, -10, 10, 80, -50]
        datasets:[
          {
            data: [1, 5, 2, 1, 1100, 111],
            color: '#fff',
            name: "instrumentName"
          },
          {
            data: [115, 2618, 31, 19, -1100, 111],
            color: '#000',
            name: "instrumentName"
          }
        ]
    }}
    withShadow={false}
    width={200}
    height={100}
    chartConfig={{
        tiltXAxis: true,
        backgroundColor: '#5e5c5c',
        backgroundGradientFrom: '#5e5c5c',
        backgroundGradientTo: '#5e5c5c',
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
    }}
    style={{
        marginVertical: 8,
    }}
/>
```

## Chart style object
Define a chart style object with following properies as such:
```js
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
}
```

| Property        | Type           | Description  |
| ------------- |-------------| -----|
| backgroundGradientFrom | string | Defines the first color in the linear gradient of a chart's background  |
| backgroundGradientTo | string | Defines the second color in the linear gradient of a chart's background |
| color | function => string | Defines the base color function that is used to calculate colors of labels and sectors used in a chart |