

var activityTitle = '';
var activityDesc = '';
var shareIcon = "https://www.lem6.cn/images/share_default_icon.png";

var aid;

function getAid(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;  
}


aid = getAid('aid');
// console.log("aid="+aid);

$.ajax({
    url: "https://api.lem6.cn/v1/activity/"+aid+"/1/30/rank", success: function (result) {
        // console.log(result);
        var datas = result.data;
        // console.log(datas.length);
        for (let index = 0; index < datas.length; index++) {
            
            // console.log(datas[index].rank);
            // console.log(datas[index].story_avatar);
            var avatar='';
            if (datas[index].story_avatar.indexOf('http')==0) {
                avatar = datas[index].story_avatar;
            }else{
                avatar = "https://lem6.oss-cn-shenzhen.aliyuncs.com/avatar/" + datas[index].story_uid + "/" + datas[index].story_avatar;
            }
            
            let nickName;
            if (datas[index].story_nickname==='') {
                nickName = datas[index].story_uid;
            }else{
                nickName = datas[index].story_nickname;
            }
            

            let rankIcon;
            if (datas[index].rank===1) {
                rankIcon = '<img class="rank-icon"   src= "images/ic_jinpai.png" >' + '<img class="user-avatar" src=' + avatar + '>'
            } else if (datas[index].rank === 2) {
                rankIcon = '<img class="rank-icon"   src= "images/ic_yinpai.png" >' + '<img class="user-avatar" src=' + avatar + '>'
            } else if (datas[index].rank === 3) {
                rankIcon = '<img class="rank-icon"   src= "images/ic_tongpai.png" >' + '<img class="user-avatar" src=' + avatar + '>'
            }else{
                rankIcon = '<img class="rank-icon"   src= "images/ic_jinpai.png" >' + '<img class="user-avatar-2" src=' + avatar + '>'
                
            }

            let storyLink;
            let storyLinkUrl = "https://www.lem6.cn/lemo_storychapter.html?sharekey=" + datas[index].story_sharekey;
            storyLink = "<span class='story-link' style='display:none'>"+storyLinkUrl+"</span>"
            
            $li_storyItem = $('<li>' +storyLink + rankIcon +
            '<div class="item-text">\
            <p class="item-first-text">'+ datas[index].story_nickname + '&nbsp&nbsp&nbsp<span class="item-text-works-name">' + datas[index].title + '</span> </p>\
            <p class="item-second-text">获得票数：'+ datas[index].num + '票</p>\
            </div>\
            </li>');
            
            $li_storyItem.click(function () {
                
                window.location.href = $(this).find(".story-link").text();

            });

            // $li_storyItem.on('tap',function () {

            //     window.location.href = $(this).find(".story-link").text();

            // });


            $('#the-list').append($li_storyItem);
            
        }

       
        
    }
});

$.ajax({
    url: "https://api.lem6.cn/v1/activity/h5/"+aid+"/detail", success: function (result) {
        $('#activity-name').text(result.data.activity_name);
        $('#user-name font').text(result.data.creator_nickname);
        $('#activity-desc').text(result.data.activity_describe);
        $('#activity-rule').text(result.data.activity_rule);
        $('#activity-apply-deadline').text(formatDate(result.data.apply_deadline, 'MM月DD日 hh:mm'));
        $('#vote-begin').text(formatDate(result.data.vote_starttime, 'MM月DD日 hh:mm'));
        $('#activity-end').text(formatDate(result.data.vote_deadline, 'MM月DD日 hh:mm'));
        $('title').text('柠檬手记——' + result.data.activity_name)

        activityTitle = result.data.activity_name;
        activityDesc = result.data.activity_describe;

        // if (result.data.creator_avatar.indexOf('http')==0) {
        //     shareIcon = result.data.creator_avatar
        // }else{
        //     shareIcon = "https://lem6.oss-cn-shenzhen.aliyuncs.com/avatar/" + result.data.creator_uid + "/" + result.data.creator_avatar;
        // }
        // console.log('shareIcon='+shareIcon);
        
        if (result.data.vote_number ===1) {
            $('#vote-time-font').text('仅一次');
        } else if (result.data.vote_number === 2) {
            $('#vote-time-font').text('一天一次');
        } else if (result.data.vote_number === 3) {
            $('#vote-time-font').text('一天三次');
        }
        
        
    }
});

function formatDate (now, form) {
    var oDate = new Date(now * 1000);
    var year = oDate.getFullYear();
    var month = oDate.getMonth() + 1;
    var date = oDate.getDate();
    var hour = oDate.getHours();
    var minute = oDate.getMinutes();
    var second = oDate.getSeconds();
    var arrDates = [year, month, date, hour, minute, second];
    var arrForm = ['YYYY', 'MM', 'DD', 'hh', 'mm', 'ss'];
    for (var i = 0, len = arrForm.length; i < len; i++) {
        if (form.indexOf(arrForm[i]) !== -1) {
            form = form.replace(arrForm[i], arrDates[i])
        }
    }
    return form;
}


window.onload = function () {//进入页面就执行ajax，目的为了传送当前页面url#前的完整url
    var ajaxurl = 'https://api.lem6.cn/index.php';
    var query = new Object();
    var urll = location.href.split('#')[0]; //页面url#前的完整url,可alert弹出查看
    query.urll = $.trim(urll);
    //console.log(query.urll);
    query.post_type = "jsonp";
    $.ajax({
        url: ajaxurl,
        data: query,
        type: "POST",
        dataType: "jsonp",
        crossDomain: true,
        success: function (ress) {
            //成功则执行JS-SDK
            // console.log(ress);//查看返回结果
            //执行JS_SDK
            wx.config({
                debug: false,
                appId: ress.appid,
                timestamp: ress.timestamp,
                nonceStr: ress.nonceStr,
                signature: ress.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
            });

            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
                // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

                wx.onMenuShareTimeline({
                    title: '柠檬手记——' + activityTitle, // 分享标题
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareIcon, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: '柠檬手记——' + activityTitle, // 分享标题
                    desc: activityDesc, // 分享描述
                    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareIcon, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数

                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数

                    }
                });



            });

            wx.error(function (res) {
                // config信息验证失败会执行error函数，
                //如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        },
        error: function () {
            console.log("通信失败");
           
        }
    });
}