/*
 *  SettingsScreen.js
 *
 *  Description:
 *      This is the second tab of the app, shows developer info as well as calculator constants.
 *      Constants can be edited from this tab.
 * 
 *  Sections:
 *      1. TAB NAVIGATION
 *      2. CONSTRUCTOR
 *      3. FUNCTIONS
 *      4. RENDER
 *      5. COMPONENT CONSTANTS
 *      6. STYLE
 */

import React from "react";
import {
    SectionList,
    Image,
    StyleSheet,
    Text,
    View,
    Alert,
} from "react-native";
import { Button } from "native-base";
import Colors from "../constants/Colors";
import { AsyncStorage } from "react-native";
import { Constants } from "expo";
import {EditModal} from "../components/EditModal";

export default class SettingsScreen extends React.Component {

    // ========== TAB NAVIGATION ========== //

    static navigationOptions = {
        title: "Settings",
        headerTitleStyle: {
            color: "white",
            alignSelf: "center"
        },
        headerStyle: {
            backgroundColor: Colors.fgDark
        }
    };

    // ========== CONSTRUCTOR ========== //

    constructor() {
        super();

        this.state = {
            retirementAge: 0,  
            inflationRate: "",  
            annualRates: "",
            loading: true,
            modalVisible: false
        };

        // Grab calculator constants from local store
        this._getCalcConstants();
    }

    // ========== FUNCTIONS ==========//

    // Des: Gets constants from the local store.
    // Pre: state.loading is true
    // Post: The state members, retirementAge, inflationRate, and annualRates, will be updated
    //       to reflect the local store, state.loading will be false if successful, else error 
    //       message will be output.
    _getCalcConstants = async () => {
        try {
            // grab from local store
            const returnObj = await AsyncStorage.multiGet([
                "@constant:retirementAge",
                "@constant:inflation",
                "@constant:annualRates"
            ]);
            
            // if the store is not empty...
            if (returnObj !== []) {

                // default object
                let tempObj = {
                    retirementAge: 65,
                    inflationRate: "3.5 %",
                    annualRates: "[4, 6, 8, 10] %",
                    loading: false
                };

                // Check retirementAge
                if (returnObj[0][1] !== null) {
                    tempObj["retirementAge"] = returnObj[0][1];
                }

                // Check Inflation
                if (returnObj[1][1] !== null) {
                    tempObj["inflationRate"] = `${(Number(returnObj[1][1]) * 100).toFixed(1)} %`;
                }

                // Check annual rates
                if (returnObj[2][1] !== null) {

                    // Key is an formated string with ~ separator, separate on this will
                    // yeild an array, change each element to a number from string.
                    let listOfRates = returnObj[2][1].split("~");
                    let tempRates = ""
                    for (let index in listOfRates) {
                        if(index == 0) {
                            tempRates += `[${(listOfRates[index] * 100)}`;
                        }
                        else {
                            tempRates += `, ${(listOfRates[index] * 100)}`;
                        }
                    }

                    tempRates += "] %";
                    tempObj["annualRates"] = tempRates;
                }

                // update state
                this.setState(tempObj);
            } else {
                this.setState({
                    retirementAge: 65,
                    inflationRate: "3.5 %",
                    annualRates: "[4, 6, 8, 10] %",
                    loading: false
                });
            }
        } catch (error) {
            // output error message
            console.log(
                "catched at SettingsScreen.js, _getCalcConstants()" + error
            );
        }
    };

