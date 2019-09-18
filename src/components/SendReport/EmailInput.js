import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { format, getTime } from "date-fns";
import axios from "axios";
import { URL_ONE, URL_TWO, NAME, EMAIL, PW } from "../../../info";

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
            this.callAPI("gameEmail");
        } else {
            this.setState({
                showEmailWarning: true
            });
        }
    };

    async callAPI(type) {
        var formData = new FormData();
        formData.append("name", NAME);
        formData.append("email", EMAIL);
        formData.append("password", PW);
        formData.append("password_confirmation", PW);

        const hash = await axios({
            method: "post",
            url: URL_ONE,
            data: formData,
            config: { headers: { "Content-Type": "multipart/form-data" } }
        })
            .then(function(response) {
                return response.data.access_token;
            })
            .catch(function(error) {
                console.log(error);
                return error;
            });

        switch (type) {
            case "gameEmail":
                this.sendGame(hash);
                break;

            default:
                break;
        }
    }

    async sendGame(key) {
        let sendData = {
            data: {
                email: this.state.emailAddress,
                game: {
                    id: this.state.gameId,
                    date: format(new Date(), "yyyy-MM-dd"),
                    name: this.state.gameName,
                    players: this.state.finalStats
                }
            }
        };

        var bearer = "Bearer " + key;

        let didItWork = await fetch(URL_TWO, {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: bearer,
                mode: "no-cors",
                cache: "no-cache",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendData)
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                return data;
            })
            .catch(error => {
                console.log(error);
            });

        console.log(didItWork);
    }

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
                    value="test game"
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
