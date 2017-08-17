// @flow
import React from 'react'
import {Card, CardHeader, CardContent} from 'material-ui'
import {Radio, RadioGroup} from 'material-ui'
import {FormLabel, FormControl, FormControlLabel} from 'material-ui'
import {Table, TableBody, TableCell, TableHead, TableRow} from 'material-ui'
import {Paper} from 'material-ui'
import {connect} from 'react-redux'
import {getTrieSelection} from '../reducers/trieSelection'
import type {Dispatch, State} from "../types/types"
import type {TrieSelection} from "../reducers/trieSelection"
import type {KeysAndValues, TableView} from "../reducers/keysAndValues"
import {getKeysAndValues} from "../reducers/keysAndValues"
import {setTableView} from "../actions/keysAndValues"
import {hashToBin256} from "../actions/utils"

class KeysAndValuesContainer extends React.Component {

    props: {
        trieSelection: TrieSelection,
        keysAndValues: KeysAndValues,
        setTableView: (view: TableView) => void,
        dispatch: Dispatch
    };

    render() {
        const keysToHashes = this.props.keysAndValues.trieMap.keysToHashes;
        const keysToValues = this.props.keysAndValues.trieMap.keysToValues;
        const tableView = this.props.keysAndValues.tableView;
        const data = [];
        for (let elem of keysToHashes) {
            const key = elem[0];
            let keyHash = elem[1];
            if (tableView === 'bin') {
                keyHash = hashToBin256(keyHash);
            }
            const value = keysToValues.get(key);
            data.push({key, keyHash, value});
        }
        return (
            <Card>
                <CardHeader
                    title="Keys and values"
                />
                <CardContent>
                    <FormControl>
                        <FormLabel component="legend">Hash Format</FormLabel>
                        <RadioGroup
                            row
                            name="table_view"
                            selectedValue={this.props.keysAndValues.tableView}
                            onChange={this.handleRadioChange}
                        >
                            <FormControlLabel value="bin" control={<Radio/>} label="Bin"/>
                            <FormControlLabel value="hex" control={<Radio/>} label="Hex"/>
                        </RadioGroup>
                    </FormControl>
                    <Paper elevation={4}>
                        <Table bodyStyle={{overflowX: 'scroll'}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Key</TableCell>
                                    <TableCell>Value</TableCell>
                                    <TableCell>Key Hash</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map(e => {
                                    return (
                                        <TableRow key={e.key}>
                                            <TableCell>
                                                {e.key}
                                            </TableCell>
                                            <TableCell>
                                                {e.value}
                                            </TableCell>
                                            <TableCell>
                                                {e.keyHash}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </CardContent>
            </Card>
        );
    }

    handleRadioChange = (event: Event, value: TableView): void => {
        this.props.setTableView(value);
    };

}

const mapStateToProps = (state: State): {
    trieSelection: TrieSelection,
    keysAndValues: KeysAndValues
} => ({
    trieSelection: getTrieSelection(state),
    keysAndValues: getKeysAndValues(state)
});

const mapDispatchToProps = (dispatch: Dispatch): {
    setTableView: (view: TableView) => void
} => {
    return {
        setTableView: (view: TableView) => {
            dispatch(setTableView(view));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KeysAndValuesContainer)