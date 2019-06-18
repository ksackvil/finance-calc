/*
 *  ResultsModal.js
 *
 *  Description:
 *      This component renders after valid age and income is input into form from CalculateScreen
 *      and calculate button is pressed. This class handles the calculations which is the backbone
 *      of this app (calculate()). The calculations use the constants set in local cache: retirementAge,
 *      inflation, and annualRates. These effect the outcome displayed with this app, and can be changed
 *      in the SettingsScreen. This class will display calculation results in a pretty way :)
 *
 *  Sections:
 *      1. CONSTRUCTOR
 *      2. FUNCTIONS
 *      3. RENDER
 *      4. PROP TYPES
 *      5. STYLE
 */

import PropTypes from "prop-types";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import { futureValue, payment } from "../utils/pmtCalc";
import { Button } from "native-base";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import Colors from "../constants/Colors";
import { AsyncStorage } from "react-native";
import DynamicPieChart from "./DynamicPieChart";

var data = [];
const { width } = Dimensions.get("window");
var numeral = require("numeral");

export class ResultsModal extends React.Component {
  // ========== CONSTRUCTOR ========== //

  constructor(props) {
    super(props);
    this.state = {
      calculating: true, // used for loading I/O
      retirementIncome: null, // number calculated
      monthlySavings: null, // array based on each annual rates
      yearsTillRetirement: 0, // Number of years till retire depends on retire age
      fin: null // User fin number 10x retirement income
    };
  }

  // ========== FUNCTIONS ========== //

