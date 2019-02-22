/*
 *  CalculateScreen.js
 *
 *  Description:
 *      This is the first and default tab for this app. Here a user can input age and salary to
 *      calculate their investment portfolio. Age and salary must be properly formated in order to
 *      kick of calculation in ResultsModal.js, if not then error icon will appear. This validation is
 *      processed through the state variables prefixed by invalid, if any of these is true then
 *      button will be disabled, no calculation will go through. This also serves as the landing page
 *      for our app.
 *
 *  Sections:
 *      1. TAB NAVIGATION
 *      2. CONSTRUCTOR
 *      3. FUNCTIONS
 *      4. RENDER
 *      5. STYLE
 */

import React, { Component } from "react";
import { StyleSheet, View, Modal, Alert, Share, Keyboard } from "react-native";
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

export default class CalcForm extends Component {

    // ========== TAB NAVIGATION ========== //

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

    // ========== CONSTRUCTOR ========== //

    constructor(props) {
        super(props);

        this.state = {
            selected: undefined,
            modalVisible: false,
            age: null,
            invalidAge: false,
            income: null,
            invalidIncome: false,
            invalidForm: false
        };
    }

    // ========== FUNCTIONS ========== //

    // Des: Sets the state of modalVisible (boolean)
    // Pre: Param visible must be of type bool
    // Post: modalVisible changed to bool visible
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    // Des: Form onChange handler, validates input and updates state with
    //      new input value
    // Pre: key must be string, and must be age or income. value must be a number
    // Post: New value will be updated for key, if invalid, that keys error flag will be
    //       set to true else false.
    _valueChange(key, value) {
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

    // Des: handles sharing (currently not functional).
    // Pre: TBD
    // Post: TBD
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

    // ========== RENDER ========== //

    render() {
        return (
            <Container collapsible={false}>
                {this.state.modalVisible ? (
                    <Modal
                        visible
                        animationType="slide"
                        onRequestClose={msg => null}
                        collapsible={false}
                    >
                        <View
                            style={styles.subView}
                            collapsible={false}
                            ref={view => {
                                this._container = view;
                            }}
                        >
                            <ResultsModal
                                age={Number(this.state.age)}
                                income={Number(this.state.income)}
                                visible={true}
                                setModalVisible={this.setModalVisible.bind(
                                    this
                                )}
                                _share={this._share.bind(this)}
                            />
                        </View>
                    </Modal>
                ) : (
                    <View>
                        <View style={{ marginTop: "30%", marginRight: 10 }}>
                            <Form>
                                <Item error={this.state.invalidAge} fixedLabel>
                                    <Label>Age</Label>
                                    <Input
                                        onChangeText={val =>
                                            this._valueChange("age", val)
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
                                            this._valueChange("income", val)
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
                                    onPress={() => this.setModalVisible(true)}
                                >
                                    <Text>Calculate</Text>
                                </Button>
                            ) : (
                                <Button
                                    style={styles.activeButton}
                                    onPress={() => this.setModalVisible(true)}
                                >
                                    <Text>Calculate</Text>
                                </Button>
                            )}
                        </View>
                    </View>
                )}
            </Container>
        );
    }
}

// ========== STYLES ========== //

const styles = StyleSheet.create({
    activeButton: {
        backgroundColor: Colors.primThree
    },
    disabledButton: {
        backgroundColor: Colors.fgLight
    },
    subView: {
        flex: 1,
        alignItems: "flex-start"
    },
    button: {
        margin: 10,
        width: 120,
        height: 70,
        justifyContent: "center"
    }
});
