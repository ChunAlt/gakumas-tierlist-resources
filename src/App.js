import './App.css';
import cards from './cards';
import TierList from './components/TierList';
import Weights from './components/Weights';
import SelectedCards from './components/SelectedCards';
import Filters from './components/Filters';
import React from 'react';

const ordinal = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
const type_names = ["Voice", "Dance", "Visual"];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weights: {
                preset: 5,
                statDist: [0, 0, 0],
                idolStats: [80, 80, 80],
                idolMult: [15, 15, 15],
                memStats: [20, 20, 20],
                memMult: [3, 3, 3],
                memPoints: 30,
                statCap: 2000,
                vocalLessons: [800, 4, 4, 0],
                danceLessons: [800, 4, 4, 0],
                visualLessons: [800, 4, 4, 0],
                spBonus20: 1,
                spRate: [5, 5, 5],
                rest: 0,
                gift: 0,
                date: 5,
                shop: 1,
                classroom: 7,
                classroomStats: [80, 80, 80],
                sGuidance: 3,
                replace: 3,
                drink: [12, 2],
                upgrade: [1, 2],
                cardAcq: [5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                delete: [2, 2],
                itemAcq: 5,
                custom: 4,
                hajime: false,
                eventStats: false,
            },

            selectedCards: [
                cards.find((c) => c.id === 30001 && c.limit_break === 0),
                cards.find((c) => c.id === 30002 && c.limit_break === 1),
                cards.find((c) => c.id === 30003 && c.limit_break === 2),
                cards.find((c) => c.id === 30004 && c.limit_break === 3),
                cards.find((c) => c.id === 30005 && c.limit_break === 4),
                cards.find((c) => c.id === 30006 && c.limit_break === 4),
            ],
            availableCards: cards,
        }

        this.onWeightsChanged = this.onWeightsChanged.bind(this);
        this.onCardSelected = this.onCardSelected.bind(this);
        this.onCardRemoved = this.onCardRemoved.bind(this);
        this.onCardsChanged = this.onCardsChanged.bind(this);
        this.onLoadPreset = this.onLoadPreset.bind(this);
    }

    onWeightsChanged(statWeights, generalWeights) {
        let combinedWeights = {...statWeights, ...generalWeights};
        this.setState({weights: combinedWeights});
    }

    onCardSelected(card) {
        if (this.state.selectedCards.length > 5) return;
        let cards = this.state.selectedCards.slice();
        let index = this.state.selectedCards.findIndex((c) => c.id === card.id);

        if (index > -1) {
            cards[index] = card;
        } else {
            cards.push(card);
        }

        this.setState({selectedCards:cards});
    }

    onCardRemoved(card) {
        if (this.state.selectedCards.length === 1) return;
        let cards = this.state.selectedCards.slice();
        let cardIndex = cards.findIndex((c) => c.id === card.id);
        cards.splice(cardIndex, 1);
        this.setState({selectedCards:cards});
    }

    onCardsChanged(cards) {
        this.setState({availableCards: cards});
    }

    onLoadPreset(presetCards) {
        let selectedCards = [];
        for(let i = 0; i < presetCards.length; i++) {
            selectedCards.push(cards.find((c) => c.id === presetCards[i] && c.limit_break === 4));
        }
        this.setState({selectedCards:selectedCards});
    }
    
    render() {
        return (
            <div className="App">
                <h1>Gakuen iDOLM@STER Support Card Tier List</h1>
                <span className="section-explanation">
                    (Last updated: 02/10/2025)<br />
                    This website is a fork of this <a href="https://euophrys.github.io/uma-tiers/">Uma Musume Tier List website</a>.<br />
                    This tier list only considers stats from Support Abilities. It does not consider Signature quality, Card Events, or stats from Produce Items.<br/>
                </span>
                <Weights
                    onChange={this.onWeightsChanged}
                    />
                <SelectedCards
                    selectedCards={this.state.selectedCards}
                    onClick={this.onCardRemoved}
                    onLoadPreset={this.onLoadPreset}
                    weights={this.state.weights}
                    />
                <Filters
                    onCardsChanged={this.onCardsChanged}
                    />
                <TierList 
                    cards={this.state.availableCards}
                    weights={this.state.weights}
                    selectedCards={this.state.selectedCards}
                    cardSelected={this.onCardSelected}
                />
                <div className= "section-explanation">
                    Image sources: <a href="https://gkms.idolism.org/">Hatsuboshi Library</a>, <a href="https://wikiwiki.jp/gakumas/">Gakumas Contest Wiki</a><br />
                    Data sources: <a href="https://gkms.idolism.org/">Hatsuboshi Library</a>, <a href="https://docs.google.com/spreadsheets/d/1yF2dLf2iIrLk7Pufu3CR1Tl1KXMZ9Ey7yC_076B96hU">Lostrian's Support Card Comparison Doc</a>, <a href="https://docs.google.com/spreadsheets/d/10K9HhhjFQqlUB5YGphv2VWJPSFlj_kZESRZ7VWCFK8w">Gakuen iDOLM@STER English Translation Collection</a><br />
                    Translations source: <a href="https://docs.google.com/spreadsheets/d/10K9HhhjFQqlUB5YGphv2VWJPSFlj_kZESRZ7VWCFK8w">Gakuen iDOLM@STER English Translation Collection</a>
                </div>
            </div>
            
        );
    }
}

export default App;
