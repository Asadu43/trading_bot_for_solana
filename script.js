require("dotenv").config();

const apiUrl = `https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&interval=daily&days=7&x_cg_demo_api_key=${process.env.COIN_GECOKO_API_KEY}`;

const apiUrlPrice = `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&x_cg_demo_api_key=${process.env.COIN_GECOKO_API_KEY}`;

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

    }



}


run();