    // Des: Sets the constants in local store
    // Pre: retirement and inflation must be a number, annualRates must be an 
    //      array with 4 values.
    // Post: Local storage will be updated with new values of retirementAge (years),
    //       annualRates (decimal), and inflation (decimal). State will be updated with 
    //       retirementAge (years), annualRates (percentage), and inflationRate (percentage).
    _setCalcConstants = async (retirement, inflation, annualRates) => {
        try {
            let stateAnnualRate = ""; // rates to be displayed in app
            let cacheAnnualRate = "" // rates used for calculation & stored value
            let cacheInflation = inflation / 100; // inflation stored  
            let stateInflation = `${inflation} %`; // inflation to be displayed in app
            
            // Format the array annualRates, for the cache, make the pattern #1~#2~#3~#4,
            // for the state make the pattern [#1, #2, #3, #4] %. For cache convert to decimal 
            // representation from percentage, for state keep as percentage.
            for(let it in annualRates) {
                if(Number(it) === 0) {
                    cacheAnnualRate += `${(annualRates[it]/100)}`;
                    stateAnnualRate += `[${annualRates[it]}`;
                }
                else {
                    cacheAnnualRate += `~${(annualRates[it]/100)}`;
                    stateAnnualRate += `, ${annualRates[it]}`;
                }
            };

            // close bracket
            stateAnnualRate += `] %`;

            // Write to the local store the cache values
            await AsyncStorage.setItem("@constant:retirementAge", `${retirement}`);
            await AsyncStorage.setItem(
                "@constant:annualRates",
                `${cacheAnnualRate}`
            );
            await AsyncStorage.setItem("@constant:inflation", `${cacheInflation}`)
                
            // write to the state the state values
            this.setState({
                modalVisible: false,
                retirementAge: retirement,
                inflationRate: stateInflation,
                annualRates: stateAnnualRate
            });
        } catch (error) {
            // output error message
            console.log(error);
        }
    };

