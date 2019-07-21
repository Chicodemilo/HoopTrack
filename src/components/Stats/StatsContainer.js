import React, { Component } from "react";
import { Modal, Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";

class StatsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            finalStats: props.gamePlayers,
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
        paddingBottom: 20
    }
});

export default StatsContainer;
