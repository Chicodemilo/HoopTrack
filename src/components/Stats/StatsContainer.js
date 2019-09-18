import React, { Component } from "react";
import { Modal, Text, View, Button, StyleSheet, ScrollView, FlatList } from "react-native";
import PlayerStats from "./PlayerStats";
import SendReportContainer from "../SendReport/SendReportContainer";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";

class StatsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finalStats: props.finalStats,
            gameTime: props.gameTime,
            showFinalStats: props.showFinalStats,
            hideFinalStats: props.hideFinalStats,
            showSendReport: false
        };
    }

    showReportView = () => {
        this.setState({
            showSendReport: true
        });
    };

    hideReportView = () => {
        this.setState({
            showSendReport: false
        });
    };

    render() {
        let sendReportView = null;
        if (this.state.showSendReport == true) {
            sendReportView = (
                <SendReportContainer
                    hideReportView={this.hideReportView}
                    showSendReport={this.showSendReport}
                    finalStats={this.state.finalStats}
                />
            );
        }

        return (
            <Modal visible={this.props.gameOver} animationType="slide">
                <View style={styles.gameView}>
                    <Button
                        title="Hide Game Stats"
                        color="red"
                        onPress={() => {
                            this.props.hideFinalStats();
                        }}
                    />
                    <Button
                        title="Email Report"
                        color="blue"
                        onPress={() => {
                            this.showReportView();
                        }}
                    />
                </View>
                <View style={styles.statsBox}>
                    <PlayerStats finalStats={this.state.finalStats} />
                </View>
                {sendReportView}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    gameView: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
        color: "green",
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 30,
        paddingBottom: 10,
        borderBottomColor: "black",
        borderWidth: 1,
        width: wp("100%"),
        height: hp("15%")
    },
    statsBox: {
        height: hp("84%")
    }
});

export default StatsContainer;
