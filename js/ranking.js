var ranking_list = new Vue({
    el: "#story-list",
    data: {
        datas: '',
        url: '',
        desc: '柠檬手记-做最专业的随身手记',
        pDesc: 'vc',
        shareIcon: ''
    },
    methods: {
        LastPathComponent: function (url) {
            var index = url.lastIndexOf("\/");
            if (index >= 0) {
                var str = url.substring(index + 1, url.length);
                return str;
            }
            return url;
        },
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        getData: function () {
            this.$http.get(this.url).then(function (res) {
                // support full url
                res.data.data.splash = this.LastPathComponent(res.data.data.splash);
                res.data.data.avatar = this.LastPathComponent(res.data.data.avatar);
                for (var i in res.data.data.fragments) {
                    var chapter = res.data.data.fragments[i];
                    //console.log(chapter);
                    var imgs = [];
                    for (var j in chapter.images) {
                        var tmp = this.LastPathComponent(chapter.images[j]);
                        imgs.push(tmp);
                    }
                    chapter.images = imgs;
                    if (chapter.hasOwnProperty('audio') && chapter.audio.hasOwnProperty('mediaid')) {
                        chapter.audio.mediaid = this.LastPathComponent(chapter.audio.mediaid);
                    }
                }
                this.datas = res.data.data;
                if (res.data.data.fragments[0].describe) {
                    this.desc = res.data.data.fragments[0].describe;
                    // console.log(res.data.data.fragments[0].describe);
                }
                if (res.data.data.stype === 1) {
                    $('.story-subject-body').css('display', 'none');
                    $('.txt-tip1').css('display', 'none');
                }

                this.shareIcon = 'https://lem6.oss-cn-shenzhen.aliyuncs.com/public/' + this.datas.uid + '/' + this.datas.splash;

                var diff = res.data.data.curts - res.data.data.ptime;
                if (diff <= 60) {
                    this.pDesc = '刚刚发布';
                } else if (diff > 60 && diff < 3600) {
                    this.pDesc = parseInt(diff / 60) + '分钟前发布';
                } else if (diff > 3600 && diff < (3600 * 24)) {
                    this.pDesc = parseInt(diff / 3600) + '小时前发布';
                } else if (diff > (3600 * 24) && diff < (3600 * 24 * 30)) {
                    this.pDesc = parseInt(diff / 3600 / 24) + '天前发布';
                } else {
                    this.pDesc = '发布过期';
                }
                // console.log('pDesc='+this.pDesc+',diff='+diff);
                //console.log(this.datas);
            }, function (res) {
                // console.log(res.status);
            });
            return this;
        },
        formatDate: function (now, form) {
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
        },
        audioPlay: function () {
            event = event || window.event;
            var target = event.target || event.srcElement;
            var This = $(target).parents('.voice-group') || $(target);
            var Media = This.find('.voice').get(0);
            var voicembg = This.find('.voice-mbg');
            var voicewave = This.find('.voice-wave');
            var voicestate = This.find('.voice-state');
            if (Media.paused) {
                Media.play();
                voicestate.css({ 'display': "none" });
                voicewave.addClass('voice-wave-anima');
            } else {
                Media.pause();
                voicewave.removeClass('voice-wave-anima');
            }
            Media.addEventListener('ended', function () {
                voicembg.css({
                    'border-color': '#0199f5'
                });
                voicewave.removeClass('voice-wave-anima');

            });
        }
    }
});
ranking_list.url = 'http://api.lem6.cn/v1/activity/56/1/10/rank' ;
ranking_list.getData();