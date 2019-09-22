/**
 * Created by liuyu on 2017/10/9.
 */
import React, { PureComponent } from 'react'
import {
    Text,
    Platform
} from 'react-native'


export default class ZIPText extends PureComponent {
    render() {
        if (Platform.OS === 'android') {
            if (this.props.style !== undefined) {
                if (this.props.style.fontWeight !== undefined) {
                    return (
                        <Text
                            {...this.props}
                            style={[{fontFamily:'Avenir-Medium'}, this.props.style,{fontWeight:'normal'}]}
                        />
                    )
                }
            }
        }
        return (
            <Text
                {...this.props}
                style={[{fontFamily:FontFamily}, this.props.style,]}
            />
        )
    }
}

// const ZIPText = (props) => {
//     if (Platform.OS === 'android') {
//         if (props.style !== undefined) {
//             if (props.style.fontWeight !== undefined) {
//                 return (
//                     <Text
//                         {...props}
//                         style={[{fontFamily:'Avenir-Medium'}, props.style,{fontWeight:'normal'}]}
//                     />
//                 )
//             }
//         }
//     }
//     return (
//         <Text
//             {...props}
//             style={[{fontFamily:FontFamily}, props.style,]}
//         />
//     )
// };

ZIPText.propTypes = Text.propTypes;
