<template>
<div class="page"
    infinite-scroll-distance="100" 
    infinite-scroll-immediate-check="false"
    infinite-scroll-disabled="loadMoreBusy" 
    v-infinite-scroll="loadMore()">
    <div class="l-cell grid" v-for="item of list" v-link="{path: '/news/detail', query: {id: item.id}}">
        <img :src="item.listImg" alt="">
        <div class="l-text">
            <p class="l-title">{{item.title}}</p>
            <div class="l-time">{{item.createtime}}</div>
        </div>
    </div>
</template>

<script>
import PageTitle from 'components/PageTitle'
import EmptyTips from 'components/EmptyTips'
import LoadMore from 'components/LoadMore'
export default {
  data () {
    return {
        list: [],
        page: 1,
        loadMoreBusy: false,
        loadMoreEnd: false,
    };
  },
  components: {
      PageTitle,
      LoadMore,
      EmptyTips
  },
  methods: {
      loadMore() {
          this.$xhr.loadMore(this, 'message/getMessage', {
              userId: this.userId,
              page: this.page + 1
          })
          .then((list) => {
              this.list.push.apply(this.list, list);
          });
      },
      goDetail(id) {
          this.$router.go({path: '/message/detail', query: {id: id}});
      }
  },
  route: {
      data: async function() {
        await this.$xhr.getUserInfo();
        return this.$xhr.getData('news/getNews', {
            page: 1
        })
        .then((list) => {
            list.forEach((news)=>{
                news.listImg = this.$host.imgHost + news.listImg;
                return news;
            })
            this.$set('list', list)
        })
    }
  }
};
</script>

<style lang="less">
@import "~src/styles/mixin.less";

.l-cell {
    padding: .26666667rem 0;
    display: flex;
    border-bottom: 1px solid @bd-color;
    img {
        display: block;
        width: 3.46666667rem;  // 260px 
        height: 2.4rem;  // 180px
        margin-right: .4rem;  // 30px
    }
    .l-text {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-flow: column;
        padding: .13333333rem 0;  // 10px
        .l-title {
            flex: 1;
            width: 100%;
            font-size: @fs32;
            line-height: 1.3em;
            color: @c-666666;
        }
        .l-time {
            .line-height(@fs26);
            color: @c-999999;
        }
    }
}

</style>