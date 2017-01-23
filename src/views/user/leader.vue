<template>
    <page-title title="给领导打分"></page-title>
    <div class="page page-leader" v-if="!$loadingRouteData">
        <div class="leader bg-white bd">
            <img :src="userInfo.headImg|defaultHeadImg">
            <p class="fs-32 fs-gray-plus pt20">{{list.superiorUserName}}</p>
            <p class="fs-26 fs-gray pt10">{{userinfo.department}}</p>
        </div>
        <div class="grid mt50">
            <btn @click="handleClick">给领导打分</btn>
        </div>
    </div>
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import Btn from 'components/Btn'

    import { userinfo } from 'vx/getters'
    export default {
        data() {
            return {
                list: {}
            }
        },
        components: {
            PageTitle,
            Btn
        },
        methods: {
            handleClick: async function() {
                await this.$xhr.getUserInfo();
                return this.$xhr.getData('mark/giveMark', {
                    userId: this.userinfo.userId,
                    superiorUserId: this.userinfo.superiorUserId
                })
                .then((list) => {
                    if(!list.length) {
                        this.toast('暂无可以打分的题目');
                    }
                    this.$router.go({path: '/user/leaderScore'});
                });
                
            }
        },
        route: {
            data: async function() {
                await this.$xhr.getUserInfo();
                return this.$xhr.getData('user/getSuperiorUser', {
                    userId: this.userinfo.userId
                })
                .then((list) => {
                    this.$set('list', list);
                });
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
    .page-leader {
        .leader {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 4.26666667rem; // 320px
            img {
                .wh(1.6rem);
                border-radius: 50%;
            }
        }
    }
</style>