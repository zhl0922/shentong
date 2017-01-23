
<template>
    <page-title title="周报详情"></page-title>
    <div class="page page-note-detail" v-if="!$loadingRouteData">
        <user-item>
            <p class="fs-26 fs-gray pt10">{{list.createtime}}</p>
        </user-item>
        <text-card
        title="简介"
        :value="list.introduction"
        :disabled="true"></text-card>
        
        <text-card
        title="本周完成工作"
        :value="list.finishedwork"
        :disabled="true"></text-card>

        <text-card
        title="本周工作总结"
        :value="list.summary"
        :disabled="true"></text-card>

        <text-card
        title="下周工作计划"
        :value="list.nextweekplan"
        :disabled="true"></text-card>
            
        <text-card
        title="遇到的问题"
        :value="list.problems"
        :disabled="true"></text-card>
    </div>
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import TextCard from './text-card'
    import UserItem from '../user/user-item'

    export default {
    	data() {
    		return {
    			list: {}
    		}
    	},
        components: {
            PageTitle,
            TextCard,
            UserItem
        },
        methods: {
        	
        },
        route: {
            data: async function(transition) {
                await this.$xhr.getUserInfo();
                let query = transition.to.query;
                return this.$xhr.getData('report/getWeekReportDetail', {
                    diaryId: query.id
                })
                .then((list) => {
                    this.$set('list', list);
                });
            }
        }
    }
</script>