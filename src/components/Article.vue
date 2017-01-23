<template>
    <article class="news">
        <h1>{{title}}</h1>
        <p class="meta">{{meta}}</p>
        <div class="content" :class="{'underline': underline}">{{{content}}}</div>
    </article>
</template>

<script>
export default {
  props: {
    title: String,
    meta: String,
    content: String,
    underline: Boolean
  }
};
</script>

<style lang="less">
@import '~src/styles/mixin.less';
.news {
    margin: .53333333rem .26666667rem 0;  // 40px 20px 0;
    h1 {
        font-size: .48rem; // 36px
        font-weight: bold;
        color: #333;
        text-align: center;
    }
    .meta {
        font-size: .34666667rem;  // 26px
        color: #999;
        text-align: center;
        line-height: 1.5em;
        margin-top: .4rem; // 30px
    }
    .content {
        font-size: .42666667rem; // 32px
        color: #666;
        text-indent: 2em;
        line-height: 1.5em;
        margin-top: .4rem;  // 30px
    }
    .underline {
        text-decoration: underline;
        line-height: 1.06666667rem; // 80px
    }
}
</style>