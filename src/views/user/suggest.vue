
<template>
    <page-title title="提交意见或建议"></page-title>
    <div class="page page-add-integral">
        <text-card
        title="意见或建议"
        placeholder="请输入意见或建议"
        :value.sync="content"
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
                content: ''
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
                    content: this.content
                }];
                this.$xhr.handle('suggestion/sumbitSuggest', {
                    suggestion: JSON.stringify(param)
                })
                .then((userInfo) => {
                    this.$toast.show('提交成功');
                    this.$lazyroute.replace('/user');
                });
            },
            verification() {
                if(this.content == '') {
                    this.$toast.show('请输入意见或建议');
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