
<template>
    <page-title title="申请加分"></page-title>
    <div class="page page-add-integral">
        <text-card
        title="申请理由"
        placeholder="请输入申请理由"
        :value.sync="reason"
        v-if="!$loadingRouteData"></text-card>
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
            handleSubmit: async function() {
                if(!this.verification()) return;
                await this.$xhr.getUserInfo();
                let param = [{
                    userId: this.userinfo.userId,
                    reason: this.reason,
                    departmentId: this.userinfo.departmentId
                }];
                this.$xhr.handle('integral/apply', {
                    integralApply: JSON.stringify(param)
                })
                .then((userInfo) => {
                    this.$toast.show('申请成功，等待审核');
                    this.$lazyroute.replace('/');
                });
            },
            verification() {
                if(this.reason == '') {
                    this.$toast.show('请输入申请理由');
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
</style>