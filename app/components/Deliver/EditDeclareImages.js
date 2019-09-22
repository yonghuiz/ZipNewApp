/**
 * Created by liuyu on 2017/11/13.
 */
import React,{ PureComponent } from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableHighlight,
    StatusBar,
} from 'react-native'
import ZIPText from '../ZIPText'
import Icon from 'react-native-vector-icons/Ionicons'
import { openCamera, openPhotos } from '../ImagePicker'

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column'
    },
    imageContainer: {
        flexDirection:'row',
        flexWrap:'wrap',
        padding:16,
        paddingTop:0,
    },

});

export default class EditDeclareImages extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            images:props.images,
            barStyle:'light-content'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={this.state.barStyle} animated={true}/>
                <ScrollView
                    style={{flex:1}}
                    contentContainerStyle={styles.imageContainer}
                >
                    {
                        this.state.images.map((data,index)=>{
                            return (
                                <ImageBackground
                                    key={index}
                                    style={{
                                        width:(screenSize.width - 52) / 3,
                                        height:(screenSize.width - 52) / 4,
                                        marginTop: 10,
                                        marginLeft: (index) % 3 !== 0 ? 10 : 0,
                                    }}
                                    source={{uri:data}}
                                >
                                    <TouchableHighlight
                                        underlayColor={'transparent'}
                                        onPress={()=>{
                                            //删除照片
                                            let images = [...this.state.images];
                                            images.splice(index,1);
                                            this.setState({
                                                images,
                                            })
                                        }}
                                    >
                                        <Icon
                                            name="ios-close-circle-outline"
                                            color="white"
                                            size={30}
                                            style={{
                                                position: 'absolute',
                                                top: 2,
                                                right: 2,
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                    </TouchableHighlight>
                                </ImageBackground>
                            )
                        })
                    }
                    <TouchableOpacity
                        style={{
                            width: (screenSize.width - 52) / 3,
                            height: (screenSize.width - 52) / 4,
                            marginTop: 10,
                            marginLeft: (this.state.images.length) % 3 !== 0 ? 10 : 0,
                            backgroundColor: Color.bgColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        activeOpacity={1}
                        onPress={()=>{
                            //添加照片
                            this.props.navigator.showModal({
                                screen: 'ActionSheetScreen',
                                navigatorStyle: {
                                    navBarHidden: true,
                                    statusBarColor: Color.themeColor
                                },
                                animationType: 'none',
                                passProps: {
                                    onActionClick: (index) => {
                                        if (index === 0) {
                                            this.timeout = setTimeout(() => {
                                                clearTimeout(this.timeout);
                                                this.setState({
                                                    barStyle: 'default',
                                                });
                                                openCamera()
                                                    .then(image=>{
                                                        let images = this.state.images.push(image);
                                                        this.setState({
                                                            barStyle:'light-content',
                                                            images,
                                                        })
                                                    })
                                                    .catch(err=>{
                                                        this.setState({
                                                            barStyle:'light-content',
                                                        })
                                                    })
                                            }, 500);
                                        } else {
                                            this.timeout = setTimeout(() => {
                                                clearTimeout(this.timeout);
                                                this.setState({
                                                    barStyle: 'default',
                                                });
                                                openPhotos(true)
                                                    .then(images=>{
                                                        let imgs = [...this.state.images, ... images];
                                                        this.setState({
                                                            barStyle:'light-content',
                                                            images:imgs,
                                                        });
                                                    })
                                                    .catch(err=>{
                                                        this.setState({
                                                            barStyle:'light-content'
                                                        })
                                                    });
                                            }, 500);

                                        }
                                    },
                                    actionTitles: ['Take photo from camera', 'Select from photo']
                                }
                            });
                        }}
                    >
                        <Icon name="ios-add-circle" color="white" size={30}/>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity
                    style={{
                        height:50,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:Color.themeColor,
                    }}
                    activeOpacity={1}
                    onPress={()=>{
                        this.props.setImages(this.state.images);
                    }}
                >
                    <ZIPText style={{color:'white', fontSize:18}}>
                        Done
                    </ZIPText>
                </TouchableOpacity>
            </View>
        )
    }
}