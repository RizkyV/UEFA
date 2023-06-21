function calculateCoefficients() {
    //@TODO IT RUNS 3 TIMES
    //@todo instead of one long fixture array, separate into 3 by league
    console.log('calculating');
    console.log(teams);
    console.log(countries);
    teams.forEach((team) => {
        var currentCountry = countries.find(element => element.name === team.team.country);
        if (team.team.id !== 40) {
           // return;
        }
        var clubPoints = 0;
        var countryPoints = 0;
        console.log('team');
        console.log(team);

        seasons.forEach((season) => {
            console.log('season');
            console.log(season);
            var clubPointsSeason = 0;
            var countryPointsSeason = 0;

            var bonuses = [
                { 'ELCLQF': false },
                { 'SF': false },
                { 'F': false },
                { 'CLGS': false },
                { 'CLR16': false },
                { 'ELR16': false },
                { 'ELGS1': false },
                { 'ELGS2': false },
                { 'ECLGS1': false },
                { 'ECLGS2': false },
                { 'ECLQ1ELIM': false },
                { 'ECLQ2ELIM': false },
                { 'ECLQ3ELIM': false },
                { 'ECLQ4ELIM': false },
                { 'ECLM': false },
                { 'ELM': false },
            ];
            season.fixtures.forEach((fixture) => {
                var points = ptsForFixture(team.team, fixture, bonuses);
                clubPointsSeason += points.clubPts;
                countryPointsSeason += points.countryPts;
            });

            console.log(bonuses);
            if (bonuses.ELCLQF) {
                clubPointsSeason += 1;
            }
            if (bonuses.SF) {
                clubPointsSeason += 1;
            }
            if (bonuses.F) {
                clubPointsSeason += 1;
            }
            if (bonuses.CLGS) {
                clubPointsSeason += 4;
            }
            if (bonuses.CLR16) {
                clubPointsSeason += 5;
            }
            if (bonuses.ELR16) {
                clubPointsSeason += 1;
            }
            if (bonuses.ELGS1) {
                clubPointsSeason += 4;
            }
            if (bonuses.ELGS2) {
                clubPointsSeason += 2;
            }
            if (bonuses.ECLGS1) {
                clubPointsSeason += 2;
            }
            if (bonuses.ECLGS2) {
                clubPointsSeason += 1;
            }

            if(bonuses.ELGSM) {
                if(clubPointsSeason < 3) {
                    clubPointsSeason = 3;
                }
            } else if(bonuses.ECLGSM) {
                if(clubPointsSeason < 2.5) {
                    clubPointsSeason = 2.5;
                }
            }
            
            if(bonuses.ECLQ4ELIM && !bonuses.ELGSM && !bonuses.ECGSLM) {
                clubPointsSeason += 2.5;
            } else if(bonuses.ECLQ3ELIM && !bonuses.ELGSM && !bonuses.ECGSLM) {
                clubPointsSeason += 2;
            } else if(bonuses.ECLQ2ELIM && !bonuses.ELGSM && !bonuses.ECGSLM) {
                clubPointsSeason += 1.5;
            } else if(bonuses.ECLQ1ELIM && !bonuses.ELGSM && !bonuses.ECGSLM) {
                clubPointsSeason += 1;
            }

            console.log('clubPointsSeason');
            console.log(clubPointsSeason);
            clubPoints += clubPointsSeason;
            countryPoints += countryPointsSeason;
        });

        console.log('clubPoints');
        console.log(clubPoints);
        console.log('countryPoints');
        console.log(countryPoints);

        //@todo add entry into array with team, club points, season
        var teamIndex = teamsRanking.findIndex(element => element.team.team.id === team.team.id);
        if(teamsRanking[teamIndex]) {
            countriesRanking[teamIndex].points += clubPoints;
        } else {
            teamsRanking.push({'team': team, 'points': clubPoints});
        }

        //@todo add entry into array with country, country points, season
        var countryIndex = countriesRanking.findIndex(element => element.country.name === currentCountry.name);
        if(countriesRanking[countryIndex]) {
            countriesRanking[countryIndex].points += countryPoints;
        } else {
            countriesRanking.push({'country': currentCountry, 'points': countryPoints});
        }
    })
    teamsRanking = teamsRanking.sort((a, b) => {
        return b.points - a.points; 
    });
    countriesRanking = countriesRanking.sort((a, b) => {
        return b.points - a.points; 
    });
    console.log(teamsRanking);
    console.log(countriesRanking);
    fillTable(teamsRanking);
}

