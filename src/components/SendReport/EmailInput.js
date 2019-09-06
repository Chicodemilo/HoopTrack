import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

class EmailInput extends Component {
    //
    state = {
        emailSent: false,
        gameNamed: false,
        gameName: "",
        emailAddress: ""
    };
    render() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabels}>Game: </Text>
                <TextInput
                    style={styles.emailInput}
                    placeholder="Enter A Name For This Game"
                />
                <Text style={styles.inputLabels}>Email Address: </Text>
                <TextInput
                    style={styles.emailInput}
                    placeholder="Enter Your Email Address"
                />
                <Button style={styles.inputButton} title="Send Game Stats" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    emailInput: {
        height: 50,
        width: "93%",
        borderColor: "#ccc",
        borderWidth: 0.5,
        padding: 5,
        margin: 5
    },
    inputContainer: {
        flexDirection: "column",
        justifyContent: "space-between"
    },
    inputButton: {
        margin: 2,
        width: "40%"
    },
    inputLabels: {
        fontSize: 11,
        color: "#ababab",
        marginTop: 15,
        marginLeft: 5
    }
});

export default EmailInput;
