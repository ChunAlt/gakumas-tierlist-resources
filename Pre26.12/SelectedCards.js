import React from 'react';
import VoiceIcon from '../icons/utx_ico_obtain_00.png';
import DanceIcon from '../icons/utx_ico_obtain_01.png';
import VisualIcon from '../icons/utx_ico_obtain_02.png';
import AssistIcon from '../icons/utx_ico_obtain_03.png';

const type_to_icon = [
    VoiceIcon,
    DanceIcon,
    VisualIcon,
    AssistIcon,
]
function SelectedCards(props) {
    let cards = [];
    let signatures = [];
    let spRate = props.weights.spRate.slice();
    let pPoints = props.weights.memPoints;
    let eventMax = 0;

    for (let i = 0; i < props.selectedCards.length; i++) {
        let lit_up = "";
        let dark = "";
        let card = props.selectedCards[i];

        if (card.type === 3) {
            spRate[0] += card.sp_r;
            spRate[1] += card.sp_r;
            spRate[2] += card.sp_r;
        } else {
            spRate[card.type] += card.sp_r;
        }
        pPoints += card.spp;

        for (let j = 0; j < 4; j++) {
            if (j < card.limit_break) {
                lit_up += "◆";
            } else {
                dark += "◆";
            }
        }

        let score = 0;
        let statGains = card.start_b;

        if (card.type === 0) {
            statGains += card.pb * props.weights.vocalLessons[0];
        } else if (card.type === 1) {
            statGains += card.pb * props.weights.danceLessons[0];
        } else {
            statGains += card.pb * props.weights.visualLessons[0];
        }

        if (card.type === 0) {
            statGains += card.lb * props.weights.vocalLessons[1];
        } else if (card.type === 1) {
            statGains += card.lb * props.weights.danceLessons[1];
        } else {
            statGains += card.lb * props.weights.visualLessons[1];
        }

        if (card.type === 0) {
            statGains += card.sp_lb * props.weights.vocalLessons[2];
        } else if (card.type === 1) {
            statGains += card.sp_lb * props.weights.danceLessons[2];
        } else {
            statGains += card.sp_lb * props.weights.visualLessons[2];
        }

        if (card.type === 0) {
            statGains += card.n_lb * props.weights.vocalLessons[3];
        } else if (card.type === 1) {
            statGains += card.n_lb * props.weights.danceLessons[3];
        } else {
            statGains += card.n_lb * props.weights.visualLessons[3];
        }

        if (props.weights.spBonus20 > 3) {
            statGains += card.sp_lb20 * 4;
        } else {
            statGains += card.sp_lb20 * props.weights.spBonus20;
        }

        statGains += card.rest_b * props.weights.rest;
        statGains += card.gift_b * props.weights.gift;
        statGains += card.date_b * props.weights.date;
        statGains += card.shop_b * props.weights.shop;
        statGains += card.class_b * props.weights.classroom;

        if (props.weights.sGuidance > 2) {
            statGains += card.s_guidance * 3;
        } else {
            statGains += card.s_guidance * props.weights.sGuidance;
        }

        statGains += card.drink_acq * props.weights.drink[0];
        statGains += card.drink_buy * props.weights.drink[1];

        statGains += card.eb;

        statGains += card.ub * props.weights.upgrade.reduce((total, current) => total + current, 0);
        statGains += card.a_ub * props.weights.upgrade[0];
        statGains += card.m_ub * props.weights.upgrade[1];

        statGains += card.cb * (props.weights.cardAcq[0] + props.weights.cardAcq[1]);
        statGains += card.a_cb * props.weights.cardAcq[0];
        statGains += card.m_cb * props.weights.cardAcq[1];
        statGains += card.ssr_cb * props.weights.cardAcq[2];
        statGains += card.cond_cb * props.weights.cardAcq[3];
        statGains += card.conc_cb * props.weights.cardAcq[4];
        statGains += card.imp_cb * props.weights.cardAcq[5];
        statGains += card.mot_cb * props.weights.cardAcq[6];
        statGains += card.pres_cb * props.weights.cardAcq[7];
        statGains += card.str_cb * props.weights.cardAcq[8];
        statGains += card.fpp_cb * props.weights.cardAcq[9];
        statGains += card.energy_cb * props.weights.cardAcq[10];

        statGains += card.delete * (props.weights.delete[0] + props.weights.delete[1]);

        if (props.weights.delete[0] > 2) {
            statGains += card.a_delete * 3;
        } else {
            statGains += card.a_delete * props.weights.delete[0];
        }

        if (props.weights.delete[1] > 2) {
            statGains += card.m_delete * 3;
        } else {
            statGains += card.m_delete * props.weights.delete[1];
        }

        if (props.weights.eventStats === true) {
            statGains += card.event;
        }

        if (props.weights.itemAcq > 5) {
            statGains += card.item_acq * 6;
        } else {
            statGains += card.item_acq * props.weights.itemAcq;
        }

        if (props.weights.replace > 2) {
            statGains += card.replace * 3;
        } else {
            statGains += card.replace * props.weights.replace;
        }

        if (props.weights.custom > 5) {
            statGains += card.cust * 6;
        } else {
            statGains += card.cust * props.weights.custom;
        }

        eventMax += card.event;

        // Convert stat gains to score
        score += Math.round(statGains);

        if (card.rarity === 3) {
            cards.push(
                <div key={card.id} className="support-card">
                    <img
                        className="support-card-image"
                        name={card.id}
                        src={process.env.PUBLIC_URL + "/cardImages/support_card_s_" + card.id + ".png"}
                        title={card.char_name}
                        alt={card.id}
                        onClick={() => props.onClick(card)}
                    />
                    <div className="supportTooltip">
                        - {card.ability1}<br />
                        - {card.ability2}<br />
                        - {card.ability3}<br />
                        - {card.ability4}<br />
                        <br />
                        Event 1: {card.event1}<br />
                        Event 2: {card.event2}<br />
                        Event 3: {card.event3}<br />
                    </div>
                    <img
                        className="type-icon"
                        name="type icon"
                        src={type_to_icon[card.type]}
                        title="type"
                        alt="card type"
                        onClick={() => props.onClick(card)}
                    />
                    <span className="limit-breaks">
                        <span className="lb-yes">{lit_up}</span>
                        <span className="lb-no">{dark}</span>
                    </span>
                    <span className="score">
                        {score}
                    </span>
                </div>
            );
        } else {
            cards.push(
                <div key={card.id} className="support-card">
                    <img
                        className="support-card-image"
                        name={card.id}
                        src={process.env.PUBLIC_URL + "/cardImages/support_card_s_" + card.id + ".png"}
                        title={card.char_name}
                        alt={card.id}
                        onClick={() => props.onClick(card)}
                    />
                    <div className="supportTooltip">
                        - {card.ability1}<br />
                        - {card.ability2}<br />
                        - {card.ability3}<br />
                        - {card.ability4}<br />
                        <br />
                        Event 1: {card.event1}<br />
                        Event 2: {card.event2}<br />
                    </div>
                    <img
                        className="type-icon"
                        name="type icon"
                        src={type_to_icon[card.type]}
                        title="type"
                        alt="card type"
                        onClick={() => props.onClick(card)}
                    />
                    <span className="limit-breaks">
                        <span className="lb-yes">{lit_up}</span>
                        <span className="lb-no">{dark}</span>
                    </span>
                    <span className="score">
                        {score}
                    </span>
                </div>
            );
        }

        if (card.rarity === 1) {
            signatures.push(
                <div key={card.id} className="signature">
                    <img
                        className="signature"
                        name={props.id}
                        src={process.env.PUBLIC_URL + "/signatureImages/signature_10000.png"}
                        alt={props.id}
                    />
                    <div className="tooltip">
                        <p>{card.sig_desc}</p>
                    </div>
                </div>
            );
        } else {
            signatures.push(
                <div key={card.id} className="signature">
                    <img
                        className="signature"
                        name={props.id}
                        src={process.env.PUBLIC_URL + "/signatureImages/signature_" + card.id + ".png"}
                        alt={props.id}
                    />
                    <div className="tooltip">
                        <p>{card.sig_desc}</p>
                    </div>
                </div>
            );   
        }
    }

    let spRateMaster = [0, 0, 0];
    let spRateNIA = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        spRateMaster[i] = spRate[i] + 10;
        spRateNIA[i] = spRate[i] + 15;
        if (spRateMaster[i] > 100) {
            spRateMaster[i] = 100
        }
        if (spRateNIA[i] > 100) {
            spRateNIA[i] = 100
        }
    }

    let noSPMaster = [(100 - spRateMaster[0]) / 100, (100 - spRateMaster[1]) / 100, (100 - spRateMaster[2]) / 100];

    let noSPMasterTot = Math.pow(1 - noSPMaster[0] * noSPMaster[1] * noSPMaster[2], 4);
    //console.log(cards.length)
    let spRateMasterRound = Math.round(noSPMasterTot * 10000) / 100;


    let noSPNIA = [(100 - spRateNIA[0]) / 100, (100 - spRateNIA[1]) / 100, (100 - spRateNIA[2]) / 100];
    let spRateNIATot = Math.pow(1 - noSPNIA[0] * noSPNIA[1] * noSPNIA[2], 8);
    //console.log(spRateNIATot)
    let spRateNIARound = Math.round(spRateNIATot * 10000) / 100;
    let eventAverage = Math.round((eventMax/cards.length)*10)/10

    
    return (
        <div className="selected-cards">
            <div className="section-header">Support Deck</div>
            <div className="section-explanation">
                The cards you're using. Click one to remove it, and click one in the tier list to add it.
            </div>
            {cards}
            <br />
            {signatures}
            <div>
                Master - SP Rate: <b>{spRateMaster[0]}%</b>/<b>{spRateMaster[1]}%</b>/<b>{spRateMaster[2]}%</b> - Probability at least 1 SP each week: <b>{spRateMasterRound.toFixed(2)}%</b><br />
                NIA - SP Rate: <b>{spRateNIA[0]}%</b>/<b>{spRateNIA[1]}%</b>/<b>{spRateNIA[2]}%</b> - Probability at least 1 SP each week: <b>{spRateNIARound.toFixed(2)}%</b><br />
                <i>(Base rates can be set to negative to find the probability of runs with, e.g., only Primary/Secondary SP Lessons)</i><br />
                Average gain per stat event: <b>{eventAverage}</b><br />
                Starting P Points: <b>{pPoints}</b>

                
            </div>
            {/*
            <div>
                Examples:
                <button className="btn-preset" onClick={() => props.onLoadPreset([10001, 10002, 10003, 10004, 10005])}>Dance/Voice (4 Gift, 2 Shop)</button>
                <button className="btn-preset" onClick={() => props.onLoadPreset([10001, 10002, 10003, 10004, 10005])}>Dance/Visual (1 Gift, 1 Shop, 4 Rest)</button>
                <button className="btn-preset" onClick={() => props.onLoadPreset([10001, 10002, 10003, 10004, 10005])}>Dance/Visual (1 Gift, 3 Shop)</button>

            </div>
            */}
        </div>
    );
}

export default SelectedCards;