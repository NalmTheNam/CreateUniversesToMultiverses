const lS = localStorage
let prestigeRequirement = 1.2e11
const Game = {
  data() {
    return {
      universes: 0,
      autoGenerateUniverses: 0,
      generateUniversesWhenClicked: 0,
      randomGenerateUniversesWhenClicked: {
        begin: 1,
        end: 4
      },
      randomAutoGenerateUniverses: {
        begin: 1,
        end: 9
      },
      percentComplete: [],
      upgrades: [
        {
          name: "Generate 10 universes automatically",
          cost: 250,
          bought: false,
          secret: false
        },
        {
          name: "Generate 1 auto generating universes in 50ms",
          cost: 1500,
          bought: false,
          secret: false
        },
        {
          name: "???",
          cost: 50000,
          bought: false,
          secret: false
        },
        {
          name: "Buff everything...?",
          cost: 500000,
          bought: false,
          secret: false
        },
        {
          name: "Blessing of Hunter (BOH)",
          cost: 7.5e7,
          description: "It buffs almost everything, massively! (Extra description: You got the blessing of Hunter, enjoy the buff.)",
          bought: false,
          secret: false
        },
        {
          name: "Reward of the Developer",
          cost: 1e15,
          description: "Same as BOH, but it buffs so much that the game is unbalanced",
          bought: false,
          secret: false
        },
        {
          name: "The Secrets They are Hiding",
          cost: 1e100,
          description: "You have found the secret upgrade! Gosh, you must be a lifetime of gameplay...!",
          bought: false,
          secret: true
        }
      ],
      prestigePointsGain: 0,
      tabs: [
        {
          name: "Main",
          notEnough: false
        },
        {
          name: "Upgrades",
          notEnough: false
        },
        {
          name: "Prestige",
          notEnough: !this.prestigePoints
        }
      ],
      prestigePoints: 0,
      commafy(num) {
        var str = num.toString().split('.');
        if (str[0].length >= 4) {
          str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        if (str[1] && str[1].length >= 4) {
          str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }
        return str.join('.');
      }
    }
  },
  mounted() {
    for (let i = 1; i < document.getElementsByClassName("tab").length; i++) {
      document.getElementsByClassName("tab")[i].style.display = "none"
    }
    setInterval(() => {
      if (this.upgrades[1].bought)
        this.autoGenerateUniverses += 1

      if (this.upgrades[2].bought)
        this.generateUniversesWhenClicked += 1

      if (this.upgrades[3].bought) {
        this.randomAutoGenerateUniverses.begin += Math.round(Math.random() * 50) - 25
        this.randomAutoGenerateUniverses.end += Math.round(Math.random() * 100) - 10
      }

      if (this.upgrades[4].bought) {
        let rand = Math.round(Math.random() * 100)
        if (rand >= 95) {
          this.universes += 2e7
        }
        this.randomGenerateUniversesWhenClicked.begin += Math.round(Math.random() * 40000) + 10000
        this.randomGenerateUniversesWhenClicked.end += Math.round(Math.random() * 25000) + 75000
      }

      if (this.upgrades[5].bought) {
        let rand = Math.round(Math.random() * 10000)
        if (rand >= 9950) {
          this.universes += 1e17
        }
        this.randomAutoGenerateUniverses.begin += Math.round(Math.random() * 1e10) + 1e5
        this.randomAutoGenerateUniverses.end += Math.round(Math.random() * 9e9) + 1e9
        this.randomGenerateUniversesWhenClicked.begin += Math.round(Math.random() * 500000) + 500000
        this.randomGenerateUniversesWhenClicked.end += Math.round(Math.random() * 2.5e7) + 2.5e7
      }

      if (this.universes >= prestigeRequirement) {
        if (this.prestigePointsGain >= 1) {
          if (this.prestigePointsGain >= 100000)
            prestigeRequirement *= 100
          this.prestigePointsGain *= 1.01
        }
        this.prestigePointsGain = Math.round(this.prestigePointsGain)
        this.prestigePointsGain += 1
        prestigeRequirement *= 1.05
        prestigeRequirement = Math.round(prestigeRequirement)
      }
    }, 50)
    setInterval(() => {
      this.universes += Math.round(Math.random() * this.randomAutoGenerateUniverses.end) + this.randomAutoGenerateUniverses.begin + this.autoGenerateUniverses
    }, 5000)
  },
  methods: {
    increaseUniverses() {
      this.percentComplete.push({
        name: "Increase universes by " + this.commafy(this.randomGenerateUniversesWhenClicked.begin) + "-" + (this.commafy(this.randomGenerateUniversesWhenClicked.end + this.randomGenerateUniversesWhenClicked.begin)),
        percent: 0
      })
      function removeCompletedTasks(index) {
        return this.percentComplete.splice(index, 1)
      }
      this.percentComplete.forEach((c, i) => {
        c.percent = 0
        let interval = setInterval(() => {
          if (c.percent == 100) {
            this.universes += Math.round(Math.random() * this.randomGenerateUniversesWhenClicked.begin) + this.randomGenerateUniversesWhenClicked.end + this.generateUniversesWhenClicked
            this.percentComplete.splice(this.percentComplete.length - 1, 1)
          }
          c.percent++
        }, 10)
      })
    },
    buy(indexNumber) {
      if (!indexNumber)
        this.autoGenerateUniverses += 10
      this.upgrades[indexNumber].bought = true
      this.universes -= this.upgrades[indexNumber].cost
      alert("Bought!")
    },
    switchTabs(indexNumber) {
      for (let i = 0; i < document.getElementsByClassName("tab").length; i++) {
        document.getElementsByClassName("tab")[i].style.display = "none"
      }
      document.getElementsByClassName("tab")[indexNumber].style.display = "block"
    }
  }
}
const vm = Vue.createApp(Game).mount('#game')

for (let [ key, value ] of Object.entries(JSON.parse(lS.gameSave))) {
  vm[key] = value
}

function save() {
  lS.gameSave = JSON.stringify({
    autoGenerateUniverses: vm.autoGenerateUniverses,
    generateUniversesWhenClicked: vm.generateUniversesWhenClicked,
    percentComplete: vm.percentComplete,
    prestigePoints: vm.prestigePoints,
    prestigePointsGain: vm.prestigePointsGain,
    randomAutoGenerateUniverses: vm.randomAutoGenerateUniverses,
    randomGenerateUniversesWhenClicked: vm.randomGenerateUniversesWhenClicked,
    universes: vm.universes
  })
}

setInterval(save, 10000) // this is for everyone to keep progress
// it saves progress 10 seconds