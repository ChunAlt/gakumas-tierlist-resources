import React from 'react';
import SupportCard from './SupportCard';
import { supportCardProperties } from '../constants';
import Select from 'react-select';
import allCards from '../cards';
import FreeIcon from '../icons/utx_ico_obtain_10.png';
import SenseIcon from '../icons/utx_ico_obtain_11.png';
import LogiclIcon from '../icons/utx_ico_obtain_12.png';
import AnomalyIcon from '../icons/utx_ico_obtain_13.png';

const type_to_icon = [
    FreeIcon,
    SenseIcon,
    LogiclIcon,
    AnomalyIcon,
]

class TierList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            dropdownSelections: ["none","none","none"]
        }

        this.onDropdown1Changed = this.onDropdown1Changed.bind(this);
        this.onDropdown2Changed = this.onDropdown2Changed.bind(this);
        this.onDropdown3Changed = this.onDropdown3Changed.bind(this);
        this.onToggleResults = this.onToggleResults.bind(this);
        this.onToggleResults2 = this.onToggleResults2.bind(this);
    }

    onDropdown1Changed(newValue) {
        let newSelections = this.state.dropdownSelections.slice();
        newSelections[0] = newValue.value;
        this.setState({dropdownSelections:newSelections});
    }
    onDropdown2Changed(newValue) {
        let newSelections = this.state.dropdownSelections.slice();
        newSelections[1] = newValue.value;
        this.setState({dropdownSelections:newSelections});
    }
    onDropdown3Changed(newValue) {
        let newSelections = this.state.dropdownSelections.slice();
        newSelections[2] = newValue.value;
        this.setState({dropdownSelections:newSelections});
    }

    onToggleResults(event) {
        this.setState({ show: !this.state.show });
    }

    onToggleResults2(event) {
        this.setState({ show: !this.state.show });
    }

    render() {
        let cards = this.props.cards;
        let selectedNames = this.props.selectedCards.map(card => card.char_name);
        let processedCardsAll = processCards(allCards, this.props.weights, this.props.selectedCards);

        if (this.props.weights.type > -1) {
            cards = cards.filter(e => e.type === this.props.weights.type);
        }

        let processedCards = processCards(cards, this.props.weights, this.props.selectedCards);

        if (processedCards.length === 0) {
            return <div className="tier-list"></div>;
        }

        let rows = [[]];
        let current_row = 0;
        let step = (processedCards[0].score - processedCards[processedCards.length - 1].score) / 7;
        let boundary = processedCards[0].score - step;

        for (let i = 0; i < processedCards.length; i++) {
            while (processedCards[i].score < boundary - 1) {
                rows.push([]);
                current_row++;
                boundary -= step;
            }

            rows[current_row].push((
                <div key = { processedCards[i].id + "LB" + processedCards[i].lb } className="support-card">

                    <SupportCard
                        id={processedCards[i].id}
                        lb={processedCards[i].lb}
                        score={processedCards[i].score}
                        key={processedCards[i].id + "LB" + processedCards[i].lb}
                        info={processedCards[i].info}
                        charName={processedCards[i].char_name}
                        selected={selectedNames}
                        card={cards.find((c) => c.id === processedCards[i].id && c.limit_break === processedCards[i].lb)}
                        onClick={() => this.props.cardSelected(cards.find((c) => c.id === processedCards[i].id && c.limit_break === processedCards[i].lb))}
                        stats={this.state.dropdownSelections}
                    />
                    <img
                        className="plan-icon"
                        name="plan icon"
                        src={type_to_icon[processedCards[i].info.plan]}
                        title={processedCards[i].info.plan}
                        alt="card type"
                        onClick={() => this.props.cardSelected(cards.find((c) => c.id === processedCards[i].id && c.limit_break === processedCards[i].lb))}
                    />
                </div>
            ));
        }

        let resultValues = processScores(processedCardsAll, this.props.weights, this.props.selectedCards);

        let tiers = [];

        for (let i = 0; i < 7; i++) {
            tiers.push(
                <div className="tier" key={tierNames[i]}>
                    <div className="tier-letter">{tierNames[i]}</div>
                    <div className="tier-images">{rows[i]}</div>
                </div>
            )
        }

        //let count = this.props.selectedCards.filter((c) => c.type == this.props.weights.type).length;
        let dropdownOptions = [{ value: "none", label: "None" }];
        let properties = Object.keys(supportCardProperties).sort();
        for (let i = 0; i < properties.length; i++) {
            dropdownOptions.push({
                value: properties[i],
                label: supportCardProperties[properties[i]].friendly_name
            });
        }

        let voMult = resultValues[0].startingMult[0];
        let daMult = resultValues[0].startingMult[1];
        let viMult = resultValues[0].startingMult[2];
        let voLesson = this.props.weights.vocalLessons[0]
        let daLesson = this.props.weights.danceLessons[0]
        let viLesson = this.props.weights.visualLessons[0]
        let totLesson = voLesson + daLesson + voLesson;

        let lessonMult = (voLesson / totLesson * voMult) + (daLesson / totLesson * daMult) + (viLesson / totLesson * viMult)

        const resultsTable = [
            [resultValues[0].startingStats[0], resultValues[0].startingStats[1], resultValues[0].startingStats[2], resultValues[0].startingStats[0] + resultValues[0].startingStats[1] + resultValues[0].startingStats[2]],
            [Math.round(voMult * 10) / 10, Math.round(daMult * 10) / 10, Math.round(viMult * 10) / 10, "Percent gain on all lesson stats: " + Math.round(lessonMult * 10) / 10],
            [Math.round(resultValues[0].finalScore[0]), Math.round(resultValues[0].finalScore[1]), Math.round(resultValues[0].finalScore[2]), Math.round(resultValues[0].finalScore[0]) + Math.round(resultValues[0].finalScore[1]) + Math.round(resultValues[0].finalScore[2])],
        ];

        const rowLabels = ["Starting  Stats", "Stats Multiplier", "Predicted Final Stats"];

        let results = [];

        let statPoints = Math.round(((Math.round(resultValues[0].finalScore[0]) + Math.round(resultValues[0].finalScore[1]) + Math.round(resultValues[0].finalScore[2])) * 2.3) - 0.5);

        let requirements = [18000, 16000, 14500, 13000, 11500];
        let examReq = [0, 0, 0, 0, 0];
        for (let i = 0; i < requirements.length; i++) {
            requirements[i] -= statPoints + 1700
            if (requirements[i] < 1500) {
                examReq[i] = Math.round(requirements[i] * (100 / 30));
            } else if (requirements[i] < 2250) {
                requirements[i] -= 1500;
                examReq[i] = Math.round(5000 + requirements[i] * (100 / 15));
            } else if (requirements[i] < 3050) {
                requirements[i] -= 1500 + 750;
                examReq[i] = Math.round(5000 + 5000 + requirements[i] * (100 / 8));
            } else if (requirements[i] < 3450) {
                requirements[i] -= 1500 + 750 + 800;
                examReq[i] = Math.round(5000 + 5000 + 10000 + requirements[i] * (100 / 4));
            } else if (requirements[i] < 3650) {
                requirements[i] -= 1500 + 750 + 800 + 400;
                examReq[i] = Math.round(5000 + 5000 + 10000 + 10000 + requirements[i] * (100 / 2));
            } else {
                requirements[i] -= 1500 + 750 + 800 + 400 + 200;
                examReq[i] = Math.round(5000 + 5000 + 10000 + 10000 + 10000 + requirements[i] * (100 / 1));
            }
        };

        results.push(
            <div className="weights" key={resultValues[0].finalScore[0]}>
                <div className="weight-row">
                    <button id="results-toggle" type="button" onClick={this.onToggleResults}>{this.state.show ? "Hide Results" : "Show Results"}</button>
                </div>
                {
                    this.state.show &&
                    <>
                        <div className="number-table-container">
                            <div className="number-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Vocal</th>
                                            <th>Dance</th>
                                            <th>Visual</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultsTable.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td><b>{rowLabels[rowIndex]}</b></td>
                                                {row.map((num, colIndex) => (
                                                    <td key={colIndex}>
                                                        {rowIndex === 1 ? `${num}%` : num}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div>
                            Estimated exam score needed for each grade (Hajime): SS+: {examReq[0]}, SS: {examReq[1]}, S+: {examReq[2]}, S: {examReq[3]}, A+: {examReq[4]}
                        </div>
                        <br />
                    </>
                }
            </div>
        );

        return (
            <div className="tier-list">
                <div className="section-explanation">
                    {results}
                </div>
                
                <div className="selectors">
                    <span className="selectLabel">Show Stats:</span>
                    <Select className="select" options={dropdownOptions} onChange={this.onDropdown1Changed} defaultValue={{ value: "none", label: "None" }} />
                    <Select className="select" options={dropdownOptions} onChange={this.onDropdown2Changed} defaultValue={{ value: "none", label: "None" }} />
                    <Select className="select" options={dropdownOptions} onChange={this.onDropdown3Changed} defaultValue={{ value: "none", label: "None" }} />
                </div>
                <span className="label">
                Cards are ordered within tiers, but tiers are relatively arbitrary since I just used the Uma setting.
                </span>
                {tiers}
            </div>
        );
    }
    
}

const tierNames = ['S', 'A', 'B', 'C', 'D', 'E', 'F']
function processCards(cards, weights, selectedCards) {
    
    let processedCards = [];
    selectedCards = selectedCards.slice();
    
    // Calculate some stuff here so we don't have to do it a million times later
    for (let card = 0; card < selectedCards.length; card++) {
        let selectedCard = selectedCards[card];
        selectedCard.index = card;
    }

    for (let i = 0; i < cards.length; i++) {
        let info = {};
        let card = JSON.parse(JSON.stringify(cards[i]));
        card.index = 6;

        // Add starting stats and stats from events
        let score = 0;
        let statGains = card.start_b;

        info.type = card.type;
        info.plan = card.plan;
        info.start_b = card.start_b;
        info.pb = card.pb;
        info.spRate = card.sp_r;
        info.spp = card.spp;

        if (card.type === 0) {
            statGains += card.pb * weights.vocalLessons[0];
        } else if (card.type === 1) {
            statGains += card.pb * weights.danceLessons[0];
        } else {
            statGains += card.pb * weights.visualLessons[0];
        }

        if (card.type === 0) {
            statGains += card.lb * weights.vocalLessons[1];
        } else if (card.type === 1) {
            statGains += card.lb * weights.danceLessons[1];
        } else {
            statGains += card.lb * weights.visualLessons[1];
        }

        if (card.type === 0) {
            statGains += card.sp_lb * weights.vocalLessons[2];
        } else if (card.type === 1) {
            statGains += card.sp_lb * weights.danceLessons[2];
        } else {
            statGains += card.sp_lb * weights.visualLessons[2];
        }

        if (card.type === 0) {
            statGains += card.n_lb * weights.vocalLessons[3];
        } else if (card.type === 1) {
            statGains += card.n_lb * weights.danceLessons[3];
        } else {
            statGains += card.n_lb * weights.visualLessons[3];
        }

        statGains += card.rest_b * weights.rest;
        statGains += card.gift_b * weights.gift;
        statGains += card.date_b * weights.date;
        statGains += card.shop_b * weights.shop;
        statGains += card.class_b * weights.classroom;
        statGains += card.pdb * weights.drink;
        statGains += card.eb;
        
        statGains += card.ub * weights.upgrade.reduce((total, current) => total + current, 0);
        statGains += card.a_ub * weights.upgrade[0];
        statGains += card.m_ub * weights.upgrade[1];

        statGains += card.cb * (weights.cardAcq[0] + weights.cardAcq[1]);
        statGains += card.a_cb * weights.cardAcq[0];
        statGains += card.m_cb * weights.cardAcq[1];
        statGains += card.cond_cb * weights.cardAcq[2];
        statGains += card.conc_cb * weights.cardAcq[3];
        statGains += card.imp_cb * weights.cardAcq[4];
        statGains += card.mot_cb * weights.cardAcq[5];
        statGains += card.pres_cb * weights.cardAcq[6];
        statGains += card.str_cb * weights.cardAcq[7];
        statGains += card.fpp_cb * weights.cardAcq[8];

        statGains += card.delete * (weights.delete[0] + weights.delete[1]);

        if (weights.delete[0] > 2) {
            statGains += card.a_delete * 3;
        } else {
            statGains += card.a_delete * weights.delete[0];
        }
        
        if (weights.delete[1] > 2) {
            statGains += card.m_delete * 3;
        } else {
            statGains += card.m_delete * weights.delete[1];
        }

        // Convert stat gains to score
        score += statGains;

        processedCards.push({
            id: card.id,
            lb: card.limit_break,
            score: score,
            info: info,
            char_name: card.char_name
        })
    }
    processedCards.sort((a, b) => b.score - a.score);
    return processedCards;
}

function processScores(processedCards, weights, selectedCards) {
    selectedCards = selectedCards.slice();
    let startingStats = [0, 0, 0];
    startingStats = startingStats.map((stat, index) => stat + weights.idolStats[index] + weights.memStats[index]);


    let idolMemMult = [0, 0, 0];
    idolMemMult = idolMemMult.map((stat, index) => stat + weights.idolMult[index] + weights.memMult[index]);
    let startingMult = idolMemMult;

    let cardBonus = [0, 0, 0];
    let cardStartBonus = [0, 0, 0];
    let cardMultBonus = [0, 0, 0];

    let spRate = weights.spRate;
    for (let card = 0; card < selectedCards.length; card++) {
        let cardID = selectedCards[card].id;
        let cardLB = selectedCards[card].limit_break
        let type = selectedCards[card].type
        let matchingCards = processedCards.find(processedCards => processedCards.id === cardID && processedCards.lb === cardLB);

        startingStats[type] += matchingCards.info.start_b;
        startingMult[type] += (matchingCards.info.pb * 100);

        spRate += matchingCards.info.spRate;

        cardBonus[type] += matchingCards.score;

        cardStartBonus[type] += matchingCards.info.start_b;
        cardMultBonus[type] += matchingCards.info.pb * weights.vocalLessons[0];
    }

    let examBonus = 0;
    if (weights.hajime === true) {
        examBonus += 50;
    }

    console.log(weights.hajime)
    
    let lessonGain = [(1 + (idolMemMult[0] / 100)) * weights.vocalLessons[0], (1 + (idolMemMult[1] / 100)) * weights.danceLessons[0], (1 + (idolMemMult[2] / 100)) * weights.visualLessons[0]]
    
    let finalScore = startingStats.map((stat, index) => stat + cardBonus[index] + lessonGain[index] + weights.classroomStats[index] + examBonus - cardStartBonus[index] - cardMultBonus[index]);
    let roundedScore = Object.fromEntries(
        Object.entries(finalScore).map(([key, value]) => [key, Math.min(value, weights.statCap)])
    );

    let results = [{
        startingStats: startingStats,
        startingMult: startingMult,
        spRate: spRate,
        cardBonus: cardBonus,
        finalScore: roundedScore,
    }]
    
    return results;
    }
   

export default TierList;