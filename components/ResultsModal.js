import React from 'react';
import { Text, View, StyleSheet, Dimensions} from 'react-native';
import {futureValue, payment} from '../utils/pmtCalc';
import { Button } from 'native-base';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import Colors from '../constants/Colors';

var data =[]
const {width} = Dimensions.get('window')

export class ResultsModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            calculating:true,
            retirementIncome: null,
            monthlySavings: null
        }        
    }

    componentDidMount() {        
        this.setState({calculating: true})
        this.calculate();
    }

    calculate(){ 
        // // USER INPUT PROPS
        var age = this.props.age;
        var annualIncome = this.props.income;

        // ASSUMED CONSTANTS
        const retireAge = 65;
        const inflation = 0.035;
        var annualRates = [0.04, 0.06, 0.08, 0.1];

        // CALCULATED CONSTANTS
        const yrsTillRet = retireAge - age;
        const moTillRet = yrsTillRet * 12;

        // retirement income or future value
        var ri = futureValue(inflation, yrsTillRet, 0, annualIncome, 0);

        var msArr = []
        for (rate of annualRates) { 
            var ms = payment(rate/12, moTillRet, 1, ri*10, 0) ;
            msArr.push(ms.toFixed(2)) 
        }
        data = []
        this.setState({retirementIncome: -1*ri.toFixed(2), monthlySavings: msArr, calculating: false})
        for(let n of msArr){
            data.push(Number(n))
        }

    }

    render() {
        const contentInset = { top: 20, bottom: 20 };
        const annualRates = [0.04, 0.06, 0.08, 0.1];
        return (
            <View style={styles.container} collapsable={false}>
                {
                    this.state.calculating?
                    (<Text>calculating...</Text>):
                    (
                        <View>
                            <View>
                                <View style={{height: 250,width: width, backgroundColor:Colors.primThree}}>
                                    <Text style={{color:'white', alignSelf:'center', paddingTop: '2%'}}>Titel</Text>
                                    <View style={{height: '95%', width: '95%', flexDirection: 'row', padding:'4%', paddingBottom: '4%'}}>
                                        <YAxis
                                                data={ data }
                                                contentInset={ contentInset }
                                                svg={{
                                                    fill: 'white',
                                                    fontSize: 10,
                                                }}
                                                numberOfTicks={ 4 }
                                                formatLabel={ value => `${value}` }
                                            />
                                            <LineChart
                                                style={{ flex: 1, marginLeft: 16 }}
                                                data={ data }
                                                svg={{ stroke: 'white', strokeWidth: 4 }}
                                                contentInset={{ top: 20, bottom: 20 }}
                                            >
                                                <Grid/>
                                            </LineChart>
                                    </View>
                                </View>
                                <View style={{padding:'3%'}}>
                                    <Text style={styles.header}>Retirement Income:</Text>
                                    <Text style={styles.value}>${this.state.retirementIncome}</Text>
                                    <Text style={styles.header}>Monthly Savings:</Text>
                                    <View style={styles.table}>
                                        {
                                            this.state.monthlySavings.map((save, index) =>
                                                <View style={styles.tableColumn} key={index}>
                                                    <View style={styles.tableItem}>
                                                        <Text style={styles.tableRate}>{annualRates[index]}</Text>
                                                    </View>
                                                    <View style={styles.tableItem}>
                                                        <Text style={styles.tableValue}>${save}</Text>
                                                    </View>
                                                </View> 
                                            )
                                        }
                                    </View>
                                </View>
                                <View style={styles.buttonContainer}>
                                        <Button style={styles.button} onPress={() => this.props._toggleSubview(false)}>
                                        <Text>Done</Text>
                                        </Button>
                                        <Button style={styles.button} onPress={() => this.props._share()}>
                                        <Text>Share</Text>
                                        </Button>
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: '700',
        paddingTop: 5,
    },
    value: {
        padding: 5,
        alignItems: 'center',
        fontSize: 18,
        color: 'green',
        fontWeight: '700'
    },
    table: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 70,
        // padding: 20,
    },
    tableColumn: {
        flex: 1,
        flexDirection: 'column',
        minWidth: 80,
    },
    tableItem: {
        borderWidth: 1,
    },
    tableValue: {
        // padding: 5,
        // alignItems: 'center',
        // fontSize: 18,
        color: 'green',
        fontWeight: '700'
    },
    tableRate: {
        // padding: 5,
        // alignItems: 'center',
        // fontSize: 18,
        // color: 'green',
        fontWeight: '700'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        paddingTop: '60%'
      },
    button: {
        margin: 10,
        width: 120,
        height: 70,
        justifyContent: "center"
      },
})
