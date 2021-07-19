/**
 * Created by liuyu on 2017/8/15.
 */
import React, { PureComponent } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import * as statementActions from '../../actions/statementAction'
import ZIPText from '../ZIPText'
import ErrorView from '../ErrorView'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.bgColor,
        flexDirection: 'column',
    },
    contentContainer: {
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8
    },
    itemHeader: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    itemHeaderText: {
        fontFamily: 'Menlo',
        fontSize: 12
    },
    itemInfoContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 3,
    },
    itemInfoTitleContainer: {
        flexDirection: 'column'
    },
    itemInfoTitle: {
        color: Color.titleColor,
        marginTop: 8,
        //fontFamily:'Menlo'
        fontSize: 13,
    },
    itemInfoSubTitleContainer: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 8
    },
    itemInfoSubTitle: {
        marginTop: 8,
        //fontFamily:'Menlo'
        fontSize: 13,
    }
});

class StatementSep extends PureComponent {
    render() {
        return <View style={{ height: 10 }} />
    }
}

class Statement extends PureComponent {

    componentDidMount() {
        this.props.loadStatement();
    }

    _renderItem(item) {
        return (
            <View>
                <View style={styles.itemHeader}>
                    <ZIPText style={styles.itemHeaderText}>
                        {item.createTime}
                    </ZIPText>
                </View>
                <View style={styles.itemInfoContainer}>
                    <View style={styles.itemInfoTitleContainer}>
                        <ZIPText style={[styles.itemInfoTitle, { marginTop: 0 }]}>
                            TYPE:
                        </ZIPText>
                        <ZIPText style={styles.itemInfoTitle}>
                            DESCRIPTION:
                        </ZIPText>
                        <ZIPText style={styles.itemInfoTitle}>
                            AMOUNT:
                        </ZIPText>
                        <ZIPText style={styles.itemInfoTitle}>
                            CHANNEL:
                        </ZIPText>
                        <ZIPText style={styles.itemInfoTitle}>
                            BALANCE:
                        </ZIPText>
                    </View>
                    <View style={styles.itemInfoSubTitleContainer}>
                        <ZIPText
                            numberOfLines={1}
                        >
                            {item.type}
                        </ZIPText>
                        <ZIPText
                            numberOfLines={1}
                            style={styles.itemInfoSubTitle}
                        >
                            {item.desc}
                        </ZIPText>
                        <ZIPText
                            numberOfLines={1}
                            style={styles.itemInfoSubTitle}
                        >
                            {item.amount}
                        </ZIPText>
                        <ZIPText
                            numberOfLines={1}
                            style={styles.itemInfoSubTitle}
                        >
                            {item.channel}
                        </ZIPText>
                        <ZIPText
                            numberOfLines={1}
                            style={styles.itemInfoSubTitle}
                        >
                            ${item.money}
                        </ZIPText>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { loading, list, loadStatement } = this.props;

        if (loading === false && list.length === 0) {
            return <ErrorView
                text="No Data"
                onReloadPress={() => { this.props.loadStatement() }}
                type={'empty'}
            />
        }

        return (
            <FlatList
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                data={list}
                refreshing={loading}
                onRefresh={() => loadStatement()}
                ItemSeparatorComponent={StatementSep}
                renderItem={(item) => this._renderItem(item.item)}
                keyExtractor={(item, index) => index}
            />
        )
    }
}

export default connect(
    (state) => ({
        loading: state.statement.loading,
        list: state.statement.list,
        loadError: state.statement.loadError,
        error: state.statement.error,
    }),
    (dispatch) => ({
        loadStatement: () => dispatch(statementActions.loadStatement())
    })
)(Statement)