function ptsForFixture(team, fixture, bonuses) {
    var clubPts = 0;
    var countryPts = 0;
    if (isParticipant(team, fixture)) {
        bonuses = checkBonuses(fixture, bonuses);
        console.log(fixture.league.name);
        console.log(fixture.league.round);
        console.log(fixture);
        console.log('participated');
        var clubPtsWin = 2;
        var clubPtsDraw = 1;
        var countryPtsWin = 2;
        var countryPtsDraw = 1;

        if(isHalfCountryPts(fixture)) {
            console.log('half country points');
            clubPtsWin = 0;
            clubPtsDraw = 0;

            countryPtsWin = 1;
            countryPtsDraw = 0.5;
        } else if(isFullCountryPts(fixture)) {
            console.log('full country points');
            clubPtsWin = 0;
            clubPtsDraw = 0;

            countryPtsWin = 2;
            countryPtsDraw = 1;
        }

        if (isHome(team, fixture)) {
            if (fixture.teams.home.winner) {
                console.log('won');
                clubPts += clubPtsWin;
                countryPts += countryPtsWin;
            } else if (fixture.teams.home.winner === null) {
                console.log('drew');
                clubPts += clubPtsDraw;
                countryPts += countryPtsDraw;
            }
        } else {
            if (fixture.teams.away.winner) {
                console.log('won');
                clubPts += clubPtsWin;
                countryPts += countryPtsWin;
            } else if (fixture.teams.away.winner === null) {
                console.log('drew');
                clubPts += clubPtsDraw;
                countryPts += countryPtsDraw;
            }
        }
        console.log(clubPts);
        console.log(countryPts);
    }

    return {'clubPts': clubPts, 'countryPts': countryPts};
}


function isParticipant(team, fixture) {
    if (fixture.teams.home.id === team.id) {
        return true;
    } else if (fixture.teams.away.id === team.id) {
        return true;
    }

    return false;
}

function isHome(team, fixture) {
    if (fixture.teams.home.id === team.id) {
        return true;
    } else if (fixture.teams.away.id === team.id) {
        return false;
    }
}

function isHalfCountryPts(fixture) {
    switch(fixture.league.round) {
        case 'Preliminary Round':
        case '1st Qualifying Round':
        case '2nd Qualifying Round':
        case '3rd Qualifying Round':
        case 'Play-offs':
            return true;
    }

    return false;
}
function isFullCountryPts(fixture) {
    if(fixture.league.name === ECL || fixture.league.name === EL) {
        if(fixture.league.round === 'Knockout Round Play-offs') {
            return true;
        }
    }

    return false;
}

