/*
 *  SettingsScreen.js
 *
 *  Description:
 *      
 *
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

    constructor() {
        super();

        this.state = {
            retirementAge: 0,
            inflationRate: "",
            annualRates: "",
            loading: true,
            modalVisible: false
        };

        this._getCalcConstants();
    }

    _getCalcConstants = async () => {
        try {
            const returnObj = await AsyncStorage.multiGet([
                "@constant:retirementAge",
                "@constant:inflation",
                "@constant:annualRates"
            ]);
            
            // console.log(returnObj);
            if (returnObj !== []) {
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
            console.log(
                "catched at SettingsScreen.js line 83. ERROR: " + error
            );
        }
    };

    _setCalcConstants = async (retirement, inflation, annualRates) => {
        try {
            let stateAnnualRate = "";
            let cacheAnnualRate = ""
            let cacheInflation = inflation / 100;
            let stateInflation = `${inflation} %`;
            
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

            stateAnnualRate += `] %`;

            console.log(cacheAnnualRate, retirement, cacheInflation);
            console.log(stateAnnualRate, retirement, stateInflation);

            await AsyncStorage.setItem("@constant:retirementAge", `${retirement}`);
            await AsyncStorage.setItem(
                "@constant:annualRates",
                `${cacheAnnualRate}`
            );
            await AsyncStorage.setItem("@constant:inflation", `${cacheInflation}`)
                
            this.setState({
                modalVisible: false,
                retirementAge: retirement,
                inflationRate: stateInflation,
                annualRates: stateAnnualRate
            });
        } catch (error) {
            console.log(error);
        }
    };

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

    setModalVisible(newState) {
        this.setState({ modalVisible: newState });
    }

    _handleEdit() {}

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

    _renderSectionHeader = ({ section }) => {
        return (
            <SectionHeader
                title={section.title}
                constant={section.data[0].constant}
            />
        );
    };

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
}

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
