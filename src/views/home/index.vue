<template>
    <page-title title="首页"></page-title>
    <div class="page page-home">
        <div v-if="!$loadingRouteData">
            <div class="head fs-white">
                <div class="left-item fs-32">
                    <div class="integral">
                        <span>我的积分</span>
                        <p>{{userinfo.integral}}</p>
                    </div>
                    <div class="coupon">
                        <span >我的点券</span>
                        <p>{{userinfo.point}}</p>
                    </div>
                </div>
                <div id="gauge">
                    
                </div>
                <div class="right-item">
                    <p><a href="javascript:;" 
                    class="fs-white"
                    v-link="'/user/integral'">积分明细</a></p>
                    <p><a href="javascript:;" 
                    class="fs-orange radius8"
                    v-link="'/shop'">去兑换</a></p>
                </div>
            </div>
            
            <div class="news-slide bg-white mt20">
                <div class="grid">
                    <ul class="fs-30 fs-orange">
                        <li v-for="item of newsList">{{item.content}}</li>
                        <li v-for="item of newsList">{{item.content}}</li>
                    </ul>
                </div>
            </div>
            

            <div class="handle-list mt20 bt fs-30">
                <ul>
                    <li>
                        <a class="tap-active" href="javascript:;" v-link="'/rank'">
                            <img src="../../assets/icon_yingxiongbang@3x.png">英雄榜
                        </a>
                    </li>
                    <li>
                        <a class="tap-active" href="javascript:;" v-link="'/news'">
                            <img src="../../assets/icon_zixun@3x.png">曝光台
                        </a>
                    </li>
                    <li>
                        <a class="tap-active" href="javascript:;" v-link="'/notice'">
                            <img src="../../assets/icon_gonggao@3x.png">通告
                        </a>
                    </li>
                    <li>
                        <a class="tap-active" href="javascript:;" v-link="'/task'">
                            <img src="../../assets/icon_rizhi@3x.png">我的任务
                        </a>
                    </li>
                    <li>
                        <a class="tap-active" href="javascript:;" v-link="'/welfare'">
                            <img src="../../assets/icon_fuli@3x.png">员工福利
                        </a>
                    </li>
                    <li>
                        <a class="tap-active" href="javascript:;" v-link="'/addIntegral'">
                            <img src="../../assets/icon_jiafen@3x.png">申请加分
                        </a>
                    </li>
                    
                </ul>
            </div>
        </div>
    </div>
    <v-footer></v-footer>
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import vFooter from 'components/Footer'
    import { userinfo } from 'vx/getters'
    var echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/gauge');
    
    export default {
        data() {
            return {
                gauge: null,
                newsList: null,
                newsWidth: ''
            }
        },
        components: {
            vFooter,
            PageTitle
        },
        methods: {
            rem(val) {
                return $(window).width()*val/750;
            }
        },
        route: {
            data: async function(transition) {
                await this.$xhr.getUserInfo();
                return this.$xhr.getData('rollingNotice/getSelectedRollingNotices')
                .then((list) => {
                    this.$set('newsList', list);
                });
            }
        },
        vuex: {
            getters: {
                userinfo
            }
        },
        computed: {
            newsSlideHeight() {
                return `${$(window).width()*70/750}px`;
            }
        },
        watch: {

            $loadingRouteData() {
                let me = this;
                !this.gauge && (this.gauge = echarts.init(document.getElementById('gauge')));
                this.gauge.setOption({
                    series: [
                        {
                            name: '积分',
                            type: 'gauge',
                            data: [{value: me.userinfo.integral, name: '积分'}],
                            max: 8000,
                            splitNumber: 10,
                            startAngle: 230,
                            endAngle: -50,
                            radius: '85%',
                            silent: true,
                            animation: false,
                            axisLine: {
                                lineStyle: {
                                    color: [[0.05, '#f85f46'], [0.15, '#f3b469'], [0.3, '#63869e'], [0.5, '#64ca7c'], [1, '#f8cd06']],
                                    width: me.rem(30)
                                }
                            },
                            splitLine: {
                                length: me.rem(30),
                                lineStyle: {
                                    width: me.rem(2),
                                }
                            },
                            axisLabel: {
                                distance: me.rem(4),
                                textStyle: {
                                    fontSize: me.rem(16)
                                }
                            },
                            pointer: {
                                width: me.rem(8)
                            },
                            title: {
                                textStyle: {
                                    color: '#fff',
                                    fontSize: me.rem(25)
                                }
                            },
                            detail: {
                                offsetCenter: [0, '70%'],
                                textStyle: {
                                    fontSize: me.rem(35),
                                    color: '#fff'
                                }
                            },
                            axisTick: {
                                length: me.rem(8)
                            }
                        }
                    ]
                });
            }
        }  
    }
</script>
<style lang="less">
    @import '~src/styles/mixin.less';
    .page-home {
        .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 4.53333333rem; // 340px
            .background-img('shouye_bg@3x.png');
        }
        .left-item {
            margin-left: .4rem; // 30px
            span {
                display: block;
                letter-spacing: 1px;
            }
            p {
                .font-size(@fs54);
                margin-top: .10666667rem; // 8px
                letter-spacing: 2px;
            }
            .coupon {
                margin-top: .73333333rem; // 55px
            }
        }
        .right-item {
            margin-right: .4rem; // 30px
            font-size: .37333333rem; // 28px
            p {
                text-align: right;
            }
            p:last-of-type {
                margin-top: 1.66666667rem; // 125px
                font-size: .42666667rem; // 32px
                a {
                    display: block;
                    padding: .2rem .4rem; 
                    background-color: #fff;
                }
            }
        }
        .handle-list ul {
            overflow: hidden;
            li {
                float: left;
                box-sizing: border-box;
                display: inline-block;
                border-bottom: solid 1px @bd-color;
                background-color: #fff;
                .wh(@body-w/3);
                &:nth-of-type(3n+2) {
                    border-left: solid 1px @bd-color;
                    border-right: solid 1px @bd-color;
                }
            }
            img {
                .wh(.93333333rem);
                padding-bottom: .4rem; // 30px
            }
            a {
                display: flex;
                height: 100%;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: @c-666666;
            }
        }

        #gauge {
            @wh: 4.66666667rem; // 350px
            width: @wh;
            height: 100%;
        }
        .news-slide {
            @h: .93333333rem; // 70px
            .grid {
                height: @h;
                overflow: hidden;
                position: relative;
            }
            @-webkit-keyframes newsslide  
            {  
                0%{  
                    transform: translateX(0%);  
                }  
                100%  
                {  
                    transform: translateX(-53%); 
                }    
            }
            ul {
                white-space:nowrap;
                position: absolute;
                -webkit-animation: 10s newsslide infinite linear
            }
            li {
                display: inline-block;
                height: @h;
                line-height: @h;
                margin-left: 3%;
            }
        }
    }
</style>