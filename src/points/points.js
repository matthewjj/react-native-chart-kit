import React, { Component } from 'react';
import { View } from 'react-native'
import {
  Svg,
  Rect,
  Text,
  G,
  Path,
  Circle
} from 'react-native-svg'


class Points extends Component {

	constructor(props) {
    	super(props);
    	this.onPress = this.onPress.bind(this);
    	this.onClear = this.onClear.bind(this);

    	this.cachedOutput = [];
  	}

    onPress(rectX, rectY, rectWidth, textX, textY, label1, text2X, text2Y, label2) {
    	this.setState({ selectedIndex : {
    		rectX : rectX, 
    		rectY : rectY, 
    		rectWidth : rectWidth, 
    		textX : textX, 
    		textY : textY, 
    		label1 : label1, 
    		text2X : text2X, 
    		text2Y : text2Y, 
    		label2 : label2
    	}})
    
    }

    onClear(index, i) {
 		//prevent continous clicking
    	if(this.state && this.state.selectedIndex){
    		this.setState({selectedIndex: false })

    	}
    }

    componentWillReceiveProps() {
    	this.cachedOutput = [];
    }

    render() {
    	var { count, data, labels, width, height, paddingTop, paddingRight } = this.props.config
	    const wordLengthEstimate = 8.75;
	    let output = [];
	    var dataRefined = this.props.dataRefinedCache;

	    count = this.props.yAxisLabels.length;

	    if(this.state && this.state.selectedIndex){

	    	console.log(height, paddingTop);
	    	console.log(this.state);

            var popup =	<G strokeWidth="1"
           		 	key ={Math.random()}
          		>
		            <Rect
		              	x={this.state.selectedIndex.rectX}
		              	y={this.state.selectedIndex.rectY > 0 ? this.state.selectedIndex.rectY : this.state.selectedIndex.rectY + 50}
		              	rx="3"
		              	ry="3"
		              	width={this.state.selectedIndex.rectWidth}
		              	height="40"
		              	strokeWidth="2"
		              	stroke={this.props.chartConfig.color(0.2)}
		              	fill="white"
		             
		            />
		            <Text
		                key={Math.random()}
		                x={this.state.selectedIndex.textX}
		                y={this.state.selectedIndex.rectY > 0 ? this.state.selectedIndex.textY : this.state.selectedIndex.textY + 50}
		                textAnchor="middle"
		                fontSize={12}
		                fill="black"
		             >
                		{this.state.selectedIndex.label1}
                
              		</Text>
              		<Text
                		key={Math.random()}
                		x={this.state.selectedIndex.text2X}
                		y={this.state.selectedIndex.rectY > 0 ? this.state.selectedIndex.text2Y : this.state.selectedIndex.text2Y + 50}
                		textAnchor="middle"
                		fontSize={12}
                		fill="black"
              		>
                		{this.state.selectedIndex.label2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            		</Text>
				</G>;

	    }

	    if(this.cachedOutput.length > 0) {
	    	var output2 = this.cachedOutput.slice(0);
	    	output2.push(popup)
	    	return output2;
	    	
	    }

	    output.push (
	    	<Rect
	    		key={"backCover"}
	          	x={0}
	          	y={0}
	          	width={width}
	          	height={height}
	          	rx="0"
	          	ry="0"
	          	//fill={this.props.chartConfig.color(0)}
	          	fill={this.props.chartConfig.color(0)}
	          	strokeWidth="1"
	          	onPress={() => this.onClear()}	              
	    	/>

	    )

	    dataRefined.map((dataset, index)=>{
	      	var missStart = null;
	      	var missEnd = null;

	      	if(!dataset.hasData) {
	       	 	return;
	      	}
	      	
	      	dataset.data.map((x, i) => {
	        	if(dataset.nullGaps[i] ) {
	          		missStart = dataset.nullGaps[i].startPos;
	          		missEnd = dataset.nullGaps[i].endPos;
	        	}

	        	if((missStart != null && i > missStart && i < missEnd) || i < dataset.start || i >= dataset.end) {
	         		return;
	        	}
	    
	        	let baseLine = (height / count * (count - 1)) + paddingTop;
	        	let y = baseLine - (height / count * ( ((count - 1) / this.props.yAxisRange) * (x + this.props.offset)));

	        	output.push (
		          	<G strokeWidth="1" key ={Math.random()}>     
				      	<Circle
				        	key={index+"-"+i}
				        	cx={(paddingRight + (i * (width - paddingRight) / dataset.data.length)).toString()}
				        	cy={y.toString()}
				        	r="4"
				        	stroke={
				          		dataset.color ? 
				            		dataset.color : 
				            			this.props.chartConfig.color(
				              		0.2
				            	)
				       	 	}
				        	strokeWidth="1"
				        	fill={this.props.chartConfig.color(0.7)}
				      	/>
				      	<Rect
				          	x={(paddingRight + (i * (width - paddingRight) / dataset.data.length) - 20).toString()}
				          	y={(y - 15).toString()}
				          	width="40"
				          	height="40"
				          	rx="0"
				          	ry="0"
				          	fill={this.props.chartConfig.color(0)}
				          	strokeWidth="1"
				          	onPress={() => this.onPress(
			          			(paddingRight + (i * (width - paddingRight) / dataset.data.length) - 30 - (labels[i] && labels[i].length > 8 ? (labels[i].length * wordLengthEstimate) / 3.4 : 0)),
			          			(y - 46),
			          			(labels[i] ? labels[i].length * wordLengthEstimate : 70 ),
			          			paddingRight + (i * (width - paddingRight) / dataset.data.length) + 4,
			          			(y - 30),
			          			(labels[i] ? labels[i] : ""),
			          			paddingRight + (i * (width - paddingRight) / dataset.data.length) + 4,
			          			(y - 16),
			          			x
				          	)}
				    	/>
					</G>
				)
			})

	    })

	    this.cachedOutput = output;

	   	//output.push(popup)
		return (output);
	        
	}

}

export default Points