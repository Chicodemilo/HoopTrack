import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { format, getTime } from "date-fns";
import axios from "axios";
// import { API_KEY } from "react-native-dotenv";

class EmailInput extends Component {
    //
    state = {
        emailSent: false,
        gameNamed: false,
        gameName: "",
        gameId: "",
        emailAddress: "",
        finalStats: this.props.finalStats,
        showEmailWarning: false
    };

    componentDidMount() {
        this.setState({
            gameId: this.makeGameId()
        });
    }

    saveGameName = val => {
        this.setState(prevState => {
            return {
                gameNamed: true,
                gameName: val
            };
        });
    };

    saveEmail = val => {
        this.setState({
            emailAddress: val
        });
    };

    sendTheEmail = () => {
        email = this.state.emailAddress.toLocaleLowerCase();
        validEmail = this.checkEmailAddress(email);
        if (validEmail) {
            let sendData = {
                email: this.state.emailAddress,
                data: {
                    id: this.state.gameId,
                    date: format(new Date(), "yyyy-MM-dd"),
                    name: this.state.gameName,
                    players: this.state.finalStats
                }
            };

            // console.log(API_KEY);

            var formData = new FormData();
            formData.append("name", "Test");
            formData.append("email", "mileschick@gmail.com");
            formData.append("password", "12345678");
            formData.append("password_confirmation", "12345678");
            axios({
                method: "post",
                url: "http://134.209.119.174/api/loginAPI",
                data: formData,
                config: { headers: { "Content-Type": "multipart/form-data" } }
            })
                .then(function(response) {
                    //handle success
                    console.log(response);
                })
                .catch(function(response) {
                    //handle error
                    console.log(response);
                });
            // console.log(sendData);
        } else {
            this.setState({
                showEmailWarning: true
            });
        }
    };

    checkEmailAddress(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    makeGameId = () => {
        id = Math.floor(getTime(new Date()) / 1000);
        id = id + Math.floor(Math.random() * 10000);
        return id;
    };

    render() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabels}>Game: </Text>
                <TextInput
                    style={styles.emailInput}
                    placeholder="Enter A Name For This Game"
                    onChangeText={this.saveGameName}
                />
                <Text style={styles.inputLabels}>Email Address: </Text>
                <TextInput
                    style={styles.emailInput}
                    placeholder="Enter Your Email Address"
                    onChangeText={this.saveEmail}
                />
                <Button
                    style={styles.inputButton}
                    title="Send Game Stats"
                    onPress={this.sendTheEmail}
                />
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
