/**
 * Created by liuyu on 2017/11/6.
 */
import React, { PureComponent } from 'react'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import DeliverTransaction from './DeliveryTransaction'
import PickUpTransaction from './PickUpTransaction'



export default class Transaction extends PureComponent {
    render() {
        return (
            <ScrollableTabView
                renderTabBar={()=>(
                    <DefaultTabBar style={{borderWidth:0, backgroundColor:'white'}}/>
                )}
                style={{backgroundColor:Color.bgColor}}
                tabBarActiveTextColor={Color.themeColor}
                tabBarInactiveTextColor={Color.titleColor}
                tabBarUnderlineStyle={{
                    backgroundColor:Color.themeColor
                }}
                tabBarTextStyle={{
                    fontFamily:FontFamily,
                    fontSize:16,
                }}
            >
                <DeliverTransaction tabLabel="My delivery"/>
                <PickUpTransaction tabLabel="My pick up"/>
            </ScrollableTabView>
        )
    }
}


