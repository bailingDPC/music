<template>
    <div>
        推荐页面
        {{msg}}
    </div>
</template>
<script>
import axios from "axios"
export default {
    data(){
        return {
            msg: null
        }
    },
    beforeCreate(){//在组件创造数据前请求数据，避免白屏等待
        axios.get("http://localhost:9527/api/recommenddata").then((data) => {
            // eslint-disable-next-line no-console
            console.log(data.data);
            this.msg = data.data;
        })

    }
}
</script>

<style lang="stylus" scoped>

</style>