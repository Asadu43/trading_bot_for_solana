require("dotenv").config();
const ccxt = require("ccxt");

const apiUrl = `https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&interval=daily&days=7&x_cg_demo_api_key=${process.env.COIN_GECOKO_API_KEY}`;

const apiUrlPrice = `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&x_cg_demo_api_key=${process.env.COIN_GECOKO_API_KEY}`;


const exchange = new ccxt.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
    options: {
        defaultType: 'spot',
        adjustForTimeDifference: true
    },
    urls: {
        api: {
            public: 'https://testnet.binance.vision/api/v3',
            private: 'https://testnet.binance.vision/api/v3',
        }
    }
});


const symbol = "SOL/USD";
const type = "limit";
const side = "buy";
const amount = 1;

const run = async () => {
    let res, resJson;


    res = await fetch(
        apiUrl,
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

    );

    resJson = await res.json();

    resJson.prices.pop();
    const average = resJson.prices.reduce((sum, el) => sum + el[1], 0) / resJson.prices.length;
    console.log(" Price Average", average);


    res = await fetch(
        apiUrlPrice,
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )

    resJson = await res.json();
    console.log(resJson);
    const currentPrice = resJson.solana.usd;
    console.log(currentPrice);


    if (currentPrice > average) {

        const limitPrice = currentPrice & 1.02;

        const params = {
            stopLoss: {
                triggerPrice: currentPrice * 0.9
            },
            takeProfit: {
                triggerPrice: currentPrice * 1.3
            }
        };

        const order = await exchange.createOrder(symbol, type, side, amount, limitPrice, params);
        console.log(`Buy Order Created. ${amount} ${symbol}  - Limit @  ${limitPrice} - Take profit @ ${params.takeProfit}  Stop Loss @ ${params.stopLoss}`);
        console.log(order);



    }




}

run();
// setInterval(run, 86400 * 1000)