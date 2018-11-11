import React from 'react';
import { Text } from 'react-native';
import { View, Modal, TouchableHighlight} from 'react-native';
import {futureValue, payment} from '../utils/pmtCalc';

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
        // USER INPUT PROPS
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
        
        this.setState({retirementIncome: -1*ri.toFixed(2), monthlySavings: msArr, calculating: false})
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.visible}
                onRequestClose={() => {}}
            >
                {
                    this.state.calculating?
                    (<Text>calculating...</Text>):
                    (
                        <View style={{marginTop: 22}}>
                            <View>
                                <Text>Retirement Income:</Text>
                                <Text>${this.state.retirementIncome}</Text>
                                <Text>Monthly Savings:</Text>
                                {
                                    this.state.monthlySavings.map(save => 
                                        <Text key={save}>${save}</Text>
                                    )
                                }
                                <TouchableHighlight
                                    onPress={() => {this.props.setModalVisible(!this.props.visible);
                                }}>
                                    <Text>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    )
                }
            </Modal>
    )
  }
}
