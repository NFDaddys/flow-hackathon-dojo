"use strict";
exports.id = 387;
exports.ids = [387];
exports.modules = {

/***/ 387:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "vP": () => (/* binding */ Web3ContextProvider),
  "Z_": () => (/* binding */ useWeb3Context)
});

// UNUSED EXPORTS: Web3Context

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "@onflow/fcl"
var fcl_ = __webpack_require__(820);
;// CONCATENATED MODULE: ./src/constants/networks.ts
const FLOW_ENV = process.env.NEXT_PUBLIC_FLOW_ENV || "testnet";
const NETWORKS = {
    emulator: {
        flowNetwork: "local",
        accessApi: process.env.NEXT_PUBLIC_EMULATOR_API || "http://localhost:8888",
        walletDiscovery: "https://fcl-discovery.onflow.org/local/authn",
        walletDiscoveryApi: "https://fcl-discovery.onflow.org/api/local/authn",
        walletDiscoveryInclude: [],
        addresses: {
            FlowToken: "0x0ae53cb6e3f42a79",
            NonFungibleToken: "0x0ae53cb6e3f42a79",
            MetadataViews: "0x0ae53cb6e3f42a79",
            FungibleToken: "0xee82856bf20e2aa6"
        }
    },
    testnet: {
        flowNetwork: "testnet",
        accessApi: "https://rest-testnet.onflow.org",
        walletDiscovery: "https://fcl-discovery.onflow.org/testnet/authn",
        walletDiscoveryApi: "https://fcl-discovery.onflow.org/api/testnet/authn",
        walletDiscoveryInclude: [
            "0x82ec283f88a62e65"
        ],
        addresses: {
            FlowToken: "0x7e60df042a9c0868",
            NonFungibleToken: "0x631e88ae7f1d7c20",
            MetadataViews: "0x631e88ae7f1d7c20",
            FungibleToken: "0x9a0766d93b6608b7"
        }
    },
    mainnet: {
        flowNetwork: "mainnet",
        accessApi: "https://rest-mainnet.onflow.org",
        walletDiscovery: "https://fcl-discovery.onflow.org/authn",
        walletDiscoveryApi: "https://fcl-discovery.onflow.org/api/authn",
        walletDiscoveryInclude: [
            "0xead892083b3e2c6c"
        ],
        addresses: {
            FlowToken: "0x1654653399040a61",
            NonFungibleToken: "0x1d7e57aa55817448",
            MetadataViews: "0x1d7e57aa55817448",
            FungibleToken: "0xf233dcee88fe0abe"
        }
    }
};
const NETWORK = NETWORKS[FLOW_ENV];
const getNetwork = (flowEnv = "testnet")=>NETWORKS[flowEnv];

// EXTERNAL MODULE: ./src/constants/routes.ts
var routes = __webpack_require__(516);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(853);
var router_default = /*#__PURE__*/__webpack_require__.n(router_);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(689);
// EXTERNAL MODULE: external "@onflow/fcl-wc"
var fcl_wc_ = __webpack_require__(345);
;// CONCATENATED MODULE: ./src/flow/web3.tsx







const Web3Context = /*#__PURE__*/ (0,external_react_.createContext)({});
const useWeb3Context = ()=>{
    const context = (0,external_react_.useContext)(Web3Context);
    if (context === undefined) {
        throw new Error("useWeb3Context must be used within a Web3ContextProvider");
    }
    return context;
};
const Web3ContextProvider = ({ children  })=>{
    const [user, setUser] = (0,external_react_.useState)({
        loggedIn: null,
        addr: ""
    });
    const [transactionInProgress, setTransactionInProgress] = (0,external_react_.useState)(false);
    const [transactionStatus, setTransactionStatus] = (0,external_react_.useState)(null);
    const [transactionError, setTransactionError] = (0,external_react_.useState)("");
    const [txId, setTxId] = (0,external_react_.useState)(null);
    const [client, setClient] = (0,external_react_.useState)(null);
    const wcSetup = (0,external_react_.useCallback)(async (appTitle, iconUrl)=>{
        try {
            const DEFAULT_APP_METADATA = {
                name: appTitle,
                description: appTitle,
                url: window.location.origin,
                icons: [
                    iconUrl
                ]
            };
            const { FclWcServicePlugin , client  } = await (0,fcl_wc_.init)({
                projectId: "12ed93a2aae83134c4c8473ca97d9399",
                metadata: DEFAULT_APP_METADATA,
                includeBaseWC: true
            });
            setClient(client);
            fcl_.pluginRegistry.add(FclWcServicePlugin);
        } catch (e) {
            throw e;
        }
    }, []);
    (0,external_react_.useEffect)(()=>{
        const { flowNetwork , accessApi , walletDiscovery , walletDiscoveryApi , walletDiscoveryInclude , addresses  } = NETWORK;
        const iconUrl = window.location.origin + "/images/wallet-icon.png";
        const appTitle = process.env.NEXT_PUBLIC_APP_NAME || "Valoropds";
        fcl_.config({
            "app.detail.title": appTitle,
            "app.detail.icon": iconUrl,
            "accessNode.api": accessApi,
            "flow.network": flowNetwork,
            "discovery.wallet": walletDiscovery,
            "discovery.authn.endpoint": walletDiscoveryApi,
            "discovery.authn.include": walletDiscoveryInclude,
            "0xFungibleToken": addresses.FungibleToken,
            "0xFlowToken": addresses.FlowToken,
            "0xNonFungibleToken": addresses.NonFungibleToken,
            "0xMetadataViews": addresses.MetadataViews
        });
        if (!client) {
            wcSetup(appTitle, iconUrl);
        }
    }, []);
    (0,external_react_.useEffect)(()=>fcl_.currentUser.subscribe(setUser), []);
    const connect = (0,external_react_.useCallback)(()=>{
        fcl_.authenticate();
    }, []);
    const logout = (0,external_react_.useCallback)(async ()=>{
        await fcl_.unauthenticate();
        console.log("loggedout");
        router_default().push(routes/* default.HOME */.Z.HOME);
    }, []);
    const executeTransaction = (0,external_react_.useCallback)(async (cadence, args = ()=>[], options = {})=>{
        setTransactionInProgress(true);
        setTransactionStatus(-1);
        const transactionId = await fcl_.mutate({
            cadence,
            args,
            limit: options.limit || 50
        }).catch((e)=>{
            setTransactionInProgress(false);
            setTransactionStatus(500);
            setTransactionError(String(e));
        });
        if (transactionId) {
            setTxId(transactionId);
            fcl_.tx(transactionId).subscribe((res)=>{
                setTransactionStatus(res.status);
                setTransactionInProgress(false);
            });
        }
    }, []);
    const executeScript = (0,external_react_.useCallback)(async (cadence, args = ()=>[])=>{
        try {
            return await fcl_.query({
                cadence: cadence,
                args
            });
        } catch (error) {
            console.error(error);
        }
    }, []);
    const providerProps = (0,external_react_.useMemo)(()=>({
            connect,
            logout,
            user,
            executeTransaction,
            executeScript,
            transaction: {
                id: txId,
                inProgress: transactionInProgress,
                status: transactionStatus,
                errorMessage: transactionError
            }
        }), [
        connect,
        logout,
        txId,
        transactionInProgress,
        transactionStatus,
        transactionError,
        executeTransaction,
        executeScript,
        user
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx(Web3Context.Provider, {
        value: {
            ...providerProps
        },
        children: children
    });
};


/***/ })

};
;