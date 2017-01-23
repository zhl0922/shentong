<template>
    <div class="page page-comment-detail">
      <v-article 
          :title="detail.title" 
          :meta="detail.createtime" 
          :content="detail.introduction" 
          v-if="!$loadingRouteData">
      </v-article>
    </div>
</template>

<script>
import vArticle from 'components/Article'
export default {
  
  data () {
    return {
        detail: {}
    }
  },
  components: {
    vArticle
  },
  route: {
    data: async function(transition) {
      await this.$xhr.getUserInfo();
        let query = transition.to.query;
        return this.$xhr.getData('notice/getNoticeDetail', {
            noticeId: query.id
        })
        .then((detail) => {
            this.$set('detail', detail)
        })
    }
  }
};
</script>

<style lang="css" scoped>
</style>