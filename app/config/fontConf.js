/**
 * Created by liuyu on 2017/6/3.
 */

let map = {
    "deliver_icon":"59648",
    "pick_icon":"59649",
    "store_icon":"59650",
    "profile_icon":'59651',
};

module.exports = (name)=>String.fromCharCode(map[name]);