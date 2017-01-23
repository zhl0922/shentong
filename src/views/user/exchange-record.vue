<template>
	<page-title title="兑换记录"></page-title>
	<div class="page page-user-exchange"
	infinite-scroll-distance="100" 
	infinite-scroll-immediate-check="false"
	infinite-scroll-disabled="loadMoreBusy" 
	v-infinite-scroll="loadMore()">
		<ul v-if="!$loadingRouteData && list.length">
			<li class="mb20" v-for="item of list">
				<cell class="bt">
					<span slot="title" class="fs-26">订单编号：{{item.orderNum}}</span>
					<span slot="value" class="fs-gray fs-24">{{item.createtime}}</span>
				</cell>
				<cell class="list-goods" h="3.46666667rem">
					<div slot="title" style="width:5.33333333rem;">
						<img class="list-img" :src="item.listImg|img">
						<div>
							<p class="fs-32">{{item.goodsName}}</p>
							<p class="fs-26 fs-gray pt30">点券数：<span class="fs-orange">{{item.point}}</span></p>
						</div>
					</div>
					<span class="fs-26 fs-gray" slot="value">×{{item.totalNum}}</span>
				</cell>
			</li>
		</ul>
		<empty-tips text="暂无兑换记录" v-if="!$loadingRouteData && !list.length"></empty-tips>
		<load-more v-lazy="500" v-show="loadMoreBusy"></load-more>
	</div>
</template>
<script>
	import Cell from 'components/Cell'
	import PageTitle from 'components/PageTitle'
	import UserItem from './user-item'
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
			Cell,
			PageTitle,
			UserItem,
			LoadMore,
			EmptyTips
		},
		methods: {
		    loadMore() {
		        this.$xhr.loadMore(this, 'goods/getExchangeRecords', {
		            userId: this.userinfo.userId,
		            page: this.page + 1
		        })
		        .then((list) => {
		            this.list.push.apply(this.list, list);
		        });
		    }
		},
		route: {
		    data: async function() {
		    	await this.$xhr.getUserInfo();
		        return this.$xhr.getData('goods/getExchangeRecords', {
		            userId: this.userinfo.userId,
		            page: 1
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
	.page-user-exchange {
		.list-goods {
			img {
				.wh(2.66666667rem);
				margin-right: .4rem; // 30px
			}
			div[slot=title] {
				display: flex;
				align-items: center;
			}
		}

	}
</style>