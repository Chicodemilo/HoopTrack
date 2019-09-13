import React, { Component } from "react";
import { Modal, Text, View, Button, StyleSheet, ScrollView, FlatList } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import EmailInput from "./EmailInput";

class SendReportContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSendReport: props.showSendReport,
            hideReportView: props.hideReportView,
            finalStats: props.finalStats
        };
    }

    render() {
        return (
            <Modal visible={this.props.showSendReport}>
                <View style={styles.reportButtons}>
                    <Button
                        title="Cancel"
                        color="red"
                        onPress={() => {
                            this.state.hideReportView();
                        }}
                    />
                </View>
                <EmailInput finalStats={this.state.finalStats} />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    reportButtons: {
        marginTop: 50,
        borderBottomColor: "black",
        borderBottomWidth: 1
    }
});

export default SendReportContainer;
