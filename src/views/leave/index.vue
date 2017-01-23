<template>
    <page-title title="请假"></page-title>
    <div class="page page-leave"
    infinite-scroll-distance="100" 
    infinite-scroll-immediate-check="false"
    infinite-scroll-disabled="loadMoreBusy" 
    v-infinite-scroll="loadMore()">
        <div v-if="!$loadingRouteData && list.length">
            <cell h="1.73333333rem" v-for="item of list">
                <div slot="title">
                    <p class="fs-black">{{item.department || '还未分配部门'}}</p>
                    <p class="fs-gray text-overflow fs-26">( {{item.status | status}} )</p>
                </div>
                <span class="fs-gray fs-26" slot="value">{{item.createtime}}</span>
            </cell>
        </div>
        <empty-tips v-if="!$loadingRouteData && !list.length"></empty-tips>
        <load-more v-lazy="500" v-show="loadMoreBusy"></load-more>
    </div>
    <div class="bottom bg-white bt">
      <btn link="/leave/ask">请 假</btn>
    </div>
  
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import Cell from 'components/Cell'
    import Btn from 'components/Btn'
    import LoadMore from 'components/LoadMore'
    import EmptyTips from 'components/EmptyTips'

    import { userinfo } from 'vx/getters'
    export default {
        data() {
            return {
                list: [],
                page: 1,
                loadMoreBusy: false,
                loadMoreEnd: false,
            }
        },
        components: {
            PageTitle,
            Cell,
            Btn,
            EmptyTips,
            LoadMore
        },
        methods: {
            loadMore() {
                this.$xhr.loadMore(this, 'leave/getLeaveInfo', {
                    userId: this.userinfo.userId,
                    page: this.page + 1
                })
                .then((list) => {
                    this.list.push.apply(this.list, list);
                });
            }
        },
        route: {
            data: async function(transition) {
                await this.$xhr.getUserInfo();
                let query = transition.to.query;
                return this.$xhr.getData('leave/getLeaveInfo', {
                    userId: this.userinfo.userId,
                    page: 1
                })
                .then((list) => {
                    this.$set('list', list);
                });
            }
        },
        filters: {
            status(val) {
                var status = '';
                switch (val) {
                    case -1:
                        status = '不同意'
                        break;
                    case 0:
                        status = '上级领导审核中'
                        break;
                    case 1:
                        status = '同意'
                        break;
                }
                return status;
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
        .textarea {
            height: 80%;
            textarea {
                width: 100%;
            }
        }
        .fs-black {
            line-height: .6rem; // 45px
        }
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