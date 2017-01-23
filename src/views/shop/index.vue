<template>
    <page-title title="商城"></page-title>
    <div class="page page-shop"
        infinite-scroll-distance="100" 
        infinite-scroll-immediate-check="false"
        infinite-scroll-disabled="loadMoreBusy" 
        v-infinite-scroll="loadMore()">
        <ul class="overflow-hidden" v-if="!$loadingRouteData">
            <li class="bb fl" v-for="item of list">
                <a class="tap-active" href="javascript:;" v-link="{path: '/shop/detail', query: {id: item.id}}">
                    <img class="pt30" :src="item.listImg|img">
                    <p class="fs-black pt30">{{item.name}}</p>
                    <p class="fs-gray fs-26 pt10">点券数：<span class="fs-orange">{{item.point}}</span></p>
                </a>
            </li>

        </ul>
        <empty-tips v-if="!$loadingRouteData && !list.length"></empty-tips>
        <load-more v-lazy="500" v-show="loadMoreBusy"></load-more>
    </div>
    <v-footer></v-footer>
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import vFooter from 'components/Footer'
    import EmptyTips from 'components/EmptyTips'
    import LoadMore from 'components/LoadMore'
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
            vFooter,
            PageTitle,
            EmptyTips,
            LoadMore
        },
        methods: {
            loadMore() {
                this.$xhr.loadMore(this, 'goods/getGoods', {
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
                return this.$xhr.getData('goods/getGoods', {
                    page: 1
                })
                .then((list) => {
                    this.$set('list', list);
                });
            }
        }
    }
</script>
<style lang="less">
    @import '~src/styles/mixin.less';
    .page-shop {
        li {
            width: @body-w/2;
            height: 6.4rem; // 480px
            box-sizing: border-box;
            &:nth-of-type(2n+1) {
                border-right: solid 1px @bd-color;
            }
            a {
                display: flex;
                height: 100%;
                flex-direction: column;
                align-items: center;
                img {
                    width: 4.26666667rem; // 320px
                    height: 4rem; // 300px
                }
                p {
                    width: 4.26666667rem; // 320px
                }
            }
        }
    }
</style>