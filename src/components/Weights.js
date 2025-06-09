import React from 'react';
import NumericInput from 'react-numeric-input';
import VoiceIcon from '../icons/utx_ico_obtain_00.png';
import DanceIcon from '../icons/utx_ico_obtain_01.png';
import VisualIcon from '../icons/utx_ico_obtain_02.png';
import AssistIcon from '../icons/utx_ico_obtain_03.png';
import allPresets from '../presets';
import { lsTest } from '../utils';

function presetState(selectedPreset, prevPreset, dist, vocal, dance, visual, classStats, hajimeStats) {
    return {
        version: 1,
        currentState: "voice",
        presets:true,
        show: false,
        general: {            
            preset: prevPreset,
            statDist: dist,
            idolStats: [80, 80, 80],
            idolMult: [15, 15, 15],
            memStats: [20, 20, 20],
            memMult: [3, 3, 3],
            memPoints: 30,

            statCap: selectedPreset.statCap,
            vocalLessons: vocal,
            danceLessons: dance,
            visualLessons: visual,
            spRate: [5, 5, 5],
            rest: selectedPreset.rest,
            gift: selectedPreset.gift,
            date: selectedPreset.date,
            shop: selectedPreset.shop,
            classroom: selectedPreset.classroom,
            classroomStats: classStats,
            replace: selectedPreset.replace,
            drink: [selectedPreset.drink0, selectedPreset.drink1],
            upgrade: [selectedPreset.upgrade0, selectedPreset.upgrade1],
            cardAcq: [selectedPreset.cardAcq0, selectedPreset.cardAcq1, selectedPreset.cardAcq2, selectedPreset.cardAcq3, selectedPreset.cardAcq4, selectedPreset.cardAcq5, selectedPreset.cardAcq6, selectedPreset.cardAcq7, selectedPreset.cardAcq8],
            delete: [selectedPreset.delete0, selectedPreset.delete1],
            custom: selectedPreset.customs,
            hajime: hajimeStats,
            eventStats: false,
        },
        voice: {
            type: 0,
        },
        dance: {
            type: 1,
        },
        visual: {
            type: 2,
        },
        assist: {
            type: 3,
        },
    }
}

function defaultState() {
    return {
        version: 1,
        currentState: "voice",
        presets: true,
        show: false,
        general: {
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
            spRate: [5, 5, 5],
            rest: 0,
            gift: 0,
            date: 5,
            shop: 1,
            classroom: 7,
            classroomStats: [80, 80, 80],
            replace: 3,
            drink: [12, 2],
            upgrade: [1, 2],
            cardAcq: [5, 6, 5, 0, 5, 0, 5, 0, 0],
            delete: [2, 2],
            custom: 4,
            hajime: false,
            eventStats: false,
        },
        voice: {
            type: 0,
        },
        dance: {
            type: 1,
        },
        visual: {
            type: 2,
        },
        assist: {
            type: 3,
        },
    }
}

