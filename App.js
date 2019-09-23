import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import PlayerInput from "./src/components/PlayerInput/PlayerInput";
import PlayerList from "./src/components/PlayerList/PlayerList";
import StartButton from "./src/components/Game/StartButton";
// import courtImage from "./src/assets/court2.jpg";
import StatsContainer from "./src/components/Stats/StatsContainer";
import GameContainer from "./src/components/Game/GameContainer";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            inputMessage: "Enter Player Name",
            playersObj: {},
            initialPlayerObj: {},
            playerLimit: 3,
            disableButton: true,
            gameInProgress: false,
            showFinalStats: false,
            gameTime: 0,
            endGameStats: "",
            firstActivePlayerName: "",
            firstActivePlayerKey: null
        };
    }

    playerAddedHandler = playerName => {
        const activatePlayer = Object.keys(this.state.playersObj).length > 0 ? false : true;

        const playerKey = new Date().getTime();

        if (activatePlayer == true) {
            this.setState({
                firstActivePlayerKey: playerKey,
                firstActivePlayerName: playerName
            });
        }

        thisPlayer = {
            key: playerKey,
            name: playerName,
            active: activatePlayer,
            clockedIn: false,
            timePlayedSec: 0,
            timePlayedMin: "0:00",
            points: 0,
            shotAttempts: 0,
            shotsMade: 0,
            shootingPercentage: 0,
            twoPointAttempts: 0,
            twoPointMade: 0,
            threePointAttempts: 0,
            threePointMade: 0,
            threePointPercentage: 0,
            rebounds: 0,
            offRebounds: 0,
            defRebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnOvers: 0,
            foulsCommitted: 0,
            technicals: 0,
            freeThrowAttempts: 0,
            freeThrowMade: 0,
            freeThrowPercentage: 0,
            pointsPerMin: 0,
            shotsPerMin: 0,
            reboundsPerMin: 0,
            assistsPerMin: 0,
            blocksPerMin: 0,
            turnOversPerMin: 0,
            foulsPerMin: 0
        };

        this.setState(prevState => {
            return {
                playerObj: (prevState.playersObj[thisPlayer.key] = thisPlayer),
                disableButton: false
            };
        });
    };

    playerDeletedHandler = key => {
        buttonOff = Object.keys(this.state.playersObj).length > 1 ? false : true;
        this.setState(prevState => {
            delete prevState.playersObj[key];
            return {
                players: prevState.playersObj,
                inputMessage: "Enter Player Name",
                disableButton: buttonOff
            };
        });
    };

    startTheGameHandler = index => {
        // console.log(this.state.endGameStats);
        this.setState(prevState => {
            return {
                endGameStats: {},
                gameInProgress: true
            };
        });
    };

    gameEndHandler = (endGameTime, endGameStats) => {
        this.setState(prevState => {
            return {
                disableButton: true,
                playersObj: {},
                gameInProgress: false,
                endGameStats: endGameStats,
                gameTime: endGameTime
            };
        });
    };

    showFinalStats = () => {
        this.setState({
            showFinalStats: true
        });
    };

    hideFinalStats = () => {
        this.setState({
            showFinalStats: false
        });
    };

    render() {
        let finalStatsButton =
            this.state.endGameStats != "" ? (
                <View>
                    <Button
                        style={styles.baseButton}
                        title="Show Game Stats"
                        color="blue"
                        onPress={() => {
                            this.showFinalStats();
                        }}
                    />
                </View>
            ) : null;

        let endGameView = null;
        if (this.state.showFinalStats == true) {
            endGameView = (
                <StatsContainer
                    showFinalStats={this.state.showFinalStats}
                    hideFinalStats={this.hideFinalStats}
                    finalStats={this.state.endGameStats}
                    gameTime={this.state.gameTime}
                />
            );
        }

        return (
            <View style={styles.container}>
                {Object.keys(this.state.playersObj).length > 0 ? (
                    <GameContainer
                        gamePlayers={this.state.playersObj}
                        initialPlayers={this.state.initialPlayerObj}
                        gameInProgress={this.state.gameInProgress}
                        gameEnd={this.gameEndHandler}
                        firstActivePlayerKey={this.state.firstActivePlayerKey}
                        firstActivePlayerName={this.state.firstActivePlayerName}
                    />
                ) : null}

                {endGameView}

                <StartButton
                    startTheGame={this.startTheGameHandler}
                    allowGame={this.state.disableButton}
                />
                <Text style={styles.welcome}>HoopTrack</Text>
                <PlayerInput
                    onPlayerAdded={this.playerAddedHandler}
                    maxPlayers={this.state.playerLimit}
                    playerCount={Object.keys(this.state.playersObj).length}
                />
                <PlayerList
                    players={this.state.players}
                    playerObj={this.state.playersObj}
                    onItemDeleted={this.playerDeletedHandler}
                />
                {finalStatsButton}
                <Text>Total Game Time: {this.state.gameTime}</Text>
                {/* <Image source={courtImage} style={styles.courtPic} imageStyle={{ opacity: 0.3 }} resizeMode="contain" /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 50,
        paddingBottom: 30
    },
    welcome: {
        fontSize: 60,
        color: "#cc5500",
        fontWeight: "bold",
        textAlign: "center",
        margin: 10
    },
    courtPic: {
        height: 500,
        width: 300,
        zIndex: -5,
        transform: [{ rotate: "90deg" }]
    }
});
