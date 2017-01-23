<template>
	<page-title title="我的履历"></page-title>
	<div class="page page-user-resume" v-if="!$loadingRouteData">
		<user-item :name="userinfo.name" :img="userinfo.headImg|defaultHeadImg">
			<p class="fs-26 fs-gray pt10">部门：{{userinfo.department || '还未分配部门'}}</p>
		</user-item>
		<cell>
			<span slot="title">在职时间：{{userinfo.year || 0}} 年</span>
		</cell>
		<cell class="bg-gray">
			<span slot="title" class="fs-gray">奖励</span>
		</cell>

		<div class="reward-list">
			<div v-if="list.rewardList.length">
				<cell class="li-item" v-for="item of list.rewardList">
					<span class="text-overflow" slot="title">{{item.rewardName}}</span>
					<span slot="value" class="fs-gray fs-26">{{item.date}}</span>
				</cell>
			</div>
			<empty-tips text="暂无奖励纪录" v-if="!list.rewardList.length"></empty-tips>
		</div>
	</div>
</template>
<script>
	import Cell from 'components/Cell'
	import PageTitle from 'components/PageTitle'
	import UserItem from './user-item'
	import EmptyTips from 'components/EmptyTips'

    import { userinfo } from 'vx/getters'
	export default {
		data() {
			return {
				list: {}
			}
		},
		components: {
			Cell,
			PageTitle,
			UserItem,
			EmptyTips
		},
		route: {
		    data: async function() {
		    	await this.$xhr.getUserInfo();
		        return this.$xhr.getData('user/getResume', {
		            userId: this.userinfo.userId,
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
	.page-user-resume {
		display: flex;
		flex-direction: column;
		.li-item .title {
			width: 70%;
		}
		.reward-list {
			position: relative;
			flex: 1;
		}
	}
</style>