<template>
    <page-title title="请假"></page-title>
    <div class="page page-leave">
        <div v-if="!$loadingRouteData">
            <input id="j-start-time" type="date" v-model="startTime">
            <input id="j-end-time" type="date" v-model="endTime">
            <cell @click="startHandler" title="开始时间" :value="startTime" :arrow="true"></cell>
            <cell @click="endHandler" title="结束时间" :value="endTime" :arrow="true"></cell>
            <cell title="请假天数">
                <span slot="value">{{dayNumber}}天</span>
            </cell>
            <text-card
            title="请假理由"
            placeholder="请输入请假理由"
            :value.sync="reason"></text-card>
        </div>
    </div>
    <div class="bottom bg-white bt">
        <btn @click="handleSubmit">提 交</btn>
    </div>
    
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import Cell from 'components/Cell'
    import Btn from 'components/Btn'
    import TextCard from '../note/text-card'

    import { userinfo } from 'vx/getters'
    export default {
        data() {
            return {
                startTime: '选择开始时间',
                endTime: '选择结束时间',
                reason: ''
            }
        },
        components: {
            PageTitle,
            Cell,
            Btn,
            TextCard
        },
        methods: {
            simulationClick(selecter) {
                var elem = document.getElementById(selecter);
                if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    elem.focus();
                }else {
                    elem.click();
                }
            },
            startHandler() {
                this.simulationClick('j-start-time');
            },
            endHandler() {
                this.simulationClick('j-end-time');
            },
            handleSubmit: async function() {
                if(!this.verification()) return;
                await this.$xhr.getUserInfo();
                let param = [{
                    userId: this.userinfo.userId,
                    departmentId: this.userinfo.departmentId,
                    starttime: this.startTime,
                    endtime: this.endTime,
                    days: this.dayNumber,
                    reason: this.reason
                }];
                this.$xhr.handle('leave/askLeave', {
                    leave: JSON.stringify(param)
                })
                .then((userInfo) => {
                    this.$toast.show('请假成功');
                    this.$lazyroute.replace('/leave');
                });
            },
            verification() {
                if(!this.dayNumber) {
                    this.$toast.show('请选择正确的请假时间');
                    return false;
                }
                if(this.reason == '') {
                    this.$toast.show('请输入申请理由');
                    return false;
                }
                return true;
            }
        },
        computed: {
            dayNumber() {
                var timeString = new Date(this.endTime) - new Date(this.startTime);
                if(isNaN(timeString) || timeString <= 0) {
                    return 0;
                }
                return (timeString/60/60/24/1000);
            }
        },
        filters: {
            format(val) {
                val = val.replace('T', ' ');
                return val.split('.')[0];
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
    .page-leave {
        .cell div[slot=title] {
            height: 100%;
            input {
                height: 100%;
            }
        }
        .textarea {
            height: 80%;
            textarea {
                width: 100%;
            }
        }
        .apply-person {
            div[slot=title] i{
                display: block;
                .wh(.8rem);
                .background-img('rzjsr@2x.png');
                margin-top: .33333333rem; // 25px 
            }
        }
        #j-start-time, #j-end-time {
            width: 100%;
            height: 50px;
            position: absolute;
            top: -100%;
        }
    }
</style>