    // Des: Resets the constants to default values by writing them to local store
    // Post: retirementAge, annualRates, and inflation will be set to default vales in string 
    //       decimal (not percentage) format.
    _resetDefaults = async () => {
        try {
            await AsyncStorage.setItem("@constant:retirementAge", "65");
            await AsyncStorage.setItem(
                "@constant:annualRates",
                "0.04~0.06~0.08~0.1"
            );
            await AsyncStorage.setItem("@constant:inflation", "0.035");
            this.setState({
                retirementAge: 65,
                inflationRate: "3.5 %",
                annualRates: "[4, 6, 8, 10] %"
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Des: sets state.modalVisible to newState
    // Pre: newState must be of type bool
    // Post state.modalVisible set to newState
    setModalVisible(newState) {
        this.setState({ modalVisible: newState });
    }

    // Des: Handler for edit button. Alert box appears waring user about resetting the defaults.
    // Post: If ok is pressed this._resetDefaults is called (see above). Else
    //       modal is closed and nothing happens.
    _handleResetDefault() {
        Alert.alert(
            "Reset Defaults",
            "This action will reset all constants back to there default value, any changes made will be reset.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this._resetDefaults() }
            ],
            { cancelable: false }
        );
    }

    // Des: Renders each sections header
    // Pre: Section must be defined with title, and data
    // Post: Section is returned
    _renderSectionHeader = ({ section }) => {
        return (
            <SectionHeader
                title={section.title}
                constant={section.data[0].constant}
            />
        );
    };

    // Des: Renders each sections item
    // Pre: item must be defined with value, and and type
    // Post: Section item is returned
    _renderItem = ({ item }) => {
        if (item.type === "color") {
            return (
                <SectionContent>
                    {item.value && <Color value={item.value} />}
                </SectionContent>
            );
        } else {
            return (
                <SectionContent>
                    <Text style={styles.sectionContentText}>{item.value}</Text>
                </SectionContent>
            );
        }
    };

    // ========== RENDER ========== //

    render() {
        const { manifest } = Constants;
        const sections = [
            {
                data: [
                    {
                        value:
                            "The age at which most people normally retire from work, default age set to 65.",
                        constant: this.state.retirementAge
                    }
                ],
                title: "Retirement Age"
            },
            {
                data: [
                    {
                        value:
                            "Inflation indicates a decrease in the purchasing power of a nation's currency, default value is 3.5%",
                        constant: this.state.inflationRate
                    }
                ],
                title: "Inflation"
            },
            {
                data: [
                    {
                        value:
                            "Indicates the rate at which investment grows per year, default values are [2, 4, 8, 10] %",
                        constant: this.state.annualRates
                    }
                ],
                title: "Annual Rates"
            }
        ];

        return (
            <View style={styles.container}>
              {
                this.state.loading?
                (<View><Text>Loading</Text></View>):
                (
                  <View>
                  <EditModal
                    modalVisible={this.state.modalVisible}
                    setModalVisible={this.setModalVisible.bind(this)}
                    _handleEdit={this._handleEdit.bind(this)}
                    retirementAge={this.state.retirementAge}
                    inflationRate={this.state.inflationRate}
                    annualRates={this.state.annualRates}
                    _handleSave={this._setCalcConstants.bind(this)}
                />

                <SectionList
                    renderItem={this._renderItem}
                    renderSectionHeader={this._renderSectionHeader}
                    stickySectionHeadersEnabled={true}
                    keyExtractor={(item, index) => index}
                    ListHeaderComponent={ListHeader}
                    sections={sections}
                />
                <View style={{ display: "flex", paddingBottom: "10%" }}>
                    <View style={{ flexDirection: "row", alignSelf: "center" }}>
                        <Button
                            style={[styles.activeButton, styles.button]}
                            onPress={() => this.setModalVisible(true)}
                        >
                            <Text style={{ margin: "5%", color: "white" }}>
                                EDIT
                            </Text>
                        </Button>
                        <Button
                            style={styles.button}
                            danger
                            onPress={() => this._handleResetDefault()}
                        >
                            <Text style={{ margin: "5%", color: "white" }}>
                                RESET DEFAULTS
                            </Text>
                        </Button>
                    </View>
                </View>
                  </View>
                )
              }
            </View>
        );
    }
};

// ========== COMPONENT CONSTANTS ==========//

const ListHeader = () => {
    const { manifest } = Constants;

    return (
        <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
                <AppIconPreview iconUrl={manifest.iconUrl} />
            </View>

            <View style={styles.titleTextContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                    Financial Calculator TM
                </Text>

                <Text style={styles.slugText} numberOfLines={1}>
                    By KVN Software Solutions
                </Text>
{/* 
                <Text style={styles.descriptionText}>
                    Below are the constants used for the calculator. Click on a
                    constant to edit its value, changes made will persist until
                    edited again.
                </Text> */}
            </View>
        </View>
    );
};

const SectionHeader = ({ title, constant }) => {
    return (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderText}>
                {title}: <Text style={{ fontWeight: "bold" }}>{constant}</Text>
            </Text>
        </View>
    );
};

const SectionContent = props => {
    return <View style={styles.sectionContentContainer}>{props.children}</View>;
};

const AppIconPreview = ({ iconUrl }) => {
    if (!iconUrl) {
        iconUrl =
            "https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png";
    }

    return (
        <Image
            source={require("../assets/images/icon.png")}
            style={{ width: 64, height: 64 }}
            resizeMode="cover"
        />
    );
};

const Color = ({ value }) => {
    if (!value) {
        return <View />;
    } else {
        return (
            <View style={styles.colorContainer}>
                <View
                    style={[styles.colorPreview, { backgroundColor: value }]}
                />
                <View style={styles.colorTextContainer}>
                    <Text style={styles.sectionContentText}>{value}</Text>
                </View>
            </View>
        );
    }
};

// ========== STYLE ========== //

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    titleContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row"
    },
    titleIconContainer: {
        marginRight: 15,
        paddingTop: 2
    },
    titleTextContainer: {
        paddingRight: "20%"
    },
    sectionHeaderContainer: {
        backgroundColor: "#fbfbfb",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ededed"
    },
    sectionHeaderText: {
        textAlign: "center",
        fontSize: 14
    },
    sectionContentContainer: {
        paddingTop: 8,
        paddingBottom: 12,
        paddingHorizontal: 15
    },
    sectionContentText: {
        marginBottom: "5%",
        color: "#808080",
        fontSize: 14
    },
    nameText: {
        fontWeight: "600",
        fontSize: 18
    },
    slugText: {
        color: "#a39f9f",
        fontSize: 14,
        backgroundColor: "transparent"
    },
    descriptionText: {
        fontSize: 14,
        marginTop: 6,
        color: "#4d4d4d"
    },
    colorContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    colorPreview: {
        width: 17,
        height: 17,
        borderRadius: 2,
        marginRight: 6,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc"
    },
    colorTextContainer: {
        flex: 1
    },
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
