import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";

const startButton = props => (
    <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={props.startTheGame} disabled={props.allowGame} style={this.buttonStyle(props.allowGame)}>
            <View style={styles.button}>
                <Text style={{ color: "white" }}>Start Game</Text>
            </View>
        </TouchableOpacity>
    </View>
);

buttonStyle = allow => {
    thisStyle = allow ? styles.disableButton : styles.startButton;
    return thisStyle;
};

const styles = StyleSheet.create({
    buttonContainer: {
        // flex: 1,
        width: "100%",
        borderBottomColor: "grey",
        borderBottomWidth: 0.5,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10
    },
    startButton: {
        width: "100%",
        padding: 12,
        alignSelf: "stretch",
        backgroundColor: "#cc5500",
        alignItems: "center"
    },
    disableButton: {
        width: "100%",
        alignItems: "center",
        backgroundColor: "#ccc",
        padding: 12
    }
});

export default startButton;
