<template>
    <page-title title="福利详情"></page-title>
    <div class="page page-welfare-detail">
        <div v-if="!$loadingRouteData">
            <div class="banner">
                <img :src="list.listImg|img">
            </div>
            <cell>
                <span class="fs-36 fs-black">
                    积分数：<span class="fs-orange">{{list.integral}}</span>
                </span>
                <span style="padding-left: .2rem;" class="fs-24 fs-gray">(我的积分：{{userinfo.integral}})</span>
            </cell>
            <cell class="bg-gray fs-30" h="1.25333333rem" title="福利详情"></cell>
            <div class="detail-text bg-white fs-30 fs-gray-plus bd">
                <div class="grid">
                    {{list.title}}
                </div>
            </div>
            <cell class="bg-gray fs-30" h="1.25333333rem" title="申请条件"></cell>
            <div class="detail-text bg-white fs-30 fs-gray-plus bd">
                <div class="grid">
                    {{list.requirement}}
                </div>
            </div>
        </div>
    </div>
    <div class="bottom bg-white bt">
        <btn @click="handleSubmit">申 请</btn>
    </div>
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import LoadMore from 'components/LoadMore'
    import Cell from 'components/Cell'
    import Btn from 'components/Btn'
    
    import { setuserinfo } from 'vx/actions'
    import { userinfo } from 'vx/getters'
    import deepcopy from 'deepcopy'
    export default {
        data() {
            return {
                list: {},
                welfareId: 0
            }
        },
        components: {
            PageTitle,
            LoadMore,
            Cell,
            Btn
        },
        methods: {
            handleSubmit: async function() {
                await this.$xhr.getUserInfo();
                this.$xhr.handle('welfare/applyWelfare', {
                    userId: this.userinfo.userId,
                    welfareId: this.welfareId
                })
                .then(() => {
                    let userinfo = deepcopy(this.userinfo);
                    this.$toast.show('申请成功，扣除积分 ' + this.list.integral);
                    userinfo.integral = userinfo.integral - this.list.integral;
                    this.setuserinfo(userinfo);
                });
            }
        },
        route: {
            data: async function(transition) {
                await this.$xhr.getUserInfo();
                this.welfareId = transition.to.query.id;
                return this.$xhr.getData('welfare/getWelfareDetail', {
                    welfareId: this.welfareId
                })
                .then((list) => {
                    this.$set('list', list);
                });
            }
        },
        vuex: {
            actions: {
                setuserinfo
            },
            getters: {
                userinfo
            }
        }
    }
</script>
<style lang="less">
    @import '~src/styles/mixin.less';
    .page-welfare-detail {
        .detail-text {
            padding: .26666667rem 0;
            line-height: .6rem; // 45px
            letter-spacing: 1px;
        }
    }
</style>