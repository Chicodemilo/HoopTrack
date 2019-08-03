import React, { Component } from "react";
import { Modal, Text, View, Button, StyleSheet, ScrollView, FlatList } from "react-native";
import PlayerStats from "./PlayerStats";
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
            hideFinalStats: props.hideFinalStats
        };
    }

    render() {
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
                </View>
                <View style={styles.statsBox}>
                    <PlayerStats finalStats={this.state.finalStats} />
                </View>
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