class Weights extends React.Component {
    constructor(props) {
        super(props);
        
        this.onSettingChanged = this.onSettingChanged.bind(this);
        this.onGeneralSettingChanged = this.onGeneralSettingChanged.bind(this);
        this.onTypeChanged = this.onTypeChanged.bind(this);
        this.onCapChanged = this.onCapChanged.bind(this);
        this.onMinimumChanged = this.onMinimumChanged.bind(this);
        this.onTogglePresets = this.onTogglePresets.bind(this);
        this.onToggleWeights = this.onToggleWeights.bind(this);
        this.handleStatCapChange = this.handleStatCapChange.bind(this);
        this.onMotivationChanged = this.onMotivationChanged.bind(this);
        this.onStatChange = this.onStatChange.bind(this)

        this.onPreset = this.onPreset.bind(this);

        this.state = defaultState();
        this.props.onChange(this.state[this.state.currentState], this.state.general);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState && prevState !== this.state && lsTest()) {
            window.localStorage.setItem("weights", JSON.stringify(this.state));
        }
    }

    onPreset() {
        let presetIndex = this.state.general.preset;
        let thisPreset = allPresets[presetIndex];
        let statDistTemp = this.state.general.statDist
        const lessonStats = [
            [thisPreset.primaryLessons0, thisPreset.secondaryLessons0, thisPreset.tertiaryLessons0],
            [thisPreset.primaryLessons1, thisPreset.secondaryLessons1, thisPreset.tertiaryLessons1],
            [thisPreset.primaryLessons2, thisPreset.secondaryLessons2, thisPreset.tertiaryLessons2],
            [thisPreset.primaryLessons3, thisPreset.secondaryLessons3, thisPreset.tertiaryLessons3],
        ];
        const classStats = [thisPreset.classroomStats0, thisPreset.classroomStats1, thisPreset.classroomStats2];
        
        const updatedVocalLessons = [];
        const updatedDanceLessons = [];
        const updatedVisualLessons = [];
        const updatedClassroomStats = [];
        for (let i = 0; i < 4; i++) {
            updatedVocalLessons[i] = lessonStats[i][statDistTemp[0]]
            updatedDanceLessons[i] = lessonStats[i][statDistTemp[1]]
            updatedVisualLessons[i] = lessonStats[i][statDistTemp[2]]
        }

        
        for (let i = 0; i < 3; i++) {
            updatedClassroomStats[i] = classStats[statDistTemp[i]]
        }

        let hajimeStats = false;
        if (thisPreset.scenario === 0 || thisPreset.scenario === 1) {
            hajimeStats = true;
        } else {
            hajimeStats = false; 
        }


        let newState = presetState(thisPreset, presetIndex, statDistTemp, updatedVocalLessons, updatedDanceLessons, updatedVisualLessons, updatedClassroomStats, hajimeStats);

        this.setState(newState, () => {
            this.props.onChange(newState[newState.currentState], newState.general);        
           
        });
    }

