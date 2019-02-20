/*
 *  CalculateScreen.js
 *
 *  Description:
 * 
 *  Sections:
 */

import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Modal,
    Alert,
    Animated,
    Dimensions,
    Share,
    Keyboard
} from "react-native";
import {
    Form,
    Item,
    Input,
    Label,
    Container,
    Text,
    Button,
    Icon
} from "native-base";
import { ResultsModal } from "../components/ResultsModal";
import Colors from "../constants/Colors";

import { takeSnapshotAsync } from "expo";

var isHidden = true;
const { height } = Dimensions.get("window");

export default class CalcForm extends Component {
    static navigationOptions = {
        title: "Monthly Savings",
        headerTitleStyle: {
            color: "white",
            alignSelf: "center"
        },
        headerStyle: {
            backgroundColor: Colors.fgDark
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            selected: undefined,
            modalVisible: false,
            age: null,
            invalidAge: false,
            income: null,
            invalidIncome: false,
            invalidForm: false,
            bounceValue: new Animated.Value(height - 100)
        };
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    handleValueChange(key, value) {
        if (isNaN(value) || value == 0) {
            if (key === "age") {
                this.setState({ age: value, invalidAge: true });
            } else if (key === "income") {
                this.setState({ income: value, invalidIncome: true });
            }
        } else if (key === "age" && !(value % 1 === 0)) {
            if (key === "age") {
                this.setState({ age: value, invalidAge: true });
            }
        } else if (key == "age" && value >= 65) {
            this.setState({ age: value, invalidAge: true });
        } else {
            if (key === "age") {
                this.setState({
                    age: value,
                    invalidAge: false,
                    invalidIncome: false
                });
            } else if (key === "income") {
                this.setState({
                    income: value,
                    invalidAge: false,
                    invalidIncome: false
                });
            }
        }
    }

    _toggleSubview(visible) {
        Keyboard.dismiss();

        this.setState({
            modalVisible: visible
        });

        // var toValue = (height - height/7);

        // if(isHidden) {
        //   toValue = height/20;
        // }

        // //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        // //100 comes from the style below, which is the height of the subview.
        // Animated.spring(
        //   this.state.bounceValue,
        //   {
        //     toValue: toValue,
        //     velocity: 3,
        //     tension: 2,
        //     friction: 8,
        //   }
        // ).start();

        // isHidden = !isHidden;
    }

    _share = async () => {
        try {
            let result = await takeSnapshotAsync(this._container, {
                format: "jpg",
                result: "file"
            });

            Share.share(
                {
                    message: "Your Monthly Savings Calculations",
                    url: result,
                    title: "Financial Calculator"
                },
                {
                    // Android only:
                    dialogTitle: "reactive-solutions"
                    // iOS only:
                    // excludedActivityTypes: [
                    //   'com.apple.UIKit.activity.PostToTwitter'
                    // ]
                }
            );
        } catch (err) {
            Alert.alert("Error", "Failed to share.");
            console.log(err);
        }
    };

    render() {
        return (
            <Container collapsable={false}>
                {this.state.modalVisible ? (
                    <Modal
                        visible
                        animationType="slide"
                        onRequestClose={msg => null}
                        collapsable={false}
                        style={{ height: height }}
                    >
                        {/* <Animated.View ref="viewShot"
                style={[
                  styles.subView,
                  {transform: [{translateY: this.state.bounceValue}]}
                ]}
                ref={view => {
                  this._container = view;
                }}
              >
                 */}
                        <View
                            style={styles.subView}
                            collapsable={false}
                            ref={view => {
                                this._container = view;
                            }}
                            // ref="viewShot"
                        >
                            <ResultsModal
                                age={this.state.age}
                                income={this.state.income}
                                visible={true}
                                setModalVisible={this.setModalVisible.bind(
                                    this
                                )}
                                _toggleSubview={this._toggleSubview.bind(this)}
                                _share={this._share.bind(this)}
                            />
                        </View>
                        {/* <View style={styles.buttonContainer}>
                                        <Button style={styles.button} onPress={() => this._toggleSubview(false)}>
                                        <Text>Done</Text>
                                        </Button>
                                        <Button style={styles.button} onPress={() => this._share()}>
                                        <Text>Share</Text>
                                        </Button>
                                </View> */}

                        {/* </Animated.View> */}
                    </Modal>
                ) : (
                    <View>
                        <View style={{ marginTop: "30%", marginRight: 10 }}>
                            <Form>
                                <Item error={this.state.invalidAge} fixedLabel>
                                    <Label>Age</Label>
                                    <Input
                                        onChangeText={val =>
                                            this.handleValueChange("age", val)
                                        }
                                        placeholder="Enter current age"
                                        returnKeyLabel="Done"
                                        returnKeyType="done"
                                        value={this.state.age}
                                        keyboardType="numeric"
                                    />
                                    {this.state.invalidAge ? (
                                        <Icon name="close-circle" />
                                    ) : null}
                                </Item>
                                <Item
                                    error={this.state.invalidIncome}
                                    fixedLabel
                                >
                                    <Label>Income</Label>
                                    <Input
                                        onChangeText={val =>
                                            this.handleValueChange(
                                                "income",
                                                val
                                            )
                                        }
                                        placeholder="Enter annual income"
                                        returnKeyLabel="Done"
                                        returnKeyType="done"
                                        value={this.state.income}
                                        keyboardType="numeric"
                                    />
                                    {this.state.invalidIncome ? (
                                        <Icon name="close-circle" />
                                    ) : null}
                                </Item>
                                {/* <Item fixedLabel last>
                  <Label>Savings Plan</Label>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        placeholder="Select Acceleration"
                        placeholderIconColor="#007aff"
                        style={{ width: undefined }}
                        selectedValue={this.state.selected}
                        onValueChange={this.onValueChange.bind(this)}
                      >
                        <Picker.Item label="RRSP" value="key0" />
                        <Picker.Item label="- 3.8 (Mars)" value="key1" />
                      </Picker>
                  </Item> */}
                            </Form>
                        </View>
                        <View style={{ margin: 20, alignSelf: "center" }}>
                            {this.state.invalidAge ||
                            this.state.invalidIncome ||
                            (this.state.age === null ||
                                this.state.age === "" ||
                                (this.state.income === null ||
                                    this.state.income === "")) ? (
                                <Button
                                    style={styles.disabledButton}
                                    disabled
                                    onPress={() => this._toggleSubview(true)}
                                >
                                    <Text>Calculate</Text>
                                </Button>
                            ) : (
                                <Button
                                    style={styles.activeButton}
                                    onPress={() => this._toggleSubview(true)}
                                >
                                    <Text>Calculate</Text>
                                </Button>
                            )}
                        </View>
                    </View>
                )}

                {/* <View style={{margin: 12, alignSelf: "center"}}>
          <Text style={{fontWeight:"bold", fontSize: 18, marginTop:10}}>
            Calculating Force (Newtons)
          </Text>
          <Text style={{textAlign:"center", fontSize:30, margin: 10}}>
            F = m x a
          </Text>
          <Text style= {{marginLeft: 20, marginRight:20, marginTop: 5, marginBottom: 5}}>
            {`\u2022 Force (F) is mesured in newtons (N), it's sign represents force direction`}
          </Text>
          <Text style= {{marginLeft: 20, marginRight:20, marginTop: 5, marginBottom: 5}}>
            {`\u2022 Mass (m) is mesured in kilograms (Kg)`}
          </Text>
          <Text style= {{marginLeft: 20, marginRight:20, marginTop: 5, marginBottom: 5}}>
            {`\u2022 Acceleration due to gravity (a) is mesured in meters per second squared (m/s^2)`}
          </Text>
        </View>
        <View style={{margin: 10, }}>
          <Text>
          This equation is one of the most useful in classical physics. It is a concise statement of Isaac Newton's Second Law of Motion, holding both the proportions and vectors of the Second Law.
          </Text>
        </View> */}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    activeButton: {
        backgroundColor: Colors.primThree
    },
    disabledButton: {
        backgroundColor: Colors.fgLight
    },
    subView: {
        flex: 1,
        // height:'100%',
        alignItems: "flex-start"
    },
    button: {
        margin: 10,
        width: 120,
        height: 70,
        justifyContent: "center"
    }
});
