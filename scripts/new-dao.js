const KarmaTemplate = artifacts.require("KarmaTemplate")
const Token = artifacts.require("Token")

const DAO_ID = "Aragon China DAO"
const TOKEN_OWNER = "0x75B98710D5995AB9992F02492B7568b43133161D"
const NETWORK_ARG = "--network"
const DAO_ID_ARG = "--daoid"

const argValue = (arg, defaultValue) => process.argv.includes(arg) ? process.argv[process.argv.indexOf(arg) + 1] : defaultValue

const network = () => argValue(NETWORK_ARG, "local")
const daoId = () => argValue(DAO_ID_ARG, DAO_ID)

const karmaTemplateAddress = () => {
  if (network() === "rinkeby") {
    const Arapp = require("../arapp")
    return Arapp.environments.rinkeby.address
  } else if (network() === "mainnet") {
    const Arapp = require("../arapp")
    return Arapp.environments.mainnet.address
  } else if (network() === "xdai") {
    const Arapp = require("../arapp")
    return Arapp.environments.xdai.address
  } else {
    const Arapp = require("../arapp_local")
    return Arapp.environments.devnet.address
  }
}

const DAYS = 24 * 60 * 60
const ONE_HUNDRED_PERCENT = 1e18
const ONE_TOKEN = 1e18
const FUNDRAISING_ONE_HUNDRED_PERCENT = 1e6
const FUNDRAISING_ONE_TOKEN = 1e6

// Create dao transaction one config
const ORG_TOKEN_NAME = "Aragon Network China"
const ORG_TOKEN_SYMBOL = "ANC"
const SUPPORT_REQUIRED = 0.5 * ONE_HUNDRED_PERCENT
const MIN_ACCEPTANCE_QUORUM = 0.1 * ONE_HUNDRED_PERCENT
const VOTE_DURATION_BLOCKS = 241920 // ~14 days
const VOTE_BUFFER_BLOCKS = 5760 // 8 hours
const VOTE_EXECUTION_DELAY_BLOCKS = 34560 // 48 hours
const VOTING_SETTINGS = [SUPPORT_REQUIRED, MIN_ACCEPTANCE_QUORUM, VOTE_DURATION_BLOCKS, VOTE_BUFFER_BLOCKS, VOTE_EXECUTION_DELAY_BLOCKS]
const HOLDERS = [
  "0x9ac9c636404C8d46D9eb966d7179983Ba5a3941A",
  "0x6b817156A65615F01949EaE47CC66f2a1f2F2e7D",
  "0x86Fd6Dd41Bad636b5b3b9228BC5642Fa0dF392e8",
  "0xb68F52FE2583b5a568E7E57dc98c69d93821f6e4",
  "0x5887c210D84666eDC59C97CF267524A0A6d06C3e"
]
const STAKES = [
  1000000000000000000000,
  1000000000000000000000,
  1000000000000000000000,
  1000000000000000000000,
  1000000000000000000000
]

// Create dao transaction two config
const TOLLGATE_FEE = ONE_TOKEN * 100
const BLOCKS_PER_YEAR = 31557600 / 5 // seeconds per year divided by 15 (assumes 15 second average block time)
const ISSUANCE_RATE = 60e18 / BLOCKS_PER_YEAR // per Block Inflation Rate
// const DECAY = 9999599 // 3 days halftime. halftime_alpha = (1/2)**(1/t)
const DECAY= 9999799 // 48 hours halftime
const MAX_RATIO = 1000000 // 10 percent
const MIN_THRESHOLD = 0.01 // half a percent
const WEIGHT = MAX_RATIO ** 2 * MIN_THRESHOLD / 10000000 // determine weight based on MAX_RATIO and MIN_THRESHOLD
const CONVICTION_SETTINGS = [DECAY, MAX_RATIO, WEIGHT]

module.exports = async (callback) => {
  try {
    const karmaTemplate = await KarmaTemplate.at(karmaTemplateAddress())

    const createDaoTxOneReceipt = await karmaTemplate.createDaoTxOne(
      ORG_TOKEN_NAME,
      ORG_TOKEN_SYMBOL,
      HOLDERS,
      STAKES,
      VOTING_SETTINGS
    );
    console.log(`Tx One Complete. DAO address: ${createDaoTxOneReceipt.logs.find(x => x.event === "DeployDao").args.dao} Gas used: ${createDaoTxOneReceipt.receipt.gasUsed} `)

    const createDaoTxTwoReceipt = await karmaTemplate.createDaoTxTwo(
      TOLLGATE_FEE,
      ISSUANCE_RATE,
      CONVICTION_SETTINGS
    )
    console.log(`Tx Two Complete. Gas used: ${createDaoTxTwoReceipt.receipt.gasUsed}`)


  } catch (error) {
    console.log(error)
  }
  callback()
}
