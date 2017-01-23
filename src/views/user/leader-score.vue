<template>
    <page-title title="给领导打分"></page-title>
    <div class="page page-leader-score" v-if="!$loadingRouteData && list.length">
        <div class="leader-score bg-white bd">
            <div class="grid">
                <p class="fs-34 fs-black mb20 mt20">{{currentData.question}}</p>
                <label for="radio_{{$index}}" v-for="item of currentData.questionItems">
                    <span class="fs-30 fs-gray-plus">A.{{item.item}}</span>
                    <input id="radio_{{$index}}" type="radio" name="answer-pick" :value="item.score" v-model="currentAswer">
                </label>
            </div>
        </div>
        <div class="grid mt50">
            <btn @click="nextQuestion">{{btnText}}</btn>
        </div>
    </div>
</template>
<script>
    import PageTitle from 'components/PageTitle'
    import Btn from 'components/Btn'
    import EmptyTips from 'components/EmptyTips'

    import { userinfo } from 'vx/getters'
    export default {
        data() {
            return {
                btnText: '下一题',
                list: [],
                currentIndex: 0,
                currentAswer: 0,
                totalPoint: 0,
                superiorUserId: 0
            }
        },
        components: {
            PageTitle,
            Btn,
            EmptyTips
        },
        methods: {
            nextQuestion() {
                if(this.currentAswer == 0) {
                    this.$toast.show('请选择答案');
                    return;
                }
                if(this.btnText =='提交打分') {
                    this.handleSubmit();
                }else {
                    if(this.list.length - 2 == this.currentIndex) {
                        this.btnText = '提交打分';
                    }
                    this.currentIndex += 1;
                    this.totalPoint += this.currentAswer;
                    this.currentAswer = 0;
                }
            },
            handleSubmit: async function() {
                await this.$xhr.getUserInfo();
                let param = [{
                    userId: this.userinfo.userId,
                    superiorUserId: this.superiorUserId,
                    totalPoint: this.totalPoint
                }];
                this.$xhr.handle('mark/submitMark', {
                    score: JSON.stringify(param)
                })
                .then((userInfo) => {
                    this.$toast.show('打分成功');
                    this.$lazyroute.replace('/user');
                });
            }
        },
        computed: {
            currentData() {
                let list = this.list[this.currentIndex];
                return list;
            }
        },
        route: {
            data: async function(transition) {
                await this.$xhr.getUserInfo();
                this.superiorUserId = transition.to.query.s;
                return this.$xhr.getData('mark/giveMark', {
                    userId: this.userinfo.userId,
                    superiorUserId: this.superiorUserId,

                })
                .then((list) => {
                    if(!list.length) {
                        this.$toast.show('暂无可以打分的题目');
                        this.$lazyroute.replace('/user');
                    }
                    this.$set('list', list);
                })
                .catch(() => {
                    this.$lazyroute.replace('/user');
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
    .page-leader-score {
        .leader-score {
            padding: .26666667rem; // 20px
            label {
                height: .93333333rem; // 70px
                display: flex;
                align-items: center;
                span {
                    flex: 1;
                }
            }
            input {
                display: block;
                .wh(.42666667rem);
                .background-img('xuanze_nor@3x.png');
                &:checked {
                    .background-img('xuanze_sel@3x.png');
                }
            }
        }
    }
</style>