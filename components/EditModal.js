/*
 *  EditModal.js
 *
 *  Description:
 *      With this class a users can change the constants which are used in the calculations. This
 *      class handles the interaction between user and local store, a user can change retirementAge,
 *      inflation, and  annualRates from here.
 *
 *  Sections:
 *      1. CONSTRUCTOR
 *      2. FUNCTIONS
 *      3. RENDER
 *      4. PROP TYPES
 *      5. STYLE
 */

import React from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { Form, Item, Input, Label, Button, Icon } from "native-base";
import Colors from "../constants/Colors";

export class EditModal extends React.Component {
    constructor(props) {
        super(props);

        // Formating state
        let splitAnnualRates = this.props.annualRates
            .split("[")[1]
            .split("]")[0]
            .split(",");
        let tempAnnualRates = [];
        let tempInflation = this.props.inflationRate.split(" ")[0];

        for (let rate of splitAnnualRates) {
            tempAnnualRates.push(rate.trim());
        }

        this.state = {
            retirementAge: this.props.retirementAge,  
            inflation: tempInflation,
            annualRates: tempAnnualRates,
            invalidRetirementAge: false,
            invalidInflation: false,
            invalidAnnualRates: false
        };
    }

    handleValueChange(key, value, el = 0) {
        console.log(key, value);

        switch (key) {
            case "retirementAge":

                if(isNaN(value)) {
                    tempErr = true;
                }

                this.setState({retirementAge: value, invalidRetirementAge: tempErr});

                break;

            case "inflation":
                var tempErr = this.state.invalidInflation;

                if (isNaN(value)) {
                    tempErr = true;
                }

                this.setState({ inflation: value, invalidInflation: tempErr });

                break;

            case "annualRates":
                if (!isNaN(value) || value === "") {
                }

                this.setState(prevState => {
                    const annualRates = prevState.annualRates.map(
                        (num, count) => {
                            if (count == el) {
                                return value;
                            } else {
                                return num;
                            }
                        }
                    );

                    return { annualRates };
                });

                break;

            default:
                break;
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {}}
            >
                <View>
                    <Text
                        style={{
                            fontWeight: "600",
                            fontSize: 20,
                            marginTop: "10%",
                            marginLeft: "5%"
                        }}
                    >
                        Edit Constants
                    </Text>
                    <Text
                        style={{
                            marginTop: "5%",
                            marginLeft: "5%",
                            marginRight: "5%"
                        }}
                    >
                        Below are the constants used for the calculator. Click
                        on a constant to edit its value, changes made will
                        persist until edited again.
                    </Text>
                    <View style={{ marginTop: "5%", marginRight: 10 }}>
                        <Form>
                            <Label
                                style={{
                                    fontWeight: "bold",
                                    color: "#4d4d4d",
                                    alignSelf: "center"
                                }}
                            >
                                Retirement Age (years)
                            </Label>
                            <Item
                                error={this.state.invalidRetirementAge}
                                fixedLabel
                            >
                                <Input
                                    style={{ textAlign: "center" }}
                                    onChangeText={val =>
                                        this.handleValueChange(
                                            "retirementAge",
                                            val
                                        )
                                    }
                                    placeholder="Enter an age"
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    value={this.state.retirementAge}
                                    keyboardType="numeric"
                                />
                                {this.state.invalidRetirementAge ? (
                                    <Icon name="close-circle" />
                                ) : null}
                            </Item>
                            <Label
                                style={{
                                    fontWeight: "bold",
                                    alignSelf: "center",
                                    color: "#4d4d4d",
                                    paddingTop: "5%"
                                }}
                            >
                                Inflation (%)
                            </Label>
                            <Item
                                error={this.state.invalidInflation}
                                fixedLabel
                            >
                                <Input
                                    style={{ textAlign: "center" }}
                                    onChangeText={val =>
                                        this.handleValueChange("inflation", val)
                                    }
                                    placeholder="Enter new inflation"
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    value={this.state.inflation}
                                    keyboardType="numeric"
                                />
                                {this.state.invalidInflation ? (
                                    <Icon name="close-circle" />
                                ) : null}
                            </Item>

                            {/* ===== ANNUAL RATES ===== */}
                            <Label
                                style={{
                                    fontWeight: "bold",
                                    alignSelf: "center",
                                    color: "#4d4d4d",
                                    paddingTop: "5%"
                                }}
                            >
                                Annual Rates (%)
                            </Label>
                            <Item
                                fixedLabel
                                style={{
                                    paddingLeft: "5%",
                                    paddingRight: "5%"
                                }}
                            >
                                <Text>[</Text>
                                <Input
                                    onChangeText={val =>
                                        this.handleValueChange(
                                            "annualRates",
                                            val,
                                            0
                                        )
                                    }
                                    placeholder="#1"
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    value={this.state.annualRates[0]}
                                    keyboardType="numeric"
                                />
                                <Input
                                    onChangeText={val =>
                                        this.handleValueChange(
                                            "annualRates",
                                            val,
                                            1
                                        )
                                    }
                                    placeholder="#2"
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    value={this.state.annualRates[1]}
                                    keyboardType="numeric"
                                />
                                <Input
                                    onChangeText={val =>
                                        this.handleValueChange(
                                            "annualRates",
                                            val,
                                            2
                                        )
                                    }
                                    placeholder="#3"
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    value={this.state.annualRates[2]}
                                    keyboardType="numeric"
                                />
                                <Input
                                    onChangeText={val =>
                                        this.handleValueChange(
                                            "annualRates",
                                            val,
                                            3
                                        )
                                    }
                                    placeholder="#4"
                                    returnKeyLabel="Done"
                                    returnKeyType="done"
                                    value={this.state.annualRates[3]}
                                    keyboardType="numeric"
                                />
                                <Text>]</Text>

                                {/* {this.state.invalidIncome ? (
                                    <Icon name="close-circle" />
                                ) : null} */}
                            </Item>
                        </Form>
                    </View>

                    <View style={{ display: "flex", paddingTop: "20%" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignSelf: "center"
                            }}
                        >
                            <Button
                                style={[styles.disabledButton, styles.button]}
                                onPress={() =>
                                    this.props.setModalVisible(false)
                                }
                            >
                                <Text style={{ margin: "5%", color: "white" }}>
                                    CANCEL
                                </Text>
                            </Button>
                            {
                                (this.state.invalidAnnualRates || this.state.invalidInflation || this.state.invalidRetirementAge) ?
                                (
                                    <Button
                                        disabled
                                        style={[styles.button, styles.disabledButton]}
                                    >
                                        <Text style={{ margin: "5%", color: "white" }}>
                                            SAVE
                                        </Text>
                                    </Button>
                                ):
                                (
                                    <Button
                                        style={[styles.button, styles.activeButton]}
                                        onPress={() => this.props._handleSave(this.state.retirementAge, this.state.inflation, this.state.annualRates)}
                                    >
                                        <Text style={{ margin: "5%", color: "white" }}>
                                            SAVE
                                        </Text>
                                    </Button>
                                )
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        margin: 10,
        justifyContent: "center"
    },
    disabledButton: {
        backgroundColor: Colors.fgLight
    },
    activeButton: {
        backgroundColor: Colors.primThree
    }
});
