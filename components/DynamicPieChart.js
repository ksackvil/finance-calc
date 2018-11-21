import React from 'react'
import { PieChart } from 'react-native-svg-charts'
import { Text} from 'react-native-svg'

class DynamicPieChart extends React.PureComponent {

    render() {

        const data = [
            {
                key: 1,
                amount: 50,
                svg: { fill: '#600080' },
            },
            {
                key: 2,
                amount: 25,
                svg: { fill: '#9900cc' }
            },
            {
                key: 3,
                amount: 25,
                svg: { fill: '#c61aff' }
            }
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
                        fontSize={15}
                        stroke={'black'}
                        strokeWidth={0.2}
                        onPress={()=>console.log('presssssed')}
                    >
                        {data.amount}
                    </Text>
                )
            })
        }

        return (
            <PieChart
                style={{ height: 120,flex:1 }}
                valueAccessor={({ item }) => item.amount}
                data={data}
                spacing={0}
                outerRadius={'95%'}
                onPress={() => console.log('pressedS')}
            >
                <Labels/>
            </PieChart>
        )
    }

}

export default DynamicPieChart