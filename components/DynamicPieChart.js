import React from 'react'
import { PieChart } from 'react-native-svg-charts'
import { Text} from 'react-native-svg';
import Colors from "../constants/Colors";

class DynamicPieChart extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const data = [
            {
                key: 1,
                amount: this.props.savings,
                svg: { fill: Colors.fgDark},
            },
            {
                key: 2,
                amount: this.props.taxed,
                svg: { fill: Colors.primTwo }
            },
        ]

        const Labels = ({ slices, height, width }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <Text
                        key={index}
                        x={pieCentroid[ 0 ]}
                        y={pieCentroid[ 1 ]}
                        fill={'white'}
                        textAnchor={'middle'}
                        alignmentBaseline={'middle'}
                        fontSize={12}
                        stroke={'black'}
                        strokeWidth={0.2}
                        onPress={()=>console.log('presssssed')}
                    >

                    </Text>
                )
            })
        }

        return (
            <PieChart
                style={{ height: 100,flex:1 }}
                valueAccessor={({ item }) => item.amount}
                data={data}
                spacing={0}
                outerRadius={"95%"}
                onPress={() => console.log('pressedS')}
            >
                <Labels/>
            </PieChart>
        )
    }

}

export default DynamicPieChart