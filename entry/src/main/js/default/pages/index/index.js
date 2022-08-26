import IAP from "../HMSIAP2.js"
export default {
    data: {
        title: "",
    },
    onInit() {
//        let result = IAP.isEnvReady();
//        let result = IAP.obtainOwnedPurchases();
//        let result = IAP.obtainProductInfo(["HuaweiPayTestGoods1"]);
        let result = IAP.createPurchaseIntent("HuaweiPayTestGoods2","qiwuid");
        this.title = this.$t('strings.world');

    }
}
