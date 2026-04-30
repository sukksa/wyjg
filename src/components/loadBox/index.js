import { Loading } from 'element-ui';
import loadImg from "@/assets/index/load.gif"
export default {
    name: "loadBox",
    computed: {
        showLoading() {
            return this.$store.state.showLoading;
        }
    },
    data() {
        return {
            loadImg,
            loadingInstance: null
        }
    },
    watch: {
        showLoading(val) {
            // if (val) {
            //     this.loadingInstance = Loading.service({fullscreen: true, background: 'rgba(0,0,0,0)'})
            // } else {
            //     if (this.loadingInstance != null) {
            //         this.loadingInstance.close();
            //     }
            // }
        }
    }
}