  // Des: Runs every time component is mounted
  // Post: state.calculating is true, calculate() is called.
  componentDidMount() {
    this.setState({ calculating: true });
    this.calculate();
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
      console.log(returnObj);
      if (returnObj !== []) {
        let tempObj = {};

        // Check retirementAge
        if (returnObj[0][1] == null) {
          tempObj["retirementAge"] = 65;
        } else {
          tempObj["retirementAge"] = Number(returnObj[0][1]);
        }

        // Check Inflation
        if (returnObj[1][1] == null) {
          tempObj["inflation"] = 0.035;
        } else {
          tempObj["inflation"] = Number(returnObj[1][1]);
        }

        // Check annual rates
        if (returnObj[2][1] == null) {
          tempObj["annualRates"] = [0.04, 0.06, 0.08, 0.1];
        } else {
          // Key is an formated string with ¬ separator, separate on this will
          // yeild an array, change each element to a number from string.
          let listOfRates = returnObj[2][1].split("~");
          for (let index in listOfRates) {
            listOfRates[index] = Number(listOfRates[index]);
          }

          tempObj["annualRates"] = listOfRates;
        }

        this.setState(tempObj);
        return tempObj;
      } else {
        this.setState({
          retirementAge: 65,
          inflation: 0.035,
          annualRates: [0.04, 0.06, 0.08, 0.1]
        });
        return {
          retirementAge: 65,
          inflation: 0.035,
          annualRates: [0.04, 0.06, 0.08, 0.1]
        };
      }
    } catch (error) {
      console.log("catched at ResultsModal.js line 88. ERROR: " + error);
    }
  };

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

    console.log(retireAge, typeof inflation, annualRates);

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
      calculating: false,
      yearsTillRetirement: yrsTillRet,
      fin: -10 * ri.toFixed(2)
    });
    for (let n of msArr) {
      data.push(Number(n));
    }
  };

  valueAfterTax(vehicle) {
    switch (vehicle) {
      case "OPEN":
        let temp =
          this.state.fin +
          -1 *
            this.state.monthlySavings[3] *
            12 *
            this.state.yearsTillRetirement;
        return temp * 0.8;

      case "RRSP":
        return numeral(this.state.retirementIncome * 0.6).format("$0,0.00");

      default:
        return "NaN";
    }
  }
  // ========== RENDER ========== //

  render() {
    const contentInset = { top: 20, bottom: 20 };

    return (
      <ScrollView style={styles.container} collapsible={false}>
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
                    data={[0, 1]}
                    style={{ marginBottom: "5%" }}
                    contentInset={contentInset}
                    svg={{
                      fill: "white",
                      fontSize: 10
                    }}
                    numberOfTicks={0}
                    showGrid={false}
                    formatLabel={value => numeral(value).format("0 a")}
                  />
                  <View style={{ flex: 1 }}>
                    <LineChart
                      style={{ flex: 1, marginLeft: 16 }}
                      data={[0, 65]}
                      numberOfTicks={0}
                      svg={{
                        stroke: "white",
                        strokeWidth: 4
                      }}
                      contentInset={{
                        top: 20,
                        bottom: 20
                      }}
                    >
                      <Grid />
                    </LineChart>
                    <XAxis
                      style={{
                        marginLeft: "5%",
                        marginRight: "5%",
                        marginBottom: "5%"
                      }}
                      data={[0, 10]}
                      numberOfTicks={0}
                      showGrid={false}
                      formatLabel={(value, index) => {
                        if (value === 0) {
                          //   return "Start";
                        } else {
                          //   return "End";
                        }
                      }}
                      contentInset={{
                        left: 10,
                        right: 10
                      }}
                      svg={{
                        fontSize: 10,
                        fill: "white"
                      }}
                    />
                  </View>
                </View>
                <View style={{position:'absolute'}}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                      alignSelf: "center",
                      top: "20%",
                      left:'20%'
                    }}
                  >
                    
                  </Text>
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

                  {/* PUT ACCUMULATION CHART HERE */}
                </View>

                <View style={{ marginTop: "8%" }}>
                  <Text style={styles.header}>Monthly Savings</Text>
                  <View style={styles.table}>
                    <View style={styles.tableColumn}>
                      <View style={styles.tableItem}>
                        <Text style={styles.tableRate}>Annual Rate</Text>
                      </View>
                      <View style={styles.tableItem}>
                        <Text style={styles.tableValue}>Savings</Text>
                      </View>
                    </View>
                    {this.state.monthlySavings.map((save, index) => (
                      <View style={styles.tableColumn} key={index}>
                        <View style={styles.tableItem}>
                          <Text style={styles.tableRate}>{`${this.state
                            .annualRates[index] * 100}%`}</Text>
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

                <View style={{ marginTop: "8%" }}>
                  <Text style={styles.header}>Savings Containers</Text>

                  <View style={styles.savingsContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <Image
                            style={{
                              width: 25,
                              height: 25
                            }}
                            source={{
                              uri:
                                "https://img.icons8.com/office/40/000000/launched-rocket.png"
                            }}
                          />
                          <Text style={styles.savingsContainerHeader}>IRP</Text>
                        </View>
                        <View style={{ marginLeft: "5%" }}>
                          <Text
                            style={[
                              styles.savingsContainerText,
                              {
                                paddingRight: "5%"
                              }
                            ]}
                          >
                            Stored in a Mutual Fund.{" "}
                            <Text
                              style={{
                                color: Colors.primTwo
                              }}
                            >
                              0%
                            </Text>{" "}
                            growth taxable.{" "}
                            <Text
                              style={{
                                color: Colors.fgDark
                              }}
                            >
                              100%
                            </Text>{" "}
                            savings. No deposit limits.{" "}
                            {numeral(this.state.fin).format("$0,0.00")} saved
                            before and after tax.
                          </Text>
                        </View>
                      </View>

                      {/* <DynamicPieChart
                                                taxed={0}
                                                savings={100}
                                            /> */}
                    </View>
                  </View>

                  <View style={styles.savingsContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <Image
                            style={{
                              width: 25,
                              height: 25
                            }}
                            source={{
                              uri:
                                "https://img.icons8.com/color/48/000000/prop-plane.png"
                            }}
                          />
                          <Text style={styles.savingsContainerHeader}>
                            TFSA
                          </Text>
                        </View>
                        <View style={{ marginLeft: "5%" }}>
                          <Text
                            style={[
                              styles.savingsContainerText,
                              {
                                paddingRight: "5%"
                              }
                            ]}
                          >
                            Stored in a Mutual Fund.{" "}
                            <Text
                              style={{
                                color: Colors.primTwo
                              }}
                            >
                              0%
                            </Text>{" "}
                            growth taxable.{" "}
                            <Text
                              style={{
                                color: Colors.fgDark
                              }}
                            >
                              100%
                            </Text>{" "}
                            savings. deposits limited.{" "}
                            {numeral(this.state.fin).format("$0,0.00")} saved
                            before and after tax.
                          </Text>
                        </View>
                      </View>
                      {/* <DynamicPieChart
                                                taxed={15}
                                                savings={80}
                                            /> */}
                    </View>
                  </View>

                  <View style={styles.savingsContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <Image
                            style={{
                              width: 25,
                              height: 25
                            }}
                            source={{
                              uri:
                                "https://img.icons8.com/color/48/000000/fiat-500.png"
                            }}
                          />
                          <Text style={styles.savingsContainerHeader}>
                            OPEN
                          </Text>
                        </View>
                        <View style={{ marginLeft: "5%" }}>
                          <Text style={styles.savingsContainerText}>
                            Stored in a Mutual Fund.
                          </Text>
                          <Text style={styles.savingsContainerText}>
                            {numeral(this.state.fin).format("$0,0.00")} before
                            tax.
                          </Text>
                          <Text style={styles.savingsContainerText}>
                            {numeral(this.valueAfterTax("OPEN")).format(
                              "$0,0.00"
                            )}{" "}
                            saved after tax.
                          </Text>

                          <Text style={styles.savingsContainerText}>
                            <Text
                              style={{
                                color: Colors.primTwo
                              }}
                            >
                              {100 -
                                (
                                  (this.valueAfterTax("OPEN") /
                                    this.state.fin) *
                                  100
                                ).toFixed(0)}
                              %
                            </Text>{" "}
                            of profit taxed.
                          </Text>
                          <Text style={styles.savingsContainerText}>
                            <Text
                              style={{
                                color: Colors.fgDark,
                                fontWeight: "800"
                              }}
                            >
                              {(
                                (this.valueAfterTax("OPEN") / this.state.fin) *
                                100
                              ).toFixed(0)}
                              %
                            </Text>{" "}
                            savings.
                          </Text>
                        </View>
                      </View>
                      <DynamicPieChart
                        taxed={
                          100 -
                          (
                            (this.valueAfterTax("OPEN") / this.state.fin) *
                            100
                          ).toFixed(0)
                        }
                        savings={(
                          (this.valueAfterTax("OPEN") / this.state.fin) *
                          100
                        ).toFixed(0)}
                      />
                    </View>
                  </View>
                  <View style={styles.savingsContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <Image
                            style={{
                              width: 25,
                              height: 25
                            }}
                            source={{
                              uri:
                                "https://img.icons8.com/color/48/000000/bicycle.png"
                            }}
                          />
                          <Text style={styles.savingsContainerHeader}>
                            RRSP
                          </Text>
                        </View>
                        <View style={{ marginLeft: "5%" }}>
                          <Text style={styles.savingsContainerText}>
                            Stored in a Mutual Fund.
                          </Text>
                          <Text style={styles.savingsContainerText}>
                            {numeral(this.state.fin).format("$0,0.00")} before
                            tax.
                          </Text>
                          <Text style={styles.savingsContainerText}>
                            {this.valueAfterTax("RRSP")} saved after tax.
                          </Text>

                          <Text style={styles.savingsContainerText}>
                            <Text
                              style={{
                                color: Colors.primTwo
                              }}
                            >
                              40%
                            </Text>{" "}
                            of profit taxed.
                          </Text>
                          <Text style={styles.savingsContainerText}>
                            <Text
                              style={{
                                color: Colors.fgDark,
                                fontWeight: "800"
                              }}
                            >
                              60%
                            </Text>{" "}
                            savings.
                          </Text>
                        </View>
                      </View>
                      <DynamicPieChart taxed={40} savings={60} />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  style={[styles.button, { backgroundColor: Colors.primThree }]}
                  onPress={() => this.props.setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>DONE</Text>
                </Button>
                <Button
                  style={[styles.button, { backgroundColor: Colors.primOne }]}
                  onPress={() => this.props._share()}
                >
                  <Text style={styles.buttonText}>SHARE</Text>
                </Button>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

// ========== PROP TYPES ========== //

ResultsModal.propTypes = {
  age: PropTypes.number, // age of person >0 <65
  income: PropTypes.number, // income >0
  visible: PropTypes.bool, // controls if modal is shown
  setModalVisible: PropTypes.func, // changes visibility
  _share: PropTypes.func // handles sharing
};

// ========== STYLE ========== //

const styles = StyleSheet.create({
  container: {},
  buttonText: {
    color: "white"
  },
  header: {
    fontSize: 24,
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
    flexDirection: "column",
    alignItems: "center",
    minHeight: 70,
    paddingTop: "5%"
  },
  tableColumn: {
    flex: 1,
    flexDirection: "row",
    minWidth: "100%"
  },
  tableItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.fgLight,
    padding: "2%"
  },
  tableValue: {
    color: Colors.primThree,
    alignSelf: "center",
    fontWeight: "700"
  },
  tableRate: {
    color: Colors.fgLight,
    alignSelf: "center",
    fontWeight: "700"
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: "10%",
    paddingBottom: "10%"
  },
  button: {
    width: "25%",
    marginLeft: "2%",
    marginRight: "2%",
    justifyContent: "center"
  },
  savingsContainer: {
    marginTop: "6%",
    marginLeft: "2%"
  },
  savingsContainerHeader: {
    color: Colors.primThree,
    fontWeight: "800",
    marginLeft: "2%"
  },
  savingsContainerText: {
    color: Colors.fgLight,
    fontWeight: "500"
  }
});
