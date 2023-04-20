const { expectRevert, constants, expectEvent, time } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');
const Timer = artifacts.require('Timer')
const Lottery = artifacts.require('Lottery')
const LotteryNFT = artifacts.require('LotteryNFT')
const Token = artifacts.require("Token")
contract('LotteryNFT', (accounts) => {
    let timerInstance;
    let lotteryInstance;
    let lotteryNftInstance;
    var sizeOfLottery = 4;
    var maxValidRange = 14;
    var bucketone = 10
    var buckettwo = 20
    var bucketDiscountone = 10
    var bucketDiscounttwo = 20
    var bucketDiscountthree = 50
    var newLottoNfturi = 0
    var Whitexsupply = web3.utils.toWei('1000')
    const owner = accounts[0]
    before(async function () {
        timerInstance = await Timer.new();
        WhitexInstance = await Token.new();
        lotteryInstance = await Lottery.new(
            WhitexInstance.address,
            timerInstance.address,
            sizeOfLottery,
            maxValidRange,
            bucketone,
            buckettwo,
            bucketDiscountone,
            bucketDiscounttwo,
            bucketDiscountthree
        );
        lotteryNftInstance = await LotteryNFT.new(
            newLottoNfturi,
            lotteryInstance.address,
            timerInstance.address
        );
        await lotteryInstance.initialize(
            lotteryNftInstance.address
        );
        await WhitexInstance.transfer(
            lotteryInstance.address,
            Whitexsupply
        );
    })
    describe(`LotteryNFT-createNewLotto by owner`, async () => {
        var distribution = [50, 20, 15, 15]
        var Prize = 1
        var cost = 4
        var _startingTimestamp
        var _closingTimestamp
        it(`LotteryNFT-createNewLotto by owner as genrated lottery id`, async () => {
            _startingTimestamp = await time.latest()
            _closingTimestamp = (await time.latest()).add(time.duration.days(100));
            await lotteryInstance.createNewLotto((distribution), Prize, cost, _startingTimestamp, _closingTimestamp, { from: owner, gasPrice: "0" })
        })
    })
    describe(`LotteryNFT-batchBuyLottoTicket functionalities`, async () => {
        var user = accounts[1]
        var _numberOfTickets = 1
        var _lotteryId = 1
        var closingTimestamp
        var _chosenNumbersForEachTicket = [1, 13, 12, 10]
        var getBasicLottoInfo
        var tokenamount = web3.utils.toWei('10')
        it(`LotteryNFT-batchBuyLottoTicket for the user`, async () => {
            closingTimestamp = await lotteryInstance.getBasicLottoInfo(_lotteryId)
            await WhitexInstance.transfer(user, tokenamount, { from: owner, gasPrice: '0' });
            await WhitexInstance.approve(lotteryInstance.address, tokenamount, { from: user, gasPrice: '0' })
            await lotteryInstance.batchBuyLottoTicket(_lotteryId, _numberOfTickets, _chosenNumbersForEachTicket, { from: user, gasPrice: '0' })
        })
    })
    describe(`LotteryNFT-drawWinningNumbers functionalities by owner`, async () => {
        var _lotteryId = 1
        var user = accounts[1]
        it(`LotteryNFT-drawWinningNumbers Functionalities by owner will be predict the random number`, async () => {
            let currentTime = await lotteryInstance.getCurrentTime();
            futureTime = (await time.latest()).add(time.duration.days(100));
            await lotteryInstance.setCurrentTime(futureTime.toString());
            await lotteryInstance.drawWinningNumbers(1,10)
        })
    })
    describe(`LotteryNFT-claimReward functionality by the users`,async()=>{
        var _lotteryId = 1
        var user = accounts[1]
        it(`LotteryNFT-claimReward function by the user to claim reward`,async()=>{
            await lotteryInstance.claimReward(_lotteryId,_lotteryId,{from:user,gasPrice:'0'})
        })
    })
    describe(`LotteryNFT-withdrawWHX functionality by only owner`,async()=>{
        it(`LotteryNFT-withdrawWHX by only owner`,async()=>{
            await lotteryInstance.withdrawWHX("100",{from:owner,gasPrice:'0'})
        })
    })
})