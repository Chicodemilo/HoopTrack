import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CheckBox } from "react-native-elements";

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onItemPressed}>
                <View style={styles.listItem}>
                    <Text>{this.props.playerName}</Text>
                    <CheckBox
                        center
                        title="Click Here"
                        checkedIcon="dot-circle-o"
                        checked={this.state.checked}
                        onPress={() => this.setState({ checked: !this.state.checked })}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginBottom: 5,
        padding: 10,
        backgroundColor: "#eee"
    }
});

export default ListItem;