function checkBonuses(fixture, bonuses) {
    /**
     * Bonuses
     */
    if(fixture.league.round === 'Quarter-finals' && (fixture.league.name === EL || fixture.league.name === CL)) {
        bonuses.ELCLQF = true;
    }
    if(fixture.league.round === 'Semi-finals') {
        bonuses.SF = true;
    }
    if(fixture.league.round === 'Final') {
        bonuses.F = true;
    }
    if(fixture.league.name === CL && fixture.league.round.includes('Group')) {
        bonuses.CLGS = true;
    }
    if(fixture.league.name === CL && fixture.league.round === 'Round of 16') {
        bonuses.CLR16 = true;
    }
    if(fixture.league.name === EL && fixture.league.round === 'Round of 16') {
        bonuses.ELR16 = true;
    }

    /**
     * Minimums
     */
    if(fixture.league.name === EL && fixture.league.round.includes('Group')) {
        bonuses.ELGSM = true;
    } else if(fixture.league.name === ECL && fixture.league.round.includes('Group')) {
        bonuses.ECLGSM = true;
    }
    if(fixture.league.name === ECL && fixture.league.round.includes('Play-offs')) {
        bonuses.ECLQ4ELIM = true;
    } else if(fixture.league.name === ECL && fixture.league.round.includes('3rd Qualifying Round')) {
        bonuses.ECLQ3ELIM = true;
    } else if(fixture.league.name === ECL && fixture.league.round.includes('2nd Qualifying Round')) {
        bonuses.ECLQ2ELIM = true;
    } else if(fixture.league.name === ECL && fixture.league.round.includes('1st Qualifying Round')) {
        bonuses.ECLQ1ELIM = true;
    }




    //@todo group finishes
    //@todo group finishes
    //@todo group finishes
    //@todo group finishes
    //@todo group finishes
    //@todo group finishes
    //@todo group finishes

    return bonuses;
}

var CL = 'UEFA Champions League';
var EL = 'UEFA Europa League';
var ECL = 'UEFA Europa Conference League';
var countries = [];
var countriesRanking = [];
var teams = [];
var teamsRanking = []
var fixtures = [];
readLocal();
var seasons = [{ 'season': '2022', 'fixtures': [] }, { 'season': '2021', 'fixtures': [] }, { 'season': '2020', 'fixtures': [] }, { 'season': '2019', 'fixtures': [] }, { 'season': '2018', 'fixtures': [] }]
calculateCoefficients();

/**
 * TO DO:
 * 
 * dropdown with current season
 * default to 2023
 * onchange=load()
 * 
 * write endpoint and just go so i dont have to edit code getWildcard
 * 
 * download necessary button (standings, leagues, teams, countries, fixtures)
 * download them to a specific folder, with correct names
 * 
 * LEAGUE IDS
 * CHAMPIONS LEAGUE - 2
 * EUROPA LEAGUE - 3
 * CONFERENCE LEAGUE - 848 
 *
 * COEFFICIENT POINTS
 * QUALIFYING MATCHES (ONLY FOR COUNTRY):
 * WIN - 1 PTS
 * DRAW - 0.5 PTS
 * 
 * GROUP STAGE ONWARDS:
 * WIN - 2 PTS
 * DRAW - 1 PTS
 * 
 * KNOCKOUT ROUND PLAY-OFFS AFTER EL AND ECL GS AND BEFORE R16 DO NOT COUNT FOR CLUB
 * 
 * BONUS:
 * REACHING QF (BUT NOT ECL), SF, F - 1 PTS
 * QUALIFY CL - 4 PTS
 * QUALIFY CL R16 - 5 PTS
 * QUALIFY EL R16 - 1 PTS
 * WIN EL GROUP - 4 PTS
 * RUNNER UP EL GROUP - 2 PTS
 * WIN ECL GROUP - 2 PTS
 * RUNNER UP ECL GROUP - 1 PTS
 * 
 * QUALIFYING POINTS IF ELIMINATED IN ECL QUALIFYING:
 * ECL-Q1 - 1 PTS
 * ECL-Q2 - 1.5 PTS
 * ECL-Q3 - 2 PTS
 * ECL-Q4 - 2.5 PTS
 * 
 * MINIMUM PTS FOR GROUP STAGES (IF CLUB SCORES LOWER THAN THIS, THEY GET ATLEAST THIS MUCH - IT IS NOT ADDED)
 * ECL - 2.5 PTS
 * EL - 3 PTS
 * 
 * 
 * COUNTRY COEFFICIENT = country pts/number of clubs rounded down to 3 digits
 * COUNTRY RANKING = sum of coefficients over last 5 years
 * 
 * CLUB RANKING = total points or (country rank / 5 rounded down to 3 digits), whichever is highest, 
 * 
 * 
 * Show Club and coefficient (last season coefficient)
 */