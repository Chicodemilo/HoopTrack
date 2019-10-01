import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-elements";

const listItem = props => (
    <TouchableOpacity onPress={props.onItemPressed}>
        <View style={styles.listItem}>
            <Text>{props.playerName}</Text>
            <CheckBox
                center
                title="Click Here"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={this.state.checked}
            />
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginBottom: 5,
        padding: 10,
        backgroundColor: "#eee"
    }
});

export default listItem;
