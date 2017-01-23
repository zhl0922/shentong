
<template>
    <page-title title="发布周报"></page-title>
    <div class="page page-release">
        <div v-if="!$loadingRouteData">
            <text-card
            title="简介"
            placeholder="请输入简介"
            :value.sync="introduction"></text-card>

            <text-card
            title="本周完成工作"
            placeholder="请输入本周完成工作"
            :value.sync="finishedwork"></text-card>

            <text-card
            title="本周工作总结"
            placeholder="请输入本周工作总结"
            :value.sync="summary"></text-card>

            <text-card
            title="下周工作计划"
            placeholder="请输入下周工作计划"
            :value.sync="nextweekplan"></text-card>
                
            <text-card
            title="遇到的问题"
            placeholder="请输入遇到的问题"
            :value.sync="problems"></text-card>
        </div>
    </div>
    <div class="bottom bg-white bt">
    	<btn @click="handleSubmit">提 交</btn>
    </div>
	
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import vFooter from 'components/Footer'
    import Cell from 'components/Cell'
    import Btn from 'components/Btn'
    import TextCard from './text-card'
    
    import { userinfo } from 'vx/getters'
    export default {
    	data() {
    		return {
    			introduction: '',
                finishedwork: '',
                summary: '',
                problems: '',
                nextweekplan: ''
    		}
    	},
        components: {
            PageTitle,
            vFooter,
            Cell,
            Btn,
            TextCard
        },
        methods: {
        	handleSubmit: async function() {
                if(!this.verification()) return;
                await this.$xhr.getUserInfo();
                let param = [{
                    userId: this.userinfo.userId,
                    introduction: this.introduction,
                    finishedwork: this.finishedwork,
                    summary: this.summary,
                    problems: this.problems,
                    nextweekplan: this.nextweekplan
                }];
                this.$xhr.handle('report/publishWeekReport', {
                    weekReport: JSON.stringify(param)
                })
                .then((userInfo) => {
                    this.$toast.show('发布成功');
                    this.$lazyroute.replace('/note');
                });
            },
            verification() {
                if(this.introduction == '') {
                    this.$toast.show('请输入简介');
                    return false;
                }
                if(this.finishedwork == '') {
                    this.$toast.show('请输入本周完成工作');
                    return false;
                }
                if(this.summary == '') {
                    this.$toast.show('summary');
                    return false;
                }
                if(this.nextweekplan == '') {
                    this.$toast.show('请输入下周工作计划');
                    return false;
                }
                if(this.problem == '') {
                    this.$toast.show('请输入遇到的问题');
                    return false;
                }
                return true;
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
    .page-release {
        .apply-person {
            div[slot=title] i{
                display: block;
                .wh(.8rem);
                .background-img('rzjsr@2x.png');
                margin-top: .33333333rem; // 25px 
            }
        }
    }
</style>