/*
    onMasterReset() {
        let newState = defaultMasterState();
        let statDistTemp = this.state.general.statDist
        this.setState(newState, () => {
            this.props.onChange(newState[newState.currentState], newState.general);

            this.setState(prevState => {
                // Make shallow copies of arrays to avoid direct mutation
                const updatedClassroomStats = [...prevState.general.classroomStats];
                const updatedVocalLessons = [...prevState.general.vocalLessons];
                const updatedDanceLessons = [...prevState.general.danceLessons];
                const updatedVisualLessons = [...prevState.general.visualLessons];
                //const classStats = [0, 0, 540];
                const lessonStats = [
                    [800, 785, 235],
                    [3, 3, 0],
                    [2, 2, 0],
                    [0, 0, 0],
                ];

                for (let i = 0; i < 4; i++) {
                    updatedVocalLessons[i] = lessonStats[i][statDistTemp[0]]
                }

                for (let i = 0; i < 4; i++) {
                    updatedDanceLessons[i] = lessonStats[i][statDistTemp[1]]
                }

                for (let i = 0; i < 4; i++) {
                    updatedVisualLessons[i] = lessonStats[i][statDistTemp[2]]
                }

                return {
                    general: {
                        ...prevState.general,
                        statDist: statDistTemp,
                        classroomStats: updatedClassroomStats,
                        vocalLessons: updatedVocalLessons,
                        danceLessons: updatedDanceLessons,
                        visualLessons: updatedVisualLessons,
                    }
                };
            });
        }, () => {
        });
    }

    onNIAReset() {
        let newState = defaultNIAState();
        let statDistTemp = this.state.general.statDist
        this.setState(newState, () => {
            this.props.onChange(newState[newState.currentState], newState.general);

            this.setState(prevState => {
                // Make shallow copies of arrays to avoid direct mutation
                const updatedClassroomStats = [...prevState.general.classroomStats];
                const updatedVocalLessons = [...prevState.general.vocalLessons];
                const updatedDanceLessons = [...prevState.general.danceLessons];
                const updatedVisualLessons = [...prevState.general.visualLessons];
                const classStats = [0, 0, 540];
                const lessonStats = [
                    [870, 780, 235],
                    [4, 4, 0],
                    [4, 4, 0],
                    [0, 0, 0],
                ];

                for (let i = 0; i < 3; i++) {
                    updatedClassroomStats[i] = classStats[statDistTemp[i]]
                }

                for (let i = 0; i < 4; i++) {
                    updatedVocalLessons[i] = lessonStats[i][statDistTemp[0]]
                }

                for (let i = 0; i < 4; i++) {
                    updatedDanceLessons[i] = lessonStats[i][statDistTemp[1]]
                }

                for (let i = 0; i < 4; i++) {
                    updatedVisualLessons[i] = lessonStats[i][statDistTemp[2]]
                }

                return {
                    general: {
                        ...prevState.general,
                        statDist: statDistTemp,
                        classroomStats: updatedClassroomStats,
                        vocalLessons: updatedVocalLessons,
                        danceLessons: updatedDanceLessons,
                        visualLessons: updatedVisualLessons,
                    }
                };
            });
        });
    }
*/
    onStatChange = (event) => {
        const {id, value} = event.target
        const [key, indexStr] = id.split(".");
        const index = parseInt(indexStr, 10);
        const newValue = parseInt(value, 10);

        this.setState(prevState => {
            
            const updatedArray = [...prevState.general[key]];
            updatedArray[index] = newValue;

            return {
                general: {
                    ...prevState.general,
                    [key]: updatedArray
                }
            };
        }, () => {
        });
    };

    onPresetChange = (event) => {
        const { id, value } = event.target
        const key = id;
        const newValue = parseInt(value, 10);

        this.setState(prevState => ({
                general: {
                    ...prevState.general,
                    [key]: newValue
                }     
        }), () => {
        });
    };

    onSettingChanged(event, numberString, numberInput) {
        if (!event) return;

        let settings = this.state[this.state.currentState];

        if (typeof event === "number") {
            if (numberInput.id.indexOf('.') > 0) {
                let split = numberInput.id.split('.');
                settings[split[0]][split[1]] = event;
            } else {
                settings[numberInput.id] = event;
            }
        }
        else {
            settings[event.target.id] = !settings[event.target.id];
        }

        let newSettings = {};
        newSettings[this.state.currentState] = settings;
        this.setState(newSettings);

        this.props.onChange(settings, this.state.general);
    }

    onGeneralSettingChanged(event, numberString, numberInput) {
        if (event === 0) { }
        else if (!event) return;

        let settings = this.state.general;

        if (typeof event === "number") {
            if (numberInput.id.indexOf('.') > 0) {
                let split = numberInput.id.split('.');
                settings[split[0]][split[1]] = event;
            } else {
                settings[numberInput.id] = event;
            }
        }
        else {
            settings[event.target.id] = !settings[event.target.id];
        }

        let newSettings = {};
        newSettings.general = settings;
        this.setState(newSettings);

        this.props.onChange(this.state[this.state.currentState], settings);
    }

    onMotivationChanged(event) {
        let settings = this.state.general;
        settings.motivation = event.target.value;
        let newSettings = {};
        newSettings.general = settings;
        this.setState(newSettings);
        this.props.onChange(this.state[this.state.currentState], settings);
    }

    onTypeChanged(event) {
        this.setState({
            currentState: event.target.id
        });

        this.props.onChange(this.state[event.target.id], this.state.general);
    }
    
    onCapChanged(event) {
        let settings = this.state[this.state.currentState];
        settings.cap = event.target.value;
        let newSettings = {};
        newSettings[this.state.currentState] = settings;
        this.setState(newSettings);
        this.props.onChange(settings, this.state.general);
    }

    onMinimumChanged(event) {
        let settings = this.state[this.state.currentState];
        settings.minimum = event.target.value;
        let newSettings = {};
        newSettings[this.state.currentState] = settings;
        this.setState(newSettings);
        this.props.onChange(settings, this.state.general);
    }

    onTogglePresets(event) {
        this.setState({ presets: !this.state.presets });
    }

    onToggleWeights(event) {
        this.setState({show: !this.state.show});
    }

    handleStatCapChange(value) {
        this.setState((prevState) => ({
            general: {
                ...prevState.general,
                statCap: value,
            },
        }))
    }

    arrayEquals(a, b) {
        if (a.length !== b.length) return false;
        return a.every((val, index) => val === b[index]);
    }

    
    
    render() {
        //console.log('test5')
        //console.log(this.state.general.preset)
        /*console.log(this.state.general.statDist[1])
        console.log(this.state.general.statDist[2])*/
        //let processedPresetsAll = processPresets(allPresets)

        return (
            <div className="weights">
                <div className="weight-row">
                    <input id="voice" type="image" className={this.state.currentState == "voice" ? "image-btn selected" : "image-btn"} src={VoiceIcon} onClick={this.onTypeChanged} alt="Voice" />
                    <input id="dance" type="image" className={this.state.currentState == "dance" ? "image-btn selected" : "image-btn"} src={DanceIcon} onClick={this.onTypeChanged} alt="Dance" />
                    <input id="visual" type="image" className={this.state.currentState == "visual" ? "image-btn selected" : "image-btn"} src={VisualIcon} onClick={this.onTypeChanged} alt="Visual" />
                    <input id="assist" type="image" className={this.state.currentState == "assist" ? "image-btn selected" : "image-btn"} src={AssistIcon} onClick={this.onTypeChanged} alt="Assist" />
                </div>

                <div>
                    <button id="presets-toggle" type="button" onClick={this.onTogglePresets}>{this.state.presets ? "Hide Presets" : "Show Presets"}</button>
                </div>
                {
                    this.state.presets &&
                    <div className="preset-box">
                        <div className="weight-row">
                            <div class="section-header">Scenario Presets</div>
                            <div class="section-explanation">
                                Changes settings to typical parameters for selected scenario<br/>
                                    Additional manual adjustments is recommended<br />
                                    <b>Bug: changes do not apply properly until a value in settings is changed</b>
                            </div>
                            <div className="weight-row">
                                <label htmlFor="stat-select">Vocal:</label>
                                <select id="statDist.0" value={this.state.general.statDist[0]} onChange={this.onStatChange}>
                                    <option value={0}>Primary</option>
                                    <option value={1}>Secondary</option>
                                    <option value={2}>Tertiary</option>
                                </select>

                                <label htmlFor="stat-select">Dance:</label>
                                <select id="statDist.1" value={this.state.general.statDist[1]} onChange={this.onStatChange}>
                                    <option value={0}>Primary</option>
                                    <option value={1}>Secondary</option>
                                    <option value={2}>Tertiary</option>
                                </select>

                                <label htmlFor="stat-select">Visual:</label>
                                    <select id="statDist.2" value={this.state.general.statDist[2]} onChange={this.onStatChange}>
                                        <option value={0}>Primary</option>
                                        <option value={1}>Secondary</option>
                                        <option value={2}>Tertiary</option>
                                    </select>

                                    <br />
                                    <br />

                                <label htmlFor="stat-select">Scenario/Route:</label>
                                    <select id="preset" value={this.state.general.preset} onChange={this.onPresetChange}>
                                        <optgroup label="Hajime Pro">
                                            <option value={0}>General</option>
                                        </optgroup>
                                        <optgroup label="Hajime Master">
                                            <option value={1}>3 Gifts + 3 Shops (+45)</option>
                                            <option value={2}>2 Gifts + 4 Shops (+45)</option>
                                        </optgroup>
                                        <optgroup label="NIA Pro">
                                            <option value={3}>General Badge Route</option>
                                        </optgroup>
                                        <optgroup label="NIA Master">
                                            <option value={4}>3 Dates + 2 Gifts + 2 Shops (22 cards)</option>
                                            <option value={5}>3 Gifts + 2 Dates + 2 Shops (22 cards)</option>
                                            <option value={6}>5 Dates + 1 Rest + 1 Shop (22 cards)</option>
                                            <option value={7}>4 Gifts + 3 Shops (35 cards)</option>
                                        </optgroup>
                                    </select>
                                    <button id="reset-weights-Pro" type="button" onClick={this.onPreset}>Set</button>
                            </div>                        
                            
                        </div>
                    </div>
                }


                <br />
                <div className="weight-row">
                    <button id="weights-toggle" type="button" onClick={this.onToggleWeights}>{this.state.show ? "Hide Settings" : "Customise Settings"}</button>
                </div>
                {
                    this.state.show &&
                    <>
                        <div className="section-header">
                            Stat Cap
                            <label for="statCap"></label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="statCap" value={this.state.general.statCap} min={0} max={3000} step={100} />
                        </div>
                        

                        <div className="starting-stats-container">
                            <div className="starting-stats left">
                                <div className="section-header">
                                    Idol Stats
                                </div>
                                <div className="section-subheader">
                                    Starting stats
                                </div>

                                <label for="idolstats.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolStats.0" value={this.state.general.idolStats[0]} min={0} max={1000} step={5} />
                                <label for="idolstats.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolStats.1" value={this.state.general.idolStats[1]} min={0} max={1000} step={5} />
                                <label for="idolstats.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolStats.2" value={this.state.general.idolStats[2]} min={0} max={1000} step={5} />

                                <div className="section-subheader">
                                    Multiplier
                                </div>

                                <label for="idolMult.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolMult.0" value={this.state.general.idolMult[0]} min={0} max={100} step={1} />%
                                <label for="idolMult.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolMult.1" value={this.state.general.idolMult[1]} min={0} max={100} step={1} />%
                                <label for="idolMult.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolMult.2" value={this.state.general.idolMult[2]} min={0} max={100} step={1} />%

                                
                            </div>


                            <div className="starting-stats right">
                                <div className="section-header">
                                    Memory Stats
                                </div>
                                <div className="section-subheader">
                                    Flat Stats
                                </div>

                                <label for="memStats.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memStats.0" value={this.state.general.memStats[0]} min={0} max={200} step={5} />
                                <label for="memStats.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memStats.1" value={this.state.general.memStats[1]} min={0} max={200} step={5} />
                                <label for="memStats.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memStats.2" value={this.state.general.memStats[2]} min={0} max={200} step={5} />
                                <br />
                                <div className="section-subheader">
                                    Multiplier
                                </div>
                                <label for="memMult.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memMult.0" value={this.state.general.memMult[0]} min={0} max={100} step={1} />%
                                <label for="memMult.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memMult.1" value={this.state.general.memMult[1]} min={0} max={100} step={1} />%
                                <label for="memMult.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memMult.2" value={this.state.general.memMult[2]} min={0} max={100} step={1} />%

                                <div className="section-subheader">
                                    P Points
                                </div>

                                <label for="memPoints"></label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memPoints" value={this.state.general.memPoints} min={0} max={200} step={10} />
                            </div>
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">
                                SP Lesson Base Rate
                            </div>
                            <div className="section-explanation">
                                Your idol's base rate for SP Lessons <br />
                                (i.e. <b>0%</b> at Training Lvl 0-1, <b>5%</b> at Training Lvl 2-5, <b>10%</b> at Training Lvl 6)<br />
                                (Seasonal Lim. P-idols get <b>+15%</b> to their main stat at LB1)<br />
                                (FES Lim P-idols get <b>15%</b> SP Rate at Training 6 instead of <b>10%</b>)
                            </div>
                            <label for="spRate.0">Voice</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="spRate.0" value={this.state.general.spRate[0]} min={-100} max={100} step={5} />%
                            <label for="spRate.1">Dance</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="spRate.1" value={this.state.general.spRate[1]} min={-100} max={100} step={5} />%
                            <label for="spRate.2">Visual</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="spRate.2" value={this.state.general.spRate[2]} min={-100} max={100} step={5} />%
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">
                                Routing
                            </div>
                            <div className="section-explanation">
                                Standard Master and NIA routing: <b>6-7 days</b> of Gift/Outing/Shop<br />
                                Standard number of Classrooms/Business: <b>4 days</b> (Master), <b>7 days</b> (NIA)
                            </div>

                            <label for="gift">Gift</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="gift" value={this.state.general.gift} min={0} max={14} step={1} />
                            <label for="date">Outing</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="date" value={this.state.general.date} min={0} max={14} step={1} />
                            <label for="shop">Shop</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="shop" value={this.state.general.shop} min={0} max={14} step={1} />
                            <label for="classroom">Classroom/Business</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroom" value={this.state.general.classroom} min={0} max={14} step={1} />
                            <label for="rest">Rest</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="rest" value={this.state.general.rest} min={0} max={14} step={1} />
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">Classroom Stats</div>
                            <div className="section-explanation">
                                Master Mode Classroom stat gain: <b>25</b>/<b>50</b>, <b>25</b>/<b>50</b>, <b>30</b>/<b>55</b>/<b>80</b>, <b>0</b>/<b>45</b>/<b>110</b><br />
                                NIA Mode Business stat gain: <b>60</b>*3 (term 1), <b>80</b>*2 (term 2), <b>100</b>*2 (term 3)
                            </div>
                            <label for="classroomStats.0">Voice</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroomStats.0" value={this.state.general.classroomStats[0]} min={0} max={1000} step={1} />
                            <label for="classroomStats.1">Dance</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroomStats.1" value={this.state.general.classroomStats[1]} min={0} max={1000} step={1} />
                            <label for="classroomStats.2">Visual</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroomStats.2" value={this.state.general.classroomStats[2]} min={0} max={1000} step={1} />
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">Lesson & Audition Parameters</div>
                            <div className="section-subheader">
                                Note: 'Lessons' is the number of SP, Normal, and Oikomi lessons<br />
                            </div>
                            <div className="section-explanation">
                                Normal Lessons base stat gain: <b>60</b> (Pro Only), <b>60</b>, <b>110</b>, <b>120</b>, <b>150</b> (Classroom: <b>90</b> (Pro Only))<br />
                                SP Lessons base stat gain: <b>90</b>, <b>170</b>, <b>200</b>, <b>220</b><br />
                                Oikomi Lessons stat gain: <b>90+90</b> and <b>165+145</b><br />
                                NIA Lessons stat gain (normal/SP): <b>80</b>/<b>100</b>*2 (term 1), <b>100</b>/<b>120</b>*3 (term 2), <b>120</b>/<b>150</b>*3 (term 3)
                            </div>
                            <div className="section-subheader">
                                Vocal Lessons
                            </div>
                            <label for="vocalLessons.0">Stats</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.0" value={this.state.general.vocalLessons[0]} min={0} max={1800} step={1} />
                            <label for="vocalLessons.1">Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.1" value={this.state.general.vocalLessons[1]} min={0} max={20} step={1} />
                            <label for="vocalLessons.2">SP Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.2" value={this.state.general.vocalLessons[2]} min={0} max={20} step={1} />
                            <label for="vocalLessons.3">Normal Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.3" value={this.state.general.vocalLessons[3]} min={0} max={20} step={1} />
    
                            <div className="section-subheader">
                                Dance Lessons
                            </div>
                            <label for="danceLessons.0">Stats</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.0" value={this.state.general.danceLessons[0]} min={0} max={1800} step={1} />
                            <label for="danceLessons.1">Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.1" value={this.state.general.danceLessons[1]} min={0} max={20} step={1} />
                            <label for="danceLessons.2">SP Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.2" value={this.state.general.danceLessons[2]} min={0} max={20} step={1} />
                            <label for="danceLessons.3">Normal Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.3" value={this.state.general.danceLessons[3]} min={0} max={20} step={1} />

                            <div className="section-subheader">
                                Visual Lessons
                            </div>
                            <label for="visualLessons.0">Stats</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.0" value={this.state.general.visualLessons[0]} min={0} max={1800} step={1} />
                            <label for="visualLessons.1">Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.1" value={this.state.general.visualLessons[1]} min={0} max={20} step={1} />
                            <label for="visualLessons.2">SP Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.2" value={this.state.general.visualLessons[2]} min={0} max={20} step={1} />
                            <label for="visualLessons.3">Normal Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.3" value={this.state.general.visualLessons[3]} min={0} max={20} step={1} />
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">Run Variables</div>
                            <div className="section-explanation">
                                Values that depend on the run<br />
                                (Support card events and Produce Items currently not supported, use Starting or Classroom Stats if needed)
                            </div>
                            <div className="section-subheader">
                                Card Acquisition
                            </div>
                            <label for="cardAcq.0">Active</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.0" value={this.state.general.cardAcq[0]} min={0} max={50} step={1} />
                            <label for="cardAcq.1">Mental</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.1" value={this.state.general.cardAcq[1]} min={0} max={50} step={1} />

                            
                            <br />
                            <label for="cardAcq.2">Good Shape</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.2" value={this.state.general.cardAcq[2]} min={0} max={50} step={1} />
                            <label for="cardAcq.3"><b>Concentration</b></label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.3" value={this.state.general.cardAcq[3]} min={0} max={50} step={1} />
                            <label for="cardAcq.4">Impression</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.4" value={this.state.general.cardAcq[4]} min={0} max={50} step={1} />
                            <label for="cardAcq.5"><b>Motivation</b></label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.5" value={this.state.general.cardAcq[5]} min={0} max={50} step={1} />

                            <br />
                            <label for="cardAcq.6">Preservation</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.6" value={this.state.general.cardAcq[6]} min={0} max={50} step={1} />
                            <label for="cardAcq.7"><b>Strength</b></label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.7" value={this.state.general.cardAcq[7]} min={0} max={50} step={1} />
                            <label for="cardAcq.8"><b>FP Point</b></label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.8" value={this.state.general.cardAcq[8]} min={0} max={50} step={1} />

                            <br />
                            <div>
                                <i>(<b>Bold</b> stats currently have no cards that utilise them)</i>
                            </div>
                            
                            <div className="section-subheader">
                                Card Upgrades
                            </div>
                            <label for="upgrade.0">Active</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="upgrade.0" value={this.state.general.upgrade[0]} min={0} max={50} step={1} />
                            <label for="upgrade.1">Mental</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="upgrade.1" value={this.state.general.upgrade[1]} min={0} max={50} step={1} />

                            <div className="section-subheader">
                                Card Deletes
                            </div>
                            <label for="delete[0]">Active</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="delete.0" value={this.state.general.delete[0]} min={0} max={50} step={1} />
                            <label for="delete[1]">Mental</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="delete.1" value={this.state.general.delete[1]} min={0} max={50} step={1} />

                            <div className="section-subheader">
                                P Drinks
                            </div>
                            <label for="drink[0]">Total Acquisition</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="drink.0" value={this.state.general.drink[0]} min={0} max={50} step={1} />
                            <label for="drink[1]">Exchanged</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="drink.1" value={this.state.general.drink[1]} min={0} max={50} step={1} />

                            <div className="section-subheader">
                                Other
                            </div>

                            <label for="drink">Replacements</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="replace" value={this.state.general.replace} min={0} max={3} step={1} />

                            <label for="drink">Customisations</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="custom" value={this.state.general.custom} min={0} max={20} step={1} />
                            
                        </div>    

                        <div className="weight-row">
                            <input type="checkbox" onChange={this.onGeneralSettingChanged} checked={this.state.general.eventStats} id="eventStats" />
                            <label for="eventStats">Include event stats?</label>
                        </div>

                        <div className="weight-row">
                        <input type="checkbox" onChange={this.onGeneralSettingChanged} checked={this.state.general.hajime} id="hajime" />
                            <label for="hajime">Hajime?</label>
                        </div>
                            



                    </>
                }
            </div>

        );
    }
}


export default Weights;