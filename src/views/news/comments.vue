<template>
<ul class="comments page" v-if="!$loadingRouteData">
    <li v-for="comment of comments">
        <div class="comment">
            <div class="comment-head">
                <div class="avatar">
                    <img :src="comment.headImg|defaultHeadImg">
                </div>
                <div class="meta-data">
                    <span>{{comment.username}}</span>
                    <span>{{comment.createtime}}</span>
                </div>
            </div>
            <div class="comment-body">
                {{comment.content}}
            </div>
        </div>
    </li>
</ul>
<div class="comment-input" v-if="!$loadingRouteData">
    <div class="grid">
        <v-input v-model="value" placeholder="输入你的想法" w="7.33333333rem"></v-input>
        <btn class="btn" @click="addComment">发送</btn>
    </div>
</div>
</template>

<script>
import { userinfo } from 'vx/getters'
import avatar from 'assets/paihangbang_touxiang@2x.png'
import vInput from 'components/Input'
import btn from 'components/Btn'
export default {
  data () {
    return {
        comments:[],
        value: '',
        page: 1,
        newsId:0
    };
  },
  components: {
    vInput,
    avatar,
    btn
  },
  route: {
    data: async function(transition) {
        await this.$xhr.getUserInfo();
        let query = transition.to.query;
        this.$set('newsId', query.newsId);
        return this.$xhr.getData('news/getNewsComment', {
            newsId: query.newsId,
            page: 1
        })
        .then((comments) => {
            this.$set('comments', comments)
        })
    }
  },
  methods: {
    addComment: async function() {
        if(!this.value) {
            this.$toast.show('请输入你的想法');
            return;
        }
        await this.$xhr.getUserInfo();
        let user = this.userinfo;
        // console.log(JSON.stringify(user));
        let comment = {
            userId: user.userId,
            // headImg: '/sdj.jpg',//user.headImg,
            newsId: this.newsId,
            content: this.value
        }
                this.$xhr.handle('news/comment', {
            newsComments: '[' + JSON.stringify(comment) + ']'
        })
        .then((data) => {
            let date = new Date();
            comment.username = user.name
            comment.createtime = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours() + ':'+ date.getMinutes() + ':' + date.getSeconds()
            comment.content = this.value
            // comment.headImg = '/sdj.jpg'
            this.comments.push( comment )
            this.toast('提交成功');
            setTimeout(function() {
                $('.comments').scrollTop(10000000);
            }, 0);
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
.comments {
    padding-bottom: 1.30666667rem;
    li {
        background-color: #fefefe;
        padding: .48rem .4rem; // 36px 30px
        border-bottom: 1px solid @c-cccccc;

        font-size: .37333333rem;  // 28px
        line-height: 1.5em;
        color: @c-666666;
    }
    .comment-head {
        display: flex;

        .avatar {
            width: 1.06666667rem;  // 80px
            height: 1.06666667rem;  // 80px
            margin-right: .4rem;  // 30px
            border-radius: 50% 50%;
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .meta-data {
            flex: 1;
            span {
                display: block;
                &:nth-of-type(1) {
                    font-size: .42666667rem;  // 32px
                    color: @c-666666;
                }
                &:nth-of-type(2) {
                    font-size: .34666667rem;  // 26px
                    color: @c-999999;
                }
            }
        }
    }

    .comment-body {
        padding-left: .4rem;
        padding-top: .4rem;
    }
}

.comment-input {
    .grid {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
    }
    width: 100%;
    height: 2rem; // 150px
    border-top: 1px solid @bd-color;
    background-color: @bg-color;
    input {
        margin-top: 0;
        height: 1.06666667rem; // 80px
        font-size: @fs28;
    }
    .btn {
        width: 1.46666667rem; // 110px
        height: .93333333rem; // 70px
        line-height: .93333333rem; // 70px
        font-size: @fs28;
    }
    button {
        width: 1.6rem;  // 120px
        font-size: .42666667rem;  // 32px
        line-height: 1em;
        color: @orange;
    }
}
</style>