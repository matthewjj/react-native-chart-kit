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
  	}

	
    onPress(index, i) {
  		console.log("press");
    	this.setState({selectedIndex: index+":"+ i })
    
    	
    }

    onClear(index, i) {
 		//prevent continous clicking
    	if(this.state && this.state.selectedIndex){
    		this.setState({selectedIndex: false })

    	}
    }


    render() {
    	console.log("lender");
    	var { count, data, labels, width, height, paddingTop, paddingRight } = this.props.config
	    const wordLengthEstimate = 8.75;
	    let output = [];
	    var dataRefined = this.props.dataRefinedCache;

	    count = this.props.yAxisLabels.length;


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
	        	let y = baseLine - (height / count * ( ((count - 1) / this.props.yAxisRange) * (x + this.props.offset))) ;
	        
	      
	        	output.push (
		          	<G strokeWidth="1"
		            	key ={Math.random()}
		            
		          	>
		            {this.state && this.state.selectedIndex == (index+":"+ i) &&
		            	<G strokeWidth="1"
		           		 	key ={Math.random()}
		            
		          		>
				            <Rect
				              	x={(paddingRight + (i * (width - paddingRight) / dataset.data.length) - 30 - (labels[i] && labels[i].length > 8 ? (labels[i].length * wordLengthEstimate) / 3.4 : 0)).toString()}
				              	y={(y - 46).toString()}
				              	rx="3"
				              	ry="3"
				              	width={(labels[i] ? labels[i].length * wordLengthEstimate : 70 ).toString()}
				              	height="40"
				              	strokeWidth="2"
				              	stroke={
				                  	dataset.color ? 
				                    	dataset.color : 
				                    	this.props.chartConfig.color( 
				                      	0.2
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
				          	onPress={() => this.onPress(index, i)}
				              
				    	/>
			            
					</G>
				)
			})

	    })
	   

		return (output);
	        
	}

}



export default Points