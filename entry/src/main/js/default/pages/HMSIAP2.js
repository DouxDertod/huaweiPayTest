import HMSIAP from '@hw-hmscore/hms-iap';


export default{
    //发起购买意图
    //productId 商品id
    //developerPayload 商户侧保留信息， 约定为齐悟订单id
    //priceType 商品类型 默认为消耗型商品 priceType: 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
    createPurchaseIntent(productId,developerPayload,priceType=0){
        this.isEnvReady(()=> {
            const reservedInfo = {
             "key1": "value1"
            }
            const purchaseIntentReq = {
             productId: productId,
             priceType: priceType,
             developerPayload: developerPayload,
             reservedInfor: JSON.stringify(reservedInfo)
            }
            HMSIAP.createPurchaseIntent(purchaseIntentReq)
             .then((res) => {
                 console.info(JSON.stringify(res))
                 return res;
             })
             .catch((err) => {
                 console.info(err)
             });
         })
    },


    //判断是否支持应用内支付
    isEnvReady(cb){
        HMSIAP.isEnvReady()
            .then((res) => {
                console.info(JSON.stringify(res))
                if (res.data.returnCode == 0) {
                    console.info("Environment ready")
                    return cb();
                } else {
                    console.info("支付环境错误:"+res.data.returnCode)
                }
            })
            .catch((err) => {
                console.info(JSON.stringify(err))
            });
    },


    //展示商品信息
    //skuIds 商品id队列
    //priceType 商品类型 默认为消耗型商品   priceType: 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
    obtainProductInfo(skuIds,priceType=0){
//        先判断是否支持应用内支付
        this.isEnvReady(()=>{
            //获取商品信息
            const productInfoReq = {
                // 查询的商品必须是您在AppGallery Connect网站配置的商品
                skuIds: skuIds,
                // priceType:
                //    HMSIAP.PriceType.IN_APP_CONSUMABLE：消耗型商品;
                //    HMSIAP.PriceType.IN_APP_NONCONSUMABLE：非消耗型商品;
                //    HMSIAP.PriceType.IN_APP_SUBSCRIPTION：订阅型商品;
                priceType: priceType
            }
            HMSIAP.obtainProductInfo(productInfoReq)
                .then((res) => {
                    // 获取接口请求成功时返回的商品详情信
                    console.info(JSON.stringify(res))
                    return res;
                })
                .catch((err) => {
                    console.info(JSON.stringify(err))
                });
        })

    },


    //确认交易 只有非消耗型产品需要调用
    //developerChallenge 您自定义的挑战字，唯一标识此次消耗请求。消耗成功后此挑战字会记录在购买数据中并返回
    //purchaseToken   用户购买商品的标识，在支付完成时由华为应用内支付服务器生成。
    consumeOwnedPurchase(developerChallenge,purchaseToken){
        this.isEnvReady(()=>{
            const consumeOwnedPurchaseReq = {
                developerChallenge: developerChallenge,
                purchaseToken:purchaseToken
            }
            HMSIAP.consumeOwnedPurchase(consumeOwnedPurchaseReq)
                .then((res) => {
                    console.info(JSON.stringify(res))
                })
                .catch((err) => {
                    console.info(JSON.stringify(err))
                });
        })
    },


    // 消耗型商品补单
//    你需要在以下场景触发补单机制：
//    应用启动时。
//    购买请求返回-1（ORDER_STATE_FAILED）时。
//    购买请求返回60051（ORDER_PRODUCT_OWNED）时。
//priceType 商品类型 默认为消耗型商品   priceType: 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
    obtainOwnedPurchases(priceType=0){
        this.isEnvReady(()=> {
            const ownedPurchasesReq = {
                // priceType: 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
                priceType: priceType
            }
            // 调用obtainOwnedPurchases接口会获取所有已购但未发货的消耗型商品的购买信息
            HMSIAP.obtainOwnedPurchases(ownedPurchasesReq)
                .then((res) => {
                    // 获取成功
                    if (res.data.returnCode == 0) {
                        if (!res.data.inAppPurchaseDataList.length) {
                            console.info("inAppPurchaseDataList null");
                            return;
                        }
                        return res;

                    }
                })
                .catch((err) => {
                    console.info(err)
                });
        })
    },


}
