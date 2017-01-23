<template>
    <page-title title="我的"></page-title>
    <div class="page page-user-center">
        <div v-if="!$loadingRouteData">
            <div class="head">
                <div class="head-img">
                    <img v-touch:tap="handleClick" :src="head || headImg || defaultImg">
                    <input id="head-img" type="file" @change="handleChange($event)">
                </div>
                <p class="name fs-white pt20">{{userinfo.name}}</p>
                <p class="positon fs-white pt10">{{userinfo.rolename}}</p>
            </div>
            <div class="handle-list pt20">
                <cell title="请假" :arrow="true" link="/leave">
                    <img slot="title" src="../../assets/icon_qingjia@3x.png">
                </cell>
                <cell class="bt" title="我的积分" :arrow="true" link="/user/integral">
                    <img slot="title" src="../../assets/wode_wdjf@3x.png">
                </cell>
                <cell title="我的履历" :arrow="true" link="/user/resume">
                    <img slot="title" src="../../assets/wode_lvli@3x.png">
                </cell>
                <cell title="兑换记录" :arrow="true" link="/user/exchange">
                    <img slot="title" src="../../assets/wode_dhjl@3x.png">
                </cell>
                <cell title="给领导打分" :arrow="true" @click="pickLeader">
                    <img slot="title" src="../../assets/wode_glddf@3x.png">
                </cell>
                <cell title="意见或者建议" :arrow="true" link="/user/suggest">
                    <img slot="title" src="../../assets/wode_yjhzjy@3x.png">
                </cell>
                <cell title="退出登录" :arrow="true" @click="logout">
                    <img slot="title" src="../../assets/tab_wode_nor@3x.png">
                </cell>
            </div>
        </div>

    </div>
    <v-footer></v-footer>
    <picker-modal title="给领导打分" action-msg="开始打分" :show.sync="pickerShow" :init="pickerInit" @complete-pick="goScore">
        <div class="leader-picker-list">
            <label v-for="item of leaders" for="radio_{{$index}}">
                <cell h="1.13333333rem">
                    <div slot="title">
                        {{item.department}} <span class="fs-gray">{{item.position}}</span>
                    </div>
                    <input 
                        id="radio_{{$index}}" 
                        type="radio" 
                        name="leader" 
                        slot="value" 
                        :value="$index" 
                        v-model="leaderPick">
                </cell>
            </label>
        </div>
    </picker-modal>
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import vFooter from 'components/Footer'
    import Cell from 'components/Cell'
    import PickerModal from 'components/PickerModal'

    import CanvasUpload from 'src/lib/upload'
    import { userinfo } from 'vx/getters'
    import defaultImg from 'assets/wode_touxiang.png'
    import deepcopy from 'deepcopy'
    import locache from 'lib/locache.js'
    export default {
        data() {
            return {
                defaultImg: defaultImg,
                head: null,
                pickerInit: false,
                pickerShow: false,
                leaderPick: 0,
                leaders: []
            }
        },
        components: {
            PageTitle,
            vFooter,
            Cell,
            PickerModal
        },
        computed: {
            headImg() {
                let headImg = this.userinfo.headImg;
                if(headImg) {
                    return this.$host.imgHost + headImg;
                }
                return false;
            }
        },
        methods: {
            handleChange(event) {
                var el = event.target;
                var self = this;
                if(el.files && el.files[0]){
                    CanvasUpload(el, {
                        uploading: function(){
                            self.$loading.show();
                        },
                        complete: async function(data){
                            await self.$xhr.getUserInfo();
                            let base64 = data.split('base64,')[1];
                            self.$xhr.handle('user/upLoadHeadImg', {
                                userId: self.userinfo.userId,
                                headImg: base64
                            })
                            .then((headImg) => {
                                self.head = data;
                            })
                        },
                        error(msg) {
                            self.$loading.hide();
                            self.$toast.show(msg);
                        }
                    });
                }
            },
            handleClick() {
                document.getElementById('head-img').click();
            },
            logout() {
                if(confirm('确定退出登录？')) {
                    locache.remove('STuserInfo');
                    this.$router.replace('/login');
                }
            },
            pickLeader: async function() {
                await this.$xhr.getUserInfo();
                this.$xhr.getData('user/getAllSuperiorUsers')
                .then((list) => {
                    if(!list.length) {
                        this.toast('没有领导');
                    }
                    this.$set('leaders', list);
                    this.pickerShow = true;
                    this.pickerInit = true;
                });
            },
            goScore() {
                this.$router.go({path: '/user/leaderScore', query: {s: this.leaders[this.leaderPick].superiorUserId}});
            }
        },
        route: {
            data: async function(transition) {
                await this.$xhr.getUserInfo();
                this.$loading.hide();
            }
        },
        vuex: {
            getters: {
                userinfo
            }
        }
    }
</script>
<style lang="less">
    @import '~src/styles/mixin.less';
    .page-user-center {
        #head-img {
            display: none;
        }
        .head {
            height: 4.26666667rem; // 320px
            .background-img('wode_bg@3x.png');
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .head-img {
                border: solid .10666667rem #ff8a3c;
                border-radius: 50%;
                img {
                    .wh(1.6rem);
                    border: solid .10666667rem #ffab72;
                    border-radius: 50%;
                }
            }
            .name {
                font-size: .48rem; // 36px
            }
            .position {
                font-size: .37333333rem; // 28px
            }
        }
        .handle-list {
            img {
                .wh(.53333333rem);
                padding-right: .33333333rem; // 25px
            }
        }
    }
    .leader-picker-list {
        label input[slot=value] {
            display: block;
            .wh(.42666667rem);
            .background-img('xuanze_nor@3x.png');
            &:checked {
                .background-img('xuanze_sel@3x.png');
            }
        }
    }
</style>