/**
 * Created by liuyu on 2017/5/26.
 */
const Colors = {
    themeColor:'#2abb67',
    assistColor:'#37bb2a',
    assistBgColor:'#19395a',
    assistTextColor:'#333333',
    bgColor:'#eeeeee',
    tipsColor:'#a3a3a3',
    titleColor:'#666666',
    tabBarTextColor:'#ffffff',
    tabBarSelectColor:'#cbe771',
    blue:'#c8e5ae',
    lightBlue:'#a4e8f1',
    loginBg:'#20AC84',
    orange:'#F85625',
    darkgreen:'#1c5f4f',
    lightgreen:'#90cdbe',
    red:'#f25837',
    graygreen:'#c8e5ae',
    grayText:'#73772f',
    pink:'#e7b6af',
    yellow:'#FCEE22',
};

global.Color = Colors;

navigatorStyle = {
    navBarBackgroundColor: Color.themeColor,
    navBarTextColor: 'white',
    navBarButtonColor: 'white',
    navBarTitleTextCentered:true,
    statusBarColor:Color.themeColor,
    navBarNoBorder:true,
    navBarTextFontFamily:'Avenir',
};

global.navigatorStyle = navigatorStyle;