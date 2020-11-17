const { ChainId, Token, WETH, Fetcher, Route } = require('@uniswap/sdk');
const request = require("request");


// You might want to return the prices instead of printing
let printPrice = async function(chainId, cwsAddress) {
    const CWS = new Token(chainId, cwsAddress, 18)
    
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await Fetcher.fetchPairData(CWS, WETH[CWS.chainId])    

    const route = new Route([pair], WETH[CWS.chainId])    

    //let cwsToEth = route.midPrice.toSignificant(6); // 201.306    
    let ethToCws = route.midPrice.invert().toSignificant(6); // 0.00496756

    // Fetch the price of 1 eth
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    request(url, function (error, response, body) {
	if (error) {
	    console.error('error:', error); // Print the error if one occurred
	    return
	}

	let priceChart = JSON.parse(body);
	let ethPrice = priceChart.ethereum.usd;
	let cwsPrice = ethPrice * ethToCws;

	
	// Print the response status code if a response was received	
	console.log("statusCode:     ", response && response.statusCode); 
	console.log("ethereum price: ", ethPrice);
	console.log("cws price:      ", cwsPrice.toFixed(4));
    });
};
printPrice(ChainId.RINKEBY, "0x66568A3B2E947fE0Ec630b591302A3E78bFCE117");
