import React, { Component } from "react";
import { Modal, Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import PlayerBox from "./Players/PlayerBox";
import ClockInButton from "./Buttons/ClockInButton";
import ShotButtonContainer from "./Buttons/ShotButtonContainer";
import StatsService from "../../services/StatsService";
import ClockService from "../../services/ClockService";
import ReboundButtonContainer from "./Buttons/ReboundButtonContainer";
import FreeThrowButtonContainer from "./Buttons/FreeThrowButtonContainer";
import AssistButtonContainer from "./Buttons/AssistButtonContainer";
import FoulButtonContainer from "./Buttons/FoulButtonContainer";
import StyleObject from "../../assets/styles/style";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";

// TODO option to clock in players at game start?
// TODO make final report view
// TODO email final report

class GameContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activePlayers: props.gamePlayers,
            oldActivePlayers: null,
            haveUndo: false,
            gameTime: 0,
            gameMin: "0:00",
            gameActive: true,
            timerString: "Pause Game Time",
            activePlayerKey: null,
            activePlayerName: "",
            clockInWarning: false
        };
    }

    componentDidMount() {
        let timer = setInterval(this.timeTick, 1000);
    }

    timeTick = () => {
        let NewTimeData = ClockService.tick(
            this.state.gameActive,
            this.props.gameInProgress,
            this.state.activePlayers,
            this.state.gameTime
        );
        if (NewTimeData.activePlayers) {
            this.setState({
                activePlayers: NewTimeData.activePlayers,
                gameTime: NewTimeData.gameTime,
                gameMin: NewTimeData.gameMin,
                test: "Tacos!"
            });
        }
    };

    componentWillReceiveProps(props) {
        this.setActivePlayer(props.firstActivePlayerKey, props.firstActivePlayerName);

        let activePlayersImmutable = {};
        Object.keys(props.gamePlayers).map(key => {
            let stats = { ...props.gamePlayers[key] };
            activePlayersImmutable[key] = stats;
        });

        this.setState(prevState => {
            return {
                oldActivePlayers: activePlayersImmutable
            };
        });
    }

    setActivePlayer = (thisPlayerKey, thisPlayerName) => {
        this.setState({
            activePlayerKey: thisPlayerKey,
            activePlayerName: thisPlayerName
        });

        Object.keys(this.state.activePlayers).map(key => {
            if (key == thisPlayerKey) {
                this.state.activePlayers[key].active = true;
            } else {
                this.state.activePlayers[key].active = false;
            }
        });
    };

    toggleClockIn = () => {
        this.state.activePlayers[this.state.activePlayerKey].clockedIn = !this.state
            .activePlayers[this.state.activePlayerKey].clockedIn;
    };

    toggleTimer = () => {
        let buttonText = this.state.gameActive ? "UnPause Game Time" : "Pause Game Time";
        this.setState(prevState => {
            return {
                gameActive: !prevState.gameActive,
                timerString: buttonText
            };
        });
    };

    addToOldActivePlayers = activePlayers => {
        let activePlayersImmutable = {};
        Object.keys(activePlayers).map(key => {
            let stats = { ...activePlayers[key] };
            activePlayersImmutable[key] = stats;
        });
        newOldActivePlayers = this.state.oldActivePlayers;
        this.setState(prevState => {
            return {
                oldActivePlayers: activePlayersImmutable,
                haveUndo: true
            };
        });
    };

    clockInTest = () => {
        if (this.state.activePlayers[this.state.activePlayerKey].clockedIn == false) {
            this.setState(prevState => {
                return {
                    clockInWarning: true
                };
            });
        }
        setTimeout(() => {
            this.setState(prevState => {
                return {
                    clockInWarning: false
                };
            });
        }, 1200);
    };

    updateStats = action => {
        if (this.state.activePlayers[this.state.activePlayerKey] != undefined) {
            nowStateActive = { ...this.state.activePlayers };
            this.addToOldActivePlayers(nowStateActive);
            this.clockInTest();
            newPlayers = StatsService.updateStat(
                this.state.activePlayers,
                this.state.activePlayerKey,
                action
            );
            this.setState({
                activePlayers: newPlayers
            });
        }
    };

    clearGameTimer = () => {
        let clearedPlayers = { ...this.state.activePlayers };
        Object.keys(this.state.activePlayers).map(key => {
            clearedPlayers = StatsService.resetPlayerStats(
                clearedPlayers,
                key,
                clearedPlayers[key].name
            );
        });

        this.setState({
            activePlayers: clearedPlayers,
            gameTime: 0,
            gameMin: 0,
            gameActive: true,
            timerString: "Pause Game Time"
        });
    };

    resetPlayerStats = () => {
        newPlayers = StatsService.resetPlayerStats(
            this.state.activePlayers,
            this.state.activePlayerKey,
            this.state.activePlayerName
        );
        this.setState({
            activePlayers: newPlayers
        });
    };

    undoButtonHandler = () => {
        newPlayers = StatsService.undoButtonHandler(
            this.state.activePlayers,
            this.state.oldActivePlayers
        );
        this.setState({
            activePlayers: newPlayers,
            haveUndo: false
        });
    };

    render() {
        let clockInStatus = false;
        let shootingPercent = 0;
        let threePointPercent = 0;
        let freeThrowPercent = 0;
        let freeThrowMiss = 0;

        if (this.state.activePlayers[this.state.activePlayerKey] != undefined) {
            clockInStatus = this.state.activePlayers[this.state.activePlayerKey].clockedIn;
            shootingPercent = StatsService.shootingPercent(
                this.state.activePlayers[this.state.activePlayerKey].shotsMade,
                this.state.activePlayers[this.state.activePlayerKey].shotAttempts
            );
            threePointPercent = StatsService.shootingPercent(
                this.state.activePlayers[this.state.activePlayerKey].threePointMade,
                this.state.activePlayers[this.state.activePlayerKey].threePointAttempts
            );

            freeThrowPercent = StatsService.shootingPercent(
                this.state.activePlayers[this.state.activePlayerKey].freeThrowMade,
                this.state.activePlayers[this.state.activePlayerKey].freeThrowAttempts
            );

            freeThrowMiss =
                this.state.activePlayers[this.state.activePlayerKey].freeThrowAttempts -
                this.state.activePlayers[this.state.activePlayerKey].freeThrowMade;
        }

        {
            this.state.gameActive ? null : (
                <View style={styles.overlay} pointerEvents="none" />
            );
        }

        activeWarning = this.state.clockInWarning ? (
            <View style={styles.warningBox}>
                <Text style={styles.warningText}>Clock In Player?</Text>
            </View>
        ) : null;

        let undoButton = null;

        if (this.state.haveUndo) {
            undoButton = (
                <TouchableOpacity
                    style={styles.resetButtons}
                    onPress={this.undoButtonHandler}
                >
                    <View>
                        <Text style={styles.resetText}>undo</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <Modal visible={this.props.gameInProgress} animationType="slide">
                <View style={styles.gameView}>
                    <PlayerBox
                        gamePlayers={this.state.activePlayers}
                        makeActivePlayer={this.setActivePlayer}
                        clockInPlayer={this.clockInPlayer}
                    />
                    <View
                        style={this.state.gameActive ? styles.buttonBox : styles.overlay}
                        pointerEvents={this.state.gameActive ? "auto" : "none"}
                    >
                        <ClockInButton
                            toggleClockIn={this.toggleClockIn}
                            activeClockedIn={clockInStatus}
                        />
                        <ShotButtonContainer
                            shotMadeTwo={() => this.updateStats("shotMadeTwo")}
                            shotMadeThree={() => this.updateStats("shotMadeThree")}
                            shotMissTwo={() => this.updateStats("shotMissTwo")}
                            shotMissThree={() => this.updateStats("shotMissThree")}
                        />
                        <ReboundButtonContainer
                            defensiveRebound={() => this.updateStats("defensiveRebound")}
                            offensiveRebound={() => this.updateStats("offensiveRebound")}
                        />
                        <FreeThrowButtonContainer
                            freeThrowMade={() => this.updateStats("freeThrowMade")}
                            freeThrowMiss={() => this.updateStats("freeThrowMiss")}
                        />
                        <AssistButtonContainer
                            assist={() => this.updateStats("assist")}
                            block={() => this.updateStats("block")}
                        />
                        <FoulButtonContainer
                            fouls={() => this.updateStats("fouls")}
                            technicals={() => this.updateStats("technicals")}
                            turnOvers={() => this.updateStats("turnOvers")}
                        />
                        <View style={styles.resetBox}>
                            <TouchableOpacity
                                style={styles.resetButtons}
                                onPress={this.resetPlayerStats}
                            >
                                <View>
                                    <Text style={styles.resetText}>reset player stats</Text>
                                </View>
                            </TouchableOpacity>
                            {undoButton}
                        </View>
                    </View>
                    <View style={styles.gameStats}>
                        {this.state.activePlayerKey != null ? (
                            <View>
                                <Text style={{ color: "green", fontSize: 14 }}>
                                    &bull;&nbsp;Game Clock:&nbsp;
                                    {this.state.gameMin + `\n`}
                                    &bull;&nbsp;Player Min:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .timePlayedMin + `\n`}
                                    &bull;&nbsp;Points:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .points + `\n`}
                                    &bull;&nbsp;Shot Att:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .shotAttempts + ` `}
                                    &nbsp;Made:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .shotsMade + ` `}
                                    &nbsp;&nbsp;
                                    {shootingPercent + `%\n`}
                                    &bull;&nbsp;3pt Att:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .threePointAttempts + ` `}
                                    &nbsp;Made:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .threePointMade + ` `}
                                    &nbsp;&nbsp;
                                    {threePointPercent + `% \n`}
                                    &bull;&nbsp;Rebounds:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .rebounds + ` `}
                                    &nbsp;Def:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .defRebounds + ` `}
                                    &nbsp;Off:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .offRebounds + `\n`}
                                    &bull;&nbsp;Free Throw Made:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .freeThrowMade + ` `}
                                    &nbsp;Missed:&nbsp;
                                    {freeThrowMiss + ` `}
                                    &nbsp;&nbsp;
                                    {freeThrowPercent + `% \n`}
                                    &bull;&nbsp;Assists:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .assists + `\n`}
                                    &bull;&nbsp;Blocks:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .blocks + `\n`}
                                    &bull;&nbsp;Fouls:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .foulsCommitted + ` `}
                                    &nbsp;&nbsp;&bull;&nbsp;Techs:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .technicals + ` `}
                                    &nbsp;&nbsp;&bull;&nbsp;TurnOvers:&nbsp;
                                    {this.state.activePlayers[this.state.activePlayerKey]
                                        .turnOvers + ` `}
                                </Text>
                            </View>
                        ) : null}
                        {activeWarning}
                    </View>
                    <View style={styles.endGame}>
                        <Button
                            style={styles.baseButton}
                            title={
                                this.state.gameActive
                                    ? "Pause Game Time"
                                    : "UnPause Game Time"
                            }
                            color="orange"
                            onPress={this.toggleTimer}
                        />
                        <Button
                            style={styles.baseButton}
                            title="End Game"
                            color="red"
                            onPress={() => {
                                this.props.gameEnd(
                                    this.state.gameMin,
                                    this.state.activePlayers
                                );
                            }}
                        />
                    </View>
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
        backgroundColor: "black",
        color: "green",
        marginTop: 0,
        marginBottom: 0,
        height: hp("100%"),
        paddingTop: 27,
        paddingBottom: 10
    },
    buttonBox: {
        flexDirection: "column",
        alignItems: "flex-start",
        height: hp("47%"),
        borderTopColor: "green",
        borderTopWidth: 0.5
    },
    overlay: {
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        height: hp("47%"),
        borderTopColor: "green",
        borderTopWidth: 0.5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        opacity: 0.4
    },
    endGame: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        position: "absolute",
        height: hp("6%"),
        bottom: 10,
        padding: 5,
        width: "100%",
        borderTopColor: "green",
        borderTopWidth: 0.5
    },
    baseButton: {
        padding: 10
    },
    gameStats: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "stretch",
        position: "absolute",
        height: hp("29%"),
        bottom: 30,
        padding: 7,
        borderTopColor: "green",
        borderTopWidth: 0.5
    },
    activePlayerName: {
        color: "green",
        height: hp("2%"),
        fontSize: 11,
        fontWeight: "bold",
        padding: 1
    },
    resetBox: {
        width: "100%",
        marginTop: 0,
        flexDirection: "row",
        height: hp("4%"),
        padding: 2,
        alignItems: "flex-start"
    },
    resetButtons: {
        backgroundColor: "#212121",
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "48%"
    },
    resetText: {
        color: "#ddd",
        padding: 4,
        fontSize: 10
    },
    warningText: {
        color: "#00b3ff",
        fontWeight: "bold",
        fontSize: 14
    },
    warningBox: {
        position: "absolute",
        right: 5,
        top: 5
    }
});

export default GameContainer;
