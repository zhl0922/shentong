<template>
    <div class="page page-comment-detail">
        <v-article 
            :title="news.title" 
            :meta="news.createtime" 
            :content="news.content"
            v-if="!$loadingRouteData">
        </v-article>
    </div>   
    <div class="btn-container bg-white">
        <a class="fav tap-active" @click="changeLike" href="javascript:;">
            <img :src="likedImg" alt="">{{news.likenums}}
        </a>
        <a class="comment tap-active" v-link="{path: './comments', query: {newsId: news.id}}" href="javascript:;">
            <img src="~src/assets/zixun_pinglun@2x.png" alt="">评论
        </a>
    </div>
</template>

<script>
import vArticle from 'components/Article'
import { userinfo } from 'vx/getters'
import heart from 'assets/zixun_dianzan_nor@3x.png';
import heartFill from 'assets/zixun_dianzan_sel@3x.png';
export default {
  data () {
    return {
        news: {},
        newsId: 0,
        liked: 0
    }
  },
  computed: {
    likedImg: function() {
        return this.liked ? heartFill : heart;
    },
    user: function() {
        return this.userinfo;
    }
  },
  components: {
    vArticle,
  },
  route: {
    data: async function(transition) {
        await this.$xhr.getUserInfo();
        let query = transition.to.query;
        this.$set('newsId', query.id);
        return this.$xhr.getData('news/getNewsDetail', {
            newsId: query.id,
            userId: this.user.userId
        })
        .then((detail) => {
            this.$set('liked', detail.hasLike);
            this.$set('news', detail);
        })
    }
  },
  methods: {
    changeLike: async function() {
        await this.$xhr.getUserInfo();
        const user = this.user;
        this.$xhr.handle('news/clickNewsLike', {
            newsLikes: '['+JSON.stringify({userId: user.userId,newsId: this.newsId})+']',
            hasLike: Number(!this.liked)
        })
        .then((data) => {
            if(this.liked) {
                this.news.likenums -= 1;
            }else {
                this.news.likenums += 1;
            }
            this.$set('liked', !this.liked);
        })
    }
  },
  vuex: {
    getters: {
        userinfo
    }
  }
};
</script>

<style lang="less">
@import '~src/styles/mixin.less';
.btn-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    height: 1.30666667rem; // 98px
    border-top: 1px solid #e0e0e0;
    font-size: .37333333rem; // 28px
    color: #999;

    a {
        color: #999;
    }
    .fav, .comment {
        flex: 1;
        text-align: center;
        line-height: 1.30666667rem; // 98px
        img {
            display: inline-block;
            width: .66666667rem;  // 50px
            height: .66666667rem;  // 50px
            vertical-align: middle;
            margin-right: .10666667rem;  // 8px
        }
    }
    .comment > img {
        width: .73333333rem;
        height: .73333333rem;  // 55px
    }
}
</style>