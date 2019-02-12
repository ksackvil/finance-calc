import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { futureValue, payment } from "../utils/pmtCalc";
import { Button, Content, Col } from "native-base";
import {
  LineChart,
  Grid,
  YAxis,
  XAxis,
  PieChart
} from "react-native-svg-charts";
import DynamicPieChart from "../components/DynamicPieChart";
import Colors from "../constants/Colors";
import { AsyncStorage } from "react-native";

var data = [];
const { width } = Dimensions.get("window");
var numeral = require("numeral");

export class ResultsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calculating: true,
      retirementIncome: null,
      monthlySavings: null
    };
  }

  // Desc: This function grabs the constants required for the calculations
  //       from the local cache
  // Post: If the keys in returnObj exist then the constant will be set with
  //       this keys value, else a default value will be used.
  _getCalcConstants = async () => {
    try {
      const returnObj = await AsyncStorage.multiGet([
        "@constant:retirementAge",
        "@constant:inflation",
        "@constant:annualRates"
      ]);

      // test if local cache is completely clear, if it is go straight to 
      // default values.
      if (returnObj !== []) {
        let tempObj = {};

        // Check retirementAge
        if (returnObj[0][1] == null) {
          tempObj["retirementAge"] = 65;
        } 
        else {
          tempObj["retirementAge"] = Number(returnObj[0][1]);
        }

        // Check Inflation
        if (returnObj[1][1] == null) {
          tempObj["inflation"] = 0.035;
        } 
        else {
          tempObj["inflation"] = Number(returnObj[1][1]);
        }

        // Check annual rates
        if (returnObj[2][1] == null) {
          tempObj["annualRates"] = [0.04, 0.06, 0.08, 0.1];
        }
        else {
            // Key is an formated string with ¬ separator, separate on this will
            // yeild an array, change each element to a number from string.
            let listOfRates = returnObj[2][1].split("~");
            for (let index in listOfRates) {
                listOfRates[index] = Number(listOfRates[index]);
            }

          tempObj["annualRates"] = listOfRates;
        }

        return tempObj;
      } 
      else {
        return {
          retirementAge: 65,
          inflation: 0.035,
          annualRates: [0.04, 0.06, 0.08, 0.1]
        };
      }
    } catch (error) {
      console.log('catched at ResultsModal.js line 88. ERROR: ' + error);
    }
  };

  componentDidMount() {
    this.setState({ calculating: true });
    this.calculate();
  }

  // Desc: This function handles the logic of the calculator. it uses the constants from 
  //    the local cache.
  // Pre: must get the calculator constants before calculation can proceed.
  // Post: State will be set with calculated values.
  calculate = async () => {
    let constObj = await this._getCalcConstants();

    // // USER INPUT PROPS
    var age = this.props.age;
    var annualIncome = this.props.income;

    // ASSUMED CONSTANTS
    const retireAge = constObj.retirementAge;
    const inflation = constObj.inflation;
    var annualRates = constObj.annualRates;

    // CALCULATED CONSTANTS
    const yrsTillRet = retireAge - age;
    const moTillRet = yrsTillRet * 12;

    // retirement income or future value
    var ri = futureValue(inflation, yrsTillRet, 0, annualIncome, 0);

    var msArr = [];
    for (rate of annualRates) {
      var ms = payment(rate / 12, moTillRet, 1, ri * 10, 0);
      msArr.push(ms.toFixed(2));
    }
    data = [];
    this.setState({
      retirementIncome: -1 * ri.toFixed(2),
      monthlySavings: msArr,
      calculating: false
    });
    for (let n of msArr) {
      data.push(Number(n));
    }
  };

  render() {
    const contentInset = { top: 20, bottom: 20 };
    const annualRates = [0.04, 0.06, 0.08, 0.1];

    return (
      <View style={styles.container} collapsable={false}>
        {this.state.calculating ? (
          <Text>calculating...</Text>
        ) : (
          <View>
            <View>
              <View
                style={{
                  height: 250,
                  width: width,
                  backgroundColor: Colors.primThree
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    alignSelf: "center",
                    paddingTop: "5%"
                  }}
                >
                  Results
                </Text>
                <View
                  style={{
                    height: "95%",
                    width: "95%",
                    flexDirection: "row",
                    paddingLeft: "4%",
                    paddingRight: "4%",
                    paddingBottom: "5%"
                  }}
                >
                  <YAxis
                    data={data}
                    style={{ marginBottom: "5%" }}
                    contentInset={contentInset}
                    svg={{
                      fill: "white",
                      fontSize: 10
                    }}
                    numberOfTicks={4}
                    formatLabel={value => numeral(value).format("0 a")}
                  />
                  <View style={{ flex: 1 }}>
                    <LineChart
                      style={{ flex: 1, marginLeft: 16 }}
                      data={data}
                      svg={{ stroke: "white", strokeWidth: 4 }}
                      contentInset={{ top: 20, bottom: 20 }}
                    >
                      <Grid />
                    </LineChart>
                    <XAxis
                      style={{
                        marginLeft: "5%",
                        marginRight: "5%",
                        marginBottom: "5%"
                      }}
                      data={[4, 6, 8, 10]}
                      formatLabel={(value, index) => `${index}%`}
                      contentInset={{ left: 10, right: 10 }}
                      svg={{ fontSize: 10, fill: "white" }}
                    />
                  </View>
                </View>
              </View>
              <View style={{ padding: "3%" }}>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.header}>Retirement Income</Text>
                    <Text style={styles.value}>
                      {numeral(this.state.retirementIncome).format("$0,0.00")}
                    </Text>
                  </View>

                  <DynamicPieChart />
                </View>
                <View style={{ marginTop: "8%" }}>
                  <Text style={styles.header}>Monthly Savings</Text>
                  <View style={styles.table}>
                    {this.state.monthlySavings.map((save, index) => (
                      <View style={styles.tableColumn} key={index}>
                        <View style={styles.tableItem}>
                          <Text style={styles.tableRate}>{`${annualRates[
                            index
                          ] * 10}%`}</Text>
                        </View>
                        <View style={styles.tableItem}>
                          <Text style={styles.tableValue}>
                            {numeral(save).format("$0,0.00")}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  style={[styles.button, { backgroundColor: Colors.primThree }]}
                  onPress={() => this.props._toggleSubview(false)}
                >
                  <Text style={styles.boldText}>DONE</Text>
                </Button>
                <Button
                  style={[styles.button, { backgroundColor: Colors.primOne }]}
                  onPress={() => this.props._share()}
                >
                  <Text style={styles.boldText}>SHARE</Text>
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  boldText: {
    fontWeight: "bold",
    color: "white"
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    paddingTop: 5,
    color: Colors.fgLight
  },
  value: {
    padding: 5,
    alignItems: "center",
    fontSize: 30,
    color: Colors.primThree,
    fontWeight: "700"
  },
  table: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
    paddingTop: "5%"
  },
  tableColumn: {
    flex: 1,
    flexDirection: "column",
    minWidth: 80
  },
  tableItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.fgLight,
    padding: "10%"
  },
  tableValue: {
    // padding: 5,
    // alignItems: 'center',
    // fontSize: 18,
    color: Colors.primThree,
    alignSelf: "center",
    fontWeight: "700"
  },
  tableRate: {
    // padding: 5,
    // alignItems: 'center',
    // fontSize: 18,
    color: Colors.fgLight,
    alignSelf: "center",
    fontWeight: "700"
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: "30%"
  },
  button: {
    margin: 10,
    width: 120,
    height: 60,
    justifyContent: "center"
  }
});
