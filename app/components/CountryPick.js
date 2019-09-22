/**
 * Created by liuyu on 2017/11/27.
 */
import React, { PureComponent } from 'react'
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native'

const countryData = [
    {
        "Countries and Regions": "Angola",
        "chinese": "安哥拉",
        "country": "AO",
        "code": "244"
    },
    {
        "Countries and Regions": "Afghanistan",
        "chinese": "阿富汗",
        "country": "AF",
        "code": "93"
    },
    {
        "Countries and Regions": "Albania",
        "chinese": "阿尔巴尼亚",
        "country": "AL",
        "code": "355"
    },
    {
        "Countries and Regions": "Algeria",
        "chinese": "阿尔及利亚",
        "country": "DZ",
        "code": "213"
    },
    {
        "Countries and Regions": "Andorra",
        "chinese": "安道尔共和国",
        "country": "AD",
        "code": "376"
    },
    {
        "Countries and Regions": "Anguilla",
        "chinese": "安圭拉岛",
        "country": "AI",
        "code": "1264"
    },
    {
        "Countries and Regions": "Antigua and Barbuda",
        "chinese": "安提瓜和巴布达",
        "country": "AG",
        "code": "1268"
    },
    {
        "Countries and Regions": "Argentina",
        "chinese": "阿根廷",
        "country": "AR",
        "code": "54"
    },
    {
        "Countries and Regions": "Armenia",
        "chinese": "亚美尼亚",
        "country": "AM",
        "code": "374"
    },
    {
        "Countries and Regions": "Ascension",
        "chinese": "阿森松",
        "country": " ",
        "code": "247"
    },
    {
        "Countries and Regions": "Australia",
        "chinese": "澳大利亚",
        "country": "AU",
        "code": "61"
    },
    {
        "Countries and Regions": "Austria",
        "chinese": "奥地利",
        "country": "AT",
        "code": "43"
    },
    {
        "Countries and Regions": "Azerbaijan",
        "chinese": "阿塞拜疆",
        "country": "AZ",
        "code": "994"
    },
    {
        "Countries and Regions": "Bahamas",
        "chinese": "巴哈马",
        "country": "BS",
        "code": "1242"
    },
    {
        "Countries and Regions": "Bahrain",
        "chinese": "巴林",
        "country": "BH",
        "code": "973"
    },
    {
        "Countries and Regions": "Bangladesh",
        "chinese": "孟加拉国",
        "country": "BD",
        "code": "880"
    },
    {
        "Countries and Regions": "Barbados",
        "chinese": "巴巴多斯",
        "country": "BB",
        "code": "1246"
    },
    {
        "Countries and Regions": "Belarus",
        "chinese": "白俄罗斯",
        "country": "BY",
        "code": "375"
    },
    {
        "Countries and Regions": "Belgium",
        "chinese": "比利时",
        "country": "BE",
        "code": "32"
    },
    {
        "Countries and Regions": "Belize",
        "chinese": "伯利兹",
        "country": "BZ",
        "code": "501"
    },
    {
        "Countries and Regions": "Benin",
        "chinese": "贝宁",
        "country": "BJ",
        "code": "229"
    },
    {
        "Countries and Regions": "Bermuda Is.",
        "chinese": "百慕大群岛",
        "country": "BM",
        "code": "1441"
    },
    {
        "Countries and Regions": "Bolivia",
        "chinese": "玻利维亚",
        "country": "BO",
        "code": "591"
    },
    {
        "Countries and Regions": "Botswana",
        "chinese": "博茨瓦纳",
        "country": "BW",
        "code": "267"
    },
    {
        "Countries and Regions": "Brazil",
        "chinese": "巴西",
        "country": "BR",
        "code": "55"
    },
    {
        "Countries and Regions": "Brunei",
        "chinese": "文莱",
        "country": "BN",
        "code": "673"
    },
    {
        "Countries and Regions": "Bulgaria",
        "chinese": "保加利亚",
        "country": "BG",
        "code": "359"
    },
    {
        "Countries and Regions": "Burkina-faso",
        "chinese": "布基纳法索",
        "country": "BF",
        "code": "226"
    },
    {
        "Countries and Regions": "Burma",
        "chinese": "缅甸",
        "country": "MM",
        "code": "95"
    },
    {
        "Countries and Regions": "Burundi",
        "chinese": "布隆迪",
        "country": "BI",
        "code": "257"
    },
    {
        "Countries and Regions": "Cameroon",
        "chinese": "喀麦隆",
        "country": "CM",
        "code": "237"
    },
    {
        "Countries and Regions": "Canada",
        "chinese": "加拿大",
        "country": "CA",
        "code": "1"
    },
    {
        "Countries and Regions": "Cayman Is.",
        "chinese": "开曼群岛",
        "country": " ",
        "code": "1345"
    },
    {
        "Countries and Regions": "Central African Republic",
        "chinese": "中非共和国",
        "country": "CF",
        "code": "236"
    },
    {
        "Countries and Regions": "Chad",
        "chinese": "乍得",
        "country": "TD",
        "code": "235"
    },
    {
        "Countries and Regions": "Chile",
        "chinese": "智利",
        "country": "CL",
        "code": "56"
    },
    {
        "Countries and Regions": "China",
        "chinese": "中国",
        "country": "CN",
        "code": "86"
    },
    {
        "Countries and Regions": "Colombia",
        "chinese": "哥伦比亚",
        "country": "CO",
        "code": "57"
    },
    {
        "Countries and Regions": "Congo",
        "chinese": "刚果",
        "country": "CG",
        "code": "242"
    },
    {
        "Countries and Regions": "Cook Is.",
        "chinese": "库克群岛",
        "country": "CK",
        "code": "682"
    },
    {
        "Countries and Regions": "Costa Rica",
        "chinese": "哥斯达黎加",
        "country": "CR",
        "code": "506"
    },
    {
        "Countries and Regions": "Cuba",
        "chinese": "古巴",
        "country": "CU",
        "code": "53"
    },
    {
        "Countries and Regions": "Cyprus",
        "chinese": "塞浦路斯",
        "country": "CY",
        "code": "357"
    },
    {
        "Countries and Regions": "Czech Republic",
        "chinese": "捷克",
        "country": "CZ",
        "code": "420"
    },
    {
        "Countries and Regions": "Denmark",
        "chinese": "丹麦",
        "country": "DK",
        "code": "45"
    },
    {
        "Countries and Regions": "Djibouti",
        "chinese": "吉布提",
        "country": "DJ",
        "code": "253"
    },
    {
        "Countries and Regions": "Dominica Rep.",
        "chinese": "多米尼加共和国",
        "country": "DO",
        "code": "1890"
    },
    {
        "Countries and Regions": "Ecuador",
        "chinese": "厄瓜多尔",
        "country": "EC",
        "code": "593"
    },
    {
        "Countries and Regions": "Egypt",
        "chinese": "埃及",
        "country": "EG",
        "code": "20"
    },
    {
        "Countries and Regions": "EI Salvador",
        "chinese": "萨尔瓦多",
        "country": "SV",
        "code": "503"
    },
    {
        "Countries and Regions": "Estonia",
        "chinese": "爱沙尼亚",
        "country": "EE",
        "code": "372"
    },
    {
        "Countries and Regions": "Ethiopia",
        "chinese": "埃塞俄比亚",
        "country": "ET",
        "code": "251"
    },
    {
        "Countries and Regions": "Fiji",
        "chinese": "斐济",
        "country": "FJ",
        "code": "679"
    },
    {
        "Countries and Regions": "Finland",
        "chinese": "芬兰",
        "country": "FI",
        "code": "358"
    },
    {
        "Countries and Regions": "France",
        "chinese": "法国",
        "country": "FR",
        "code": "33"
    },
    {
        "Countries and Regions": "French Guiana",
        "chinese": "法属圭亚那",
        "country": "GF",
        "code": "594"
    },
    {
        "Countries and Regions": "French Polynesia",
        "chinese": "法属玻利尼西亚",
        "country": "PF",
        "code": "689"
    },
    {
        "Countries and Regions": "Gabon",
        "chinese": "加蓬",
        "country": "GA",
        "code": "241"
    },
    {
        "Countries and Regions": "Gambia",
        "chinese": "冈比亚",
        "country": "GM",
        "code": "220"
    },
    {
        "Countries and Regions": "Georgia",
        "chinese": "格鲁吉亚",
        "country": "GE",
        "code": "995"
    },
    {
        "Countries and Regions": "Germany",
        "chinese": "德国",
        "country": "DE",
        "code": "49"
    },
    {
        "Countries and Regions": "Ghana",
        "chinese": "加纳",
        "country": "GH",
        "code": "233"
    },
    {
        "Countries and Regions": "Gibraltar",
        "chinese": "直布罗陀",
        "country": "GI",
        "code": "350"
    },
    {
        "Countries and Regions": "Greece",
        "chinese": "希腊",
        "country": "GR",
        "code": "30"
    },
    {
        "Countries and Regions": "Grenada",
        "chinese": "格林纳达",
        "country": "GD",
        "code": "1809"
    },
    {
        "Countries and Regions": "Guam",
        "chinese": "关岛",
        "country": "GU",
        "code": "1671"
    },
    {
        "Countries and Regions": "Guatemala",
        "chinese": "危地马拉",
        "country": "GT",
        "code": "502"
    },
    {
        "Countries and Regions": "Guinea",
        "chinese": "几内亚",
        "country": "GN",
        "code": "224"
    },
    {
        "Countries and Regions": "Guyana",
        "chinese": "圭亚那",
        "country": "GY",
        "code": "592"
    },
    {
        "Countries and Regions": "Haiti",
        "chinese": "海地",
        "country": "HT",
        "code": "509"
    },
    {
        "Countries and Regions": "Honduras",
        "chinese": "洪都拉斯",
        "country": "HN",
        "code": "504"
    },
    {
        "Countries and Regions": "Hongkong",
        "chinese": "香港",
        "country": "HK",
        "code": "852"
    },
    {
        "Countries and Regions": "Hungary",
        "chinese": "匈牙利",
        "country": "HU",
        "code": "36"
    },
    {
        "Countries and Regions": "Iceland",
        "chinese": "冰岛",
        "country": "IS",
        "code": "354"
    },
    {
        "Countries and Regions": "India",
        "chinese": "印度",
        "country": "IN",
        "code": "91"
    },
    {
        "Countries and Regions": "Indonesia",
        "chinese": "印度尼西亚",
        "country": "ID",
        "code": "62"
    },
    {
        "Countries and Regions": "Iran",
        "chinese": "伊朗",
        "country": "IR",
        "code": "98"
    },
    {
        "Countries and Regions": "Iraq",
        "chinese": "伊拉克",
        "country": "IQ",
        "code": "964"
    },
    {
        "Countries and Regions": "Ireland",
        "chinese": "爱尔兰",
        "country": "IE",
        "code": "353"
    },
    {
        "Countries and Regions": "Israel",
        "chinese": "以色列",
        "country": "IL",
        "code": "972"
    },
    {
        "Countries and Regions": "Italy",
        "chinese": "意大利",
        "country": "IT",
        "code": "39"
    },
    {
        "Countries and Regions": "Ivory Coast",
        "chinese": "科特迪瓦",
        "country": " ",
        "code": "225"
    },
    {
        "Countries and Regions": "Jamaica",
        "chinese": "牙买加",
        "country": "JM",
        "code": "1876"
    },
    {
        "Countries and Regions": "Japan",
        "chinese": "日本",
        "country": "JP",
        "code": "81"
    },
    {
        "Countries and Regions": "Jordan",
        "chinese": "约旦",
        "country": "JO",
        "code": "962"
    },
    {
        "Countries and Regions": "Kampuchea (Cambodia )",
        "chinese": "柬埔寨",
        "country": "KH",
        "code": "855"
    },
    {
        "Countries and Regions": "Kazakstan",
        "chinese": "哈萨克斯坦",
        "country": "KZ",
        "code": "327"
    },
    {
        "Countries and Regions": "Kenya",
        "chinese": "肯尼亚",
        "country": "KE",
        "code": "254"
    },
    {
        "Countries and Regions": "Korea",
        "chinese": "韩国",
        "country": "KR",
        "code": "82"
    },
    {
        "Countries and Regions": "Kuwait",
        "chinese": "科威特",
        "country": "KW",
        "code": "965"
    },
    {
        "Countries and Regions": "Kyrgyzstan",
        "chinese": "吉尔吉斯坦",
        "country": "KG",
        "code": "331"
    },
    {
        "Countries and Regions": "Laos",
        "chinese": "老挝",
        "country": "LA",
        "code": "856"
    },
    {
        "Countries and Regions": "Latvia",
        "chinese": "拉脱维亚",
        "country": "LV",
        "code": "371"
    },
    {
        "Countries and Regions": "Lebanon",
        "chinese": "黎巴嫩",
        "country": "LB",
        "code": "961"
    },
    {
        "Countries and Regions": "Lesotho",
        "chinese": "莱索托",
        "country": "LS",
        "code": "266"
    },
    {
        "Countries and Regions": "Liberia",
        "chinese": "利比里亚",
        "country": "LR",
        "code": "231"
    },
    {
        "Countries and Regions": "Libya",
        "chinese": "利比亚",
        "country": "LY",
        "code": "218"
    },
    {
        "Countries and Regions": "Liechtenstein",
        "chinese": "列支敦士登",
        "country": "LI",
        "code": "423"
    },
    {
        "Countries and Regions": "Lithuania",
        "chinese": "立陶宛",
        "country": "LT",
        "code": "370"
    },
    {
        "Countries and Regions": "Luxembourg",
        "chinese": "卢森堡",
        "country": "LU",
        "code": "352"
    },
    {
        "Countries and Regions": "Macao",
        "chinese": "澳门",
        "country": "MO",
        "code": "853"
    },
    {
        "Countries and Regions": "Madagascar",
        "chinese": "马达加斯加",
        "country": "MG",
        "code": "261"
    },
    {
        "Countries and Regions": "Malawi",
        "chinese": "马拉维",
        "country": "MW",
        "code": "265"
    },
    {
        "Countries and Regions": "Malaysia",
        "chinese": "马来西亚",
        "country": "MY",
        "code": "60"
    },
    {
        "Countries and Regions": "Maldives",
        "chinese": "马尔代夫",
        "country": "MV",
        "code": "960"
    },
    {
        "Countries and Regions": "Mali",
        "chinese": "马里",
        "country": "ML",
        "code": "223"
    },
    {
        "Countries and Regions": "Malta",
        "chinese": "马耳他",
        "country": "MT",
        "code": "356"
    },
    {
        "Countries and Regions": "Mariana Is",
        "chinese": "马里亚那群岛",
        "country": " ",
        "code": "1670"
    },
    {
        "Countries and Regions": "Martinique",
        "chinese": "马提尼克",
        "country": " ",
        "code": "596"
    },
    {
        "Countries and Regions": "Mauritius",
        "chinese": "毛里求斯",
        "country": "MU",
        "code": "230"
    },
    {
        "Countries and Regions": "Mexico",
        "chinese": "墨西哥",
        "country": "MX",
        "code": "52"
    },
    {
        "Countries and Regions": "Moldova Republic of",
        "chinese": "摩尔多瓦",
        "country": "MD",
        "code": "373"
    },
    {
        "Countries and Regions": "Monaco",
        "chinese": "摩纳哥",
        "country": "MC",
        "code": "377"
    },
    {
        "Countries and Regions": "Mongolia",
        "chinese": "蒙古",
        "country": "MN",
        "code": "976"
    },
    {
        "Countries and Regions": "Montserrat Is",
        "chinese": "蒙特塞拉特岛",
        "country": "MS",
        "code": "1664"
    },
    {
        "Countries and Regions": "Morocco",
        "chinese": "摩洛哥",
        "country": "MA",
        "code": "212"
    },
    {
        "Countries and Regions": "Mozambique",
        "chinese": "莫桑比克",
        "country": "MZ",
        "code": "258"
    },
    {
        "Countries and Regions": "Namibia",
        "chinese": "纳米比亚",
        "country": "NA",
        "code": "264"
    },
    {
        "Countries and Regions": "Nauru",
        "chinese": "瑙鲁",
        "country": "NR",
        "code": "674"
    },
    {
        "Countries and Regions": "Nepal",
        "chinese": "尼泊尔",
        "country": "NP",
        "code": "977"
    },
    {
        "Countries and Regions": "Netheriands Antilles",
        "chinese": "荷属安的列斯",
        "country": " ",
        "code": "599"
    },
    {
        "Countries and Regions": "Netherlands",
        "chinese": "荷兰",
        "country": "NL",
        "code": "31"
    },
    {
        "Countries and Regions": "New Zealand",
        "chinese": "新西兰",
        "country": "NZ",
        "code": "64"
    },
    {
        "Countries and Regions": "Nicaragua",
        "chinese": "尼加拉瓜",
        "country": "NI",
        "code": "505"
    },
    {
        "Countries and Regions": "Niger",
        "chinese": "尼日尔",
        "country": "NE",
        "code": "227"
    },
    {
        "Countries and Regions": "Nigeria",
        "chinese": "尼日利亚",
        "country": "NG",
        "code": "234"
    },
    {
        "Countries and Regions": "North Korea",
        "chinese": "朝鲜",
        "country": "KP",
        "code": "850"
    },
    {
        "Countries and Regions": "Norway",
        "chinese": "挪威",
        "country": "NO",
        "code": "47"
    },
    {
        "Countries and Regions": "Oman",
        "chinese": "阿曼",
        "country": "OM",
        "code": "968"
    },
    {
        "Countries and Regions": "Pakistan",
        "chinese": "巴基斯坦",
        "country": "PK",
        "code": "92"
    },
    {
        "Countries and Regions": "Panama",
        "chinese": "巴拿马",
        "country": "PA",
        "code": "507"
    },
    {
        "Countries and Regions": "Papua New Cuinea",
        "chinese": "巴布亚新几内亚",
        "country": "PG",
        "code": "675"
    },
    {
        "Countries and Regions": "Paraguay",
        "chinese": "巴拉圭",
        "country": "PY",
        "code": "595"
    },
    {
        "Countries and Regions": "Peru",
        "chinese": "秘鲁",
        "country": "PE",
        "code": "51"
    },
    {
        "Countries and Regions": "Philippines",
        "chinese": "菲律宾",
        "country": "PH",
        "code": "63"
    },
    {
        "Countries and Regions": "Poland",
        "chinese": "波兰",
        "country": "PL",
        "code": "48"
    },
    {
        "Countries and Regions": "Portugal",
        "chinese": "葡萄牙",
        "country": "PT",
        "code": "351"
    },
    {
        "Countries and Regions": "Puerto Rico",
        "chinese": "波多黎各",
        "country": "PR",
        "code": "1787"
    },
    {
        "Countries and Regions": "Qatar",
        "chinese": "卡塔尔",
        "country": "QA",
        "code": "974"
    },
    {
        "Countries and Regions": "Reunion",
        "chinese": "留尼旺",
        "country": " ",
        "code": "262"
    },
    {
        "Countries and Regions": "Romania",
        "chinese": "罗马尼亚",
        "country": "RO",
        "code": "40"
    },
    {
        "Countries and Regions": "Russia",
        "chinese": "俄罗斯",
        "country": "RU",
        "code": "7"
    },
    {
        "Countries and Regions": "Saint Lueia",
        "chinese": "圣卢西亚",
        "country": "LC",
        "code": "1758"
    },
    {
        "Countries and Regions": "Saint Vincent",
        "chinese": "圣文森特岛",
        "country": "VC",
        "code": "1784"
    },
    {
        "Countries and Regions": "Samoa Eastern",
        "chinese": "东萨摩亚(美)",
        "country": " ",
        "code": "684"
    },
    {
        "Countries and Regions": "Samoa Western",
        "chinese": "西萨摩亚",
        "country": " ",
        "code": "685"
    },
    {
        "Countries and Regions": "San Marino",
        "chinese": "圣马力诺",
        "country": "SM",
        "code": "378"
    },
    {
        "Countries and Regions": "Sao Tome and Principe",
        "chinese": "圣多美和普林西比",
        "country": "ST",
        "code": "239"
    },
    {
        "Countries and Regions": "Saudi Arabia",
        "chinese": "沙特阿拉伯",
        "country": "SA",
        "code": "966"
    },
    {
        "Countries and Regions": "Senegal",
        "chinese": "塞内加尔",
        "country": "SN",
        "code": "221"
    },
    {
        "Countries and Regions": "Seychelles",
        "chinese": "塞舌尔",
        "country": "SC",
        "code": "248"
    },
    {
        "Countries and Regions": "Sierra Leone",
        "chinese": "塞拉利昂",
        "country": "SL",
        "code": "232"
    },
    {
        "Countries and Regions": "Singapore",
        "chinese": "新加坡",
        "country": "SG",
        "code": "65"
    },
    {
        "Countries and Regions": "Slovakia",
        "chinese": "斯洛伐克",
        "country": "SK",
        "code": "421"
    },
    {
        "Countries and Regions": "Slovenia",
        "chinese": "斯洛文尼亚",
        "country": "SI",
        "code": "386"
    },
    {
        "Countries and Regions": "Solomon Is",
        "chinese": "所罗门群岛",
        "country": "SB",
        "code": "677"
    },
    {
        "Countries and Regions": "Somali",
        "chinese": "索马里",
        "country": "SO",
        "code": "252"
    },
    {
        "Countries and Regions": "South Africa",
        "chinese": "南非",
        "country": "ZA",
        "code": "27"
    },
    {
        "Countries and Regions": "Spain",
        "chinese": "西班牙",
        "country": "ES",
        "code": "34"
    },
    {
        "Countries and Regions": "Sri Lanka",
        "chinese": "斯里兰卡",
        "country": "LK",
        "code": "94"
    },
    {
        "Countries and Regions": "St.Lucia",
        "chinese": "圣卢西亚",
        "country": "LC",
        "code": "1758"
    },
    {
        "Countries and Regions": "St.Vincent",
        "chinese": "圣文森特",
        "country": "VC",
        "code": "1784"
    },
    {
        "Countries and Regions": "Sudan",
        "chinese": "苏丹",
        "country": "SD",
        "code": "249"
    },
    {
        "Countries and Regions": "Suriname",
        "chinese": "苏里南",
        "country": "SR",
        "code": "597"
    },
    {
        "Countries and Regions": "Swaziland",
        "chinese": "斯威士兰",
        "country": "SZ",
        "code": "268"
    },
    {
        "Countries and Regions": "Sweden",
        "chinese": "瑞典",
        "country": "SE",
        "code": "46"
    },
    {
        "Countries and Regions": "Switzerland",
        "chinese": "瑞士",
        "country": "CH",
        "code": "41"
    },
    {
        "Countries and Regions": "Syria",
        "chinese": "叙利亚",
        "country": "SY",
        "code": "963"
    },
    {
        "Countries and Regions": "Taiwan",
        "chinese": "台湾省",
        "country": "TW",
        "code": "886"
    },
    {
        "Countries and Regions": "Tajikstan",
        "chinese": "塔吉克斯坦",
        "country": "TJ",
        "code": "992"
    },
    {
        "Countries and Regions": "Tanzania",
        "chinese": "坦桑尼亚",
        "country": "TZ",
        "code": "255"
    },
    {
        "Countries and Regions": "Thailand",
        "chinese": "泰国",
        "country": "TH",
        "code": "66"
    },
    {
        "Countries and Regions": "Togo",
        "chinese": "多哥",
        "country": "TG",
        "code": "228"
    },
    {
        "Countries and Regions": "Tonga",
        "chinese": "汤加",
        "country": "TO",
        "code": "676"
    },
    {
        "Countries and Regions": "Trinidad and Tobago",
        "chinese": "特立尼达和多巴哥",
        "country": "TT",
        "code": "1809"
    },
    {
        "Countries and Regions": "Tunisia",
        "chinese": "突尼斯",
        "country": "TN",
        "code": "216"
    },
    {
        "Countries and Regions": "Turkey",
        "chinese": "土耳其",
        "country": "TR",
        "code": "90"
    },
    {
        "Countries and Regions": "Turkmenistan",
        "chinese": "土库曼斯坦",
        "country": "TM",
        "code": "993"
    },
    {
        "Countries and Regions": "Uganda",
        "chinese": "乌干达",
        "country": "UG",
        "code": "256"
    },
    {
        "Countries and Regions": "Ukraine",
        "chinese": "乌克兰",
        "country": "UA",
        "code": "380"
    },
    {
        "Countries and Regions": "United Arab Emirates",
        "chinese": "阿拉伯联合酋长国",
        "country": "AE",
        "code": "971"
    },
    {
        "Countries and Regions": "United Kiongdom",
        "chinese": "英国",
        "country": "GB",
        "code": "44"
    },
    {
        "Countries and Regions": "United States of America",
        "chinese": "美国",
        "country": "US",
        "code": "1"
    },
    {
        "Countries and Regions": "Uruguay",
        "chinese": "乌拉圭",
        "country": "UY",
        "code": "598"
    },
    {
        "Countries and Regions": "Uzbekistan",
        "chinese": "乌兹别克斯坦",
        "country": "UZ",
        "code": "233"
    },
    {
        "Countries and Regions": "Venezuela",
        "chinese": "委内瑞拉",
        "country": "VE",
        "code": "58"
    },
    {
        "Countries and Regions": "Vietnam",
        "chinese": "越南",
        "country": "VN",
        "code": "84"
    },
    {
        "Countries and Regions": "Yemen",
        "chinese": "也门",
        "country": "YE",
        "code": "967"
    },
    {
        "Countries and Regions": "Yugoslavia",
        "chinese": "南斯拉夫",
        "country": "YU",
        "code": "381"
    },
    {
        "Countries and Regions": "Zimbabwe",
        "chinese": "津巴布韦",
        "country": "ZW",
        "code": "263"
    },
    {
        "Countries and Regions": "Zaire",
        "chinese": "扎伊尔",
        "country": "ZR",
        "code": "243"
    },
    {
        "Countries and Regions": "Zambia",
        "chinese": "赞比亚",
        "country": "ZM",
        "code": "260"
    }
];

const letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'Y',
    'Z',
];

export default class CountryPick extends PureComponent {
    count = [13, 17, 14, 3, 5, 5, 12, 4, 9, 3, 6, 9, 17, 11, 1, 9, 1, 3, 26, 10, 7, 2, 2, 3]
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={{flex:1, flexDirection:'column', backgroundColor:Color.bgColor}}>
                <View style={{flex:1, flexDirection:'row', backgroundColor:Color.bgColor}}>
                    <FlatList
                        data={countryData}
                        style={{
                            flex:1,
                            flexDirection:'column',
                        }}
                        initialListSize={30}
                        ref={r=>this.list = r}
                        showsVerticalScrollIndicator={false}
                        renderItem={(item)=>{
                            return (
                                <TouchableOpacity
                                    style={{paddingLeft:8,paddingRight:8,height:50}}
                                    activeOpacity={1}
                                    onPress={()=>{
                                        this.props.selectRegion(item.item);
                                        this.props.navigator.pop();
                                    }}
                                >
                                    <View style={{flex:1, alignItems:'center', flexDirection:'row'}}>
                                        <Text style={{fontSize:16, flex:1}}>
                                            {item.item['Countries and Regions']}
                                        </Text>
                                        <Text style={{color:'gray',padding:4, backgroundColor:'lightgray'}}>
                                            {item.item.code}
                                        </Text>
                                    </View>
                                    <View style={{height:1, backgroundColor:'lightgray'}} />
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item,index)=>{
                            return index;
                        }}
                        getItemLayout={(item,index)=>{

                            return {
                                length:50,
                                offset:50 * index,
                                index,
                            }
                        }}
                    />
                    <View style={{width:30}}>
                        {
                            letters.map((data,index)=>{
                                return (
                                    <Text
                                        key={index}
                                        style={{flex:1, textAlign:'center'}}
                                        onPress={()=>{
                                            if (index === 0) {
                                                this.list.scrollToIndex({
                                                    viewPosition:0,
                                                    index:0,
                                                })
                                            } else {
                                                let position = 0;
                                                let viewPosition = 0;
                                                console.log(index);
                                                if (index > 20) {
                                                    this.list.scrollToEnd();
                                                } else {
                                                    this.count.map((data,i)=>{
                                                        if (i + 1 <= index) {
                                                            position += data;
                                                        }
                                                    });
                                                    this.list.scrollToIndex({
                                                        viewPosition:viewPosition,
                                                        index:position,
                                                    })
                                                }
                                            }
                                        }}
                                    >
                                        {data}
                                    </Text>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}