<template>
	<page-title title="任务详情"></page-title>
	<div class="page page-task-detail mt20">
		<ul class="grid fs-28 fs-gray radius10 bd bg-white" v-if="!$loadingRouteData">
			<li class="bb">
				<div class="td fs-gray-plus">任务名称</div>
				<div class="th fs-gray">{{list.taskName}}</div>
			</li>
			<li class="bb">
				<div class="td fs-gray-plus">任务截止时间</div>
				<div class="th fs-gray">{{list.deadline}}</div>
			</li>
			<li class="bb">
				<div class="td fs-gray-plus">受指派部门</div>
				<div class="th fs-gray">{{list.department}}</div>
			</li>
			<li class="bb">
				<div class="td fs-gray-plus">任务负责人</div>
				<div class="th fs-gray task-person">
					<p>{{list.chargeUserPosition}}</p>
					<p>{{list.chargeUserName}}</p>
					<p>{{list.chargeUserPhone}}</p>
				</div>
			</li>
			<li class="bb">
				<div class="td fs-gray-plus">任务具体内容</div>
				<div class="th fs-gray">{{list.content}}</div>
			</li>
			<li class="bb">
				<div class="td fs-gray-plus">奖罚情况</div>
				<div class="th fs-gray">{{list.reward}}</div>
			</li>
			<li class="bb">
				<div class="td fs-gray-plus">完成情况</div>
				<div class="th fs-gray">{{list.status | completeStatus}}</div>
			</li>
			<li class="bb" v-if="list.evaluation">
				<div class="td fs-gray-plus">评价内容</div>
				<div class="th fs-gray">{{list.evaluation}}</div>
			</li>
			<li class="bb">
				<div class="td fs-gray-plus">填写完成情况</div>
				<div class="th fs-gray">
					<textarea :value="list.completion" v-model="completion" class="fs-30 bg-white fs-gray radius10" :disabled="!isStatus0"></textarea>
				</div>
			</li>
		</ul>
	</div>
	<div class="bottom bg-white bt" v-if="!$loadingRouteData && isStatus0">
		<btn @click="handleSubmit">提 交</btn>
	</div>
</template>
<script>
	import PageTitle from 'components/PageTitle'
	import Btn from 'components/Btn'
	export default {
		data() {
			return {
				completion: '',
				taskId: 0,
				list: null
			}
		},
		computed: {
			isStatus0() {
				return this.list.status == 0 ? true : false;
			}
		},
		components: {
			PageTitle,
			Btn
		},
		methods: {
			handleSubmit: async function() {
				if(this.completion == '') {
					this.$toast.show('请填写完成情况');
					return;
				}
				await this.$xhr.getUserInfo();
				this.$xhr.handle('task/completeTask', {
					id: this.taskId,
					completion: this.completion
				})
				.then((list) => {
				    this.$toast.show('提交成功');
				    this.$lazyroute.replace('/task');
				});
			}
		},
		route: {
			data: async function(transition) {
				this.taskId = transition.to.query.id;
				await this.$xhr.getUserInfo();
				return this.$xhr.getData('task/getTaskById', {
				    id: this.taskId
				})
				.then((list) => {
				    this.$set('list', list);
				});
			}
		},
		filters: {
			completeStatus(status) {
				switch (status) {
					case 0:
						return '未完成'
						break;
					case 1:
						return '待评价'
						break;
					case 2:
						return '已完成'
						break;
				}
			}
		}
	}
</script>
<style lang="less">
	@import '~src/styles/mixin.less';
	.page-task-detail {
		li {
			display: flex;
			.td, .th {
				display: flex;
				padding: .26666667rem; // 20px
				align-items: center;
				justify-content: center;
			}
			.td {
				flex: 2;
			}
			.th {
				flex: 4;
				border-left: 1px solid @bd-color;
				line-height: .66666667rem; // 50px
				&.task-person {
					flex-direction: column;
				}
			}
			&:last-of-type {
				border-bottom: none;
			}
			textarea {
				flex: 1;
				resize: none;
				height: 3.06666667rem; // 230px
				&::-webkit-input-placeholder {
				    color: @c-999999;
				}
			}
		}
	}
</style>